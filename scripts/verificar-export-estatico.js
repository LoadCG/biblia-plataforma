const fs = require("fs");
const path = require("path");
const biblia = require("../assets/biblia.json");

const raiz = path.resolve(process.argv[2] || "dist");
const casos = [
  ["index.html", "Bíblia Plataforma — leitura bíblica offline", null],
  ["biblia/01-genesis/1.html", null, null],
  ["biblia/46-1-corintios/13.html", null, null],
  ["biblia/66-apocalipse/22.html", null, null],
  ["resumos/01-genesis.html", "Resumo de Gênesis — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["resumos/66-apocalipse.html", "Resumo de Apocalipse — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["planos/sabedoria-7.html", "Semana da Sabedoria — Bíblia Plataforma", "Semana da Sabedoria"],
];

for (const [arquivo, esperado, conteudo] of casos) {
  const destino = path.join(raiz, arquivo);
  if (!fs.existsSync(destino)) throw new Error(`Rota estática ausente: ${arquivo}`);
  const html = fs.readFileSync(destino, "utf8");
  if (!esperado) continue;
  const tituloComHelmet = `<title data-rh="true">${esperado}</title>`;
  if (!html.includes(tituloComHelmet) && !html.includes(`<title>${esperado}</title>`)) {
    throw new Error(`Título SEO ausente em ${arquivo}: ${esperado}`);
  }
  if (!html.includes('name="description"')) throw new Error(`Descrição SEO ausente em ${arquivo}.`);
  if ((html.match(/<title(?:\s[^>]*)?>/g) || []).length !== 1) {
    throw new Error(`Quantidade inválida de títulos em ${arquivo}.`);
  }
  if (conteudo && !html.includes(conteudo)) {
    throw new Error(`Conteúdo pré-renderizado ausente em ${arquivo}: ${conteudo}`);
  }
}

const totalCapitulos = biblia.reduce((soma, livro) => soma + livro.chapters.length, 0);
let capitulosGerados = 0;
for (let indiceLivro = 0; indiceLivro < biblia.length; indiceLivro++) {
  const livro = biblia[indiceLivro];
  const slug = `${String(indiceLivro + 1).padStart(2, "0")}-${livro.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  for (let capitulo = 1; capitulo <= livro.chapters.length; capitulo++) {
    const arquivo = path.join(raiz, "biblia", slug, `${capitulo}.html`);
    if (!fs.existsSync(arquivo)) throw new Error(`Rota estática de leitura ausente: biblia/${slug}/${capitulo}.html`);
    capitulosGerados++;
  }
}
if (capitulosGerados !== totalCapitulos) throw new Error(`Rotas de leitura incompletas: ${capitulosGerados}/${totalCapitulos}.`);

const quantidadeHtml = fs.readdirSync(raiz, { recursive: true })
  .filter((entrada) => typeof entrada === "string" && entrada.endsWith(".html"))
  .length;
if (quantidadeHtml < 70) {
  throw new Error(`Export incompleto: apenas ${quantidadeHtml} arquivos HTML encontrados.`);
}

console.log(`SEO: ${casos.length} rotas críticas e ${quantidadeHtml} arquivos HTML verificados; leitura estática: ${capitulosGerados} capítulos.`);
