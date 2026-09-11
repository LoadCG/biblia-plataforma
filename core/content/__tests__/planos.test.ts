import { obterDiaPlano, obterPlano, proximoDiaPendente } from "../planos";

describe("planos guiados", () => {
  const plano = obterPlano("sabedoria-7")!;

  it("mantém conteúdo devocional em todos os dias", () => {
    expect(plano.dias).toHaveLength(7);
    for (const dia of plano.dias) {
      expect(dia.titulo).toBeTruthy();
      expect(dia.reflexao).toBeTruthy();
      expect(dia.pergunta).toBeTruthy();
      expect(dia.referencias.length).toBeGreaterThan(0);
    }
  });

  it("seleciona o primeiro dia ainda pendente", () => {
    expect(proximoDiaPendente(plano, new Set([1, 2]))?.dia).toBe(3);
    expect(proximoDiaPendente(plano, new Set(plano.dias.map((dia) => dia.dia)))).toBeNull();
  });

  it("resolve um dia pelo identificador do plano", () => {
    expect(obterDiaPlano("sabedoria-7", 5)?.referencias).toContain("Salmos 119:1-32");
  });
});
