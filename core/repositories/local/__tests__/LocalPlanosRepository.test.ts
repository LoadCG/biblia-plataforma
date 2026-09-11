import AsyncStorage from "@react-native-async-storage/async-storage";
import { localPlanosRepository } from "../LocalPlanosRepository";

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

describe("LocalPlanosRepository", () => {
  beforeEach(() => AsyncStorage.clear());
  it("isola progresso por owner", async () => {
    await localPlanosRepository.definirDiaConcluido("owner-a", "plano", 1, true);
    expect(await localPlanosRepository.listarDiasConcluidos("owner-a", "plano")).toEqual([1]);
    expect(await localPlanosRepository.listarDiasConcluidos("owner-b", "plano")).toEqual([]);
  });
  it("persiste e remove uma sessão", async () => {
    await localPlanosRepository.salvarSessao("owner-a", "plano", 2, 1, ["Mateus 1"]);
    expect(await localPlanosRepository.obterSessao("owner-a", "plano", 2)).toMatchObject({ indiceAtual: 1 });
    await localPlanosRepository.removerSessao("owner-a", "plano", 2);
    expect(await localPlanosRepository.obterSessao("owner-a", "plano", 2)).toBeNull();
  });
  it("migra progresso legado para o owner atual", async () => {
    await AsyncStorage.setItem("biblia_progresso_planos", JSON.stringify([{ planoId: "legado", diaConcluido: 1, concluidoEm: "2026-01-01T00:00:00.000Z" }]));
    expect(await localPlanosRepository.listarDiasConcluidos("owner-a", "legado")).toEqual([1]);
    expect(JSON.parse((await AsyncStorage.getItem("biblia_progresso_planos"))!)[0].ownerId).toBe("owner-a");
  });
});
