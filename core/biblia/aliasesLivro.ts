// Apelido (abreviação em português) -> nome canônico do livro, o mesmo
// `nome` que já existe em core/content/livros.ts e que já sabemos que
// funciona direto na bible-api.com (confirmado com chamadas reais antes
// de escrever este arquivo — inclusive nomes acentuados como "Gênesis",
// "Provérbios", "Isaías", "Jó").
//
// Cobre as abreviações padrão em português mais usadas + os nomes por
// extenso (apontando pra si mesmos), pra também linkar quando o resumo
// escreve o nome completo. "Jo" (João) e "Jó" (Jó) são propositalmente
// distintos — a acentuação diferencia, então não dá pra confundir.
import { livros } from "../content/livros";

// "Os" (Oséias) e "Na" (Naum) foram deixados de fora de propósito: são
// palavras comuns do português ("os 150 salmos", "na tribo de...") e
// gerariam falsos positivos no meio de frases normais. Os nomes por
// extenso ("Oséias", "Naum") continuam funcionando via NOMES_COMPLETOS.
const ABREVIACOES: Record<string, string> = {
  Gn: "Gênesis",
  Êx: "Êxodo",
  Ex: "Êxodo",
  Lv: "Levítico",
  Nm: "Números",
  Dt: "Deuteronômio",
  Js: "Josué",
  Jz: "Juízes",
  Rt: "Rute",
  "1 Sm": "1 Samuel",
  "2 Sm": "2 Samuel",
  "1 Rs": "1 Reis",
  "2 Rs": "2 Reis",
  "1 Cr": "1 Crônicas",
  "2 Cr": "2 Crônicas",
  Ed: "Esdras",
  Ne: "Neemias",
  Et: "Ester",
  Jó: "Jó",
  Sl: "Salmos",
  Pv: "Provérbios",
  Ec: "Eclesiastes",
  Ct: "Cantares",
  Is: "Isaías",
  Jr: "Jeremias",
  Lm: "Lamentações",
  Ez: "Ezequiel",
  Dn: "Daniel",
  Jl: "Joel",
  Am: "Amós",
  Ob: "Obadias",
  Jn: "Jonas",
  Mq: "Miquéias",
  Hc: "Habacuque",
  Sf: "Sofonias",
  Ag: "Ageu",
  Zc: "Zacarias",
  Ml: "Malaquias",
  Mt: "Mateus",
  Mc: "Marcos",
  Lc: "Lucas",
  Jo: "João",
  At: "Atos",
  Rm: "Romanos",
  "1 Co": "1 Coríntios",
  "2 Co": "2 Coríntios",
  Gl: "Gálatas",
  Ef: "Efésios",
  Fp: "Filipenses",
  Cl: "Colossenses",
  "1 Ts": "1 Tessalonicenses",
  "2 Ts": "2 Tessalonicenses",
  "1 Tm": "1 Timóteo",
  "2 Tm": "2 Timóteo",
  Tt: "Tito",
  Fm: "Filemom",
  Hb: "Hebreus",
  Tg: "Tiago",
  "1 Pe": "1 Pedro",
  "2 Pe": "2 Pedro",
  "1 Jo": "1 João",
  "2 Jo": "2 João",
  "3 Jo": "3 João",
  Jd: "Judas",
  Ap: "Apocalipse",
};

const NOMES_COMPLETOS = Object.fromEntries(livros.map((l) => [l.nome, l.nome]));

export const ALIASES_LIVRO: Record<string, string> = { ...ABREVIACOES, ...NOMES_COMPLETOS };
