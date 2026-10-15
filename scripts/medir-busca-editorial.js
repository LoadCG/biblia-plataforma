const fs = require("fs");
const path = require("path");
const { performance } = require("node:perf_hooks");
const ts = require("typescript");

const raiz = path.resolve(__dirname, "..");
const avaliacao = JSON.parse(fs.readFileSync(path.join(raiz, "docs", "avaliacao-busca-editorial-v1.json"), "utf8"));
const dados = path.join(raiz, "core", "content", "dados", "livros.json");

require.extensions[".ts"] = (modulo, arquivo) => {
  const compilado = ts.transpileModule(fs.readFileSync(arquivo, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: arquivo,
  });
  modulo._compile(compilado.outputText, arquivo);
};

const { buscarLivros } = require(path.join(raiz, "core", "content", "busca.ts"));
const consultas = avaliacao.consultas.map(({ consulta }) => consulta);
const primeiraBusca = performance.now();
buscarLivros(consultas[0]);
const primeiraBuscaMs = performance.now() - primeiraBusca;

const duracoes = [];
const repeticoesPorConsulta = 30;
for (let repeticao = 0; repeticao < repeticoesPorConsulta; repeticao += 1) {
  for (const consulta of consultas) {
    const inicio = performance.now();
    buscarLivros(consulta);
    duracoes.push(performance.now() - inicio);
  }
}

duracoes.sort((a, b) => a - b);
const percentil = (p) => duracoes[Math.min(duracoes.length - 1, Math.ceil(p * duracoes.length) - 1)];
const media = duracoes.reduce((total, valor) => total + valor, 0) / duracoes.length;

console.log(`Busca editorial — runtime Node ${process.version}, ${process.platform}/${process.arch}.`);
console.log(`Dados do catálogo: ${(fs.statSync(dados).size / 1024).toFixed(1)} KiB; ${consultas.length} consultas; ${repeticoesPorConsulta} repetições por consulta.`);
console.log(`Primeira busca (construção lazy do índice + busca): ${primeiraBuscaMs.toFixed(3)} ms (uma amostra, exploratória).`);
console.log(`Buscas aquecidas: p50 ${percentil(0.5).toFixed(3)} ms; p95 ${percentil(0.95).toFixed(3)} ms; média ${media.toFixed(3)} ms; ${duracoes.length} amostras.`);
console.log("Inclui matching e ordenação síncronos; não mede renderização/entrada web nem SQLite nativo. Não é gate de CI nem benchmark de release.");
