import dados from "./dados/livros.json";
import type { Livro, ResumoCompleto } from "./tipos";

export const resumosCompletos: ResumoCompleto[] = dados as ResumoCompleto[];

// Lista leve (sem o texto dos resumos) para telas de listagem/navegação.
export const livros: Livro[] = resumosCompletos.map(({ slug, nome, abreviacao, numero, testamento, capitulos, genero }) => ({
  slug,
  nome,
  abreviacao,
  numero,
  testamento,
  capitulos,
  genero,
}));

export function obterLivro(slug: string): Livro | undefined {
  return livros.find((l) => l.slug === slug);
}

export function obterResumo(slug: string): ResumoCompleto | undefined {
  return resumosCompletos.find((r) => r.slug === slug);
}
