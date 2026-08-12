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

// Explicações curtas por gênero literário, pro Tooltip do selo
// colorido (ver components/Tooltip.tsx) — tom simples, pro público
// jovem/adolescente do projeto (mesma diretriz de conteúdo do resto
// do app), sem entrar em debate acadêmico de classificação.
export const DESCRICAO_GENERO: Record<string, string> = {
  Lei: "Os 5 primeiros livros da Bíblia (o Pentateuco) — contam a criação, as origens do povo de Israel e as leis dadas por Deus.",
  Histórico: "Narra fatos e acontecimentos reais da história do povo de Israel, como conquistas, reinados e reconstruções.",
  Poético: "Escrito em forma de poesia — louvor, lamento, sabedoria e reflexão, cheio de imagens e sentimento.",
  Profético: "Mensagens de profetas enviados por Deus, com avisos, correções e promessas para o povo.",
  Evangelho: "Conta a vida, os ensinamentos, a morte e a ressurreição de Jesus, cada um sob uma perspectiva.",
  Carta: "Cartas (epístolas) escritas pelos apóstolos para orientar e encorajar as primeiras igrejas cristãs.",
  Apocalíptico: "Usa visões e símbolos para revelar o plano de Deus, especialmente sobre o fim dos tempos.",
};

export function descricaoDoGenero(genero: string): string {
  return DESCRICAO_GENERO[genero] ?? "";
}
