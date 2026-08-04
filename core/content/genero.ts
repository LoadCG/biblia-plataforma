// Classes do Tailwind precisam aparecer como texto literal em algum lugar
// do código para o NativeWind conseguir extraí-las — por isso aqui é um
// mapa de string fixa para string fixa, não uma interpolação
// (`genero-${slug}`), que o compilador não consegue detectar.
export const CORES_GENERO: Record<string, { bg: string; texto: string }> = {
  Lei: { bg: "bg-genero-lei-bg", texto: "text-genero-lei" },
  Histórico: { bg: "bg-genero-historico-bg", texto: "text-genero-historico" },
  Poético: { bg: "bg-genero-poetico-bg", texto: "text-genero-poetico" },
  Profético: { bg: "bg-genero-profetico-bg", texto: "text-genero-profetico" },
  Evangelho: { bg: "bg-genero-evangelho-bg", texto: "text-genero-evangelho" },
  Carta: { bg: "bg-genero-carta-bg", texto: "text-genero-carta" },
  Apocalíptico: { bg: "bg-genero-apocaliptico-bg", texto: "text-genero-apocaliptico" },
};

export function coresDoGenero(genero: string) {
  return CORES_GENERO[genero] ?? CORES_GENERO.Carta;
}
