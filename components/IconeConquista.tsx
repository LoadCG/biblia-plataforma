import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Conquista, IdConquista } from "../core/content/conquistas";

const ICONES_POR_CONQUISTA: Record<IdConquista, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  "primeiro-livro": "flag",
  pentateuco: "auto-stories",
  evangelhos: "menu-book",
  "antigo-testamento": "public",
  "novo-testamento": "auto-awesome",
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
    <MaterialIcons
      name={ICONES_POR_CONQUISTA[conquistaId]}
      size={tamanho}
      className={className ?? "text-cor-destaque dark:text-cor-destaque-dark"}
      style={{ opacity: conquistada ? 1 : 0.48 }}
      accessible={false}
    />
  );
}
