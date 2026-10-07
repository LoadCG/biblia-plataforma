export function normalizarBusca(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function tokenizarBusca(texto: string): string[] {
  return normalizarBusca(texto).split(/[^a-z0-9]+/).filter(Boolean);
}

/** Replica o contrato FTS: prefixos por palavra ou sequência contígua para frase entre aspas. */
export function correspondeConsultaBiblica(texto: string, consultaNormalizada: string, fraseExata: boolean): boolean {
  const palavrasTexto = tokenizarBusca(texto);
  const tokensConsulta = tokenizarBusca(consultaNormalizada);
  if (tokensConsulta.length === 0) return false;
  if (!fraseExata) return tokensConsulta.every((token) => palavrasTexto.some((palavra) => palavra.startsWith(token)));
  return palavrasTexto.some((_, inicio) => tokensConsulta.every((token, indice) => palavrasTexto[inicio + indice] === token));
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
