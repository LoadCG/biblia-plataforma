// Último capítulo lido, persistido por dispositivo — a aba Bíblia abre
// direto nele em vez de numa tela de escolha (mesmo padrão de
// core/leitura/preferenciaFonte.ts). Retorna `null` quando a pessoa
// nunca leu nada ainda — nesse caso a aba Bíblia deve abrir na tela de
// escolher livro, não presumir Gênesis 1.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "ultima-leitura";

export type UltimaLeitura = { livroSlug: string; capitulo: number };

export async function carregarUltimaLeitura(): Promise<UltimaLeitura | null> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return null;
  try {
    const dado = JSON.parse(bruto);
    if (typeof dado?.livroSlug === "string" && typeof dado?.capitulo === "number") return dado;
    return null;
  } catch {
    return null;
  }
}

export function salvarUltimaLeitura(livroSlug: string, capitulo: number): void {
  AsyncStorage.setItem(CHAVE, JSON.stringify({ livroSlug, capitulo })).catch(() => {});
}
