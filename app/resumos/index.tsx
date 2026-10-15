import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";
import { EstadoVazio } from "../../components/EstadoVazio";
import { EstadoErro } from "../../components/EstadoErro";
import { buscarLivros } from "../../core/content/busca";
import { coresDoGenero } from "../../core/content/genero";
import { livros } from "../../core/content/livros";
import type { Livro } from "../../core/content/tipos";
import { livrosLidosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";
import { IconeUI } from "../../components/icone/IconeUI";
import { mostrarToast } from "../../core/util/toast";
import { useColorScheme } from "../../core/theme";

function CardLivro({ livro, lido, trecho }: { livro: Livro; lido: boolean; trecho: string | null }) {
  const cores = coresDoGenero(livro.genero);
  return (
    <Link href={`/resumos/${livro.slug}`} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${livro.nome}${lido ? ", lido" : ""}`}
        className={`flex-row items-center gap-3 px-4 py-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2 shadow-sm active:opacity-80 ${
          lido ? "border border-green-600" : ""
        }`}
        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.texto}`}>{livro.numero}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">{livro.genero}</Text>
          {trecho ? (
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5 italic" numberOfLines={2}>
              "{trecho}"
            </Text>
          ) : null}
        </View>
        {lido ? <Text className="text-green-600 font-bold">✓</Text> : null}
      </Pressable>
    </Link>
  );
}

export default function ListaResumos() {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const ownerId = useOwnerId();
  const [termo, setTermo] = useState("");
  const [lidos, setLidos] = useState<string[]>([]);
  const [estadoProgresso, setEstadoProgresso] = useState<"carregando" | "disponivel" | "erro">("carregando");
  const [tentativaProgresso, setTentativaProgresso] = useState(0);
  const progressoCarregado = useRef(false);
  const ownerProgresso = useRef<string | null>(null);

  useFocusEffect(useCallback(() => {
    if (!ownerId) {
      setLidos([]);
      setEstadoProgresso("carregando");
      progressoCarregado.current = false;
      ownerProgresso.current = null;
      return;
    }

    if (ownerProgresso.current !== ownerId) {
      setLidos([]);
      progressoCarregado.current = false;
      ownerProgresso.current = ownerId;
    }
    if (!progressoCarregado.current) setEstadoProgresso("carregando");

    let ativo = true;
    livrosLidosRepository.listar(ownerId)
      .then((itens) => {
        if (!ativo) return;
        setLidos(itens);
        progressoCarregado.current = true;
        setEstadoProgresso("disponivel");
      })
      .catch(() => {
        if (!ativo) return;
        if (progressoCarregado.current) {
          mostrarToast("Não foi possível atualizar seu progresso de leitura", { severidade: "erro" });
        } else {
          setEstadoProgresso("erro");
        }
      });
    return () => { ativo = false; };
  }, [ownerId, tentativaProgresso]));

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const listaFiltrada = useMemo(() => buscarLivros(termo), [termo]);

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.livro.slug}
        renderItem={({ item }) => <CardLivro livro={item.livro} lido={lidosSet.has(item.livro.slug)} trecho={item.trecho} />}
        contentContainerClassName="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-3">
                <Link href="/" asChild>
                  <Pressable accessibilityRole="link" accessibilityLabel="Voltar para início" className="min-h-11 justify-center self-start pr-3 mb-1 active:opacity-70">
                    <Text className="text-cor-destaque dark:text-cor-destaque-dark text-sm">← Início</Text>
                  </Pressable>
                </Link>
                <Text accessibilityRole="header" className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Estude por resumos</Text>
              </View>
              <BotaoTema />
            </View>
            {estadoProgresso === "erro" ? (
              <EstadoErro
                titulo="Progresso indisponível"
                descricao="A lista de resumos continua disponível. Tente carregar seu progresso novamente."
                aoTentarNovamente={() => setTentativaProgresso((atual) => atual + 1)}
              />
            ) : (
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
                {estadoProgresso === "carregando" ? "Carregando seu progresso de leitura…" : `${lidos.length} de ${livros.length} livros lidos`}
              </Text>
            )}
            <View className="relative">
              <TextInput
                testID="busca-resumos"
                accessibilityLabel="Buscar nos resumos"
                accessibilityHint="Digite o nome de um livro ou uma palavra do resumo"
                value={termo}
                onChangeText={setTermo}
                placeholder="Buscar livro ou palavra"
                placeholderTextColor="#9ca3af"
                className="px-4 pr-12 py-3 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark"
              />
              {termo ? (
                <Pressable testID="limpar-busca-resumos" onPress={() => setTermo("")} accessibilityRole="button" accessibilityLabel="Limpar busca dos resumos" hitSlop={10} className="absolute right-3 top-1.5 h-9 w-9 items-center justify-center rounded-full active:opacity-60">
                  <IconeUI name="close" size={20} color={escuro ? "#b3a894" : "#6b6257"} />
                </Pressable>
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EstadoVazio
            titulo="Nenhum livro encontrado"
            descricao="Tente buscar por outro nome ou palavra."
            acao={termo ? { rotulo: "Limpar busca", aoPressionar: () => setTermo("") } : undefined}
          />
        }
      />
    </View>
  );
}
