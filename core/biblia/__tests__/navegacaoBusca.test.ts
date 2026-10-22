import { filtrosBuscaDiferem, hrefResultadoBusca, hrefRetornoBusca } from "../navegacaoBusca";

describe("retorno da leitura para a busca", () => {
  it("não reinicia a busca quando os filtros restaurados são os padrões atuais", () => {
    expect(filtrosBuscaDiferem(
      { testamento: "todos", livroFiltro: undefined },
      { testamento: "todos", livroFiltro: undefined }
    )).toBe(false);
    expect(filtrosBuscaDiferem(
      { testamento: "todos", livroFiltro: undefined },
      { testamento: "Novo Testamento", livroFiltro: undefined }
    )).toBe(true);
  });

  it("preserva consulta, versículo e origem ao abrir um resultado", () => {
    expect(hrefResultadoBusca("43-joao", 3, 16, "João 3:16"))
      .toBe("/leitura/43-joao/3?versiculo=16&origem=pesquisa&consulta=Jo%C3%A3o%203%3A16");
  });

  it("restaura a consulta ao retornar à busca", () => {
    expect(hrefRetornoBusca("João 3:16")).toBe("/pesquisa?consulta=Jo%C3%A3o%203%3A16");
    expect(hrefRetornoBusca(["João 3:16", "ignorada"])).toBe("/pesquisa?consulta=Jo%C3%A3o%203%3A16");
  });

  it("retorna à busca sem consulta quando ela não foi informada", () => {
    expect(hrefRetornoBusca()).toBe("/pesquisa");
    expect(hrefRetornoBusca([""])).toBe("/pesquisa");
  });

  it("preserva testamento e livro ao abrir um resultado bíblico", () => {
    expect(hrefResultadoBusca("43-joao", 3, 16, "João 3:16", {
      testamento: "Novo Testamento",
      livroFiltro: "43-joao",
    })).toBe("/leitura/43-joao/3?versiculo=16&origem=pesquisa&consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=43-joao");
  });

  it("restaura filtros inclusive quando não há livro selecionado", () => {
    expect(hrefRetornoBusca("João 3:16", { testamento: "Novo Testamento" }))
      .toBe("/pesquisa?consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=");
    expect(hrefRetornoBusca("João 3:16", {
      testamento: ["Novo Testamento", "Antigo Testamento"],
      livroFiltro: ["43-joao", "01-genesis"],
    })).toContain("testamento=Novo%20Testamento&livroFiltro=43-joao");
  });
});
