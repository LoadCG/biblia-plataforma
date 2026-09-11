const fs = require("fs");
const path = require("path");

const raiz = path.resolve(process.argv[2] || "dist");
const casos = [
  ["index.html", "Bíblia Plataforma — leitura bíblica offline", null],
  ["resumos/01-genesis.html", "Resumo de Gênesis — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["resumos/66-apocalipse.html", "Resumo de Apocalipse — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["planos/sabedoria-7.html", "Semana da Sabedoria — Bíblia Plataforma", "Semana da Sabedoria"],
];

for (const [arquivo, esperado, conteudo] of casos) {
  const destino = path.join(raiz, arquivo);
  if (!fs.existsSync(destino)) throw new Error(`Rota estática ausente: ${arquivo}`);
  const html = fs.readFileSync(destino, "utf8");
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

const quantidadeHtml = fs.readdirSync(raiz, { recursive: true })
  .filter((entrada) => typeof entrada === "string" && entrada.endsWith(".html"))
  .length;
if (quantidadeHtml < 70) {
  throw new Error(`Export incompleto: apenas ${quantidadeHtml} arquivos HTML encontrados.`);
}

console.log(`SEO: ${casos.length} rotas críticas e ${quantidadeHtml} arquivos HTML verificados.`);
