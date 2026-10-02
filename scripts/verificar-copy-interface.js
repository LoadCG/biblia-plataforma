const fs = require("node:fs");
const path = require("node:path");

const raizes = ["app", "components", "core/content/dados", "resumos-biblicos"];
const extensoes = new Set([".ts", ".tsx", ".json", ".md"]);
const padroes = [
  /\b(?:as an ai|i am an ai|internal thought|internal reasoning|chain of thought)\b/i,
  /\b(?:sou|como)\s+(?:uma?\s+)?(?:ia|intelig[eê]ncia artificial|modelo de linguagem)\b/i,
  /\b(?:pensamento|racioc[ií]nio)\s+intern[oa]\b/i,
  /\bconforme\s+(?:o\s+)?solicitado\b/i,
  /\bcomo\s+solicitado\b/i,
  /^\s*(?:analysis|final answer|assistant|user):/im,
];

const arquivos = [];

function coletar(caminho) {
  if (!fs.existsSync(caminho)) return;
  const stat = fs.statSync(caminho);
  if (stat.isDirectory()) {
    for (const nome of fs.readdirSync(caminho)) coletar(path.join(caminho, nome));
    return;
  }
  if (extensoes.has(path.extname(caminho))) arquivos.push(caminho);
}

for (const raiz of raizes) coletar(raiz);

const achados = [];
for (const arquivo of arquivos) {
  const conteudo = fs.readFileSync(arquivo, "utf8");
  for (const padrao of padroes) {
    const resultado = padrao.exec(conteudo);
    if (resultado) {
      const linha = conteudo.slice(0, resultado.index).split(/\r?\n/).length;
      achados.push(`${arquivo}:${linha}: possível texto interno exposto (${padrao})`);
    }
  }
}

if (achados.length) {
  process.stderr.write(`Copy da interface requer revisão:\n${achados.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Copy da interface: ${arquivos.length} fontes verificadas; nenhum padrão interno sinalizado.\n`);
}
