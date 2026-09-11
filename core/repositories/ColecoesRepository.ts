export type Colecao = {
  id: string;
  ownerId: string;
  nome: string;
  cor?: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type AssociacaoColecao = { ownerId: string; colecaoId: string; itemChave: string };

export interface ColecoesRepository {
  listar(ownerId: string): Promise<Colecao[]>;
  criar(ownerId: string, nome: string, cor?: string): Promise<Colecao>;
  renomear(ownerId: string, id: string, nome: string): Promise<void>;
  remover(ownerId: string, id: string): Promise<void>;
  listarAssociacoes(ownerId: string): Promise<AssociacaoColecao[]>;
  associar(ownerId: string, colecaoId: string, itemChaves: string[]): Promise<void>;
  desassociar(ownerId: string, colecaoId: string, itemChaves: string[]): Promise<void>;
  apagarTudo(ownerId: string): Promise<void>;
}
