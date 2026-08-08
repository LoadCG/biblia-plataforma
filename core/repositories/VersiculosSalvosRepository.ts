import type { ReferenciaVersiculo } from "../types/leitura";

export interface VersiculoSalvo extends ReferenciaVersiculo {
  ownerId: string;
  salvoEm: string;
}

export interface VersiculosSalvosRepository {
  listarPorCapitulo(ownerId: string, livroSlug: string, capitulo: number): Promise<VersiculoSalvo[]>;
  listarTodos(ownerId: string): Promise<VersiculoSalvo[]>;
  estaSalvo(ownerId: string, ref: ReferenciaVersiculo): Promise<boolean>;
  alternar(ownerId: string, ref: ReferenciaVersiculo): Promise<boolean>;
}
