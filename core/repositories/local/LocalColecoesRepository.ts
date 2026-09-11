import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import type { AssociacaoColecao, Colecao, ColecoesRepository } from "../ColecoesRepository";
import { comFila } from "./fila";

const CHAVE = "colecoes";
const CHAVE_ASSOCIACOES = "colecoes-associacoes";
async function ler<T>(chave: string): Promise<T[]> { try { return JSON.parse((await AsyncStorage.getItem(chave)) ?? "[]") as T[]; } catch { return []; } }

export const localColecoesRepository: ColecoesRepository = {
  async listar(ownerId) { return (await ler<Colecao>(CHAVE)).filter((item) => item.ownerId === ownerId).sort((a, b) => a.nome.localeCompare(b.nome)); },
  async criar(ownerId, nome, cor) {
    const agora = new Date().toISOString();
    const colecao: Colecao = { id: randomUUID(), ownerId, nome: nome.trim(), cor, criadoEm: agora, atualizadoEm: agora };
    await comFila(CHAVE, async () => { const itens = await ler<Colecao>(CHAVE); itens.push(colecao); await AsyncStorage.setItem(CHAVE, JSON.stringify(itens)); });
    return colecao;
  },
  async renomear(ownerId, id, nome) { await comFila(CHAVE, async () => { const itens = await ler<Colecao>(CHAVE); const item = itens.find((c) => c.ownerId === ownerId && c.id === id); if (item) { item.nome = nome.trim(); item.atualizadoEm = new Date().toISOString(); } await AsyncStorage.setItem(CHAVE, JSON.stringify(itens)); }); },
  async remover(ownerId, id) {
    await comFila(CHAVE, async () => AsyncStorage.setItem(CHAVE, JSON.stringify((await ler<Colecao>(CHAVE)).filter((c) => !(c.ownerId === ownerId && c.id === id)))));
    await comFila(CHAVE_ASSOCIACOES, async () => AsyncStorage.setItem(CHAVE_ASSOCIACOES, JSON.stringify((await ler<AssociacaoColecao>(CHAVE_ASSOCIACOES)).filter((a) => !(a.ownerId === ownerId && a.colecaoId === id)))));
  },
  async listarAssociacoes(ownerId) { return (await ler<AssociacaoColecao>(CHAVE_ASSOCIACOES)).filter((item) => item.ownerId === ownerId); },
  async associar(ownerId, colecaoId, itemChaves) { await comFila(CHAVE_ASSOCIACOES, async () => { const itens = await ler<AssociacaoColecao>(CHAVE_ASSOCIACOES); for (const itemChave of itemChaves) if (!itens.some((a) => a.ownerId === ownerId && a.colecaoId === colecaoId && a.itemChave === itemChave)) itens.push({ ownerId, colecaoId, itemChave }); await AsyncStorage.setItem(CHAVE_ASSOCIACOES, JSON.stringify(itens)); }); },
  async desassociar(ownerId, colecaoId, itemChaves) { await comFila(CHAVE_ASSOCIACOES, async () => AsyncStorage.setItem(CHAVE_ASSOCIACOES, JSON.stringify((await ler<AssociacaoColecao>(CHAVE_ASSOCIACOES)).filter((a) => !(a.ownerId === ownerId && a.colecaoId === colecaoId && itemChaves.includes(a.itemChave)))))); },
  async apagarTudo(ownerId) {
    await comFila(CHAVE, async () => {
      const colecoes = await ler<Colecao>(CHAVE);
      await AsyncStorage.setItem(CHAVE, JSON.stringify(colecoes.filter((colecao) => colecao.ownerId !== ownerId)));
    });
    await comFila(CHAVE_ASSOCIACOES, async () => {
      const associacoes = await ler<AssociacaoColecao>(CHAVE_ASSOCIACOES);
      await AsyncStorage.setItem(
        CHAVE_ASSOCIACOES,
        JSON.stringify(associacoes.filter((associacao) => associacao.ownerId !== ownerId)),
      );
    });
  },
};
