import type { Nota, ReferenciaVersiculo } from "../types/leitura";

export interface NotasRepository {
  buscar(ownerId: string, ref: ReferenciaVersiculo): Promise<Nota | null>;
  salvar(ownerId: string, ref: ReferenciaVersiculo, texto: string): Promise<Nota>;
  remover(ownerId: string, ref: ReferenciaVersiculo): Promise<void>;
}
