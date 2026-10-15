import avaliacao from "../../../docs/avaliacao-busca-editorial-v1.json";
import { livros } from "../livros";

describe("conjunto exploratório de avaliação da busca editorial", () => {
  it("mantém 30 consultas únicas com intenção e rótulos legíveis", () => {
    const consultas = avaliacao.consultas;

    expect(consultas).toHaveLength(30);
    expect(new Set(consultas.map(({ consulta }) => consulta)).size).toBe(consultas.length);
    expect(consultas.every(({ intencao, central }) => intencao.trim().length > 0 && central.length > 0)).toBe(true);
    expect(avaliacao.statusDosRotulos).toContain("provisorios");
  });

  it("usa slugs existentes e não duplica um livro entre classes de relevância", () => {
    const slugsConhecidos = new Set(livros.map(({ slug }) => slug));

    for (const item of avaliacao.consultas) {
      const classes = [item.central, item.relevante ?? [], item.contextual ?? []];
      const slugsRotulados = classes.flat();

      expect(slugsRotulados.every((slug) => slugsConhecidos.has(slug))).toBe(true);
      expect(new Set(slugsRotulados).size).toBe(slugsRotulados.length);
      expect(typeof item.ambigua).toBe("boolean");
    }
  });
});
