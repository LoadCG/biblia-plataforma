import { Redirect } from "expo-router";

// Compatibilidade para links internos/deep links criados antes da mudança.
export default function RedirecionarEscolhaBibliaLegada() {
  return <Redirect href="/leitura/escolher" />;
}
