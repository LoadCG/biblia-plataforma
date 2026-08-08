import { View, Text } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";

// Placeholder da Fase 1 (casca de navegação) — conteúdo real (perfil,
// Salvo, Perseverança, Atividade, Configurações) entra na Fase 5, ver
// PLANO-NAVEGACAO.md.
export default function Voce() {
  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 max-w-2xl w-full mx-auto flex-1">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Você</Text>
          <BotaoTema />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark text-center">
            Em breve: perfil, grifos e notas salvos, sequência de leitura e configurações.
          </Text>
        </View>
      </View>
    </View>
  );
}
