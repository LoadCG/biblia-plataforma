import { buscarReferencia, ErroBusca } from "../BibliaAPI";

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

  it("classifica 429 como limite e NÃO tenta de novo (evita piorar o rate limit)", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) } as unknown as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let erroCapturado: unknown;
    try {
      await buscarReferencia("Êxodo 1");
    } catch (e) {
      erroCapturado = e;
    }

    expect(erroCapturado).toBeInstanceOf(ErroBusca);
    expect((erroCapturado as ErroBusca).tipo).toBe("limite");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  }, 10000);

  it("classifica referência inexistente (dados.error da API) como inválido, sem repetir", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ error: "not found" }) } as unknown as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let erroCapturado: unknown;
    try {
      await buscarReferencia("LivroFalso 1");
    } catch (e) {
      erroCapturado = e;
    }

    expect(erroCapturado).toBeInstanceOf(ErroBusca);
    expect((erroCapturado as ErroBusca).tipo).toBe("invalido");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  }, 10000);
});
