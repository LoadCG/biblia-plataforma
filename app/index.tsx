import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
      <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark text-center">
        Resumo dos 66 Livros da Bíblia
      </Text>
      <Text className="mt-2 text-base text-cor-texto-suave dark:text-cor-texto-suave-dark text-center">
        Estrutura inicial da plataforma (Expo Router + NativeWind).
      </Text>
    </View>
  );
}
