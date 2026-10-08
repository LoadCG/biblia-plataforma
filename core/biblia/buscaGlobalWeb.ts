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
import type { OpcoesBuscaGlobal, ResultadoBuscaGlobal } from "./BibliaAPI";
import { livros } from "../content/livros";
import { correspondeConsultaBiblica, normalizarBusca, pontuarResultado } from "./relevanciaBusca";

type ItemIndice = {
  abbrev: string;
  nome: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  textoNormalizado: string;
};

const livroPorAbreviacao = new Map(livros.filter((livro) => livro.abreviacao).map((livro) => [livro.abreviacao!, livro]));

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
              textoNormalizado: normalizarBusca(texto),
            });
          }
        }
      }
      return indice;
    })();
  }
  return indicePromise;
}

export async function buscarGlobalWeb(termoBruto: string, opcoes: OpcoesBuscaGlobal = {}): Promise<ResultadoBuscaGlobal[]> {
  const termo = normalizarBusca(termoBruto).replace(/^"|"$/g, "");
  const fraseExata = termoBruto.trim().startsWith('"') && termoBruto.trim().endsWith('"');
  if (!termo) return [];

  const indice = await obterIndice();
  const resultados: ResultadoBuscaGlobal[] = [];
  for (const item of indice) {
    const livro = livroPorAbreviacao.get(item.abbrev);
    const corresponde = correspondeConsultaBiblica(item.textoNormalizado, termo, fraseExata);
    if ((!opcoes.livroSlug || livro?.slug === opcoes.livroSlug) && (!opcoes.testamento || livro?.testamento === opcoes.testamento) && corresponde) {
      resultados.push({
        livroSlug: item.abbrev,
        nomeLivro: item.nome,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        texto: item.texto,
        relevancia: pontuarResultado(item.texto, termoBruto),
      });
    }
  }
  resultados.sort((a, b) => (b.relevancia ?? 0) - (a.relevancia ?? 0)
    || (livroPorAbreviacao.get(a.livroSlug)?.numero ?? 0) - (livroPorAbreviacao.get(b.livroSlug)?.numero ?? 0)
    || a.capitulo - b.capitulo || a.versiculo - b.versiculo);
  const inicio = Math.max(0, Math.floor(opcoes.offset ?? 0));
  const limite = Math.max(0, Math.floor(opcoes.limite ?? 50));
  return resultados.slice(inicio, inicio + limite);
}
