import type { Nota, ReferenciaVersiculo } from "../types/leitura";

export interface NotasRepository {
  buscar(ownerId: string, ref: ReferenciaVersiculo): Promise<Nota | null>;
  listarPorCapitulo(ownerId: string, livroSlug: string, capitulo: number): Promise<Nota[]>;
  listarTodas(ownerId: string): Promise<Nota[]>;
  salvar(ownerId: string, ref: ReferenciaVersiculo, texto: string): Promise<Nota>;
  remover(ownerId: string, ref: ReferenciaVersiculo): Promise<void>;
}
