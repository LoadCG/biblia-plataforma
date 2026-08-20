import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Perfil, PerfilRepository } from "../PerfilRepository";
import { PERFIL_PADRAO } from "../PerfilRepository";

const CHAVE = "perfil-local";

async function lerTudo(): Promise<Record<string, Perfil>> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return {};
  try {
    return JSON.parse(bruto) as Record<string, Perfil>;
  } catch {
    return {};
  }
}

export const localPerfilRepository: PerfilRepository = {
  async obter(ownerId) {
    const todos = await lerTudo();
    return todos[ownerId] ?? PERFIL_PADRAO;
  },

  async salvar(ownerId, perfil) {
    const todos = await lerTudo();
    todos[ownerId] = perfil;
    await AsyncStorage.setItem(CHAVE, JSON.stringify(todos));
  },
};
