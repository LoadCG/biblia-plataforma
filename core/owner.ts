// Identidade do "dono" dos dados antes de existir login. Gera um UUID uma
// vez por dispositivo e guarda localmente; quando a conta de usuário
// existir, é só trocar esse valor pelo ID real e re-associar os
// registros — as tabelas/tipos já nascem preparados para isso (ver
// core/types/leitura.ts e o plano em PLANO-PLATAFORMA.md, Decisão 2).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const CHAVE_OWNER_ID = "owner-id-anonimo";

let cache: string | null = null;

export async function obterOwnerId(): Promise<string> {
  if (cache) return cache;

  const existente = await AsyncStorage.getItem(CHAVE_OWNER_ID);
  if (existente) {
    cache = existente;
    return existente;
  }

  const novo = randomUUID();
  await AsyncStorage.setItem(CHAVE_OWNER_ID, novo);
  cache = novo;
  return novo;
}
