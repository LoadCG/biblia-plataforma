const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const fonte = path.join(raiz, "resumos-biblicos", "antigo-testamento", "01-genesis.md");
const texto = fs.readFileSync(fonte, "utf8");
const obrigatorias = [
  "📋 Ficha Rápida",
  "🌍 Pano de Fundo Histórico",
  "⏳ Linha do Tempo e Cronologia",
  "✍️ Autor e Propósito",
  "📖 Resumo do Conteúdo",
  "💡 Curiosidades e Conexões",
  "🎯 Por Que Isso Importa Hoje",
];
for (const secao of obrigatorias) {
  if (!texto.includes(`## ${secao}`)) throw new Error(`Gênesis: seção ausente (${secao}).`);
}
for (const referencia of ["Gênesis 2:4", "Gênesis 5:1", "Gênesis 6:9", "Gênesis 32:28", "Gênesis 50:24-26", "Gálatas 3:8-16"]) {
  if (!texto.includes(referencia)) throw new Error(`Gênesis: referência esperada ausente (${referencia}).`);
}
for (const marcador of ["debate", "discut", "não determina", "não demonstra"]) {
  if (!texto.toLocaleLowerCase("pt-BR").includes(marcador)) throw new Error(`Gênesis: marcador de incerteza ausente (${marcador}).`);
}
console.log("Piloto editorial verificado: Gênesis possui template, referências-chave e marcadores de incerteza.");
