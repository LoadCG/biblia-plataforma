import { hrefReferenciaBiblica, parseReferenciaBiblica, parseReferenciaVersiculo } from "../parseReferencia";

describe("parseReferenciaBiblica", () => {
  it("resolve capítulo completo", () => {
    expect(parseReferenciaBiblica("Mateus 5")).toMatchObject({ livroSlug: "40-mateus", capitulo: 5 });
  });

  it("resolve versículo e intervalo", () => {
    expect(parseReferenciaBiblica("Salmos 119:1-32")).toMatchObject({
      livroSlug: "19-salmos",
      capitulo: 119,
      versiculoInicial: 1,
      versiculoFinal: 32,
    });
    expect(hrefReferenciaBiblica("Salmos 119:1-32")).toBe("/biblia/19-salmos/119?versiculo=1");
  });

  it("aceita abreviações, acentos e livros numerados", () => {
    expect(parseReferenciaBiblica("1sm 3:10")).toMatchObject({ livroSlug: "09-1-samuel", capitulo: 3 });
    expect(parseReferenciaBiblica("Joao 3:16")).toMatchObject({ livroSlug: "43-joao", capitulo: 3 });
  });

  it("rejeita livro e capítulo inválidos", () => {
    expect(parseReferenciaBiblica("Livro inexistente 1")).toBeNull();
    expect(parseReferenciaBiblica("Judas 2")).toBeNull();
  });

  it("mantém o contrato de referência de versículo", () => {
    expect(parseReferenciaVersiculo("João 3:16-18")).toEqual({ livroSlug: "43-joao", capitulo: 3, versiculo: 16 });
  });
});
