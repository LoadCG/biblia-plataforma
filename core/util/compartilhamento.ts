import { Platform, Share } from "react-native";
import * as Clipboard from "expo-clipboard";

export type ResultadoCompartilhamento = "compartilhado" | "copiado" | "cancelado";

export type OpcoesCompartilhamento = {
  titulo?: string;
  url?: string;
  textoCopiado?: string;
};

type CompartilhadorWeb = {
  canShare?: (dados: DadosCompartilhamentoWeb) => boolean;
  share?: (dados: DadosCompartilhamentoWeb) => Promise<void>;
};

type DadosCompartilhamentoWeb = { title?: string; text?: string; url?: string };

function erroFoiCancelamento(erro: unknown): boolean {
  return typeof erro === "object" && erro !== null && "name" in erro && erro.name === "AbortError";
}

export async function compartilharTexto(
  texto: string,
  opcoes: OpcoesCompartilhamento = {}
): Promise<ResultadoCompartilhamento> {
  const conteudo = texto.trim();
  if (!conteudo) throw new Error("Não há conteúdo para compartilhar.");

  if (Platform.OS === "web") {
    const compartilhador = typeof navigator !== "undefined"
      ? (navigator as Navigator & CompartilhadorWeb)
      : undefined;

    if (compartilhador?.share) {
      const dados: DadosCompartilhamentoWeb = { title: opcoes.titulo, text: conteudo, url: opcoes.url };
      try {
        if (!compartilhador.canShare || compartilhador.canShare(dados)) {
          await compartilhador.share(dados);
          return "compartilhado";
        }
      } catch (erro) {
        if (erroFoiCancelamento(erro)) return "cancelado";
        // Falhas da API de compartilhamento usam a cópia como alternativa.
      }
    }
    const textoComLink = opcoes.url ? `${conteudo}\n\n${opcoes.url}` : conteudo;
    return copiarTexto(opcoes.textoCopiado ?? textoComLink);
  }

  try {
    const mensagem = opcoes.url ? `${conteudo}\n\n${opcoes.url}` : conteudo;
    const resultado = await Share.share({ message: mensagem, title: opcoes.titulo }, { dialogTitle: opcoes.titulo });
    return resultado.action === Share.dismissedAction ? "cancelado" : "compartilhado";
  } catch (erro) {
    if (erroFoiCancelamento(erro)) return "cancelado";
    throw erro;
  }
}

export async function copiarTexto(texto: string): Promise<ResultadoCompartilhamento> {
  const conteudo = texto.trim();
  if (!conteudo) throw new Error("Não há conteúdo para copiar.");
  await Clipboard.setStringAsync(conteudo);
  return "copiado";
}
