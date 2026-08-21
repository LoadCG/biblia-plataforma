import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { BotaoTema } from "../../../../../components/BotaoTema";
import { GradeCapitulos } from "../../../../../components/GradeCapitulos";
import { buscarReferencia } from "../../../../../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../../../../../core/biblia/tipos";
import { obterLivro } from "../../../../../core/content/livros";
import { grifosRepository } from "../../../../../core/repositories";
import { mensagemErroAmigavel } from "../../../../../core/util/erroAmigavel";
import { useOwnerId } from "../../../../../core/useOwnerId";

// Tela de escolher um versículo específico dentro de um capítulo (ver
// 2.2b do FUNCIONALIDADES.md) — reconstruída em 2026-08-20 depois de
// ter sido removida em 2026-08-11 por um bug: a versão antiga buscava
// o texto do capítulo usando o slug da URL direto, mas `buscarReferencia`
// espera o nome do livro (`${livro.nome} ${capitulo}`, ver
// app/(tabs)/biblia/[livro]/[capitulo].tsx) — por isso sempre vinha vazio.
// Aqui o livro é resolvido primeiro via `obterLivro(slug)` e só então
// o nome dele é usado na busca, do mesmo jeito que a leitura já faz.
export default function EscolherVersiculo() {
  const params = useLocalSearchParams<{ livro: string; capitulo: string }>();
  const livro = obterLivro(params.livro ?? "");
  const capitulo = parseInt(params.capitulo ?? "", 10);
  const ownerId = useOwnerId();

  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [grifados, setGrifados] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!livro || !capitulo) return;
    setDados(null);
    setErro(null);
    buscarReferencia(`${livro.nome} ${capitulo}`)
      .then(setDados)
      .catch((e) => setErro(mensagemErroAmigavel(e)));
  }, [livro?.slug, capitulo]);

  useEffect(() => {
    if (!ownerId || !livro) return;
    grifosRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setGrifados(new Set(itens.map((g) => g.versiculo)));
    });
  }, [ownerId, livro?.slug, capitulo]);

  if (!livro || !capitulo) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Capítulo não encontrado.</Text>
      </View>
    );
  }

  const totalVersiculos = dados?.versiculos?.length ?? 0;

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 py-4 border-b border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark z-10">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" className="w-8 h-8 items-center justify-center active:opacity-60">
              <Text className="text-cor-texto dark:text-cor-texto-dark text-xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">
              {livro.nome} {capitulo}
            </Text>
          </View>
          <BotaoTema />
        </View>
      </View>

      <View className="px-4 pt-4 pb-10 max-w-2xl w-full mx-auto">
        {erro ? (
          <Text className="text-red-500 text-center mt-8">{erro}</Text>
        ) : !dados ? (
          <ActivityIndicator className="mt-8" />
        ) : (
          <>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4 px-1">
              Toque num versículo pra ir direto pra ele
            </Text>
            <GradeCapitulos
              totalCapitulos={totalVersiculos}
              lidos={grifados}
              rotulo="Versículo"
              onSelecionar={(versiculo) => router.push(`/biblia/${livro.slug}/${capitulo}?versiculo=${versiculo}`)}
            />
          </>
        )}
      </View>
    </View>
  );
}
