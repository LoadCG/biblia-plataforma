import AsyncStorage from "@react-native-async-storage/async-storage";
import { localColecoesRepository } from "../LocalColecoesRepository";

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));
jest.mock("expo-crypto", () => ({ randomUUID: () => "colecao-1" }));

describe("LocalColecoesRepository", () => {
  beforeEach(() => AsyncStorage.clear());

  it("isola coleções e associações por owner", async () => {
    const colecao = await localColecoesRepository.criar("owner-a", "Estudo");
    await localColecoesRepository.associar("owner-a", colecao.id, ["nota-joao-3-16"]);
    expect(await localColecoesRepository.listar("owner-b")).toEqual([]);
    expect(await localColecoesRepository.listarAssociacoes("owner-b")).toEqual([]);
    expect(await localColecoesRepository.listarAssociacoes("owner-a")).toHaveLength(1);
  });

  it("remove a coleção sem remover os itens de domínio", async () => {
    const colecao = await localColecoesRepository.criar("owner-a", "Promessas");
    await localColecoesRepository.associar("owner-a", colecao.id, ["salvo-joao-3-16"]);
    await localColecoesRepository.remover("owner-a", colecao.id);
    expect(await localColecoesRepository.listar("owner-a")).toEqual([]);
    expect(await localColecoesRepository.listarAssociacoes("owner-a")).toEqual([]);
  });
});
