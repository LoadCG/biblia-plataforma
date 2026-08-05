import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { buscarLivros } from "../core/content/busca";
import { calcularConquistas } from "../core/content/conquistas";
import { coresDoGenero } from "../core/content/genero";
import { livros } from "../core/content/livros";
import type { Livro } from "../core/content/tipos";
import { calcularSequenciaAtual } from "../core/estatisticas/streak";
import { livrosLidosRepository, progressoRepository } from "../core/repositories";
import { useOwnerId } from "../core/useOwnerId";
import { BotaoTema } from "../components/BotaoTema";
import { CardVersiculoDia } from "../components/CardVersiculoDia";
import { FaixaConquistas } from "../components/FaixaConquistas";

function CardLivro({ livro, lido, trecho }: { livro: Livro; lido: boolean; trecho: string | null }) {
  const cores = coresDoGenero(livro.genero);
  return (
    <Link href={`/resumos/${livro.slug}`} asChild>
      <Pressable
        className={`flex-row items-center gap-3 px-4 py-3 border rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2 ${
          lido ? "border-green-600" : "border-cor-borda dark:border-cor-borda-dark"
        }`}
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

export default function Home() {
  const ownerId = useOwnerId();
  const [termo, setTermo] = useState("");
  const [lidos, setLidos] = useState<string[]>([]);
  const [sequencia, setSequencia] = useState(0);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
    progressoRepository.listarTodos(ownerId).then((itens) => {
      setSequencia(calcularSequenciaAtual(itens.map((i) => i.lidoEm)));
    });
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const conquistas = useMemo(() => calcularConquistas(lidosSet), [lidosSet]);

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
              <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark flex-1 mr-3">
                Resumo dos 66 Livros da Bíblia
              </Text>
              <BotaoTema />
            </View>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {lidos.length} de {livros.length} livros lidos
              </Text>
              <Link href="/estatisticas" className="text-xs text-cor-destaque dark:text-cor-destaque-dark">
                Minhas estatísticas
              </Link>
            </View>
            {sequencia >= 2 ? (
              <Text className="text-sm text-cor-destaque dark:text-cor-destaque-dark mb-3">
                Você já leu em {sequencia} dias seguidos
              </Text>
            ) : (
              <View className="mb-3" />
            )}
            <FaixaConquistas conquistas={conquistas} />
            <CardVersiculoDia />
            <Link
              href="/biblia"
              className="self-start px-4 py-2.5 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark font-semibold mb-3"
            >
              📖 Ler a Bíblia
            </Link>
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Buscar por livro ou palavra no resumo..."
              placeholderTextColor="#9ca3af"
              className="px-4 py-3 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark"
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-cor-texto-suave dark:text-cor-texto-suave-dark mt-6">
            Nenhum livro encontrado.
          </Text>
        }
      />
    </View>
  );
}
