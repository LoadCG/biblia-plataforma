// Lista curada (não é gerada a partir do conteúdo) de versículos
// conhecidos, centrais para a fé cristã, apropriados para o público jovem
// do projeto — mesma lista usada no site antigo.
export const REFERENCIAS_CURADAS: string[] = [
  "João 3:16", "Salmos 23:1", "Provérbios 3:5-6", "Filipenses 4:13",
  "Romanos 8:28", "Isaías 41:10", "Josué 1:9", "Salmos 91:1-2",
  "Mateus 11:28", "Gálatas 2:20", "Efésios 2:8-9", "1 Coríntios 13:4-7",
  "Salmos 46:1", "Jeremias 29:11", "Hebreus 11:1", "Tiago 1:5",
  "1 Pedro 5:7", "2 Timóteo 1:7", "Salmos 121:1-2", "Mateus 6:33",
  "Romanos 12:2", "Filipenses 4:6-7", "Provérbios 16:3", "Salmos 27:1",
  "Isaías 40:31", "João 14:6", "Atos 1:8", "Colossenses 3:23",
  "1 João 4:19", "Salmos 34:8", "Mateus 28:19-20", "Romanos 10:9",
  "Efésios 6:10-11", "Salmos 37:4", "Provérbios 18:10", "João 8:32",
  "Filipenses 4:19", "Salmos 139:14", "2 Coríntios 5:17", "Gálatas 5:22-23",
];

// Mesmo versículo pra todo mundo no mesmo dia, calculado a partir da data
// local do dispositivo — sem precisar de servidor nem sorteio.
export function referenciaDoDia(data: Date = new Date()): string {
  const inicioDoAno = new Date(data.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((data.getTime() - inicioDoAno.getTime()) / 86400000);
  return REFERENCIAS_CURADAS[diaDoAno % REFERENCIAS_CURADAS.length];
}

export function referenciaAleatoria(diferenteDe?: string): string {
  if (REFERENCIAS_CURADAS.length <= 1) return REFERENCIAS_CURADAS[0];
  let escolhida = diferenteDe;
  while (!escolhida || escolhida === diferenteDe) {
    escolhida = REFERENCIAS_CURADAS[Math.floor(Math.random() * REFERENCIAS_CURADAS.length)];
  }
  return escolhida;
}
