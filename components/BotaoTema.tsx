import { Pressable, Text } from "react-native";
import { alternarTema, useColorScheme } from "../core/theme";

export function BotaoTema() {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";

  return (
    <Pressable
      onPress={alternarTema}
      accessibilityLabel={escuro ? "Usar tema claro" : "Usar tema escuro"}
      className="px-3 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark active:opacity-70"
    >
      <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
        {escuro ? "☀ Claro" : "☾ Escuro"}
      </Text>
    </Pressable>
  );
}
