import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";
import { coresDoGenero } from "../../core/content/genero";
import { livros } from "../../core/content/livros";
import type { Livro } from "../../core/content/tipos";

function CardLivro({ livro }: { livro: Livro }) {
  const cores = coresDoGenero(livro.genero);
  return (
    <Link href={`/biblia/${livro.slug}`} asChild>
      <Pressable className="flex-row items-center gap-3 px-4 py-3 border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2">
        <View className={`w-8 h-8 rounded-full items-center justify-center ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.texto}`}>{livro.numero}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {livro.capitulos} {livro.capitulos > 1 ? "capítulos" : "capítulo"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function EscolherLivro() {
  const [termo, setTermo] = useState("");

  const listaFiltrada = useMemo(() => {
    const termoNormalizado = termo.trim().toLowerCase();
    if (!termoNormalizado) return livros;
    return livros.filter((l) => l.nome.toLowerCase().includes(termoNormalizado));
  }, [termo]);

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <CardLivro livro={item} />}
        contentContainerClassName="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-3">
                <Link href="/" className="text-cor-destaque dark:text-cor-destaque-dark text-sm mb-1">
                  ← Todos os livros
                </Link>
                <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Ler a Bíblia</Text>
              </View>
              <BotaoTema />
            </View>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
              Escolha um livro para começar.
            </Text>
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Buscar por nome do livro..."
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
