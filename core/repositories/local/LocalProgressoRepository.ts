import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProgressoRepository } from "../ProgressoRepository";
import type { CapituloLido, ReferenciaCapitulo } from "../../types/leitura";
import { comFila } from "./fila";

const CHAVE = "capitulos-lidos";

function mesmaReferencia(a: ReferenciaCapitulo, b: ReferenciaCapitulo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo;
}

async function lerTudo(): Promise<CapituloLido[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as CapituloLido[];
  } catch {
    return [];
  }
}

async function salvarTudo(itens: CapituloLido[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(itens));
}

export const localProgressoRepository: ProgressoRepository = {
  async listarCapitulosLidos(ownerId, livroSlug) {
    const todos = await lerTudo();
    return todos.filter((c) => c.ownerId === ownerId && c.livroSlug === livroSlug);
  },

  async listarTodos(ownerId) {
    const todos = await lerTudo();
    return todos.filter((c) => c.ownerId === ownerId);
  },

  async estaLido(ownerId, ref) {
    const todos = await lerTudo();
    return todos.some((c) => c.ownerId === ownerId && mesmaReferencia(c, ref));
  },

  alternar(ownerId, ref) {
    return comFila(CHAVE, async () => {
      const todos = await lerTudo();
      const indice = todos.findIndex((c) => c.ownerId === ownerId && mesmaReferencia(c, ref));

      if (indice !== -1) {
        todos.splice(indice, 1);
        await salvarTudo(todos);
        return false;
      }

      todos.push({ ...ref, ownerId, lidoEm: new Date().toISOString() });
      await salvarTudo(todos);
      return true;
    });
  },

  definirVarios(ownerId, refs, lido) {
    return comFila(CHAVE, async () => {
      const todos = await lerTudo();
      const agora = new Date().toISOString();

      for (const ref of refs) {
        const indice = todos.findIndex((c) => c.ownerId === ownerId && mesmaReferencia(c, ref));
        if (lido && indice === -1) {
          todos.push({ ...ref, ownerId, lidoEm: agora });
        } else if (!lido && indice !== -1) {
          todos.splice(indice, 1);
        }
      }

      await salvarTudo(todos);
    });
  },
};
