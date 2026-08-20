// Leitura de capítulo/versículo local pro web, sobre o mesmo
// `assets/biblia.json` já embutido no app — usada como caminho
// principal em `buscarReferencia` (ver BibliaAPI.ts), com a
// `bible-api.com` como fallback só se isto falhar. Antes, a leitura no
// web sempre dependia da API externa a cada capítulo aberto, apesar do
// texto inteiro já estar embutido no bundle (usado só pra popular o
// SQLite no nativo). Mesmo parsing de referência ("Livro N" ou
// "Livro N:V" ou "Livro N:V-V") já usado no caminho nativo desta mesma
// função, replicado aqui (não veio de um `import` do outro branch pra
// não acoplar os dois caminhos por um detalhe de regex).
import { livros } from "../content/livros";
import { carregarBibliaJson } from "./bibliaLocalWeb";
import { ErroBusca } from "./BibliaAPI";
import type { CapituloTexto } from "./tipos";

export async function buscarLocalWeb(ref: string): Promise<CapituloTexto> {
  const chave = ref.trim();
  const match = chave.match(/(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) throw new ErroBusca("invalido", `Referência inválida: ${chave}`);

  const nomeLivroRaw = match[1].trim();
  const capituloNum = parseInt(match[2], 10);
  const versiculoInicial = match[3] ? parseInt(match[3], 10) : 0;
  const versiculoFinal = match[4] ? parseInt(match[4], 10) : versiculoInicial;

  const chaveNormalizada = nomeLivroRaw.toLowerCase().replace(/[.\s]/g, "");
  const livroEncontrado = livros.find(
    (l) => l.nome.toLowerCase() === nomeLivroRaw.toLowerCase() || (l.abreviacao && l.abreviacao === chaveNormalizada)
  );
  if (!livroEncontrado || !livroEncontrado.abreviacao) {
    throw new ErroBusca("invalido", `Livro não encontrado para a referência: ${chave}`);
  }

  const bibliaJson = await carregarBibliaJson();
  const livroBiblia = bibliaJson.find((l) => l.abbrev === livroEncontrado.abreviacao);
  if (!livroBiblia) throw new ErroBusca("invalido", `Livro não encontrado na base local: ${chave}`);

  const capitulo = livroBiblia.chapters[capituloNum - 1];
  if (!capitulo) throw new ErroBusca("invalido", `Capítulo não encontrado: ${chave}`);

  const inicio = versiculoInicial > 0 ? versiculoInicial : 1;
  const fim = versiculoInicial > 0 ? versiculoFinal : capitulo.length;
  if (inicio < 1 || fim > capitulo.length || inicio > fim) {
    throw new ErroBusca("invalido", `Falha ao buscar ${chave}`);
  }

  const versiculos = [];
  for (let v = inicio; v <= fim; v++) {
    versiculos.push({ numero: v, texto: capitulo[v - 1] });
  }
  const texto = versiculos.map((v) => v.texto).join(" ");
  const sufixoRef = versiculoInicial > 0 ? (inicio === fim ? `${inicio}` : `${inicio}-${fim}`) : "";

  return {
    referencia: `${livroBiblia.name} ${capituloNum}${sufixoRef ? `:${sufixoRef}` : ""}`,
    texto,
    versiculos,
  };
}
