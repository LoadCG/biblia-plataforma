import { Redirect, useLocalSearchParams } from "expo-router";

// Compatibilidade para links internos/deep links criados antes da mudança.
// Preserva ?livro= e demais parâmetros.
export default function RedirecionarEscolhaBibliaLegada() {
  const params = useLocalSearchParams<Record<string, string>>();
  return <Redirect href={{ pathname: "/leitura/escolher", params } as never} />;
}
