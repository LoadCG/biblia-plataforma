import { IconeUI, type IconeUINome } from "./icone/IconeUI";
import type { Conquista, IdConquista } from "../core/content/conquistas";

const ICONES_POR_CONQUISTA: Record<IdConquista, IconeUINome> = {
  "primeiro-livro": "milestone",
  pentateuco: "book-collection",
  evangelhos: "open-book",
  "antigo-testamento": "world",
  "novo-testamento": "sparkle",
  "biblia-completa": "verified",
};

type Props = {
  conquistaId: Conquista["id"];
  conquistada: boolean;
  tamanho?: number;
  className?: string;
};

export function IconeConquista({ conquistaId, conquistada, tamanho = 30, className }: Props) {
  return (
    <IconeUI
      name={ICONES_POR_CONQUISTA[conquistaId]}
      size={tamanho}
      className={className ?? "text-cor-destaque dark:text-cor-destaque-dark"}
      style={{ opacity: conquistada ? 1 : 0.48 }}
    />
  );
}
