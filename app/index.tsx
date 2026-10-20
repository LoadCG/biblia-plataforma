import { Redirect } from "expo-router";

// No app nativo, a entrada vai direto para a home do aplicativo.
export default function InicioNativo() {
  return <Redirect href="/biblia" />;
}
