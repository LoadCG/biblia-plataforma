import { correspondeConsultaBiblica, encontrarIntervalosCorrespondenciaBiblica, normalizarBusca, pontuarResultado, tokenizarBusca } from "../relevanciaBusca";

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

  it("destaca termos no início de uma palavra, sem correspondências por substring", () => {
    const texto = "O amor vence o clamor.";
    const intervalos = encontrarIntervalosCorrespondenciaBiblica(texto, "amor");
    expect(intervalos.map(({ inicio, fim }) => texto.slice(inicio, fim))).toEqual(["amor"]);
  });

  it("destaca somente palavras da frase exata e preserva acentos do texto", () => {
    const texto = "Paz, paz e oração.";
    const intervalos = encontrarIntervalosCorrespondenciaBiblica(texto, '"paz e oração"');
    expect(intervalos.map(({ inicio, fim }) => texto.slice(inicio, fim))).toEqual(["paz", "e", "oração"]);
  });

  it("mantém os offsets originais com espaços repetidos no texto", () => {
    const texto = "  A   oração  ";
    const intervalos = encontrarIntervalosCorrespondenciaBiblica(texto, "orac");
    expect(intervalos.map(({ inicio, fim }) => texto.slice(inicio, fim))).toEqual(["oração"]);
  });

  it("inclui marcas diacríticas combinantes no intervalo destacado", () => {
    const texto = "orac\u0327a\u0303o";
    const intervalos = encontrarIntervalosCorrespondenciaBiblica(texto, "oracao");
    expect(intervalos.map(({ inicio, fim }) => texto.slice(inicio, fim))).toEqual([texto]);
  });

  it("aceita consulta longa sem quebrar normalização nem pontuação", () => {
    const termoLongo = Array.from({ length: 120 }, (_, indice) => `palavra${indice}`).join(" ");
    expect(tokenizarBusca(termoLongo)).toHaveLength(120);
    expect(pontuarResultado(termoLongo, termoLongo)).toBeGreaterThan(0);
  });
});
