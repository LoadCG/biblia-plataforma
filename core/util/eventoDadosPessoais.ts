const ouvintes = new Set<() => void>();

export function observarRestauracaoDados(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function notificarRestauracaoDadosConcluida() {
  for (const ouvinte of ouvintes) ouvinte();
}
