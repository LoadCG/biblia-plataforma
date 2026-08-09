export type DiaPlanoConcluido = {
  planoId: string;
  diaConcluido: number;
  concluidoEm: string;
};

export interface PlanosRepository {
  /**
   * Marca um dia específico de um plano como concluído.
   * Se já estiver concluído, remove a conclusão (toggle).
   * Retorna true se marcou como concluído, false se desmarcou.
   */
  alternarDiaConcluido(ownerId: string, planoId: string, dia: number): Promise<boolean>;

  /**
   * Retorna a lista de dias concluídos de um plano para o usuário.
   */
  listarDiasConcluidos(ownerId: string, planoId: string): Promise<number[]>;
}
