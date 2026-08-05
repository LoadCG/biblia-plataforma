// Busca por nome do livro E por conteúdo do resumo (autor, contexto
// histórico, curiosidades etc.) — encontrar "cordeiro" e achar
// Êxodo/Apocalipse mesmo sem a palavra estar no nome do livro.
//
// O site antigo fazia isso com um índice de texto gerado em build,
// porque cada página era um HTML estático separado. Aqui os 66 resumos
// completos já vivem inteiros em memória (core/content/dados/livros.json,
// carregado de uma vez) — não há por que gerar um índice à parte, a
// varredura direta em ~66 objetos é instantânea.
import { resumosCompletos } from "./livros";
import type { Livro } from "./tipos";

export type ResultadoBusca = {
  livro: Livro;
  // Trecho do resumo onde o termo foi encontrado, só quando o motivo do
  // resultado NÃO foi o nome do livro — evita redundância ("Mateus"
  // encontrado por nome não precisa de trecho justificando por quê).
  trecho: string | null;
};

const REGEX_DIACRITICOS = new RegExp("[̀-ͯ]", "g");

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(REGEX_DIACRITICOS, "").toLowerCase();
}

function recortarTrecho(texto: string, indice: number, tamanhoTermo: number): string {
  const inicio = Math.max(0, indice - 40);
  const fim = Math.min(texto.length, indice + tamanhoTermo + 40);
  const prefixo = inicio > 0 ? "…" : "";
  const sufixo = fim < texto.length ? "…" : "";
  return prefixo + texto.slice(inicio, fim).trim() + sufixo;
}

function encontrarTrecho(resumo: (typeof resumosCompletos)[number], termoNormalizado: string): string | null {
  for (const item of resumo.fichaRapida) {
    const indice = normalizar(item.valor).indexOf(termoNormalizado);
    if (indice !== -1) return recortarTrecho(item.valor, indice, termoNormalizado.length);
  }
  for (const secao of resumo.secoes) {
    const textos = secao.lista ? secao.itens : secao.paragrafos;
    for (const texto of textos) {
      const indice = normalizar(texto).indexOf(termoNormalizado);
      if (indice !== -1) return recortarTrecho(texto, indice, termoNormalizado.length);
    }
  }
  return null;
}

export function buscarLivros(termoBruto: string): ResultadoBusca[] {
  const termo = normalizar(termoBruto.trim());
  if (!termo) return resumosCompletos.map((livro) => ({ livro, trecho: null }));

  const porNome: ResultadoBusca[] = [];
  const porConteudo: ResultadoBusca[] = [];

  for (const resumo of resumosCompletos) {
    if (normalizar(resumo.nome).includes(termo)) {
      porNome.push({ livro: resumo, trecho: null });
      continue;
    }
    const trecho = encontrarTrecho(resumo, termo);
    if (trecho) porConteudo.push({ livro: resumo, trecho });
  }

  return [...porNome, ...porConteudo];
}
