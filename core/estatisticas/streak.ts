// Sequência de dias lendo, calculada a partir das datas em que algum
// capítulo foi marcado como lido (ProgressoRepository, não o "livro
// lido" dos resumos). Decisão de tom, de propósito: não é gamificação
// barulhenta — sem emoji de fogo, sem aviso de "não quebre a sequência",
// sem cor vermelha se parar. É só um reconhecimento discreto de hábito,
// alinhado ao tom do resto do projeto.
export function calcularSequenciaAtual(datasISO: string[]): number {
  const dias = new Set(datasISO.map((iso) => new Date(iso).toDateString()));
  if (dias.size === 0) return 0;

  let sequencia = 0;
  const cursor = new Date();

  // Se ainda não leu nada hoje, a sequência continua "viva" contando a
  // partir de ontem — só quebra de verdade quando passa um dia inteiro
  // sem nenhuma leitura.
  if (!dias.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dias.has(cursor.toDateString())) {
    sequencia++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return sequencia;
}
