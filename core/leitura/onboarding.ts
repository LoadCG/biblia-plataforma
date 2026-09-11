import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_VERSAO = "onboarding-versao";
const CHAVE_DICAS = "dicas-contextuais";
export const VERSAO_ONBOARDING = 1;

export async function onboardingConcluido(): Promise<boolean> {
  return Number(await AsyncStorage.getItem(CHAVE_VERSAO)) >= VERSAO_ONBOARDING;
}

export async function concluirOnboarding(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_VERSAO, String(VERSAO_ONBOARDING));
}

export async function reiniciarOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_VERSAO);
}

async function lerDicas(): Promise<string[]> {
  try { return JSON.parse((await AsyncStorage.getItem(CHAVE_DICAS)) ?? "[]") as string[]; } catch { return []; }
}

export async function dicaJaVista(id: string): Promise<boolean> {
  return (await lerDicas()).includes(id);
}

export async function marcarDicaVista(id: string): Promise<void> {
  const atuais = await lerDicas();
  if (!atuais.includes(id)) await AsyncStorage.setItem(CHAVE_DICAS, JSON.stringify([...atuais, id]));
}
