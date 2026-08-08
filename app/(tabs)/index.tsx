import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CardConquistas } from "../../components/CardConquistas";
import { CardStreak } from "../../components/CardStreak";
import { CardVersiculoDia } from "../../components/CardVersiculoDia";
import { BotaoTema } from "../../components/BotaoTema";
import { calcularConquistas } from "../../core/content/conquistas";
import { livros } from "../../core/content/livros";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { livrosLidosRepository, progressoRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

export default function Inicio() {
  const ownerId = useOwnerId();
  const [lidos, setLidos] = useState<string[]>([]);
  const [sequencia, setSequencia] = useState(0);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
    progressoRepository.listarTodos(ownerId).then((itens) => {
      setSequencia(calcularSequenciaAtual(itens.map((i) => i.lidoEm)));
    });
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const conquistas = useMemo(() => calcularConquistas(lidosSet), [lidosSet]);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-start justify-between mb-4">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark flex-1 mr-3">
            Resumo dos 66 Livros da Bíblia
          </Text>
          <BotaoTema />
        </View>

        <CardVersiculoDia />

        <Link href="/resumos" asChild>
          <Pressable
            className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4 mb-4 shadow-sm"
            style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
          >
            <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark">📚 Estude por resumos</Text>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
              66 Livros bíblicos · {lidos.length} de {livros.length} lidos
            </Text>
          </Pressable>
        </Link>

        <CardStreak sequencia={sequencia} />

        <CardConquistas conquistas={conquistas} />

        <Link href="/estatisticas" className="text-xs text-cor-destaque dark:text-cor-destaque-dark self-start">
          Minhas estatísticas
        </Link>
      </View>
    </ScrollView>
  );
}
