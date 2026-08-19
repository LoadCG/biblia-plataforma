import type { CapituloLido, ReferenciaCapitulo } from "../types/leitura";

export interface ProgressoRepository {
  listarCapitulosLidos(ownerId: string, livroSlug: string): Promise<CapituloLido[]>;
  listarTodos(ownerId: string): Promise<CapituloLido[]>;
  estaLido(ownerId: string, ref: ReferenciaCapitulo): Promise<boolean>;
  alternar(ownerId: string, ref: ReferenciaCapitulo): Promise<boolean>;
  /** Define o mesmo estado de leitura (lido/não lido) pra vários capítulos de uma vez — usado na marcação em massa. */
  definirVarios(ownerId: string, refs: ReferenciaCapitulo[], lido: boolean): Promise<void>;
}
