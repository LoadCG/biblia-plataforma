export function aplicarIntervaloCapitulos(
  selecionados: Set<number>,
  inicio: number,
  fim: number,
): Set<number> {
  const novo = new Set(selecionados);
  const adicionar = !selecionados.has(inicio);
  for (let capitulo = Math.min(inicio, fim); capitulo <= Math.max(inicio, fim); capitulo++) {
    if (adicionar) novo.add(capitulo);
    else novo.delete(capitulo);
  }
  return novo;
}
