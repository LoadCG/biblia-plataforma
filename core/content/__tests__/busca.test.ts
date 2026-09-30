import { buscarLivros } from "../busca";

describe("busca editorial", () => {
  it("mantém busca por nome e abreviação", () => {
    expect(buscarLivros("gn")[0].livro.slug).toBe("01-genesis");
    expect(buscarLivros("João")[0].livro.slug).toBe("43-joao");
  });

  it("expande temas por vocabulário controlado", () => {
    const resultados = buscarLivros("esperança");
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some(({ trecho }) => trecho !== null)).toBe(true);
  });
});
