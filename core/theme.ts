// Tema claro/escuro, persistido por dispositivo. Usa a API nativa do
// NativeWind (aplica a classe "dark" via `colorScheme`), só adicionando
// persistência em cima — sem isso a escolha do usuário se perderia a
// cada abertura do app.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme, useColorScheme } from "nativewind";

const CHAVE_TEMA = "tema-preferido";

export async function restaurarTema(): Promise<void> {
  const salvo = await AsyncStorage.getItem(CHAVE_TEMA);
  if (salvo === "light" || salvo === "dark") colorScheme.set(salvo);
}

export function alternarTema(): void {
  const atual = colorScheme.get();
  const proximo = atual === "dark" ? "light" : "dark";
  colorScheme.set(proximo);
  AsyncStorage.setItem(CHAVE_TEMA, proximo).catch(() => {});
}

export { useColorScheme };
