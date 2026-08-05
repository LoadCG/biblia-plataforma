// Tamanho de fonte de leitura, persistido por dispositivo. Compartilhado
// entre a leitura de capítulo e a leitura de resumo — é uma preferência
// de conforto de leitura, não algo que faça sentido configurar duas vezes.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "tamanho-fonte-leitura";

export const TAMANHOS_FONTE = [15, 17, 19] as const;
export const INDICE_PADRAO = 1;

export async function carregarIndiceFonte(): Promise<number> {
  const salvo = await AsyncStorage.getItem(CHAVE);
  const indice = salvo ? parseInt(salvo, 10) : NaN;
  return indice >= 0 && indice < TAMANHOS_FONTE.length ? indice : INDICE_PADRAO;
}

export function salvarIndiceFonte(indice: number): void {
  AsyncStorage.setItem(CHAVE, String(indice)).catch(() => {});
}
