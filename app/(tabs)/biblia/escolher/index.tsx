import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Platform, Pressable, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../../../components/BotaoTema";
import { EstadoVazio } from "../../../../components/EstadoVazio";
import { GradeCapitulos } from "../../../../components/GradeCapitulos";
import { livros } from "../../../../core/content/livros";
import type { Livro } from "../../../../core/content/tipos";
import { carregarUltimaLeitura } from "../../../../core/leitura/ultimaLeitura";
import { progressoRepository } from "../../../../core/repositories";
import { mostrarToast } from "../../../../core/util/toast";
import { useOwnerId } from "../../../../core/useOwnerId";

const SET_VAZIO = new Set<number>();

export default function EscolherLivro() {
  const { livro: livroParaAbrir } = useLocalSearchParams<{ livro?: string }>();
  const [termo, setTermo] = useState("");
  const [livroExpandido, setLivroExpandido] = useState<string | null>(livroParaAbrir ?? null);
  const ownerId = useOwnerId();
  const [lidosPorLivro, setLidosPorLivro] = useState<Record<string, Set<number>>>({});
  const [livroSelecaoAtiva, setLivroSelecaoAtiva] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Se veio de "trocar livro" durante a leitura (com o slug do livro atual
    // na URL), abre esse livro direto — não o último lido, que pode ser
    // outro (ex.: usuário navegando por capítulos antigos).
    if (livroParaAbrir) return;
    carregarUltimaLeitura().then((ultima) => {
      if (ultima) setLivroExpandido(ultima.livroSlug);
    });
  }, [livroParaAbrir]);

  useEffect(() => {
    if (!ownerId) return;
    progressoRepository.listarTodos(ownerId).then((itens) => {
      const porLivro: Record<string, Set<number>> = {};
      for (const item of itens) {
        if (!porLivro[item.livroSlug]) porLivro[item.livroSlug] = new Set();
        porLivro[item.livroSlug].add(item.capitulo);
      }
      setLidosPorLivro(porLivro);
    });
  }, [ownerId]);

  const listaFiltrada = useMemo(() => {
    const termoNormalizado = termo.trim().toLowerCase();
    if (!termoNormalizado) return livros;
    return livros.filter((l) => l.nome.toLowerCase().includes(termoNormalizado));
  }, [termo]);

  function alternarModoSelecao(slug: string) {
    if (livroSelecaoAtiva === slug) {
      setLivroSelecaoAtiva(null);
      setSelecionados(new Set());
    } else {
      setLivroSelecaoAtiva(slug);
      setSelecionados(new Set());
    }
  }

  function alternarCapituloSelecionado(cap: number) {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(cap)) novo.delete(cap);
      else novo.add(cap);
      return novo;
    });
  }

  function aplicarEmLote(livroSlug: string, capitulos: number[], lido: boolean) {
    setLidosPorLivro((atual) => {
      const lidosAtuais = new Set(atual[livroSlug] ?? SET_VAZIO);
      for (const cap of capitulos) {
        if (lido) lidosAtuais.add(cap);
        else lidosAtuais.delete(cap);
      }
      return { ...atual, [livroSlug]: lidosAtuais };
    });
  }

  async function marcarSelecionados(livro: Livro, lido: boolean) {
    if (!ownerId || selecionados.size === 0) return;
    const capitulos = Array.from(selecionados);
    const refs = capitulos.map((capitulo) => ({ livroSlug: livro.slug, capitulo }));

    // Guarda o estado individual de cada capítulo antes da mudança — uma
    // seleção pode misturar capítulos já lidos com não lidos, então
    // "Desfazer" precisa restaurar cada um ao que era antes, não só
    // inverter tudo em bloco (senão desfazer um "Desmarcar" aplicado a uma
    // seleção mista marcaria como lido até quem nunca tinha sido).
    const lidosAntes = lidosPorLivro[livro.slug] ?? SET_VAZIO;
    const estadoAnterior = new Map(capitulos.map((c) => [c, lidosAntes.has(c)]));

    await progressoRepository.definirVarios(ownerId, refs, lido);
    aplicarEmLote(livro.slug, capitulos, lido);

    mostrarToast(
      lido
        ? `${refs.length} ${refs.length === 1 ? "capítulo marcado" : "capítulos marcados"} como lido${refs.length === 1 ? "" : "s"}`
        : `${refs.length} ${refs.length === 1 ? "capítulo desmarcado" : "capítulos desmarcados"}`,
      {
        acaoLabel: "Desfazer",
        onAcao: async () => {
          const paraLido = capitulos.filter((c) => estadoAnterior.get(c));
          const paraNaoLido = capitulos.filter((c) => !estadoAnterior.get(c));
          await Promise.all([
            paraLido.length
              ? progressoRepository.definirVarios(ownerId, paraLido.map((capitulo) => ({ livroSlug: livro.slug, capitulo })), true)
              : null,
            paraNaoLido.length
              ? progressoRepository.definirVarios(ownerId, paraNaoLido.map((capitulo) => ({ livroSlug: livro.slug, capitulo })), false)
              : null,
          ]);
          aplicarEmLote(livro.slug, paraLido, true);
          aplicarEmLote(livro.slug, paraNaoLido, false);
        },
      }
    );
    setLivroSelecaoAtiva(null);
    setSelecionados(new Set());
  }

  const renderItem = ({ item }: { item: Livro }) => {
    const expandido = livroExpandido === item.slug;
    const lidos = lidosPorLivro[item.slug] ?? SET_VAZIO;
    const emSelecao = livroSelecaoAtiva === item.slug;

    return (
      <View className="mb-2">
        <Pressable
          onPress={() => {
            if (emSelecao) {
              setLivroSelecaoAtiva(null);
              setSelecionados(new Set());
            }
            setLivroExpandido(expandido ? null : item.slug);
          }}
          className={`flex-row items-center justify-between px-4 py-4 rounded-xl active:bg-cor-fundo-elevado dark:active:bg-cor-fundo-elevado-dark ${expandido ? 'bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark' : ''}`}
        >
          <Text className="text-cor-texto dark:text-cor-texto-dark text-lg font-semibold">{item.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {lidos.size} de {item.capitulos}
          </Text>
        </Pressable>

        {expandido && (
          <View className="px-2 py-4 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark rounded-b-xl -mt-2 pt-6">
            <View className="flex-row items-center justify-between px-1 mb-4">
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {emSelecao
                  ? `${selecionados.size} selecionado${selecionados.size === 1 ? "" : "s"}${
                      Platform.OS === "web" && selecionados.size === 0 ? " — arraste pra selecionar um intervalo" : ""
                    }`
                  : "Toque num capítulo pra ler"}
              </Text>
              <Pressable
                onPress={() => alternarModoSelecao(item.slug)}
                accessibilityLabel={emSelecao ? "Cancelar seleção" : "Marcar vários capítulos como lidos"}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-cor-borda dark:bg-cor-borda-dark active:opacity-70"
              >
                <MaterialIcons
                  name={emSelecao ? "close" : "playlist-add-check"}
                  size={15}
                  className="text-cor-texto dark:text-cor-texto-dark"
                />
                <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
                  {emSelecao ? "Cancelar" : "Selecionar vários"}
                </Text>
              </Pressable>
            </View>

            <GradeCapitulos
              totalCapitulos={item.capitulos}
              lidos={lidos}
              onSelecionar={(cap) => router.push(`/biblia/${item.slug}/${cap}`)}
              selecionados={emSelecao ? selecionados : undefined}
              onAlternarSelecionado={emSelecao ? alternarCapituloSelecionado : undefined}
              onMudarSelecaoEmMassa={emSelecao ? setSelecionados : undefined}
            />

            {emSelecao && (
              <View className="flex-row items-center gap-2 mt-4 px-1">
                <Pressable
                  onPress={() => setSelecionados(new Set(Array.from({ length: item.capitulos }, (_, i) => i + 1)))}
                  className="px-3 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-70"
                >
                  <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Selecionar todos</Text>
                </Pressable>
                <Pressable
                  onPress={() => marcarSelecionados(item, false)}
                  disabled={selecionados.size === 0}
                  className={`px-3 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark ${selecionados.size === 0 ? "opacity-40" : "active:opacity-70"}`}
                >
                  <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Desmarcar</Text>
                </Pressable>
                <Pressable
                  onPress={() => marcarSelecionados(item, true)}
                  disabled={selecionados.size === 0}
                  className={`flex-1 items-center px-3 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark ${selecionados.size === 0 ? "opacity-40" : "active:opacity-70"}`}
                >
                  <Text className="text-xs font-semibold text-white">Marcar como lidos</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      {/* Header Fixo */}
      <View className="px-5 py-4 border-b border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark z-10">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center active:opacity-60">
              <Text className="text-cor-texto dark:text-cor-texto-dark text-xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Livros</Text>
          </View>
          <BotaoTema />
        </View>
        <TextInput
          value={termo}
          onChangeText={setTermo}
          placeholder="Buscar livro..."
          placeholderTextColor="#9ca3af"
          className="px-4 py-2.5 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark"
        />
      </View>

      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.slug}
        renderItem={renderItem}
        contentContainerClassName="px-4 pt-4 pb-32 max-w-2xl w-full mx-auto"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EstadoVazio titulo="Nenhum livro encontrado" descricao="Tente buscar por outro nome." />
        }
      />
    </View>
  );
}
