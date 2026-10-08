import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  carregarIndiceFonte,
  INDICE_PADRAO,
  carregarPreferenciasLeitura,
  salvarIndiceFonte,
  TAMANHOS_FONTE,
} from "../preferenciaFonte";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const storage = AsyncStorage as typeof AsyncStorage & { __INTERNAL_MOCK_STORAGE__: Record<string, string> };

describe("preferência de tamanho da fonte", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("usa o padrão quando não há valor salvo ou o valor está fora do intervalo", async () => {
    expect(await carregarIndiceFonte()).toBe(INDICE_PADRAO);
    await AsyncStorage.setItem("tamanho-fonte-leitura", String(TAMANHOS_FONTE.length));
    expect(await carregarIndiceFonte()).toBe(INDICE_PADRAO);
  });

  it.each(["1abc", "1.5", "", "-1", "NaN"])('ignora valor persistido malformado "%s"', async (valor) => {
    await AsyncStorage.setItem("tamanho-fonte-leitura", valor);
    expect(await carregarIndiceFonte()).toBe(INDICE_PADRAO);
  });

  it("carrega e persiste índices válidos", async () => {
    await salvarIndiceFonte(2);
    expect(await carregarIndiceFonte()).toBe(2);
    expect(storage.__INTERNAL_MOCK_STORAGE__["tamanho-fonte-leitura"]).toBe("2");
  });

  it.each([-1, 1.5, 3, Number.NaN])("rejeita índice inválido ao salvar (%s)", async (indice) => {
    await expect(salvarIndiceFonte(indice)).rejects.toThrow(RangeError);
  });

  it("mantém a falha de armazenamento visível para o chamador", async () => {
    const getItem = jest.spyOn(AsyncStorage, "getItem").mockRejectedValueOnce(new Error("storage indisponível"));
    await expect(carregarIndiceFonte()).rejects.toThrow("storage indisponível");
    getItem.mockRestore();
  });

  it("carrega a família mesmo quando a leitura do tamanho falha", async () => {
    const getItem = jest.spyOn(AsyncStorage, "getItem");
    getItem.mockImplementation(async (chave) => {
      if (chave === "tamanho-fonte-leitura") throw new Error("falha de leitura");
      return "1";
    });

    await expect(carregarPreferenciasLeitura()).resolves.toEqual({ fonteSerifada: true, falhas: 1 });
    getItem.mockRestore();
  });

  it("carrega o tamanho mesmo quando a leitura da família falha", async () => {
    await AsyncStorage.setItem("tamanho-fonte-leitura", "2");
    const getItem = jest.spyOn(AsyncStorage, "getItem").mockImplementation(async (chave) => {
      if (chave === "fonte-serifada-leitura") throw new Error("falha de leitura");
      return "2";
    });

    await expect(carregarPreferenciasLeitura()).resolves.toEqual({ indiceFonte: 2, falhas: 1 });
    getItem.mockRestore();
  });
});
