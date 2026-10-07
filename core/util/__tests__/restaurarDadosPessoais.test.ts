import { identificarDivergenciaRestauracao } from "../restaurarDadosPessoais";
import type { DadosPessoais } from "../dadosPessoais";

jest.mock("../../repositories/substituirDadosPessoais", () => ({ substituirDadosPessoais: jest.fn() }));
jest.mock("../../storage/estadoUsuario", () => ({ aplicarPreferenciasRestauraveis: jest.fn() }));
jest.mock("../dadosPessoais", () => ({ coletarDadosPessoais: jest.fn() }));
jest.mock("../restauracaoPendente", () => ({
  exigirRecuperacaoAntesDeAcessarDados: jest.fn(),
  limparSnapshotDeRecuperacao: jest.fn(),
  salvarSnapshotDeRecuperacao: jest.fn(),
}));
jest.mock("../eventoDadosPessoais", () => ({ notificarRestauracaoDadosConcluida: jest.fn() }));

function dadosBase(): DadosPessoais {
  return {
    versaoFormato: 1,
    exportadoEm: "2026-10-07T12:00:00.000Z",
    perfil: { nome: "Visitante", avatarUri: null },
    grifos: [],
    capitulosLidos: [],
    notas: [],
    livrosLidos: [],
    pesquisasFavoritas: [],
    versiculosSalvos: [],
    planos: [],
    preferenciasLocais: { "tema-preferido": "light" },
    colecoes: [],
    associacoesColecoes: [],
    sessoesPlanos: [],
  };
}

describe("identificarDivergenciaRestauracao", () => {
  it("aceita dados equivalentes mesmo quando os IDs de coleção são regenerados", () => {
    const esperado = dadosBase();
    esperado.colecoes = [{ id: "backup-id", ownerId: "", nome: "Estudo", cor: "amber", criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z" }];
    esperado.associacoesColecoes = [{ ownerId: "", colecaoId: "backup-id", itemChave: "salvo-01-genesis-1-1" }];
    const encontrado: DadosPessoais = {
      ...esperado,
      colecoes: [{ ...esperado.colecoes[0], id: "novo-id", ownerId: "owner" }],
      associacoesColecoes: [{ ...esperado.associacoesColecoes[0], colecaoId: "novo-id", ownerId: "owner" }],
    };

    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBeNull();
  });

  it("detecta conteúdo alterado mesmo quando a quantidade de registros é igual", () => {
    const esperado = dadosBase();
    esperado.notas = [{ ownerId: "", livroSlug: "01-genesis", capitulo: 1, versiculo: 1, texto: "Texto original", criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z" }];
    const encontrado = dadosBase();
    encontrado.notas = [{ ...esperado.notas[0], texto: "Texto corrompido" }];

    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBe("anotações");
  });

  it("compara anotações multi-versículo após sua expansão em linhas por referência", () => {
    const esperado = dadosBase();
    esperado.notas = [{
      ownerId: "", livroSlug: "01-genesis", capitulo: 1, versiculo: 1, grupoId: "grupo-a",
      referencias: [
        { livroSlug: "01-genesis", capitulo: 1, versiculo: 1 },
        { livroSlug: "01-genesis", capitulo: 1, versiculo: 3 },
      ], texto: "Estudo", criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z",
    }];
    const encontrado = dadosBase();
    encontrado.notas = esperado.notas[0].referencias!.map((ref) => ({
      ...ref, ownerId: "owner", grupoId: "grupo-a", texto: "Estudo",
      criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z",
    }));

    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBeNull();
  });

  it("verifica preferências portáteis e progresso datado dos planos", () => {
    const esperado = dadosBase();
    esperado.planos = [{ planoId: "plano-teste", diasConcluidos: [1], datasConclusao: { "1": "2026-03-04T00:00:00.000Z" } }];
    const encontrado = dadosBase();
    encontrado.planos = [{ ...esperado.planos[0], datasConclusao: { "1": "2026-03-05T00:00:00.000Z" } }];
    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBe("progresso dos planos");

    encontrado.planos = esperado.planos;
    encontrado.preferenciasLocais = { "tema-preferido": "light", "voz-leitura-dispositivo": "voz-local" };
    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBeNull();

    encontrado.preferenciasLocais["tema-preferido"] = "dark";
    expect(identificarDivergenciaRestauracao(esperado, encontrado)).toBe("preferências");
  });
});
