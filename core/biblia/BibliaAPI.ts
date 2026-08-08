import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, garantirBaseBiblia } from "../db/database";
import type { CapituloTexto, VersiculoTexto } from "./tipos";
import { comFila } from "../repositories/local/fila";

const isWeb = Platform.OS === "web";
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

async function buscarWeb(ref: string): Promise<CapituloTexto> {
  const chave = ref.trim().toLowerCase();
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

// Função para buscar um capítulo ou versículo específico
export async function buscarReferencia(ref: string): Promise<CapituloTexto> {
  if (isWeb) return buscarWeb(ref);

  await garantirBaseBiblia(); // Garante que a Bíblia está populada

  const chave = ref.trim().toLowerCase();
  
  // Parse da referência: "gn 1" ou "gn 1:1" ou "gn 1:1-5"
  const partes = chave.split(' ');
  const livroSlug = partes[0];
  const resto = partes[1]; // "1" ou "1:1" ou "1:1-5"
  
  let capituloNum = 0;
  let versiculoNum = 0;
  
  if (resto && resto.includes(':')) {
    const [c, v] = resto.split(':');
    capituloNum = parseInt(c);
    // Para simplificar no momento, pega apenas o primeiro versículo se for um range
    versiculoNum = parseInt(v.split('-')[0]); 
  } else if (resto) {
    capituloNum = parseInt(resto);
  }

  if (versiculoNum > 0) {
    // Busca apenas 1 versículo
    const resultado = await db.getAllAsync<{ nomeLivro: string, texto: string }>(
      `SELECT nomeLivro, texto FROM biblia_text WHERE livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [livroSlug, capituloNum, versiculoNum]
    );

    if (resultado.length === 0) throw new Error(`Falha ao buscar ${chave}`);
    
    return {
      referencia: `${resultado[0].nomeLivro} ${capituloNum}:${versiculoNum}`,
      texto: resultado[0].texto,
      versiculos: [{ numero: versiculoNum, texto: resultado[0].texto }]
    };
  } else {
    // Busca o capítulo inteiro
    const resultados = await db.getAllAsync<{ nomeLivro: string, versiculo: number, texto: string }>(
      `SELECT nomeLivro, versiculo, texto FROM biblia_text WHERE livroSlug = ? AND capitulo = ? ORDER BY versiculo ASC`,
      [livroSlug, capituloNum]
    );

    if (resultados.length === 0) throw new Error(`Falha ao buscar ${chave}`);

    const textoCompleto = resultados.map(r => r.texto).join(" ");
    
    return {
      referencia: `${resultados[0].nomeLivro} ${capituloNum}`,
      texto: textoCompleto,
      versiculos: resultados.map(r => ({
        numero: r.versiculo,
        texto: r.texto
      }))
    };
  }
}

export function apenasCapitulo(ref: string): string {
  return ref.replace(/:.*/, "");
}

export type ResultadoBuscaGlobal = {
  livroSlug: string;
  nomeLivro: string;
  capitulo: number;
  versiculo: number;
  texto: string;
};

// Implementação da busca global usando FTS5 (Full-Text Search)
export async function buscarGlobal(query: string): Promise<ResultadoBuscaGlobal[]> {
  if (isWeb) return []; // Fallback simples na web para evitar crashes no SQLite WASM

  await garantirBaseBiblia();

  // Usa snippet para destacar, ou apenas retorna o texto. Retornaremos o texto normal para não quebrar UI existente.
  // FTS5 MATCH sintaxe: 
  const termo = `"${query.replace(/"/g, '""')}"*`; // Prefixo simples
  
  try {
    return await db.getAllAsync<ResultadoBuscaGlobal>(
      `SELECT livroSlug, nomeLivro, capitulo, versiculo, texto FROM biblia_fts WHERE texto MATCH ? ORDER BY rank LIMIT 50`,
      [termo]
    );
  } catch (e) {
    // Caso de falha no FTS (query mal formada), fallback para LIKE
    return await db.getAllAsync<ResultadoBuscaGlobal>(
      `SELECT livroSlug, nomeLivro, capitulo, versiculo, texto FROM biblia_text WHERE texto LIKE ? LIMIT 50`,
      [`%${query}%`]
    );
  }
}
