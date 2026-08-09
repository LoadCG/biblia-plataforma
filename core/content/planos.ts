import planosJson from "./dados/planos.json";

export type DiaPlano = {
  dia: number;
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
