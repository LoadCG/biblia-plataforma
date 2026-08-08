import { Text, View } from "react-native";

type Props = {
  titulo: string;
  descricao: string;
};

// Padrão único de estado vazio, reaproveitado em toda tela que hoje
// (ou no futuro) precisa comunicar "nada aqui ainda" — ver PLANO-NAVEGACAO.md,
// Revisão estratégica item 2: orienta o que fazer, não só informa que
// está vazio.
export function EstadoVazio({ titulo, descricao }: Props) {
  return (
    <View className="items-center justify-center py-10 px-6">
      <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-center mb-1">{titulo}</Text>
      <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark text-center">{descricao}</Text>
    </View>
  );
}
