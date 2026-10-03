const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const destino = path.join(raiz, "dist", "biblia");
const biblia = require(path.join(raiz, "assets", "biblia.json"));

const contagens = biblia.map((livro) => {
  if (!Array.isArray(livro.chapters) || livro.chapters.length === 0) {
    throw new Error(`Livro sem capítulos válidos: ${livro.abbrev}`);
  }
  return livro.chapters.length;
});

const modelo = fs.readFileSync(path.join(destino, "[livro]", "[capitulo].html"), "utf8");
const totalEsperado = contagens.reduce((soma, quantidade) => soma + quantidade, 0);
let geradas = 0;

for (let indiceLivro = 0; indiceLivro < biblia.length; indiceLivro++) {
  const livro = biblia[indiceLivro];
  const slug = `${String(indiceLivro + 1).padStart(2, "0")}-${livro.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  for (let capitulo = 1; capitulo <= contagens[indiceLivro]; capitulo++) {
    const arquivo = path.join(destino, slug, `${capitulo}.html`);
    fs.mkdirSync(path.dirname(arquivo), { recursive: true });
    fs.writeFileSync(arquivo, modelo);
    geradas++;
  }
}

if (geradas !== totalEsperado) {
  throw new Error(`Foram geradas ${geradas} rotas de leitura; esperado: ${totalEsperado}.`);
}

console.log(`Rotas estáticas de leitura geradas: ${geradas} capítulos.`);
