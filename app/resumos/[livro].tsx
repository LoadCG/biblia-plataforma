import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { coresDoGenero } from "../../core/content/genero";
import { livros, obterResumo } from "../../core/content/livros";
import { livrosLidosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";
import { BotaoTema } from "../../components/BotaoTema";

export default function ResumoLivro() {
  const { livro: slug } = useLocalSearchParams<{ livro: string }>();
  const resumo = obterResumo(slug ?? "");
  const ownerId = useOwnerId();
  const [lido, setLido] = useState(false);

  useEffect(() => {
    if (!ownerId || !slug) return;
    livrosLidosRepository.estaLido(ownerId, slug).then(setLido);
  }, [ownerId, slug]);

  if (!resumo) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Livro não encontrado.</Text>
        <Link href="/" className="text-cor-destaque dark:text-cor-destaque-dark mt-3">
          Voltar para todos os livros
        </Link>
      </View>
    );
  }

  const indice = livros.findIndex((l) => l.slug === resumo.slug);
  const anterior = indice > 0 ? livros[indice - 1] : null;
  const proximo = indice < livros.length - 1 ? livros[indice + 1] : null;
  const cores = coresDoGenero(resumo.genero);

  async function alternarLido() {
    if (!ownerId) return;
    const novoEstado = await livrosLidosRepository.alternar(ownerId, resumo!.slug);
    setLido(novoEstado);
  }

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Stack.Screen options={{ title: resumo.nome }} />
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-4">
          <Link href="/" className="text-cor-destaque dark:text-cor-destaque-dark">
            ← Todos os livros
          </Link>
          <BotaoTema />
        </View>

        <View className={`self-start px-3 py-1 rounded-full mb-2 ${cores.bg}`}>
          <Text className={`text-xs font-semibold ${cores.texto}`}>{resumo.genero}</Text>
        </View>
        <Text className="text-3xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">{resumo.nome}</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">
          Livro {resumo.numero} de 66 · {resumo.testamento} · {resumo.capitulos} capítulos ·{" "}
          {resumo.tempoLeituraMin} min de leitura
        </Text>

        <Pressable
          onPress={alternarLido}
          className={`self-start px-4 py-2.5 rounded-full mb-6 ${
            lido ? "bg-green-600" : "border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
          }`}
        >
          <Text className={`text-sm font-semibold ${lido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
            {lido ? "✓ Livro lido" : "Marcar como lido"}
          </Text>
        </Pressable>

        <View className="border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-8">
          {resumo.fichaRapida.map((item, i) => (
            <View
              key={item.rotulo}
              className={`px-4 py-3 ${
                i < resumo.fichaRapida.length - 1 ? "border-b border-cor-borda dark:border-cor-borda-dark" : ""
              }`}
            >
              <Text className="text-xs font-semibold uppercase text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {item.rotulo}
              </Text>
              <Text className="text-cor-texto dark:text-cor-texto-dark mt-0.5">{item.valor}</Text>
            </View>
          ))}
        </View>

        {resumo.secoes.map((secao) => (
          <View key={secao.id} className="mb-7">
            <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-2">{secao.titulo}</Text>
            {secao.lista
              ? secao.itens.map((item, i) => (
                  <Text key={i} className="text-cor-texto dark:text-cor-texto-dark leading-6 mb-1.5">
                    • {item}
                  </Text>
                ))
              : secao.paragrafos.map((paragrafo, i) => (
                  <Text key={i} className="text-cor-texto dark:text-cor-texto-dark leading-6 mb-3">
                    {paragrafo}
                  </Text>
                ))}
          </View>
        ))}

        <View className="flex-row gap-3 mt-4 border-t border-cor-borda dark:border-cor-borda-dark pt-5">
          <View className="flex-1">
            {anterior ? (
              <Link href={`/resumos/${anterior.slug}`} asChild>
                <Pressable className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">← Anterior</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{anterior.nome}</Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
          <View className="flex-1">
            {proximo ? (
              <Link href={`/resumos/${proximo.slug}`} asChild>
                <Pressable className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3 items-end">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Próximo →</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{proximo.nome}</Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
