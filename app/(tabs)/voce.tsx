import { Link, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { CardAtividade } from "../../components/CardAtividade";
import { EstadoVazio } from "../../components/EstadoVazio";
import { FogoStreak } from "../../components/FogoStreak";
import { obterLivro } from "../../core/content/livros";
import { calcularConquistas, type Conquista } from "../../core/content/conquistas";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../../core/estatisticas/atividade";
import { carregarCompartilhamentos } from "../../core/estatisticas/compartilhamentos";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { mensagemStreak } from "../../core/estatisticas/mensagemStreak";
import { livrosLidosRepository, progressoRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

// Cards de gamificação usam um fundo escuro/metalizado fixo — proposital,
// não segue o tema claro/escuro do resto do app (padrão comum em
// dashboards de gamificação: o "troféu" tem identidade visual própria).
const COR_GAMIFICACAO = { fundo: "#241d16", fundoClaro: "#332920", destaque: "#e0a75e", textoSuave: "#b8a690" };

function MedalhaCarrossel({ conquista }: { conquista: Conquista }) {
  const progresso = conquista.progressoTotal > 0 ? Math.min(1, conquista.progressoAtual / conquista.progressoTotal) : 0;

  return (
    <View className="w-28 mr-3 items-center">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: conquista.conquistada ? COR_GAMIFICACAO.destaque : COR_GAMIFICACAO.fundoClaro }}
      >
        <Text style={{ fontSize: 26, opacity: conquista.conquistada ? 1 : 0.4 }}>{conquista.icone}</Text>
      </View>
      <Text numberOfLines={1} className="text-xs font-bold text-white text-center mb-1.5">
        {conquista.titulo}
      </Text>
      <View className="w-full h-1.5 rounded-full" style={{ backgroundColor: COR_GAMIFICACAO.fundoClaro }}>
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${progresso * 100}%`, backgroundColor: COR_GAMIFICACAO.destaque }}
        />
      </View>
      <Text style={{ color: COR_GAMIFICACAO.textoSuave }} className="text-[10px] mt-1">
        {conquista.progressoAtual}/{conquista.progressoTotal}
      </Text>
    </View>
  );
}

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
        <View className="flex-row items-center justify-end gap-3 mb-2">
          <BotaoTema />
          <Link href="/configuracoes" asChild>
            <Pressable
              accessibilityLabel="Configurações"
              className="w-9 h-9 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center"
            >
              <MaterialIcons name="settings" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
            </Pressable>
          </Link>
        </View>

        <View className="flex-row items-start justify-between mb-5">
          <View>
            <Text className="text-2xl font-extrabold text-cor-texto dark:text-cor-texto-dark">Visitante</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">@visitante</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="place" size={13} color="#6b6153" />
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Sem conta ainda</Text>
            </View>
          </View>
          <View className="w-16 h-16 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center border-2 border-cor-destaque dark:border-cor-destaque-dark">
            <Text className="text-3xl">🙂</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <Pressable
            onPress={() => router.push("/salvo")}
            className="flex-1 items-center gap-1.5 rounded-2xl py-4"
            style={{ backgroundColor: COR_GAMIFICACAO.fundo }}
          >
            <MaterialIcons name="bookmark-border" size={20} color={COR_GAMIFICACAO.destaque} />
            <Text className="text-xs font-bold text-white">Salvos</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/salvo")}
            className="flex-1 items-center gap-1.5 rounded-2xl py-4"
            style={{ backgroundColor: COR_GAMIFICACAO.fundo }}
          >
            <MaterialIcons name="edit-note" size={20} color={COR_GAMIFICACAO.destaque} />
            <Text className="text-xs font-bold text-white">Notas</Text>
          </Pressable>
        </View>

        <Link href="/salvo" asChild>
          <Pressable className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-4 shadow-sm" style={SOMBRA}>
            <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-2">📌 Salvo</Text>
            {atividade.length === 0 ? (
              <EstadoVazio titulo="Nada salvo ainda" descricao="Toque em ✎ Grifar ou 🗒 Anotar durante a leitura pra ver aqui." />
            ) : (
              recentes
                .slice(0, 3)
                  .map((item) => {
                    const nomeLivro = item.tipo !== "pesquisa" ? obterLivro(item.livroSlug)?.nome || item.livroSlug : "";
                    return (
                    <Text key={chaveAtividade(item)} numberOfLines={1} className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1">
                      {item.tipo === "grifo" ? "✎ " : item.tipo === "nota" ? "🗒 " : "☆ "}
                      {item.tipo === "pesquisa" ? item.termo : `${nomeLivro} ${item.capitulo}:${item.versiculo}`}
                    </Text>
                  );
                })
            )}
          </Pressable>
        </Link>

        <View
          className="rounded-3xl px-5 py-5 mb-3 flex-row items-center justify-between"
          style={{ backgroundColor: COR_GAMIFICACAO.fundo }}
        >
          <View>
            <Text className="text-4xl font-extrabold text-white">{sequencia}</Text>
            <Text style={{ color: COR_GAMIFICACAO.textoSuave }} className="text-xs font-semibold mt-0.5">
              {sequencia === 1 ? "dia seguido lendo" : "dias seguidos lendo"}
            </Text>
            <Text style={{ color: COR_GAMIFICACAO.destaque }} className="text-xs font-bold mt-1.5">
              {mensagemStreak(sequencia)}
            </Text>
          </View>
          <FogoStreak ativo={sequencia > 0} tamanho={52} />
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

        <View className="rounded-3xl px-5 pt-4 pb-5 mb-4" style={{ backgroundColor: COR_GAMIFICACAO.fundo }}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-extrabold text-base">🏅 Medalhas</Text>
            <Text style={{ color: COR_GAMIFICACAO.textoSuave }} className="text-xs font-semibold">
              {conquistas.filter((c) => c.conquistada).length}/{conquistas.length}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {conquistas.map((c) => (
              <MedalhaCarrossel key={c.id} conquista={c} />
            ))}
          </ScrollView>
        </View>

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
