// Varre um texto corrido e acha referências bíblicas ("Sl 22", "Rm
// 1:16-17", "1 Coríntios 15:3-8") usando a tabela de apelidos
// (ALIASES_LIVRO). Não depende do parser fuzzy da bible-api.com — a
// gente resolve o nome do livro aqui e só manda pra API o nome
// canônico completo, que já testamos que funciona.
//
// Decisão de arquitetura: detecção acontece na hora de renderizar (não
// em build), porque aqui o conteúdo já chega como string JS pro React
// (não HTML estático) — não tem por que rodar um parser de DOM ou
// gerar HTML à parte, um split simples da string já resolve.
import { ALIASES_LIVRO } from "./aliasesLivro";

const LETRA = "A-Za-zÀ-ÖØ-öø-ÿ";

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let regexCache: RegExp | null = null;
function obterRegex(): RegExp {
  if (regexCache) return regexCache;
  const chaves = Object.keys(ALIASES_LIVRO)
    .sort((a, b) => b.length - a.length)
    .map(escaparRegex);
  regexCache = new RegExp(
    `(?<![${LETRA}0-9])(${chaves.join("|")})\\s(\\d{1,3})(?::(\\d{1,3})(?:-(\\d{1,3}))?)?(?![${LETRA}])`,
    "g"
  );
  return regexCache;
}

export type SegmentoTexto = { tipo: "texto"; texto: string };
export type SegmentoReferencia = { tipo: "referencia"; texto: string; ref: string; refCapitulo: string };
export type Segmento = SegmentoTexto | SegmentoReferencia;

export function detectarReferencias(texto: string): Segmento[] {
  const regex = obterRegex();
  regex.lastIndex = 0;
  const segmentos: Segmento[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(texto))) {
    if (m.index > cursor) segmentos.push({ tipo: "texto", texto: texto.slice(cursor, m.index) });

    const [trecho, alias, capitulo, versiculoIni, versiculoFim] = m;
    const nomeCanonico = ALIASES_LIVRO[alias];
    const refCapitulo = `${nomeCanonico} ${capitulo}`;
    const ref = versiculoIni ? `${refCapitulo}:${versiculoIni}${versiculoFim ? `-${versiculoFim}` : ""}` : refCapitulo;

    segmentos.push({ tipo: "referencia", texto: trecho, ref, refCapitulo });
    cursor = m.index + trecho.length;
  }

  if (cursor < texto.length) segmentos.push({ tipo: "texto", texto: texto.slice(cursor) });
  return segmentos;
}
