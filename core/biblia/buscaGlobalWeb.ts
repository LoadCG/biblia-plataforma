// Busca full-text da Bíblia inteira, só pro web. No nativo, `buscarGlobal`
// usa a tabela virtual FTS5 do SQLite (ver core/db/database.ts); no web,
// `buscarGlobal` sempre devolvia `[]` — "fallback simples pra evitar
// crashes no SQLite WASM" — deixando a aba "Na Bíblia" da busca
// silenciosamente sem resultado nenhum, sempre, no app publicado (Vercel
// é web). Em vez de lidar com SQLite/WASM no navegador, faz uma busca
// simples em memória sobre o mesmo `assets/biblia.json` já embutido no
// app: carregado sob demanda (só quando alguém busca de verdade, via
// `import()` dinâmico — não polui o bundle inicial) e cacheado no módulo
// depois da primeira busca.
import { carregarBibliaJson } from "./bibliaLocalWeb";
import type { ResultadoBuscaGlobal } from "./BibliaAPI";

type ItemIndice = {
  abbrev: string;
  nome: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  textoNormalizado: string;
};

const LIMITE_RESULTADOS = 50;
const REGEX_DIACRITICOS = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(REGEX_DIACRITICOS, "").toLowerCase();
}

let indicePromise: Promise<ItemIndice[]> | null = null;

async function obterIndice(): Promise<ItemIndice[]> {
  if (!indicePromise) {
    indicePromise = (async () => {
      const bibliaJson = await carregarBibliaJson();
      const indice: ItemIndice[] = [];
      for (const livro of bibliaJson) {
        for (let cIndex = 0; cIndex < livro.chapters.length; cIndex++) {
          const versiculos = livro.chapters[cIndex];
          for (let vIndex = 0; vIndex < versiculos.length; vIndex++) {
            const texto = versiculos[vIndex];
            indice.push({
              abbrev: livro.abbrev,
              nome: livro.name,
              capitulo: cIndex + 1,
              versiculo: vIndex + 1,
              texto,
              textoNormalizado: normalizar(texto),
            });
          }
        }
      }
      return indice;
    })();
  }
  return indicePromise;
}

export async function buscarGlobalWeb(termoBruto: string): Promise<ResultadoBuscaGlobal[]> {
  const termo = normalizar(termoBruto.trim());
  if (!termo) return [];

  const indice = await obterIndice();
  const resultados: ResultadoBuscaGlobal[] = [];
  for (const item of indice) {
    if (item.textoNormalizado.includes(termo)) {
      resultados.push({
        livroSlug: item.abbrev,
        nomeLivro: item.nome,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        texto: item.texto,
      });
      if (resultados.length >= LIMITE_RESULTADOS) break;
    }
  }
  return resultados;
}
