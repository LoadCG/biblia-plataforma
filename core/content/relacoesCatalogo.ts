import { resumosCompletos } from "./livros";
import { manifestoEditorial } from "./manifesto";
import { planosLeitura } from "./planos";
import { validarRelacoesEditorial, type RelacaoEditorial } from "./relacoes";

const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const resumoPorNome = new Map(resumosCompletos.map((livro) => [normalizar(livro.nome), livro.slug]));

const relacoesPlanos: RelacaoEditorial[] = planosLeitura.flatMap((plano) => {
  const livrosReferenciados = new Set(
    plano.dias.flatMap((dia) => dia.referencias.map((referencia) => referencia.match(/^(.+?)\s+\d+/)?.[1]))
      .filter((nome): nome is string => Boolean(nome)),
  );

  return [...livrosReferenciados].map((nomeLivro) => ({
    origem: plano.editorial!.id,
    destino: `resumo:${resumoPorNome.get(normalizar(nomeLivro)) ?? normalizar(nomeLivro)}`,
    tipo: "plano-livro",
    motivo: "livro incluído nas leituras deste plano",
  }));
});

export const relacoesCatalogo: RelacaoEditorial[] = relacoesPlanos;

export const errosRelacoesCatalogo = validarRelacoesEditorial(
  relacoesCatalogo,
  new Set(manifestoEditorial.map((item) => item.id)),
);
