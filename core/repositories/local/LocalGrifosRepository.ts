import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GrifosRepository } from "../GrifosRepository";
import type { Grifo, ReferenciaVersiculo } from "../../types/leitura";
import { comFila } from "./fila";

const CHAVE = "grifos";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<Grifo[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as Grifo[];
  } catch {
    return [];
  }
}

async function salvarTudo(grifos: Grifo[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(grifos));
}

export const localGrifosRepository: GrifosRepository = {
  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const todos = await lerTudo();
    return todos.filter((g) => g.ownerId === ownerId && g.livroSlug === livroSlug && g.capitulo === capitulo);
  },

  async listarTodos(ownerId) {
    const todos = await lerTudo();
    return todos.filter((g) => g.ownerId === ownerId);
  },

  async estaGrifado(ownerId, ref) {
    const todos = await lerTudo();
    return todos.some((g) => g.ownerId === ownerId && mesmaReferencia(g, ref));
  },

  alternar(ownerId, ref, cor) {
    return comFila(CHAVE, async () => {
      const todos = await lerTudo();
      const indice = todos.findIndex((g) => g.ownerId === ownerId && mesmaReferencia(g, ref));

      if (indice !== -1) {
        // Se o grifo já existe e a cor passada for diferente, só atualiza a cor
        if (cor && todos[indice].cor !== cor) {
          todos[indice].cor = cor;
          await salvarTudo(todos);
          return true;
        }
        // Senão (mesma cor ou chamou sem cor explícita), desmarca
        todos.splice(indice, 1);
        await salvarTudo(todos);
        return false;
      }

      todos.push({ ...ref, ownerId, criadoEm: new Date().toISOString(), cor });
      await salvarTudo(todos);
      return true;
    });
  },
};
