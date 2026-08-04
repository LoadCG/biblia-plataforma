import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GrifosRepository } from "../GrifosRepository";
import type { Grifo, ReferenciaVersiculo } from "../../types/leitura";

const CHAVE = "grifos";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<Grifo[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  return bruto ? (JSON.parse(bruto) as Grifo[]) : [];
}

async function salvarTudo(grifos: Grifo[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(grifos));
}

export const localGrifosRepository: GrifosRepository = {
  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const todos = await lerTudo();
    return todos.filter((g) => g.ownerId === ownerId && g.livroSlug === livroSlug && g.capitulo === capitulo);
  },

  async estaGrifado(ownerId, ref) {
    const todos = await lerTudo();
    return todos.some((g) => g.ownerId === ownerId && mesmaReferencia(g, ref));
  },

  async alternar(ownerId, ref) {
    const todos = await lerTudo();
    const indice = todos.findIndex((g) => g.ownerId === ownerId && mesmaReferencia(g, ref));

    if (indice !== -1) {
      todos.splice(indice, 1);
      await salvarTudo(todos);
      return false;
    }

    todos.push({ ...ref, ownerId, criadoEm: new Date().toISOString() });
    await salvarTudo(todos);
    return true;
  },
};
