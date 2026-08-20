import { Pressable, Text } from "react-native";
import { alternarTema, useColorScheme } from "../core/theme";

export function BotaoTema() {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";

  return (
    <Pressable
      onPress={alternarTema}
      accessibilityRole="switch"
      accessibilityLabel="Tema escuro"
      accessibilityState={{ checked: escuro }}
      // `accessibilityState` sozinho não vira `aria-checked` nesta versão
      // do react-native-web (0.21.2) — ela só reconhece a prop achatada
      // `accessibilityChecked`, API mais antiga que o RN "de verdade"
      // (nativo) já não usa mais e por isso não está nos tipos. Mantendo
      // os dois: accessibilityState cobre o nativo, accessibilityChecked
      // cobre o web.
      // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
      accessibilityChecked={escuro}
      className="px-3 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark active:opacity-70"
    >
      <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
        {escuro ? "☀ Claro" : "☾ Escuro"}
      </Text>
    </Pressable>
  );
}
