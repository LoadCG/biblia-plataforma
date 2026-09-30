import planosJson from "./dados/planos.json";
import type { MetadadosEditoriais } from "./tipos";

export type DiaPlano = {
  dia: number;
  titulo?: string;
  reflexao?: string;
  pergunta?: string;
  referencias: string[];
};

export type PlanoLeitura = {
  id: string;
  titulo: string;
  descricao: string;
  duracaoDias: number;
  dias: DiaPlano[];
  editorial?: MetadadosEditoriais;
};

function metadadosPlanoLegado(id: string, duracaoDias: number): MetadadosEditoriais {
  return {
    id: `plano:${id}`,
    versao: 1,
    status: "publicado",
    tags: ["plano-de-leitura", duracaoDias <= 7 ? "curto" : "formacao"],
    publico: duracaoDias <= 7 ? "iniciante" : "regular",
  };
}

export const planosLeitura: PlanoLeitura[] = planosJson.map((plano) => ({
  ...plano,
  editorial: metadadosPlanoLegado(plano.id, plano.duracaoDias),
}));

export function obterPlano(id: string): PlanoLeitura | undefined {
  return planosLeitura.find((p) => p.id === id);
}

export function obterDiaPlano(planoId: string, dia: number): DiaPlano | undefined {
  return obterPlano(planoId)?.dias.find((item) => item.dia === dia);
}

export function proximoDiaPendente(plano: PlanoLeitura, concluidos: Set<number>): DiaPlano | null {
  return plano.dias.find((dia) => !concluidos.has(dia.dia)) ?? null;
}
