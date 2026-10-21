import { livros } from "../content/livros";
import type { ResultadoBuscaGlobal } from "./BibliaAPI";
import { parseReferenciaBiblica } from "./parseReferencia";

export type SugestaoReferenciaBusca = {
  livroSlug: string;
  nomeLivro: string;
  capitulo: number;
  versiculo: number;
};

/**
 * Retorna um destino direto somente quando a busca atual confirmou o primeiro
 * versículo da referência. Isso evita sugerir capítulos/versículos inexistentes
 * ou referências ocultadas pelos filtros em vigor.
 */
export function obterSugestaoReferenciaBusca(
  consulta: string,
  resultados: ReadonlyArray<Pick<ResultadoBuscaGlobal, "livroSlug" | "capitulo" | "versiculo">>
): SugestaoReferenciaBusca | null {
  const referencia = parseReferenciaBiblica(consulta);
  if (!referencia?.versiculoInicial) return null;

  const livro = livros.find((item) => item.slug === referencia.livroSlug);
  if (!livro?.abreviacao) return null;

  const versiculoEncontrado = resultados.some((resultado) =>
    resultado.livroSlug === livro.abreviacao &&
    resultado.capitulo === referencia.capitulo &&
    resultado.versiculo === referencia.versiculoInicial
  );
  if (!versiculoEncontrado) return null;

  return {
    livroSlug: livro.slug,
    nomeLivro: livro.nome,
    capitulo: referencia.capitulo,
    versiculo: referencia.versiculoInicial,
  };
}
