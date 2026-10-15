const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const raiz = path.resolve(__dirname, "..");
const arquivoAvaliacao = path.join(raiz, "docs", "avaliacao-busca-editorial-v1.json");
const avaliacao = JSON.parse(fs.readFileSync(arquivoAvaliacao, "utf8"));

require.extensions[".ts"] = (modulo, arquivo) => {
  const fonte = fs.readFileSync(arquivo, "utf8");
  const compilado = ts.transpileModule(fonte, {
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

function prioridadeSemFrequencia(resultado) {
  if (resultado.camposCoincidentes.includes("titulo")) return resultado.score >= 1000 ? 1000 : 700;
  return resultado.camposCoincidentes.includes("conteudo") ? 300 : 220;
}

function ordenarSemFrequencia(resultados) {
  return [...resultados].sort((a, b) =>
    prioridadeSemFrequencia(b) - prioridadeSemFrequencia(a)
    || a.livro.numero - b.livro.numero
    || a.livro.slug.localeCompare(b.livro.slug)
  );
}

function contarAcertos(resultados, slugsEsperados) {
  const topCinco = new Set(resultados.slice(0, 5).map(({ livro }) => livro.slug));
  return slugsEsperados.filter((slug) => topCinco.has(slug)).length;
}

const totais = {
  atual: { centrais: 0, relevantes: 0, consultasComCentral: 0 },
  semFrequencia: { centrais: 0, relevantes: 0, consultasComCentral: 0 },
};
const linhas = [];
const centraisNaoRecuperados = [];

for (const item of avaliacao.consultas) {
  const resultados = buscarLivros(item.consulta);
  const semFrequencia = ordenarSemFrequencia(resultados);
  const centralAtual = contarAcertos(resultados, item.central);
  const centralBase = contarAcertos(semFrequencia, item.central);
  const relevantes = item.relevante ?? [];
  const relevanteAtual = contarAcertos(resultados, relevantes);
  const relevanteBase = contarAcertos(semFrequencia, relevantes);
  const resultadosAtuais = new Set(resultados.slice(0, 5).map(({ livro }) => livro.slug));
  const ausentes = item.central.filter((slug) => !resultadosAtuais.has(slug));
  if (ausentes.length) centraisNaoRecuperados.push(`${item.consulta}: ${ausentes.join(", ")}`);

  totais.atual.centrais += centralAtual;
  totais.atual.relevantes += relevanteAtual;
  totais.atual.consultasComCentral += centralAtual > 0 ? 1 : 0;
  totais.semFrequencia.centrais += centralBase;
  totais.semFrequencia.relevantes += relevanteBase;
  totais.semFrequencia.consultasComCentral += centralBase > 0 ? 1 : 0;

  const mudancaCentral = centralAtual - centralBase;
  if (mudancaCentral !== 0 || relevanteAtual !== relevanteBase) {
    linhas.push(`${item.consulta}: central ${centralBase}→${centralAtual}/${item.central.length}; relevantes ${relevanteBase}→${relevanteAtual}/${relevantes.length}`);
  }
}

const totalCentral = avaliacao.consultas.reduce((total, item) => total + item.central.length, 0);
const totalRelevante = avaliacao.consultas.reduce((total, item) => total + (item.relevante?.length ?? 0), 0);
const percentual = (parte, total) => total === 0 ? "n/a" : `${(parte / total * 100).toFixed(1)}%`;

console.log(`Avaliação ${avaliacao.versao} — ${avaliacao.consultas.length} consultas; rótulos ${avaliacao.statusDosRotulos}.`);
console.log("Métrica: recuperação@5 dos slugs rotulados; slugs sem rótulo não são classificados como irrelevantes.");
console.log(`Atual: centrais ${totais.atual.centrais}/${totalCentral} (${percentual(totais.atual.centrais, totalCentral)}); consultas com ao menos um central ${totais.atual.consultasComCentral}/${avaliacao.consultas.length}; relevantes ${totais.atual.relevantes}/${totalRelevante} (${percentual(totais.atual.relevantes, totalRelevante)}).`);
console.log(`Sem frequência (prioridade título/conteúdo/tema e desempate canônico): centrais ${totais.semFrequencia.centrais}/${totalCentral} (${percentual(totais.semFrequencia.centrais, totalCentral)}); consultas com ao menos um central ${totais.semFrequencia.consultasComCentral}/${avaliacao.consultas.length}; relevantes ${totais.semFrequencia.relevantes}/${totalRelevante} (${percentual(totais.semFrequencia.relevantes, totalRelevante)}).`);
console.log("Consultas em que a recuperação@5 mudou:");
console.log(linhas.length ? linhas.map((linha) => `- ${linha}`).join("\n") : "- Nenhuma");
console.log("Rótulos centrais não encontrados no top 5 atual (podem não existir na lista completa de resultados):");
console.log(centraisNaoRecuperados.length ? centraisNaoRecuperados.map((linha) => `- ${linha}`).join("\n") : "- Nenhum");
console.log("Use estes números como diagnóstico exploratório. Os rótulos são provisórios e não sustentam, sozinhos, uma decisão de relevância ou de produto.");
