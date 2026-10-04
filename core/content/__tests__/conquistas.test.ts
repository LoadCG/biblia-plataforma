import { calcularConquistas, obterLivrosPendentes, selecionarDestaquesConquistas } from "../conquistas";
import { livros } from "../livros";

describe("calcularConquistas", () => {
  it("ignora slugs que não pertencem ao catálogo canônico", () => {
    const conquistas = calcularConquistas(new Set(["slug-invalido"]));

    expect(conquistas.find((item) => item.id === "primeiro-livro")?.progressoAtual).toBe(0);
    expect(conquistas.find((item) => item.id === "biblia-completa")?.progressoAtual).toBe(0);
  });

  it("calcula marcos parciais e completos com livros válidos", () => {
    const parcial = calcularConquistas(new Set(["01-genesis", "02-exodo", "40-mateus", "slug-invalido"]));
    expect(parcial.find((item) => item.id === "pentateuco")?.progressoAtual).toBe(2);
    expect(parcial.find((item) => item.id === "evangelhos")?.progressoAtual).toBe(1);
    expect(parcial.find((item) => item.id === "biblia-completa")?.progressoAtual).toBe(3);

    const completa = calcularConquistas(new Set([
      "01-genesis", "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio",
    ]));
    expect(completa.find((item) => item.id === "pentateuco")?.conquistada).toBe(true);
  });

  it("conclui os seis marcos quando todos os livros canônicos foram lidos", () => {
    const conquistas = calcularConquistas(new Set(livros.map((livro) => livro.slug)));

    expect(conquistas).toHaveLength(6);
    expect(conquistas.every((item) => item.conquistada)).toBe(true);
    expect(conquistas.find((item) => item.id === "biblia-completa")?.progressoAtual).toBe(66);
  });
});

describe("selecionarDestaquesConquistas", () => {
  it("inclui o próximo marco em andamento, o primeiro passo e a conclusão", () => {
    const conquistas = calcularConquistas(new Set(["01-genesis", "02-exodo", "03-levitico", "40-mateus"]));

    expect(selecionarDestaquesConquistas(conquistas).map((item) => item.id)).toEqual([
      "pentateuco", "primeiro-livro", "biblia-completa",
    ]);
  });

  it("não repete medalhas quando nenhum marco está em andamento", () => {
    const destaques = selecionarDestaquesConquistas(calcularConquistas(new Set()));
    expect(new Set(destaques.map((item) => item.id)).size).toBe(destaques.length);
    expect(destaques.map((item) => item.id)).toContain("primeiro-livro");
    expect(destaques.map((item) => item.id)).toContain("biblia-completa");
  });

  it("sugere qualquer próximo livro no primeiro marco e lista somente requisitos restantes nos demais", () => {
    expect(obterLivrosPendentes("primeiro-livro", new Set()).map((livro) => livro.slug)).toEqual(["01-genesis"]);
    expect(obterLivrosPendentes("pentateuco", new Set(["01-genesis", "slug-invalido"])).map((livro) => livro.slug)).toEqual([
      "02-exodo", "03-levitico", "04-numeros", "05-deuteronomio",
    ]);
  });
});
