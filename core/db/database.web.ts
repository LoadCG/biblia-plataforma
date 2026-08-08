// Stub para web: não carrega expo-sqlite
// Toda a persistência nativa usará o AsyncStorage na web.
export const db = {} as any;

export function initDB() {
  console.log("Web: Inicialização do SQLite mockada.");
}

export async function garantirBaseBiblia() {
  // Na web não carregaremos a bíblia offline via SQLite para evitar crash do wasm
  return;
}
