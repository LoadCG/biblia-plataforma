// Lógica pura de faixa → mensagem, extraída pra função compartilhada
// porque a sequência de leitura aparece em dois lugares (card de
// destaque na Início, item "Perseverança" na aba Você — ver
// PLANO-NAVEGACAO.md) e não pode divergir com o tempo entre os dois.
export function mensagemStreak(sequencia: number): string {
  if (sequencia <= 0) return "Comece hoje a sua sequência de leitura.";
  if (sequencia === 1) return "Primeiro dia — volte amanhã pra continuar.";
  if (sequencia < 5) return "Você está pegando o ritmo.";
  if (sequencia < 15) return "Sequência forte!";
  return "Impressionante — siga assim.";
}
