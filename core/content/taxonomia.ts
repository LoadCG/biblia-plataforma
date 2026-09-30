import type { Livro } from "./tipos";

export const statusEditorial = ["rascunho", "em-revisao", "aprovado", "publicado", "arquivado"] as const;
export const publicosEditoriais = ["iniciante", "regular", "tematico", "contexto"] as const;
export const temasEditoriais = [
  "criação", "aliança", "libertação", "sabedoria", "oração", "justiça",
  "profecia", "evangelho", "comunidade", "esperança", "perseverança",
] as const;

export function metadadosLegadosDoLivro(livro: Livro) {
  return {
    id: `resumo:${livro.slug}`,
    versao: 1,
    status: "publicado" as const,
    tags: [livro.genero.toLowerCase(), livro.testamento === "Antigo Testamento" ? "antigo-testamento" : "novo-testamento"],
    publico: "contexto" as const,
  };
}
