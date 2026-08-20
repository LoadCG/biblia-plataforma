// Carregador único e cacheado do `assets/biblia.json` pro web —
// compartilhado entre `buscaGlobalWeb.ts` (busca full-text) e a leitura
// de capítulo local (`buscarLocalWeb` em `BibliaAPI.ts`), pra não
// carregar o JSON de ~4MB duas vezes se as duas funcionalidades forem
// usadas na mesma sessão. `import()` dinâmico: só carrega quando algo
// realmente precisa do texto bíblico local, não no bundle inicial.
export type LivroBiblia = { abbrev: string; name: string; chapters: string[][] };

let bibliaPromise: Promise<LivroBiblia[]> | null = null;

export async function carregarBibliaJson(): Promise<LivroBiblia[]> {
  if (!bibliaPromise) {
    bibliaPromise = import("../../assets/biblia.json").then(
      (modulo) => ((modulo as { default?: LivroBiblia[] }).default ?? (modulo as unknown as LivroBiblia[]))
    );
  }
  return bibliaPromise;
}
