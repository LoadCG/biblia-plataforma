import type { Perfil, PerfilRepository } from "../PerfilRepository";
import { PERFIL_PADRAO } from "../PerfilRepository";
import { db } from "../../db/database";

export const sqlitePerfilRepository: PerfilRepository = {
  async obter(ownerId) {
    const linha = await db.getFirstAsync<{ nome: string; avatarUri: string | null }>(
      `SELECT nome, avatarUri FROM perfil WHERE ownerId = ?`,
      [ownerId]
    );
    return linha ?? PERFIL_PADRAO;
  },

  async salvar(ownerId, perfil) {
    await db.runAsync(
      `INSERT INTO perfil (ownerId, nome, avatarUri) VALUES (?, ?, ?)
       ON CONFLICT(ownerId) DO UPDATE SET nome = excluded.nome, avatarUri = excluded.avatarUri`,
      [ownerId, perfil.nome, perfil.avatarUri]
    );
  },
};
