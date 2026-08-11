// Ação de "compartilhar" de verdade (link/versículo/texto) ainda não
// existe como funcionalidade própria (seção 5 do FUNCIONALIDADES.md).
// Esta é a versão mínima que dá função real ao botão "Compartilhar"/
// "Copiar" dos cards de Atividade/Salvo sem depender de uma dependência
// nova: no web usa a Clipboard API do navegador; no nativo usa o Share
// do próprio React Native (sempre disponível, sem instalar nada).
import { Platform, Share } from "react-native";
import { mostrarToast } from "../util/toast";
import { registrarCompartilhamento } from "./compartilhamentos";

export async function compartilhar(texto: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      await navigator.clipboard.writeText(texto);
      mostrarToast("Copiado!");
    } catch {
      // Permissão de clipboard pode falhar (ex. contexto não seguro) —
      // não é crítico o suficiente pra travar a ação com um alerta.
    }
  } else {
    // No nativo o próprio sheet de compartilhamento do sistema (Share.share)
    // já serve de confirmação visual — não precisa de toast extra.
    await Share.share({ message: texto }).catch(() => {});
  }
  await registrarCompartilhamento();
}
