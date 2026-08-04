import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LivrosLidosRepository } from "../LivrosLidosRepository";
import { comFila } from "./fila";

const CHAVE = "livros-lidos";

type Registro = { ownerId: string; livroSlug: string };

async function lerTudo(): Promise<Registro[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as Registro[];
  } catch {
    return [];
  }
}

async function salvarTudo(itens: Registro[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(itens));
}

export const localLivrosLidosRepository: LivrosLidosRepository = {
  async listar(ownerId) {
    const todos = await lerTudo();
    return todos.filter((r) => r.ownerId === ownerId).map((r) => r.livroSlug);
  },

  async estaLido(ownerId, livroSlug) {
    const todos = await lerTudo();
    return todos.some((r) => r.ownerId === ownerId && r.livroSlug === livroSlug);
  },

  alternar(ownerId, livroSlug) {
    return comFila(CHAVE, async () => {
      const todos = await lerTudo();
      const indice = todos.findIndex((r) => r.ownerId === ownerId && r.livroSlug === livroSlug);

      if (indice !== -1) {
        todos.splice(indice, 1);
        await salvarTudo(todos);
        return false;
      }

      todos.push({ ownerId, livroSlug });
      await salvarTudo(todos);
      return true;
    });
  },
};
