export function normalizarBusca(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function pontuarResultado(textoOriginal: string, consultaOriginal: string): number {
  const texto = normalizarBusca(textoOriginal);
  const consulta = normalizarBusca(consultaOriginal).replace(/^"|"$/g, "");
  if (!consulta) return 0;
  let pontos = 0;
  const ocorrencias = texto.split(consulta).length - 1;
  if (ocorrencias > 0) pontos += 100 + ocorrencias * 10;
  const tokens = consulta.split(" ").filter(Boolean);
  const encontrados = tokens.filter((token) => texto.includes(token)).length;
  pontos += encontrados * 15;
  if (encontrados === tokens.length) pontos += 30;
  if (texto.startsWith(consulta)) pontos += 20;
  return pontos;
}
