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

const TIMEOUT_MS = 10000;
const TENTATIVAS = 3;

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarComTimeout(url: string): Promise<Response> {
  const controlador = new AbortController();
  const timeoutId = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controlador.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Erro classificado pra poder mostrar uma mensagem amigável na tela
// (ver core/util/erroAmigavel.ts) em vez de um texto genérico de
// "algo deu errado" pra qualquer causa. "limite" e "invalido" não são
// transitórios — tentar de novo imediatamente não ajuda (a
// bible-api.com bloqueia por ~30s acima de ~15 requisições, então
// insistir só piora) — só "rede"/"timeout"/"desconhecido" são
// re-tentados automaticamente em buscarWeb.
export class ErroBusca extends Error {
  tipo: "limite" | "rede" | "timeout" | "invalido" | "desconhecido";
  constructor(tipo: ErroBusca["tipo"], mensagem: string) {
    super(mensagem);
    this.tipo = tipo;
  }
}

// A bible-api.com é uma API pública gratuita, sem SLA — falhas
// transitórias (timeout, 5xx) acontecem. Poucas tentativas com um
// pequeno intervalo (não é um backoff exponencial elaborado, só o
// suficiente pra absorver uma falha isolada) evitam que a pessoa veja
// "erro ao carregar" por uma instabilidade de meio segundo da API.
async function buscarWeb(ref: string): Promise<CapituloTexto> {
  const chave = ref.trim().toLowerCase();
  const cache = await lerCache();
  if (cache[chave]) return cache[chave];

  let ultimoErro: unknown;
  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
    try {
      let resposta: Response;
      try {
        resposta = await buscarComTimeout(`${BASE_URL}${encodeURIComponent(chave)}?translation=almeida`);
      } catch (erroFetch) {
        if (erroFetch instanceof DOMException && erroFetch.name === "AbortError") {
          throw new ErroBusca("timeout", `Tempo esgotado ao buscar ${chave}`);
        }
        throw new ErroBusca("rede", `Falha de rede ao buscar ${chave}`);
      }

      if (resposta.status === 429) {
        throw new ErroBusca("limite", "Muitas requisições em pouco tempo (rate limit da bible-api.com)");
      }
      if (!resposta.ok) {
        throw new ErroBusca("desconhecido", `Falha ao buscar ${chave} (status ${resposta.status})`);
      }
      const dados = await resposta.json();
      if (dados.error) throw new ErroBusca("invalido", dados.error);

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
    } catch (erro) {
      ultimoErro = erro;
      const tipo = erro instanceof ErroBusca ? erro.tipo : "desconhecido";
      const transitorio = tipo === "rede" || tipo === "timeout" || tipo === "desconhecido";
      if (!transitorio || tentativa === TENTATIVAS) break;
      await aguardar(600 * tentativa);
    }
  }
  throw ultimoErro;
}

import { livros } from "../content/livros";

// Função para buscar um capítulo ou versículo específico
export async function buscarReferencia(ref: string): Promise<CapituloTexto> {
  if (isWeb) {
    // Local primeiro (mesmo assets/biblia.json já embutido, sem rede) —
    // a bible-api.com só entra como rede de segurança se, por algum
    // motivo, a busca local falhar (ver leituraLocalWeb.ts). Antes, o
    // web sempre dependia da API externa pra cada capítulo aberto.
    try {
      const { buscarLocalWeb } = await import("./leituraLocalWeb");
      return await buscarLocalWeb(ref);
    } catch {
      return buscarWeb(ref);
    }
  }

  await garantirBaseBiblia(); // Garante que a Bíblia está populada

  const chave = ref.trim();
  
  // Parse da referência com regex para suportar nomes com espaços (ex: "1 Samuel 1:5" ou "Cântico dos Cânticos 2:1-3")
  const match = chave.match(/(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) throw new ErroBusca("invalido", `Referência inválida: ${chave}`);
  
  const nomeLivroRaw = match[1].trim();
  const capituloNum = parseInt(match[2], 10);
  const versiculoInicial = match[3] ? parseInt(match[3], 10) : 0;
  const versiculoFinal = match[4] ? parseInt(match[4], 10) : versiculoInicial;
  
  const chaveNormalizada = nomeLivroRaw.toLowerCase().replace(/[.\s]/g, "");
  const livroEncontrado = livros.find(
    (l) => l.nome.toLowerCase() === nomeLivroRaw.toLowerCase() || 
           (l.abreviacao && l.abreviacao === chaveNormalizada)
  );
  
  if (!livroEncontrado || !livroEncontrado.abreviacao) {
    throw new ErroBusca("invalido", `Livro não encontrado para a referência: ${chave}`);
  }
  
  const livroSlug = livroEncontrado.abreviacao; // ex: "gn", "1sm"

  if (versiculoInicial > 0) {
    // Busca intervalo de versículos (ou apenas 1 se inicial == final)
    const resultado = await db.getAllAsync<{ nomeLivro: string, versiculo: number, texto: string }>(
      `SELECT nomeLivro, versiculo, texto FROM biblia_text WHERE livroSlug = ? AND capitulo = ? AND versiculo >= ? AND versiculo <= ? ORDER BY versiculo ASC`,
      [livroSlug, capituloNum, versiculoInicial, versiculoFinal]
    );

    if (resultado.length === 0) throw new ErroBusca("invalido", `Falha ao buscar ${chave}`);
    
    const textoCompleto = resultado.map(r => r.texto).join(" ");
    const sufixoRef = versiculoInicial === versiculoFinal ? `${versiculoInicial}` : `${versiculoInicial}-${versiculoFinal}`;
    
    return {
      referencia: `${resultado[0].nomeLivro} ${capituloNum}:${sufixoRef}`,
      texto: textoCompleto,
      versiculos: resultado.map(r => ({ numero: r.versiculo, texto: r.texto }))
    };
  } else {
    // Busca o capítulo inteiro
    const resultados = await db.getAllAsync<{ nomeLivro: string, versiculo: number, texto: string }>(
      `SELECT nomeLivro, versiculo, texto FROM biblia_text WHERE livroSlug = ? AND capitulo = ? ORDER BY versiculo ASC`,
      [livroSlug, capituloNum]
    );

    if (resultados.length === 0) throw new ErroBusca("invalido", `Falha ao buscar ${chave}`);

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

// Implementação da busca global usando FTS5 (Full-Text Search) no
// nativo; no web, busca em memória sobre o JSON embutido (ver
// buscaGlobalWeb.ts — SQLite/WASM no navegador foi evitado de propósito).
export async function buscarGlobal(query: string): Promise<ResultadoBuscaGlobal[]> {
  if (isWeb) {
    const { buscarGlobalWeb } = await import("./buscaGlobalWeb");
    return buscarGlobalWeb(query);
  }

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
