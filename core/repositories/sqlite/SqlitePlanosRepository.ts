import type { PlanosRepository, DiaPlanoConcluido, SessaoPlano, ConclusaoPlanoExportada } from "../PlanosRepository";
import { db } from "../../db/database";

export const sqlitePlanosRepository: PlanosRepository = {
  async alternarDiaConcluido(ownerId, planoId, dia) {
    const existente = await db.getFirstAsync<DiaPlanoConcluido>(
      `SELECT * FROM progresso_planos WHERE ownerId = ? AND planoId = ? AND diaConcluido = ?`,
      [ownerId, planoId, dia]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM progresso_planos WHERE ownerId = ? AND planoId = ? AND diaConcluido = ?`, [
        ownerId,
        planoId,
        dia,
      ]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO progresso_planos (ownerId, planoId, diaConcluido, concluidoEm) VALUES (?, ?, ?, ?)`,
      [ownerId, planoId, dia, new Date().toISOString()]
    );
    return true;
  },

  async definirDiaConcluido(ownerId, planoId, dia, concluido) {
    if (!concluido) {
      await db.runAsync(`DELETE FROM progresso_planos WHERE ownerId = ? AND planoId = ? AND diaConcluido = ?`, [ownerId, planoId, dia]);
      return;
    }
    await db.runAsync(
      `INSERT OR IGNORE INTO progresso_planos (ownerId, planoId, diaConcluido, concluidoEm) VALUES (?, ?, ?, ?)`,
      [ownerId, planoId, dia, new Date().toISOString()]
    );
  },

  async listarDiasConcluidos(ownerId, planoId) {
    const resultados = await db.getAllAsync<{ diaConcluido: number }>(
      `SELECT diaConcluido FROM progresso_planos WHERE ownerId = ? AND planoId = ? ORDER BY diaConcluido ASC`,
      [ownerId, planoId]
    );
    return resultados.map((r) => r.diaConcluido);
  },

  async listarConclusoes(ownerId, planoId): Promise<ConclusaoPlanoExportada[]> {
    const registros = await db.getAllAsync<{ diaConcluido: number; concluidoEm: string }>(
      `SELECT diaConcluido, concluidoEm FROM progresso_planos WHERE ownerId = ? AND planoId = ? ORDER BY diaConcluido ASC`,
      [ownerId, planoId]
    );
    return registros.map(({ diaConcluido, concluidoEm }) => ({ dia: diaConcluido, concluidoEm }));
  },

  async obterUltimaConclusao(ownerId, planoId) {
    const resultado = await db.getFirstAsync<{ concluidoEm: string }>(
      `SELECT concluidoEm FROM progresso_planos WHERE ownerId = ? AND planoId = ? ORDER BY concluidoEm DESC LIMIT 1`,
      [ownerId, planoId]
    );
    return resultado?.concluidoEm ?? null;
  },

  async obterSessao(ownerId, planoId, dia) {
    const registro = await db.getFirstAsync<Omit<SessaoPlano, "referenciasConcluidas"> & { referenciasConcluidas: string }>(
      `SELECT * FROM sessoes_planos WHERE ownerId = ? AND planoId = ? AND dia = ?`, [ownerId, planoId, dia]
    );
    if (!registro) return null;
    return { ...registro, referenciasConcluidas: JSON.parse(registro.referenciasConcluidas) as string[] };
  },

  async salvarSessao(ownerId, planoId, dia, indiceAtual, referenciasConcluidas) {
    await db.runAsync(
      `INSERT INTO sessoes_planos (ownerId, planoId, dia, indiceAtual, referenciasConcluidas, atualizadoEm)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(ownerId, planoId, dia) DO UPDATE SET indiceAtual = excluded.indiceAtual,
       referenciasConcluidas = excluded.referenciasConcluidas, atualizadoEm = excluded.atualizadoEm`,
      [ownerId, planoId, dia, indiceAtual, JSON.stringify(referenciasConcluidas), new Date().toISOString()]
    );
  },

  async removerSessao(ownerId, planoId, dia) {
    await db.runAsync(`DELETE FROM sessoes_planos WHERE ownerId = ? AND planoId = ? AND dia = ?`, [ownerId, planoId, dia]);
  },
};
