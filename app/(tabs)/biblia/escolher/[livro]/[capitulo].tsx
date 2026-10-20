import { Redirect, useLocalSearchParams } from "expo-router";

export default function RedirecionarEscolhaVersiculoLegada() {
  const { livro, capitulo } = useLocalSearchParams<{ livro: string; capitulo: string }>();
  if (!livro || !capitulo) return <Redirect href="/leitura/escolher" />;
  return <Redirect href={`/leitura/escolher/${livro}/${capitulo}` as never} />;
}
