import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from "react-native";
import { IconeUI, type IconeUINome } from "../../components/icone/IconeUI";
import { BotaoTema } from "../../components/BotaoTema";
import { CardVersiculoTema } from "../../components/CardVersiculoTema";
import { EstadoVazio } from "../../components/EstadoVazio";
import { EstadoCarregando } from "../../components/EstadoCarregando";
import { EstadoErro } from "../../components/EstadoErro";
import { IlustracaoTema } from "../../components/IlustracaoTema";
import { buscarLivros } from "../../core/content/busca";
import { livros } from "../../core/content/livros";
import { buscarGlobal, ResultadoBuscaGlobal } from "../../core/biblia/BibliaAPI";
import { TEMAS_BUSCA, type Tema } from "../../core/biblia/temasBusca";
import { pesquisasFavoritasRepository } from "../../core/repositories";
import { useColorScheme } from "../../core/theme";
import { mensagemErroAmigavel } from "../../core/util/erroAmigavel";
import { mostrarToast } from "../../core/util/toast";
import { useOwnerId } from "../../core/useOwnerId";
import type { PesquisaFavorita } from "../../core/types/leitura";
import { normalizarBusca } from "../../core/biblia/relevanciaBusca";
import { FAMILIA_SERIFADA } from "../../core/leitura/preferenciaFonte";
import { hrefReferenciaBiblica } from "../../core/biblia/parseReferencia";
import { useArrastarParaRolar } from "../../core/util/useArrastarParaRolar";

function TextoDestacado({ texto, termo }: { texto: string; termo: string }) {
  const tokens = normalizarBusca(termo).replace(/^"|"$/g, "").split(" ").filter(Boolean);
  return (
    <Text className="text-sm text-cor-texto dark:text-cor-texto-dark" numberOfLines={3}>
      “{texto.split(/(\s+)/).map((parte, indice) => {
        const destaque = tokens.some((token) => normalizarBusca(parte).includes(token));
        return <Text key={`${parte}-${indice}`} className={destaque ? "font-extrabold bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""}>{parte}</Text>;
      })}”
    </Text>
  );
}

const ATALHOS_DESCUBRA: { id: string; rotulo: string; icone: IconeUINome; destino: "salvos" | "ajuda" }[] = [
  { id: "salvos", rotulo: "Salvos", icone: "bookmark-outline", destino: "salvos" },
  { id: "ajuda", rotulo: "Ajuda", icone: "info", destino: "ajuda" },
];

export default function Pesquisa() {
  const parametros = useLocalSearchParams<{ tema?: string }>();
  const [termo, setTermo] = useState("");
  const [favoritada, setFavoritada] = useState(false);
  const [resultadosBiblia, setResultadosBiblia] = useState<ResultadoBuscaGlobal[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [abaExibicao, setAbaExibicao] = useState<'biblia' | 'resumos'>('biblia');
  const [testamento, setTestamento] = useState<"todos" | "Antigo Testamento" | "Novo Testamento">("todos");
  const [limite, setLimite] = useState(50);
  const [favoritas, setFavoritas] = useState<PesquisaFavorita[]>([]);
  const [livroFiltro, setLivroFiltro] = useState<string | undefined>();
  const [tentativaBusca, setTentativaBusca] = useState(0);
  
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const desktop = useWindowDimensions().width >= 1024;
  const ownerId = useOwnerId();
  const buscaAtiva = useRef(0);
  const refFiltroLivro = useArrastarParaRolar();
  const idTemaParametro = Array.isArray(parametros.tema) ? parametros.tema[0] : parametros.tema;
  const temaSelecionado = idTemaParametro ? TEMAS_BUSCA.find((tema) => tema.id === idTemaParametro) ?? null : null;
  const hrefPrimeiraLeitura = temaSelecionado ? hrefReferenciaBiblica(temaSelecionado.referencias[0]) : null;

  useEffect(() => {
    if (idTemaParametro && !temaSelecionado) {
      router.replace("/pesquisa");
      return;
    }
    if (temaSelecionado && termo) setTermo("");
  }, [idTemaParametro, temaSelecionado, termo]);

  function abrirTema(tema: Tema) {
    router.push({ pathname: "/pesquisa", params: { tema: tema.id } });
  }

  function voltarAosTemas() {
    router.replace("/pesquisa");
  }

  useEffect(() => {
    if (!ownerId) return;
    let ativo = true;
    pesquisasFavoritasRepository.listarTodas(ownerId)
      .then((itens) => { if (ativo) setFavoritas(itens); })
      .catch(() => { if (ativo) mostrarToast("Não foi possível carregar suas buscas favoritas", { severidade: "erro" }); });
    return () => { ativo = false; };
  }, [ownerId, favoritada]);
  useEffect(() => setLimite(50), [termo, testamento, livroFiltro]);

  const resultadosResumo = useMemo(() => (termo.trim() ? buscarLivros(termo) : []), [termo]);

  useEffect(() => {
    const idBusca = ++buscaAtiva.current;
    if (!ownerId || !termo.trim()) {
      setFavoritada(false);
      setResultadosBiblia([]);
      return;
    }
    
    pesquisasFavoritasRepository.estaFavoritada(ownerId, termo).then((valor) => {
      if (buscaAtiva.current === idBusca) setFavoritada(valor);
    }).catch(() => {
      if (buscaAtiva.current === idBusca) mostrarToast("Não foi possível verificar se a busca está salva", { severidade: "erro" });
    });
    
    // Busca assíncrona na Bíblia
    const timeout = setTimeout(() => {
      setBuscando(true);
      setErroBusca(null);
      buscarGlobal(termo, { testamento: testamento === "todos" ? undefined : testamento, livroSlug: livroFiltro, limite })
        .then((resultados) => {
          if (buscaAtiva.current === idBusca) setResultadosBiblia(resultados);
        })
        .catch((e) => {
          if (buscaAtiva.current === idBusca) setErroBusca(mensagemErroAmigavel(e));
        })
        .finally(() => {
          if (buscaAtiva.current === idBusca) setBuscando(false);
        });
    }, 500); // debounce de 500ms
    
    return () => clearTimeout(timeout);
  }, [ownerId, termo, testamento, livroFiltro, limite, tentativaBusca]);

  async function alternarFavorita() {
    if (!ownerId || !termo.trim()) return;
    try {
      setFavoritada(await pesquisasFavoritasRepository.alternar(ownerId, termo));
    } catch {
      mostrarToast("Não foi possível atualizar a busca favorita", { severidade: "erro" });
    }
  }

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 lg:pt-10 max-w-2xl lg:max-w-6xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-4 lg:mb-8">
          <View>
            <Text accessibilityRole="header" className="text-2xl lg:text-4xl font-bold text-cor-texto dark:text-cor-texto-dark" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>Descubra</Text>
            {desktop ? <Text className="text-base text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">Uma palavra para aquilo que você vive hoje.</Text> : null}
          </View>
          <View className="flex-row items-center gap-3">
            {desktop ? (
              <Pressable onPress={() => router.push("/planos")} accessibilityRole="link" className="flex-row items-center gap-2 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-2.5 active:opacity-70">
                <IconeUI name="reading-plan" size={18} color={escuro ? "#e0a75e" : "#8a5a2b"} />
                <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">Planos de leitura</Text>
              </Pressable>
            ) : null}
            <BotaoTema />
          </View>
        </View>

        {!termo.trim() ? (
          <View className="flex-row justify-between mb-4 lg:hidden">
            <Pressable
              onPress={() => router.push("/planos")}
              accessibilityRole="link"
              className="flex-1 items-center gap-1.5 mx-1 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark py-3.5 active:opacity-70"
            >
              <IconeUI name="reading-plan" size={20} color={escuro ? "#e0a75e" : "#8a5a2b"} />
              <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Planos</Text>
            </Pressable>
            {ATALHOS_DESCUBRA.map((atalho) => (
              <Link
                key={atalho.id}
                href={atalho.destino === "salvos" ? { pathname: "/salvo", params: { filtro: "salvo" } } : "/ajuda"}
                asChild
              >
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={atalho.rotulo}
                  accessibilityHint={atalho.destino === "salvos" ? "Abre seus versículos salvos" : "Abre as orientações de uso"}
                  className="flex-1 items-center gap-1.5 mx-1 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark py-3.5 active:opacity-70"
                >
                  <IconeUI name={atalho.icone} size={20} color={escuro ? "#e0a75e" : "#8a5a2b"} />
                  <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{atalho.rotulo}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null}

        <View className="relative">
          {desktop ? <IconeUI name="search" size={21} color={escuro ? "#b3a894" : "#6b6153"} className="absolute left-4 top-3.5 z-10" /> : null}
          <TextInput
            testID="busca-descubra"
            accessibilityLabel="Buscar na Bíblia e nos resumos"
            accessibilityHint="Digite uma palavra, vários termos ou uma frase entre aspas"
            value={termo}
            onChangeText={(t) => {
              setTermo(t);
              if (t.trim() && idTemaParametro) router.setParams({ tema: undefined, origem: undefined });
            }}
            placeholder="Buscar na Bíblia e nos resumos"
            placeholderTextColor="#9ca3af"
            className={`px-4 pr-12 py-3.5 rounded-full lg:rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark text-base ${desktop ? "pl-12" : ""}`}
          />
          {termo ? (
            <Pressable
              testID="limpar-busca-descubra"
              onPress={() => setTermo("")}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              hitSlop={10}
              className="absolute right-3 top-2.5 h-9 w-9 items-center justify-center rounded-full active:opacity-60"
            >
              <IconeUI name="close" size={20} color={escuro ? "#b3a894" : "#6b6257"} />
            </Pressable>
          ) : null}
        </View>
        
        {termo.trim() ? (
          <View className="flex-row mt-4 mb-2">
            <Pressable
              onPress={() => setAbaExibicao('biblia')}
              accessibilityRole="tab"
              accessibilityLabel="Na Bíblia"
              accessibilityState={{ selected: abaExibicao === 'biblia' }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={abaExibicao === 'biblia'}
              className={`mr-4 pb-2 border-b-2 active:opacity-60 ${abaExibicao === 'biblia' ? 'border-cor-destaque dark:border-cor-destaque-dark' : 'border-transparent'}`}
            >
              <Text className={`font-semibold ${abaExibicao === 'biblia' ? 'text-cor-texto dark:text-cor-texto-dark' : 'text-cor-texto-suave dark:text-cor-texto-suave-dark'}`}>
                Na Bíblia {resultadosBiblia.length > 0 && `(${resultadosBiblia.length})`}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAbaExibicao('resumos')}
              accessibilityRole="tab"
              accessibilityLabel="Nos Resumos"
              accessibilityState={{ selected: abaExibicao === 'resumos' }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={abaExibicao === 'resumos'}
              className={`pb-2 border-b-2 active:opacity-60 ${abaExibicao === 'resumos' ? 'border-cor-destaque dark:border-cor-destaque-dark' : 'border-transparent'}`}
            >
              <Text className={`font-semibold ${abaExibicao === 'resumos' ? 'text-cor-texto dark:text-cor-texto-dark' : 'text-cor-texto-suave dark:text-cor-texto-suave-dark'}`}>
                Nos Resumos {resultadosResumo.length > 0 && `(${resultadosResumo.length})`}
              </Text>
            </Pressable>
          </View>
        ) : null}
        {termo.trim() && abaExibicao === "biblia" ? (
          <View className="mb-2">
          <View className="flex-row flex-wrap gap-2 mb-2">
            {(["todos", "Antigo Testamento", "Novo Testamento"] as const).map((valor) => (
              <Pressable key={valor} onPress={() => setTestamento(valor)} accessibilityRole="radio" accessibilityState={{ checked: testamento === valor }}
                // @ts-expect-error accessibilityChecked é uma extensão do react-native-web
                accessibilityChecked={testamento === valor} className={`px-3 py-1.5 rounded-full border ${testamento === valor ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}>
                <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{valor === "todos" ? "Toda a Bíblia" : valor === "Antigo Testamento" ? "Antigo Testamento" : "Novo Testamento"}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView ref={refFiltroLivro} horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Filtrar por livro">
            <Pressable onPress={() => setLivroFiltro(undefined)} accessibilityRole="radio" accessibilityState={{ checked: !livroFiltro }}
              // @ts-expect-error accessibilityChecked é uma extensão do react-native-web
              accessibilityChecked={!livroFiltro} className={`mr-2 px-3 py-1.5 rounded-full border ${!livroFiltro ? "border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">Todos os livros</Text></Pressable>
            {livros.map((livro) => <Pressable key={livro.slug} onPress={() => setLivroFiltro(livro.slug)} accessibilityRole="radio" accessibilityState={{ checked: livroFiltro === livro.slug }}
              // @ts-expect-error accessibilityChecked é uma extensão do react-native-web
              accessibilityChecked={livroFiltro === livro.slug} className={`mr-2 px-3 py-1.5 rounded-full border ${livroFiltro === livro.slug ? "border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">{livro.nome}</Text></Pressable>)}
          </ScrollView>
          </View>
        ) : null}
      </View>

      <ScrollView className="flex-1">
        <View className={`px-4 pt-2 pb-10 ${desktop ? "max-w-6xl" : "max-w-2xl"} w-full mx-auto`}>
          {termo.trim() && !buscando ? (
            <Text accessibilityLiveRegion="polite" className="sr-only">
              {erroBusca
                ? `Busca indisponível: ${erroBusca}`
                : `${abaExibicao === "biblia" ? resultadosBiblia.length : resultadosResumo.length} resultados encontrados`}
            </Text>
          ) : null}
          {termo.trim() ? (
            <>
              <Pressable
                onPress={alternarFavorita}
                accessibilityRole="checkbox"
                accessibilityLabel={favoritada ? "Remover busca dos favoritos" : "Favoritar esta busca"}
                accessibilityState={{ checked: favoritada }}
                // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                accessibilityChecked={favoritada}
                className="flex-row items-center gap-1.5 self-start mb-3 px-3 py-1.5 rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-70"
              >
                <Text>{favoritada ? "★" : "☆"}</Text>
                <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
                  {favoritada ? "Busca favoritada" : "Favoritar esta busca"}
                </Text>
              </Pressable>
              
              {abaExibicao === 'resumos' ? (
                resultadosResumo.length === 0 ? (
                  <EstadoVazio
                    titulo="Nenhum resultado nos resumos"
                    descricao="Tente pesquisar na aba da Bíblia."
                    acao={{ rotulo: "Buscar na Bíblia", aoPressionar: () => setAbaExibicao("biblia") }}
                  />
                ) : (
                  resultadosResumo.map(({ livro, trecho }) => (
                    <Link key={livro.slug} href={`/resumos/${livro.slug}`} asChild>
                      <Pressable
                        accessibilityRole="link"
                        className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3 mb-2 shadow-sm active:opacity-80"
                        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
                      >
                        <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
                        {trecho ? (
                          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5 italic" numberOfLines={2}>
                            "{trecho}"
                          </Text>
                        ) : null}
                      </Pressable>
                    </Link>
                  ))
                )
              ) : (
                erroBusca ? (
                  <EstadoErro titulo="Não foi possível buscar" descricao={erroBusca} aoTentarNovamente={() => setTentativaBusca((valor) => valor + 1)} />
                ) : buscando ? (
                  <EstadoCarregando rotulo="Buscando resultados" className="mt-8" />
                ) : resultadosBiblia.length === 0 ? (
                  <EstadoVazio
                    titulo="Nenhum versículo encontrado"
                    descricao="Tente outra palavra."
                    acao={{ rotulo: "Limpar busca", aoPressionar: () => setTermo("") }}
                  />
                ) : (
                  <>
                  {resultadosBiblia.map((resultado, i) => {
                    const livroCorreto = livros.find(l => l.abreviacao === resultado.livroSlug) 
                      || { slug: resultado.livroSlug }; // Fallback para não quebrar
                      
                    return (
                    <Link key={`${resultado.livroSlug}-${resultado.capitulo}-${resultado.versiculo}-${i}`} href={`/biblia/${livroCorreto.slug}/${resultado.capitulo}?versiculo=${resultado.versiculo}`} asChild>
                      <Pressable
                        accessibilityRole="link"
                        className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3 mb-2 shadow-sm active:opacity-80"
                        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
                      >
                        <Text className="text-xs text-cor-destaque dark:text-cor-destaque-dark font-semibold mb-1">
                          {resultado.nomeLivro} {resultado.capitulo}:{resultado.versiculo}
                        </Text>
                        <TextoDestacado texto={resultado.texto} termo={termo} />
                      </Pressable>
                    </Link>
                    );
                  })}
                  {resultadosBiblia.length >= limite ? (
                    <Pressable onPress={() => setLimite((valor) => valor + 50)} accessibilityRole="button" className="rounded-full border border-cor-borda dark:border-cor-borda-dark px-4 py-3 items-center mt-2 active:opacity-70"><Text className="font-bold text-cor-texto dark:text-cor-texto-dark">Carregar mais resultados</Text></Pressable>
                  ) : null}
                  </>
                )
              )}
            </>
          ) : temaSelecionado ? (
            <>
              <Pressable onPress={voltarAosTemas} accessibilityRole="button" className="self-start min-h-11 justify-center mb-3 pr-3 active:opacity-60">
                <Text className="text-sm text-cor-destaque dark:text-cor-destaque-dark font-semibold">← Voltar aos temas</Text>
              </Pressable>
              <View
                className={`mb-6 overflow-hidden rounded-3xl border border-cor-borda dark:border-cor-borda-dark ${desktop ? "flex-row items-center p-7" : "p-5"}`}
                style={{
                  backgroundColor: escuro ? temaSelecionado.corBgDark : temaSelecionado.corBg,
                }}
              >
                <View className="flex-1">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2">
                    Tema bíblico · {temaSelecionado.referencias.length} leituras
                  </Text>
                  <Text
                    accessibilityRole="header"
                    className="text-3xl lg:text-4xl font-bold text-cor-texto dark:text-cor-texto-dark"
                    style={{ fontFamily: FAMILIA_SERIFADA }}
                  >
                    {temaSelecionado.titulo}
                  </Text>
                  <Text className="text-sm lg:text-base text-cor-texto dark:text-cor-texto-dark mt-2 max-w-2xl">
                    {temaSelecionado.descricao} Leia as passagens no seu contexto e siga no seu ritmo.
                  </Text>
                  {hrefPrimeiraLeitura ? (
                    <Link href={hrefPrimeiraLeitura} asChild>
                      <Pressable
                        accessibilityRole="link"
                        accessibilityLabel={`Começar leitura em ${temaSelecionado.referencias[0]}`}
                        className="mt-5 min-h-11 self-start flex-row items-center justify-center gap-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-2.5 active:opacity-80"
                      >
                        <Text className="text-sm font-bold text-white dark:text-cor-fundo-dark">Começar leitura</Text>
                        <IconeUI name="next" size={17} color={escuro ? "#1b1712" : "#ffffff"} />
                      </Pressable>
                    </Link>
                  ) : null}
                </View>
                <View aria-hidden={true} className={`items-center justify-center ${desktop ? "w-52 h-40 ml-6" : "h-28 mt-3"}`}>
                  <IlustracaoTema
                    tema={temaSelecionado.id}
                    cor={escuro ? temaSelecionado.corTextoDark : temaSelecionado.corTexto}
                    tamanho={desktop ? 176 : 124}
                  />
                </View>
              </View>

              <View className={desktop ? "flex-row items-start gap-8" : undefined}>
                <View className={desktop ? "flex-[2]" : undefined}>
                  <Text accessibilityRole="header" className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>
                    Leituras para explorar
                  </Text>
                  <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">
                    Passagens selecionadas para você ler na Bíblia.
                  </Text>
                  {temaSelecionado.referencias.map((ref) => (
                    <CardVersiculoTema key={ref} referencia={ref} />
                  ))}
                </View>

                <View className={desktop ? "flex-1" : "mt-6"}>
                  <Text accessibilityRole="header" className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>
                    Continue explorando
                  </Text>
                  <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
                    Temas que também podem acompanhar sua leitura.
                  </Text>
                  <View>
                    {temaSelecionado.temasRelacionados.map((idRelacionado) => {
                      const relacionado = TEMAS_BUSCA.find((tema) => tema.id === idRelacionado);
                      if (!relacionado) return null;
                      return (
                        <Link key={relacionado.id} href={{ pathname: "/pesquisa", params: { tema: relacionado.id } }} asChild>
                          <Pressable
                            accessibilityRole="link"
                            accessibilityLabel={`${relacionado.titulo}. ${relacionado.descricao}`}
                            accessibilityHint={`Abre as leituras sobre ${relacionado.titulo}`}
                            className="mb-3 w-full flex-row items-center gap-3 rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-3 active:opacity-75"
                          >
                            <View aria-hidden={true} className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: escuro ? relacionado.corBgDark : relacionado.corBg }}>
                              <IlustracaoTema tema={relacionado.id} cor={escuro ? relacionado.corTextoDark : relacionado.corTexto} tamanho={52} />
                            </View>
                            <View className="flex-1">
                              <Text className="font-bold text-cor-texto dark:text-cor-texto-dark">{relacionado.titulo}</Text>
                              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark" numberOfLines={2}>{relacionado.descricao}</Text>
                            </View>
                            <IconeUI name="next" size={16} color={escuro ? "#b3a894" : "#6b6153"} />
                          </Pressable>
                        </Link>
                      );
                    })}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {favoritas.length > 0 ? (
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2">Pesquisas favoritas</Text>
                  <View className="flex-row flex-wrap gap-2">{favoritas.slice(0, 8).map((item) => <Pressable key={item.termo} onPress={() => setTermo(item.termo)} accessibilityRole="button" className="px-3 py-2 rounded-full bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border border-cor-borda dark:border-cor-borda-dark active:opacity-70"><Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">★ {item.termo}</Text></Pressable>)}</View>
                </View>
              ) : null}
              <View className={`flex-row items-end justify-between ${desktop ? "mt-2 mb-4" : "mb-3"}`}>
                <View>
                  <Text className={desktop ? "text-xl font-bold text-cor-texto dark:text-cor-texto-dark" : "text-sm font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark"} style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>
                    Explore por tema
                  </Text>
                  {desktop ? <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">Escolha uma categoria e encontre passagens relacionadas.</Text> : null}
                </View>
                {desktop ? <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1">{TEMAS_BUSCA.length} temas</Text> : null}
              </View>
              <View className="flex-row flex-wrap justify-between">
                {TEMAS_BUSCA.map((tema) => (
                  <Pressable
                    key={tema.id}
                    onPress={() => abrirTema(tema)}
                    accessibilityRole="button"
                    accessibilityLabel={`${tema.titulo}. ${tema.descricao}`}
                    accessibilityHint={`Abre passagens bíblicas sobre ${tema.titulo}`}
                    style={{
                      backgroundColor: desktop ? (escuro ? "#262019" : "#fffdf9") : (escuro ? tema.corBgDark : tema.corBg),
                      borderColor: desktop ? (escuro ? "#3a3226" : "#e6ded0") : "transparent",
                      borderWidth: desktop ? 1 : 0,
                      width: desktop ? "23.5%" : "48%",
                      height: desktop ? 188 : 128,
                    }}
                    className={`rounded-3xl mb-3 overflow-hidden active:opacity-80 ${desktop ? "p-5 justify-between" : "justify-end"}`}
                  >
                    <View
                      style={desktop
                        ? { alignSelf: "flex-end", opacity: 0.86, transform: [{ rotate: "-8deg" }] }
                        : { position: "absolute", top: -10, right: -10, opacity: 0.5, transform: [{ rotate: "-12deg" }] }}
                    >
                      <IlustracaoTema tema={tema.id} cor={escuro ? tema.corTextoDark : tema.corTexto} tamanho={desktop ? 108 : 72} />
                    </View>
                    <View>
                      <Text style={{ color: escuro ? tema.corTextoDark : tema.corTexto }} className={desktop ? "text-lg font-bold" : "text-lg font-extrabold px-4 pb-4"}>
                        {tema.titulo}
                      </Text>
                      {desktop ? <Text className="text-xs leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">{tema.descricao}</Text> : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
