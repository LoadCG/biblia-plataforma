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

function extrairCampo(texto, rotulo) {
  const inicio = texto.indexOf(`**${rotulo}:**`);
  if (inicio < 0) return null;
  const restante = texto.slice(inicio + rotulo.length + 5);
  const proximosCampos = restante.search(/\r?\n\r?\n\*\*(?:Leituras|Reflexão|Pergunta):\*\*/);
  const proximaSecao = restante.search(/\r?\n\r?\n##/);
  const limites = [proximosCampos, proximaSecao].filter((indice) => indice >= 0);
  const fim = limites.length > 0 ? Math.min(...limites) : restante.length;
  return restante.slice(0, fim).trim().replace(/\s+/g, " ");
}

function validarDocumentoPublicado(definicao, planoPorId) {
  const caminho = path.join(raiz, "docs", "planos-publicados", definicao.arquivo);
  const texto = fs.readFileSync(caminho, "utf8");
  const plano = planoPorId.get(definicao.id);
  const chunks = texto.split(/(?=^#{2,3} Dia \d+ — )/m).filter((bloco) => /^#{2,3} Dia \d+ — /m.test(bloco));
  const statusPublicado = /\*\*Status:\*\*[^\n]*publicado[^\n]*exceção/i.test(texto);
  const revisaoTransparente = /\*\*Revisores humanos:\*\*[^\n]*nenhuma revisão independente registrada/i.test(texto);

  if (!plano) {
    erros.push(`${definicao.arquivo}: plano ${definicao.id} não está no catálogo.`);
    return;
  }
  if (!statusPublicado || !revisaoTransparente) {
    erros.push(`${definicao.arquivo}: exceção editorial e ausência de revisão independente devem estar registradas.`);
  }
  if (!texto.includes(`**ID do catálogo:** \`${plano.id}\``)) erros.push(`${definicao.arquivo}: ID do catálogo diverge.`);
  if (!texto.includes(`**Título publicado:** ${plano.titulo}`)) erros.push(`${definicao.arquivo}: título publicado diverge.`);
  if (chunks.length !== definicao.sessoes || plano.dias.length !== definicao.sessoes) {
    erros.push(`${definicao.arquivo}: quantidade de sessões não corresponde a ${definicao.sessoes}.`);
  }

  chunks.forEach((bloco, indice) => {
    const header = bloco.match(/^#{2,3} Dia (\d+) — (.+)$/m);
    const dia = plano.dias[indice];
    if (!header || !dia || Number(header[1]) !== dia.dia || header[2].trim() !== dia.titulo) {
      erros.push(`${definicao.arquivo}: título ou sequência da sessão ${indice + 1} diverge do catálogo.`);
    }
    const referenciasTexto = extrairCampo(bloco, "Leituras");
    const reflexao = extrairCampo(bloco, "Reflexão");
    const pergunta = extrairCampo(bloco, "Pergunta");
    if (!dia) return;
    const referencias = referenciasTexto ? referenciasTexto.split(";").map((referencia) => referencia.trim()) : [];
    if (referencias.some((referencia) => !referencia)) {
      erros.push(`${definicao.arquivo}, sessão ${indice + 1}: referência vazia.`);
      return;
    }
    if (JSON.stringify(referencias) !== JSON.stringify(dia.referencias)) erros.push(`${definicao.arquivo}, sessão ${indice + 1}: referências divergem do catálogo.`);
    if (reflexao !== dia.reflexao) erros.push(`${definicao.arquivo}, sessão ${indice + 1}: reflexão diverge do catálogo.`);
    if (pergunta !== dia.pergunta) erros.push(`${definicao.arquivo}, sessão ${indice + 1}: pergunta diverge do catálogo.`);
    referencias.forEach((referencia) => validarReferencia(referencia, `${definicao.arquivo}, sessão ${indice + 1}`));
  });

}

const planos = carregarJson("core/content/dados/planos.json");
planos.forEach(validarPlanoPublicado);

const planosPorId = new Map(planos.map((plano) => [plano.id, plano]));
const documentosPublicados = [
  { arquivo: "plano-primeiros-passos-7-dias.md", id: "primeiros-passos-7", sessoes: 7 },
  { arquivo: "plano-justica-cuidado-esperanca-14-dias.md", id: "justica-cuidado-esperanca-14", sessoes: 14 },
  { arquivo: "plano-formacao-30-dias.md", id: "formacao-30", sessoes: 30 },
];
documentosPublicados.forEach((definicao) => validarDocumentoPublicado(definicao, planosPorId));

if (erros.length > 0) {
  console.error(erros.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Planos verificados: ${planos.length} no catálogo; ${documentosPublicados.length} fontes publicadas sincronizadas; intervalos conferidos contra a ACF.`);
}
