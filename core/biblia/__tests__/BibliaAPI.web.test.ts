import { buscarReferencia } from "../BibliaAPI";

jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("../../db/database", () => ({
  db: { getAllAsync: jest.fn() },
  garantirBaseBiblia: jest.fn().mockResolvedValue(undefined),
}));

const RESPOSTA_OK = {
  ok: true,
  json: async () => ({
    reference: "Gênesis 1",
    text: "No princípio criou Deus os céus e a terra.",
    verses: [{ verse: 1, text: "No princípio criou Deus os céus e a terra." }],
  }),
};

describe("BibliaAPI (web) - retry em falha transitória", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("tenta de novo após uma falha de rede e retorna com sucesso na segunda tentativa", async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(RESPOSTA_OK as unknown as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const resultado = await buscarReferencia("Gênesis 1");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(resultado.referencia).toBe("Gênesis 1");
  }, 10000);

  it("desiste após esgotar as tentativas e propaga o erro", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("network error"));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(buscarReferencia("Gênesis 99")).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 10000);
});
