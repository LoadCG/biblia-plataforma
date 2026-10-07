import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import type { DadosPessoais } from "../util/dadosPessoais";
import type { ReferenciaVersiculo } from "../types/leitura";

async function lerLista<T>(chave: string): Promise<T[]> {
  const bruto = await AsyncStorage.getItem(chave);
  if (bruto === null) return [];
  try {
    const valor: unknown = JSON.parse(bruto);
    if (!Array.isArray(valor)) throw new Error("Formato inválido");
    return valor as T[];
  } catch {
    throw new Error(`Não foi possível preservar os dados locais de ${chave}.`);
  }
}

export async function substituirDadosPessoais(ownerId: string, dados: DadosPessoais): Promise<void> {
  const [grifos, capitulos, notas, livros, pesquisas, salvos, progressoPlanos, sessoes, colecoes, associacoes, perfisBrutos] = await Promise.all([
    lerLista<Record<string, unknown>>("grifos"),
    lerLista<Record<string, unknown>>("capitulos-lidos"),
    lerLista<Record<string, unknown>>("notas"),
    lerLista<Record<string, unknown>>("livros-lidos"),
    lerLista<Record<string, unknown>>("pesquisas-favoritas"),
    lerLista<Record<string, unknown>>("versiculos_salvos"),
    lerLista<Record<string, unknown>>("biblia_progresso_planos"),
    lerLista<Record<string, unknown>>("biblia_sessoes_planos"),
    lerLista<Record<string, unknown>>("colecoes"),
    lerLista<Record<string, unknown>>("colecoes-associacoes"),
    AsyncStorage.getItem("perfil-local"),
  ]);
  let perfis: Record<string, unknown> = {};
  if (perfisBrutos) {
    try {
      const valor: unknown = JSON.parse(perfisBrutos);
      if (!valor || typeof valor !== "object" || Array.isArray(valor)) throw new Error("Formato inválido");
      perfis = valor as Record<string, unknown>;
    } catch {
      throw new Error("Não foi possível preservar os perfis locais.");
    }
  }

  const manterOutroOwner = (itens: Record<string, unknown>[]) => itens.filter((item) => item.ownerId !== ownerId);
  const notasImportadas = dados.notas.flatMap((nota) => {
    const referencias: ReferenciaVersiculo[] = nota.referencias?.length
      ? nota.referencias
      : [{ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo }];
    return referencias.map((ref) => ({
      ownerId, ...ref, texto: nota.texto, criadoEm: nota.criadoEm, atualizadoEm: nota.atualizadoEm,
      ...(nota.grupoId ? { grupoId: nota.grupoId } : {}),
    }));
  });
  const progressoImportado = dados.planos.flatMap((plano) => plano.diasConcluidos.map((diaConcluido) => ({
    ownerId, planoId: plano.planoId, diaConcluido,
    concluidoEm: plano.datasConclusao?.[String(diaConcluido)] ?? dados.exportadoEm,
  })));
  const sessoesImportadas = dados.sessoesPlanos.map((sessao) => ({ ...sessao, ownerId }));
  const idsColecoes = new Map(dados.colecoes.map((colecao) => [colecao.id, randomUUID()]));
  const colecoesImportadas = dados.colecoes.map((colecao) => ({ ...colecao, ownerId, id: idsColecoes.get(colecao.id)! }));
  const associacoesImportadas = dados.associacoesColecoes.map((associacao) => ({
    ...associacao, ownerId, colecaoId: idsColecoes.get(associacao.colecaoId)!,
  }));
  const pares: [string, string][] = [
    ["grifos", JSON.stringify([...manterOutroOwner(grifos), ...dados.grifos.map(({ id: _id, ...item }) => ({ ...item, ownerId }))])],
    ["capitulos-lidos", JSON.stringify([...manterOutroOwner(capitulos), ...dados.capitulosLidos.map(({ id: _id, ...item }) => ({ ...item, ownerId }))])],
    ["notas", JSON.stringify([...manterOutroOwner(notas), ...notasImportadas])],
    ["livros-lidos", JSON.stringify([...manterOutroOwner(livros), ...dados.livrosLidos.map((livroSlug) => ({ ownerId, livroSlug }))])],
    ["pesquisas-favoritas", JSON.stringify([...manterOutroOwner(pesquisas), ...dados.pesquisasFavoritas.map(({ id: _id, ...item }) => ({ ...item, ownerId }))])],
    ["versiculos_salvos", JSON.stringify([...manterOutroOwner(salvos), ...dados.versiculosSalvos.map(({ id: _id, ...item }) => ({ ...item, ownerId }))])],
    ["biblia_progresso_planos", JSON.stringify([...manterOutroOwner(progressoPlanos), ...progressoImportado])],
    ["biblia_sessoes_planos", JSON.stringify([...manterOutroOwner(sessoes), ...sessoesImportadas])],
    ["colecoes", JSON.stringify([...manterOutroOwner(colecoes), ...colecoesImportadas])],
    ["colecoes-associacoes", JSON.stringify([...manterOutroOwner(associacoes), ...associacoesImportadas])],
    ["perfil-local", JSON.stringify({ ...perfis, [ownerId]: dados.perfil })],
  ];

  await AsyncStorage.multiSet(pares);
}
