import { manifestoEditorial } from "./manifesto";
import { validarRelacoesEditorial, type RelacaoEditorial } from "./relacoes";

export const relacoesCatalogo: RelacaoEditorial[] = [
  { origem: "plano:sabedoria-7", destino: "resumo:19-salmos", tipo: "plano-livro", motivo: "leituras centrais do plano de sabedoria" },
  { origem: "plano:sabedoria-7", destino: "resumo:20-proverbios", tipo: "plano-livro", motivo: "leituras centrais do plano de sabedoria" },
  { origem: "plano:evangelhos-14", destino: "resumo:40-mateus", tipo: "plano-livro", motivo: "primeiro bloco narrativo do plano dos Evangelhos" },
  { origem: "plano:evangelhos-14", destino: "resumo:41-marcos", tipo: "plano-livro", motivo: "segundo bloco narrativo do plano dos Evangelhos" },
  { origem: "plano:evangelhos-14", destino: "resumo:42-lucas", tipo: "plano-livro", motivo: "terceiro bloco narrativo do plano dos Evangelhos" },
  { origem: "plano:evangelhos-14", destino: "resumo:43-joao", tipo: "plano-livro", motivo: "quarto bloco narrativo do plano dos Evangelhos" },
];

export const errosRelacoesCatalogo = validarRelacoesEditorial(
  relacoesCatalogo,
  new Set(manifestoEditorial.map((item) => item.id)),
);
