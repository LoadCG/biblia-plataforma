import { Pressable, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { alternarTema, useColorScheme } from "../core/theme";

type Props = {
  // Versão só com ícone (sem o texto "☀ Claro"/"☾ Escuro"), pensada pra
  // cabeçalhos apertados no mobile — mesmo padrão que apps como
  // YouVersion/Kindle usam pra alternar tema num espaço de toolbar
  // compartilhado com outros botões, em vez do texto completo cabendo
  // só em telas de configuração dedicadas. Ver `FUNCIONALIDADES.md`
  // 2.2 (achado real de overflow horizontal no cabeçalho da leitura,
  // 2026-08-20).
  compacto?: boolean;
};

export function BotaoTema({ compacto = false }: Props) {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";

  if (compacto) {
    return (
      <Pressable
        onPress={alternarTema}
        accessibilityRole="switch"
        accessibilityLabel="Tema escuro"
        accessibilityState={{ checked: escuro }}
        // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
        accessibilityChecked={escuro}
        className="w-10 h-10 items-center justify-center active:opacity-60"
      >
        <MaterialIcons name={escuro ? "light-mode" : "dark-mode"} size={22} className="text-cor-texto dark:text-cor-texto-dark" />
      </Pressable>
    );
  }

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
