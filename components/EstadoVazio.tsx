import { Pressable, Text, View } from "react-native";

type Props = {
  titulo: string;
  descricao: string;
  acao?: {
    rotulo: string;
    aoPressionar: () => void;
  };
};

// Padrão único de estado vazio, reaproveitado em toda tela que hoje
// (ou no futuro) precisa comunicar "nada aqui ainda" — ver PLANO-NAVEGACAO.md,
// Revisão estratégica item 2: orienta o que fazer, não só informa que
// está vazio.
export function EstadoVazio({ titulo, descricao, acao }: Props) {
  return (
    <View accessibilityRole="summary" className="items-center justify-center py-10 px-6">
      <Text accessibilityRole="header" className="text-cor-texto dark:text-cor-texto-dark font-semibold text-center mb-1">{titulo}</Text>
      <Text accessibilityLiveRegion="polite" className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark text-center">{descricao}</Text>
      {acao ? (
        <Pressable
          onPress={acao.aoPressionar}
          accessibilityRole="button"
          className="mt-4 min-h-11 justify-center rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-2.5 active:opacity-70"
        >
          <Text className="text-center font-semibold text-white dark:text-cor-texto">{acao.rotulo}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
