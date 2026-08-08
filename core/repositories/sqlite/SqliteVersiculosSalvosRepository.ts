import type { VersiculosSalvosRepository, VersiculoSalvo } from "../VersiculosSalvosRepository";
import { db } from "../../db/database";

export const sqliteVersiculosSalvosRepository: VersiculosSalvosRepository = {
  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    return await db.getAllAsync<VersiculoSalvo>(
      `SELECT * FROM versiculos_salvos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, livroSlug, capitulo]
    );
  },

  async listarTodos(ownerId) {
    return await db.getAllAsync<VersiculoSalvo>(
      `SELECT * FROM versiculos_salvos WHERE ownerId = ?`,
      [ownerId]
    );
  },

  async estaSalvo(ownerId, ref) {
    const result = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM versiculos_salvos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
    return !!result;
  },

  async alternar(ownerId, ref) {
    const existente = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM versiculos_salvos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM versiculos_salvos WHERE id = ?`, [existente.id]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO versiculos_salvos (ownerId, livroSlug, capitulo, versiculo, salvoEm) VALUES (?, ?, ?, ?, ?)`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, new Date().toISOString()]
    );
    return true;
  },
};
