import { Platform } from "react-native";

// Cartão de imagem pra compartilhar um versículo (ver 5.2 do
// FUNCIONALIDADES.md) — só web por enquanto: usa a Canvas API direto,
// sem dependência nova nem servidor. No nativo exigiria capturar uma
// View de verdade (`react-native-view-shot`) e um sharer de arquivo
// (`expo-sharing`), duas dependências novas que não dá pra validar
// sem um dispositivo/simulador nativo à mão — fica pro próximo passo
// natural quando isso puder ser testado de verdade.
const LARGURA = 1080;
const ALTURA = 1080;
const COR_FUNDO_DE = "#241c12";
const COR_FUNDO_PARA = "#1b1712";
const COR_TEXTO = "#f3e6d3";
const COR_DESTAQUE = "#e0a75e";
const COR_MARCA = "#a89578";

export function suportaImagemVersiculo(): boolean {
  return Platform.OS === "web" && typeof document !== "undefined";
}

function quebrarLinhas(ctx: CanvasRenderingContext2D, texto: string, larguraMax: number): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let linhaAtual = "";
  for (const palavra of palavras) {
    const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > larguraMax && linhaAtual) {
      linhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = tentativa;
    }
  }
  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
}

export function gerarImagemVersiculo(texto: string, referencia: string): string | null {
  if (!suportaImagemVersiculo()) return null;

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradiente = ctx.createLinearGradient(0, 0, LARGURA, ALTURA);
  gradiente.addColorStop(0, COR_FUNDO_DE);
  gradiente.addColorStop(1, COR_FUNDO_PARA);
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  const margem = 100;
  const larguraTexto = LARGURA - margem * 2;

  // Tamanho de fonte decrescente conforme o texto for maior, pra caber
  // sem cortar — versículos curtos ganham destaque maior, longos
  // continuam legíveis em miniatura.
  let tamanhoFonte = texto.length > 220 ? 44 : texto.length > 120 ? 52 : 62;
  ctx.font = `600 ${tamanhoFonte}px Georgia, serif`;
  ctx.fillStyle = COR_TEXTO;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let linhas = quebrarLinhas(ctx, `"${texto}"`, larguraTexto);
  const alturaLinha = tamanhoFonte * 1.4;
  // Se mesmo com a fonte já reduzida o texto não couber na área
  // reservada, reduz mais um passo — evita transbordar o cartão com
  // versículos muito longos.
  while (linhas.length * alturaLinha > ALTURA - 340 && tamanhoFonte > 30) {
    tamanhoFonte -= 4;
    ctx.font = `600 ${tamanhoFonte}px Georgia, serif`;
    linhas = quebrarLinhas(ctx, `"${texto}"`, larguraTexto);
  }

  const alturaLinhaFinal = tamanhoFonte * 1.4;
  const alturaTotalTexto = linhas.length * alturaLinhaFinal;
  const yInicial = (ALTURA - alturaTotalTexto) / 2 - 30;
  linhas.forEach((linha, i) => {
    ctx.fillText(linha, LARGURA / 2, yInicial + i * alturaLinhaFinal + alturaLinhaFinal / 2);
  });

  ctx.font = `700 34px Georgia, serif`;
  ctx.fillStyle = COR_DESTAQUE;
  ctx.fillText(referencia, LARGURA / 2, yInicial + alturaTotalTexto + 60);

  ctx.font = `500 24px Georgia, serif`;
  ctx.fillStyle = COR_MARCA;
  ctx.fillText("Bíblia Plataforma", LARGURA / 2, ALTURA - 60);

  return canvas.toDataURL("image/png");
}
