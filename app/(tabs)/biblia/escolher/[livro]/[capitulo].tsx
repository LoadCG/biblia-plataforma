import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../../../../../components/BotaoTema";
import { buscarReferencia } from "../../../../../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../../../../../core/biblia/tipos";
import { obterLivro } from "../../../../../core/content/livros";

export default function EscolherVersiculo() {
  const { livro: livroSlug, capitulo } = useLocalSearchParams<{ livro: string; capitulo: string }>();
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState(false);

  const livro = obterLivro(livroSlug || "");

  useEffect(() => {
    if (!livroSlug || !capitulo) return;
    buscarReferencia(`${livroSlug} ${capitulo}`)
      .then((resultado) => setDados(resultado))
      .catch(() => setErro(true));
  }, [livroSlug, capitulo]);

  if (!livro) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Livro não encontrado.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 py-4 flex-row items-center justify-between border-b border-cor-borda dark:border-cor-borda-dark">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
            <Text className="text-cor-texto dark:text-cor-texto-dark text-xl">←</Text>
          </Pressable>
          <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark">Selecionar versículo</Text>
        </View>
        <BotaoTema />
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 py-6">
          <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-6">
            {livro.nome} {capitulo}
          </Text>

          {erro ? (
            <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">
              Erro ao carregar versículos. Tente novamente mais tarde.
            </Text>
          ) : !dados ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {dados.versiculos?.map((v) => (
                <Pressable
                  key={v.numero}
                  onPress={() => router.push(`/biblia/${livroSlug}/${capitulo}?versiculo=${v.numero}`)}
                  className="w-[18%] aspect-square rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark items-center justify-center"
                >
                  <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark">{v.numero}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
