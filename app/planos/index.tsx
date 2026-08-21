import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { planosLeitura, type PlanoLeitura } from "../../core/content/planos";
import { planosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

function CardPlano({ plano, diasConcluidos }: { plano: PlanoLeitura; diasConcluidos: number }) {
  const progresso = plano.duracaoDias > 0 ? Math.min(1, diasConcluidos / plano.duracaoDias) : 0;
  const concluido = diasConcluidos >= plano.duracaoDias;

  return (
    <Link href={`/planos/${plano.id}`} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={plano.titulo} className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4 mb-3 shadow-sm active:opacity-80" style={SOMBRA}>
        <View className="flex-row items-start justify-between mb-1">
          <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark flex-1 pr-2">{plano.titulo}</Text>
          {concluido ? <MaterialIcons name="check-circle" size={20} color="#287a45" /> : null}
        </View>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3" numberOfLines={2}>
          {plano.descricao}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-1 h-1.5 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
            <View className="h-1.5 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
          </View>
          <Text className="text-[11px] font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {diasConcluidos}/{plano.duracaoDias} dias
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function Planos() {
  const ownerId = useOwnerId();
  const [progressoPorPlano, setProgressoPorPlano] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!ownerId) return;
    Promise.all(
      planosLeitura.map((plano) =>
        planosRepository.listarDiasConcluidos(ownerId, plano.id).then((dias) => [plano.id, dias.length] as const)
      )
    ).then((pares) => setProgressoPorPlano(Object.fromEntries(pares)));
  }, [ownerId]);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          {/* /planos é acessível tanto da Início quanto de Descubra
              (ver TODO.md, item 6 do backlog de UI) — "← Voltar" com
              router.back() reflete de onde a pessoa realmente veio, em
              vez de fixar um destino que pode estar errado pra metade
              dos casos. Cai pra Início só se não houver histórico
              (ex.: URL aberta direto). */}
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            accessibilityRole="button"
          >
            <Text className="text-cor-destaque dark:text-cor-destaque-dark text-sm">← Voltar</Text>
          </Pressable>
          <BotaoTema />
        </View>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Planos de leitura</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Trilhas guiadas pela Bíblia, um dia de cada vez.
        </Text>

        {planosLeitura.map((plano) => (
          <CardPlano key={plano.id} plano={plano} diasConcluidos={progressoPorPlano[plano.id] ?? 0} />
        ))}
      </View>
    </ScrollView>
  );
}
