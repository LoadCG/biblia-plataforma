import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PesquisasFavoritasRepository } from "../PesquisasFavoritasRepository";
import type { PesquisaFavorita } from "../../types/leitura";
import { comFila } from "./fila";

const CHAVE = "pesquisas-favoritas";

async function lerTudo(): Promise<PesquisaFavorita[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    return JSON.parse(bruto) as PesquisaFavorita[];
  } catch {
    return [];
  }
}

async function salvarTudo(itens: PesquisaFavorita[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(itens));
}

function normalizarTermo(termo: string): string {
  return termo.trim().toLowerCase();
}

export const localPesquisasFavoritasRepository: PesquisasFavoritasRepository = {
  async listarTodas(ownerId) {
    const todas = await lerTudo();
    return todas.filter((p) => p.ownerId === ownerId);
  },

  async estaFavoritada(ownerId, termo) {
    const todas = await lerTudo();
    const alvo = normalizarTermo(termo);
    return todas.some((p) => p.ownerId === ownerId && normalizarTermo(p.termo) === alvo);
  },

  alternar(ownerId, termo) {
    return comFila(CHAVE, async () => {
      const todas = await lerTudo();
      const alvo = normalizarTermo(termo);
      const indice = todas.findIndex((p) => p.ownerId === ownerId && normalizarTermo(p.termo) === alvo);

      if (indice !== -1) {
        todas.splice(indice, 1);
        await salvarTudo(todas);
        return false;
      }

      todas.push({ ownerId, termo: termo.trim(), criadoEm: new Date().toISOString() });
      await salvarTudo(todas);
      return true;
    });
  },
};
