import { Stack } from "expo-router";

// Sem este layout, o Expo Router expõe app/(tabs)/biblia/[livro]/index.tsx
// como uma aba própria (rota "solta"), em vez de empilhar dentro da aba
// "Bíblia" — index.tsx e [livro]/index.tsx precisam viver na mesma
// navegação de pilha pra aparecerem como uma aba só.
export default function BibliaLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
