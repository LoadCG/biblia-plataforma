import { Platform } from "react-native";

// Registra o service worker (public/sw.js) só na versão web — dá
// offline de verdade pro app já visitado (ver 7.3 do
// FUNCIONALIDADES.md). Silenciosamente ignorado se o navegador não
// suportar ou se falhar (ex. HTTP sem TLS em dev local) — offline é
// um extra, nunca pode travar o carregamento do app.
export function registrarServiceWorker(): void {
  if (Platform.OS !== "web" || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
