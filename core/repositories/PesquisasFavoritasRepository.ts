import type { PesquisaFavorita } from "../types/leitura";

export interface PesquisasFavoritasRepository {
  listarTodas(ownerId: string): Promise<PesquisaFavorita[]>;
  estaFavoritada(ownerId: string, termo: string): Promise<boolean>;
  alternar(ownerId: string, termo: string): Promise<boolean>;
}
