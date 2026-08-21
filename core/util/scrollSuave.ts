import { Platform } from "react-native";
import type { RefObject } from "react";
import type { ScrollView } from "react-native";

// `ScrollView.scrollTo({ animated: true })` já pede rolagem suave no
// nativo (Animated interno do RN, funciona bem) e no web (react-native-web
// delega pra `element.scroll({ behavior: 'smooth' })`, ver
// node_modules/react-native-web/dist/exports/ScrollView/index.js) — mas o
// `behavior: 'smooth'` do navegador não deixa controlar duração/curva, e
// pra distâncias grandes (ex.: pular pro versículo 40 vindo do topo) o
// resultado visual é rápido demais, parecendo um "teleporte" em vez de uma
// rolagem (reportado pelo usuário, 2026-08-20). Esta função reimplementa a
// rolagem no web com `requestAnimationFrame` e uma curva ease-in-out com
// duração fixa, e cai pro comportamento nativo do RN nas outras plataformas.
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function scrollSuave(ref: RefObject<ScrollView | null>, y: number, duracaoMs = 500) {
  if (Platform.OS !== "web") {
    ref.current?.scrollTo({ y, animated: true });
    return;
  }

  // `getScrollableNode` é uma extensão do react-native-web (não existe nos
  // tipos do RN "de verdade") que devolve o elemento DOM real por trás do
  // ScrollView — precisamos dele pra animar `scrollTop` manualmente.
  const nodeOuNulo = (ref.current as unknown as { getScrollableNode?: () => HTMLElement })?.getScrollableNode?.();
  if (!nodeOuNulo) {
    ref.current?.scrollTo({ y, animated: true });
    return;
  }
  const node: HTMLElement = nodeOuNulo;

  const inicio = node.scrollTop;
  const distancia = y - inicio;
  if (Math.abs(distancia) < 1) return;

  const tempoInicio = performance.now();
  function passo(agora: number) {
    const progresso = Math.min(1, (agora - tempoInicio) / duracaoMs);
    node.scrollTop = inicio + distancia * easeInOutQuad(progresso);
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}
