import catalogo from "./dados/titulosSecao.json";

export type TituloSecao = {
  id: string;
  inicioVersiculo: number;
  fimVersiculo: number;
  titulo: string;
  letraHebraica?: string;
};

type CapituloComTitulos = {
  livroSlug: string;
  capitulo: number;
  tipo: "titulo-da-edicao" | "divisao-editorial";
  fonteId: string;
  status: "rascunho" | "em-revisao" | "aprovado";
  notaEditorial?: string;
  secoes: TituloSecao[];
};

const capitulos = catalogo.capitulos as CapituloComTitulos[];

/** Retorna somente títulos aprovados, em ordem canônica, para um capítulo. */
export function obterTitulosSecao(livroSlug: string, capitulo: number): TituloSecao[] {
  const registro = capitulos.find((item) =>
    item.livroSlug === livroSlug && item.capitulo === capitulo && item.status === "aprovado"
  );
  return registro ? registro.secoes : [];
}

/** Índice por versículo para renderizar os cabeçalhos junto à lista do leitor. */
export function indexarTitulosSecao(secoes: TituloSecao[]): Map<number, TituloSecao> {
  return new Map(secoes.map((secao) => [secao.inicioVersiculo, secao]));
}
