import { IconeUI, type IconeUINome } from "./icone/IconeUI";
import type { IdConquista } from "../core/content/conquistas";
import { useColorScheme } from "../core/theme";

type Props = {
  conquistaId: IdConquista;
  conquistada: boolean;
  tamanho?: number;
};

const ICONES_POR_CONQUISTA: Record<IdConquista, IconeUINome> = {
  "primeiro-livro": "milestone",
  pentateuco: "book-collection",
  evangelhos: "open-book",
  "antigo-testamento": "scroll",
  "novo-testamento": "cross",
  "historia-israel": "world",
  "poesia-sabedoria": "feather",
  profetas: "proclamation",
  cartas: "letter",
  "biblia-completa": "verified",
};

const CORES = {
  claro: { conquistada: "#80501f", bloqueada: "#837b6e" },
  escuro: { conquistada: "#edc47b", bloqueada: "#bcb3a2" },
} as const;

/** Ícone simples, sem moldura; nome e estado são anunciados pelo controle pai. */
export function IconeConquista({ conquistaId, conquistada, tamanho = 40 }: Props) {
  const { colorScheme } = useColorScheme();
  const paleta = colorScheme === "dark" ? CORES.escuro : CORES.claro;

  return (
    <IconeUI
      name={ICONES_POR_CONQUISTA[conquistaId]}
      size={tamanho}
      color={conquistada ? paleta.conquistada : paleta.bloqueada}
      weight={conquistada ? "duotone" : "regular"}
    />
  );
}
