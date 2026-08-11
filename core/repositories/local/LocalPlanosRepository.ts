import type { PlanosRepository, DiaPlanoConcluido } from "../PlanosRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { comFila } from "./fila";

const CHAVE_PLANOS = "biblia_progresso_planos";

async function lerLocal(): Promise<DiaPlanoConcluido[]> {
  const data = await AsyncStorage.getItem(CHAVE_PLANOS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const localPlanosRepository: PlanosRepository = {
  async alternarDiaConcluido(ownerId, planoId, dia) {
    let status = false;
    await comFila(CHAVE_PLANOS, async () => {
      const todos = await lerLocal();
      const index = todos.findIndex(
        (i) => i.planoId === planoId && i.diaConcluido === dia
      );

      if (index !== -1) {
        todos.splice(index, 1);
        status = false;
      } else {
        todos.push({
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

  async listarDiasConcluidos(ownerId, planoId) {
    const todos = await lerLocal();
    return todos
      .filter((i) => i.planoId === planoId)
      .map((i) => i.diaConcluido)
      .sort((a, b) => a - b);
  },

  async obterUltimaConclusao(ownerId, planoId) {
    const todos = await lerLocal();
    const doPlano = todos.filter((i) => i.planoId === planoId);
    if (doPlano.length === 0) return null;
    return doPlano.reduce((maisRecente, atual) => (atual.concluidoEm > maisRecente ? atual.concluidoEm : maisRecente), doPlano[0].concluidoEm);
  },
};
