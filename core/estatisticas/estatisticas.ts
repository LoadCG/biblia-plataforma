import { grifosRepository, livrosLidosRepository, notasRepository, progressoRepository } from "../repositories";
import { calcularSequenciaAtual } from "./streak";

export type Estatisticas = {
  livrosLidos: number;
  capitulosLidos: number;
  versiculosGrifados: number;
  notasEscritas: number;
  sequenciaAtual: number;
  minutosEstimados: number;
};

// Estimativa grosseira (não cronometrada de verdade): capítulo bíblico
// médio tem uns 700 palavras, leitura confortável em voz baixa gira em
// torno de 200 palavras/min — dá ~3,5 min por capítulo. É só uma
// referência de "tempo investido", não uma medição precisa.
const MINUTOS_POR_CAPITULO = 3.5;

export async function calcularEstatisticas(ownerId: string): Promise<Estatisticas> {
  const [livros, capitulos, grifos, notas] = await Promise.all([
    livrosLidosRepository.listar(ownerId),
    progressoRepository.listarTodos(ownerId),
    grifosRepository.listarTodos(ownerId),
    notasRepository.listarTodas(ownerId),
  ]);

  return {
    livrosLidos: livros.length,
    capitulosLidos: capitulos.length,
    versiculosGrifados: grifos.length,
    notasEscritas: notas.length,
    sequenciaAtual: calcularSequenciaAtual(capitulos.map((c) => c.lidoEm)),
    minutosEstimados: Math.round(capitulos.length * MINUTOS_POR_CAPITULO),
  };
}

export function formatarMinutos(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const restoMin = minutos % 60;
  return restoMin > 0 ? `${horas}h ${restoMin}min` : `${horas}h`;
}
