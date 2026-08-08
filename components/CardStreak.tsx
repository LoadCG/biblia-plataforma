import { Text, View } from "react-native";
import { mensagemStreak } from "../core/estatisticas/mensagemStreak";
import { FogoStreak } from "./FogoStreak";

export function CardStreak({ sequencia }: { sequencia: number }) {
  const ativo = sequencia > 0;
  return (
    <View
      className="flex-row items-center justify-between rounded-3xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-5 py-4 mb-4 shadow-sm"
    >
      <View className="flex-1 mr-4">
        <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark mb-1">
          Sequência Diária
        </Text>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark leading-tight">
          {mensagemStreak(sequencia)}
        </Text>
      </View>
      <View className="items-center justify-center bg-cor-borda dark:bg-cor-borda-dark rounded-full w-16 h-16 border-2 border-cor-destaque/30">
        <Text className="text-xl font-black text-cor-texto dark:text-cor-texto-dark">{sequencia}</Text>
        <View className="-mt-1">
          <FogoStreak ativo={ativo} />
        </View>
      </View>
    </View>
  );
}
