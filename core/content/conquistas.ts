// Marcos de leitura ligados à estrutura do cânon (Pentateuco, Evangelhos,
// testamentos), não a metas de contagem arbitrárias — mesma abordagem já
// validada no site antigo. Objetivo é reconhecer o progresso sem virar
// competição, então são só selos discretos, sem pontuação nem ranking.
import { livros } from "./livros";

export type Conquista = {
  id: IdConquista;
  titulo: string;
  descricao: string;
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
  | "biblia-completa";

const SLUGS_VALIDOS = new Set(livros.map((livro) => livro.slug));

const PENTATEUCO = ["01-genesis", "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio"];
const EVANGELHOS = ["40-mateus", "41-marcos", "42-lucas", "43-joao"];
const SLUGS_AT = livros.filter((l) => l.testamento === "Antigo Testamento").map((l) => l.slug);
const SLUGS_NT = livros.filter((l) => l.testamento === "Novo Testamento").map((l) => l.slug);

function contarLidos(slugs: string[], lidos: Set<string>): number {
  return slugs.filter((slug) => lidos.has(slug)).length;
}

export function calcularConquistas(lidos: Set<string>): Conquista[] {
  const lidosValidos = new Set([...lidos].filter((slug) => SLUGS_VALIDOS.has(slug)));
  const noPentateuco = contarLidos(PENTATEUCO, lidosValidos);
  const nosEvangelhos = contarLidos(EVANGELHOS, lidosValidos);
  const noAT = contarLidos(SLUGS_AT, lidosValidos);
  const noNT = contarLidos(SLUGS_NT, lidosValidos);
  const noTotal = lidosValidos.size;

  return [
    {
      id: "primeiro-livro",
      titulo: "Primeiro Passo",
      descricao: "Leia o resumo de 1 livro da Bíblia.",
      progressoAtual: Math.min(noTotal, 1),
      progressoTotal: 1,
      conquistada: noTotal >= 1,
    },
    {
      id: "pentateuco",
      titulo: "Fundamentos da Fé",
      descricao: "Leia os 5 livros do Pentateuco (Gênesis a Deuteronômio).",
      progressoAtual: noPentateuco,
      progressoTotal: PENTATEUCO.length,
      conquistada: noPentateuco >= PENTATEUCO.length,
    },
    {
      id: "evangelhos",
      titulo: "Vida de Cristo",
      descricao: "Leia os 4 Evangelhos (Mateus, Marcos, Lucas e João).",
      progressoAtual: nosEvangelhos,
      progressoTotal: EVANGELHOS.length,
      conquistada: nosEvangelhos >= EVANGELHOS.length,
    },
    {
      id: "antigo-testamento",
      titulo: "Guardião da Aliança",
      descricao: "Leia todos os 39 livros do Antigo Testamento.",
      progressoAtual: noAT,
      progressoTotal: SLUGS_AT.length,
      conquistada: noAT >= SLUGS_AT.length,
    },
    {
      id: "novo-testamento",
      titulo: "Testemunha do Evangelho",
      descricao: "Leia todos os 27 livros do Novo Testamento.",
      progressoAtual: noNT,
      progressoTotal: SLUGS_NT.length,
      conquistada: noNT >= SLUGS_NT.length,
    },
    {
      id: "biblia-completa",
      titulo: "Bíblia Completa",
      descricao: "Leia o resumo dos 66 livros da Bíblia.",
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
    "biblia-completa": livros.map((livro) => livro.slug),
  };
  const slugs = requisitos[id] ?? [];
  return livros.filter((livro) => slugs.includes(livro.slug) && !validos.has(livro.slug));
}
