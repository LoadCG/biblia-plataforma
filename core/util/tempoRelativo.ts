// Data relativa curta ("3d", "4sem", "2mês") pros cards de Salvo/Atividade.
export function tempoRelativo(dataISO: string): string {
  const diffMin = Math.max(0, Math.floor((Date.now() - new Date(dataISO).getTime()) / 60000));
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;

  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `${diffHoras}h`;

  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `${diffDias}d`;

  const diffSemanas = Math.floor(diffDias / 7);
  if (diffDias < 30) return `${diffSemanas}sem`;

  const diffMeses = Math.floor(diffDias / 30);
  if (diffDias < 365) return `${diffMeses}mês`;

  const diffAnos = Math.floor(diffDias / 365);
  return `${diffAnos}${diffAnos > 1 ? "anos" : "ano"}`;
}
