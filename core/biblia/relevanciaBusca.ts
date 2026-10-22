export function normalizarBusca(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function tokenizarBusca(texto: string): string[] {
  return normalizarBusca(texto).split(/[^a-z0-9]+/).filter(Boolean);
}

export type IntervaloCorrespondenciaBusca = { inicio: number; fim: number };

/** Localiza as palavras que realmente satisfazem a consulta sem perder offsets do texto original. */
export function encontrarIntervalosCorrespondenciaBiblica(
  textoOriginal: string,
  consultaOriginal: string
): IntervaloCorrespondenciaBusca[] {
  const consultaLimpa = consultaOriginal.trim();
  const fraseExata = consultaLimpa.startsWith('"') && consultaLimpa.endsWith('"');
  const tokensConsulta = tokenizarBusca(consultaLimpa.replace(/^"|"$/g, ""));
  if (tokensConsulta.length === 0) return [];

  let textoNormalizado = "";
  const iniciosOriginais: number[] = [];
  const finsOriginais: number[] = [];
  let indiceOriginal = 0;
  for (const caractere of textoOriginal) {
    const fimOriginal = indiceOriginal + caractere.length;
    const normalizado = caractere.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (normalizado.length === 0 && iniciosOriginais.length > 0) {
      finsOriginais[finsOriginais.length - 1] = fimOriginal;
    }
    for (let indice = 0; indice < normalizado.length; indice += 1) {
      const parte = normalizado[indice];
      if (/\s/.test(parte)) {
        if (!textoNormalizado || textoNormalizado.endsWith(" ")) continue;
        textoNormalizado += " ";
      } else {
        textoNormalizado += parte;
      }
      iniciosOriginais.push(indiceOriginal);
      finsOriginais.push(fimOriginal);
    }
    indiceOriginal = fimOriginal;
  }
  if (textoNormalizado.endsWith(" ")) {
    textoNormalizado = textoNormalizado.slice(0, -1);
    iniciosOriginais.pop();
    finsOriginais.pop();
  }

  const palavras: Array<{ valor: string; inicio: number; fim: number }> = [];
  const expressaoPalavra = /[a-z0-9]+/g;
  let correspondencia: RegExpExecArray | null;
  while ((correspondencia = expressaoPalavra.exec(textoNormalizado)) !== null) {
    const inicioNormalizado = correspondencia.index;
    const fimNormalizado = inicioNormalizado + correspondencia[0].length - 1;
    palavras.push({
      valor: correspondencia[0],
      inicio: iniciosOriginais[inicioNormalizado],
      fim: finsOriginais[fimNormalizado],
    });
  }

  const intervalos: IntervaloCorrespondenciaBusca[] = [];
  if (fraseExata) {
    for (let inicio = 0; inicio <= palavras.length - tokensConsulta.length; inicio += 1) {
      if (!tokensConsulta.every((token, indice) => palavras[inicio + indice].valor === token)) continue;
      for (let indice = inicio; indice < inicio + tokensConsulta.length; indice += 1) {
        intervalos.push({ inicio: palavras[indice].inicio, fim: palavras[indice].fim });
      }
    }
    return intervalos;
  }

  for (const palavra of palavras) {
    if (tokensConsulta.some((token) => palavra.valor.startsWith(token))) {
      intervalos.push({ inicio: palavra.inicio, fim: palavra.fim });
    }
  }
  return intervalos;
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
