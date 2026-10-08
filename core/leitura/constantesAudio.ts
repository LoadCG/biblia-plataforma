/** Velocidades discretas suportadas pelo player e pelo backup portátil. */
export const VELOCIDADES_AUDIO = [0.9, 1, 1.1] as const;

export function normalizarVelocidadeAudio(valor: string | null | undefined): string | null {
  if (valor == null) return null;
  return VELOCIDADES_AUDIO.some((permitida) => String(permitida) === valor) ? valor : null;
}
