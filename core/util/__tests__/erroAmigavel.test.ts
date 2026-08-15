import { ErroBusca } from "../../biblia/BibliaAPI";
import { mensagemErroAmigavel } from "../erroAmigavel";

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

describe("mensagemErroAmigavel", () => {
  it("pede pra ir mais devagar no caso de limite de requisições", () => {
    expect(mensagemErroAmigavel(new ErroBusca("limite", "x"))).toMatch(/devagar/i);
  });

  it("menciona conexão no caso de falha de rede", () => {
    expect(mensagemErroAmigavel(new ErroBusca("rede", "x"))).toMatch(/conexão/i);
  });

  it("menciona lentidão no caso de timeout", () => {
    expect(mensagemErroAmigavel(new ErroBusca("timeout", "x"))).toMatch(/lenta/i);
  });

  it("diz que não encontrou o texto no caso de referência inválida", () => {
    expect(mensagemErroAmigavel(new ErroBusca("invalido", "x"))).toMatch(/não encontramos/i);
  });

  it("cai numa mensagem genérica pra erros não classificados", () => {
    expect(mensagemErroAmigavel(new Error("qualquer coisa"))).toMatch(/algo deu errado/i);
  });
});
