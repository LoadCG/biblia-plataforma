import { randomUUID } from "expo-crypto";
import { db } from "../../db/database";
import type { AssociacaoColecao, Colecao, ColecoesRepository } from "../ColecoesRepository";

export const sqliteColecoesRepository: ColecoesRepository = {
  async listar(ownerId) { return db.getAllAsync<Colecao>(`SELECT * FROM colecoes WHERE ownerId = ? ORDER BY nome`, [ownerId]); },
  async criar(ownerId, nome, cor) { const agora = new Date().toISOString(); const item: Colecao = { id: randomUUID(), ownerId, nome: nome.trim(), cor, criadoEm: agora, atualizadoEm: agora }; await db.runAsync(`INSERT INTO colecoes (id, ownerId, nome, cor, criadoEm, atualizadoEm) VALUES (?, ?, ?, ?, ?, ?)`, [item.id, ownerId, item.nome, cor ?? null, agora, agora]); return item; },
  async renomear(ownerId, id, nome) { await db.runAsync(`UPDATE colecoes SET nome = ?, atualizadoEm = ? WHERE ownerId = ? AND id = ?`, [nome.trim(), new Date().toISOString(), ownerId, id]); },
  async remover(ownerId, id) { await db.withTransactionAsync(async () => { await db.runAsync(`DELETE FROM colecoes_associacoes WHERE ownerId = ? AND colecaoId = ?`, [ownerId, id]); await db.runAsync(`DELETE FROM colecoes WHERE ownerId = ? AND id = ?`, [ownerId, id]); }); },
  async listarAssociacoes(ownerId) { return db.getAllAsync<AssociacaoColecao>(`SELECT ownerId, colecaoId, itemChave FROM colecoes_associacoes WHERE ownerId = ?`, [ownerId]); },
  async associar(ownerId, colecaoId, itemChaves) { for (const chave of itemChaves) await db.runAsync(`INSERT OR IGNORE INTO colecoes_associacoes (ownerId, colecaoId, itemChave) VALUES (?, ?, ?)`, [ownerId, colecaoId, chave]); },
  async desassociar(ownerId, colecaoId, itemChaves) { for (const chave of itemChaves) await db.runAsync(`DELETE FROM colecoes_associacoes WHERE ownerId = ? AND colecaoId = ? AND itemChave = ?`, [ownerId, colecaoId, chave]); },
  async apagarTudo(ownerId) { await db.withTransactionAsync(async () => { await db.runAsync(`DELETE FROM colecoes_associacoes WHERE ownerId = ?`, [ownerId]); await db.runAsync(`DELETE FROM colecoes WHERE ownerId = ?`, [ownerId]); }); },
};
