import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { carregarUltimaLeitura } from "../../../core/leitura/ultimaLeitura";

// A aba Bíblia não tem conteúdo próprio — abre direto no último
// capítulo lido (ou Gênesis 1 na primeira vez), como no app de
// referência deste plano (ver PLANO-NAVEGACAO.md, Fase 3). A tela de
// leitura em si vive fora do grupo de abas (app/biblia/[livro]/[capitulo].tsx),
// então a barra de abas some ao entrar — comportamento intencional,
// não um bug: ler não deveria competir por espaço de tela com a barra.
export default function BibliaTab() {
  useEffect(() => {
    carregarUltimaLeitura().then(({ livroSlug, capitulo }) => {
      router.replace(`/biblia/${livroSlug}/${capitulo}`);
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark">
      <ActivityIndicator />
    </View>
  );
}
