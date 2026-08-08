// Último capítulo lido, persistido por dispositivo — a aba Bíblia abre
// direto nele em vez de numa tela de escolha (mesmo padrão de
// core/leitura/preferenciaFonte.ts).
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "ultima-leitura";

export type UltimaLeitura = { livroSlug: string; capitulo: number };

const PADRAO: UltimaLeitura = { livroSlug: "01-genesis", capitulo: 1 };

export async function carregarUltimaLeitura(): Promise<UltimaLeitura> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return PADRAO;
  try {
    const dado = JSON.parse(bruto);
    if (typeof dado?.livroSlug === "string" && typeof dado?.capitulo === "number") return dado;
    return PADRAO;
  } catch {
    return PADRAO;
  }
}

export function salvarUltimaLeitura(livroSlug: string, capitulo: number): void {
  AsyncStorage.setItem(CHAVE, JSON.stringify({ livroSlug, capitulo })).catch(() => {});
}
