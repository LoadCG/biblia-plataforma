import type { LivrosLidosRepository } from "../LivrosLidosRepository";
import { db } from "../../db/database";

export const sqliteLivrosLidosRepository: LivrosLidosRepository = {
  async listar(ownerId) {
    const records = await db.getAllAsync<{ livroSlug: string }>(
      `SELECT livroSlug FROM livros_lidos WHERE ownerId = ?`,
      [ownerId]
    );
    return records.map((r) => r.livroSlug);
  },

  async estaLido(ownerId, livroSlug) {
    const result = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM livros_lidos WHERE ownerId = ? AND livroSlug = ?`,
      [ownerId, livroSlug]
    );
    return !!result;
  },

  async alternar(ownerId, livroSlug) {
    const existente = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM livros_lidos WHERE ownerId = ? AND livroSlug = ?`,
      [ownerId, livroSlug]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM livros_lidos WHERE id = ?`, [existente.id]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO livros_lidos (ownerId, livroSlug, lidoEm) VALUES (?, ?, ?)`,
      [ownerId, livroSlug, new Date().toISOString()]
    );
    return true;
  },
};
