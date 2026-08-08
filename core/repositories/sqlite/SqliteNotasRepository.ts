import type { NotasRepository } from "../NotasRepository";
import type { Nota } from "../../types/leitura";
import { db } from "../../db/database";

export const sqliteNotasRepository: NotasRepository = {
  async buscar(ownerId, ref) {
    return await db.getFirstAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
  },

  async listarPorCapitulo(ownerId, livroSlug, capitulo) {
    return await db.getAllAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ?`,
      [ownerId, livroSlug, capitulo]
    );
  },

  async listarTodas(ownerId) {
    return await db.getAllAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ?`,
      [ownerId]
    );
  },

  async salvar(ownerId, ref, texto) {
    const existente = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );

    if (existente) {
      await db.runAsync(
        `UPDATE notas SET texto = ? WHERE id = ?`,
        [texto, existente.id]
      );
    } else {
      await db.runAsync(
        `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm) VALUES (?, ?, ?, ?, ?, ?)`,
        [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, new Date().toISOString()]
      );
    }
    
    return (await db.getFirstAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    )) as Nota;
  },

  async remover(ownerId, ref) {
    await db.runAsync(
      `DELETE FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
  },
};
