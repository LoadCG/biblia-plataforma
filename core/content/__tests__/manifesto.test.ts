import { manifestoEditorial, validarManifestoEditorial } from "../manifesto";

describe("manifesto editorial", () => {
  it("cobre todos os resumos e planos publicados", () => {
    expect(manifestoEditorial.filter((item) => item.tipo === "resumo")).toHaveLength(66);
    expect(manifestoEditorial.filter((item) => item.tipo === "plano")).toHaveLength(2);
    expect(validarManifestoEditorial(manifestoEditorial)).toEqual([]);
  });

  it("não aceita IDs duplicados ou versões inválidas", () => {
    const erros = validarManifestoEditorial([
      manifestoEditorial[0],
      { ...manifestoEditorial[0], versao: 0 },
    ]);
    expect(erros).toEqual(expect.arrayContaining([
      `ID duplicado: ${manifestoEditorial[0].id}`,
      `versão inválida: ${manifestoEditorial[0].id}`,
    ]));
  });
});
