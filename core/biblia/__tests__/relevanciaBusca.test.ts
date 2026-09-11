import { normalizarBusca, pontuarResultado } from "../relevanciaBusca";

describe("relevância da busca", () => {
  it("normaliza acentos, caixa e espaços", () => expect(normalizarBusca("  Coração   SÁBIO ")).toBe("coracao sabio"));
  it("prioriza frase exata", () => {
    expect(pontuarResultado("Bem-aventurados os pacificadores", "os pacificadores"))
      .toBeGreaterThan(pontuarResultado("Os homens justos e também pacificadores", "os pacificadores"));
  });
});
