jest.mock("../bibliaLocalWeb", () => ({
  carregarBibliaJson: jest.fn(async () => [
    {
      abbrev: "gn",
      name: "Gênesis",
      chapters: [["amor e paz", "amor no começo"], ["paz e amor"]],
    },
    {
      abbrev: "mt",
      name: "Mateus",
      chapters: [["amor em outro testamento"]],
    },
  ]),
}));

import { buscarGlobalWeb } from "../buscaGlobalWeb";

describe("busca global web", () => {
  it("aplica limite e offset como páginas sem repetir resultados", async () => {
    const primeiraPagina = await buscarGlobalWeb("amor", { limite: 2 });
    const segundaPagina = await buscarGlobalWeb("amor", { limite: 2, offset: 2 });

    expect(primeiraPagina).toHaveLength(2);
    expect(segundaPagina).toHaveLength(2);
    expect(new Set([...primeiraPagina, ...segundaPagina].map((item) => `${item.livroSlug}-${item.capitulo}-${item.versiculo}`)).size).toBe(4);
    await expect(buscarGlobalWeb("amor", { limite: 2, offset: 4 })).resolves.toEqual([]);
  });

  it("filtra por testamento e livro antes de paginar", async () => {
    const resultados = await buscarGlobalWeb("amor", {
      testamento: "Novo Testamento",
      livroSlug: "40-mateus",
      limite: 1,
    });

    expect(resultados).toHaveLength(1);
    expect(resultados[0].livroSlug).toBe("mt");
  });

  it("retorna vazio para consultas compostas só de espaços", async () => {
    await expect(buscarGlobalWeb("   ", { limite: 10 })).resolves.toEqual([]);
  });

  it("ignora pontuação sem termos pesquisáveis", async () => {
    await expect(buscarGlobalWeb(" !!! ")).resolves.toEqual([]);
  });

  it("aplica AND por prefixo e mantém frases citadas contíguas", async () => {
    const todosOsTermos = await buscarGlobalWeb("amo paz");
    const frase = await buscarGlobalWeb('"paz e amor"');

    expect(todosOsTermos.map(({ livroSlug, versiculo }) => `${livroSlug}-${versiculo}`)).toContain("gn-1");
    expect(frase).toHaveLength(1);
    expect(frase[0]).toMatchObject({ livroSlug: "gn", capitulo: 2, versiculo: 1 });
  });

  it("trata aspas sem fechamento como consulta lexical comum", async () => {
    const resultados = await buscarGlobalWeb('"amor paz');
    expect(resultados.some(({ livroSlug, capitulo, versiculo }) => livroSlug === "gn" && capitulo === 1 && versiculo === 1)).toBe(true);
  });

  it("normaliza limites e offsets negativos", async () => {
    const resultados = await buscarGlobalWeb("amor", { limite: -2, offset: -1 });
    expect(resultados).toEqual([]);
  });
});
