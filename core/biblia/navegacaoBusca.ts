export const ORIGEM_PESQUISA = "pesquisa";

type FiltrosBusca = {
  testamento?: string | string[];
  livroFiltro?: string | string[];
};

type ContextoLeitura = FiltrosBusca & {
  origem?: string | string[];
  consulta?: string | string[];
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

export function hrefRetornoLeitura(
  origem?: string | string[],
  consulta?: string | string[],
  filtros?: FiltrosBusca
): string | null {
  if (primeiroValor(origem) !== ORIGEM_PESQUISA) return null;
  return hrefRetornoBusca(consulta, filtros);
}

export function hrefCapituloLeitura(
  livroSlug: string | undefined,
  capitulo: number,
  contexto?: ContextoLeitura
): string {
  if (!livroSlug) return "/leitura/escolher";

  const href = `/leitura/${livroSlug}/${capitulo}`;
  const origem = primeiroValor(contexto?.origem);
  if (origem === "aba-biblia" || origem === "seletor") return `${href}?origem=${origem}`;
  if (origem !== ORIGEM_PESQUISA) return href;

  const parametros = [`origem=${ORIGEM_PESQUISA}`];
  const consulta = primeiroValor(contexto?.consulta);
  if (consulta) parametros.push(`consulta=${encodeURIComponent(consulta)}`);

  if (contexto?.testamento !== undefined || contexto?.livroFiltro !== undefined) {
    parametros.push(`testamento=${encodeURIComponent(primeiroValor(contexto.testamento) ?? "")}`);
    parametros.push(`livroFiltro=${encodeURIComponent(primeiroValor(contexto.livroFiltro) ?? "")}`);
  }

  return `${href}?${parametros.join("&")}`;
}
