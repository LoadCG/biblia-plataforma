// Preferências de fonte de leitura (tamanho e família), persistidas por
// dispositivo. Compartilhadas entre a leitura de capítulo e a leitura de
// resumo — é a mesma preferência de conforto de leitura, não algo que
// faça sentido configurar duas vezes. Pensado pra ser o módulo que a
// futura tela de Configurações vai ler/escrever também (ver
// PLANO-NAVEGACAO.md), não só os controles A-/A+ inline de cada tela.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const CHAVE_TAMANHO = "tamanho-fonte-leitura";
const CHAVE_SERIFADA = "fonte-serifada-leitura";

export const TAMANHOS_FONTE = [15, 17, 19] as const;
export const INDICE_PADRAO = 1;

export async function carregarIndiceFonte(): Promise<number> {
  const salvo = await AsyncStorage.getItem(CHAVE_TAMANHO);
  const indice = salvo ? parseInt(salvo, 10) : NaN;
  return indice >= 0 && indice < TAMANHOS_FONTE.length ? indice : INDICE_PADRAO;
}

export function salvarIndiceFonte(indice: number): void {
  AsyncStorage.setItem(CHAVE_TAMANHO, String(indice)).catch(() => {});
}

// Fonte serifada usa as fontes de sistema (Georgia no iOS/web, "serif"
// genérica no Android) em vez de baixar uma fonte customizada via
// expo-font — evita a complexidade de carregamento assíncrono de fonte
// e de rebuild nativo por enquanto, já que hoje só o web está publicado.
// Se um dia isso não for suficiente (ex.: consistência visual entre
// plataformas importar mais que o custo), trocar por uma fonte
// carregada via @expo-google-fonts é a extensão natural.
export const FAMILIA_SERIFADA = Platform.select({
  web: 'Georgia, "Times New Roman", serif',
  ios: "Georgia",
  default: "serif",
});

export async function carregarFonteSerifada(): Promise<boolean> {
  return (await AsyncStorage.getItem(CHAVE_SERIFADA)) === "1";
}

export function salvarFonteSerifada(ativa: boolean): void {
  AsyncStorage.setItem(CHAVE_SERIFADA, ativa ? "1" : "0").catch(() => {});
}
