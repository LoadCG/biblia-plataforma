import type { PesquisasFavoritasRepository } from "../PesquisasFavoritasRepository";
import type { PesquisaFavorita } from "../../types/leitura";
import { db } from "../../db/database";

export const sqlitePesquisasFavoritasRepository: PesquisasFavoritasRepository = {
  async listarTodas(ownerId) {
    return await db.getAllAsync<PesquisaFavorita>(
      `SELECT * FROM pesquisas_favoritas WHERE ownerId = ?`,
      [ownerId]
    );
  },

  async estaFavoritada(ownerId, termo) {
    const result = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM pesquisas_favoritas WHERE ownerId = ? AND termo = ?`,
      [ownerId, termo]
    );
    return !!result;
  },

  async alternar(ownerId, termo) {
    const existente = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM pesquisas_favoritas WHERE ownerId = ? AND termo = ?`,
      [ownerId, termo]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM pesquisas_favoritas WHERE id = ?`, [existente.id]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO pesquisas_favoritas (ownerId, termo, favoritaEm) VALUES (?, ?, ?)`,
      [ownerId, termo, new Date().toISOString()]
    );
    return true;
  },
};
