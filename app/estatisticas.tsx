import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { calcularEstatisticas, formatarMinutos, type Estatisticas } from "../core/estatisticas/estatisticas";
import { useOwnerId } from "../core/useOwnerId";

function Cartao({ numero, rotulo }: { numero: string | number; rotulo: string }) {
  return (
    <View className="w-[48%] min-w-[140px] rounded-xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4">
      <Text className="text-2xl font-bold text-cor-destaque dark:text-cor-destaque-dark">{numero}</Text>
      <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">{rotulo}</Text>
    </View>
  );
}

export default function MinhasEstatisticas() {
  const ownerId = useOwnerId();
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);

  useEffect(() => {
    if (!ownerId) return;
    calcularEstatisticas(ownerId).then(setEstatisticas);
  }, [ownerId]);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Início
          </Link>
          <BotaoTema />
        </View>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Minhas estatísticas</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Um resumo do seu ritmo de leitura, só pra você.
        </Text>

        {!estatisticas ? null : (
          <View className="flex-row flex-wrap gap-3">
            <Cartao numero={estatisticas.livrosLidos} rotulo="livros lidos" />
            <Cartao numero={estatisticas.capitulosLidos} rotulo="capítulos lidos" />
            <Cartao numero={estatisticas.versiculosGrifados} rotulo="versículos grifados" />
            <Cartao numero={estatisticas.notasEscritas} rotulo="notas escritas" />
            <Cartao numero={formatarMinutos(estatisticas.minutosEstimados)} rotulo="tempo estimado de leitura" />
            {estatisticas.sequenciaAtual >= 2 ? (
              <Cartao numero={estatisticas.sequenciaAtual} rotulo="dias seguidos lendo" />
            ) : null}
          </View>
        )}

        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-6">
          O tempo de leitura é uma estimativa (não cronometrada), calculada
          pela quantidade de capítulos lidos.
        </Text>
      </View>
    </ScrollView>
  );
}
