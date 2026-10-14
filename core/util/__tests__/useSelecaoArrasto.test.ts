/** @jest-environment jsdom */

import { useSelecaoArrasto } from "../useSelecaoArrasto";

jest.mock("react-native", () => ({ Platform: { OS: "web" } }));

jest.mock("react", () => {
  const real = jest.requireActual("react");
  return {
    ...real,
    useCallback: (callback: (...args: any[]) => unknown) => callback,
    useRef: (current: unknown) => ({ current }),
  };
});

function criarCelula(capitulo: number) {
  const elemento = document.createElement("button");
  elemento.dataset.capitulo = String(capitulo);
  return elemento;
}

function emitirPonteiro(
  alvo: EventTarget,
  tipo: string,
  { x, y = 10, pointerId = 1, button = 0 }: { x: number; y?: number; pointerId?: number; button?: number },
) {
  const evento = new Event(tipo, { bubbles: true, cancelable: true }) as PointerEvent;
  Object.defineProperties(evento, {
    clientX: { value: x },
    clientY: { value: y },
    pointerId: { value: pointerId },
    button: { value: button },
    isPrimary: { value: true },
  });
  alvo.dispatchEvent(evento);
  return evento;
}

describe("useSelecaoArrasto", () => {
  let grade: HTMLDivElement;
  let celulas: HTMLButtonElement[];
  let elementoNoPonto: jest.SpyInstance;
  let capturas: Set<number>;
  let onMudarSelecao: jest.Mock;

  beforeEach(() => {
    grade = document.createElement("div");
    celulas = Array.from({ length: 12 }, (_, indice) => criarCelula(indice + 1));
    grade.append(...celulas);
    document.body.append(grade);
    elementoNoPonto = jest.fn((x: number) => celulas[Math.round(x / 10) - 1] ?? null);
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: elementoNoPonto });
    capturas = new Set();
    grade.setPointerCapture = jest.fn((id: number) => capturas.add(id));
    grade.hasPointerCapture = jest.fn((id: number) => capturas.has(id));
    grade.releasePointerCapture = jest.fn((id: number) => capturas.delete(id));
    onMudarSelecao = jest.fn();
  });

  afterEach(() => {
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: undefined });
    grade.remove();
  });

  function montar(selecionados = new Set<number>()) {
    const bind = useSelecaoArrasto({ ativo: true, selecionados, onMudarSelecao });
    bind(grade);
    return () => bind(null);
  }

  it("seleciona intervalo nos dois sentidos e encolhe sem deixar capítulos residuais", () => {
    montar();
    emitirPonteiro(celulas[2], "pointerdown", { x: 30 });
    emitirPonteiro(window, "pointermove", { x: 80 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([3, 4, 5, 6, 7, 8]);

    emitirPonteiro(window, "pointermove", { x: 50 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([3, 4, 5]);

    emitirPonteiro(window, "pointermove", { x: 10 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([1, 2, 3]);
    emitirPonteiro(window, "pointerup", { x: 10 });
  });

  it("mantém a seleção simples por clique sem arraste", () => {
    montar();
    emitirPonteiro(celulas[4], "pointerdown", { x: 50 });
    emitirPonteiro(window, "pointerup", { x: 50 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([5]);
  });

  it("desmarca o intervalo quando começa num capítulo selecionado", () => {
    montar(new Set([2, 3, 4, 5, 8]));
    emitirPonteiro(celulas[3], "pointerdown", { x: 40 });
    emitirPonteiro(window, "pointermove", { x: 60 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([2, 3, 8]);
    emitirPonteiro(window, "pointerup", { x: 60 });
  });

  it("ignora botão secundário e movimentos de outro ponteiro", () => {
    montar();
    emitirPonteiro(celulas[0], "pointerdown", { x: 10, button: 2 });
    emitirPonteiro(window, "pointermove", { x: 50 });
    expect(onMudarSelecao).not.toHaveBeenCalled();

    emitirPonteiro(celulas[0], "pointerdown", { x: 10, pointerId: 7 });
    emitirPonteiro(window, "pointermove", { x: 50, pointerId: 8 });
    expect(onMudarSelecao).not.toHaveBeenCalled();
    emitirPonteiro(window, "pointercancel", { x: 10, pointerId: 7 });
  });

  it("espera movimento intencional, captura o ponteiro e limpa no cancelamento", () => {
    montar();
    emitirPonteiro(celulas[0], "pointerdown", { x: 10 });
    expect(grade.setPointerCapture).toHaveBeenCalledWith(1);
    emitirPonteiro(window, "pointermove", { x: 12 });
    expect(onMudarSelecao).not.toHaveBeenCalled();
    emitirPonteiro(window, "pointermove", { x: 30 });
    expect(Array.from(onMudarSelecao.mock.lastCall![0])).toEqual([1, 2, 3]);

    (grade.hasPointerCapture as jest.Mock).mockReturnValue(true);
    emitirPonteiro(window, "pointercancel", { x: 30 });
    expect(grade.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(grade.style.userSelect).toBe("");
    expect(grade.style.touchAction || "").toBe("");
  });

  it("cancela um toque interrompido sem selecionar capítulo", () => {
    montar();
    emitirPonteiro(celulas[0], "pointerdown", { x: 10 });
    emitirPonteiro(window, "pointercancel", { x: 10 });
    expect(onMudarSelecao).not.toHaveBeenCalled();
  });

  it("remove os listeners e restaura estilo ao desmontar durante um gesto", () => {
    const unmount = montar();
    emitirPonteiro(celulas[0], "pointerdown", { x: 10 });
    unmount();
    emitirPonteiro(window, "pointermove", { x: 40 });
    expect(onMudarSelecao).not.toHaveBeenCalled();
    expect(grade.style.userSelect).toBe("");
  });
});
/** @jest-environment jsdom */

