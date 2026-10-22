import { obterSugestaoReferenciaBusca } from "../sugestaoReferenciaBusca";

describe("atalho de referência na busca bíblica", () => {
  it("sugere o destino quando a busca confirmou o versículo solicitado", () => {
    expect(obterSugestaoReferenciaBusca("João 3:16", [
      { livroSlug: "jo", capitulo: 3, versiculo: 16 },
    ])).toEqual({
      livroSlug: "43-joao",
      nomeLivro: "João",
      capitulo: 3,
      versiculo: 16,
    });
  });

  it("usa o primeiro versículo de uma passagem e aceita referência sem acento", () => {
    expect(obterSugestaoReferenciaBusca("Joao 3:16-18", [
      { livroSlug: "jo", capitulo: 3, versiculo: 16 },
      { livroSlug: "jo", capitulo: 3, versiculo: 17 },
    ])).toMatchObject({ livroSlug: "43-joao", versiculo: 16 });
  });

  it("não sugere se o versículo não apareceu nos resultados filtrados", () => {
    expect(obterSugestaoReferenciaBusca("João 3:16", [
      { livroSlug: "jo", capitulo: 3, versiculo: 17 },
    ])).toBeNull();
  });

  it("não sugere referências de capítulo sem versículo nem texto que não seja referência", () => {
    expect(obterSugestaoReferenciaBusca("João 3", [
      { livroSlug: "jo", capitulo: 3, versiculo: 1 },
    ])).toBeNull();
    expect(obterSugestaoReferenciaBusca("amor", [])).toBeNull();
  });
});
