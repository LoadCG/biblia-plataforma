import type { PlanosRepository, DiaPlanoConcluido, SessaoPlano, ConclusaoPlanoExportada } from "../PlanosRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { comFila } from "./fila";

const CHAVE_PLANOS = "biblia_progresso_planos";
const CHAVE_SESSOES = "biblia_sessoes_planos";

type DiaPlanoLegado = Omit<DiaPlanoConcluido, "ownerId"> & { ownerId?: string };

async function lerSessoes(): Promise<SessaoPlano[]> {
  const data = await AsyncStorage.getItem(CHAVE_SESSOES);
  if (!data) return [];
  try { return JSON.parse(data) as SessaoPlano[]; } catch { return []; }
}

async function lerLocal(): Promise<DiaPlanoLegado[]> {
  const data = await AsyncStorage.getItem(CHAVE_PLANOS);
  if (!data) return [];
  try {
    return JSON.parse(data) as DiaPlanoLegado[];
  } catch {
    return [];
  }
}

async function lerParaOwner(ownerId: string): Promise<DiaPlanoConcluido[]> {
  const itens = await lerLocal();
  if (!itens.some((item) => !item.ownerId)) return itens as DiaPlanoConcluido[];
  const migrados = itens.map((item) => ({ ...item, ownerId: item.ownerId ?? ownerId }));
  await AsyncStorage.setItem(CHAVE_PLANOS, JSON.stringify(migrados));
  return migrados;
}

export const localPlanosRepository: PlanosRepository = {
  async alternarDiaConcluido(ownerId, planoId, dia) {
    let status = false;
    await comFila(CHAVE_PLANOS, async () => {
      const todos = await lerParaOwner(ownerId);
      const index = todos.findIndex(
        (i) => i.ownerId === ownerId && i.planoId === planoId && i.diaConcluido === dia
      );

      if (index !== -1) {
        todos.splice(index, 1);
        status = false;
      } else {
        todos.push({
          ownerId,
          planoId,
          diaConcluido: dia,
          concluidoEm: new Date().toISOString(),
        });
        status = true;
      }
      await AsyncStorage.setItem(CHAVE_PLANOS, JSON.stringify(todos));
    });
    return status;
  },

  async definirDiaConcluido(ownerId, planoId, dia, concluido) {
    await comFila(CHAVE_PLANOS, async () => {
      const todos = await lerParaOwner(ownerId);
      const indice = todos.findIndex((item) => item.ownerId === ownerId && item.planoId === planoId && item.diaConcluido === dia);
      if (concluido && indice === -1) todos.push({ ownerId, planoId, diaConcluido: dia, concluidoEm: new Date().toISOString() });
      if (!concluido && indice !== -1) todos.splice(indice, 1);
      await AsyncStorage.setItem(CHAVE_PLANOS, JSON.stringify(todos));
    });
  },

  async listarDiasConcluidos(ownerId, planoId) {
    const todos = await lerParaOwner(ownerId);
    return todos
      .filter((i) => i.ownerId === ownerId && i.planoId === planoId)
      .map((i) => i.diaConcluido)
      .sort((a, b) => a - b);
  },

  async listarConclusoes(ownerId, planoId): Promise<ConclusaoPlanoExportada[]> {
    return (await lerParaOwner(ownerId))
      .filter((item) => item.ownerId === ownerId && item.planoId === planoId)
      .map((item) => ({ dia: item.diaConcluido, concluidoEm: item.concluidoEm }))
      .sort((a, b) => a.dia - b.dia);
  },

  async obterUltimaConclusao(ownerId, planoId) {
    const todos = await lerParaOwner(ownerId);
    const doPlano = todos.filter((i) => i.ownerId === ownerId && i.planoId === planoId);
    if (doPlano.length === 0) return null;
    return doPlano.reduce((maisRecente, atual) => (atual.concluidoEm > maisRecente ? atual.concluidoEm : maisRecente), doPlano[0].concluidoEm);
  },

  async obterSessao(ownerId, planoId, dia) {
    return (await lerSessoes()).find((item) => item.ownerId === ownerId && item.planoId === planoId && item.dia === dia) ?? null;
  },

  async salvarSessao(ownerId, planoId, dia, indiceAtual, referenciasConcluidas) {
    await comFila(CHAVE_SESSOES, async () => {
      const sessoes = await lerSessoes();
      const nova: SessaoPlano = { ownerId, planoId, dia, indiceAtual, referenciasConcluidas, atualizadoEm: new Date().toISOString() };
      const indice = sessoes.findIndex((item) => item.ownerId === ownerId && item.planoId === planoId && item.dia === dia);
      if (indice === -1) sessoes.push(nova); else sessoes[indice] = nova;
      await AsyncStorage.setItem(CHAVE_SESSOES, JSON.stringify(sessoes));
    });
  },

  async removerSessao(ownerId, planoId, dia) {
    await comFila(CHAVE_SESSOES, async () => {
      const sessoes = await lerSessoes();
      await AsyncStorage.setItem(CHAVE_SESSOES, JSON.stringify(sessoes.filter((item) => !(item.ownerId === ownerId && item.planoId === planoId && item.dia === dia))));
    });
  },
};
