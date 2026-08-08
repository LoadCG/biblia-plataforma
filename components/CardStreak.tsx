import { Text, View } from "react-native";
import { mensagemStreak } from "../core/estatisticas/mensagemStreak";
import { FogoStreak } from "./FogoStreak";

export function CardStreak({ sequencia }: { sequencia: number }) {
  const ativo = sequencia > 0;
  return (
    <View
      className="items-center rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4 mb-4 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <Text className="text-3xl font-extrabold text-cor-texto dark:text-cor-texto-dark">{sequencia}</Text>
      <FogoStreak ativo={ativo} />
      <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1 text-center">
        {mensagemStreak(sequencia)}
      </Text>
    </View>
  );
}
