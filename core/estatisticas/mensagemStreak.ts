import type { ResumoSequencia } from "./streak";

export function mensagemStreak(resumo: Pick<ResumoSequencia, "atual" | "leuHoje">): string {
  if (resumo.atual === 0) return "Marque um capítulo como lido para acompanhar seu ritmo.";
  if (resumo.leuHoje) return "Você leu hoje. Seu ritmo está em dia.";
  if (resumo.atual === 1) return "Você leu ontem. Uma leitura hoje soma mais um dia.";
  return "Sua última leitura foi ontem. Uma leitura hoje soma ao seu ritmo.";
}

export function acaoStreak(resumo: Pick<ResumoSequencia, "atual" | "leuHoje">) {
  if (resumo.leuHoje) return null;
  if (resumo.atual > 0) {
    return { rotulo: "Ler hoje", nomeAcessivel: "Abrir a Bíblia para ler hoje" };
  }
  return { rotulo: "Começar leitura", nomeAcessivel: "Abrir a Bíblia e começar a sequência" };
}
