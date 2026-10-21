import { useCallback, useRef } from "react";
import { Platform } from "react-native";

type Opcoes = {
  ativo: boolean;
  selecionados: Set<number>;
  onMudarSelecao: (novo: Set<number>) => void;
};

const DISTANCIA_MINIMA_ARRASTO = 5;
const TEMPO_LONGO_TOQUE = 320;
const DISTANCIA_TOLERADA_ANTES_DO_TOQUE_LONGO = 9;

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
    let toqueId: number | null = null;
    let temporizadorToque: ReturnType<typeof setTimeout> | null = null;
    let toqueInicioX = 0;
    let toqueInicioY = 0;
    let toquePendente = false;
    let capituloToqueInicio: number | null = null;
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
      // Toque tem um ciclo próprio com breve espera: o navegador precisa
      // distinguir uma intenção de arrastar de uma rolagem iniciada na grade.
      if (e.pointerType === "touch") return;
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
      cancelarToquePendente();
    }

    function aoCancelar(e: PointerEvent) {
      if (ponteiroId !== null && e.pointerId !== ponteiroId) return;
      moveu = true;
      aoSoltar(e);
    }

    function cancelarToquePendente() {
      if (temporizadorToque !== null) clearTimeout(temporizadorToque);
      temporizadorToque = null;
      toqueId = null;
      toquePendente = false;
      capituloToqueInicio = null;
    }

    function buscarToque(toques: TouchList, id: number): Touch | null {
      for (let indice = 0; indice < toques.length; indice += 1) {
        const toque = toques.item(indice);
        if (toque?.identifier === id) return toque;
      }
      return null;
    }

    function aoIniciarToque(e: TouchEvent) {
      if (!estadoRef.current.ativo || arrastando || toquePendente || e.touches.length !== 1) return;
      const toque = e.changedTouches.item(0);
      if (!toque) return;
      const capitulo = capituloNoPonto(toque.clientX, toque.clientY);
      if (capitulo === null) return;

      toquePendente = true;
      toqueId = toque.identifier;
      capituloToqueInicio = capitulo;
      toqueInicioX = toque.clientX;
      toqueInicioY = toque.clientY;
      temporizadorToque = setTimeout(() => {
        if (!toquePendente || toqueId !== toque.identifier) return;
        toquePendente = false;
        temporizadorToque = null;
        arrastando = true;
        moveu = false;
        ancora = capitulo;
        ultimoCapitulo = capitulo;
        ponteiroId = null;
        inicioX = toqueInicioX;
        inicioY = toqueInicioY;
        base = new Set(estadoRef.current.selecionados);
        adicionando = !base.has(capitulo);
        node.style.userSelect = "none";
        node.style.webkitUserSelect = "none";
        aplicarIntervalo(capitulo, capitulo);
      }, TEMPO_LONGO_TOQUE);
    }

    function aoMoverToque(e: TouchEvent) {
      if (toqueId === null) return;
      const toque = buscarToque(e.touches, toqueId) ?? buscarToque(e.changedTouches, toqueId);
      if (!toque) return;

      if (toquePendente) {
        if (Math.hypot(toque.clientX - toqueInicioX, toque.clientY - toqueInicioY) > DISTANCIA_TOLERADA_ANTES_DO_TOQUE_LONGO) {
          cancelarToquePendente();
        }
        return;
      }
      if (!arrastando || ancora === null) return;

      // O listener é explicitamente não passivo para cancelar a rolagem só
      // depois do toque longo. Toques e rolagens normais seguem sem bloqueio.
      e.preventDefault();
      if (!moveu && Math.hypot(toque.clientX - inicioX, toque.clientY - inicioY) < DISTANCIA_MINIMA_ARRASTO) return;
      moveu = true;
      const capitulo = capituloNoPonto(toque.clientX, toque.clientY);
      if (capitulo === null || capitulo === ultimoCapitulo) return;
      ultimoCapitulo = capitulo;
      aplicarIntervalo(ancora, capitulo);
    }

    function aoFinalizarToque(e: TouchEvent) {
      if (toqueId === null) return;
      const toqueFinalizado = buscarToque(e.changedTouches, toqueId);
      if (!toqueFinalizado) return;
      if (toquePendente) {
        const capitulo = capituloToqueInicio;
        cancelarToquePendente();
        if (capitulo !== null) {
          base = new Set(estadoRef.current.selecionados);
          adicionando = !base.has(capitulo);
          aplicarIntervalo(capitulo, capitulo);
        }
        return;
      }
      if (arrastando) {
        // O toque longo já aplicou a célula inicial. Evita que o click
        // sintetizado pelo navegador alterne a seleção uma segunda vez.
        moveu = true;
        aoSoltar();
      }
      toqueId = null;
      capituloToqueInicio = null;
    }

    function aoCancelarToque() {
      if (toquePendente) {
        cancelarToquePendente();
        return;
      }
      if (!arrastando) return;
      moveu = true;
      aoSoltar();
      toqueId = null;
      capituloToqueInicio = null;
    }

    node.addEventListener("pointerdown", aoPressionar);
    node.addEventListener("click", aoClicarCapturando, true);
    node.addEventListener("touchstart", aoIniciarToque, { passive: true });
    node.addEventListener("touchmove", aoMoverToque, { passive: false });
    node.addEventListener("touchend", aoFinalizarToque);
    node.addEventListener("touchcancel", aoCancelarToque);
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoCancelar);
    window.addEventListener("blur", aoPerderFoco);

    limpar.current = () => {
      // Desmontagem/cancelamento nunca deve transformar um gesto incompleto
      // em seleção simples.
      moveu = true;
      aoSoltar();
      cancelarToquePendente();
      toqueId = null;
      node.removeEventListener("pointerdown", aoPressionar);
      node.removeEventListener("click", aoClicarCapturando, true);
      node.removeEventListener("touchstart", aoIniciarToque);
      node.removeEventListener("touchmove", aoMoverToque);
      node.removeEventListener("touchend", aoFinalizarToque);
      node.removeEventListener("touchcancel", aoCancelarToque);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoCancelar);
      window.removeEventListener("blur", aoPerderFoco);
    };
  }, []);
}
