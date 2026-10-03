import "../global.css";
import { useEffect, useRef } from "react";
import { router, Stack, usePathname, useSegments } from "expo-router";
import Head from "expo-router/head";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, View } from "react-native";
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
  const pathname = usePathname();
  const containerRef = useRef<View>(null);
  const caminhoAnterior = useRef(pathname);
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

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (caminhoAnterior.current === pathname) return;
    caminhoAnterior.current = pathname;

    const container = containerRef.current as unknown as HTMLElement | null;
    if (!container || typeof container.animate !== "function") return;

    const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefereMovimentoReduzido) return;

    container.animate(
      [
        { opacity: 0.72, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 190, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
  }, [pathname]);

  return (
    <SafeAreaProvider>
      <Head>
        <title>Bíblia Plataforma — leitura bíblica offline</title>
        <meta
          name="description"
          content="Leia a Bíblia Almeida ACF, acompanhe planos, faça anotações e organize seus estudos mesmo sem conexão."
        />
      </Head>
      <View ref={containerRef} style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            animationDuration: 190,
          }}
        />
        <Toast />
      </View>
    </SafeAreaProvider>
  );
}
