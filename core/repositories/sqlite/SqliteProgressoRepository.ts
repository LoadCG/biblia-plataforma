import type { ProgressoRepository } from "../ProgressoRepository";
import type { CapituloLido, ReferenciaCapitulo } from "../../types/leitura";
import { db } from "../../db/database";

export const sqliteProgressoRepository: ProgressoRepository = {
  async listarCapitulosLidos(ownerId, livroSlug) {
    return await db.getAllAsync<CapituloLido>(
      `SELECT * FROM capitulos_lidos WHERE ownerId = ? AND livroSlug = ?`,
      [ownerId, livroSlug]
    );
  },

  async listarTodos(ownerId) {
    return await db.getAllAsync<CapituloLido>(
      `SELECT * FROM capitulos_lidos WHERE ownerId = ?`,
      [ownerId]
    );
  },

  async estaLido(ownerId, ref) {
    const result = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM capitulos_lidos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo]
    );
    return !!result;
  },

  async alternar(ownerId, ref) {
    const existente = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM capitulos_lidos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM capitulos_lidos WHERE id = ?`, [existente.id]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO capitulos_lidos (ownerId, livroSlug, capitulo, lidoEm) VALUES (?, ?, ?, ?)`,
      [ownerId, ref.livroSlug, ref.capitulo, new Date().toISOString()]
    );
    return true;
  },
};
