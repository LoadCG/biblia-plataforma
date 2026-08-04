// Separado de propósito de ProgressoRepository (que é sobre capítulos da
// leitura bíblica em si). Isto aqui é sobre ter lido o *resumo histórico*
// de um livro — dois progressos diferentes, mesma decisão de arquitetura
// do projeto antigo.
export interface LivrosLidosRepository {
  listar(ownerId: string): Promise<string[]>;
  estaLido(ownerId: string, livroSlug: string): Promise<boolean>;
  alternar(ownerId: string, livroSlug: string): Promise<boolean>;
}
