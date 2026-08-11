import { livros } from "../content/livros";
import type { ReferenciaVersiculo } from "../types/leitura";

// Resolve uma referência no formato "Livro Capítulo:Versículo[-Versículo]"
// (ex.: "João 3:16", "Provérbios 3:5-6" — mesmo formato de
// REFERENCIAS_CURADAS em versiculoDoDia.ts) pro trio livroSlug/capitulo/
// versiculo que os repositórios (grifos, notas, salvos) esperam. Em
// referências com intervalo, usa sempre o primeiro versículo — mesmo
// padrão já usado na barra de seleção da leitura de capítulo.
export function parseReferenciaVersiculo(referencia: string): ReferenciaVersiculo | null {
  const match = referencia.match(/^(.+?)\s+(\d+):(\d+)/);
  if (!match) return null;
  const [, nomeLivro, capitulo, versiculo] = match;
  const livro = livros.find((l) => l.nome === nomeLivro);
  if (!livro) return null;
  return { livroSlug: livro.slug, capitulo: parseInt(capitulo, 10), versiculo: parseInt(versiculo, 10) };
}
