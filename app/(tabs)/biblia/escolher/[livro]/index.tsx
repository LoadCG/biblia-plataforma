import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { GradeCapitulos } from "../../../../../components/GradeCapitulos";
import { obterLivro } from "../../../../../core/content/livros";
import { progressoRepository } from "../../../../../core/repositories";
import { useOwnerId } from "../../../../../core/useOwnerId";

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

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-3xl w-full mx-auto">
        <Link href="/biblia/escolher" className="text-cor-destaque dark:text-cor-destaque-dark text-sm mb-2">
          ← Trocar de livro
        </Link>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">{livro.nome}</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Selecione o capítulo · {lidos.size} de {livro.capitulos} lidos
        </Text>

        <GradeCapitulos
          totalCapitulos={livro.capitulos}
          lidos={lidos}
          onSelecionar={(n) => router.push(`/biblia/${livro.slug}/${n}`)}
        />
      </View>
    </ScrollView>
  );
}
