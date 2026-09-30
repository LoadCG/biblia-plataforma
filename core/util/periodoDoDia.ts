export type PeriodoDoDia = "manha" | "tarde" | "noite";

export function obterPeriodoDoDia(data: Date): PeriodoDoDia {
  const hora = data.getHours();
  if (hora >= 5 && hora < 12) return "manha";
  if (hora >= 12 && hora < 18) return "tarde";
  return "noite";
}

export function obterSaudacao(periodo: PeriodoDoDia): string {
  switch (periodo) {
    case "manha": return "Bom dia";
    case "tarde": return "Boa tarde";
    case "noite": return "Boa noite";
  }
}
