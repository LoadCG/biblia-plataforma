export function calcularColunasGradeCapitulos(largura: number, totalCapitulos: number): number {
  const base = largura < 360 ? 5 : largura < 480 ? 6 : largura < 720 ? 8 : largura < 1024 ? 10 : 12;
  return Math.max(1, Math.min(base, totalCapitulos));
}
