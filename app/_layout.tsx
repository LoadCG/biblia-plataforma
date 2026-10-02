import "../global.css";
import { useEffect } from "react";
import { router, Stack, useSegments } from "expo-router";
import Head from "expo-router/head";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { Toast } from "../components/Toast";
import { corrigirAlturaViewportMobile } from "../core/corrigirAlturaViewportMobile";
import { registrarServiceWorker } from "../core/registrarServiceWorker";
import { restaurarTema } from "../core/theme";
import { onboardingConcluido } from "../core/leitura/onboarding";
import { mostrarToast } from "../core/util/toast";

// Capturado antes de o Expo Router restaurar o estado de navegação. Em uma
// exportação estática, ler o pathname só dentro do effect pode observar `/`
// durante a hidratação mesmo quando a entrada pública foi um deep link.
const CAMINHO_INICIAL_WEB = Platform.OS === "web" && typeof window !== "undefined"
  ? window.location.pathname
  : null;

export default function RootLayout() {
  const segments = useSegments();
  const rotaEstrutural = segments.join("/");
  useEffect(() => {
    restaurarTema().catch(() => mostrarToast("Não foi possível restaurar o tema salvo", { severidade: "erro" }));
    registrarServiceWorker();
    corrigirAlturaViewportMobile();
  }, []);

  useEffect(() => {
    const estaNaRaiz = Platform.OS === "web"
      ? CAMINHO_INICIAL_WEB === "/"
      : rotaEstrutural === "(tabs)";
    if (!estaNaRaiz) return;
    onboardingConcluido()
      .then((concluido) => { if (!concluido) router.replace("/onboarding"); })
      .catch(() => mostrarToast("Não foi possível verificar a apresentação inicial", { severidade: "erro" }));
  }, [rotaEstrutural]);

  return (
    <SafeAreaProvider>
      <Head>
        <title>Bíblia Plataforma — leitura bíblica offline</title>
        <meta
          name="description"
          content="Leia a Bíblia Almeida ACF, acompanhe planos, faça anotações e organize seus estudos mesmo sem conexão."
        />
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </SafeAreaProvider>
  );
}
