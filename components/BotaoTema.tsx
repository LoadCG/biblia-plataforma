import { Text } from "react-native";
import { IconeUI } from "./icone/IconeUI";
import { alternarTema, useColorScheme, useTemaInicializado } from "../core/theme";
import { ativarComEspaco } from "../core/util/ativarComEspaco";
import { PressableComTecladoWeb } from "../core/util/propsPressableWeb";

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
  const temaPronto = useTemaInicializado();

  if (compacto) {
    return (
      <PressableComTecladoWeb
        onPress={alternarTema}
        onKeyDown={(event) => ativarComEspaco(event, alternarTema)}
        disabled={!temaPronto}
        accessibilityRole="switch"
        accessibilityLabel="Tema escuro"
        accessibilityState={{ checked: escuro, disabled: !temaPronto, busy: !temaPronto }}
        accessibilityChecked={escuro}
        className="w-10 h-10 items-center justify-center active:opacity-60"
      >
        <IconeUI name={escuro ? "sun" : "moon-stars"} size={22} className="text-cor-texto dark:text-cor-texto-dark" />
      </PressableComTecladoWeb>
    );
  }

  return (
    <PressableComTecladoWeb
      onPress={alternarTema}
      onKeyDown={(event) => ativarComEspaco(event, alternarTema)}
      disabled={!temaPronto}
      accessibilityRole="switch"
      accessibilityLabel="Tema escuro"
      accessibilityState={{ checked: escuro, disabled: !temaPronto, busy: !temaPronto }}
      // `accessibilityState` sozinho não vira `aria-checked` nesta versão
      // do react-native-web (0.21.2) — ela só reconhece a prop achatada
      // `accessibilityChecked`, API mais antiga que o RN "de verdade"
      // (nativo) já não usa mais e por isso não está nos tipos. Mantendo
      // os dois: accessibilityState cobre o nativo, accessibilityChecked
      // cobre o web.
      accessibilityChecked={escuro}
      className="px-3 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark active:opacity-70"
    >
      <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
        {escuro ? "☀ Claro" : "☾ Escuro"}
      </Text>
    </PressableComTecladoWeb>
  );
}
