import planosJson from "./dados/planos.json";

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
};

export const planosLeitura: PlanoLeitura[] = planosJson;

export function obterPlano(id: string): PlanoLeitura | undefined {
  return planosLeitura.find((p) => p.id === id);
}

export function obterDiaPlano(planoId: string, dia: number): DiaPlano | undefined {
  return obterPlano(planoId)?.dias.find((item) => item.dia === dia);
}

export function proximoDiaPendente(plano: PlanoLeitura, concluidos: Set<number>): DiaPlano | null {
  return plano.dias.find((dia) => !concluidos.has(dia.dia)) ?? null;
}
