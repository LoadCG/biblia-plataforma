export const IDS_TEMAS = [
  "amor",
  "cura",
  "ansiedade",
  "raiva",
  "alegria",
  "perdao",
  "esperanca",
  "sabedoria",
] as const;

export type IdTema = (typeof IDS_TEMAS)[number];
