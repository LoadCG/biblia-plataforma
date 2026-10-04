import { obterLivro } from "../content/livros";
import type { ReferenciaVersiculo } from "../types/leitura";

function formatarNumeros(numeros: number[]): string {
  const ordenados = [...new Set(numeros)].sort((a, b) => a - b);
  const partes: string[] = [];
  let inicio = ordenados[0];
  let anterior = inicio;

  for (let indice = 1; indice <= ordenados.length; indice++) {
    const atual = ordenados[indice];
    if (atual === anterior + 1) {
      anterior = atual;
      continue;
    }
    partes.push(inicio === anterior ? `${inicio}` : `${inicio}–${anterior}`);
    inicio = atual;
    anterior = atual;
  }
  return partes.join(", ");
}

export function formatarReferenciaVersiculos(referencias: ReferenciaVersiculo[]): string {
  const grupos = new Map<string, ReferenciaVersiculo[]>();
  const ordenadas = [...referencias].sort((a, b) => a.livroSlug.localeCompare(b.livroSlug) || a.capitulo - b.capitulo || a.versiculo - b.versiculo);
  for (const referencia of ordenadas) {
    const chave = `${referencia.livroSlug}:${referencia.capitulo}`;
    const grupo = grupos.get(chave) ?? [];
    grupo.push(referencia);
    grupos.set(chave, grupo);
  }

  return [...grupos.values()]
    .map((grupo) => {
      const primeira = grupo[0];
      const nomeLivro = obterLivro(primeira.livroSlug)?.nome ?? primeira.livroSlug;
      return `${nomeLivro} ${primeira.capitulo}:${formatarNumeros(grupo.map((ref) => ref.versiculo))}`;
    })
    .join("; ");
}
