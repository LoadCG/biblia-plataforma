import type { Nota, ReferenciaVersiculo } from "../types/leitura";

function ordenarReferencias(referencias: ReferenciaVersiculo[]): ReferenciaVersiculo[] {
  return [...referencias].sort((a, b) => a.livroSlug.localeCompare(b.livroSlug) || a.capitulo - b.capitulo || a.versiculo - b.versiculo);
}

function chaveReferencia(ref: ReferenciaVersiculo): string {
  return `${ref.livroSlug}:${ref.capitulo}:${ref.versiculo}`;
}

/** Anexa a lista completa do grupo a cada linha, sem eliminar as linhas por versículo. */
export function incluirReferenciasDoGrupo(notas: Nota[]): Nota[] {
  const referenciasPorGrupo = new Map<string, ReferenciaVersiculo[]>();
  for (const nota of notas) {
    if (!nota.grupoId) continue;
    const referencias = referenciasPorGrupo.get(nota.grupoId) ?? [];
    referencias.push({ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo });
    referenciasPorGrupo.set(nota.grupoId, referencias);
  }

  return notas.map((nota) => ({
    ...nota,
    referencias: nota.grupoId
      ? ordenarReferencias(referenciasPorGrupo.get(nota.grupoId) ?? [{ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo }])
      : [{ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo }],
  }));
}

/** A atividade mostra uma linha por anotação lógica; a leitura ainda recebe uma linha por versículo. */
export function consolidarNotas(notas: Nota[]): Nota[] {
  const comReferencias = incluirReferenciasDoGrupo(notas);
  const gruposVistos = new Set<string>();
  return comReferencias.filter((nota) => {
    if (!nota.grupoId) return true;
    if (gruposVistos.has(nota.grupoId)) return false;
    gruposVistos.add(nota.grupoId);
    return true;
  });
}

export function criarNotaDeGrupo(ownerId: string, grupoId: string | undefined, refs: ReferenciaVersiculo[], texto: string, agora: string): Nota {
  const ordenadas = ordenarReferencias(refs);
  const principal = ordenadas[0];
  if (!principal) throw new Error("Selecione pelo menos um versículo para anotar");
  return {
    ...principal,
    ownerId,
    ...(grupoId ? { grupoId } : {}),
    referencias: ordenadas,
    texto,
    criadoEm: agora,
    atualizadoEm: agora,
  };
}

export function chavesReferenciasUnicas(refs: ReferenciaVersiculo[]): ReferenciaVersiculo[] {
  const unicas = new Map<string, ReferenciaVersiculo>();
  for (const ref of refs) unicas.set(chaveReferencia(ref), ref);
  return [...unicas.values()];
}
