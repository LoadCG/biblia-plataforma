import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from "nativewind";
import { alternarTema, marcarTemaInicializado, restaurarTema } from "../theme";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("nativewind", () => ({
  colorScheme: { set: jest.fn(), get: jest.fn(() => "light") },
  useColorScheme: jest.fn(),
}));

describe("restauração do tema", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("preserva o tema inicial do sistema quando ainda não há escolha", async () => {
    await restaurarTema();
    expect(colorScheme.set).not.toHaveBeenCalled();
  });

  it.each(["light", "dark"] as const)("restaura o tema salvo %s", async (tema) => {
    await AsyncStorage.setItem("tema-preferido", tema);
    await restaurarTema();
    expect(colorScheme.set).toHaveBeenCalledWith(tema);
  });

  it("usa o tema claro quando o armazenamento contém um valor inválido", async () => {
    await AsyncStorage.setItem("tema-preferido", "sepia");
    await restaurarTema();
    expect(colorScheme.set).toHaveBeenCalledWith("light");
  });

  it("propaga falhas de leitura para que a inicialização possa liberar a interface e avisar", async () => {
    const getItem = jest.spyOn(AsyncStorage, "getItem").mockRejectedValueOnce(new Error("storage indisponível"));
    await expect(restaurarTema()).rejects.toThrow("storage indisponível");
    getItem.mockRestore();
  });

  it("não sobrescreve uma troca feita enquanto a leitura inicial ainda está pendente", async () => {
    marcarTemaInicializado();
    let concluirLeitura!: (valor: string | null) => void;
    jest.spyOn(AsyncStorage, "getItem").mockImplementationOnce(() => new Promise((resolve) => {
      concluirLeitura = resolve;
    }));
    jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined);

    const leitura = restaurarTema({ ignorarSeAlteradoDuranteLeitura: true });
    alternarTema();
    concluirLeitura("light");
    await leitura;

    expect(colorScheme.set).toHaveBeenCalledTimes(1);
    expect(colorScheme.set).toHaveBeenCalledWith("dark");
  });
});
