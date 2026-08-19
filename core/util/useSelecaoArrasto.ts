import { useCallback, useRef } from "react";
import { Platform } from "react-native";

type Opcoes = {
  ativo: boolean;
  selecionados: Set<number>;
  onMudarSelecao: (novo: Set<number>) => void;
};

// Seleção por arraste (estilo apps de fotos): pressionar um capítulo e
// arrastar sobre outros estende a seleção pra todo o intervalo entre o
// capítulo onde o arraste começou e o capítulo atual sob o ponteiro —
// sem precisar tocar um por um. Arrastar sobre um capítulo já
// selecionado desmarca o intervalo em vez de marcar (mesmo padrão do
// Fotos do iOS/Android: o primeiro toque decide se o gesto inteiro é
// "selecionar" ou "desmarcar").
//
// Só ativa no web (mouse/trackpad/touch do navegador) — é onde a
// grade de capítulos é usada com mais densidade de itens visíveis por
// vez (tela maior), e onde `elementFromPoint` + Pointer Events dão um
// jeito simples e testado de saber sobre qual célula o ponteiro está,
// sem depender de medir layout de cada célula manualmente. No app
// nativo (iOS/Android), o toque direto em cada capítulo (já suportado
// por fora deste hook) continua funcionando normalmente.
export function useSelecaoArrasto({ ativo, selecionados, onMudarSelecao }: Opcoes) {
  const estadoRef = useRef({ ativo, selecionados, onMudarSelecao });
  estadoRef.current = { ativo, selecionados, onMudarSelecao };

  const limpar = useRef<(() => void) | null>(null);

  return useCallback((instancia: HTMLElement | null) => {
    limpar.current?.();
    limpar.current = null;

    if (Platform.OS !== "web" || !instancia) return;
    const node = instancia;

    let arrastando = false;
    let adicionando = true;
    let ancora: number | null = null;
    let base = new Set<number>();

    function capituloNoPonto(x: number, y: number): number | null {
      const elemento = document.elementFromPoint(x, y) as HTMLElement | null;
      const alvo = elemento?.closest("[data-capitulo]") as HTMLElement | null;
      const valor = alvo?.dataset.capitulo;
      return valor ? Number(valor) : null;
    }

    function aplicarIntervalo(de: number, ate: number) {
      const lo = Math.min(de, ate);
      const hi = Math.max(de, ate);
      const novo = new Set(base);
      for (let n = lo; n <= hi; n++) {
        if (adicionando) novo.add(n);
        else novo.delete(n);
      }
      estadoRef.current.onMudarSelecao(novo);
    }

    function aoPressionar(e: PointerEvent) {
      if (!estadoRef.current.ativo) return;
      const capitulo = capituloNoPonto(e.clientX, e.clientY);
      if (capitulo === null) return;
      e.preventDefault();
      arrastando = true;
      ancora = capitulo;
      base = new Set(estadoRef.current.selecionados);
      adicionando = !base.has(capitulo);
      aplicarIntervalo(capitulo, capitulo);
    }

    function aoMover(e: PointerEvent) {
      if (!arrastando || ancora === null) return;
      const capitulo = capituloNoPonto(e.clientX, e.clientY);
      if (capitulo === null) return;
      aplicarIntervalo(ancora, capitulo);
    }

    function aoSoltar() {
      arrastando = false;
      ancora = null;
    }

    node.addEventListener("pointerdown", aoPressionar);
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);

    limpar.current = () => {
      node.removeEventListener("pointerdown", aoPressionar);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoSoltar);
    };
  }, []);
}
