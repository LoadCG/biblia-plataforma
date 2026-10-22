jest.mock("../../repositories", () => {
  const semOperacao = jest.fn(async () => undefined);
  return {
    perfilRepository: { salvar: semOperacao },
    grifosRepository: { alternar: semOperacao },
    progressoRepository: { definirVarios: semOperacao },
    notasRepository: { remover: semOperacao },
    livrosLidosRepository: { alternar: semOperacao },
    pesquisasFavoritasRepository: { alternar: semOperacao },
    versiculosSalvosRepository: { alternar: semOperacao },
    planosRepository: { alternarDiaConcluido: semOperacao, removerSessao: semOperacao },
    colecoesRepository: { apagarTudo: semOperacao },
  };
});
jest.mock("../../content/planos", () => ({ planosLeitura: [] }));
jest.mock("../../storage/estadoUsuario", () => ({ apagarEstadoUsuario: jest.fn(async () => undefined) }));

import * as repositorios from "../../repositories";
import { apagarEstadoUsuario } from "../../storage/estadoUsuario";
import { apagarDadosPessoais, type DadosPessoais } from "../dadosPessoais";

function dadosVazios(): DadosPessoais {
  return {
    versaoFormato: 1,
    exportadoEm: "2026-10-21T12:00:00.000Z",
    perfil: { nome: "Visitante", avatarUri: null },
    grifos: [],
    capitulosLidos: [],
    notas: [],
    livrosLidos: [],
    pesquisasFavoritas: [],
    versiculosSalvos: [],
    planos: [],
    preferenciasLocais: {},
    colecoes: [],
    associacoesColecoes: [],
    sessoesPlanos: [],
  };
}

describe("apagarDadosPessoais", () => {
  afterEach(() => jest.clearAllMocks());

  it("espera todas as remoções terminarem antes de permitir uma nova tentativa", async () => {
    let concluirRemocaoPendente!: () => void;
    const remocaoPendente = new Promise<void>((resolve) => { concluirRemocaoPendente = resolve; });
    jest.mocked(repositorios.perfilRepository.salvar).mockRejectedValueOnce(new Error("falha simulada"));
    jest.mocked(repositorios.colecoesRepository.apagarTudo).mockReturnValueOnce(remocaoPendente);

    let terminou = false;
    const tentativa = apagarDadosPessoais("owner-teste", dadosVazios()).finally(() => { terminou = true; });
    await Promise.resolve();
    await Promise.resolve();

    expect(terminou).toBe(false);
    expect(apagarEstadoUsuario).not.toHaveBeenCalled();

    concluirRemocaoPendente();
    await expect(tentativa).rejects.toThrow("falha simulada");
    expect(apagarEstadoUsuario).not.toHaveBeenCalled();
  });
});
