// Pub-sub mínimo pra disparar um toast de qualquer lugar do app (fora
// da árvore de componentes, ex. `core/estatisticas/compartilhador.ts`)
// sem precisar de um Context Provider — só o componente montado uma
// vez em `app/_layout.tsx` (`components/Toast.tsx`) escuta e renderiza.
type Ouvinte = (mensagem: string) => void;

let ouvintes: Ouvinte[] = [];

export function mostrarToast(mensagem: string): void {
  ouvintes.forEach((ouvinte) => ouvinte(mensagem));
}

export function ouvirToast(ouvinte: Ouvinte): () => void {
  ouvintes.push(ouvinte);
  return () => {
    ouvintes = ouvintes.filter((o) => o !== ouvinte);
  };
}
