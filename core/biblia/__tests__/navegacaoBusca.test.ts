import { filtrosBuscaDiferem, hrefCapituloLeitura, hrefResultadoBusca, hrefRetornoBusca, hrefRetornoLeitura } from "../navegacaoBusca";

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

  it("retorna explicitamente à busca com consulta e filtros da origem", () => {
    expect(hrefRetornoLeitura("pesquisa", "João 3:16", {
      testamento: "Novo Testamento",
      livroFiltro: "43-joao",
    })).toBe("/pesquisa?consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=43-joao");
    expect(hrefRetornoLeitura(["pesquisa", "outra-origem"], ["João 3:16", "ignorada"], {
      testamento: ["Novo Testamento", "Antigo Testamento"],
      livroFiltro: ["43-joao", "01-genesis"],
    })).toBe("/pesquisa?consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=43-joao");
  });

  it("não força o retorno à busca para outras origens", () => {
    expect(hrefRetornoLeitura(undefined, "João 3:16")).toBeNull();
    expect(hrefRetornoLeitura("aba-biblia", "João 3:16")).toBeNull();
  });

  it("preserva consulta e filtros ao navegar entre capítulos a partir da busca", () => {
    const contextoBusca = {
      origem: "pesquisa",
      consulta: "João 3:16",
      testamento: "Novo Testamento",
      livroFiltro: "43-joao",
    };
    expect(hrefCapituloLeitura("43-joao", 4, contextoBusca)).toBe(
      "/leitura/43-joao/4?origem=pesquisa&consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=43-joao"
    );
    expect(hrefCapituloLeitura("43-joao", 2, contextoBusca)).toBe(
      "/leitura/43-joao/2?origem=pesquisa&consulta=Jo%C3%A3o%203%3A16&testamento=Novo%20Testamento&livroFiltro=43-joao"
    );
  });

  it("mantém o comportamento de capítulo para origens e links diretos", () => {
    expect(hrefCapituloLeitura("43-joao", 4, { origem: "aba-biblia" }))
      .toBe("/leitura/43-joao/4?origem=aba-biblia");
    expect(hrefCapituloLeitura("43-joao", 4)).toBe("/leitura/43-joao/4");
    expect(hrefCapituloLeitura(undefined, 4, { origem: "pesquisa", consulta: "João 3:16" }))
      .toBe("/leitura/escolher");
  });
});
