import { Stack } from "expo-router";

// Sem este layout, o Expo Router expõe app/(tabs)/biblia/[livro]/index.tsx
// como uma aba própria (rota "solta"), em vez de empilhar dentro da aba
// "Bíblia" — index.tsx e escolher/** precisam viver na mesma navegação
// de pilha pra aparecerem como uma aba só.
//
// "escolher" (livro → capítulo) usa presentation "modal" — decisão
// registrada em PLANO-NAVEGACAO.md item 1.4: é uma ferramenta de
// navegação temporária, não uma tela de conteúdo, então desliza por
// cima cobrindo inclusive a barra de abas, com jeito óbvio de fechar
// (voltar).
export default function BibliaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="escolher/index" options={{ presentation: "modal" }} />
      <Stack.Screen name="[livro]/[capitulo]" />
    </Stack>
  );
}
