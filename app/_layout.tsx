import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toast } from "../components/Toast";
import { restaurarTema } from "../core/theme";

export default function RootLayout() {
  useEffect(() => {
    restaurarTema();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </SafeAreaProvider>
  );
}
