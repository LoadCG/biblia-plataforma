import AsyncStorage from "@react-native-async-storage/async-storage";
import type { VersiculosSalvosRepository, VersiculoSalvo } from "../VersiculosSalvosRepository";
import type { ReferenciaVersiculo } from "../../types/leitura";
import { comFila } from "./fila";

const CHAVE = "versiculos_salvos";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<VersiculoSalvo[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as VersiculoSalvo[];
  } catch {
    return [];
  }
}

async function salvarTudo(salvos: VersiculoSalvo[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(salvos));
}

export const localVersiculosSalvosRepository: VersiculosSalvosRepository = {
  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const todos = await lerTudo();
    return todos.filter((s) => s.ownerId === ownerId && s.livroSlug === livroSlug && s.capitulo === capitulo);
  },

  async listarTodos(ownerId) {
    const todos = await lerTudo();
    return todos.filter((s) => s.ownerId === ownerId);
  },

  async estaSalvo(ownerId, ref) {
    const todos = await lerTudo();
    return todos.some((s) => s.ownerId === ownerId && mesmaReferencia(s, ref));
  },

  alternar(ownerId, ref) {
    return comFila(CHAVE, async () => {
      const todos = await lerTudo();
      const indice = todos.findIndex((s) => s.ownerId === ownerId && mesmaReferencia(s, ref));

      if (indice !== -1) {
        todos.splice(indice, 1);
        await salvarTudo(todos);
        return false; // removido
      }

      todos.push({ ...ref, ownerId, salvoEm: new Date().toISOString() });
      await salvarTudo(todos);
      return true; // adicionado
    });
  },
};
