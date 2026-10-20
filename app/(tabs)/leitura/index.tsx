import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { carregarUltimaLeitura } from "../../../core/leitura/ultimaLeitura";
import { mostrarToast } from "../../../core/util/toast";

// A aba Bíblia não tem conteúdo próprio — abre direto no último
// capítulo lido. Se a pessoa nunca leu nada ainda (primeira vez no
// app), não presume Gênesis 1: manda pra tela de escolher livro.
export default function BibliaTab() {
  useEffect(() => {
    carregarUltimaLeitura().then((ultima) => {
      if (ultima) {
        router.replace(`/biblia/${ultima.livroSlug}/${ultima.capitulo}?origem=aba-biblia`);
      } else {
        router.replace("/biblia/escolher");
      }
    }).catch(() => {
      mostrarToast("Não foi possível recuperar sua última leitura", { severidade: "erro" });
      router.replace("/biblia/escolher");
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark">
      <ActivityIndicator accessibilityLabel="Abrindo sua última leitura" />
    </View>
  );
}
