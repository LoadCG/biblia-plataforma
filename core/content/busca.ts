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

const ALIAS_MAP: Record<string, string> = {
  "genezis": "genesis",
  "gn": "genesis",
  "ex": "exodo",
  "lv": "levitico",
  "nm": "numeros",
  "dt": "deuteronomio",
  "js": "josue",
  "jz": "juizes",
  "rt": "rute",
  "1sm": "1 samuel",
  "2sm": "2 samuel",
  "1rs": "1 reis",
  "2rs": "2 reis",
  "1cr": "1 cronicas",
  "2cr": "2 cronicas",
  "ed": "esdras",
  "ne": "neemias",
  "et": "ester",
  "jo": "jo",
  "sl": "salmos",
  "pv": "proverbios",
  "ec": "eclesiastes",
  "ct": "cantares",
  "is": "isaias",
  "jr": "jeremias",
  "lm": "lamentacoes",
  "ez": "ezequiel",
  "dn": "daniel",
  "os": "oseias",
  "jl": "joel",
  "am": "amos",
  "ob": "obadias",
  "jn": "jonas",
  "mq": "miqueias",
  "na": "naum",
  "hc": "habacuque",
  "sf": "sofonias",
  "ag": "ageu",
  "zc": "zacarias",
  "ml": "malaquias",
  "mt": "mateus",
  "mc": "marcos",
  "mr": "marcos",
  "lc": "lucas",
  "joao": "joao",
  "atos": "atos",
  "rm": "romanos",
  "1co": "1 corintios",
  "2co": "2 corintios",
  "gl": "galatas",
  "ef": "efesios",
  "fp": "filipenses",
  "cl": "colossenses",
  "1ts": "1 tessalonicenses",
  "2ts": "2 tessalonicenses",
  "1tm": "1 timoteo",
  "2tm": "2 timoteo",
  "tt": "tito",
  "fm": "filemon",
  "hb": "hebreus",
  "tg": "tiago",
  "1pe": "1 pedro",
  "2pe": "2 pedro",
  "1jo": "1 joao",
  "2jo": "2 joao",
  "3jo": "3 joao",
  "jd": "judas",
  "ap": "apocalipse",
  "apocalipse": "apocalipse"
};

export function buscarLivros(termoBruto: string): ResultadoBusca[] {
  let termo = normalizar(termoBruto.trim());
  
  if (ALIAS_MAP[termo]) {
    termo = ALIAS_MAP[termo];
  }

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
