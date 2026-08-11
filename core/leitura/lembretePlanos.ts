import type { PlanoLeitura } from "../content/planos";
import { planosRepository } from "../repositories";

export type LembretePlano = {
  plano: PlanoLeitura;
  diasConcluidos: number;
  diasSemAvancar: number;
};

// Retorna o plano em andamento (começado, não terminado) que a pessoa
// não avança há mais tempo — ou null se nenhum plano estiver nessa
// condição. "Em andamento" exige pelo menos 1 dia concluído; um plano
// nunca iniciado não é lembrete, é descoberta (fica só na tela de
// Planos). O corte de 1 dia sem avançar evita lembrete no mesmo dia em
// que a pessoa já concluiu algo.
export async function obterLembretePlano(ownerId: string, planos: PlanoLeitura[]): Promise<LembretePlano | null> {
  const candidatos = await Promise.all(
    planos.map(async (plano) => {
      const [diasConcluidos, ultimaConclusao] = await Promise.all([
        planosRepository.listarDiasConcluidos(ownerId, plano.id),
        planosRepository.obterUltimaConclusao(ownerId, plano.id),
      ]);
      if (diasConcluidos.length === 0 || diasConcluidos.length >= plano.duracaoDias || !ultimaConclusao) {
        return null;
      }
      const diasSemAvancar = Math.floor((Date.now() - new Date(ultimaConclusao).getTime()) / (1000 * 60 * 60 * 24));
      if (diasSemAvancar < 1) return null;
      return { plano, diasConcluidos: diasConcluidos.length, diasSemAvancar };
    })
  );

  const emAtraso = candidatos.filter((c): c is LembretePlano => c !== null);
  if (emAtraso.length === 0) return null;

  return emAtraso.reduce((mais, atual) => (atual.diasSemAvancar > mais.diasSemAvancar ? atual : mais));
}
