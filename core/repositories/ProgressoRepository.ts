import type { CapituloLido, ReferenciaCapitulo } from "../types/leitura";

export interface ProgressoRepository {
  listarCapitulosLidos(ownerId: string, livroSlug: string): Promise<CapituloLido[]>;
  estaLido(ownerId: string, ref: ReferenciaCapitulo): Promise<boolean>;
  alternar(ownerId: string, ref: ReferenciaCapitulo): Promise<boolean>;
}
