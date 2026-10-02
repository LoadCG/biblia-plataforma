import { Pressable, Text, View } from "react-native";

type Props = {
  titulo: string;
  descricao: string;
  aoTentarNovamente?: () => void;
  rotuloAcao?: string;
};

export function EstadoErro({ titulo, descricao, aoTentarNovamente, rotuloAcao = "Tentar novamente" }: Props) {
  return (
    <View accessibilityRole="alert" className="items-center justify-center py-8 px-6">
      <Text accessibilityRole="header" className="text-cor-texto dark:text-cor-texto-dark font-semibold text-center mb-1">
        {titulo}
      </Text>
      <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark text-center">
        {descricao}
      </Text>
      {aoTentarNovamente ? (
        <Pressable
          onPress={aoTentarNovamente}
          accessibilityRole="button"
          className="mt-4 min-h-11 justify-center rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-4 py-2.5 active:opacity-70"
        >
          <Text className="text-white dark:text-cor-texto font-semibold">{rotuloAcao}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
