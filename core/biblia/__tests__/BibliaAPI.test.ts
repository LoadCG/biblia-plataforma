import { buscarReferencia, apenasCapitulo } from "../BibliaAPI";
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
