import type { NotasRepository } from "../NotasRepository";
import { ConflitoAnotacaoExistente } from "../NotasRepository";
import { chavesReferenciasUnicas, consolidarNotas, criarNotaDeGrupo, incluirReferenciasDoGrupo } from "../notasAgrupamento";
import type { Nota, ReferenciaVersiculo } from "../../types/leitura";
import { randomUUID } from "expo-crypto";
import { db } from "../../db/database";

async function buscarNotasDoGrupo(ownerId: string, grupoId: string): Promise<Nota[]> {
  return db.getAllAsync<Nota>(`SELECT * FROM notas WHERE ownerId = ? AND grupoId = ? ORDER BY livroSlug, capitulo, versiculo`, [ownerId, grupoId]);
}

async function buscarReferencia(ownerId: string, ref: ReferenciaVersiculo): Promise<Nota | null> {
  return db.getFirstAsync<Nota>(
    `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
    [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
  );
}

export const sqliteNotasRepository: NotasRepository = {
  async buscar(ownerId, ref) {
    const nota = await buscarReferencia(ownerId, ref);
    if (!nota) return null;
    const linhas = nota.grupoId ? await buscarNotasDoGrupo(ownerId, nota.grupoId) : [nota];
    return incluirReferenciasDoGrupo(linhas).find((linha) => linha.versiculo === nota.versiculo && linha.capitulo === nota.capitulo && linha.livroSlug === nota.livroSlug) ?? null;
  },

  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const notas = await db.getAllAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, livroSlug, capitulo]
    );
    const todas = await db.getAllAsync<Nota>(`SELECT * FROM notas WHERE ownerId = ? ORDER BY livroSlug, capitulo, versiculo`, [ownerId]);
    const porReferencia = new Map<string, Nota>(incluirReferenciasDoGrupo(todas).map((nota) =>
      [`${nota.livroSlug}:${nota.capitulo}:${nota.versiculo}`, nota] as [string, Nota]
    ));
    return notas.map((nota) => porReferencia.get(`${nota.livroSlug}:${nota.capitulo}:${nota.versiculo}`) ?? nota);
  },

  async listarTodas(ownerId) {
    const notas = await db.getAllAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? ORDER BY livroSlug, capitulo, versiculo`,
      [ownerId]
    );
    return consolidarNotas(notas);
  },

  async salvar(ownerId, ref, texto) {
    const existente = await buscarReferencia(ownerId, ref);
    if (existente?.grupoId) return this.salvarGrupo(ownerId, existente.grupoId, texto);

    const agora = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm, atualizadoEm, grupoId)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
       ON CONFLICT(ownerId, livroSlug, capitulo, versiculo)
       DO UPDATE SET texto = excluded.texto, atualizadoEm = excluded.atualizadoEm, grupoId = NULL`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, agora, agora]
    );

    const nota = await buscarReferencia(ownerId, ref);
    if (!nota) throw new Error("Não foi possível recuperar a anotação salva");
    return { ...nota, referencias: [ref] };
  },

  async salvarVarios(ownerId, refs, texto, grupoId) {
    const referencias = chavesReferenciasUnicas(refs);
    if (referencias.length === 0) throw new Error("Selecione pelo menos um versículo para anotar");
    const idGrupo = referencias.length > 1 ? grupoId ?? randomUUID() : grupoId;

    await db.withTransactionAsync(async () => {
      if (grupoId) {
        const grupoExistente = await buscarNotasDoGrupo(ownerId, grupoId);
        if (grupoExistente.length > 0) {
          const refsDoGrupo = new Set(grupoExistente.map((nota) => `${nota.livroSlug}:${nota.capitulo}:${nota.versiculo}`));
          const refsNovas = referencias.filter((ref) => !refsDoGrupo.has(`${ref.livroSlug}:${ref.capitulo}:${ref.versiculo}`));
          const conflitos: ReferenciaVersiculo[] = [];
          for (const ref of refsNovas) {
            const existente = await buscarReferencia(ownerId, ref);
            if (existente) conflitos.push(ref);
          }
          if (conflitos.length > 0) throw new ConflitoAnotacaoExistente(conflitos);

          const agora = new Date().toISOString();
          const criadoEm = grupoExistente.reduce((maisAntiga, nota) => nota.criadoEm < maisAntiga ? nota.criadoEm : maisAntiga, grupoExistente[0].criadoEm);
          await db.runAsync(
            `UPDATE notas SET texto = ?, atualizadoEm = ? WHERE ownerId = ? AND grupoId = ?`,
            [texto, agora, ownerId, grupoId]
          );
          for (const ref of refsNovas) {
            await db.runAsync(
              `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm, atualizadoEm, grupoId)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, criadoEm, agora, grupoId]
            );
          }
          return;
        }
      }

      const conflitos: { ref: ReferenciaVersiculo; nota: Nota }[] = [];
      for (const ref of referencias) {
        const existente = await buscarReferencia(ownerId, ref);
        if (existente) conflitos.push({ ref, nota: existente });
      }
      if (conflitos.length > 0) {
        const notaExistente = conflitos.length === 1 ? conflitos[0].nota : null;
        if (!grupoId && idGrupo && notaExistente && !notaExistente.grupoId) {
          const agora = new Date().toISOString();
          await db.runAsync(
            `UPDATE notas SET texto = ?, atualizadoEm = ?, grupoId = ? WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
            [texto, agora, idGrupo, ownerId, notaExistente.livroSlug, notaExistente.capitulo, notaExistente.versiculo]
          );
          for (const ref of referencias.filter((item) =>
            item.livroSlug !== notaExistente.livroSlug || item.capitulo !== notaExistente.capitulo || item.versiculo !== notaExistente.versiculo
          )) {
            await db.runAsync(
              `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm, atualizadoEm, grupoId)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, notaExistente.criadoEm, agora, idGrupo]
            );
          }
          return;
        }
        throw new ConflitoAnotacaoExistente(conflitos.map((conflito) => conflito.ref));
      }

      const agora = new Date().toISOString();
      for (const ref of referencias) {
        await db.runAsync(
          `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm, atualizadoEm, grupoId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, agora, agora, idGrupo ?? null]
        );
      }
    });

    const notas = idGrupo ? await buscarNotasDoGrupo(ownerId, idGrupo) : [await buscarReferencia(ownerId, referencias[0])].filter((nota): nota is Nota => nota !== null);
    const anotacao = incluirReferenciasDoGrupo(notas)[0];
    if (!anotacao) throw new Error("Não foi possível recuperar a anotação salva");
    return anotacao;
  },

  async salvarGrupo(ownerId, grupoId, texto) {
    const resultado = await db.runAsync(
      `UPDATE notas SET texto = ?, atualizadoEm = ? WHERE ownerId = ? AND grupoId = ?`,
      [texto, new Date().toISOString(), ownerId, grupoId]
    );
    if (resultado.changes === 0) throw new Error("A anotação compartilhada não foi encontrada");
    const notas = await buscarNotasDoGrupo(ownerId, grupoId);
    if (notas.length === 0) throw new Error("Não foi possível recuperar a anotação salva");
    return incluirReferenciasDoGrupo(notas)[0];
  },

  async remover(ownerId, ref) {
    const nota = await buscarReferencia(ownerId, ref);
    if (nota?.grupoId) {
      await db.runAsync(`DELETE FROM notas WHERE ownerId = ? AND grupoId = ?`, [ownerId, nota.grupoId]);
    } else {
      await db.runAsync(
        `DELETE FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
        [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
      );
    }
  },
};
