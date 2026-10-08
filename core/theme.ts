// Tema claro/escuro, persistido por dispositivo. Usa a API nativa do
// NativeWind (aplica a classe "dark" via `colorScheme`), só adicionando
// persistência em cima — sem isso a escolha do usuário se perderia a
// cada abertura do app.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { colorScheme, useColorScheme } from "nativewind";
import { mostrarToast } from "./util/toast";

const CHAVE_TEMA = "tema-preferido";
let temaInicializado = false;
let revisaoTema = 0;
const ouvintesTema = new Set<() => void>();

export function marcarTemaInicializado(): void {
  if (temaInicializado) return;
  temaInicializado = true;
  ouvintesTema.forEach((ouvinte) => ouvinte());
}

export function useTemaInicializado(): boolean {
  return useSyncExternalStore(
    (ouvinte) => {
      ouvintesTema.add(ouvinte);
      return () => { ouvintesTema.delete(ouvinte); };
    },
    () => temaInicializado,
    () => false
  );
}

export async function restaurarTema(opcoes: { ignorarSeAlteradoDuranteLeitura?: boolean } = {}): Promise<void> {
  const revisaoNaLeitura = revisaoTema;
  const salvo = await AsyncStorage.getItem(CHAVE_TEMA);
  if (opcoes.ignorarSeAlteradoDuranteLeitura && revisaoNaLeitura !== revisaoTema) return;
  if (salvo === null) return; // sem escolha salva, respeita o tema inicial do sistema
  colorScheme.set(salvo === "light" || salvo === "dark" ? salvo : "light");
}

export function alternarTema(): void {
  if (!temaInicializado) return;
  revisaoTema += 1;
  const atual = colorScheme.get();
  const proximo = atual === "dark" ? "light" : "dark";
  colorScheme.set(proximo);
  AsyncStorage.setItem(CHAVE_TEMA, proximo).catch(() => {
    mostrarToast("O tema mudou, mas não foi possível salvá-lo para a próxima abertura", { severidade: "erro" });
  });
}

/** Restaura o tema padrão após a exclusão explícita das preferências locais. */
export function restaurarTemaPadrao(): void {
  revisaoTema += 1;
  colorScheme.set("light");
  AsyncStorage.setItem(CHAVE_TEMA, "light").catch(() => {
    mostrarToast("Os dados foram apagados, mas não foi possível salvar o tema padrão", { severidade: "aviso" });
  });
}

export { useColorScheme };
