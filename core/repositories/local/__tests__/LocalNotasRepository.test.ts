import AsyncStorage from "@react-native-async-storage/async-storage";
import { ConflitoAnotacaoExistente } from "../../NotasRepository";
import { localNotasRepository } from "../LocalNotasRepository";
import type { ReferenciaVersiculo } from "../../../types/leitura";

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));
jest.mock("expo-crypto", () => ({ randomUUID: () => "grupo-teste" }));

const ref = (versiculo: number): ReferenciaVersiculo => ({
  livroSlug: "01-genesis",
  capitulo: 1,
  versiculo,
});

describe("LocalNotasRepository — anotações compartilhadas", () => {
  beforeEach(() => AsyncStorage.clear());

  it("cria um grupo para seleção contínua ou descontínua e o lista uma vez", async () => {
    await localNotasRepository.salvarVarios("owner-a", [ref(1), ref(2)], "Nota contínua");
    await localNotasRepository.salvarVarios("owner-a", [ref(4), ref(7)], "Nota descontínua", "grupo-descontinuo");

    const porCapitulo = await localNotasRepository.listarPorCapitulo("owner-a", "01-genesis", 1);
    expect(porCapitulo).toHaveLength(4);
    expect(porCapitulo.find((nota) => nota.versiculo === 4)?.referencias).toEqual([ref(4), ref(7)]);
    expect(porCapitulo.find((nota) => nota.versiculo === 7)?.grupoId).toBe("grupo-descontinuo");

    const todas = await localNotasRepository.listarTodas("owner-a");
    expect(todas).toHaveLength(2);
    expect(todas.find((nota) => nota.grupoId === "grupo-descontinuo")?.referencias).toEqual([ref(4), ref(7)]);
  });

  it("estende o grupo com referências novas e mantém um único texto compartilhado", async () => {
    const criada = await localNotasRepository.salvarVarios("owner-a", [ref(1), ref(3)], "Minha nota");
    const estendida = await localNotasRepository.salvarVarios("owner-a", [ref(3), ref(5)], "Minha nota", criada.grupoId);

    expect(estendida.referencias).toEqual([ref(1), ref(3), ref(5)]);
    expect(await localNotasRepository.buscar("owner-a", ref(5))).toMatchObject({
      grupoId: criada.grupoId,
      texto: "Minha nota",
      referencias: [ref(1), ref(3), ref(5)],
    });
    expect(await localNotasRepository.listarTodas("owner-a")).toHaveLength(1);
  });

  it("promove uma nota individual selecionada para um grupo sem duplicar sua referência", async () => {
    const individual = await localNotasRepository.salvar("owner-a", ref(2), "Nota já existente");
    const promovida = await localNotasRepository.salvarVarios("owner-a", [ref(2), ref(6)], individual.texto);

    expect(promovida).toMatchObject({
      versiculo: 2,
      texto: "Nota já existente",
      referencias: [ref(2), ref(6)],
    });
    expect(promovida.grupoId).toBeDefined();
    expect(await localNotasRepository.buscar("owner-a", ref(6))).toMatchObject({ grupoId: promovida.grupoId });
    expect(await localNotasRepository.listarTodas("owner-a")).toHaveLength(1);
  });

  it("rejeita referências ocupadas por notas distintas sem sobrescrever nenhum conteúdo", async () => {
    await localNotasRepository.salvar("owner-a", ref(1), "Nota original 1");
    await localNotasRepository.salvar("owner-a", ref(2), "Nota original 2");

    await expect(localNotasRepository.salvarVarios("owner-a", [ref(1), ref(2)], "Não substituir"))
      .rejects.toBeInstanceOf(ConflitoAnotacaoExistente);
    expect(await localNotasRepository.buscar("owner-a", ref(1))).toMatchObject({ texto: "Nota original 1" });
    expect(await localNotasRepository.buscar("owner-a", ref(2))).toMatchObject({ texto: "Nota original 2" });
  });

  it("remove todos os vínculos do grupo e mantém isolamento entre owners", async () => {
    const grupo = await localNotasRepository.salvarVarios("owner-a", [ref(1), ref(3), ref(5)], "Grupo");
    await localNotasRepository.salvar("owner-b", ref(3), "Nota de outro owner");

    await localNotasRepository.remover("owner-a", ref(3));

    expect(await localNotasRepository.buscar("owner-a", ref(1))).toBeNull();
    expect(await localNotasRepository.buscar("owner-a", ref(3))).toBeNull();
    expect(await localNotasRepository.buscar("owner-a", ref(5))).toBeNull();
    expect(await localNotasRepository.buscar("owner-b", ref(3))).toMatchObject({ texto: "Nota de outro owner" });
    expect(grupo.grupoId).toBeDefined();
  });
});
