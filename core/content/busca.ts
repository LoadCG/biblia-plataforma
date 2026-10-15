// Busca por nome do livro E por conteúdo do resumo (autor, contexto
// histórico, curiosidades etc.) — encontrar "cordeiro" e achar
// Êxodo/Apocalipse mesmo sem a palavra estar no nome do livro.
//
// O site antigo fazia isso com um índice de texto gerado em build,
// porque cada página era um HTML estático separado. Aqui os 66 resumos
// completos já vivem inteiros em memória (core/content/dados/livros.json,
// carregado de uma vez). Títulos e trechos são normalizados e indexados
// sob demanda uma única vez, mantendo offsets para exibir o texto original.
import { resumosCompletos } from "./livros";
import type { Livro } from "./tipos";
import { normalizarBusca, tokenizarBusca } from "../biblia/relevanciaBusca";
import { parseReferenciaBiblica } from "../biblia/parseReferencia";

export type ResultadoBusca = {
  livro: Livro;
  // Trecho do resumo onde o termo foi encontrado, só quando o motivo do
  // resultado NÃO foi o nome do livro — evita redundância ("Mateus"
  // encontrado por nome não precisa de trecho justificando por quê).
  trecho: string | null;
  score: number;
  camposCoincidentes: Array<"titulo" | "alias" | "tema" | "conteudo">;
};

type ConteudoNormalizado = {
  texto: string;
  iniciosOriginais: number[];
  finsOriginais: number[];
};

// Mantém o mapa de offsets porque remover marcas diacríticas altera a
// quantidade de unidades UTF-16 antes do trecho a ser exibido.
function normalizarConteudo(texto: string): ConteudoNormalizado {
  let normalizado = "";
  const iniciosOriginais: number[] = [];
  const finsOriginais: number[] = [];
  let indiceOriginal = 0;

  for (const caractere of texto) {
    const fimOriginal = indiceOriginal + caractere.length;
    const trechoNormalizado = caractere.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    normalizado += trechoNormalizado;
    for (let indice = 0; indice < trechoNormalizado.length; indice += 1) {
      iniciosOriginais.push(indiceOriginal);
      finsOriginais.push(fimOriginal);
    }
    indiceOriginal = fimOriginal;
  }

  return { texto: normalizado, iniciosOriginais, finsOriginais };
}

function correspondeToken(texto: string, consulta: string): boolean {
  // Termos muito curtos são exatos para evitar que “fé” encontre “feitas”.
  return consulta.length <= 2 ? texto === consulta : texto.startsWith(consulta);
}

function correspondeTitulo(palavrasTitulo: string[], consulta: string[], fraseExata: boolean): boolean {
  if (consulta.length === 0) return false;
  if (fraseExata) {
    return palavrasTitulo.some((_, inicio) => consulta.every((palavra, indice) => palavrasTitulo[inicio + indice] === palavra));
  }

  const usadas = new Set<number>();
  return consulta.every((palavra) => {
    const indice = palavrasTitulo.findIndex((tituloToken, indiceToken) => !usadas.has(indiceToken) && correspondeToken(tituloToken, palavra));
    if (indice === -1) return false;
    usadas.add(indice);
    return true;
  });
}

function recortarTrecho(texto: string, indice: number, tamanhoTermo: number, margem = 40): string {
  let inicio = Math.max(0, indice - margem);
  let fim = Math.min(texto.length, indice + tamanhoTermo + margem);
  if (inicio > 0 && !/\s/.test(texto[inicio - 1]) && !/\s/.test(texto[inicio])) {
    const proximoEspaco = texto.slice(inicio, indice).search(/\s/);
    if (proximoEspaco >= 0) inicio += proximoEspaco + 1;
  }
  if (fim < texto.length && !/\s/.test(texto[fim - 1]) && !/\s/.test(texto[fim])) {
    const ultimoEspaco = texto.slice(indice + tamanhoTermo, fim).search(/\s(?=[^\s]*$)/);
    if (ultimoEspaco >= 0) fim = indice + tamanhoTermo + ultimoEspaco;
  }
  const prefixo = inicio > 0 ? "…" : "";
  const sufixo = fim < texto.length ? "…" : "";
  return prefixo + texto.slice(inicio, fim).trim() + sufixo;
}

type CorrespondenciaTrecho = { trecho: string; termo: string; evidencias: number };

type PalavraIndexada = { valor: string; inicio: number; fim: number };
type TextoIndexado = { original: string; palavras: PalavraIndexada[] };
type ResumoIndexado = {
  resumo: (typeof resumosCompletos)[number];
  tituloNormalizado: string;
  palavrasTitulo: string[];
  textos: TextoIndexado[];
};

let indiceEditorial: ResumoIndexado[] | null = null;

function indexarTexto(original: string): TextoIndexado {
  const conteudo = normalizarConteudo(original);
  const palavras: PalavraIndexada[] = [];
  const expressaoPalavra = /[a-z0-9]+/g;
  let correspondencia: RegExpExecArray | null;
  while ((correspondencia = expressaoPalavra.exec(conteudo.texto)) !== null) {
    const inicioNormalizado = correspondencia.index;
    const fimNormalizado = inicioNormalizado + correspondencia[0].length - 1;
    palavras.push({
      valor: correspondencia[0],
      inicio: conteudo.iniciosOriginais[inicioNormalizado],
      fim: conteudo.finsOriginais[fimNormalizado],
    });
  }
  return { original, palavras };
}

function obterIndiceEditorial(): ResumoIndexado[] {
  if (indiceEditorial) return indiceEditorial;

  indiceEditorial = resumosCompletos.map((resumo) => {
    const textos = resumo.fichaRapida.map(({ valor }) => indexarTexto(valor));
    for (const secao of resumo.secoes) {
      const conteudos = secao.lista ? secao.itens : secao.paragrafos;
      textos.push(...conteudos.map(indexarTexto));
    }

    const tituloNormalizado = normalizarBusca(resumo.nome);
    return {
      resumo,
      tituloNormalizado,
      palavrasTitulo: tokenizarBusca(tituloNormalizado),
      textos,
    };
  });

  return indiceEditorial;
}

function encontrarTrechoEmTexto(
  texto: TextoIndexado,
  consulta: string[],
  fraseExata: boolean
): { trecho: string; evidencias: number } | null {
  const palavrasTexto = texto.palavras;

  let palavrasEncontradas: typeof palavrasTexto;
  let evidencias: number;
  if (fraseExata) {
    const iniciosFrase = palavrasTexto.flatMap((_, inicio) =>
      consulta.every((palavra, indice) => palavrasTexto[inicio + indice]?.valor === palavra) ? [inicio] : []
    );
    if (iniciosFrase.length === 0) return null;
    palavrasEncontradas = palavrasTexto.slice(iniciosFrase[0], iniciosFrase[0] + consulta.length);
    evidencias = iniciosFrase.length;
  } else {
    palavrasEncontradas = [];
    const contagens: number[] = [];
    for (const palavraConsulta of consulta) {
      const encontradas = palavrasTexto.filter(({ valor }) => correspondeToken(valor, palavraConsulta));
      if (encontradas.length === 0) return null;
      palavrasEncontradas.push(encontradas[0]);
      contagens.push(encontradas.length);
    }
    evidencias = Math.min(...contagens);
  }

  const inicio = Math.min(...palavrasEncontradas.map(({ inicio: inicioPalavra }) => inicioPalavra));
  const fim = Math.max(...palavrasEncontradas.map(({ fim: fimPalavra }) => fimPalavra));
  if (!fraseExata && fim - inicio > 120) {
    const trechos = palavrasEncontradas
      .sort((a, b) => a.inicio - b.inicio)
      .map(({ inicio: inicioPalavra, fim: fimPalavra }) => recortarTrecho(texto.original, inicioPalavra, fimPalavra - inicioPalavra, 16));
    return { trecho: trechos.join(" "), evidencias };
  }
  return { trecho: recortarTrecho(texto.original, inicio, fim - inicio), evidencias };
}

function encontrarTrecho(
  resumo: ResumoIndexado,
  consulta: string[],
  fraseExata: boolean,
  termoEvidencia: string
): CorrespondenciaTrecho | null {
  let primeiraCorrespondencia: string | null = null;
  let evidencias = 0;
  for (const texto of resumo.textos) {
    const correspondencia = encontrarTrechoEmTexto(texto, consulta, fraseExata);
    if (!correspondencia) continue;
    primeiraCorrespondencia ??= correspondencia.trecho;
    evidencias += correspondencia.evidencias;
  }
  return primeiraCorrespondencia ? { trecho: primeiraCorrespondencia, termo: termoEvidencia, evidencias } : null;
}

function encontrarCorrespondencia(
  resumo: ResumoIndexado,
  termos: string[],
  fraseExata = false
): CorrespondenciaTrecho | null {
  for (const termo of termos) {
    const correspondencia = encontrarTrecho(resumo, tokenizarBusca(termo), fraseExata, termo);
    if (correspondencia) return correspondencia;
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
  "jo": "joao",
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

const SINONIMOS_TEMATICOS: Record<string, string[]> = {
  "esperanca": ["esperanca", "promessa", "consolo", "renovacao"],
  "oracao": ["oracao", "clama", "suplic", "louvor"],
  "justica": ["justica", "pobre", "oprim", "misericord"],
  "sabedoria": ["sabedoria", "prudencia", "entendimento", "ensino"],
  "libertacao": ["libertacao", "libertar", "resgate", "livramento"],
  "perdao": ["perdao", "misericord", "reconcili"],
};

export function buscarLivros(termoBruto: string): ResultadoBusca[] {
  const entrada = termoBruto.trim();
  if (!entrada) return resumosCompletos.map((livro) => ({ livro, trecho: null, score: 0, camposCoincidentes: [] }));
  if (parseReferenciaBiblica(entrada)) return [];

  const fraseExata = entrada.startsWith('"') && entrada.endsWith('"');
  let termo = normalizarBusca(entrada.replace(/^"|"$/g, ""));
  let tokensConsulta = tokenizarBusca(termo);
  if (tokensConsulta.length === 0) return [];

  if (!fraseExata && tokensConsulta.length === 1 && ALIAS_MAP[termo]) {
    termo = ALIAS_MAP[termo];
    tokensConsulta = tokenizarBusca(termo);
  }

  const consulta = tokensConsulta.join(" ");
  // A expansão temática só se aplica à consulta de um termo; frases e
  // consultas AND preservam literalmente o que a pessoa digitou.
  const termosBusca = fraseExata
    ? [consulta]
    : tokensConsulta.length === 1
      ? SINONIMOS_TEMATICOS[termo] ?? [termo]
      : [consulta];

  const resultados: ResultadoBusca[] = [];

  for (const item of obterIndiceEditorial()) {
    const resumo = item.resumo;
    if (correspondeTitulo(item.palavrasTitulo, tokensConsulta, fraseExata)) {
      resultados.push({ livro: resumo, trecho: null, score: item.tituloNormalizado === termo ? 1000 : 700, camposCoincidentes: ["titulo"] });
      continue;
    }
    const correspondencia = encontrarCorrespondencia(item, termosBusca, fraseExata);
    if (correspondencia) {
      const direto = correspondencia.termo === termo || correspondencia.termo === consulta;
      // Mais menções no mesmo livro sinalizam centralidade sem atravessar
      // as faixas de prioridade de título, conteúdo literal e tema.
      const score = (direto ? 300 : 220) + Math.min(correspondencia.evidencias, 20);
      resultados.push({ livro: resumo, trecho: correspondencia.trecho, score, camposCoincidentes: [direto ? "conteudo" : "tema"] });
    }
  }

  return resultados.sort((a, b) => b.score - a.score || a.livro.numero - b.livro.numero || a.livro.slug.localeCompare(b.livro.slug));
}
