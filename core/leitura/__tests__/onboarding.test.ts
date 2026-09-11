import AsyncStorage from "@react-native-async-storage/async-storage";
import { concluirOnboarding, dicaJaVista, marcarDicaVista, onboardingConcluido, reiniciarOnboarding } from "../onboarding";

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

describe("estado de onboarding", () => {
  beforeEach(() => AsyncStorage.clear());
  it("é versionado e pode ser reaberto", async () => {
    expect(await onboardingConcluido()).toBe(false);
    await concluirOnboarding();
    expect(await onboardingConcluido()).toBe(true);
    await reiniciarOnboarding();
    expect(await onboardingConcluido()).toBe(false);
  });
  it("persiste dicas contextuais individualmente", async () => {
    await marcarDicaVista("leitor");
    expect(await dicaJaVista("leitor")).toBe(true);
    expect(await dicaJaVista("planos")).toBe(false);
  });
});
