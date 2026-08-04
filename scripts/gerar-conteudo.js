// Lê os 66 resumos em resumos-biblicos/*.md e gera
// core/content/dados/livros.json — dados estruturados que o app consome
// (core/content/livros.ts). Reaproveita a mesma lógica de parsing do
// projeto antigo (Resumo-dos-66-Livros-da-Biblia/scripts/gerar-site.js),
// adaptada para produzir dados em vez de HTML.
//
// Rodar: node scripts/gerar-conteudo.js
// (ou `npm run gerar-conteudo`)

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIRS = [
  { dir: path.join(REPO_ROOT, "resumos-biblicos", "antigo-testamento"), testamento: "Antigo Testamento" },
  { dir: path.join(REPO_ROOT, "resumos-biblicos", "novo-testamento"), testamento: "Novo Testamento" },
];
const OUT_FILE = path.join(REPO_ROOT, "core", "content", "dados", "livros.json");

// Mesma tabela do projeto antigo (dado fixo e conhecido, não muda).
const CAPITULOS_POR_LIVRO = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9,
  1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1,
  22,
];

function generoDoLivro(numero) {
  if (numero <= 5) return "Lei";
  if (numero <= 17) return "Histórico";
  if (numero <= 22) return "Poético";
  if (numero <= 39) return "Profético";
  if (numero <= 43) return "Evangelho";
  if (numero === 44) return "Histórico";
  if (numero <= 65) return "Carta";
  return "Apocalíptico";
}

const SECTION_KEYS = [
  "fichaRapida",
  "panoDeFundo",
  "linhaDoTempo",
  "autorProposito",
  "resumoConteudo",
  "curiosidades",
  "porQueImporta",
];

const SECTION_TITULOS = {
  panoDeFundo: "Pano de Fundo Histórico",
  linhaDoTempo: "Linha do Tempo e Cronologia",
  autorProposito: "Autor e Propósito",
  resumoConteudo: "Resumo do Conteúdo",
  curiosidades: "Curiosidades e Conexões",
  porQueImporta: "Por Que Isso Importa Hoje",
};

function contarPalavras(texto) {
  const matches = texto.replace(/[#*_>-]/g, " ").trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

// Remove marcação markdown simples (negrito, links) mantendo o texto.
function textoLimpo(md) {
  return md
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .trim();
}

function paragrafos(corpo) {
  return corpo
    .split(/\n{2,}/)
    .map((p) => textoLimpo(p.replace(/\n/g, " ")).trim())
    .filter(Boolean);
}

function itensLista(corpo) {
  return corpo
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha.startsWith("- "))
    .map((linha) => textoLimpo(linha.slice(2)));
}

function parseFichaRapida(corpo) {
  const campos = [];
  corpo
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .forEach((linha) => {
      const match = linha.match(/^- \*\*(.+?):\*\*\s*(.+)$/);
      if (!match) return;
      campos.push({ rotulo: match[1].trim(), valor: textoLimpo(match[2]) });
    });
  return campos;
}

function parseBook(filePath, testamento, capitulos) {
  const raw = fs.readFileSync(filePath, "utf8");

  const titleMatch = raw.match(/^# (.+?) — Livro (\d+) de 66\s*$/m);
  if (!titleMatch) throw new Error(`Título não encontrado em ${filePath}`);
  const nome = titleMatch[1].trim();
  const numero = parseInt(titleMatch[2], 10);

  const firstSectionIndex = raw.indexOf("\n## ");
  const sectionsRaw = raw
    .slice(firstSectionIndex + 1)
    .split(/\n(?=## )/)
    .map((chunk) => chunk.trim());

  if (sectionsRaw.length !== SECTION_KEYS.length) {
    throw new Error(`Esperava ${SECTION_KEYS.length} seções em ${filePath}, encontrei ${sectionsRaw.length}`);
  }

  const sections = {};
  sectionsRaw.forEach((chunk, i) => {
    const newlineIndex = chunk.indexOf("\n");
    const body = newlineIndex === -1 ? "" : chunk.slice(newlineIndex + 1);
    sections[SECTION_KEYS[i]] = body;
  });

  const slug = path.basename(filePath, ".md");
  const totalPalavras = SECTION_KEYS.filter((k) => k !== "fichaRapida").reduce(
    (soma, chave) => soma + contarPalavras(sections[chave]),
    0
  );
  const tempoLeituraMin = Math.max(1, Math.round(totalPalavras / 200));

  const secoes = SECTION_KEYS.filter((k) => k !== "fichaRapida").map((chave) => ({
    id: chave,
    titulo: SECTION_TITULOS[chave],
    lista: chave === "curiosidades",
    paragrafos: chave === "curiosidades" ? [] : paragrafos(sections[chave]),
    itens: chave === "curiosidades" ? itensLista(sections[chave]) : [],
  }));

  return {
    slug,
    numero,
    nome,
    testamento,
    genero: generoDoLivro(numero),
    capitulos,
    tempoLeituraMin,
    fichaRapida: parseFichaRapida(sections.fichaRapida),
    secoes,
  };
}

function main() {
  const livros = [];
  for (const { dir, testamento } of CONTENT_DIRS) {
    const arquivos = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .sort();
    for (const arquivo of arquivos) {
      const livro = parseBook(path.join(dir, arquivo), testamento, 0);
      livros.push(livro);
    }
  }

  livros.sort((a, b) => a.numero - b.numero);
  if (livros.length !== 66) throw new Error(`Esperava 66 livros, encontrei ${livros.length}`);

  livros.forEach((livro, i) => {
    livro.capitulos = CAPITULOS_POR_LIVRO[i];
  });

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(livros), "utf8");
  console.log(`Gerado: core/content/dados/livros.json (${livros.length} livros)`);
}

main();
