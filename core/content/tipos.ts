// Tipos do conteúdo fixo (livros, capítulos, resumos). Os dados em si
// (os 66 resumos e a tabela de capítulos por livro) ainda não foram
// portados do projeto atual — ver TODO em core/content/livros.ts.

export type Livro = {
  slug: string;
  nome: string;
  numero: number;
  testamento: "Antigo Testamento" | "Novo Testamento";
  capitulos: number;
  genero: string;
};
