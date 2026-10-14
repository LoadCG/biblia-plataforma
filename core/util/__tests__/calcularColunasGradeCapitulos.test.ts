import { calcularColunasGradeCapitulos } from "../calcularColunasGradeCapitulos";

describe("calcularColunasGradeCapitulos", () => {
  it.each([
    [320, 5],
    [360, 6],
    [390, 6],
    [479, 6],
    [480, 8],
    [720, 10],
    [1024, 12],
  ])("usa %i px para exibir %i colunas", (largura, esperado) => {
    expect(calcularColunasGradeCapitulos(largura, 150)).toBe(esperado);
  });

  it("nunca exibe mais colunas que capítulos disponíveis", () => {
    expect(calcularColunasGradeCapitulos(1280, 1)).toBe(1);
  });
});
