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

const CHAVES_RESTAURAVEIS = [
  "ultima-leitura",
  "tamanho-fonte-leitura",
  "fonte-serifada-leitura",
  "tema-preferido",
] as const;

export async function coletarEstadoUsuario(): Promise<Record<string, string | null>> {
  const pares = await AsyncStorage.multiGet([...CHAVES_ESTADO_USUARIO]);
  return Object.fromEntries(pares);
}

export async function apagarEstadoUsuario(): Promise<void> {
  await AsyncStorage.multiRemove([...CHAVES_ESTADO_USUARIO]);
}

/** Restaura apenas preferências portáteis, mantendo notificações e estado do app neste dispositivo. */
export async function aplicarPreferenciasRestauraveis(preferencias: Record<string, string | null>): Promise<void> {
  const gravar: [string, string][] = [];
  const remover: string[] = [];
  for (const chave of CHAVES_RESTAURAVEIS) {
    const valor = preferencias[chave];
    if (typeof valor === "string") gravar.push([chave, valor]);
    else remover.push(chave);
  }
  if (gravar.length > 0) await AsyncStorage.multiSet(gravar);
  if (remover.length > 0) await AsyncStorage.multiRemove(remover);
}
