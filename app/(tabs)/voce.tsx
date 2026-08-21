import { Link, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { CardAtividade } from "../../components/CardAtividade";
import { EstadoVazio } from "../../components/EstadoVazio";
import { FogoStreak } from "../../components/FogoStreak";
import { ModalPerfil } from "../../components/ModalPerfil";
import { obterLivro } from "../../core/content/livros";
import { calcularConquistas, type Conquista } from "../../core/content/conquistas";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../../core/estatisticas/atividade";
import { carregarCompartilhamentos } from "../../core/estatisticas/compartilhamentos";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { mensagemStreak } from "../../core/estatisticas/mensagemStreak";
import { livrosLidosRepository, perfilRepository, progressoRepository } from "../../core/repositories";
import { PERFIL_PADRAO, type Perfil } from "../../core/repositories/PerfilRepository";
import { useColorScheme } from "../../core/theme";
import { useArrastarParaRolar } from "../../core/util/useArrastarParaRolar";
import { useOwnerId } from "../../core/useOwnerId";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

// Cores dos tokens de tema (tailwind.config.js), como valor real — só
// necessário aqui porque `style={{ backgroundColor/color }}` não aceita
// `dark:`. Antes esses cards de gamificação usavam uma paleta escura
// fixa (proposital, mas sem alternativa clara — reportado pelo usuário
// como "muitos elementos [...] não mudam pro modo claro junto com os
// outros"). Agora seguem exatamente os mesmos tokens usados no resto do
// app, só que como valor de `style` em vez de className.
const CORES_TEMA = {
  claro: { destaque: "#8a5a2b", borda: "#e6ded0", textoSuave: "#6b6153" },
  escuro: { destaque: "#e0a75e", borda: "#3a3226", textoSuave: "#b3a894" },
};

function MedalhaCarrossel({ conquista }: { conquista: Conquista }) {
  const { colorScheme } = useColorScheme();
  const cores = colorScheme === "dark" ? CORES_TEMA.escuro : CORES_TEMA.claro;
  const progresso = conquista.progressoTotal > 0 ? Math.min(1, conquista.progressoAtual / conquista.progressoTotal) : 0;

  return (
    <Pressable
      onPress={() => router.push("/medalhas")}
      accessibilityRole="button"
      accessibilityLabel={`${conquista.titulo}, ${conquista.progressoAtual} de ${conquista.progressoTotal}`}
      className="w-28 mr-3 items-center active:opacity-70"
    >
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: conquista.conquistada ? cores.destaque : cores.borda }}
      >
        <Text style={{ fontSize: 26, opacity: conquista.conquistada ? 1 : 0.4 }}>{conquista.icone}</Text>
      </View>
      <Text numberOfLines={1} className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark text-center mb-1.5">
        {conquista.titulo}
      </Text>
      <View className="w-full h-1.5 rounded-full" style={{ backgroundColor: cores.borda }}>
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${progresso * 100}%`, backgroundColor: cores.destaque }}
        />
      </View>
      <Text style={{ color: cores.textoSuave }} className="text-[10px] mt-1">
        {conquista.progressoAtual}/{conquista.progressoTotal}
      </Text>
    </Pressable>
  );
}

export default function Voce() {
  const ownerId = useOwnerId();
  const [sequencia, setSequencia] = useState(0);
  const [compartilhamentos, setCompartilhamentos] = useState(0);
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);
  const refMedalhas = useArrastarParaRolar();
  const { colorScheme } = useColorScheme();
  const cores = colorScheme === "dark" ? CORES_TEMA.escuro : CORES_TEMA.claro;
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  const carregarTudo = useCallback(async () => {
    if (!ownerId) return;
    const [lidos, progresso, ativ, compart, perfilCarregado] = await Promise.all([
      livrosLidosRepository.listar(ownerId),
      progressoRepository.listarTodos(ownerId),
      carregarAtividade(ownerId),
      carregarCompartilhamentos(),
      perfilRepository.obter(ownerId),
    ]);
    setSequencia(calcularSequenciaAtual(progresso.map((p) => p.lidoEm)));
    setConquistas(calcularConquistas(new Set(lidos)));
    setAtividade(ativ);
    setCompartilhamentos(compart);
    setPerfil(perfilCarregado);
  }, [ownerId]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  const recentes = atividade.slice(0, 5);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between gap-3 mb-2">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Você</Text>
          <View className="flex-row items-center gap-3">
          <BotaoTema />
          <Link href="/configuracoes" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Configurações"
              className="w-11 h-11 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center active:opacity-70"
            >
              <MaterialIcons name="settings" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
            </Pressable>
          </Link>
          </View>
        </View>

        <Pressable onPress={() => setEditandoPerfil(true)} accessibilityRole="button" accessibilityLabel="Editar perfil" className="flex-row items-start justify-between mb-5 active:opacity-80">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-extrabold text-cor-texto dark:text-cor-texto-dark" numberOfLines={1}>
              {perfil.nome}
            </Text>
            <Text className="text-xs text-cor-destaque dark:text-cor-destaque-dark font-semibold mt-0.5">Editar perfil ✎</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="place" size={13} color={cores.textoSuave} />
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Sem conta ainda</Text>
            </View>
          </View>
          <View className="w-16 h-16 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center border-2 border-cor-destaque dark:border-cor-destaque-dark overflow-hidden">
            {perfil.avatarUri ? (
              <Image source={{ uri: perfil.avatarUri }} className="w-full h-full" />
            ) : (
              <Text className="text-3xl">🙂</Text>
            )}
          </View>
        </Pressable>

        {editandoPerfil ? (
          <ModalPerfil
            visivel
            perfilAtual={perfil}
            onFechar={() => setEditandoPerfil(false)}
            onSalvar={async (novoPerfil) => {
              if (!ownerId) return;
              await perfilRepository.salvar(ownerId, novoPerfil);
              setPerfil(novoPerfil);
              setEditandoPerfil(false);
            }}
          />
        ) : null}

        <View className="flex-row gap-3 mb-4">
          <Pressable
            onPress={() => router.push({ pathname: "/salvo", params: { filtro: "salvo" } })}
            accessibilityRole="button"
            className="flex-1 items-center gap-1.5 rounded-2xl py-4 shadow-sm active:opacity-70 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
            style={SOMBRA}
          >
            <MaterialIcons name="bookmark-border" size={20} color={cores.destaque} />
            <Text className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark">Salvos</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: "/salvo", params: { filtro: "nota" } })}
            accessibilityRole="button"
            className="flex-1 items-center gap-1.5 rounded-2xl py-4 shadow-sm active:opacity-70 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
            style={SOMBRA}
          >
            <MaterialIcons name="edit-note" size={20} color={cores.destaque} />
            <Text className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark">Notas</Text>
          </Pressable>
        </View>

        <Link href="/salvo" asChild>
          <Pressable accessibilityRole="link" className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-4 shadow-sm active:opacity-80" style={SOMBRA}>
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
          className="rounded-3xl px-5 py-5 mb-3 flex-row items-center justify-between shadow-sm bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
          style={SOMBRA}
        >
          <View>
            <Text className="text-4xl font-extrabold text-cor-texto dark:text-cor-texto-dark">{sequencia}</Text>
            <Text style={{ color: cores.textoSuave }} className="text-xs font-semibold mt-0.5">
              {sequencia === 1 ? "dia seguido lendo" : "dias seguidos lendo"}
            </Text>
            <Text style={{ color: cores.destaque }} className="text-xs font-bold mt-1.5">
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

        <View className="rounded-3xl px-5 pt-4 pb-5 mb-4 shadow-sm bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark" style={SOMBRA}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-extrabold text-base">🏅 Medalhas</Text>
            <Text style={{ color: cores.textoSuave }} className="text-xs font-semibold">
              {conquistas.filter((c) => c.conquistada).length}/{conquistas.length}
            </Text>
          </View>
          <ScrollView ref={refMedalhas} horizontal showsHorizontalScrollIndicator={false}>
            {conquistas.map((c) => (
              <MedalhaCarrossel key={c.id} conquista={c} />
            ))}
          </ScrollView>
          <Pressable onPress={() => router.push("/medalhas")} accessibilityRole="button" className="self-start mt-3 active:opacity-70">
            <Text style={{ color: cores.destaque }} className="text-xs font-bold">
              Ver todas as medalhas →
            </Text>
          </Pressable>
        </View>

        <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mt-1 mb-2">Atividade</Text>
        {recentes.length === 0 ? (
          <EstadoVazio titulo="Nenhuma atividade ainda" descricao="Grife, anote ou favorite uma busca pra ver aqui." />
        ) : (
          recentes.map((item) => <CardAtividade key={chaveAtividade(item)} item={item} onMudou={carregarTudo} />)
        )}
        {atividade.length > 5 ? (
          <Link href="/salvo" className="text-sm text-cor-destaque dark:text-cor-destaque-dark self-start mb-4">
            Ver mais (mostrando {recentes.length} de {atividade.length})
          </Link>
        ) : null}

        <Link href="/configuracoes" asChild>
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center justify-between rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mt-2 shadow-sm active:opacity-80"
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
