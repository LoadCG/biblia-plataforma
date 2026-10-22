const fs = require("fs");
const path = require("path");
const biblia = require("../assets/biblia.json");

const raiz = path.resolve(process.argv[2] || "dist");
const casos = [
  ["index.html", "Tem alguém que te ama.", null],
  ["conhecer/index.html", "Conhecer mais sobre esse amor", "LEITURAS POR ASSUNTO"],
  ["conhecer/jesus.html", "Quem é Jesus? | Tem alguém que te ama", "Uma vida que acolhe e ensina"],
  ["conhecer/biblia.html", "O que é a Bíblia? | Tem alguém que te ama", "Uma biblioteca de livros"],
  ["conhecer/salvacao.html", "A história da salvação | Tem alguém que te ama", "Criados para a vida com Deus"],
  ["conhecer/temas/habitos-e-impulsos.html", "Hábitos e impulsos | Tem alguém que te ama", "Sua história não cabe em um rótulo"],
  ["conhecer/temas/sexualidade-e-afetos.html", "Sexualidade e afetos | Tem alguém que te ama", "Pessoas têm dignidade"],
  ["conhecer/temas/relacionamentos-e-limites.html", "Relacionamentos e limites | Tem alguém que te ama", "O amor busca o bem do outro"],
  ["conhecer/temas/raiva-e-conflitos.html", "Raiva e conflitos | Tem alguém que te ama", "Uma pausa pode abrir espaço para ouvir"],
  ["conhecer/temas/valor-e-autoimagem.html", "Valor e autoimagem | Tem alguém que te ama", "Seu valor não depende de desempenho"],
  ["conhecer/temas/alcool-e-outras-drogas.html", "Álcool e outras drogas | Tem alguém que te ama", "Ninguém deve ser humilhado pelo uso de substâncias"],
  ["conhecer/temas/adiamento-e-recomeco.html", "Adiamento e recomeço | Tem alguém que te ama", "Nem todo adiamento tem a mesma causa"],
  ["conhecer/temas/ansiedade-e-preocupacao.html", "Ansiedade e preocupação | Tem alguém que te ama", "A Bíblia não manda esconder o que pesa"],
  ["conhecer/temas/rejeicao-e-pertencimento.html", "Rejeição e pertencimento | Tem alguém que te ama", "Ser recebido importa"],
  ["conhecer/temas/fe-duvidas-e-experiencias.html", "Fé e dúvidas | Tem alguém que te ama", "Perguntas fazem parte de muitas histórias de fé"],
  ["conhecer/temas/luto-e-perdas.html", "Luto e perdas | Tem alguém que te ama", "A dor pode ser nomeada"],
  ["conhecer/temas/medo-panico-e-sofrimento.html", "Medo e sofrimento emocional | Tem alguém que te ama", "O sofrimento merece ser levado a sério"],
  ["leitura/01-genesis/1.html", null, null],
  ["leitura/46-1-corintios/13.html", null, null],
  ["leitura/66-apocalipse/22.html", null, null],
  ["resumos/01-genesis.html", "Resumo de Gênesis — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["resumos/66-apocalipse.html", "Resumo de Apocalipse — Bíblia Plataforma", "Pano de Fundo Histórico"],
  ["planos/sabedoria-7.html", "Semana da Sabedoria — Bíblia Plataforma", "Semana da Sabedoria"],
];

for (const [arquivo, esperado, conteudo] of casos) {
  const destino = path.join(raiz, arquivo);
  if (!fs.existsSync(destino)) throw new Error(`Rota estática ausente: ${arquivo}`);
  const html = fs.readFileSync(destino, "utf8");
  if (!esperado) continue;
  const tituloComHelmet = `<title data-rh="true">${esperado}</title>`;
  if (!html.includes(tituloComHelmet) && !html.includes(`<title>${esperado}</title>`)) {
    throw new Error(`Título SEO ausente em ${arquivo}: ${esperado}`);
  }
  if (!html.includes('name="description"')) throw new Error(`Descrição SEO ausente em ${arquivo}.`);
  if ((html.match(/<title(?:\s[^>]*)?>/g) || []).length !== 1) {
    throw new Error(`Quantidade inválida de títulos em ${arquivo}.`);
  }
  if (conteudo && !html.includes(conteudo)) {
    throw new Error(`Conteúdo pré-renderizado ausente em ${arquivo}: ${conteudo}`);
  }
}

const caminhoFavicon = path.join(raiz, "favicon.ico");
if (!fs.existsSync(caminhoFavicon)) throw new Error("Favicon web ausente: favicon.ico.");
const favicon = fs.readFileSync(caminhoFavicon);
if (favicon.length < 6 || favicon.readUInt16LE(0) !== 0 || favicon.readUInt16LE(2) !== 1 || favicon.readUInt16LE(4) < 1) {
  throw new Error("Favicon web inválido: favicon.ico não contém um cabeçalho ICO válido.");
}
const htmlInicial = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
if (!htmlInicial.includes('rel="icon" href="/favicon.ico"')) {
  throw new Error("Referência ao favicon web ausente no HTML inicial.");
}

const totalCapitulos = biblia.reduce((soma, livro) => soma + livro.chapters.length, 0);
let capitulosGerados = 0;
for (let indiceLivro = 0; indiceLivro < biblia.length; indiceLivro++) {
  const livro = biblia[indiceLivro];
  const slug = `${String(indiceLivro + 1).padStart(2, "0")}-${livro.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  for (let capitulo = 1; capitulo <= livro.chapters.length; capitulo++) {
    const arquivo = path.join(raiz, "leitura", slug, `${capitulo}.html`);
    if (!fs.existsSync(arquivo)) throw new Error(`Rota estática de leitura ausente: leitura/${slug}/${capitulo}.html`);
    capitulosGerados++;
  }
}
if (capitulosGerados !== totalCapitulos) throw new Error(`Rotas de leitura incompletas: ${capitulosGerados}/${totalCapitulos}.`);

const quantidadeHtml = fs.readdirSync(raiz, { recursive: true })
  .filter((entrada) => typeof entrada === "string" && entrada.endsWith(".html"))
  .length;
if (quantidadeHtml < 70) {
  throw new Error(`Export incompleto: apenas ${quantidadeHtml} arquivos HTML encontrados.`);
}

console.log(`SEO e favicon: ${casos.length} rotas críticas e ${quantidadeHtml} arquivos HTML verificados; leitura estática: ${capitulosGerados} capítulos.`);
