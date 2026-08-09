import type { PlanosRepository, DiaPlanoConcluido } from "../PlanosRepository";
import { db } from "../../db/database";

export const sqlitePlanosRepository: PlanosRepository = {
  async alternarDiaConcluido(ownerId, planoId, dia) {
    const existente = await db.getFirstAsync<DiaPlanoConcluido>(
      `SELECT * FROM progresso_planos WHERE ownerId = ? AND planoId = ? AND diaConcluido = ?`,
      [ownerId, planoId, dia]
    );

    if (existente) {
      await db.runAsync(`DELETE FROM progresso_planos WHERE ownerId = ? AND planoId = ? AND diaConcluido = ?`, [
        ownerId,
        planoId,
        dia,
      ]);
      return false;
    }

    await db.runAsync(
      `INSERT INTO progresso_planos (ownerId, planoId, diaConcluido, concluidoEm) VALUES (?, ?, ?, ?)`,
      [ownerId, planoId, dia, new Date().toISOString()]
    );
    return true;
  },

  async listarDiasConcluidos(ownerId, planoId) {
    const resultados = await db.getAllAsync<{ diaConcluido: number }>(
      `SELECT diaConcluido FROM progresso_planos WHERE ownerId = ? AND planoId = ? ORDER BY diaConcluido ASC`,
      [ownerId, planoId]
    );
    return resultados.map((r) => r.diaConcluido);
  },
};
