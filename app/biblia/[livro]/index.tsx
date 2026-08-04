import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { obterLivro } from "../../../core/content/livros";
import { progressoRepository } from "../../../core/repositories";
import { useOwnerId } from "../../../core/useOwnerId";

export default function EscolherCapitulo() {
  const { livro: slug } = useLocalSearchParams<{ livro: string }>();
  const livro = obterLivro(slug ?? "");
  const ownerId = useOwnerId();
  const [lidos, setLidos] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!ownerId || !livro) return;
    progressoRepository.listarCapitulosLidos(ownerId, livro.slug).then((itens) => {
      setLidos(new Set(itens.map((i) => i.capitulo)));
    });
  }, [ownerId, livro]);

  if (!livro) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Livro não encontrado.</Text>
      </View>
    );
  }

  const capitulos = Array.from({ length: livro.capitulos }, (_, i) => i + 1);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <Link href="/biblia" className="text-cor-destaque dark:text-cor-destaque-dark text-sm mb-2">
          ← Trocar de livro
        </Link>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">{livro.nome}</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Selecione o capítulo · {lidos.size} de {livro.capitulos} lidos
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {capitulos.map((n) => (
            <Link key={n} href={`/biblia/${livro.slug}/${n}`} asChild>
              <Pressable
                className={`w-14 h-14 items-center justify-center rounded-xl border ${
                  lidos.has(n)
                    ? "border-green-600 bg-green-600"
                    : "border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    lidos.has(n) ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"
                  }`}
                >
                  {n}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
