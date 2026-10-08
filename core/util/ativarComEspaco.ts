type EventoTeclado = { key?: string; preventDefault?: () => void } & {
  nativeEvent?: { key?: string };
};

/** RN Web trata Enter em todos os Pressables, mas Space só em botões; switches também precisam responder a Space. */
export function ativarComEspaco(evento: EventoTeclado, acao: () => void): void {
  const tecla = evento.key ?? evento.nativeEvent?.key;
  if (tecla !== " " && tecla !== "Spacebar") return;
  evento.preventDefault?.();
  acao();
}

/** Navega por um grupo de rádios usando as setas conforme o padrão de teclado ARIA. */
export function navegarGrupoRadio(
  evento: EventoTeclado,
  indiceAtual: number,
  quantidade: number,
  selecionar: (indice: number) => void
): boolean {
  if (quantidade < 1) return false;
  const tecla = evento.key ?? evento.nativeEvent?.key;
  const avancar = tecla === "ArrowRight" || tecla === "ArrowDown";
  const voltar = tecla === "ArrowLeft" || tecla === "ArrowUp";
  if (!avancar && !voltar) return false;
  evento.preventDefault?.();
  selecionar((indiceAtual + (avancar ? 1 : -1) + quantidade) % quantidade);
  return true;
}
