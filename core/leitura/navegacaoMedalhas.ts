export type OrigemMedalhas = "inicio" | "voce";

export type DestinoVoltaMedalhas = "/" | "/voce" | {
  pathname: "/medalhas";
  params: { origem: OrigemMedalhas };
};

/** Aceita somente uma origem interna conhecida; links diretos e parâmetros inválidos voltam ao Perfil. */
export function normalizarOrigemMedalhas(origem: string | string[] | undefined): OrigemMedalhas {
  return origem === "inicio" ? "inicio" : "voce";
}

/** Detalhes retornam à lista; a lista retorna ao ponto de entrada mais seguro. */
export function obterDestinoVoltaMedalhas(
  origem: OrigemMedalhas,
  estaNoDetalhe: boolean,
): DestinoVoltaMedalhas {
  if (estaNoDetalhe) return { pathname: "/medalhas", params: { origem } };
  return origem === "inicio" ? "/" : "/voce";
}
