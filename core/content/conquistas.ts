// Marcos de leitura ligados à estrutura do cânon (Pentateuco, Evangelhos,
// testamentos), não a metas de contagem arbitrárias — mesma abordagem já
// validada no site antigo. Objetivo é reconhecer o progresso sem virar
// competição, então são só selos discretos, sem pontuação nem ranking.
import { livros } from "./livros";

export type Conquista = {
  id: string;
  titulo: string;
  icone: string;
  conquistada: boolean;
};

const PENTATEUCO = ["01-genesis", "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio"];
const EVANGELHOS = ["40-mateus", "41-marcos", "42-lucas", "43-joao"];
const SLUGS_AT = livros.filter((l) => l.testamento === "Antigo Testamento").map((l) => l.slug);
const SLUGS_NT = livros.filter((l) => l.testamento === "Novo Testamento").map((l) => l.slug);

function todosLidos(slugs: string[], lidos: Set<string>): boolean {
  return slugs.length > 0 && slugs.every((slug) => lidos.has(slug));
}

export function calcularConquistas(lidos: Set<string>): Conquista[] {
  return [
    { id: "primeiro-livro", titulo: "Primeiro livro lido", icone: "✓", conquistada: lidos.size >= 1 },
    { id: "pentateuco", titulo: "Pentateuco completo", icone: "📜", conquistada: todosLidos(PENTATEUCO, lidos) },
    { id: "evangelhos", titulo: "Os 4 Evangelhos completos", icone: "📖", conquistada: todosLidos(EVANGELHOS, lidos) },
    { id: "antigo-testamento", titulo: "Antigo Testamento completo", icone: "🌍", conquistada: todosLidos(SLUGS_AT, lidos) },
    { id: "novo-testamento", titulo: "Novo Testamento completo", icone: "✦", conquistada: todosLidos(SLUGS_NT, lidos) },
    { id: "biblia-completa", titulo: "Os 66 livros lidos", icone: "🎯", conquistada: lidos.size >= livros.length },
  ];
}
