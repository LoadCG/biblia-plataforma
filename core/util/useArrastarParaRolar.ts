import { useCallback, useRef } from "react";
import { Platform, ScrollView } from "react-native";

// Segura o mouse e arrasta = rola. Sem isso, uma ScrollView horizontal
// no navegador desktop só é utilizável via barra de rolagem (escondida
// de propósito, ver `showsHorizontalScrollIndicator={false}`) ou
// trackpad/scroll horizontal — um mouse comum não tem como interagir
// (reportado por usuário: "parece um carrossel mas não desliza no
// PC"). No toque (mobile/tablet) o navegador já trata isso nativamente,
// por isso o hook não faz nada fora do web.
//
// Usa callback ref (não `useRef` + `useEffect`) de propósito: várias
// telas (Início "Continue lendo", Você "Medalhas") só montam a
// ScrollView depois que os dados carregam de forma assíncrona — um
// `useEffect` de montagem única do componente rodaria antes do
// elemento existir e nunca prenderia o listener. Callback ref é
// chamado pelo React exatamente quando o nó real monta/desmonta,
// não importa quando isso aconteça.
export function useArrastarParaRolar<T extends ScrollView>() {
  const limpar = useRef<(() => void) | null>(null);

  return useCallback((instancia: T | null) => {
    limpar.current?.();
    limpar.current = null;

    if (Platform.OS !== "web" || !instancia) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node: HTMLElement | undefined = (instancia as any)?.getScrollableNode?.();
    if (!node) return;

    let arrastando = false;
    let moveu = false;
    let inicioX = 0;
    let scrollInicial = 0;

    function aoPressionar(e: MouseEvent) {
      arrastando = true;
      moveu = false;
      inicioX = e.pageX;
      scrollInicial = node!.scrollLeft;
      node!.style.cursor = "grabbing";
      node!.style.userSelect = "none";
    }
    function aoMover(e: MouseEvent) {
      if (!arrastando) return;
      const delta = e.pageX - inicioX;
      if (Math.abs(delta) > 3) moveu = true;
      node!.scrollLeft = scrollInicial - delta;
    }
    // Depois de um arraste de verdade, ignora o "click" seguinte —
    // senão soltar o mouse em cima de um card dispara a navegação dele
    // junto com o arraste, mesmo quando a intenção era só rolar.
    function aoClicarCapturando(e: MouseEvent) {
      if (moveu) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    function aoSoltar() {
      arrastando = false;
      node!.style.cursor = "grab";
      node!.style.removeProperty("user-select");
    }

    node.style.cursor = "grab";
    node.addEventListener("mousedown", aoPressionar);
    node.addEventListener("click", aoClicarCapturando, true);
    window.addEventListener("mousemove", aoMover);
    window.addEventListener("mouseup", aoSoltar);

    limpar.current = () => {
      node.removeEventListener("mousedown", aoPressionar);
      node.removeEventListener("click", aoClicarCapturando, true);
      window.removeEventListener("mousemove", aoMover);
      window.removeEventListener("mouseup", aoSoltar);
    };
  }, []);
}
