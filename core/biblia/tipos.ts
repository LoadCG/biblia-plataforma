export type VersiculoTexto = {
  numero: number;
  texto: string;
};

export type CapituloTexto = {
  referencia: string;
  texto: string;
  versiculos: VersiculoTexto[] | null;
};
