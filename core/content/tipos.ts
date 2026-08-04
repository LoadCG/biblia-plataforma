// Tipos do conteúdo fixo (livros, resumos históricos). Os dados em si
// vêm de core/content/dados/livros.json, gerado por
// scripts/gerar-conteudo.js a partir de resumos-biblicos/**/*.md — nunca
// editar o .json à mão, sempre editar o .md e rodar o script de novo.

export type Livro = {
  slug: string;
  nome: string;
  numero: number;
  testamento: "Antigo Testamento" | "Novo Testamento";
  capitulos: number;
  genero: string;
};

export type FichaItem = {
  rotulo: string;
  valor: string;
};

export type Secao = {
  id: string;
  titulo: string;
  lista: boolean;
  paragrafos: string[];
  itens: string[];
};

export type ResumoCompleto = Livro & {
  tempoLeituraMin: number;
  fichaRapida: FichaItem[];
  secoes: Secao[];
};
