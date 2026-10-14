const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const catalogo = JSON.parse(fs.readFileSync(path.join(raiz, "core/biblia/dados/titulosSecao.json"), "utf8"));
const biblia = JSON.parse(fs.readFileSync(path.join(raiz, "assets/biblia.json"), "utf8"));
const livros = JSON.parse(fs.readFileSync(path.join(raiz, "core/content/dados/livros.json"), "utf8"));
const fontes = new Set();
const idsCapitulos = new Set();
const idsSecoes = new Set();

function falhar(mensagem) {
  console.error(`Catálogo de títulos inválido: ${mensagem}`);
  process.exit(1);
}

if (!Number.isInteger(catalogo.versao) || catalogo.versao < 1) falhar("versao precisa ser um inteiro positivo.");
if (!Array.isArray(catalogo.fontes) || !catalogo.fontes.length) falhar("informe ao menos uma fonte.");
if (!Array.isArray(catalogo.capitulos)) falhar("capitulos precisa ser uma lista.");
for (const fonte of catalogo.fontes) {
  if (!fonte.id || fontes.has(fonte.id)) falhar(`id de fonte ausente ou duplicado: ${fonte.id || "(vazio)"}.`);
  if (!fonte.url || !fonte.descricao || !fonte.uso) falhar(`fonte incompleta: ${fonte.id}.`);
  fontes.add(fonte.id);
}

for (const registro of catalogo.capitulos) {
  const chave = `${registro.livroSlug}:${registro.capitulo}`;
  if (idsCapitulos.has(chave)) falhar(`capítulo duplicado: ${chave}.`);
  idsCapitulos.add(chave);

  const livro = livros.find(({ slug }) => slug === registro.livroSlug);
  const dadosBiblia = livro && biblia.find(({ abbrev }) => abbrev === livro.abreviacao);
  const versiculos = dadosBiblia?.chapters?.[registro.capitulo - 1];
  if (!Number.isInteger(registro.capitulo) || !versiculos) falhar(`referência inexistente: ${chave}.`);
  if (!fontes.has(registro.fonteId)) falhar(`fonte ausente para ${chave}.`);
  if (!["titulo-da-edicao", "divisao-editorial"].includes(registro.tipo)) falhar(`tipo inválido em ${chave}.`);
  if (!["rascunho", "em-revisao", "aprovado"].includes(registro.status)) falhar(`status inválido em ${chave}.`);
  if (!Array.isArray(registro.secoes) || !registro.secoes.length) falhar(`capítulo sem seções: ${chave}.`);

  let fimAnterior = 0;
  for (const secao of registro.secoes) {
    if (!secao.id || idsSecoes.has(secao.id)) falhar(`id ausente ou duplicado: ${secao.id || "(vazio)"}.`);
    idsSecoes.add(secao.id);
    if (!secao.titulo?.trim()) falhar(`título vazio em ${chave}.`);
    if (!Number.isInteger(secao.inicioVersiculo) || !Number.isInteger(secao.fimVersiculo)) falhar(`limites inválidos em ${secao.id}.`);
    if (secao.inicioVersiculo <= fimAnterior || secao.fimVersiculo < secao.inicioVersiculo || secao.fimVersiculo > versiculos.length) {
      falhar(`seções fora de ordem ou dos limites do capítulo em ${secao.id}.`);
    }
    fimAnterior = secao.fimVersiculo;
  }
}

const salmo119 = catalogo.capitulos.find(({ livroSlug, capitulo }) => livroSlug === "19-salmos" && capitulo === 119);
if (salmo119) {
  const dados = biblia.find(({ abbrev }) => abbrev === "sl")?.chapters?.[118];
  if (dados?.length !== 176) falhar("Salmo 119 precisa conter os 176 versículos na fonte ACF.");
  if (salmo119.secoes.length !== 22) falhar("Salmo 119 precisa conter as 22 estrofes do acróstico.");
  if (salmo119.secoes.some((secao, indice) => secao.inicioVersiculo !== indice * 8 + 1 || secao.fimVersiculo !== indice * 8 + 8)) {
    falhar("as estrofes do Salmo 119 devem cobrir blocos consecutivos de oito versículos.");
  }
}

console.log(`Títulos de seção verificados: ${catalogo.capitulos.length} capítulo(s), ${idsSecoes.size} seção(ões).`);
