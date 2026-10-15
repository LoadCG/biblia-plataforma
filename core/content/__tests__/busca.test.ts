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
    expect(buscarLivros("jo")[0].livro.slug).toBe("43-joao");
    expect(buscarLivros("João")[0].livro.slug).toBe("43-joao");
  });

  it("combina termos e respeita frases entre aspas nos resumos", () => {
    const termos = buscarLivros("criação descanso").find(({ livro }) => livro.slug === "01-genesis");
    const frase = buscarLivros('"criação e o descanso"').find(({ livro }) => livro.slug === "01-genesis");
    const fraseInvertida = buscarLivros('"descanso e criação"');

    expect(termos?.trecho?.toLowerCase()).toContain("criação");
    expect(termos?.trecho?.toLowerCase()).toContain("descanso");
    expect(frase?.trecho?.toLowerCase()).toContain("criação e o descanso");
    expect(fraseInvertida).toEqual([]);
  });

  it("resume termos distantes sem ocultar a evidência no cartão", () => {
    const resultado = buscarLivros("amor oração").find(({ livro }) => livro.slug === "54-1-timoteo");

    expect(resultado?.trecho).toContain("oração");
    expect(resultado?.trecho).toContain("amor");
    expect(resultado?.trecho?.length).toBeLessThan(120);
  });

  it("expande temas por vocabulário controlado", () => {
    const resultados = buscarLivros("esperança");
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some(({ trecho }) => trecho !== null)).toBe(true);
    expect(resultados.filter(({ camposCoincidentes }) => camposCoincidentes.includes("tema"))
      .every(({ trecho }) => trecho !== null)).toBe(true);
  });

  it("encontra resumos por misericórdia e reconciliação ao buscar perdão", () => {
    const resultados = buscarLivros("perdão");

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some(({ livro, trecho }) => livro.slug === "01-genesis" && trecho?.toLowerCase().includes("reconciliação"))).toBe(true);
    expect(resultados.every(({ camposCoincidentes, trecho }) => camposCoincidentes.includes("tema") && trecho !== null)).toBe(true);
  });

  it("mantém o trecho alinhado com o campo que justificou o resultado", () => {
    const consulta = "sabedoria";
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const resultados = buscarLivros(consulta).filter(({ camposCoincidentes }) => camposCoincidentes.includes("conteudo"));

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.every(({ trecho }) => trecho !== null && normalizar(trecho).includes(consulta))).toBe(true);
  });

  it("recorta o texto-fonte corretamente depois de palavras acentuadas", () => {
    const resultado = buscarLivros("sabedoria").find(({ livro }) => livro.slug === "11-1-reis");

    expect(resultado?.trecho).toContain("sabedoria");
  });

  it("não confunde correspondência parcial dentro de palavra com título ou conteúdo", () => {
    const resultadoEfesios = buscarLivros("fé").find(({ livro }) => livro.slug === "49-efesios");

    expect(resultadoEfesios?.camposCoincidentes).toContain("conteudo");
    expect(resultadoEfesios?.camposCoincidentes).not.toContain("titulo");
    expect(resultadoEfesios?.trecho).toContain("fé");
    expect(buscarLivros("fé").some(({ livro, trecho }) => livro.slug === "01-genesis" && trecho?.includes("feitas"))).toBe(false);
    expect(buscarLivros("!!!")).toEqual([]);
  });

  it("ordena resultados de forma determinística e explica o campo", () => {
    const resultados = buscarLivros("esperança");
    expect(resultados.every((resultado) => resultado.score > 0)).toBe(true);
    expect(resultados.every((resultado) => resultado.camposCoincidentes.length > 0)).toBe(true);
    expect(resultados).toEqual(buscarLivros("esperança"));
  });

  it("prioriza livros que desenvolvem o assunto em vários trechos", () => {
    const evangelhos = new Set(["40-mateus", "41-marcos", "42-lucas", "43-joao"]);
    const resultadosJesus = buscarLivros("Jesus");
    const resultadosFe = buscarLivros("fé");

    expect(resultadosJesus.slice(0, 4).every(({ livro }) => evangelhos.has(livro.slug))).toBe(true);
    expect(resultadosJesus.slice(0, 5).some(({ livro }) => livro.slug === "01-genesis")).toBe(false);
    expect(resultadosFe.slice(0, 2).map(({ livro }) => livro.slug)).toEqual(["59-tiago", "58-hebreus"]);
    expect(buscarLivros("criação descanso")[0].livro.slug).toBe("01-genesis");
  });

  it("encontra temas presentes nos resumos editoriais atualizados", () => {
    const espiritoSanto = buscarLivros("Espírito Santo");
    const dinheiro = buscarLivros("dinheiro");
    const reinoDeDeus = buscarLivros("reino de Deus").slice(0, 5).map(({ livro }) => livro.slug);

    expect(espiritoSanto[0]).toMatchObject({ livro: { slug: "44-atos" } });
    expect(espiritoSanto[0].trecho).toContain("Espírito Santo");
    expect(dinheiro.some(({ livro, trecho }) => livro.slug === "20-proverbios" && trecho?.includes("dinheiro"))).toBe(true);
    expect(reinoDeDeus).toEqual(expect.arrayContaining(["40-mateus", "41-marcos", "42-lucas"]));
  });

  it.each([
    ["paz", "43-joao"],
    ["ansiedade", "40-mateus"],
    ["pobreza", "59-tiago"],
    ["louvor", "58-hebreus"],
    ["louvor", "66-apocalipse"],
  ])("encontra %s no resumo de %s com evidência visível", (consulta, slug) => {
    const resultado = buscarLivros(consulta).find(({ livro }) => livro.slug === slug);
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    expect(resultado?.camposCoincidentes).toContain("conteudo");
    expect(normalizar(resultado?.trecho ?? "")).toContain(consulta);
  });

  it.each(referenciasDouradas)("mantém a referência %s fora da busca de resumos", (consulta, livroSlug, capitulo) => {
    const referencia = parseReferenciaBiblica(consulta);
    expect(referencia).toMatchObject({ livroSlug, capitulo });
    expect(buscarLivros(consulta)).toHaveLength(0);
  });
});
