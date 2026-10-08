import { normalizarVelocidadeAudio } from "../constantesAudio";

describe("velocidade portátil da leitura em voz alta", () => {
  it.each([["0.9", "0.9"], ["1", "1"], ["1.1", "1.1"]])(
    "normaliza a velocidade suportada %s",
    (entrada, esperada) => expect(normalizarVelocidadeAudio(entrada)).toBe(esperada)
  );

  it.each(["0.5", "1.0", " 1 ", "2", "NaN", "rápida", null])("rejeita o valor inválido %s", (entrada) => {
    expect(normalizarVelocidadeAudio(entrada)).toBeNull();
  });
});
