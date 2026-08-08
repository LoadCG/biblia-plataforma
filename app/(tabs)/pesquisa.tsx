import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";
import { CardVersiculoTema } from "../../components/CardVersiculoTema";
import { EstadoVazio } from "../../components/EstadoVazio";
import { buscarLivros } from "../../core/content/busca";
import { TEMAS_BUSCA, type Tema } from "../../core/biblia/temasBusca";
import { pesquisasFavoritasRepository } from "../../core/repositories";
import { useColorScheme } from "../../core/theme";
import { useOwnerId } from "../../core/useOwnerId";

export default function Pesquisa() {
  const [termo, setTermo] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [favoritada, setFavoritada] = useState(false);
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const ownerId = useOwnerId();

  const resultadosResumo = useMemo(() => (termo.trim() ? buscarLivros(termo) : []), [termo]);

  useEffect(() => {
    if (!ownerId || !termo.trim()) {
      setFavoritada(false);
      return;
    }
    pesquisasFavoritasRepository.estaFavoritada(ownerId, termo).then(setFavoritada);
  }, [ownerId, termo]);

  async function alternarFavorita() {
    if (!ownerId || !termo.trim()) return;
    setFavoritada(await pesquisasFavoritasRepository.alternar(ownerId, termo));
  }

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-6 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Pesquisa</Text>
          <BotaoTema />
        </View>
        <TextInput
          value={termo}
          onChangeText={(t) => {
            setTermo(t);
            if (t.trim()) setTemaSelecionado(null);
          }}
          placeholder="Buscar palavra nos resumos bíblicos..."
          placeholderTextColor="#9ca3af"
          className="px-4 py-3.5 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark text-base"
        />
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-2 mb-1">
          Busca hoje só no conteúdo dos resumos — busca no texto bíblico inteiro é uma entrega maior, planejada à
          parte (ver PLANO-NAVEGACAO.md).
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 pt-2 pb-10 max-w-2xl w-full mx-auto">
          {termo.trim() ? (
            <>
              <Pressable
                onPress={alternarFavorita}
                accessibilityLabel={favoritada ? "Remover busca dos favoritos" : "Favoritar esta busca"}
                className="flex-row items-center gap-1.5 self-start mb-3 px-3 py-1.5 rounded-full border border-cor-borda dark:border-cor-borda-dark"
              >
                <Text>{favoritada ? "★" : "☆"}</Text>
                <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
                  {favoritada ? "Busca favoritada" : "Favoritar esta busca"}
                </Text>
              </Pressable>
              {resultadosResumo.length === 0 ? (
                <EstadoVazio titulo="Nenhum resultado" descricao="Tente outra palavra ou o nome de um livro." />
              ) : (
                resultadosResumo.map(({ livro, trecho }) => (
                  <Link key={livro.slug} href={`/resumos/${livro.slug}`} asChild>
                    <Pressable
                      className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3 mb-2 shadow-sm"
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
              )}
            </>
          ) : temaSelecionado ? (
            <>
              <Pressable onPress={() => setTemaSelecionado(null)} className="self-start mb-3">
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
                Ou explore por tema
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {TEMAS_BUSCA.map((tema) => (
                  <Pressable
                    key={tema.id}
                    onPress={() => setTemaSelecionado(tema)}
                    style={{ backgroundColor: escuro ? tema.corBgDark : tema.corBg, width: "48%" }}
                    className="rounded-2xl px-4 py-6 mb-3 items-start"
                  >
                    <Text className="text-3xl mb-2">{tema.icone}</Text>
                    <Text style={{ color: escuro ? tema.corTextoDark : tema.corTexto }} className="text-base font-bold">
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
