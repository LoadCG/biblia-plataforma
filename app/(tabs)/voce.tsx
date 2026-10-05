import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Platform, Pressable, RefreshControl, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { IconeUI } from "../../components/icone/IconeUI";
import { BotaoTema } from "../../components/BotaoTema";
import { CardAtividade } from "../../components/CardAtividade";
import { EstadoVazio } from "../../components/EstadoVazio";
import { FogoStreak } from "../../components/FogoStreak";
import { IconeConquista } from "../../components/IconeConquista";
import { ModalPerfil } from "../../components/ModalPerfil";
import { EstadoCarregando } from "../../components/EstadoCarregando";
import { EstadoErro } from "../../components/EstadoErro";
import { calcularConquistas, selecionarDestaquesConquistas, type Conquista } from "../../core/content/conquistas";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../../core/estatisticas/atividade";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { mensagemStreak } from "../../core/estatisticas/mensagemStreak";
import { livrosLidosRepository, perfilRepository, progressoRepository } from "../../core/repositories";
import { PERFIL_PADRAO, type Perfil } from "../../core/repositories/PerfilRepository";
import { useColorScheme } from "../../core/theme";
import { useArrastarParaRolar } from "../../core/util/useArrastarParaRolar";
import { useOwnerId } from "../../core/useOwnerId";

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
  const largura = useWindowDimensions().width;
  const desktop = Platform.OS === "web" && largura >= 1200;
  const [sequencia, setSequencia] = useState(0);
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);
  const refMedalhas = useArrastarParaRolar();
  const { colorScheme } = useColorScheme();
  const cores = colorScheme === "dark" ? CORES_TEMA.escuro : CORES_TEMA.claro;
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState(false);

  const carregarTudo = useCallback(async (silencioso = false) => {
    if (!ownerId) return;
    if (!silencioso) setCarregando(true);
    setErroAoCarregar(false);
    try {
      const [lidos, progresso, ativ, perfilCarregado] = await Promise.all([
        livrosLidosRepository.listar(ownerId),
        progressoRepository.listarTodos(ownerId),
        carregarAtividade(ownerId),
        perfilRepository.obter(ownerId),
      ]);
      setSequencia(calcularSequenciaAtual(progresso.map((p) => p.lidoEm)));
      setConquistas(calcularConquistas(new Set(lidos)));
      setAtividade(ativ);
      setPerfil(perfilCarregado);
    } catch {
      setErroAoCarregar(true);
    } finally {
      setCarregando(false);
    }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { void carregarTudo(); }, [carregarTudo]));

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try { await carregarTudo(true); } finally { setAtualizando(false); }
  }, [carregarTudo]);

  const recentes = atividade.slice(0, 3);
  const medalhasObtidas = conquistas.filter((conquista) => conquista.conquistada).length;
  const destaques = selecionarDestaquesConquistas(conquistas);
  const versiculosSalvos = atividade.filter((item) => item.tipo === "salvo").length;
  const anotacoes = atividade.filter((item) => item.tipo === "nota").length;

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark" refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.destaque} />}>
      <View className={`px-4 pt-6 pb-12 ${desktop ? "max-w-6xl" : "max-w-2xl"} w-full mx-auto`}>
        <View className="flex-row items-center justify-between gap-3 mb-5">
          <Text accessibilityRole="header" className="text-3xl font-extrabold text-cor-texto dark:text-cor-texto-dark">Você</Text>
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

        {carregando ? <EstadoCarregando rotulo="Carregando seu perfil" /> : erroAoCarregar ? (
          <EstadoErro
            titulo="Não foi possível carregar seu perfil"
            descricao="Seus dados continuam neste dispositivo. Tente novamente."
            aoTentarNovamente={() => { void carregarTudo(); }}
          />
        ) : <>
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
        </Pressable>

        <Link href="/privacidade" asChild>
          <Pressable accessibilityRole="link" className="self-start min-h-10 flex-row items-center gap-2 px-1 mb-5 active:opacity-70">
            <IconeUI name="info" size={15} color={cores.textoSuave} />
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Seus dados ficam neste dispositivo. <Text className="font-bold text-cor-destaque dark:text-cor-destaque-dark">Saiba mais</Text></Text>
          </Pressable>
        </Link>

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

        <View className={desktop ? "flex-row items-start gap-6" : ""}>
          <View className={desktop ? "flex-[1.35] min-w-0" : ""}>
            <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">Minha biblioteca</Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => router.push({ pathname: "/salvo", params: { filtro: "salvo" } })}
                accessibilityRole="button"
                accessibilityLabel={`Abrir versículos salvos, ${versiculosSalvos} ${versiculosSalvos === 1 ? "versículo" : "versículos"}`}
                className="flex-1 min-h-28 justify-between rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 active:opacity-70"
              >
                <View className="w-9 h-9 rounded-xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><IconeUI name="bookmark-outline" size={20} color={cores.destaque} /></View>
                <View className="flex-row items-center justify-between gap-2">
                  <View className="flex-1"><Text className="font-bold text-cor-texto dark:text-cor-texto-dark">Salvos</Text><Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">{versiculosSalvos} {versiculosSalvos === 1 ? "versículo" : "versículos"}</Text></View>
                  <IconeUI name="next-chevron" size={16} color={cores.textoSuave} />
                </View>
              </Pressable>
              <Pressable
                onPress={() => router.push({ pathname: "/salvo", params: { filtro: "nota" } })}
                accessibilityRole="button"
                accessibilityLabel={`Abrir minhas notas, ${anotacoes} ${anotacoes === 1 ? "anotação" : "anotações"}`}
                className="flex-1 min-h-28 justify-between rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 active:opacity-70"
              >
                <View className="w-9 h-9 rounded-xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><IconeUI name="edit-note" size={20} color={cores.destaque} /></View>
                <View className="flex-row items-center justify-between gap-2">
                  <View className="flex-1"><Text className="font-bold text-cor-texto dark:text-cor-texto-dark">Anotações</Text><Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">{anotacoes} {anotacoes === 1 ? "anotação" : "anotações"}</Text></View>
                  <IconeUI name="next-chevron" size={16} color={cores.textoSuave} />
                </View>
              </Pressable>
            </View>
            <Link href="/salvo" asChild>
              <Pressable accessibilityRole="link" className="self-start min-h-11 flex-row items-center gap-2 px-1 mb-6 active:opacity-70">
                <Text className="text-sm font-bold text-cor-destaque dark:text-cor-destaque-dark">Ver biblioteca completa</Text>
                <IconeUI name="next" size={16} color={cores.destaque} />
              </Pressable>
            </Link>

            <View className="flex-row items-center justify-between gap-3 mb-3">
              <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark">Atividade recente</Text>
              {atividade.length > 3 ? <Link href="/salvo" className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark py-2">Ver tudo</Link> : null}
            </View>
            {recentes.length === 0 ? (
              <View className="rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-4"><EstadoVazio titulo="Sua jornada começa aqui" descricao="Salve um versículo, faça uma nota ou grife uma passagem durante a leitura." acao={{ rotulo: "Abrir a Bíblia", aoPressionar: () => router.push("/biblia") }} /></View>
            ) : (
              recentes.map((item) => <CardAtividade key={chaveAtividade(item)} item={item} onMudou={() => { void carregarTudo(true); }} />)
            )}
          </View>

          <View className={desktop ? "flex-1 min-w-0" : ""}>
            <Text accessibilityRole="header" className="text-base font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">Seu progresso</Text>
            <View className="rounded-3xl border border-cor-borda dark:border-cor-borda-dark px-5 py-5 mb-4 flex-row items-center justify-between bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark">
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark">Sequência de leitura</Text>
                <Text className="text-4xl font-extrabold text-cor-texto dark:text-cor-texto-dark">{sequencia}</Text>
                <Text style={{ color: cores.textoSuave }} className="text-xs font-semibold mt-0.5">
                  {sequencia === 1 ? "dia seguido lendo" : "dias seguidos lendo"}
                </Text>
                {sequencia > 0 ? <Text style={{ color: cores.destaque }} className="text-xs font-bold mt-1.5">{mensagemStreak(sequencia)}</Text> : null}
                {sequencia === 0 ? (
                  <Pressable onPress={() => router.push("/biblia")} accessibilityRole="link" className="self-start min-h-10 flex-row items-center gap-1.5 mt-2 active:opacity-70">
                    <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">Começar leitura</Text>
                    <IconeUI name="next" size={14} color={cores.destaque} />
                  </Pressable>
                ) : null}
              </View>
              <View className="w-16 h-16 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center"><FogoStreak ativo={sequencia > 0} tamanho={44} /></View>
            </View>

            <View className="rounded-3xl border border-cor-borda dark:border-cor-borda-dark px-4 py-4 mb-4 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark">
              <View className="flex-row items-center justify-between gap-2 mb-2">
                <Text accessibilityRole="header" className="text-cor-texto dark:text-cor-texto-dark font-extrabold text-base">Medalhas</Text>
                <Text style={{ color: cores.destaque }} className="text-xs font-bold">{medalhasObtidas} de {conquistas.length}</Text>
              </View>
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">Marcos dos resumos de livros que você leu.</Text>
              <ScrollView ref={refMedalhas} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
                {destaques.map((conquista) => <MedalhaCarrossel key={conquista.id} conquista={conquista} />)}
              </ScrollView>
              <Link href={{ pathname: "/medalhas", params: { origem: "voce" } }} asChild>
                <Pressable accessibilityRole="link" className="min-h-11 flex-row items-center justify-between mt-2 active:opacity-70">
                  <Text style={{ color: cores.destaque }} className="text-sm font-bold">Ver todas as medalhas</Text>
                  <IconeUI name="next" size={18} color={cores.destaque} />
                </Pressable>
              </Link>
            </View>
          </View>
        </View>

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
        </>}
      </View>
    </ScrollView>
  );
}
