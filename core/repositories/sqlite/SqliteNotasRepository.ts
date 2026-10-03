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
    const agora = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO notas (ownerId, livroSlug, capitulo, versiculo, texto, criadoEm, atualizadoEm)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(ownerId, livroSlug, capitulo, versiculo)
       DO UPDATE SET texto = excluded.texto, atualizadoEm = excluded.atualizadoEm`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, texto, agora, agora]
    );

    const nota = await db.getFirstAsync<Nota>(
      `SELECT * FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
    if (!nota) throw new Error("Não foi possível recuperar a anotação salva");
    return nota;
  },

  async remover(ownerId, ref) {
    await db.runAsync(
      `DELETE FROM notas WHERE ownerId = ? AND livroSlug = ? AND capitulo = ? AND versiculo = ?`,
      [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo]
    );
  },
};
