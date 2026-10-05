const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const carregarJson = (caminho) => JSON.parse(fs.readFileSync(path.join(raiz, caminho), "utf8"));
const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const livros = carregarJson("core/content/dados/livros.json");
const biblia = carregarJson("assets/biblia.json");
const capitulosPorLivro = new Map(livros.map((livro) => [normalizar(livro.nome), livro.capitulos]));
const versiculosPorLivro = new Map(biblia.map((livro) => [normalizar(livro.name), livro.chapters]));
const erros = [];

function validarReferencia(referencia, contexto) {
  const match = referencia.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) {
    erros.push(`${contexto}: referência inválida (${referencia}).`);
    return;
  }

  const [, nomeLivro, capituloTexto, inicioTexto, fimTexto] = match;
  const capituloNumero = Number(capituloTexto);
  const nomeNormalizado = normalizar(nomeLivro);
  const quantidadeCapitulos = capitulosPorLivro.get(nomeNormalizado);
  const capitulosBiblia = versiculosPorLivro.get(nomeNormalizado);

  if (!quantidadeCapitulos || !capitulosBiblia || capituloNumero < 1 || capituloNumero > quantidadeCapitulos) {
    erros.push(`${contexto}: livro ou capítulo inexistente (${referencia}).`);
    return;
  }

  const quantidadeVersiculos = capitulosBiblia[capituloNumero - 1]?.length;
  if (!quantidadeVersiculos) {
    erros.push(`${contexto}: capítulo sem contagem de versículos na ACF (${referencia}).`);
    return;
  }

  if (inicioTexto) {
    const inicio = Number(inicioTexto);
    const fim = Number(fimTexto || inicioTexto);
    if (inicio < 1 || fim < inicio || fim > quantidadeVersiculos) {
      erros.push(`${contexto}: intervalo inválido; capítulo tem ${quantidadeVersiculos} versículos (${referencia}).`);
    }
  }
}

function validarPlanoPublicado(plano) {
  if (!Number.isInteger(plano.duracaoDias) || !Array.isArray(plano.dias) || plano.dias.length !== plano.duracaoDias) {
    erros.push(`${plano.id}: duração inconsistente.`);
    return;
  }

  const dias = new Set(plano.dias.map((dia) => dia.dia));
  for (let dia = 1; dia <= plano.duracaoDias; dia++) {
    if (!dias.has(dia)) erros.push(`${plano.id}: falta o dia ${dia}.`);
  }

  for (const dia of plano.dias) {
    if (!Array.isArray(dia.referencias) || dia.referencias.length === 0) {
      erros.push(`${plano.id}, dia ${dia.dia}: nenhuma referência informada.`);
      continue;
    }
    for (const referencia of dia.referencias) validarReferencia(referencia, `${plano.id}, dia ${dia.dia}`);
  }
}

function validarRascunho(nomeArquivo, sessoesEsperadas) {
  const caminho = path.join(raiz, "docs", "revisao-editorial", nomeArquivo);
  const texto = fs.readFileSync(caminho, "utf8");
  const linhas = texto.split(/\r?\n/);
  const leituras = linhas.filter((linha) => linha.startsWith("**Leituras:**"));
  const statusPendente = /\*\*Status:\*\*[^\n]*(rascunho|proposta)/i.test(texto)
    && /\*\*Revisores humanos:\*\*[^\n]*pendentes?/i.test(texto);

  if (leituras.length !== sessoesEsperadas) {
    erros.push(`${nomeArquivo}: esperadas ${sessoesEsperadas} sessões com leituras; encontradas ${leituras.length}.`);
  }
  if (!statusPendente) erros.push(`${nomeArquivo}: rascunho deve permanecer explicitamente pendente de revisão humana.`);

  leituras.forEach((linha, indice) => {
    const referencias = linha.replace("**Leituras:**", "").trim().split(";").map((referencia) => referencia.trim());
    if (referencias.some((referencia) => !referencia)) {
      erros.push(`${nomeArquivo}, sessão ${indice + 1}: referência vazia.`);
      return;
    }
    referencias.forEach((referencia) => validarReferencia(referencia, `${nomeArquivo}, sessão ${indice + 1}`));
  });

  return leituras.length;
}

const planos = carregarJson("core/content/dados/planos.json");
planos.forEach(validarPlanoPublicado);

const rascunhos = [
  { arquivo: "plano-primeiros-passos-7-dias.md", sessoes: 7 },
  { arquivo: "plano-justica-cuidado-esperanca-14-dias.md", sessoes: 14 },
  { arquivo: "plano-formacao-30-dias.md", sessoes: 30 },
];
rascunhos.forEach(({ arquivo, sessoes }) => validarRascunho(arquivo, sessoes));

if (erros.length > 0) {
  console.error(erros.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Planos verificados: ${planos.length} publicados e ${rascunhos.length} rascunhos; intervalos conferidos contra a ACF.`);
}
