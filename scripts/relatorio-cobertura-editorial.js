const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const dirResumos = path.join(raiz, "resumos-biblicos");
const arquivoLivros = path.join(raiz, "core", "content", "dados", "livros.json");
const arquivoPlanos = path.join(raiz, "core", "content", "dados", "planos.json");
const livros = JSON.parse(fs.readFileSync(arquivoLivros, "utf8"));
const planos = JSON.parse(fs.readFileSync(arquivoPlanos, "utf8"));

function listarMarkdown(diretorio) {
  return fs.readdirSync(diretorio, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = path.join(diretorio, entrada.name);
    return entrada.isDirectory()
      ? listarMarkdown(caminho)
      : entrada.isFile() && entrada.name.endsWith(".md")
        ? [caminho]
        : [];
  });
}

function assert(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

const fontes = listarMarkdown(dirResumos);
const slugsFonte = fontes.map((arquivo) => path.basename(arquivo, ".md"));
const slugsLivros = livros.map((livro) => livro.slug);
const slugsUnicos = new Set(slugsLivros);

assert(fontes.length === 66, `Esperava 66 fontes Markdown de resumos; encontrei ${fontes.length}.`);
assert(livros.length === 66, `Esperava 66 livros no JSON derivado; encontrei ${livros.length}.`);
assert(slugsUnicos.size === livros.length, "Há slugs de livros duplicados no JSON derivado.");

const faltamNoDerivado = slugsFonte.filter((slug) => !slugsUnicos.has(slug));
const faltamNaFonte = slugsLivros.filter((slug) => !slugsFonte.includes(slug));
assert(faltamNoDerivado.length === 0, `Fontes sem livro correspondente no JSON: ${faltamNoDerivado.join(", ")}`);
assert(faltamNaFonte.length === 0, `Livros sem fonte Markdown: ${faltamNaFonte.join(", ")}`);

for (const [indice, livro] of livros.entries()) {
  assert(livro.numero === indice + 1, `Numeração inválida para ${livro.slug}: ${livro.numero}.`);
  assert(livro.secoes.length === 6, `${livro.nome} deveria ter 6 seções editoriais; tem ${livro.secoes.length}.`);
  assert(livro.fichaRapida.length > 0, `${livro.nome} não possui ficha rápida.`);
  for (const secao of livro.secoes) {
    assert(secao.titulo.trim().length > 0, `${livro.nome} possui seção sem título.`);
    assert(secao.paragrafos.length + secao.itens.length > 0, `${livro.nome}: seção vazia (${secao.id}).`);
  }
}

const idsPlano = new Set();
for (const plano of planos) {
  assert(!idsPlano.has(plano.id), `ID de plano duplicado: ${plano.id}.`);
  idsPlano.add(plano.id);
  assert(plano.dias.length === plano.duracaoDias, `${plano.id}: duração declarada diverge da quantidade de dias.`);
  const dias = new Set();
  for (const dia of plano.dias) {
    assert(!dias.has(dia.dia), `${plano.id}: dia ${dia.dia} duplicado.`);
    dias.add(dia.dia);
    assert(dia.dia >= 1 && dia.dia <= plano.duracaoDias, `${plano.id}: dia ${dia.dia} fora da duração.`);
    assert(dia.referencias.length > 0, `${plano.id}, dia ${dia.dia}: nenhuma referência bíblica.`);
    assert(Boolean(dia.titulo?.trim()), `${plano.id}, dia ${dia.dia}: título ausente.`);
    assert(Boolean(dia.reflexao?.trim()), `${plano.id}, dia ${dia.dia}: reflexão ausente.`);
    assert(Boolean(dia.pergunta?.trim()), `${plano.id}, dia ${dia.dia}: pergunta ausente.`);
  }
  for (let dia = 1; dia <= plano.duracaoDias; dia++) {
    assert(dias.has(dia), `${plano.id}: falta o dia ${dia}.`);
  }
}

const porTestamento = livros.reduce((acc, livro) => {
  acc[livro.testamento] = (acc[livro.testamento] || 0) + 1;
  return acc;
}, {});
const palavrasFonte = fontes.reduce((acc, arquivo) => {
  const texto = fs.readFileSync(arquivo, "utf8");
  return acc + (texto.match(/\b[\p{L}\p{N}]+\b/gu) || []).length;
}, 0);
const totalDias = planos.reduce((acc, plano) => acc + plano.dias.length, 0);
const resumo = [
  "# Cobertura editorial — inventário inicial",
  "",
  "Relatório gerado por `npm run relatorio:editorial`. As contagens descrevem estrutura e cobertura; não certificam qualidade ou precisão teológica.",
  "",
  "## Resumos bíblicos",
  "",
  `- Fontes Markdown: ${fontes.length}`,
  `- Livros no conteúdo derivado: ${livros.length}`,
  `- Antigo Testamento: ${porTestamento["Antigo Testamento"] || 0}`,
  `- Novo Testamento: ${porTestamento["Novo Testamento"] || 0}`,
  `- Palavras nas fontes Markdown: ${palavrasFonte.toLocaleString("pt-BR")}`,
  `- Seções esperadas por livro: ${livros[0].secoes.map((secao) => secao.id).join(", ")}`,
  "",
  "## Planos de leitura",
  "",
  `- Planos: ${planos.length}`,
  `- Dias guiados: ${totalDias}`,
  ...planos.map((plano) => `- **${plano.titulo}** (\`${plano.id}\`): ${plano.duracaoDias} dias, ${plano.dias.reduce((acc, dia) => acc + dia.referencias.length, 0)} referências de capítulo/trecho.`),
  "",
  "## Limites deste inventário",
  "",
  "- A contagem de palavras é indicativa e não avalia profundidade ou equilíbrio entre gêneros.",
  "- As referências dos planos são verificadas quanto à presença, mas ainda não são confrontadas com o cânon e os limites de capítulo/versículo da Bíblia ACF.",
  "- Coerência teológica, fontes, linguagem e adequação pastoral exigem revisão humana independente.",
  "",
].join("\n");

const destino = path.join(raiz, "docs", "cobertura-editorial.md");
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, resumo, "utf8");
console.log(`Cobertura editorial verificada: ${fontes.length} resumos, ${planos.length} planos e ${totalDias} dias.`);
console.log(`Relatório: ${path.relative(raiz, destino)}`);
