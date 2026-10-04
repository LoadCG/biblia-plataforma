// Marcos de leitura ligados à estrutura do cânon (Pentateuco, Evangelhos,
// testamentos), não a metas de contagem arbitrárias — mesma abordagem já
// validada no site antigo. Objetivo é reconhecer o progresso sem virar
// competição, então são só selos discretos, sem pontuação nem ranking.
import { livros } from "./livros";

export type Conquista = {
  id: IdConquista;
  titulo: string;
  descricao: string;
  contexto: string;
  progressoAtual: number;
  progressoTotal: number;
  conquistada: boolean;
};

export type IdConquista =
  | "primeiro-livro"
  | "pentateuco"
  | "evangelhos"
  | "antigo-testamento"
  | "novo-testamento"
  | "historia-israel"
  | "poesia-sabedoria"
  | "profetas"
  | "cartas"
  | "biblia-completa";

const SLUGS_VALIDOS = new Set(livros.map((livro) => livro.slug));

const PENTATEUCO = ["01-genesis", "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio"];
const EVANGELHOS = ["40-mateus", "41-marcos", "42-lucas", "43-joao"];
const SLUGS_AT = livros.filter((l) => l.testamento === "Antigo Testamento").map((l) => l.slug);
const SLUGS_NT = livros.filter((l) => l.testamento === "Novo Testamento").map((l) => l.slug);
const SLUGS_HISTORIA_ISRAEL = livros.filter((l) => l.testamento === "Antigo Testamento" && l.genero === "Histórico").map((l) => l.slug);
const SLUGS_POESIA = livros.filter((l) => l.genero === "Poético").map((l) => l.slug);
const SLUGS_PROFETAS = livros.filter((l) => l.genero === "Profético").map((l) => l.slug);
const SLUGS_CARTAS = livros.filter((l) => l.testamento === "Novo Testamento" && l.genero === "Carta").map((l) => l.slug);

function contarLidos(slugs: string[], lidos: Set<string>): number {
  return slugs.filter((slug) => lidos.has(slug)).length;
}

export function calcularConquistas(lidos: Set<string>): Conquista[] {
  const lidosValidos = new Set([...lidos].filter((slug) => SLUGS_VALIDOS.has(slug)));
  const noPentateuco = contarLidos(PENTATEUCO, lidosValidos);
  const nosEvangelhos = contarLidos(EVANGELHOS, lidosValidos);
  const noAT = contarLidos(SLUGS_AT, lidosValidos);
  const noNT = contarLidos(SLUGS_NT, lidosValidos);
  const naHistoriaIsrael = contarLidos(SLUGS_HISTORIA_ISRAEL, lidosValidos);
  const naPoesia = contarLidos(SLUGS_POESIA, lidosValidos);
  const nosProfetas = contarLidos(SLUGS_PROFETAS, lidosValidos);
  const nasCartas = contarLidos(SLUGS_CARTAS, lidosValidos);
  const noTotal = lidosValidos.size;

  return [
    {
      id: "primeiro-livro",
      titulo: "Primeiro Passo",
      descricao: "Leia o resumo de 1 livro da Bíblia.",
      contexto: "Um começo livre: qualquer resumo de livro conta para este marco. A sugestão de leitura é apenas um ponto de partida.",
      progressoAtual: Math.min(noTotal, 1),
      progressoTotal: 1,
      conquistada: noTotal >= 1,
    },
    {
      id: "pentateuco",
      titulo: "Fundamentos da Fé",
      descricao: "Leia os 5 livros do Pentateuco (Gênesis a Deuteronômio).",
      contexto: "O Pentateuco reúne os cinco primeiros livros da Bíblia e estabelece a abertura da narrativa e da tradição de Israel.",
      progressoAtual: noPentateuco,
      progressoTotal: PENTATEUCO.length,
      conquistada: noPentateuco >= PENTATEUCO.length,
    },
    {
      id: "evangelhos",
      titulo: "Vida de Cristo",
      descricao: "Leia os 4 Evangelhos (Mateus, Marcos, Lucas e João).",
      contexto: "Os quatro Evangelhos apresentam relatos e perspectivas sobre a vida e os ensinamentos de Jesus.",
      progressoAtual: nosEvangelhos,
      progressoTotal: EVANGELHOS.length,
      conquistada: nosEvangelhos >= EVANGELHOS.length,
    },
    {
      id: "antigo-testamento",
      titulo: "Guardião da Aliança",
      descricao: "Leia todos os 39 livros do Antigo Testamento.",
      contexto: "Este percurso acompanha todo o conjunto de livros do Antigo Testamento conforme a organização usada neste catálogo.",
      progressoAtual: noAT,
      progressoTotal: SLUGS_AT.length,
      conquistada: noAT >= SLUGS_AT.length,
    },
    {
      id: "novo-testamento",
      titulo: "Testemunha do Evangelho",
      descricao: "Leia todos os 27 livros do Novo Testamento.",
      contexto: "Este percurso atravessa os livros do Novo Testamento: Evangelhos, Atos, cartas e Apocalipse.",
      progressoAtual: noNT,
      progressoTotal: SLUGS_NT.length,
      conquistada: noNT >= SLUGS_NT.length,
    },
    {
      id: "historia-israel",
      titulo: "Memória de Israel",
      descricao: `Leia os ${SLUGS_HISTORIA_ISRAEL.length} livros históricos do Antigo Testamento.`,
      contexto: "Acompanhe relatos que vão da entrada na terra e dos tempos dos juízes aos reinos, ao exílio e ao retorno.",
      progressoAtual: naHistoriaIsrael,
      progressoTotal: SLUGS_HISTORIA_ISRAEL.length,
      conquistada: naHistoriaIsrael >= SLUGS_HISTORIA_ISRAEL.length,
    },
    {
      id: "poesia-sabedoria",
      titulo: "Poesia e Sabedoria",
      descricao: `Leia os ${SLUGS_POESIA.length} livros poéticos do catálogo.`,
      contexto: "Explore poesia, oração, lamento, provérbios e reflexão por meio de Jó, Salmos, Provérbios, Eclesiastes e Cantares.",
      progressoAtual: naPoesia,
      progressoTotal: SLUGS_POESIA.length,
      conquistada: naPoesia >= SLUGS_POESIA.length,
    },
    {
      id: "profetas",
      titulo: "Vozes Proféticas",
      descricao: `Leia os ${SLUGS_PROFETAS.length} livros classificados como proféticos.`,
      contexto: "Este conjunto combina mensagens proféticas, poesia e narrativas em contextos históricos distintos; cada livro pede leitura atenta ao próprio contexto.",
      progressoAtual: nosProfetas,
      progressoTotal: SLUGS_PROFETAS.length,
      conquistada: nosProfetas >= SLUGS_PROFETAS.length,
    },
    {
      id: "cartas",
      titulo: "Cartas às Comunidades",
      descricao: `Leia os ${SLUGS_CARTAS.length} escritos classificados como cartas no Novo Testamento.`,
      contexto: "Leia instruções, argumentos e encorajamentos epistolares dirigidos a comunidades e pessoas do primeiro século.",
      progressoAtual: nasCartas,
      progressoTotal: SLUGS_CARTAS.length,
      conquistada: nasCartas >= SLUGS_CARTAS.length,
    },
    {
      id: "biblia-completa",
      titulo: "Bíblia Completa",
      descricao: "Leia o resumo dos 66 livros da Bíblia.",
      contexto: "Uma visão de todo o catálogo bíblico: conclua os resumos dos livros do Antigo e do Novo Testamento.",
      progressoAtual: noTotal,
      progressoTotal: livros.length,
      conquistada: noTotal >= livros.length,
    },
  ];
}

/** Seleciona até três marcos para a Home sem depender da ordem incidental do array. */
export function selecionarDestaquesConquistas(conquistas: Conquista[]): Conquista[] {
  const primeiroPasso = conquistas.find((conquista) => conquista.id === "primeiro-livro");
  const bibliaCompleta = conquistas.find((conquista) => conquista.id === "biblia-completa");
  const emAndamento = conquistas
    .filter((conquista) => !conquista.conquistada && conquista.progressoAtual > 0 && conquista.id !== "biblia-completa")
    .sort((a, b) => {
      const proporcaoA = a.progressoAtual / a.progressoTotal;
      const proporcaoB = b.progressoAtual / b.progressoTotal;
      return proporcaoB - proporcaoA || a.progressoTotal - b.progressoTotal;
    });
  const conquistadas = conquistas.filter((conquista) => conquista.conquistada && conquista.id !== "biblia-completa");

  const candidatas = emAndamento.length > 0
    ? [emAndamento[0], primeiroPasso, bibliaCompleta]
    : [primeiroPasso, ...conquistadas.slice(-1), bibliaCompleta];

  const idsIncluidos = new Set<IdConquista>();
  return candidatas.filter((conquista): conquista is Conquista => {
    if (!conquista || idsIncluidos.has(conquista.id)) return false;
    idsIncluidos.add(conquista.id);
    return true;
  });
}

export function obterLivrosPendentes(id: IdConquista, lidos: Set<string>) {
  const validos = new Set([...lidos].filter((slug) => SLUGS_VALIDOS.has(slug)));
  if (id === "primeiro-livro") {
    const sugestao = livros.find((livro) => !validos.has(livro.slug));
    return sugestao ? [sugestao] : [];
  }
  const requisitos: Partial<Record<IdConquista, string[]>> = {
    pentateuco: PENTATEUCO,
    evangelhos: EVANGELHOS,
    "antigo-testamento": SLUGS_AT,
    "novo-testamento": SLUGS_NT,
    "historia-israel": SLUGS_HISTORIA_ISRAEL,
    "poesia-sabedoria": SLUGS_POESIA,
    profetas: SLUGS_PROFETAS,
    cartas: SLUGS_CARTAS,
    "biblia-completa": livros.map((livro) => livro.slug),
  };
  const slugs = requisitos[id] ?? [];
  return livros.filter((livro) => slugs.includes(livro.slug) && !validos.has(livro.slug));
}
