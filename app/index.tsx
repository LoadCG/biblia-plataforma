import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { livros } from "../core/content/livros";
import type { Livro } from "../core/content/tipos";

function CardLivro({ livro }: { livro: Livro }) {
  return (
    <Link href={`/resumos/${livro.slug}`} asChild>
      <Pressable className="flex-row items-center gap-3 px-4 py-3 border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2">
        <View className="w-8 h-8 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center">
          <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">{livro.numero}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">{livro.genero}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function Home() {
  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <FlatList
        data={livros}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <CardLivro livro={item} />}
        contentContainerClassName="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto"
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">
              Resumo dos 66 Livros da Bíblia
            </Text>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">
              Toque num livro para ver o resumo histórico.
            </Text>
          </View>
        }
      />
    </View>
  );
}
