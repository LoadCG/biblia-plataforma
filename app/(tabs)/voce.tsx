import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { IconeUI } from "../../components/icone/IconeUI";
import { BotaoTema } from "../../components/BotaoTema";
import { CardAtividade } from "../../components/CardAtividade";
import { EstadoVazio } from "../../components/EstadoVazio";
import { FogoStreak } from "../../components/FogoStreak";
import { IconeConquista } from "../../components/IconeConquista";
import { ModalPerfil } from "../../components/ModalPerfil";
import { DicaContextual } from "../../components/DicaContextual";
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
import { mostrarToast } from "../../core/util/toast";

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
      onPress={() => router.push({ pathname: "/medalhas", params: { conquista: conquista.id, origem: "voce" } })}
      accessibilityRole="button"
      accessibilityLabel={`${conquista.titulo}, ${conquista.conquistada ? "conquistada" : `${conquista.progressoAtual} de ${conquista.progressoTotal}`}. Ver detalhes`}
      className="w-28 mr-3 items-center rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark px-2 py-3 active:opacity-70"
    >
      <View className="w-14 h-14 items-center justify-center mb-2">
        <IconeConquista
          conquistaId={conquista.id}
          conquistada={conquista.conquistada}
          tamanho={42}
        />
      </View>
      <Text numberOfLines={2} className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark text-center min-h-8">
        {conquista.titulo}
      </Text>
      <View className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: cores.borda }}>
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${progresso * 100}%`, backgroundColor: cores.destaque }}
        />
      </View>
      <Text style={{ color: cores.textoSuave }} className="text-[11px] mt-1.5">
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
  const [atualizando, setAtualizando] = useState(false);

  const carregarTudo = useCallback(async () => {
    if (!ownerId) return;
    try {
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
    } catch {
      mostrarToast("Não foi possível carregar alguns dados do seu perfil", { severidade: "erro" });
    }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { void carregarTudo(); }, [carregarTudo]));

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try { await carregarTudo(); } finally { setAtualizando(false); }
  }, [carregarTudo]);

  const recentes = atividade.slice(0, 3);
  const medalhasObtidas = conquistas.filter((conquista) => conquista.conquistada).length;

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark" refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.destaque} />}>
      <View className="px-4 pt-6 pb-12 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between gap-3 mb-5">
          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-cor-destaque dark:text-cor-destaque-dark">Seu espaço</Text>
            <Text accessibilityRole="header" className="text-3xl font-extrabold text-cor-texto dark:text-cor-texto-dark mt-0.5">Você</Text>
          </View>
          <View className="flex-row items-center gap-2">
          <BotaoTema compacto />
          <Link href="/configuracoes" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Abrir configurações"
              className="w-11 h-11 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center active:opacity-70"
            >
              <IconeUI name="settings" size={19} color={cores.textoSuave} />
            </Pressable>
          </Link>
          </View>
        </View>

        <Pressable onPress={() => setEditandoPerfil(true)} accessibilityRole="button" accessibilityLabel={`Editar perfil de ${perfil.nome}`} className="rounded-3xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border border-cor-borda dark:border-cor-borda-dark p-5 mb-4 active:opacity-80">
          <View className="flex-row items-center gap-4">
            <View className="rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center border-2 border-cor-destaque dark:border-cor-destaque-dark overflow-hidden" style={{ width: 72, height: 72 }}>
              {perfil.avatarUri ? <Image source={{ uri: perfil.avatarUri }} className="w-full h-full" /> : <IconeUI name="profile" size={32} color={cores.destaque} />}
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">MEU PERFIL</Text>
              <Text className="text-xl font-extrabold text-cor-texto dark:text-cor-texto-dark mt-0.5" numberOfLines={2}>{perfil.nome}</Text>
              <Text className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark mt-1">Editar nome e foto</Text>
            </View>
            <IconeUI name="next-chevron" size={18} color={cores.textoSuave} />
          </View>
          <View className="flex-row items-center gap-2 border-t border-cor-borda dark:border-cor-borda-dark mt-4 pt-3">
            <IconeUI name="profile" size={15} color={cores.textoSuave} />
            <Text className="flex-1 text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Seu perfil e suas leituras ficam neste dispositivo</Text>
          </View>
        </Pressable>

        <DicaContextual id="voce" titulo="Seu progresso é privado" descricao="Notas, salvos, leituras e medalhas ficam associados a um identificador anônimo deste dispositivo. Você pode exportar ou apagar tudo nas Configurações." />

        {editandoPerfil ? (
          <ModalPerfil
            visivel
            perfilAtual={perfil}
            onFechar={() => setEditandoPerfil(false)}
            onSalvar={async (novoPerfil) => {
              if (!ownerId) throw new Error("Identificação local indisponível");
              await perfilRepository.salvar(ownerId, novoPerfil);
              setPerfil(novoPerfil);
              setEditandoPerfil(false);
            }}
          />
        ) : null}

        <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">Minha biblioteca</Text>
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => router.push({ pathname: "/salvo", params: { filtro: "salvo" } })}
            accessibilityRole="button"
            accessibilityLabel="Abrir versículos salvos"
            className="flex-1 min-h-28 justify-between rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 active:opacity-70"
          >
            <View className="w-9 h-9 rounded-xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><IconeUI name="bookmark-outline" size={20} color={cores.destaque} /></View>
            <View className="flex-row items-center justify-between"><Text className="font-bold text-cor-texto dark:text-cor-texto-dark">Salvos</Text><IconeUI name="next-chevron" size={16} color={cores.textoSuave} /></View>
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: "/salvo", params: { filtro: "nota" } })}
            accessibilityRole="button"
            accessibilityLabel="Abrir minhas notas"
            className="flex-1 min-h-28 justify-between rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 active:opacity-70"
          >
            <View className="w-9 h-9 rounded-xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><IconeUI name="edit-note" size={20} color={cores.destaque} /></View>
            <View className="flex-row items-center justify-between"><Text className="font-bold text-cor-texto dark:text-cor-texto-dark">Notas</Text><IconeUI name="next-chevron" size={16} color={cores.textoSuave} /></View>
          </Pressable>
        </View>
        <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">Seu progresso</Text>

        <View
          className="rounded-3xl border border-cor-borda dark:border-cor-borda-dark px-5 py-5 mb-3 flex-row items-center justify-between bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
        >
          <View className="flex-1">
            <Text className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark">Sequência de leitura</Text>
            <Text className="text-4xl font-extrabold text-cor-texto dark:text-cor-texto-dark">{sequencia}</Text>
            <Text style={{ color: cores.textoSuave }} className="text-xs font-semibold mt-0.5">
              {sequencia === 1 ? "dia seguido lendo" : "dias seguidos lendo"}
            </Text>
            <Text style={{ color: cores.destaque }} className="text-xs font-bold mt-1.5">
              {mensagemStreak(sequencia)}
            </Text>
          </View>
          <View className="w-16 h-16 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><FogoStreak ativo={sequencia > 0} tamanho={44} /></View>
        </View>

        <View className="flex-row items-center gap-3 rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-6">
          <View className="w-10 h-10 rounded-xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><IconeUI name="share" size={20} color={cores.destaque} /></View>
          <View className="flex-1">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Compartilhamentos</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Versículos e anotações compartilhados</Text>
          </View>
          <Text className="text-xl font-extrabold text-cor-texto dark:text-cor-texto-dark">{compartilhamentos}</Text>
        </View>

        <View className="rounded-3xl border border-cor-borda dark:border-cor-borda-dark px-5 pt-4 pb-5 mb-6 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark">
          <View className="flex-row items-center justify-between mb-3">
            <Text accessibilityRole="header" className="text-cor-texto dark:text-cor-texto-dark font-extrabold text-base">Medalhas</Text>
            <Text style={{ color: cores.destaque }} className="text-xs font-bold">
              {medalhasObtidas} de {conquistas.length}
            </Text>
          </View>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">Cada leitura conta para a sua jornada.</Text>
          <ScrollView ref={refMedalhas} horizontal showsHorizontalScrollIndicator={false}>
            {conquistas.map((c) => (
              <MedalhaCarrossel key={c.id} conquista={c} />
            ))}
          </ScrollView>
          <Pressable onPress={() => router.push({ pathname: "/medalhas", params: { origem: "voce" } })} accessibilityRole="button" className="min-h-11 flex-row items-center justify-between mt-3 active:opacity-70">
            <Text style={{ color: cores.destaque }} className="text-sm font-bold">Ver todas as medalhas</Text>
            <IconeUI name="next" size={18} color={cores.destaque} />
          </Pressable>
        </View>

        <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">Atividade recente</Text>
        {recentes.length === 0 ? (
          <View className="rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-4"><EstadoVazio titulo="Sua jornada começa aqui" descricao="Salve um versículo, faça uma nota ou grife uma passagem durante a leitura." acao={{ rotulo: "Abrir a Bíblia", aoPressionar: () => router.push("/biblia") }} /></View>
        ) : (
          recentes.map((item) => <CardAtividade key={chaveAtividade(item)} item={item} onMudou={carregarTudo} />)
        )}
        {atividade.length > 3 ? (
          <Link href="/salvo" className="text-sm font-bold text-cor-destaque dark:text-cor-destaque-dark self-start py-3 mb-4">
            Ver toda a atividade
          </Link>
        ) : null}

        <View className="border-t border-cor-borda dark:border-cor-borda-dark pt-4 mt-3">
        <Link href="/configuracoes" asChild>
          <Pressable
            accessibilityRole="link"
            className="min-h-12 flex-row items-center gap-3 px-2 active:opacity-70"
          >
            <IconeUI name="settings" size={20} color={cores.textoSuave} />
            <Text className="flex-1 text-cor-texto dark:text-cor-texto-dark font-semibold">Configurações</Text>
            <IconeUI name="next-chevron" size={17} color={cores.textoSuave} />
          </Pressable>
        </Link>
        <Link href="/ajuda" asChild>
          <Pressable
            accessibilityRole="link"
            className="min-h-12 flex-row items-center gap-3 px-2 active:opacity-70"
          >
            <IconeUI name="info" size={20} color={cores.textoSuave} />
            <Text className="flex-1 text-cor-texto dark:text-cor-texto-dark font-semibold">Ajuda e como usar</Text>
            <IconeUI name="next-chevron" size={17} color={cores.textoSuave} />
          </Pressable>
        </Link>
        </View>
      </View>
    </ScrollView>
  );
}
