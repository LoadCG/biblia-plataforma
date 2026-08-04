// Identidade do "dono" dos dados antes de existir login. Gera um UUID uma
// vez por dispositivo e guarda localmente; quando a conta de usuário
// existir, é só trocar esse valor pelo ID real e re-associar os
// registros — as tabelas/tipos já nascem preparados para isso (ver
// core/types/leitura.ts e o plano em PLANO-PLATAFORMA.md, Decisão 2).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const CHAVE_OWNER_ID = "owner-id-anonimo";

let cache: string | null = null;
let emAndamento: Promise<string> | null = null;

export function obterOwnerId(): Promise<string> {
  if (cache) return Promise.resolve(cache);
  // Deduplica chamadas concorrentes (ex.: duas telas montando ao mesmo
  // tempo no primeiro load) — sem isso, ambas gerariam UUIDs diferentes
  // e a segunda escrita apagaria o ID que a primeira já tinha em uso.
  if (!emAndamento) emAndamento = resolverOwnerId();
  return emAndamento;
}

async function resolverOwnerId(): Promise<string> {
  const existente = await AsyncStorage.getItem(CHAVE_OWNER_ID);
  const id = existente ?? randomUUID();
  if (!existente) await AsyncStorage.setItem(CHAVE_OWNER_ID, id);
  cache = id;
  return id;
}
