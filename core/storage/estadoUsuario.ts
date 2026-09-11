import AsyncStorage from "@react-native-async-storage/async-storage";

// Estado personalizado fora dos repositórios de domínio. Cache da Bíblia
// não entra aqui: é dado técnico regenerável, não conteúdo do usuário.
export const CHAVES_ESTADO_USUARIO = [
  "ultima-leitura",
  "tamanho-fonte-leitura",
  "fonte-serifada-leitura",
  "tema-preferido",
  "lembrete-diario-ativo",
  "compartilhamentos",
  "onboarding-versao",
  "dicas-contextuais",
] as const;

export async function coletarEstadoUsuario(): Promise<Record<string, string | null>> {
  const pares = await AsyncStorage.multiGet([...CHAVES_ESTADO_USUARIO]);
  return Object.fromEntries(pares);
}

export async function apagarEstadoUsuario(): Promise<void> {
  await AsyncStorage.multiRemove([...CHAVES_ESTADO_USUARIO]);
}
