import { correspondeConsultaBiblica, normalizarBusca, pontuarResultado, tokenizarBusca } from "../relevanciaBusca";

describe("contrato de correspondência da busca bíblica", () => {
  it("normaliza acentos, caixa e espaços repetidos", () => {
    expect(normalizarBusca("  ESPÍRITO   Santo ")).toBe("espirito santo");
    expect(tokenizarBusca("  ESPÍRITO, Santo! ")).toEqual(["espirito", "santo"]);
  });

  it("exige que cada termo corresponda ao prefixo de alguma palavra", () => {
    expect(correspondeConsultaBiblica("A esperança renasce", "esper renas", false)).toBe(true);
    expect(correspondeConsultaBiblica("A esperança renasce", "esper ausente", false)).toBe(false);
    expect(correspondeConsultaBiblica("A esperança", "peran", false)).toBe(false);
  });

  it("exige sequência contígua para consultas entre aspas", () => {
    expect(correspondeConsultaBiblica("Ouve, Pastor de Israel", "pastor de israel", true)).toBe(true);
    expect(correspondeConsultaBiblica("Ouve, ó Israel, Pastor", "pastor de israel", true)).toBe(false);
  });

  it("trata aspas incompletas como consulta lexical comum", () => {
    const termo = '"esperança viva'.replace(/^"|"$/g, "");
    expect(correspondeConsultaBiblica("Esperança viva em Deus", termo, false)).toBe(true);
  });

  it("aceita consulta longa sem quebrar normalização nem pontuação", () => {
    const termoLongo = Array.from({ length: 120 }, (_, indice) => `palavra${indice}`).join(" ");
    expect(tokenizarBusca(termoLongo)).toHaveLength(120);
    expect(pontuarResultado(termoLongo, termoLongo)).toBeGreaterThan(0);
  });
});
