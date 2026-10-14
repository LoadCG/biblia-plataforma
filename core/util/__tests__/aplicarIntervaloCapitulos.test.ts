import { aplicarIntervaloCapitulos } from "../aplicarIntervaloCapitulos";

describe("aplicarIntervaloCapitulos", () => {
  it("adiciona o trecho entre dois capítulos em qualquer direção", () => {
    expect(Array.from(aplicarIntervaloCapitulos(new Set([1, 8]), 3, 6))).toEqual([1, 8, 3, 4, 5, 6]);
    expect(Array.from(aplicarIntervaloCapitulos(new Set(), 6, 3))).toEqual([3, 4, 5, 6]);
  });

  it("remove o trecho quando o primeiro capítulo já está selecionado", () => {
    expect(Array.from(aplicarIntervaloCapitulos(new Set([2, 3, 4, 5, 8]), 4, 6))).toEqual([2, 3, 8]);
  });

  it("não altera a seleção original", () => {
    const original = new Set([2, 3]);
    aplicarIntervaloCapitulos(original, 5, 7);
    expect(Array.from(original)).toEqual([2, 3]);
  });
});
