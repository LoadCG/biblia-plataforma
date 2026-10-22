export const ORIGEM_PESQUISA = "pesquisa";

type FiltrosBusca = {
  testamento?: string | string[];
  livroFiltro?: string | string[];
};

export function filtrosBuscaDiferem(
  atuais: { testamento: string; livroFiltro?: string },
  novos: { testamento: string; livroFiltro?: string }
): boolean {
  return atuais.testamento !== novos.testamento || atuais.livroFiltro !== novos.livroFiltro;
}

function primeiroValor(valor?: string | string[]): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

export function hrefResultadoBusca(
  livroSlug: string,
  capitulo: number,
  versiculo: number,
  consulta: string,
  filtros?: FiltrosBusca
): string {
  const query = `versiculo=${versiculo}&origem=${ORIGEM_PESQUISA}&consulta=${encodeURIComponent(consulta)}`;
  if (!filtros) return `/leitura/${livroSlug}/${capitulo}?${query}`;

  const testamento = primeiroValor(filtros.testamento);
  const livroFiltro = primeiroValor(filtros.livroFiltro) ?? "";
  return `/leitura/${livroSlug}/${capitulo}?${query}&testamento=${encodeURIComponent(testamento ?? "")}&livroFiltro=${encodeURIComponent(livroFiltro)}`;
}

export function hrefRetornoBusca(consulta?: string | string[], filtros?: FiltrosBusca): string {
  const valor = primeiroValor(consulta);
  const parametros: string[] = [];
  if (valor) parametros.push(`consulta=${encodeURIComponent(valor)}`);

  if (filtros) {
    parametros.push(`testamento=${encodeURIComponent(primeiroValor(filtros.testamento) ?? "")}`);
    parametros.push(`livroFiltro=${encodeURIComponent(primeiroValor(filtros.livroFiltro) ?? "")}`);
  }

  return parametros.length ? `/pesquisa?${parametros.join("&")}` : "/pesquisa";
}
