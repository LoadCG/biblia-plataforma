import type { Grifo, ReferenciaVersiculo } from "../types/leitura";

// Contrato fixo. A tela nunca importa uma implementação diretamente —
// sempre recebe isto através de core/repositories/index.ts, que é o
// único lugar que decide qual implementação está ativa (local hoje,
// banco de dados depois).
export interface GrifosRepository {
  listarPorCapitulo(ownerId: string, livroSlug: string, capitulo: number): Promise<Grifo[]>;
  estaGrifado(ownerId: string, ref: ReferenciaVersiculo): Promise<boolean>;
  alternar(ownerId: string, ref: ReferenciaVersiculo): Promise<boolean>;
}
