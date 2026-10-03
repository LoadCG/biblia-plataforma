const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const raiz = path.resolve(__dirname, "..");
const caminhoCatalogo = path.join(raiz, "core", "biblia", "temasBusca.ts");
const caminhoTipos = path.join(raiz, "core", "biblia", "tiposTema.ts");
const fonte = ts.createSourceFile(
  caminhoCatalogo,
  fs.readFileSync(caminhoCatalogo, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const fonteTipos = ts.createSourceFile(
  caminhoTipos,
  fs.readFileSync(caminhoTipos, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const livros = JSON.parse(fs.readFileSync(path.join(raiz, "core", "content", "dados", "livros.json"), "utf8"));
const biblia = JSON.parse(fs.readFileSync(path.join(raiz, "assets", "biblia.json"), "utf8"));
const conteudoRascunho = JSON.parse(fs.readFileSync(path.join(raiz, "docs", "revisao-editorial", "temas-descubra-ampliacao.json"), "utf8"));
const erros = [];

function nomePropriedade(no) {
  if (ts.isIdentifier(no) || ts.isStringLiteral(no)) return no.text;
  return null;
}

function obterDeclaracao(nome, arquivo = fonte) {
  for (const statement of arquivo.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === nome) return declaration;
    }
  }
  return null;
}

function desembrulharArray(no) {
  let atual = no;
  while (atual && (ts.isAsExpression(atual) || ts.isSatisfiesExpression(atual))) atual = atual.expression;
  return atual && ts.isArrayLiteralExpression(atual) ? atual.elements : [];
}

function obterCampo(objeto, nome) {
  if (!ts.isObjectLiteralExpression(objeto)) return null;
  const campo = objeto.properties.find((propriedade) =>
    ts.isPropertyAssignment(propriedade) && nomePropriedade(propriedade.name) === nome
  );
  return campo && ts.isPropertyAssignment(campo) ? campo.initializer : null;
}

function texto(no) {
  return no && (ts.isStringLiteral(no) || ts.isNoSubstitutionTemplateLiteral(no)) ? no.text : null;
}

function normalizar(valor) {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.\s]/g, "").toLowerCase();
}

function validarReferencia(idTema, referencia) {
  if (typeof referencia !== "string" || !referencia.trim()) {
    erros.push(`${idTema}: referência precisa ser texto.`);
    return;
  }
  const match = referencia.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) {
    erros.push(`${idTema}: referência deve informar capítulo e versículo (${referencia}).`);
    return;
  }

  const [, nomeLivro, capituloTexto, inicialTexto, finalTexto] = match;
  const livro = livros.find((item) =>
    normalizar(item.nome) === normalizar(nomeLivro) || normalizar(item.abreviacao ?? "") === normalizar(nomeLivro)
  );
  const capitulo = Number(capituloTexto);
  const inicial = Number(inicialTexto);
  const final = Number(finalTexto ?? inicialTexto);
  const livroBiblia = livro && biblia.find((item) => item.abbrev === livro.abreviacao);
  const versiculos = livroBiblia?.chapters?.[capitulo - 1];

  if (!livro || !Number.isInteger(capitulo) || !versiculos) {
    erros.push(`${idTema}: livro ou capítulo não existe na ACF (${referencia}).`);
    return;
  }
  if (!Number.isInteger(inicial) || !Number.isInteger(final) || inicial < 1 || final < inicial || final > versiculos.length) {
    erros.push(`${idTema}: faixa de versículos fora da ACF (${referencia}; capítulo com ${versiculos.length} versículos).`);
  }
}

if (fonte.parseDiagnostics.length || fonteTipos.parseDiagnostics.length) {
  throw new Error("Arquivos do catálogo ou dos tipos temáticos contêm erro de sintaxe.");
}

const idsDeclarados = desembrulharArray(obterDeclaracao("IDS_TEMAS", fonteTipos)?.initializer).map(texto);
const temas = desembrulharArray(obterDeclaracao("TEMAS_BUSCA")?.initializer);
if (idsDeclarados.length === 0 || temas.length === 0) {
  throw new Error("Não foi possível ler IDS_TEMAS ou TEMAS_BUSCA.");
}

const idsTemas = new Set();
const relacoesPorTema = new Map();
const referenciasPublicadasPorTema = new Map();
for (const tema of temas) {
  const id = texto(obterCampo(tema, "id"));
  const titulo = texto(obterCampo(tema, "titulo"));
  const descricao = texto(obterCampo(tema, "descricao"));
  const referencias = desembrulharArray(obterCampo(tema, "referencias")).map(texto);
  if (!id || !titulo?.trim() || !descricao?.trim()) {
    erros.push(`Tema sem id, título ou descrição: ${id ?? "entrada desconhecida"}.`);
    continue;
  }
  if (idsTemas.has(id)) erros.push(`ID de tema duplicado: ${id}.`);
  idsTemas.add(id);
  if (referencias.length < 4) erros.push(`${id}: são necessárias pelo menos quatro leituras.`);
  const relacionados = desembrulharArray(obterCampo(tema, "temasRelacionados")).map(texto);
  if (relacionados.length < 2 || relacionados.length > 3) {
    erros.push(`${id}: são necessários de dois a três temas relacionados.`);
  }
  if (new Set(relacionados).size !== relacionados.length) erros.push(`${id}: tema relacionado duplicado.`);
  if (relacionados.includes(id)) erros.push(`${id}: não pode relacionar o próprio tema.`);
  relacoesPorTema.set(id, relacionados);

  const referenciasNormalizadas = new Set();
  for (const referencia of referencias) {
    if (!referencia) continue;
    const chave = normalizar(referencia);
    if (referenciasNormalizadas.has(chave)) erros.push(`${id}: referência duplicada (${referencia}).`);
    referenciasNormalizadas.add(chave);
    validarReferencia(id, referencia);
  }
  referenciasPublicadasPorTema.set(id, new Set(referencias.filter(Boolean).map(normalizar)));
}

for (const id of idsDeclarados) {
  if (!id || !idsTemas.has(id)) erros.push(`ID declarado sem tema correspondente: ${id ?? "vazio"}.`);
}
for (const id of idsTemas) {
  if (!idsDeclarados.includes(id)) erros.push(`Tema sem ID declarado em IDS_TEMAS: ${id}.`);
  for (const relacionado of relacoesPorTema.get(id) ?? []) {
    if (!idsDeclarados.includes(relacionado)) erros.push(`${id}: tema relacionado inexistente (${relacionado}).`);
  }
}
if (idsTemas.size !== idsDeclarados.length) erros.push("IDS_TEMAS contém IDs duplicados ou cobertura divergente.");

if (conteudoRascunho.status !== "rascunho" || !Array.isArray(conteudoRascunho.temas)) {
  erros.push("O lote editorial de Descubra precisa permanecer como rascunho e conter uma lista de temas.");
}
const idsRascunho = new Set();
for (const tema of conteudoRascunho.temas ?? []) {
  const { id, versao, status, abertura, leiturasComplementares, perguntas, pratica, oracao } = tema;
  if (!idsTemas.has(id)) erros.push(`Conteúdo em revisão aponta para tema inexistente (${id ?? "sem id"}).`);
  if (idsRascunho.has(id)) erros.push(`Conteúdo em revisão duplicado para o tema ${id}.`);
  idsRascunho.add(id);
  if (!Number.isInteger(versao) || versao < 1) erros.push(`${id}: versão editorial inválida.`);
  if (status !== "rascunho") erros.push(`${id}: somente rascunhos são aceitos nesse lote não publicado.`);
  if (typeof abertura !== "string" || abertura.trim().length < 40) erros.push(`${id}: abertura editorial ausente ou curta demais.`);
  if (!Array.isArray(leiturasComplementares) || leiturasComplementares.length !== 4) {
    erros.push(`${id}: são necessárias quatro leituras complementares.`);
  }
  if (!Array.isArray(perguntas) || perguntas.length !== 2 || perguntas.some((pergunta) => typeof pergunta !== "string" || !pergunta.trim())) {
    erros.push(`${id}: são necessárias duas perguntas de reflexão.`);
  }
  if (typeof pratica !== "string" || !pratica.trim()) erros.push(`${id}: prática opcional ausente.`);
  if (typeof oracao !== "string" || !oracao.trim() || oracao.trim().split(/\s+/).length > 45) {
    erros.push(`${id}: oração ausente ou acima de 45 palavras.`);
  }

  const referencias = new Set(referenciasPublicadasPorTema.get(id) ?? []);
  for (const leitura of leiturasComplementares ?? []) {
    if (typeof leitura?.contexto !== "string" || leitura.contexto.trim().length < 20) {
      erros.push(`${id}: cada leitura complementar precisa de uma nota contextual.`);
    }
    const referencia = leitura?.referencia;
    if (typeof referencia === "string") {
      const chave = normalizar(referencia);
      if (referencias.has(chave)) erros.push(`${id}: leitura complementar duplicada (${referencia}).`);
      referencias.add(chave);
    }
    validarReferencia(id, referencia);
  }
}
for (const id of idsTemas) {
  if (!idsRascunho.has(id)) erros.push(`Conteúdo editorial em revisão ausente para ${id}.`);
}
if (fs.readFileSync(caminhoCatalogo, "utf8").includes("temas-descubra-ampliacao.json")) {
  erros.push("O catálogo em revisão não pode ser importado pela interface publicada.");
}

if (erros.length) {
  process.stderr.write(`Catálogo de Descubra inválido:\n${erros.map((erro) => `- ${erro}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  const totalReferencias = temas.reduce((total, tema) => total + desembrulharArray(obterCampo(tema, "referencias")).length, 0);
  const leiturasComplementares = conteudoRascunho.temas.reduce((total, tema) => total + tema.leiturasComplementares.length, 0);
  process.stdout.write(`Temas de Descubra verificados: ${temas.length} temas publicados (${totalReferencias} referências) e ${conteudoRascunho.temas.length} rascunhos (${leiturasComplementares} referências complementares) válidos na ACF local.\n`);
}
