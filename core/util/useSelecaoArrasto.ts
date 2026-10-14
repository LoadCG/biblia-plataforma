import { useCallback, useRef } from "react";
import { Platform } from "react-native";

type Opcoes = {
  ativo: boolean;
  selecionados: Set<number>;
  onMudarSelecao: (novo: Set<number>) => void;
};

const DISTANCIA_MINIMA_ARRASTO = 5;

// Seleção por arraste em desktop/web. O intervalo é sempre calculado entre
// a âncora e a célula sob o ponteiro; isso permite voltar sobre o gesto e
// encolher/expandir sem deixar capítulos residuais selecionados.
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
    let moveu = false;
    let adicionando = true;
    let ancora: number | null = null;
    let ultimoCapitulo: number | null = null;
    let ponteiroId: number | null = null;
    let removerClickCapturando = false;
    let inicioX = 0;
    let inicioY = 0;
    let base = new Set<number>();
    const estiloOriginal = {
      touchAction: node.style.touchAction,
      userSelect: node.style.userSelect,
      webkitUserSelect: node.style.webkitUserSelect,
    };

    function capituloNoPonto(x: number, y: number): number | null {
      const elemento = document.elementFromPoint(x, y) as HTMLElement | null;
      const alvo = elemento?.closest("[data-capitulo]") as HTMLElement | null;
      const valor = alvo?.dataset.capitulo;
      const capitulo = valor ? Number(valor) : NaN;
      return Number.isInteger(capitulo) && capitulo > 0 ? capitulo : null;
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
      if (!estadoRef.current.ativo || e.button !== 0 || e.isPrimary === false) return;
      const capitulo = capituloNoPonto(e.clientX, e.clientY);
      if (capitulo === null) return;

      e.preventDefault();
      arrastando = true;
      moveu = false;
      ancora = capitulo;
      ultimoCapitulo = capitulo;
      ponteiroId = e.pointerId;
      inicioX = e.clientX;
      inicioY = e.clientY;
      base = new Set(estadoRef.current.selecionados);
      adicionando = !base.has(capitulo);

      node.style.touchAction = "none";
      node.style.userSelect = "none";
      node.style.webkitUserSelect = "none";
      try {
        node.setPointerCapture(e.pointerId);
      } catch {
        // Os listeners globais continuam cobrindo WebViews sem pointer capture.
      }
    }

    function aoMover(e: PointerEvent) {
      if (!arrastando || ancora === null || (ponteiroId !== null && e.pointerId !== ponteiroId)) return;
      if (!moveu && Math.hypot(e.clientX - inicioX, e.clientY - inicioY) < DISTANCIA_MINIMA_ARRASTO) return;
      moveu = true;
      const capitulo = capituloNoPonto(e.clientX, e.clientY);
      if (capitulo === null || capitulo === ultimoCapitulo) return;
      ultimoCapitulo = capitulo;
      aplicarIntervalo(ancora, capitulo);
    }

    function aoClicarCapturando(e: MouseEvent) {
      if (removerClickCapturando) {
        removerClickCapturando = false;
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function restaurarEstilos() {
      node.style.touchAction = estiloOriginal.touchAction;
      node.style.userSelect = estiloOriginal.userSelect;
      node.style.webkitUserSelect = estiloOriginal.webkitUserSelect;
    }

    function aoSoltar(e?: PointerEvent) {
      if (!arrastando || (e && ponteiroId !== null && e.pointerId !== ponteiroId)) return;
      const capturado = ponteiroId;
      if (!moveu && ancora !== null) aplicarIntervalo(ancora, ancora);
      arrastando = false;
      removerClickCapturando = moveu;
      moveu = false;
      ancora = null;
      ultimoCapitulo = null;
      ponteiroId = null;
      restaurarEstilos();
      if (capturado !== null) {
        try {
          if (node.hasPointerCapture(capturado)) node.releasePointerCapture(capturado);
        } catch {
          // Compatibilidade com WebViews sem a API de pointer capture.
        }
      }
    }

    function aoPerderFoco() {
      moveu = true;
      aoSoltar();
    }

    function aoCancelar(e: PointerEvent) {
      if (ponteiroId !== null && e.pointerId !== ponteiroId) return;
      moveu = true;
      aoSoltar(e);
    }

    node.addEventListener("pointerdown", aoPressionar);
    node.addEventListener("click", aoClicarCapturando, true);
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoCancelar);
    window.addEventListener("blur", aoPerderFoco);

    limpar.current = () => {
      // Desmontagem/cancelamento nunca deve transformar um gesto incompleto
      // em seleção simples.
      moveu = true;
      aoSoltar();
      node.removeEventListener("pointerdown", aoPressionar);
      node.removeEventListener("click", aoClicarCapturando, true);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoCancelar);
      window.removeEventListener("blur", aoPerderFoco);
    };
  }, []);
}
