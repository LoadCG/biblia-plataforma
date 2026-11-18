import { Redirect, useLocalSearchParams } from "expo-router";

// Compatibilidade: preserva query params (?versiculo=, ?origem=...) de links antigos.
export default function RedirecionarCapituloLegado() {
  const { livro, capitulo, ...resto } = useLocalSearchParams<Record<string, string>>();
  if (!livro || !capitulo) return <Redirect href="/leitura" />;
  return <Redirect href={{ pathname: `/leitura/${livro}/${capitulo}`, params: resto } as never} />;
}
