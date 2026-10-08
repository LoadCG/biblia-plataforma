import { buscarReferencia, apenasCapitulo, buscarGlobal } from "../BibliaAPI";
import { db } from "../../db/database";

// Mock do Platform para garantir que não caia no fallback de Web e tente rodar o SQLite real (que será mockado)
jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

// Mock do AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock do SQLite
jest.mock("../../db/database", () => ({
  db: {
    getAllAsync: jest.fn(),
  },
  garantirBaseBiblia: jest.fn().mockResolvedValue(undefined),
}));

describe("BibliaAPI - buscarReferencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar um livro inteiro quando apenas o capítulo é fornecido", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "Mateus", versiculo: 1, texto: "Livro da geração de Jesus Cristo" },
      { nomeLivro: "Mateus", versiculo: 2, texto: "Abraão gerou a Isaque" },
    ]);

    const resultado = await buscarReferencia("Mateus 1");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND capitulo = ? ORDER BY versiculo ASC"),
      ["mt", 1]
    );

    expect(resultado.referencia).toBe("Mateus 1");
    expect(resultado.texto).toContain("Livro da geração");
    expect(resultado.texto).toContain("Abraão gerou a Isaque");
    expect(resultado.versiculos).toHaveLength(2);
  });

  it("deve buscar um versículo específico", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "João", versiculo: 16, texto: "Porque Deus amou o mundo de tal maneira..." },
    ]);

    const resultado = await buscarReferencia("João 3:16");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND versiculo >= ? AND versiculo <= ?"),
      ["jo", 3, 16, 16] // versiculoInicial e versiculoFinal são 16
    );

    expect(resultado.referencia).toBe("João 3:16");
    expect(resultado.texto).toBe("Porque Deus amou o mundo de tal maneira...");
    expect(resultado.versiculos).toHaveLength(1);
    expect(resultado.versiculos?.[0].numero).toBe(16);
  });

  it("deve buscar um intervalo de versículos (range)", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "1 Coríntios", versiculo: 4, texto: "O amor é sofredor, é benigno;" },
      { nomeLivro: "1 Coríntios", versiculo: 5, texto: "Não se porta com indecência," },
    ]);

    const resultado = await buscarReferencia("1 Coríntios 13:4-5");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND versiculo >= ? AND versiculo <= ?"),
      ["1co", 13, 4, 5] // Regex deve ter capturado 4 e 5!
    );

    expect(resultado.referencia).toBe("1 Coríntios 13:4-5");
    expect(resultado.versiculos).toHaveLength(2);
    expect(resultado.texto).toContain("sofredor");
  });

  it("deve resolver nomes de livros com abreviações oficiais", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "Gênesis", versiculo: 1, texto: "No princípio..." },
    ]);

    // Usando uma abreviação que está cadastrada no livros.json
    const resultado = await buscarReferencia("gn 1:1");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.anything(),
      ["gn", 1, 1, 1]
    );
    expect(resultado.referencia).toBe("Gênesis 1:1");
  });

  it("deve falhar com uma referência totalmente inválida", async () => {
    await expect(buscarReferencia("LivroInexistente 1:1")).rejects.toThrow("Livro não encontrado para a referência: LivroInexistente 1:1");
  });
});

describe("BibliaAPI - Utils", () => {
  it("apenasCapitulo deve limpar a string após os dois pontos", () => {
    expect(apenasCapitulo("Gênesis 1:5-10")).toBe("Gênesis 1");
    expect(apenasCapitulo("Salmos 119")).toBe("Salmos 119");
  });
});

describe("busca global nativa", () => {
  beforeEach(() => jest.clearAllMocks());

  it("normaliza tokens para FTS e aplica filtro e página após ordenação", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { livroSlug: "jo", nomeLivro: "João", capitulo: 3, versiculo: 16, texto: "amor" },
      { livroSlug: "gn", nomeLivro: "Gênesis", capitulo: 1, versiculo: 2, texto: "amor" },
      { livroSlug: "gn", nomeLivro: "Gênesis", capitulo: 1, versiculo: 1, texto: "amor" },
    ]);

    const resultado = await buscarGlobal("  AMÓR, luz! ", {
      livroSlug: "01-genesis",
      testamento: "Antigo Testamento",
      limite: 1,
      offset: 1,
    });

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("FROM biblia_fts WHERE texto MATCH ?"),
      ['"amor"* AND "luz"*']
    );
    expect(resultado.map(({ livroSlug, versiculo }) => [livroSlug, versiculo])).toEqual([["gn", 2]]);
  });

  it("preserva a semântica de frase para tokens entre aspas", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([]);

    await buscarGlobal('"amor   luz"');

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.any(String),
      ['"amor luz"']
    );
  });

  it("não consulta o banco quando a busca não contém tokens pesquisáveis", async () => {
    await expect(buscarGlobal(" !!! ")).resolves.toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });

  it("trata aspas sem fechamento como consulta lexical comum", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([]);

    await buscarGlobal('"amor paz');

    expect(db.getAllAsync).toHaveBeenCalledWith(expect.any(String), ['"amor"* AND "paz"*']);
  });

  it("resolve referência exata diretamente para os versículos correspondentes", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "João", versiculo: 16, texto: "Porque Deus amou o mundo." },
    ]);

    const resultados = await buscarGlobal("João 3:16");

    expect(resultados).toEqual([expect.objectContaining({
      livroSlug: "jo",
      nomeLivro: "João",
      capitulo: 3,
      versiculo: 16,
      relevancia: 1000,
    })]);
    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND versiculo >= ? AND versiculo <= ?"),
      ["jo", 3, 16, 16]
    );
  });

  it("aceita a abreviação do livro no filtro da referência direta", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "João", versiculo: 16, texto: "Porque Deus amou o mundo." },
    ]);

    await expect(buscarGlobal("João 3:16", { livroSlug: "jo" })).resolves.toHaveLength(1);
  });

  it("resolve referência digitada sem acento pelo nome canônico do catálogo", async () => {
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      { nomeLivro: "João", versiculo: 16, texto: "Porque Deus amou o mundo." },
    ]);

    const resultados = await buscarGlobal("Joao 3:16");

    expect(resultados).toHaveLength(1);
    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.any(String),
      ["jo", 3, 16, 16]
    );
  });

  it("não busca referência direta que conflita com os filtros ativos", async () => {
    await expect(buscarGlobal("João 3:16", { testamento: "Antigo Testamento" })).resolves.toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });

  it("mantém acentos, prefixos de palavra e AND no fallback quando FTS falha", async () => {
    (db.getAllAsync as jest.Mock)
      .mockRejectedValueOnce(new Error("FTS indisponível para esta consulta"))
      .mockResolvedValueOnce([
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 3, texto: "Faze com que prosperemos de novo, ó Deus." },
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 4, texto: "Deus nos concede amor." },
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 5, texto: "Faze com que prosperemos." },
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 6, texto: "Profissão e prosperidade." },
      ]);

    const resultados = await buscarGlobal("PROSPER, DEUS");

    expect(db.getAllAsync).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("FROM biblia_text")
    );
    expect(resultados.map(({ versiculo }) => versiculo)).toEqual([3]);
  });

  it("preserva frase citada contígua no fallback", async () => {
    (db.getAllAsync as jest.Mock)
      .mockRejectedValueOnce(new Error("FTS indisponível para esta consulta"))
      .mockResolvedValueOnce([
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 1, texto: "Ouve-nos, ó Pastor de Israel!" },
        { livroSlug: "sl", nomeLivro: "Salmos", capitulo: 80, versiculo: 2, texto: "Ó Israel, ouve o Pastor." },
      ]);

    const resultados = await buscarGlobal('"pastor de israel"');

    expect(resultados.map(({ versiculo }) => versiculo)).toEqual([1]);
  });
});
