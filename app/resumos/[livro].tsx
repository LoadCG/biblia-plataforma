import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { obterResumo } from "../../core/content/livros";

export default function ResumoLivro() {
  const { livro: slug } = useLocalSearchParams<{ livro: string }>();
  const resumo = obterResumo(slug ?? "");

  if (!resumo) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Livro não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Stack.Screen options={{ title: resumo.nome }} />
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
          Livro {resumo.numero} de 66 · {resumo.testamento} · {resumo.genero}
        </Text>
        <Text className="text-3xl font-bold text-cor-texto dark:text-cor-texto-dark mt-1 mb-1">
          {resumo.nome}
        </Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-6">
          {resumo.capitulos} capítulos · {resumo.tempoLeituraMin} min de leitura
        </Text>

        <View className="border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-8">
          {resumo.fichaRapida.map((item, indice) => (
            <View
              key={item.rotulo}
              className={`px-4 py-3 ${
                indice < resumo.fichaRapida.length - 1 ? "border-b border-cor-borda dark:border-cor-borda-dark" : ""
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
      </View>
    </ScrollView>
  );
}
