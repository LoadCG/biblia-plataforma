import { Redirect, useLocalSearchParams } from "expo-router";

export default function RedirecionarCapituloLegado() {
  const { livro, capitulo } = useLocalSearchParams<{ livro: string; capitulo: string }>();
  if (!livro || !capitulo) return <Redirect href="/leitura" />;
  return <Redirect href={`/leitura/${livro}/${capitulo}` as never} />;
}
