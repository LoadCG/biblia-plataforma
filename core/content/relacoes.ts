export type TipoRelacaoEditorial = "plano-livro" | "plano-tema" | "leia-tambem";

export type RelacaoEditorial = {
  origem: string;
  destino: string;
  tipo: TipoRelacaoEditorial;
  motivo: string;
};

export function validarRelacoesEditorial(relacoes: RelacaoEditorial[], idsValidos: Set<string>): string[] {
  const erros: string[] = [];
  const pares = new Set<string>();
  for (const relacao of relacoes) {
    const par = `${relacao.origem}->${relacao.destino}:${relacao.tipo}`;
    if (pares.has(par)) erros.push(`relação duplicada: ${par}`);
    pares.add(par);
    if (!idsValidos.has(relacao.origem)) erros.push(`origem inexistente: ${relacao.origem}`);
    if (!idsValidos.has(relacao.destino) && relacao.tipo !== "plano-tema") erros.push(`destino inexistente: ${relacao.destino}`);
    if (!relacao.motivo.trim()) erros.push(`motivo ausente: ${par}`);
    if (relacao.tipo === "leia-tambem" && relacao.origem === relacao.destino) erros.push(`auto-relação inválida: ${par}`);
  }
  return erros;
}
