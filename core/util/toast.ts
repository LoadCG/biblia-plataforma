// Pub-sub mínimo pra disparar um toast de qualquer lugar do app (fora
// da árvore de componentes, ex. `core/estatisticas/compartilhador.ts`)
// sem precisar de um Context Provider — só o componente montado uma
// vez em `app/_layout.tsx` (`components/Toast.tsx`) escuta e renderiza.
export type OpcoesToast = {
  /** Rótulo de um botão de ação opcional (ex. "Desfazer"). */
  acaoLabel?: string;
  onAcao?: () => void;
  /** Duração em ms antes de sumir sozinho. Default: 2000ms sem ação, 4000ms com ação (mais tempo pra decidir). */
  duracaoMs?: number;
};

export type PayloadToast = { mensagem: string } & OpcoesToast;

type Ouvinte = (payload: PayloadToast) => void;

let ouvintes: Ouvinte[] = [];

export function mostrarToast(mensagem: string, opcoes?: OpcoesToast): void {
  const payload: PayloadToast = { mensagem, ...opcoes };
  ouvintes.forEach((ouvinte) => ouvinte(payload));
}

export function ouvirToast(ouvinte: Ouvinte): () => void {
  ouvintes.push(ouvinte);
  return () => {
    ouvintes = ouvintes.filter((o) => o !== ouvinte);
  };
}
