import * as SQLite from "expo-sqlite";

// Abre o banco de dados
export const db = SQLite.openDatabaseSync("biblia-plataforma.db");

// Inicializa as tabelas necessárias
export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS grifos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      livroSlug TEXT NOT NULL,
      capitulo INTEGER NOT NULL,
      versiculo INTEGER NOT NULL,
      cor TEXT,
      criadoEm TEXT NOT NULL,
      UNIQUE(ownerId, livroSlug, capitulo, versiculo)
    );

    CREATE TABLE IF NOT EXISTS capitulos_lidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      livroSlug TEXT NOT NULL,
      capitulo INTEGER NOT NULL,
      lidoEm TEXT NOT NULL,
      UNIQUE(ownerId, livroSlug, capitulo)
    );

    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      livroSlug TEXT NOT NULL,
      capitulo INTEGER NOT NULL,
      versiculo INTEGER NOT NULL,
      texto TEXT NOT NULL,
      criadoEm TEXT NOT NULL,
      UNIQUE(ownerId, livroSlug, capitulo, versiculo)
    );

    CREATE TABLE IF NOT EXISTS livros_lidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      livroSlug TEXT NOT NULL,
      lidoEm TEXT NOT NULL,
      UNIQUE(ownerId, livroSlug)
    );

    CREATE TABLE IF NOT EXISTS pesquisas_favoritas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      termo TEXT NOT NULL,
      favoritaEm TEXT NOT NULL,
      UNIQUE(ownerId, termo)
    );

    CREATE TABLE IF NOT EXISTS versiculos_salvos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      livroSlug TEXT NOT NULL,
      capitulo INTEGER NOT NULL,
      versiculo INTEGER NOT NULL,
      salvoEm TEXT NOT NULL,
      UNIQUE(ownerId, livroSlug, capitulo, versiculo)
    );

    CREATE TABLE IF NOT EXISTS progresso_planos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId TEXT NOT NULL,
      planoId TEXT NOT NULL,
      diaConcluido INTEGER NOT NULL,
      concluidoEm TEXT NOT NULL,
      UNIQUE(ownerId, planoId, diaConcluido)
    );

    CREATE TABLE IF NOT EXISTS perfil (
      ownerId TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      avatarUri TEXT
    );

    CREATE TABLE IF NOT EXISTS biblia_text (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      livroSlug TEXT NOT NULL,
      nomeLivro TEXT NOT NULL,
      capitulo INTEGER NOT NULL,
      versiculo INTEGER NOT NULL,
      texto TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS biblia_fts USING fts5(
      livroSlug,
      nomeLivro,
      capitulo UNINDEXED,
      versiculo UNINDEXED,
      texto,
      content='biblia_text',
      content_rowid='id'
    );
  `);
}

try {
  initDB();
} catch (e) {
  console.error("Erro ao inicializar o banco de dados:", e);
}

// 150 linhas × 5 colunas = 750 parâmetros por INSERT — dentro do limite
// conservador mais antigo do SQLite (999 parâmetros via
// SQLITE_LIMIT_VARIABLE_NUMBER; builds mais novos permitem 32766, mas
// não dá pra assumir isso em todo dispositivo/versão do expo-sqlite).
const TAMANHO_LOTE = 150;

// Função para popular a base de dados com a Bíblia JSON se estiver vazia
//
// Bug real encontrado (relatado por usuário: "só dá pra ler Gênesis"):
// a versão anterior inseria os ~31 mil versículos um por um (dois
// INSERTs awaited por versículo — mais de 60 mil idas e vindas ao
// SQLite numa única transação), e considerava a base "já populada" se
// existisse QUALQUER registro. Gênesis é o primeiro livro do JSON — se
// o app fosse fechado, travasse ou ficasse sem memória no meio dessa
// população (bem provável, dado o volume de operações sequenciais),
// só Gênesis chegava a existir, e a checagem seguinte não detectava a
// população incompleta, travando o app nesse estado pra sempre.
// Corrigido em duas frentes: (1) checa a contagem contra o total real
// de versículos do JSON, não só ">0" — população incompleta é limpa e
// refeita do zero; (2) insere em lotes de `TAMANHO_LOTE` linhas por
// `INSERT` (poucas dezenas de idas ao banco em vez de dezenas de
// milhares), e sincroniza o índice FTS5 de uma vez ao final via
// `INSERT INTO biblia_fts(biblia_fts) VALUES ('rebuild')` — o padrão
// recomendado pra tabelas FTS5 de "external content", bem mais rápido
// que inserir linha a linha casando o rowid manualmente.
export async function garantirBaseBiblia() {
  // O JSON tem ~4MB, então podemos carregar via require no bundle
  const bibliaJson = require("../../assets/biblia.json");

  let totalEsperado = 0;
  for (const livro of bibliaJson) {
    for (const capitulo of livro.chapters) totalEsperado += capitulo.length;
  }

  const contagem = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) as c FROM biblia_text`);
  if (contagem && contagem.c >= totalEsperado) return; // Já populada de verdade

  if (contagem && contagem.c > 0) {
    console.warn(`Base bíblica incompleta detectada (${contagem.c}/${totalEsperado} versículos) — repopulando do zero.`);
    await db.execAsync(`DELETE FROM biblia_text; DELETE FROM biblia_fts;`);
  }

  console.log("Populando banco de dados com a Bíblia offline... (Isto pode levar alguns segundos na primeira vez)");

  type Linha = [string, string, number, number, string];
  let lote: Linha[] = [];

  async function inserirLote() {
    if (lote.length === 0) return;
    const placeholders = lote.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const params = lote.flat();
    await db.runAsync(
      `INSERT INTO biblia_text (livroSlug, nomeLivro, capitulo, versiculo, texto) VALUES ${placeholders}`,
      params
    );
    lote = [];
  }

  await db.withTransactionAsync(async () => {
    for (const livro of bibliaJson) {
      const livroSlug = livro.abbrev;
      const nomeLivro = livro.name;

      for (let cIndex = 0; cIndex < livro.chapters.length; cIndex++) {
        const capitulo = cIndex + 1;
        const versiculos = livro.chapters[cIndex];

        for (let vIndex = 0; vIndex < versiculos.length; vIndex++) {
          lote.push([livroSlug, nomeLivro, capitulo, vIndex + 1, versiculos[vIndex]]);
          if (lote.length >= TAMANHO_LOTE) await inserirLote();
        }
      }
    }
    await inserirLote();
    await db.runAsync(`INSERT INTO biblia_fts(biblia_fts) VALUES ('rebuild')`);
  });
  console.log("Bíblia offline populada com sucesso!");
}
