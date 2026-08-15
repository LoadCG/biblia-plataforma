import { ErroBusca } from "../biblia/BibliaAPI";

// Mensagens em tom de conversa, sem jargão técnico ("erro 429",
// "timeout", "fetch failed") — a pessoa só precisa saber o que
// aconteceu e o que fazer a seguir.
export function mensagemErroAmigavel(erro: unknown): string {
  const tipo = erro instanceof ErroBusca ? erro.tipo : "desconhecido";
  switch (tipo) {
    case "limite":
      return "Devagar aí! Muitos capítulos em pouco tempo — espera meio minuto e tenta de novo.";
    case "rede":
      return "Sem conexão com a internet agora. Verifique sua rede e tente de novo.";
    case "timeout":
      return "A conexão está lenta no momento. Tente de novo em instantes.";
    case "invalido":
      return "Não encontramos esse texto bíblico. Tente novamente ou volte e escolha outro capítulo.";
    default:
      return "Algo deu errado ao carregar. Tente de novo em instantes.";
  }
}
