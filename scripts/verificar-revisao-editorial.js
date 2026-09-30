const fs = require("fs");
const path = require("path");

const diretorio = path.resolve(__dirname, "..", "docs", "revisao-editorial");
const arquivos = fs.readdirSync(diretorio)
  .filter((nome) => nome.endsWith(".md") && nome !== "INDICE.md" && !nome.endsWith("-validacao.md"))
  .sort();
if (arquivos.length === 0) throw new Error("Nenhum rascunho editorial encontrado.");

for (const nome of arquivos) {
  const texto = fs.readFileSync(path.join(diretorio, nome), "utf8");
  for (const campo of ["Status", "Revisores humanos"]) {
    if (!texto.includes(`**${campo}:**`)) throw new Error(`${nome}: campo ausente (${campo}).`);
  }
  if (!texto.includes("**Pendências:**") && !/^##+\s+Pendências/m.test(texto)) {
    throw new Error(`${nome}: seção de pendências ausente.`);
  }
  if (!/Status:\*\*[^\n]*(rascunho|proposta)/i.test(texto)) throw new Error(`${nome}: status precisa ser rascunho ou proposta.`);
  if (!/pendente/i.test(texto)) throw new Error(`${nome}: revisão humana pendente não registrada.`);
}

console.log(`Revisão editorial verificada: ${arquivos.length} rascunhos com governança explícita.`);
