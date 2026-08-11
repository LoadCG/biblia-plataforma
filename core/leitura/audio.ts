import { Platform } from "react-native";
import * as Speech from "expo-speech";

export type VersiculoParaFala = { numero: number; texto: string };

// Síntese de voz do próprio navegador/SO (Web Speech API no web,
// expo-speech — que embrulha AVSpeechSynthesizer/TextToSpeech nativos —
// no app), sem custo de servidor nem áudio gravado (ver 2.10 do
// FUNCIONALIDADES.md). Fala um versículo por vez (não o capítulo
// inteiro de uma vez) pra poder destacar o versículo atual na tela
// enquanto lê, sincronizado de verdade (não por estimativa de tempo).
let cancelado = false;

export function suportaAudio(): boolean {
  if (Platform.OS === "web") return typeof window !== "undefined" && !!window.speechSynthesis;
  return true;
}

export function falarCapitulo(
  versiculos: VersiculoParaFala[],
  aoIniciarVersiculo: (numero: number) => void,
  aoTerminar: () => void
): void {
  if (!suportaAudio() || versiculos.length === 0) {
    aoTerminar();
    return;
  }
  cancelado = false;

  let indice = 0;
  function falarProximo() {
    if (cancelado || indice >= versiculos.length) {
      aoTerminar();
      return;
    }
    const versiculo = versiculos[indice];
    aoIniciarVersiculo(versiculo.numero);
    indice++;

    if (Platform.OS === "web") {
      const utterance = new SpeechSynthesisUtterance(versiculo.texto);
      utterance.lang = "pt-BR";
      utterance.onend = falarProximo;
      utterance.onerror = falarProximo;
      window.speechSynthesis.speak(utterance);
    } else {
      Speech.speak(versiculo.texto, {
        language: "pt-BR",
        onDone: falarProximo,
        onStopped: () => {},
        onError: falarProximo,
      });
    }
  }
  falarProximo();
}

export function pararAudio(): void {
  cancelado = true;
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  } else {
    Speech.stop();
  }
}
