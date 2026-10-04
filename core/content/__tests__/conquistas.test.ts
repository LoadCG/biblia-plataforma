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

  it("conclui todos os marcos quando todos os livros canônicos foram lidos", () => {
    const conquistas = calcularConquistas(new Set(livros.map((livro) => livro.slug)));

    expect(conquistas).toHaveLength(10);
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

  it("deriva as novas medalhas das coleções editoriais do catálogo", () => {
    const conquistas = calcularConquistas(new Set());
    const porId = new Map(conquistas.map((item) => [item.id, item]));

    expect(porId.get("historia-israel")?.progressoTotal).toBe(12);
    expect(porId.get("poesia-sabedoria")?.progressoTotal).toBe(5);
    expect(porId.get("profetas")?.progressoTotal).toBe(17);
    expect(porId.get("cartas")?.progressoTotal).toBe(21);
    expect(obterLivrosPendentes("cartas", new Set()).map((livro) => livro.slug)).toHaveLength(21);
  });
});
