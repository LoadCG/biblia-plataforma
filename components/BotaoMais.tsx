import { Pressable, Text } from "react-native";
import { IconeUI } from "./icone/IconeUI";

type Props = {
  acessibilidade: string;
  aoPressionar: () => void;
  aberto: boolean;
  rotulo?: string;
  dica?: string;
  desabilitado?: boolean;
  testID?: string;
  className?: string;
  corIcone?: string;
  classeTexto?: string;
};

/** Botão para abrir um menu de ações adicionais, com hit target e estado acessível consistentes. */
export function BotaoMais({
  acessibilidade,
  aoPressionar,
  aberto,
  rotulo,
  dica = "Abre o menu com ações adicionais.",
  desabilitado = false,
  testID,
  className = "",
  corIcone,
  classeTexto = "text-cor-texto-suave dark:text-cor-texto-suave-dark",
}: Props) {
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={acessibilidade}
      accessibilityHint={dica}
      accessibilityState={{ disabled: desabilitado, expanded: aberto }}
      testID={testID}
      className={`min-w-11 min-h-11 rounded-full items-center justify-center active:bg-cor-borda dark:active:bg-cor-borda-dark web:hover:bg-cor-borda/60 dark:web:hover:bg-cor-borda-dark/60 focus-visible:ring-2 focus-visible:ring-cor-destaque ${desabilitado ? "opacity-45" : ""} ${className}`}
    >
      <IconeUI name="more" size={20} color={corIcone} />
      {rotulo ? <Text className={`text-[11px] mt-0.5 ${classeTexto}`}>{rotulo}</Text> : null}
    </Pressable>
  );
}
