import { Link, router, useLocalSearchParams } from "expo-router";
import { useNavbar } from "../../_layout";
import { useEffect, useRef, useState, useMemo } from "react";
import { ActivityIndicator, Image, NativeSyntheticEvent, NativeScrollEvent, Pressable, ScrollView, Text, View, Share, LayoutAnimation, Platform, UIManager } from "react-native";
import * as Clipboard from "expo-clipboard";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../../../components/BotaoTema";
import { ModalNota } from "../../../../components/ModalNota";
import { Tooltip } from "../../../../components/Tooltip";
import { Modal } from "react-native";
import { buscarReferencia } from "../../../../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../../../../core/biblia/tipos";
import { livros, obterLivro, obterResumo } from "../../../../core/content/livros";
import { TextoComReferencias } from "../../../../components/TextoComReferencias";
import { coresDoGenero, descricaoDoGenero } from "../../../../core/content/genero";
import {
  carregarFonteSerifada,
  carregarIndiceFonte,
  FAMILIA_SERIFADA,
  INDICE_PADRAO,
  salvarFonteSerifada,
  salvarIndiceFonte,
  TAMANHOS_FONTE,
} from "../../../../core/leitura/preferenciaFonte";
import { salvarUltimaLeitura } from "../../../../core/leitura/ultimaLeitura";
import { grifosRepository, notasRepository, progressoRepository, versiculosSalvosRepository } from "../../../../core/repositories";
import { falarCapitulo, pararAudio, suportaAudio } from "../../../../core/leitura/audio";
import { alternarTema, useColorScheme } from "../../../../core/theme";
import { gerarImagemVersiculo, suportaImagemVersiculo } from "../../../../core/util/gerarImagemVersiculo";
import { mensagemErroAmigavel } from "../../../../core/util/erroAmigavel";
import { linkVersiculo } from "../../../../core/util/linkVersiculo";
import { mostrarToast } from "../../../../core/util/toast";
import { useArrastarParaRolar } from "../../../../core/util/useArrastarParaRolar";
import { useOwnerId } from "../../../../core/useOwnerId";

export default function Leitura() {
  const params = useLocalSearchParams<{ livro: string; capitulo: string; versiculo?: string }>();
  const livro = obterLivro(params.livro ?? "");
  const capitulo = parseInt(params.capitulo ?? "", 10);
  const versiculoAlvo = params.versiculo ? parseInt(params.versiculo, 10) : null;
  const ownerId = useOwnerId();
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";

  const indiceLivro = livro ? livros.indexOf(livro) : -1;
  const valido = !!livro && !!capitulo && capitulo >= 1 && capitulo <= (livro?.capitulos ?? 1);

  const anterior =
    capitulo > 1
      ? { slug: livro?.slug, nome: livro?.nome, capitulo: capitulo - 1 }
      : indiceLivro > 0
        ? { slug: livros[indiceLivro - 1].slug, nome: livros[indiceLivro - 1].nome, capitulo: livros[indiceLivro - 1].capitulos }
        : null;

  const proximo =
    capitulo < (livro?.capitulos ?? 0)
      ? { slug: livro?.slug, nome: livro?.nome, capitulo: capitulo + 1 }
      : indiceLivro >= 0 && indiceLivro < livros.length - 1
        ? { slug: livros[indiceLivro + 1].slug, nome: livros[indiceLivro + 1].nome, capitulo: 1 }
        : null;

  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [grifos, setGrifos] = useState<Map<number, string | undefined>>(new Map());
  const [salvos, setSalvos] = useState<Set<number>>(new Set());
  const [focoAtivo, setFocoAtivo] = useState(false);
  const [versiculoAutoScrollRealizado, setVersiculoAutoScrollRealizado] = useState(false);
  const [destaqueAlvo, setDestaqueAlvo] = useState(!!versiculoAlvo);
  const [capituloLido, setCapituloLido] = useState(false);
  const [notas, setNotas] = useState<Map<number, string>>(new Map());
  const [versiculoEditandoNota, setVersiculoEditandoNota] = useState<number | null>(null);
  const [modalAjustesAberto, setModalAjustesAberto] = useState(false);
  const [abaAtual, setAbaAtual] = useState<"texto" | "resumo">("texto");
  const resumo = obterResumo(livro?.slug ?? "");
  const [versiculosSelecionados, setVersiculosSelecionados] = useState<Set<number>>(new Set());
  const [mostrarTodasCores, setMostrarTodasCores] = useState(false);
  const CORES_DISPONIVEIS = [
    "bg-yellow-300/40 dark:bg-yellow-600/30",
    "bg-red-300/40 dark:bg-red-600/30",
    "bg-green-300/40 dark:bg-green-600/30",
    "bg-blue-300/40 dark:bg-blue-600/30",
    "bg-purple-300/40 dark:bg-purple-600/30",
    "bg-orange-300/40 dark:bg-orange-600/30",
  ];
  const MAPA_CORES_SOLIDAS: Record<string, string> = {
    "bg-yellow-300/40 dark:bg-yellow-600/30": "bg-yellow-400",
    "bg-red-300/40 dark:bg-red-600/30": "bg-red-400",
    "bg-green-300/40 dark:bg-green-600/30": "bg-green-400",
    "bg-blue-300/40 dark:bg-blue-600/30": "bg-blue-400",
    "bg-purple-300/40 dark:bg-purple-600/30": "bg-purple-400",
    "bg-orange-300/40 dark:bg-orange-600/30": "bg-orange-400",
  };
  const [coresRecentes, setCoresRecentes] = useState<string[]>([CORES_DISPONIVEIS[0], CORES_DISPONIVEIS[1], CORES_DISPONIVEIS[2]]);
  const [indiceFonte, setIndiceFonte] = useState(INDICE_PADRAO);
  const [fonteSerifada, setFonteSerifada] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [versiculoRealcado, setVersiculoRealcado] = useState<number | null>(null);
  const [audioTocando, setAudioTocando] = useState(false);
  const [versiculoFalando, setVersiculoFalando] = useState<number | null>(null);
  const [imagemVersiculo, setImagemVersiculo] = useState<string | null>(null);
  const refBarraSelecao = useArrastarParaRolar();

  const { setOculta } = useNavbar();

  useEffect(() => {
    setOculta(focoAtivo);
    return () => setOculta(false);
  }, [focoAtivo, setOculta]);

  const scrollRef = useRef<ScrollView>(null);
  const posicoes = useRef<Record<number, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onKeyDown(e: KeyboardEvent) {
      const alvo = e.target as HTMLElement | null;
      if (alvo && ["INPUT", "TEXTAREA"].includes(alvo.tagName)) return;
      if (e.key === "ArrowLeft" && anterior) {
        router.replace(`/biblia/${anterior.slug}/${anterior.capitulo}`);
      } else if (e.key === "ArrowRight" && proximo) {
        router.replace(`/biblia/${proximo.slug}/${proximo.capitulo}`);
      } else if (e.key === "t" || e.key === "T") {
        alternarTema();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anterior, proximo]);

  useEffect(() => {
    carregarIndiceFonte().then(setIndiceFonte);
    carregarFonteSerifada().then(setFonteSerifada);
  }, []);

  function ajustarFonte(delta: number) {
    setIndiceFonte((atual) => {
      const novo = Math.min(TAMANHOS_FONTE.length - 1, Math.max(0, atual + delta));
      salvarIndiceFonte(novo);
      return novo;
    });
  }

  function alternarFonteSerifada() {
    setFonteSerifada((atual) => {
      const novo = !atual;
      salvarFonteSerifada(novo);
      return novo;
    });
  }

  function carregarCapitulo() {
    if (!valido || !livro) return;
    setDados(null);
    setErro(null);
    buscarReferencia(`${livro.nome} ${capitulo}`)
      .then(setDados)
      .catch((e) => setErro(mensagemErroAmigavel(e)));
  }

  useEffect(carregarCapitulo, [valido, livro, capitulo]);

  useEffect(() => {
    if (!valido || !livro) return;
    salvarUltimaLeitura(livro.slug, capitulo);
  }, [valido, livro, capitulo]);

  useEffect(() => {
    if (!ownerId || !livro) return;
    grifosRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setGrifos(new Map(itens.map((g) => [g.versiculo, g.cor])));
    });
    progressoRepository.estaLido(ownerId, { livroSlug: livro.slug, capitulo }).then(setCapituloLido);
    notasRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setNotas(new Map(itens.map((n) => [n.versiculo, n.texto])));
    });
    versiculosSalvosRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setSalvos(new Set(itens.map((s) => s.versiculo)));
    });
  }, [ownerId, livro, capitulo]);

  const jaRolou = useRef(false);
  useEffect(() => {
    jaRolou.current = false;
    setVersiculoAutoScrollRealizado(false);
    setVersiculosSelecionados(new Set());
    setMostrarTodasCores(false);
    setProgresso(0);
  }, [versiculoAlvo, dados]);

  const aoMedirVersiculo = (numero: number, y: number) => {
    posicoes.current[numero] = y;

    // Auto scroll para o versículo se for o alvo e ainda não scrollamos
    if (versiculoAlvo === numero && !versiculoAutoScrollRealizado) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 50), animated: true });
        setVersiculoAutoScrollRealizado(true);
        setVersiculoRealcado(numero);
        setTimeout(() => {
          setDestaqueAlvo(false);
          setVersiculoRealcado((atual) => (atual === numero ? null : atual));
        }, 2500);
      }, 100);
    }
  };

  const ultimoY = useRef(0);
  function aoRolar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setDestaqueAlvo(false);
    
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    
    // Auto-focus on scroll down (like reading more)
    if (y > ultimoY.current + 15 && y > 100) {
      setFocoAtivo(true);
    } else if (y < ultimoY.current - 15 || y <= 50) {
      setFocoAtivo(false);
    }
    ultimoY.current = y;

    const alturaRolavel = contentSize.height - layoutMeasurement.height;
    setProgresso(alturaRolavel > 0 ? Math.min(1, Math.max(0, y / alturaRolavel)) : 0);
  }

  if (!livro || !valido) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <MaterialIcons name="error-outline" size={48} className="text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4" />
        <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-2 text-center">Capítulo não encontrado</Text>
        <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark mb-6 text-center">Parece que você tentou acessar um capítulo que não existe neste livro.</Text>
        <Link href={livro ? { pathname: "/biblia/escolher", params: { livro: livro.slug } } : "/"} asChild>
          <Pressable accessibilityRole="link" className="bg-cor-borda dark:bg-cor-borda-dark px-6 py-3 rounded-full active:opacity-70">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-bold">Voltar para {livro ? livro.nome : "Início"}</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  async function alternarGrifo(numeroVersiculo: number, cor?: string) {
    if (!ownerId || !livro) return;
    const ativo = await grifosRepository.alternar(ownerId, { livroSlug: livro.slug, capitulo, versiculo: numeroVersiculo }, cor);
    setGrifos((atual) => {
      const novo = new Map(atual);
      if (ativo) novo.set(numeroVersiculo, cor);
      else novo.delete(numeroVersiculo);
      return novo;
    });
  }

  async function alternarCapituloLido() {
    if (!ownerId || !livro) return;
    const ativo = await progressoRepository.alternar(ownerId, { livroSlug: livro.slug, capitulo });
    setCapituloLido(ativo);
  }

  async function salvarNota(texto: string) {
    if (!ownerId || !livro || versiculoEditandoNota === null) return;
    const ref = { livroSlug: livro.slug, capitulo, versiculo: versiculoEditandoNota };
    if (texto) {
      await notasRepository.salvar(ownerId, ref, texto);
      setNotas((atual) => new Map(atual).set(versiculoEditandoNota, texto));
    } else {
      await notasRepository.remover(ownerId, ref);
      setNotas((atual) => {
        const novo = new Map(atual);
        novo.delete(versiculoEditandoNota);
        return novo;
      });
    }
    setVersiculoEditandoNota(null);
  }

  async function removerNota() {
    if (!ownerId || !livro || versiculoEditandoNota === null) return;
    await notasRepository.remover(ownerId, { livroSlug: livro.slug, capitulo, versiculo: versiculoEditandoNota });
    setNotas((atual) => {
      const novo = new Map(atual);
      novo.delete(versiculoEditandoNota);
      return novo;
    });
    setVersiculoEditandoNota(null);
  }

  function selecionarVersiculo(numero: number) {
    setDestaqueAlvo(false);
    setFocoAtivo(false);
    setVersiculosSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(numero)) novo.delete(numero);
      else novo.add(numero);
      if (novo.size === 0) setMostrarTodasCores(false);
      return novo;
    });
  }

  function aplicarCorGrifo(cor: string) {
    // Atualiza a lista de recentes
    setCoresRecentes((atual) => {
      const semACor = atual.filter((c) => c !== cor);
      return [cor, ...semACor].slice(0, 3);
    });
    setMostrarTodasCores(false);
    
    // Aqui no futuro aplicaremos a cor específica no backend/banco de dados
    // Aplica a cor no repositório local e estado
    versiculosSelecionados.forEach(v => alternarGrifo(v, cor));
    setVersiculosSelecionados(new Set());
  }

  function textoDosVersiculosSelecionados(): string | null {
    if (!dados?.versiculos || versiculosSelecionados.size === 0 || !livro) return null;
    const array = Array.from(versiculosSelecionados).sort((a, b) => a - b);
    const textos = array.map(v => `${v}. ${dados.versiculos!.find(x => x.numero === v)?.texto || ""}`);
    const referencia = `${livro.nome} ${capitulo}:${array[0]}${array.length > 1 ? `-${array[array.length-1]}` : ""}`;
    const link = linkVersiculo(livro.slug, capitulo, array[0]);
    return `${textos.join("\n")}\n\n${referencia}${link ? `\n${link}` : ""}`;
  }

  function alternarAudio() {
    if (audioTocando) {
      pararAudio();
      setAudioTocando(false);
      setVersiculoFalando(null);
      return;
    }
    if (!dados?.versiculos?.length) return;
    setAudioTocando(true);
    falarCapitulo(
      dados.versiculos,
      (numero) => setVersiculoFalando(numero),
      () => {
        setAudioTocando(false);
        setVersiculoFalando(null);
      }
    );
  }

  // Para o áudio ao sair da tela ou trocar de capítulo — sem isso a
  // fala continuaria em segundo plano falando um capítulo que a
  // pessoa já não está mais vendo.
  useEffect(() => {
    return () => pararAudio();
  }, [params.livro, params.capitulo]);

  // Acompanha o versículo sendo lido em voz alta, rolando a tela até
  // ele — as posições já foram medidas via onLayout na primeira
  // renderização do capítulo.
  useEffect(() => {
    if (versiculoFalando === null) return;
    const y = posicoes.current[versiculoFalando];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 100), animated: true });
    }
  }, [versiculoFalando]);

  function gerarImagemDoVersiculoSelecionado() {
    if (!dados?.versiculos || versiculosSelecionados.size !== 1 || !livro) return;
    const numero = Array.from(versiculosSelecionados)[0];
    const texto = dados.versiculos.find((v) => v.numero === numero)?.texto;
    if (!texto) return;
    const referencia = `${livro.nome} ${capitulo}:${numero}`;
    const imagem = gerarImagemVersiculo(texto, referencia);
    if (imagem) {
      setImagemVersiculo(imagem);
      setVersiculosSelecionados(new Set());
    }
  }

  async function copiarVersiculos() {
    const texto = textoDosVersiculosSelecionados();
    if (!texto) return;
    await Clipboard.setStringAsync(texto);
    mostrarToast("Copiado!");
    setVersiculosSelecionados(new Set());
  }

  async function compartilharVersiculos() {
    const texto = textoDosVersiculosSelecionados();
    if (!texto) return;
    await Share.share({ message: texto });
    setVersiculosSelecionados(new Set());
  }

  async function alternarSalvosSelecionados() {
    if (!ownerId || !livro || versiculosSelecionados.size === 0) return;
    const array = Array.from(versiculosSelecionados);
    const setAtual = new Set(salvos);
    for (const v of array) {
      const ativo = await versiculosSalvosRepository.alternar(ownerId, { livroSlug: livro.slug, capitulo, versiculo: v });
      if (ativo) setAtual.add(v);
      else setAtual.delete(v);
    }
    setSalvos(setAtual);
  }

  const tamanhoFonte = TAMANHOS_FONTE[indiceFonte];

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="h-0.5 bg-cor-borda dark:bg-cor-borda-dark">
        <View className="h-0.5 bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
      </View>


      {focoAtivo && (
        <View className="absolute bottom-0 left-0 right-0 bg-cor-fundo dark:bg-cor-fundo-dark px-4 py-4 border-t border-cor-borda dark:border-cor-borda-dark items-center justify-center z-50">
          <Text className="text-[10px] font-bold text-cor-texto-suave dark:text-cor-texto-suave-dark tracking-widest uppercase">
            {livro?.nome} {capitulo}
          </Text>
        </View>
      )}

      {!focoAtivo && (
      <View className="bg-cor-fundo dark:bg-cor-fundo-dark">
        <View className="px-3 py-2 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" className="w-10 h-10 items-center justify-center active:opacity-60">
            <MaterialIcons name="arrow-back" size={24} className="text-cor-texto dark:text-cor-texto-dark" />
          </Pressable>

          <View className="flex-row rounded-full bg-cor-borda dark:bg-cor-borda-dark p-1">
            <Pressable
              onPress={() => setAbaAtual("texto")}
              accessibilityRole="tab"
              accessibilityLabel="Texto Bíblico"
              accessibilityState={{ selected: abaAtual === "texto" }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={abaAtual === "texto"}
              className={`px-4 py-1.5 rounded-full active:opacity-60 ${abaAtual === "texto" ? "bg-cor-fundo dark:bg-cor-fundo-dark shadow-sm" : ""}`}
            >
              <Text className={`text-xs font-bold ${abaAtual === "texto" ? "text-cor-texto dark:text-cor-texto-dark" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}`}>Texto Bíblico</Text>
            </Pressable>
            <Pressable
              onPress={() => setAbaAtual("resumo")}
              accessibilityRole="tab"
              accessibilityLabel="Resumo"
              accessibilityState={{ selected: abaAtual === "resumo" }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={abaAtual === "resumo"}
              className={`px-4 py-1.5 rounded-full active:opacity-60 ${abaAtual === "resumo" ? "bg-cor-fundo dark:bg-cor-fundo-dark shadow-sm" : ""}`}
            >
              <Text className={`text-xs font-bold ${abaAtual === "resumo" ? "text-cor-texto dark:text-cor-texto-dark" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}`}>Resumo</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            {suportaAudio() && abaAtual === "texto" ? (
              <Pressable
                onPress={alternarAudio}
                accessibilityRole="button"
                accessibilityLabel={audioTocando ? "Pausar leitura em voz alta" : "Ouvir capítulo em voz alta"}
                className="w-10 h-10 items-center justify-center active:opacity-60"
              >
                <MaterialIcons
                  name={audioTocando ? "pause-circle-outline" : "volume-up"}
                  size={22}
                  className="text-cor-texto dark:text-cor-texto-dark"
                />
              </Pressable>
            ) : null}
            <Pressable onPress={() => setModalAjustesAberto(true)} accessibilityRole="button" accessibilityLabel="Ajustes de leitura" className="w-10 h-10 items-center justify-center active:opacity-60">
              <Text style={{ fontFamily: FAMILIA_SERIFADA }} className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark">Aa</Text>
            </Pressable>
          </View>
        </View>

        {abaAtual === "texto" ? (
          <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark text-center pb-2">
            {livro?.nome} {capitulo}
          </Text>
        ) : null}
      </View>
      )}
      <ScrollView ref={scrollRef} onScroll={aoRolar} scrollEventThrottle={32} className="flex-1" style={{ display: abaAtual === "texto" ? "flex" : "none" }}>
        <View className="px-5 pt-6 pb-32 max-w-2xl w-full mx-auto">
          <Pressable
            onPress={alternarCapituloLido}
            accessibilityRole="checkbox"
            accessibilityLabel="Capítulo lido"
            accessibilityState={{ checked: capituloLido }}
            // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
            accessibilityChecked={capituloLido}
            className={`self-start px-4 py-2.5 rounded-full mb-6 active:opacity-70 ${
              capituloLido
                ? "bg-green-600"
                : "border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
            }`}
          >
            <Text className={`text-sm font-semibold ${capituloLido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
              {capituloLido ? "✓ Capítulo lido" : "Marcar capítulo como lido"}
            </Text>
          </Pressable>

          {erro ? (
            <View className="items-start gap-3">
              <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">{erro}</Text>
              <Pressable
                onPress={carregarCapitulo}
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
                className="px-4 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70"
              >
                <Text className="text-white font-semibold text-sm">Tentar novamente</Text>
              </Pressable>
            </View>
          ) : !dados ? (
            <View className="mt-4 gap-4 opacity-50">
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-3/4" />
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-full" />
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-5/6" />
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-2/3 mt-2" />
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-full" />
              <View className="h-4 bg-cor-borda dark:bg-cor-borda-dark rounded w-4/5" />
            </View>
          ) : dados.versiculos ? (
            dados.versiculos.map((v) => {
              const corGrifo = grifos.get(v.numero);
              const grifado = grifos.has(v.numero);
              const salvo = salvos.has(v.numero);
              const temNota = notas.has(v.numero);
              const selecionado = versiculosSelecionados.has(v.numero);
              return (
                <View key={v.numero} onLayout={(e) => aoMedirVersiculo(v.numero, e.nativeEvent.layout.y)} className={`mb-0.5 -mx-2 ${destaqueAlvo && v.numero !== versiculoAlvo ? "opacity-30" : ""}`}>
                  <Pressable
                    onPress={() => selecionarVersiculo(v.numero)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={`Versículo ${v.numero}${grifado ? ", grifado" : ""}`}
                    accessibilityState={{ checked: selecionado }}
                    // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                    accessibilityChecked={selecionado}
                    className={`rounded-lg px-2 py-1.5 active:opacity-70 ${
                      grifado
                        ? corGrifo ? corGrifo : "bg-cor-grifo dark:bg-cor-grifo-dark"
                        : v.numero === versiculoFalando || v.numero === versiculoRealcado
                          ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark"
                          : ""
                    } ${selecionado ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""} ${
                      v.numero === versiculoAlvo ? "border-l-4 border-cor-destaque dark:border-cor-destaque-dark" : ""
                    }`}
                  >
                    <Text
                      className="text-cor-texto dark:text-[#EAEAEA]"
                      style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.65, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }}
                    >
                      <Text
                        className="text-cor-texto-suave dark:text-cor-texto-suave-dark font-bold opacity-50"
                        style={{ fontSize: tamanhoFonte * 0.60, verticalAlign: "top" }}
                      >
                        {"  "}
                        {v.numero}{" "}
                      </Text>
                      {v.texto}
                      {temNota && !selecionado ? (
                        <Text className="text-cor-destaque dark:text-cor-destaque-dark"> 🗒</Text>
                      ) : null}
                      {salvo && !selecionado ? (
                        <Text className="text-cor-destaque dark:text-cor-destaque-dark"> 🔖</Text>
                      ) : null}
                    </Text>
                    {temNota ? (
                      <Text
                        className="text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5"
                        style={{ fontSize: tamanhoFonte * 0.78 }}
                      >
                        📝 {notas.get(v.numero)}
                      </Text>
                    ) : null}
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Text
              className="text-cor-texto dark:text-cor-texto-dark"
              style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.65, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }}
            >
              {dados.texto}
            </Text>
          )}
        </View>
      </ScrollView>


      {abaAtual === "resumo" && resumo && (
        <ScrollView className="flex-1">
          <View className="px-5 pt-6 pb-32 max-w-2xl w-full mx-auto">
            <Tooltip titulo={resumo.genero} descricao={descricaoDoGenero(resumo.genero)}>
              <View className={`self-start flex-row items-center gap-1 px-3 py-1 rounded-full mb-3 ${coresDoGenero(resumo.genero).bg}`}>
                <Text className={`text-xs font-semibold uppercase tracking-wide ${coresDoGenero(resumo.genero).texto}`}>{resumo.genero}</Text>
                <Text className={`text-[10px] ${coresDoGenero(resumo.genero).texto}`}>ⓘ</Text>
              </View>
            </Tooltip>
            <Text className="text-4xl font-extrabold text-cor-texto dark:text-cor-texto-dark mb-2 leading-tight">
              {resumo.nome}
            </Text>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
              Livro {resumo.numero} de 66 · {resumo.testamento} · {resumo.capitulos} capítulos · {resumo.tempoLeituraMin} min de leitura
            </Text>

            <View className="border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-8">
              {resumo.fichaRapida.map((item, i) => (
                <View key={item.rotulo} className={`px-4 py-3 ${i < resumo.fichaRapida.length - 1 ? "border-b border-cor-borda dark:border-cor-borda-dark" : ""}`}>
                  <Text className="text-xs font-semibold uppercase text-cor-texto-suave dark:text-cor-texto-suave-dark">{item.rotulo}</Text>
                  <TextoComReferencias texto={item.valor} className="text-cor-texto dark:text-cor-texto-dark mt-0.5" style={fonteSerifada ? { fontFamily: FAMILIA_SERIFADA } : undefined} />
                </View>
              ))}
            </View>

            {resumo.secoes.map((secao) => (
              <View key={secao.id} className="mb-8">
                <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-3">{secao.titulo}</Text>
                {secao.lista
                  ? secao.itens.map((item, i) => (
                      <TextoComReferencias key={i} texto={`•  ${item}`} className="text-cor-texto dark:text-cor-texto-dark mb-2" style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.6, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }} />
                    ))
                  : secao.paragrafos.map((paragrafo, i) => (
                      <TextoComReferencias key={i} texto={paragrafo} className="text-cor-texto dark:text-cor-texto-dark mb-3.5" style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.6, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }} />
                    ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Barra de Seleção Múltipla */}
      {versiculosSelecionados.size > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border-t border-cor-borda dark:border-cor-borda-dark shadow-lg pb-4 z-50">
          <View className="px-5 py-3 border-b border-cor-borda dark:border-cor-borda-dark flex-row justify-between items-center">
            <Text className="text-cor-texto dark:text-cor-texto-dark font-bold">
              {livro.nome} {capitulo}:{Math.min(...Array.from(versiculosSelecionados))}
              {versiculosSelecionados.size > 1 ? `-${Math.max(...Array.from(versiculosSelecionados))}` : ""}
            </Text>
            <Pressable
              onPress={() => setVersiculosSelecionados(new Set())}
              accessibilityRole="button"
              accessibilityLabel="Cancelar seleção"
              hitSlop={10}
              className="p-2 -m-2 active:opacity-60"
            >
              <MaterialIcons name="close" size={24} className="text-cor-texto-suave dark:text-cor-texto-suave-dark" />
            </Pressable>
          </View>
          <ScrollView ref={refBarraSelecao} horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3">
            <View className="flex-row items-center gap-4">
              {/* Cores */}
              <View className="flex-row items-center gap-2 mr-2">
                {(() => {
                  const primeiroGrifado = Array.from(versiculosSelecionados).find(v => grifos.has(v));
                  const corAtual = primeiroGrifado ? grifos.get(primeiroGrifado) || "bg-cor-grifo dark:bg-cor-grifo-dark" : null;
                  
                  let coresMostrar = mostrarTodasCores ? [...CORES_DISPONIVEIS] : [...coresRecentes];
                  if (corAtual && !coresMostrar.includes(corAtual)) {
                    coresMostrar.unshift(corAtual);
                  } else if (corAtual) {
                    coresMostrar = [corAtual, ...coresMostrar.filter(c => c !== corAtual)];
                  }

                  return coresMostrar.map((cor, i) => {
                    const isDesfazer = cor === corAtual && i === 0;
                    const corBolinha = MAPA_CORES_SOLIDAS[cor] || cor;
                    return (
                      <Pressable
                        key={i}
                        onPress={() => aplicarCorGrifo(cor)}
                        accessibilityRole="checkbox"
                        accessibilityLabel={isDesfazer ? "Remover grifo" : "Grifar com esta cor"}
                        accessibilityState={{ checked: isDesfazer }}
                        // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                        accessibilityChecked={isDesfazer}
                        className="w-11 h-11 -m-1.5 items-center justify-center active:opacity-70"
                      >
                        <View className={`w-8 h-8 rounded-full ${corBolinha} shadow-sm items-center justify-center`}>
                          {isDesfazer && <MaterialIcons name="close" size={18} color="rgba(0,0,0,0.5)" />}
                        </View>
                      </Pressable>
                    );
                  });
                })()}
                {!mostrarTodasCores && (
                  <Pressable
                    onPress={() => setMostrarTodasCores(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Ver todas as cores de grifo"
                    className="w-11 h-11 -m-1.5 items-center justify-center active:opacity-70"
                  >
                    <View className="w-8 h-8 rounded-full bg-cor-borda dark:bg-cor-borda-dark items-center justify-center">
                      <MaterialIcons name="more-horiz" size={20} className="text-cor-texto dark:text-cor-texto-dark" />
                    </View>
                  </Pressable>
                )}
              </View>

              {/* Botões de Ações */}
              {(() => {
                const todosSalvos = Array.from(versiculosSelecionados).every(v => salvos.has(v));
                return (
                  <Pressable
                    onPress={alternarSalvosSelecionados}
                    accessibilityRole="checkbox"
                    accessibilityLabel="Salvar versículos selecionados"
                    accessibilityState={{ checked: todosSalvos }}
                    // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                    accessibilityChecked={todosSalvos}
                    className="flex-row items-center justify-center gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 py-2 rounded-lg active:opacity-70"
                  >
                    <MaterialIcons name={todosSalvos ? "bookmark" : "bookmark-border"} size={18} className="text-cor-texto dark:text-cor-texto-dark" />
                    <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-sm">{todosSalvos ? "Salvo" : "Salvar"}</Text>
                  </Pressable>
                );
              })()}
              
              <Pressable
                onPress={() => {
                  const primeiro = Math.min(...Array.from(versiculosSelecionados));
                  setVersiculoEditandoNota(primeiro);
                }}
                accessibilityRole="button"
                className="flex-row items-center justify-center gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 py-2 rounded-lg active:opacity-70"
              >
                <MaterialIcons name="edit" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-sm">Anotação</Text>
              </Pressable>

              <Pressable onPress={copiarVersiculos} accessibilityRole="button" className="flex-row items-center justify-center gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 py-2 rounded-lg active:opacity-70">
                <MaterialIcons name="content-copy" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-sm">Copiar</Text>
              </Pressable>

              <Pressable onPress={compartilharVersiculos} accessibilityRole="button" className={`flex-row items-center justify-center gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 py-2 rounded-lg active:opacity-70 ${suportaImagemVersiculo() && versiculosSelecionados.size === 1 ? "" : "mr-6"}`}>
                <MaterialIcons name="share" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-sm">Compartilhar</Text>
              </Pressable>

              {suportaImagemVersiculo() && versiculosSelecionados.size === 1 ? (
                <Pressable onPress={gerarImagemDoVersiculoSelecionado} accessibilityRole="button" className="flex-row items-center justify-center gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 py-2 rounded-lg mr-6 active:opacity-70">
                  <MaterialIcons name="image" size={18} className="text-cor-texto dark:text-cor-texto-dark" />
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold text-sm">Imagem</Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Barra fixa de navegação (Estilo Pílula Flutuante) */}
      {!focoAtivo && (
      <View className="absolute bottom-6 left-0 right-0 items-center justify-center pointer-events-box-none">
        <View
          {...(Platform.OS === "web" ? { title: "Atalhos: ← → troca de capítulo, T alterna o tema" } : {})}
          className="bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark shadow-md rounded-full px-2 py-1.5 flex-row items-center max-w-[280px] pointer-events-auto border border-cor-borda dark:border-cor-borda-dark"
        >

          <Pressable
              onPress={() => anterior && router.replace(`/biblia/${anterior.slug}/${anterior.capitulo}`)}
              disabled={!anterior}
              accessibilityRole="button"
              accessibilityLabel="Capítulo anterior"
              className={`w-10 h-10 items-center justify-center rounded-full ${anterior ? "active:opacity-60" : "opacity-30"}`}
            >
              <Text className="text-lg text-cor-texto dark:text-cor-texto-dark">←</Text>
            </Pressable>

          <Link href={{ pathname: "/biblia/escolher", params: { livro: livro.slug } }} asChild>
            <Pressable accessibilityRole="link" className="flex-1 items-center px-4 py-1.5 active:opacity-60">
              <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark" numberOfLines={1}>
                {livro.nome} {capitulo}
              </Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={() => proximo && router.replace(`/biblia/${proximo.slug}/${proximo.capitulo}`)}
            disabled={!proximo}
            accessibilityRole="button"
            accessibilityLabel="Próximo capítulo"
            className={`w-10 h-10 items-center justify-center rounded-full ${proximo ? "active:opacity-60" : "opacity-30"}`}
          >
            <Text className="text-lg text-cor-texto dark:text-cor-texto-dark">→</Text>
          </Pressable>
        </View>
      </View>
      )}

      {versiculoEditandoNota !== null ? (
        <ModalNota
          key={versiculoEditandoNota}
          visivel
          versiculo={versiculoEditandoNota}
          textoInicial={notas.get(versiculoEditandoNota) ?? ""}
          onFechar={() => setVersiculoEditandoNota(null)}
          onSalvar={salvarNota}
          onRemover={removerNota}
        />
      ) : null}

      {/* Modal de Ajustes de Leitura */}
      <Modal visible={modalAjustesAberto} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setModalAjustesAberto(false)}>
          <Pressable className="bg-cor-fundo dark:bg-cor-fundo-dark rounded-t-3xl p-6 pb-12" onPress={e => e.stopPropagation()}>
            <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-6 text-center">Configurações de Leitura</Text>
            
            <View className="flex-row items-center justify-between bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark rounded-xl p-2 mb-4 border border-cor-borda dark:border-cor-borda-dark">
              <Pressable onPress={() => ajustarFonte(-1)} accessibilityRole="button" accessibilityLabel="Diminuir tamanho da fonte" className="flex-1 py-3 items-center active:opacity-60" disabled={indiceFonte === 0}>
                <Text className={`font-bold text-sm ${indiceFonte === 0 ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40" : "text-cor-texto dark:text-cor-texto-dark"}`}>A-</Text>
              </Pressable>
              <View className="w-px h-8 bg-cor-borda dark:bg-cor-borda-dark" />
              <Pressable onPress={() => ajustarFonte(1)} accessibilityRole="button" accessibilityLabel="Aumentar tamanho da fonte" className="flex-1 py-3 items-center active:opacity-60" disabled={indiceFonte === TAMANHOS_FONTE.length - 1}>
                <Text className={`font-bold text-lg ${indiceFonte === TAMANHOS_FONTE.length - 1 ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40" : "text-cor-texto dark:text-cor-texto-dark"}`}>A+</Text>
              </Pressable>
            </View>

            <View className="flex-row gap-4 mb-2">
              <Pressable
                onPress={alternarFonteSerifada}
                accessibilityRole="switch"
                accessibilityLabel="Fonte serifada"
                accessibilityState={{ checked: fonteSerifada }}
                // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                accessibilityChecked={fonteSerifada}
                className={`flex-1 p-3 rounded-xl border active:opacity-70 ${fonteSerifada ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"} items-center justify-center`}
              >
                <Text style={{ fontFamily: FAMILIA_SERIFADA }} className="text-cor-texto dark:text-cor-texto-dark font-bold">Fonte Serifada</Text>
              </Pressable>
              
              <View className="flex-1 p-1 items-center justify-center border border-cor-borda dark:border-cor-borda-dark rounded-xl">
                <BotaoTema />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={!!imagemVersiculo} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/70 items-center justify-center p-6" onPress={() => setImagemVersiculo(null)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="items-center max-w-[420px] w-full">
            {imagemVersiculo ? (
              <Image source={{ uri: imagemVersiculo }} className="w-full aspect-square rounded-2xl mb-4" resizeMode="contain" />
            ) : null}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  if (Platform.OS === "web" && imagemVersiculo) {
                    const link = document.createElement("a");
                    link.href = imagemVersiculo;
                    link.download = `${livro?.slug ?? "versiculo"}-${capitulo}.png`;
                    link.click();
                  }
                  mostrarToast("Imagem baixada!");
                }}
                accessibilityRole="button"
                accessibilityLabel="Baixar imagem"
                className="flex-row items-center gap-1.5 bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-2.5 rounded-full active:opacity-70"
              >
                {/* dark:cor-destaque-dark é um dourado claro, feito pra
                    texto/ícone em cima, não pra fundo com branco — branco
                    aqui dava só ~2.1:1 de contraste (mesmo problema já
                    corrigido no card "Estudo por Resumos" do Início) */}
                <MaterialIcons name="download" size={18} color={escuro ? "#2a241c" : "white"} />
                <Text className="text-white dark:text-cor-texto font-semibold text-sm">Baixar</Text>
              </Pressable>
              <Pressable onPress={() => setImagemVersiculo(null)} accessibilityRole="button" accessibilityLabel="Fechar" className="px-5 py-2.5 rounded-full border border-white/30 active:opacity-70">
                <Text className="text-white font-semibold text-sm">Fechar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
