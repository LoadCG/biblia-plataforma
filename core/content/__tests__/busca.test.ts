import { buscarLivros } from "../busca";
import { livros } from "../livros";
import { parseReferenciaBiblica } from "../../biblia/parseReferencia";

const consultasDouradas = [
  ["Gênesis", "01-genesis"], ["gn", "01-genesis"], ["genezis", "01-genesis"],
  ["Êxodo", "02-exodo"], ["ex", "02-exodo"], ["Levítico", "03-levitico"],
  ["lv", "03-levitico"], ["Números", "04-numeros"], ["nm", "04-numeros"],
  ["Deuteronômio", "05-deuteronomio"], ["dt", "05-deuteronomio"],
  ["Josué", "06-josue"], ["js", "06-josue"], ["Juízes", "07-juizes"],
  ["Rute", "08-rute"], ["1 Samuel", "09-1-samuel"], ["1sm", "09-1-samuel"],
  ["Salmos", "19-salmos"], ["sl", "19-salmos"], ["Provérbios", "20-proverbios"],
  ["pv", "20-proverbios"], ["Isaías", "23-isaias"], ["is", "23-isaias"],
  ["Mateus", "40-mateus"], ["mt", "40-mateus"], ["Marcos", "41-marcos"],
  ["mc", "41-marcos"], ["Lucas", "42-lucas"], ["lc", "42-lucas"],
  ["João", "43-joao"], ["joao", "43-joao"],
  ["Eclesiastes", "21-eclesiastes"], ["Jeremias", "24-jeremias"],
  ["Daniel", "27-daniel"], ["Oseias", "28-oseias"],
  ["Jonas", "32-jonas"], ["Atos", "44-atos"],
  ["Romanos", "45-romanos"], ["Apocalipse", "66-apocalipse"],
] as const;

const referenciasDouradas = [
  ["Salmos 119:1-32", "19-salmos", 119],
  ["1sm 3:10", "09-1-samuel", 3],
  ["Joao 3:16", "43-joao", 3],
  ["Mateus 5", "40-mateus", 5],
  ["Gn 1:1", "01-genesis", 1],
] as const;

describe("busca editorial", () => {
  it.each(consultasDouradas)("encontra %s entre os primeiros resultados", (consulta, slugEsperado) => {
    const resultados = buscarLivros(consulta);
    expect(resultados.slice(0, 5).some(({ livro }) => livro.slug === slugEsperado)).toBe(true);
  });

  it("documenta cobertura básica de livros e abreviações no conjunto de regressão", () => {
    expect(consultasDouradas).toHaveLength(39);
    expect(new Set(consultasDouradas.map(([, slug]) => slug)).size).toBeGreaterThanOrEqual(24);
  });

  it("consulta vazia mantém a lista integral para as telas de catálogo", () => {
    expect(buscarLivros(" ").map(({ livro }) => livro.slug)).toEqual(livros.map(({ slug }) => slug));
  });

  it("mantém busca por nome e abreviação", () => {
    expect(buscarLivros("gn")[0].livro.slug).toBe("01-genesis");
    expect(buscarLivros("João")[0].livro.slug).toBe("43-joao");
  });

  it("expande temas por vocabulário controlado", () => {
    const resultados = buscarLivros("esperança");
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some(({ trecho }) => trecho !== null)).toBe(true);
  });

  it("ordena resultados de forma determinística e explica o campo", () => {
    const resultados = buscarLivros("esperança");
    expect(resultados.every((resultado) => resultado.score > 0)).toBe(true);
    expect(resultados.every((resultado) => resultado.camposCoincidentes.length > 0)).toBe(true);
    expect(resultados).toEqual(buscarLivros("esperança"));
  });

  it.each(referenciasDouradas)("mantém a referência %s fora da busca de resumos", (consulta, livroSlug, capitulo) => {
    const referencia = parseReferenciaBiblica(consulta);
    expect(referencia).toMatchObject({ livroSlug, capitulo });
    expect(buscarLivros(consulta)).toHaveLength(0);
  });
});
