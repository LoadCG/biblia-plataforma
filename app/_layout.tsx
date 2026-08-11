import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toast } from "../components/Toast";
import { registrarServiceWorker } from "../core/registrarServiceWorker";
import { restaurarTema } from "../core/theme";

export default function RootLayout() {
  useEffect(() => {
    restaurarTema();
    registrarServiceWorker();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </SafeAreaProvider>
  );
}
