import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { carregarUltimaLeitura } from "../../../core/leitura/ultimaLeitura";
import { mostrarToast } from "../../../core/util/toast";

const TEMPO_MAXIMO_CARREGAMENTO_MS = 1500;

// A aba Bíblia não tem conteúdo próprio — abre direto no último
// capítulo lido. Se a pessoa nunca leu nada ainda (primeira vez no
// app), não presume Gênesis 1: manda pra tela de escolher livro.
export default function BibliaTab() {
  useEffect(() => {
    let ativo = true;
    let navegou = false;
    const abrirSeletor = () => {
      if (!ativo || navegou) return;
      navegou = true;
      router.replace("/leitura/escolher");
    };

    // Um problema no armazenamento local não pode deixar a aba Bíblia
    // presa indefinidamente no indicador de carregamento. Se a leitura
    // anterior não responder a tempo, a pessoa ainda consegue escolher
    // livro e capítulo; a resposta tardia é ignorada para evitar saltos.
    const limite = setTimeout(abrirSeletor, TEMPO_MAXIMO_CARREGAMENTO_MS);

    carregarUltimaLeitura().then((ultima) => {
      if (!ativo || navegou) return;
      navegou = true;
      clearTimeout(limite);
      if (ultima) {
        router.replace(`/leitura/${ultima.livroSlug}/${ultima.capitulo}?origem=aba-biblia`);
      } else {
        router.replace("/leitura/escolher");
      }
    }).catch(() => {
      if (!ativo || navegou) return;
      navegou = true;
      clearTimeout(limite);
      mostrarToast("Não foi possível recuperar sua última leitura", { severidade: "erro" });
      router.replace("/leitura/escolher");
    });

    return () => {
      ativo = false;
      clearTimeout(limite);
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark">
      <ActivityIndicator accessibilityLabel="Abrindo sua última leitura" />
    </View>
  );
}
