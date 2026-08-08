import type { GrifosRepository } from "../GrifosRepository";
import type { Grifo, ReferenciaVersiculo } from "../../types/leitura";
import { db } from "../../db/database";

export const sqliteGrifosRepository: GrifosRepository = {
  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    return await db.getAllAsync<Grifo>(
      `SELECT * FROM grifos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, livroSlug, capitulo]
    );
  },

  async listarTodos(ownerId) {
    return await db.getAllAsync<Grifo>(
      `SELECT * FROM grifos WHERE ownerId = ?`,
      [ownerId]
    );
  },

  async estaGrifado(ownerId, ref) {
    const result = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM grifos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
    return !!result;
  },

  async alternar(ownerId, ref, cor) {
    const existente = await db.getFirstAsync<Grifo>(
      `SELECT * FROM grifos WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );

    if (existente) {
      if (cor && existente.cor !== cor) {
        // Atualiza apenas a cor
        await db.runAsync(
          `UPDATE grifos SET cor = ? WHERE id = ?`,
          [cor, existente.id!]
        );
        return true;
      }
      // Se não, desmarca (remove)
      await db.runAsync(`DELETE FROM grifos WHERE id = ?`, [existente.id!]);
      return false;
    }

    // Insere novo
    await db.runAsync(
      `INSERT INTO grifos (ownerId, livroSlug, capitulo, versiculo, cor, criadoEm) VALUES (?, ?, ?, ?, ?, ?)`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, cor || null, new Date().toISOString()]
    );
    return true;
  },
};
