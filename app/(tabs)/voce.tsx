import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";
import { CardAtividade } from "../../components/CardAtividade";
import { CardConquistas } from "../../components/CardConquistas";
import { EstadoVazio } from "../../components/EstadoVazio";
import { FogoStreak } from "../../components/FogoStreak";
import { calcularConquistas, type Conquista } from "../../core/content/conquistas";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../../core/estatisticas/atividade";
import { carregarCompartilhamentos } from "../../core/estatisticas/compartilhamentos";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { mensagemStreak } from "../../core/estatisticas/mensagemStreak";
import { livrosLidosRepository, progressoRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

export default function Voce() {
  const ownerId = useOwnerId();
  const [sequencia, setSequencia] = useState(0);
  const [compartilhamentos, setCompartilhamentos] = useState(0);
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);

  const carregarTudo = useCallback(async () => {
    if (!ownerId) return;
    const [lidos, progresso, ativ, compart] = await Promise.all([
      livrosLidosRepository.listar(ownerId),
      progressoRepository.listarTodos(ownerId),
      carregarAtividade(ownerId),
      carregarCompartilhamentos(),
    ]);
    setSequencia(calcularSequenciaAtual(progresso.map((p) => p.lidoEm)));
    setConquistas(calcularConquistas(new Set(lidos)));
    setAtividade(ativ);
    setCompartilhamentos(compart);
  }, [ownerId]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  const recentes = atividade.slice(0, 5);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center">
              <Text className="text-xl">🙂</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark">Visitante</Text>
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Sem conta ainda</Text>
            </View>
          </View>
          <BotaoTema />
        </View>

        <Link href="/salvo" asChild>
          <Pressable className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-4 shadow-sm" style={SOMBRA}>
            <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-2">📌 Salvo</Text>
            {atividade.length === 0 ? (
              <EstadoVazio titulo="Nada salvo ainda" descricao="Toque em ✎ Grifar ou 🗒 Anotar durante a leitura pra ver aqui." />
            ) : (
              recentes
                .slice(0, 3)
                .map((item) => (
                  <Text key={chaveAtividade(item)} numberOfLines={1} className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1">
                    {item.tipo === "grifo" ? "✎ " : item.tipo === "nota" ? "🗒 " : "☆ "}
                    {item.tipo === "pesquisa" ? item.termo : `${item.livroSlug} ${item.capitulo}:${item.versiculo}`}
                  </Text>
                ))
            )}
          </Pressable>
        </Link>

        <View className="flex-row items-center gap-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-3 shadow-sm" style={SOMBRA}>
          <FogoStreak ativo={sequencia > 0} tamanho={28} />
          <View className="flex-1">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Perseverança</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
              {sequencia} {sequencia === 1 ? "dia seguido" : "dias seguidos"} · {mensagemStreak(sequencia)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-4 shadow-sm" style={SOMBRA}>
          <Text className="text-2xl">🔗</Text>
          <View className="flex-1">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Compartilhamentos</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
              {compartilhamentos} {compartilhamentos === 1 ? "vez" : "vezes"}
            </Text>
          </View>
        </View>

        <CardConquistas conquistas={conquistas} />

        <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mt-1 mb-2">Atividade</Text>
        {recentes.length === 0 ? (
          <EstadoVazio titulo="Nenhuma atividade ainda" descricao="Grife, anote ou favorite uma busca pra ver aqui." />
        ) : (
          recentes.map((item) => <CardAtividade key={chaveAtividade(item)} item={item} onMudou={carregarTudo} />)
        )}
        {atividade.length > 5 ? (
          <Link href="/salvo" className="text-sm text-cor-destaque dark:text-cor-destaque-dark self-start mb-4">
            Ver mais
          </Link>
        ) : null}

        <Link href="/configuracoes" asChild>
          <Pressable
            className="flex-row items-center justify-between rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mt-2 shadow-sm"
            style={SOMBRA}
          >
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">⚙️ Configurações</Text>
            <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
