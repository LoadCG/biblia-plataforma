import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { CardVersiculoTema } from "../../components/CardVersiculoTema";
import { EstadoVazio } from "../../components/EstadoVazio";
import { IlustracaoTema } from "../../components/IlustracaoTema";
import { buscarLivros } from "../../core/content/busca";
import { livros } from "../../core/content/livros";
import { buscarGlobal, ResultadoBuscaGlobal } from "../../core/biblia/BibliaAPI";
import { TEMAS_BUSCA, type Tema } from "../../core/biblia/temasBusca";
import { pesquisasFavoritasRepository } from "../../core/repositories";
import { useColorScheme } from "../../core/theme";
import { mensagemErroAmigavel } from "../../core/util/erroAmigavel";
import { useOwnerId } from "../../core/useOwnerId";

// "Planos" agora navega de verdade pra /planos (ver app/planos/index.tsx).
// "Favoritos" e "Apoie" continuam sem tela/funcionalidade própria —
// desabilitados de verdade (mesmo padrão do sino de notificações da
// Início e do "Enviar diariamente" do Versículo do Dia), não fingem
// ser clicáveis com um alerta falso. Quando existirem, troque `disabled`
// por navegação de verdade.
const ATALHOS_EM_BREVE: { id: string; rotulo: string; icone: keyof typeof MaterialIcons.glyphMap }[] = [
  { id: "favoritos", rotulo: "Favoritos", icone: "star-border" },
  { id: "apoie", rotulo: "Apoie", icone: "favorite-border" },
];

export default function Pesquisa() {
  const [termo, setTermo] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [favoritada, setFavoritada] = useState(false);
  const [resultadosBiblia, setResultadosBiblia] = useState<ResultadoBuscaGlobal[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [abaExibicao, setAbaExibicao] = useState<'biblia' | 'resumos'>('biblia');
  
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const ownerId = useOwnerId();

  const resultadosResumo = useMemo(() => (termo.trim() ? buscarLivros(termo) : []), [termo]);

  useEffect(() => {
    if (!ownerId || !termo.trim()) {
      setFavoritada(false);
      setResultadosBiblia([]);
      return;
    }
    
    pesquisasFavoritasRepository.estaFavoritada(ownerId, termo).then(setFavoritada);
    
    // Busca assíncrona na Bíblia
    const timeout = setTimeout(() => {
      setBuscando(true);
      setErroBusca(null);
      buscarGlobal(termo)
        .then(setResultadosBiblia)
        .catch((e) => setErroBusca(mensagemErroAmigavel(e)))
        .finally(() => setBuscando(false));
    }, 500); // debounce de 500ms
    
    return () => clearTimeout(timeout);
  }, [ownerId, termo]);

  async function alternarFavorita() {
    if (!ownerId || !termo.trim()) return;
    setFavoritada(await pesquisasFavoritasRepository.alternar(ownerId, termo));
  }

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Descubra</Text>
          <BotaoTema />
        </View>

        {!termo.trim() ? (
          <View className="flex-row justify-between mb-4">
            <Pressable
              onPress={() => router.push("/planos")}
              accessibilityRole="link"
              className="flex-1 items-center gap-1.5 mx-1 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark py-3.5 active:opacity-70"
            >
              <MaterialIcons name="event-note" size={20} color={escuro ? "#e0a75e" : "#8a5a2b"} />
              <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Planos</Text>
            </Pressable>
            {ATALHOS_EM_BREVE.map((atalho) => (
              <Pressable
                key={atalho.id}
                disabled
                accessibilityRole="button"
                accessibilityLabel={`${atalho.rotulo} (em breve)`}
                accessibilityState={{ disabled: true }}
                className="flex-1 items-center gap-1.5 mx-1 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark py-3.5 opacity-40"
              >
                <MaterialIcons name={atalho.icone} size={20} color={escuro ? "#e0a75e" : "#8a5a2b"} />
                <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{atalho.rotulo}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <TextInput
          value={termo}
          onChangeText={(t) => {
            setTermo(t);
            if (t.trim()) setTemaSelecionado(null);
          }}
          placeholder="Buscar palavra na Bíblia ou nos resumos..."
          placeholderTextColor="#9ca3af"
          className="px-4 py-3.5 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark text-base"
        />
        
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
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 pt-2 pb-10 max-w-2xl w-full mx-auto">
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
                  <EstadoVazio titulo="Nenhum resultado nos resumos" descricao="Tente pesquisar na aba da Bíblia." />
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
                buscando ? (
                  <ActivityIndicator size="large" className="mt-8" />
                ) : erroBusca ? (
                  <EstadoVazio titulo="Não foi possível buscar" descricao={erroBusca} />
                ) : resultadosBiblia.length === 0 ? (
                  <EstadoVazio titulo="Nenhum versículo encontrado" descricao="Tente outra palavra." />
                ) : (
                  resultadosBiblia.map((resultado, i) => {
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
                        <Text className="text-sm text-cor-texto dark:text-cor-texto-dark" numberOfLines={3}>
                          "{resultado.texto}"
                        </Text>
                      </Pressable>
                    </Link>
                    );
                  })
                )
              )}
            </>
          ) : temaSelecionado ? (
            <>
              <Pressable onPress={() => setTemaSelecionado(null)} accessibilityRole="button" className="self-start mb-3 active:opacity-60">
                <Text className="text-sm text-cor-destaque dark:text-cor-destaque-dark font-semibold">← Voltar aos temas</Text>
              </Pressable>
              <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-3">{temaSelecionado.titulo}</Text>
              {temaSelecionado.referencias.map((ref) => (
                <CardVersiculoTema key={ref} referencia={ref} />
              ))}
            </>
          ) : (
            <>
              <Text className="text-sm font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
                Explore por tema
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {TEMAS_BUSCA.map((tema) => (
                  <Pressable
                    key={tema.id}
                    onPress={() => setTemaSelecionado(tema)}
                    accessibilityRole="button"
                    accessibilityLabel={tema.titulo}
                    style={{ backgroundColor: escuro ? tema.corBgDark : tema.corBg, width: "48%", height: 128 }}
                    className="rounded-3xl mb-3 justify-end overflow-hidden active:opacity-80"
                  >
                    <View
                      style={{ position: "absolute", top: -10, right: -10, opacity: 0.5, transform: [{ rotate: "-12deg" }] }}
                    >
                      <IlustracaoTema tema={tema.id} cor={escuro ? tema.corTextoDark : tema.corTexto} tamanho={72} />
                    </View>
                    <Text
                      style={{ color: escuro ? tema.corTextoDark : tema.corTexto }}
                      className="text-lg font-extrabold px-4 pb-4"
                    >
                      {tema.titulo}
                    </Text>
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
