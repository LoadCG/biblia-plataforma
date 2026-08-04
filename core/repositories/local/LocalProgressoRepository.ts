import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProgressoRepository } from "../ProgressoRepository";
import type { CapituloLido, ReferenciaCapitulo } from "../../types/leitura";

const CHAVE = "capitulos-lidos";

function mesmaReferencia(a: ReferenciaCapitulo, b: ReferenciaCapitulo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo;
}

async function lerTudo(): Promise<CapituloLido[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  return bruto ? (JSON.parse(bruto) as CapituloLido[]) : [];
}

async function salvarTudo(itens: CapituloLido[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(itens));
}

export const localProgressoRepository: ProgressoRepository = {
  async listarCapitulosLidos(ownerId, livroSlug) {
    const todos = await lerTudo();
    return todos.filter((c) => c.ownerId === ownerId && c.livroSlug === livroSlug);
  },

  async estaLido(ownerId, ref) {
    const todos = await lerTudo();
    return todos.some((c) => c.ownerId === ownerId && mesmaReferencia(c, ref));
  },

  async alternar(ownerId, ref) {
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
  },
};
