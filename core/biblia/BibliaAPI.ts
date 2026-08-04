// Busca o texto bíblico na bible-api.com (tradução Almeida), com cache
// local — a mesma referência carrega instantâneo da segunda vez.
//
// TODO (ver PLANO-PLATAFORMA.md, Decisão 4): isto ainda fala direto com a
// bible-api.com pelo cliente. O plano é trocar por uma rota de API própria
// (proxy com cache no servidor) antes de escalar o uso — reduz risco do
// rate limit da API (~15 req/30s) e centraliza uma futura troca da fonte
// do texto bíblico. Por enquanto, o cache local já reduz bastante o
// número de chamadas repetidas.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { comFila } from "../repositories/local/fila";
import type { CapituloTexto } from "./tipos";

const BASE_URL = "https://bible-api.com/";
const CHAVE_CACHE = "biblia-cache-versiculos";
const MAX_CACHE = 200;

async function lerCache(): Promise<Record<string, CapituloTexto>> {
  const bruto = await AsyncStorage.getItem(CHAVE_CACHE);
  if (!bruto) return {};
  try {
    return JSON.parse(bruto) as Record<string, CapituloTexto>;
  } catch {
    return {};
  }
}

export async function buscarReferencia(ref: string): Promise<CapituloTexto> {
  const chave = ref.trim();
  const cache = await lerCache();
  if (cache[chave]) return cache[chave];

  const resposta = await fetch(`${BASE_URL}${encodeURIComponent(chave)}?translation=almeida`);
  if (!resposta.ok) throw new Error(`Falha ao buscar ${chave}`);
  const dados = await resposta.json();
  if (dados.error) throw new Error(dados.error);

  const resultado: CapituloTexto = {
    referencia: dados.reference,
    texto: String(dados.text).trim().replace(/\s+/g, " "),
    versiculos: Array.isArray(dados.verses)
      ? dados.verses.map((v: { verse: number; text: string }) => ({
          numero: v.verse,
          texto: v.text.trim().replace(/\s+/g, " "),
        }))
      : null,
  };

  await comFila(CHAVE_CACHE, async () => {
    const atual = await lerCache();
    atual[chave] = resultado;
    const chaves = Object.keys(atual);
    if (chaves.length > MAX_CACHE) delete atual[chaves[0]];
    await AsyncStorage.setItem(CHAVE_CACHE, JSON.stringify(atual));
  });

  return resultado;
}

export function apenasCapitulo(ref: string): string {
  return ref.replace(/:.*/, "");
}
