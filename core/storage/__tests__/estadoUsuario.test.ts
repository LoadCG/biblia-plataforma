import AsyncStorage from "@react-native-async-storage/async-storage";
import { aplicarPreferenciasRestauraveis } from "../estadoUsuario";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("preferências locais portáveis", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("restaura a velocidade, mas preserva a voz específica deste dispositivo", async () => {
    await AsyncStorage.setItem("voz-leitura-dispositivo", "voz-local");
    await AsyncStorage.setItem("velocidade-leitura-dispositivo", "0.9");

    await aplicarPreferenciasRestauraveis({ "velocidade-leitura-dispositivo": "1.1" });

    await expect(AsyncStorage.getItem("velocidade-leitura-dispositivo")).resolves.toBe("1.1");
    await expect(AsyncStorage.getItem("voz-leitura-dispositivo")).resolves.toBe("voz-local");
  });
});
