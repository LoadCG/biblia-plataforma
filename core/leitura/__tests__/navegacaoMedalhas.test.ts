import { normalizarOrigemMedalhas, obterDestinoVoltaMedalhas } from "../navegacaoMedalhas";

describe("retorno da tela de medalhas", () => {
  it("retorna ao contexto conhecido quando a lista foi aberta pela navegação interna", () => {
    expect(obterDestinoVoltaMedalhas("inicio", false)).toBe("/");
    expect(obterDestinoVoltaMedalhas("voce", false)).toBe("/voce");
  });

  it("volta do detalhe para a lista e preserva a origem para o próximo retorno", () => {
    expect(obterDestinoVoltaMedalhas("inicio", true)).toEqual({
      pathname: "/medalhas",
      params: { origem: "inicio" },
    });
    expect(obterDestinoVoltaMedalhas("voce", true)).toEqual({
      pathname: "/medalhas",
      params: { origem: "voce" },
    });
  });

  it("usa o Perfil como fallback para acesso direto ou origem inválida/ambígua", () => {
    for (const origem of [undefined, "desconhecida", ["inicio", "voce"]]) {
      expect(normalizarOrigemMedalhas(origem)).toBe("voce");
    }
    expect(normalizarOrigemMedalhas("inicio")).toBe("inicio");
  });
});
