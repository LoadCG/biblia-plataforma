import { livros } from "../content/livros";
import type { ReferenciaVersiculo } from "../types/leitura";

export type ReferenciaBiblica = {
  livroSlug: string;
  nomeLivro: string;
  capitulo: number;
  versiculoInicial?: number;
  versiculoFinal?: number;
};

function normalizarNome(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\s]/g, "")
    .toLowerCase();
}

/** Resolve capítulo, versículo ou intervalo e valida o livro/capítulo. */
export function parseReferenciaBiblica(referencia: string): ReferenciaBiblica | null {
  const match = referencia.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;

  const [, nomeInformado, capituloTexto, versiculoInicialTexto, versiculoFinalTexto] = match;
  const nomeNormalizado = normalizarNome(nomeInformado);
  const livro = livros.find(
    (item) => normalizarNome(item.nome) === nomeNormalizado || normalizarNome(item.abreviacao ?? "") === nomeNormalizado
  );
  if (!livro) return null;

  const capitulo = Number(capituloTexto);
  if (!Number.isInteger(capitulo) || capitulo < 1 || capitulo > livro.capitulos) return null;

  const versiculoInicial = versiculoInicialTexto ? Number(versiculoInicialTexto) : undefined;
  const versiculoFinal = versiculoFinalTexto ? Number(versiculoFinalTexto) : versiculoInicial;
  if (versiculoInicial !== undefined && (!Number.isInteger(versiculoInicial) || versiculoInicial < 1)) return null;
  if (versiculoFinal !== undefined && (!Number.isInteger(versiculoFinal) || versiculoFinal < versiculoInicial!)) return null;

  return { livroSlug: livro.slug, nomeLivro: livro.nome, capitulo, versiculoInicial, versiculoFinal };
}

export function hrefReferenciaBiblica(referencia: string): string | null {
  const parsed = parseReferenciaBiblica(referencia);
  if (!parsed) return null;
  const query = parsed.versiculoInicial ? `?versiculo=${parsed.versiculoInicial}` : "";
  return `/biblia/${parsed.livroSlug}/${parsed.capitulo}${query}`;
}

// Resolve uma referência no formato "Livro Capítulo:Versículo[-Versículo]"
// (ex.: "João 3:16", "Provérbios 3:5-6" — mesmo formato de
// REFERENCIAS_CURADAS em versiculoDoDia.ts) pro trio livroSlug/capitulo/
// versiculo que os repositórios (grifos, notas, salvos) esperam. Em
// referências com intervalo, usa sempre o primeiro versículo — mesmo
// padrão já usado na barra de seleção da leitura de capítulo.
export function parseReferenciaVersiculo(referencia: string): ReferenciaVersiculo | null {
  const parsed = parseReferenciaBiblica(referencia);
  if (!parsed?.versiculoInicial) return null;
  return { livroSlug: parsed.livroSlug, capitulo: parsed.capitulo, versiculo: parsed.versiculoInicial };
}
