import { planosLeitura } from "./planos";
import { resumosCompletos } from "./livros";
import type { MetadadosEditoriais } from "./tipos";

export type ItemManifestoEditorial = MetadadosEditoriais & {
  tipo: "resumo" | "plano";
  slug: string;
  titulo: string;
};

function metadadosResumo(slug: string, genero: string, testamento: string): MetadadosEditoriais {
  return {
    id: `resumo:${slug}`,
    versao: 1,
    status: "publicado",
    tags: [genero.toLowerCase(), testamento === "Antigo Testamento" ? "antigo-testamento" : "novo-testamento"],
    publico: "contexto",
  };
}

export const manifestoEditorial: ItemManifestoEditorial[] = [
  ...resumosCompletos.map((livro) => ({
    ...metadadosResumo(livro.slug, livro.genero, livro.testamento),
    tipo: "resumo" as const,
    slug: livro.slug,
    titulo: livro.nome,
  })),
  ...planosLeitura.map((plano) => ({
    ...plano.editorial!,
    tipo: "plano" as const,
    slug: plano.id,
    titulo: plano.titulo,
  })),
];

export function validarManifestoEditorial(itens: ItemManifestoEditorial[]): string[] {
  const erros: string[] = [];
  const ids = new Set<string>();
  for (const item of itens) {
    if (ids.has(item.id)) erros.push(`ID duplicado: ${item.id}`);
    ids.add(item.id);
    if (!item.slug.trim() || !item.titulo.trim()) erros.push(`metadado vazio: ${item.id}`);
    if (!Number.isInteger(item.versao) || item.versao < 1) erros.push(`versão inválida: ${item.id}`);
    if (item.tags.length === 0 || new Set(item.tags).size !== item.tags.length) erros.push(`tags inválidas: ${item.id}`);
  }
  return erros;
}
