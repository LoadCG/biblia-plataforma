import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotasRepository } from "../NotasRepository";
import type { Nota, ReferenciaVersiculo } from "../../types/leitura";
import { comFila } from "./fila";

const CHAVE = "notas";

function mesmaReferencia(a: ReferenciaVersiculo, b: ReferenciaVersiculo) {
  return a.livroSlug === b.livroSlug && a.capitulo === b.capitulo && a.versiculo === b.versiculo;
}

async function lerTudo(): Promise<Nota[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as Nota[];
  } catch {
    return [];
  }
}

async function salvarTudo(notas: Nota[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(notas));
}

export const localNotasRepository: NotasRepository = {
  async buscar(ownerId, ref) {
    const todas = await lerTudo();
    return todas.find((n) => n.ownerId === ownerId && mesmaReferencia(n, ref)) ?? null;
  },

  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    const todas = await lerTudo();
    return todas.filter((n) => n.ownerId === ownerId && n.livroSlug === livroSlug && n.capitulo === capitulo);
  },

  salvar(ownerId, ref, texto) {
    return comFila(CHAVE, async () => {
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
    });
  },

  remover(ownerId, ref) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      await salvarTudo(todas.filter((n) => !(n.ownerId === ownerId && mesmaReferencia(n, ref))));
    });
  },
};
