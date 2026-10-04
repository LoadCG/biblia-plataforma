import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotasRepository } from "../NotasRepository";
import type { Nota, ReferenciaVersiculo } from "../../types/leitura";
import { comFila } from "./fila";
import { randomUUID } from "expo-crypto";
import { ConflitoAnotacaoExistente } from "../NotasRepository";
import { chavesReferenciasUnicas, consolidarNotas, criarNotaDeGrupo, incluirReferenciasDoGrupo } from "../notasAgrupamento";

const CHAVE = "notas";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<Nota[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as Nota[];
  } catch {
    return [];
  }
}

async function salvarTudo(notas: Nota[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(notas));
}

export const localNotasRepository: NotasRepository = {
  async buscar(ownerId, ref) {
    const todas = await lerTudo();
    const nota = todas.find((n) => n.ownerId === ownerId && mesmaReferencia(n, ref));
    if (!nota) return null;
    return incluirReferenciasDoGrupo(nota.grupoId ? todas.filter((n) => n.ownerId === ownerId && n.grupoId === nota.grupoId) : [nota])[0] ?? null;
  },

  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const todas = await lerTudo();
    return incluirReferenciasDoGrupo(todas.filter((n) => n.ownerId === ownerId && n.livroSlug === livroSlug && n.capitulo === capitulo));
  },

  async listarTodas(ownerId) {
    const todas = await lerTudo();
    return consolidarNotas(todas.filter((n) => n.ownerId === ownerId));
  },

  salvar(ownerId, ref, texto) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      const indice = todas.findIndex((n) => n.ownerId === ownerId && mesmaReferencia(n, ref));
      const agora = new Date().toISOString();

      if (indice !== -1) {
        const existente = todas[indice];
        const atualizadas = existente.grupoId
          ? todas.map((nota) => nota.ownerId === ownerId && nota.grupoId === existente.grupoId ? { ...nota, texto, atualizadoEm: agora } : nota)
          : todas.map((nota, i) => i === indice ? { ...nota, texto, atualizadoEm: agora } : nota);
        await salvarTudo(atualizadas);
        const doGrupo = existente.grupoId
          ? atualizadas.filter((nota) => nota.ownerId === ownerId && nota.grupoId === existente.grupoId)
          : [atualizadas[indice]];
        return incluirReferenciasDoGrupo(doGrupo)[0];
      }

      const nova: Nota = { ...ref, ownerId, texto, criadoEm: agora, atualizadoEm: agora };
      todas.push(nova);
      await salvarTudo(todas);
      return { ...nova, referencias: [ref] };
    });
  },

  salvarVarios(ownerId, refs, texto, grupoId) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      const referencias = chavesReferenciasUnicas(refs);
      if (referencias.length === 0) throw new Error("Selecione pelo menos um versículo para anotar");

      const existentesDoGrupo = grupoId
        ? todas.filter((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId)
        : [];
      const agora = new Date().toISOString();
      const idGrupo = referencias.length > 1 ? grupoId ?? randomUUID() : grupoId;
      if (existentesDoGrupo.length > 0) {
        const refsDoGrupo = new Set(existentesDoGrupo.map((nota) => `${nota.livroSlug}:${nota.capitulo}:${nota.versiculo}`));
        const refsNovas = referencias.filter((ref) => !refsDoGrupo.has(`${ref.livroSlug}:${ref.capitulo}:${ref.versiculo}`));
        const conflitos = refsNovas.filter((ref) => todas.some((nota) => nota.ownerId === ownerId && mesmaReferencia(nota, ref)));
        if (conflitos.length > 0) throw new ConflitoAnotacaoExistente(conflitos);

        const criadoEm = existentesDoGrupo.reduce((maisAntiga, nota) => nota.criadoEm < maisAntiga ? nota.criadoEm : maisAntiga, existentesDoGrupo[0].criadoEm);
        const atualizadas = todas.map((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId ? { ...nota, texto, atualizadoEm: agora } : nota);
        const adicionadas = refsNovas.map((ref): Nota => ({ ...ref, ownerId, grupoId: grupoId!, texto, criadoEm, atualizadoEm: agora }));
        const resultado = [...atualizadas, ...adicionadas];
        await salvarTudo(resultado);
        return incluirReferenciasDoGrupo(resultado.filter((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId))[0];
      }

      const conflitos = referencias.filter((ref) => todas.some((nota) => nota.ownerId === ownerId && mesmaReferencia(nota, ref)));
      if (conflitos.length > 0) {
        const notaExistente = conflitos.length === 1
          ? todas.find((nota) => nota.ownerId === ownerId && mesmaReferencia(nota, conflitos[0]))
          : null;
        if (!grupoId && idGrupo && notaExistente && !notaExistente.grupoId) {
          const atualizadas = todas.map((nota) => nota === notaExistente ? { ...nota, texto, grupoId: idGrupo, atualizadoEm: agora } : nota);
          const adicionadas = referencias
            .filter((ref) => !mesmaReferencia(ref, notaExistente))
            .map((ref): Nota => ({ ...ref, ownerId, grupoId: idGrupo, texto, criadoEm: notaExistente.criadoEm, atualizadoEm: agora }));
          const resultado = [...atualizadas, ...adicionadas];
          await salvarTudo(resultado);
          return incluirReferenciasDoGrupo(resultado.filter((nota) => nota.ownerId === ownerId && nota.grupoId === idGrupo))[0];
        }
        throw new ConflitoAnotacaoExistente(conflitos);
      }

      const notasNovas = referencias.map((ref): Nota => ({
        ...ref,
        ownerId,
        ...(idGrupo ? { grupoId: idGrupo } : {}),
        texto,
        criadoEm: agora,
        atualizadoEm: agora,
      }));
      await salvarTudo([...todas, ...notasNovas]);
      return criarNotaDeGrupo(ownerId, idGrupo, referencias, texto, agora);
    });
  },

  salvarGrupo(ownerId, grupoId, texto) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      const doGrupo = todas.filter((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId);
      if (doGrupo.length === 0) throw new Error("A anotação compartilhada não foi encontrada");
      const agora = new Date().toISOString();
      const atualizadas = todas.map((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId ? { ...nota, texto, atualizadoEm: agora } : nota);
      await salvarTudo(atualizadas);
      return incluirReferenciasDoGrupo(atualizadas.filter((nota) => nota.ownerId === ownerId && nota.grupoId === grupoId))[0];
    });
  },

  remover(ownerId, ref) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      const nota = todas.find((n) => n.ownerId === ownerId && mesmaReferencia(n, ref));
      if (nota?.grupoId) {
        await salvarTudo(todas.filter((n) => !(n.ownerId === ownerId && n.grupoId === nota.grupoId)));
        return;
      }
      await salvarTudo(todas.filter((n) => !(n.ownerId === ownerId && mesmaReferencia(n, ref))));
    });
  },
};
