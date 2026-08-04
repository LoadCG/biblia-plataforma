import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotasRepository } from "../NotasRepository";
import type { Nota, ReferenciaVersiculo } from "../../types/leitura";

const CHAVE = "notas";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<Nota[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  return bruto ? (JSON.parse(bruto) as Nota[]) : [];
}

async function salvarTudo(notas: Nota[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(notas));
}

export const localNotasRepository: NotasRepository = {
  async buscar(ownerId, ref) {
    const todas = await lerTudo();
    return todas.find((n) => n.ownerId === ownerId && mesmaReferencia(n, ref)) ?? null;
  },

  async salvar(ownerId, ref, texto) {
    const todas = await lerTudo();
    const indice = todas.findIndex((n) => n.ownerId === ownerId && mesmaReferencia(n, ref));
    const agora = new Date().toISOString();

    if (indice !== -1) {
      const atualizada: Nota = { ...todas[indice], texto, atualizadoEm: agora };
      todas[indice] = atualizada;
      await salvarTudo(todas);
      return atualizada;
    }

    const nova: Nota = { ...ref, ownerId, texto, criadoEm: agora, atualizadoEm: agora };
    todas.push(nova);
    await salvarTudo(todas);
    return nova;
  },

  async remover(ownerId, ref) {
    const todas = await lerTudo();
    await salvarTudo(todas.filter((n) => !(n.ownerId === ownerId && mesmaReferencia(n, ref))));
  },
};
