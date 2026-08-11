import { Platform } from "react-native";

// Link de verdade só é possível na versão web hoje — o app nativo não
// tem um esquema de URL customizado configurado (ver PLANO-PLATAFORMA.md,
// "nome definitivo e domínio" ainda em aberto), então no nativo o
// compartilhamento continua sendo só o texto/referência, sem link.
export function linkVersiculo(livroSlug: string, capitulo: number, versiculo?: number): string | null {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;
  const caminho = `/biblia/${livroSlug}/${capitulo}${versiculo ? `?versiculo=${versiculo}` : ""}`;
  return `${window.location.origin}${caminho}`;
}
