const fs = require("fs");
const path = require("path");

const pasta = path.resolve(__dirname, "..", ".maestro");
const fluxos = fs.readdirSync(pasta).filter((arquivo) => arquivo.endsWith(".yaml")).sort();
if (fluxos.length < 4) throw new Error(`Esperava pelo menos 4 fluxos Maestro, encontrei ${fluxos.length}.`);

for (const fluxo of fluxos) {
  const conteudo = fs.readFileSync(path.join(pasta, fluxo), "utf8");
  if (!conteudo.startsWith("appId: com.cauangabriel.bibliaplataforma")) throw new Error(`appId inválido em ${fluxo}.`);
  if (!conteudo.includes("launchApp:")) throw new Error(`Fluxo sem launchApp: ${fluxo}.`);
  if (!conteudo.includes("assertVisible:")) throw new Error(`Fluxo sem asserção observável: ${fluxo}.`);
}

console.log(`Maestro: ${fluxos.length} contratos de jornada verificados.`);
