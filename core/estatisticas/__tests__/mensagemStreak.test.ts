import { acaoStreak, mensagemStreak } from "../mensagemStreak";

describe("mensagem da sequência de leitura", () => {
  it("explica como iniciar sem colocar pressão", () => {
    expect(mensagemStreak({ atual: 0, leuHoje: false })).toContain("Marque um capítulo");
  });

  it("reconhece uma leitura feita hoje", () => {
    expect(mensagemStreak({ atual: 3, leuHoje: true })).toContain("Você leu hoje");
  });

  it("explica que a sequência de ontem continua elegível hoje", () => {
    expect(mensagemStreak({ atual: 1, leuHoje: false })).toContain("Você leu ontem");
  });

  it("oferece iniciar leitura quando ainda não existe sequência ativa", () => {
    expect(acaoStreak({ atual: 0, leuHoje: false })).toEqual({
      rotulo: "Começar leitura",
      nomeAcessivel: "Abrir a Bíblia e começar a sequência",
    });
  });

  it("convida a ler hoje quando a sequência depende da leitura do dia", () => {
    expect(acaoStreak({ atual: 4, leuHoje: false })).toEqual({
      rotulo: "Ler hoje",
      nomeAcessivel: "Abrir a Bíblia para ler hoje",
    });
  });

  it("oculta a chamada para ação após uma leitura registrada hoje", () => {
    expect(acaoStreak({ atual: 4, leuHoje: true })).toBeNull();
  });
});
