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

// Função para popular a base de dados com a Bíblia JSON se estiver vazia
export async function garantirBaseBiblia() {
  const contagem = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) as c FROM biblia_text`);
  if (contagem && contagem.c > 0) return; // Já populada

  console.log("Populando banco de dados com a Bíblia offline... (Isto pode levar alguns segundos na primeira vez)");
  
  // O JSON tem 3.8MB, então podemos carregar via require no bundle
  const bibliaJson = require('../../assets/biblia.json');
  
  await db.withTransactionAsync(async () => {
    for (const livro of bibliaJson) {
      const livroSlug = livro.abbrev;
      const nomeLivro = livro.name;
      
      for (let cIndex = 0; cIndex < livro.chapters.length; cIndex++) {
        const capitulo = cIndex + 1;
        const versiculos = livro.chapters[cIndex];
        
        for (let vIndex = 0; vIndex < versiculos.length; vIndex++) {
          const versiculo = vIndex + 1;
          const texto = versiculos[vIndex];
          
          await db.runAsync(
            `INSERT INTO biblia_text (livroSlug, nomeLivro, capitulo, versiculo, texto) VALUES (?, ?, ?, ?, ?)`,
            [livroSlug, nomeLivro, capitulo, versiculo, texto]
          );
          await db.runAsync(
            `INSERT INTO biblia_fts (rowid, livroSlug, nomeLivro, capitulo, versiculo, texto) VALUES (last_insert_rowid(), ?, ?, ?, ?, ?)`,
            [livroSlug, nomeLivro, capitulo, versiculo, texto]
          );
        }
      }
    }
  });
  console.log("Bíblia offline populada com sucesso!");
}
