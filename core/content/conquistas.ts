// Marcos de leitura ligados à estrutura do cânon (Pentateuco, Evangelhos,
// testamentos), não a metas de contagem arbitrárias — mesma abordagem já
// validada no site antigo. Objetivo é reconhecer o progresso sem virar
// competição, então são só selos discretos, sem pontuação nem ranking.
import { livros } from "./livros";

export type Conquista = {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  progressoAtual: number;
  progressoTotal: number;
  conquistada: boolean;
};

const PENTATEUCO = ["01-genesis", "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio"];
const EVANGELHOS = ["40-mateus", "41-marcos", "42-lucas", "43-joao"];
const SLUGS_AT = livros.filter((l) => l.testamento === "Antigo Testamento").map((l) => l.slug);
const SLUGS_NT = livros.filter((l) => l.testamento === "Novo Testamento").map((l) => l.slug);

function contarLidos(slugs: string[], lidos: Set<string>): number {
  return slugs.filter((slug) => lidos.has(slug)).length;
}

export function calcularConquistas(lidos: Set<string>): Conquista[] {
  const noPentateuco = contarLidos(PENTATEUCO, lidos);
  const nosEvangelhos = contarLidos(EVANGELHOS, lidos);
  const noAT = contarLidos(SLUGS_AT, lidos);
  const noNT = contarLidos(SLUGS_NT, lidos);
  const noTotal = Math.min(lidos.size, livros.length);

  return [
    {
      id: "primeiro-livro",
      titulo: "Primeiro Passo",
      descricao: "Leia o resumo de 1 livro da Bíblia.",
      icone: "✓",
      progressoAtual: Math.min(noTotal, 1),
      progressoTotal: 1,
      conquistada: noTotal >= 1,
    },
    {
      id: "pentateuco",
      titulo: "Fundamentos da Fé",
      descricao: "Leia os 5 livros do Pentateuco (Gênesis a Deuteronômio).",
      icone: "📜",
      progressoAtual: noPentateuco,
      progressoTotal: PENTATEUCO.length,
      conquistada: noPentateuco >= PENTATEUCO.length,
    },
    {
      id: "evangelhos",
      titulo: "Vida de Cristo",
      descricao: "Leia os 4 Evangelhos (Mateus, Marcos, Lucas e João).",
      icone: "📖",
      progressoAtual: nosEvangelhos,
      progressoTotal: EVANGELHOS.length,
      conquistada: nosEvangelhos >= EVANGELHOS.length,
    },
    {
      id: "antigo-testamento",
      titulo: "Guardião da Aliança",
      descricao: "Leia todos os 39 livros do Antigo Testamento.",
      icone: "🌍",
      progressoAtual: noAT,
      progressoTotal: SLUGS_AT.length,
      conquistada: noAT >= SLUGS_AT.length,
    },
    {
      id: "novo-testamento",
      titulo: "Testemunha do Evangelho",
      descricao: "Leia todos os 27 livros do Novo Testamento.",
      icone: "✦",
      progressoAtual: noNT,
      progressoTotal: SLUGS_NT.length,
      conquistada: noNT >= SLUGS_NT.length,
    },
    {
      id: "biblia-completa",
      titulo: "Bíblia Completa",
      descricao: "Leia o resumo dos 66 livros da Bíblia.",
      icone: "🎯",
      progressoAtual: noTotal,
      progressoTotal: livros.length,
      conquistada: noTotal >= livros.length,
    },
  ];
}
