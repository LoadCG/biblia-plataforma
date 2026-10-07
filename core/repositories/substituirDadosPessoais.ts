import type { DadosPessoais } from "../util/dadosPessoais";
import { db } from "../db/database";
import { randomUUID } from "expo-crypto";
import type { ReferenciaVersiculo } from "../types/leitura";

type Linha = (string | number | null)[];

async function inserirLote(txn: typeof db, tabela: string, colunas: string[], linhas: Linha[]) {
  if (linhas.length === 0) return;
  const linhasPorLote = Math.max(1, Math.floor(900 / colunas.length));
  for (let inicio = 0; inicio < linhas.length; inicio += linhasPorLote) {
    const lote = linhas.slice(inicio, inicio + linhasPorLote);
    const placeholders = lote.map(() => `(${colunas.map(() => "?").join(", ")})`).join(", ");
    await txn.runAsync(
      `INSERT INTO ${tabela} (${colunas.join(", ")}) VALUES ${placeholders}`,
      lote.flat()
    );
  }
}

export async function substituirDadosPessoais(ownerId: string, dados: DadosPessoais): Promise<void> {
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync("DELETE FROM colecoes_associacoes WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM colecoes WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM grifos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM capitulos_lidos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM notas WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM livros_lidos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM pesquisas_favoritas WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM versiculos_salvos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM progresso_planos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM sessoes_planos WHERE ownerId = ?", [ownerId]);
    await txn.runAsync("DELETE FROM perfil WHERE ownerId = ?", [ownerId]);

    const grifos: Linha[] = dados.grifos.map((item) => [ownerId, item.livroSlug, item.capitulo, item.versiculo, item.cor ?? null, item.criadoEm]);
    const capitulos: Linha[] = dados.capitulosLidos.map((item) => [ownerId, item.livroSlug, item.capitulo, item.lidoEm]);
    const notas: Linha[] = dados.notas.flatMap((nota) => {
      const referencias: ReferenciaVersiculo[] = nota.referencias?.length
        ? nota.referencias
        : [{ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo }];
      return referencias.map((ref) => [ownerId, ref.livroSlug, ref.capitulo, ref.versiculo, nota.texto, nota.criadoEm, nota.atualizadoEm, nota.grupoId ?? null]);
    });
    const livros: Linha[] = dados.livrosLidos.map((slug) => [ownerId, slug, dados.exportadoEm]);
    const pesquisas: Linha[] = dados.pesquisasFavoritas.map((item) => [ownerId, item.termo.trim(), item.criadoEm]);
    const salvos: Linha[] = dados.versiculosSalvos.map((item) => [ownerId, item.livroSlug, item.capitulo, item.versiculo, item.salvoEm]);
    const progressoPlanos: Linha[] = dados.planos.flatMap((plano) => plano.diasConcluidos.map((dia) => [
      ownerId, plano.planoId, dia, plano.datasConclusao?.[String(dia)] ?? dados.exportadoEm,
    ]));
    const sessoes: Linha[] = dados.sessoesPlanos.map((item) => [ownerId, item.planoId, item.dia, item.indiceAtual, JSON.stringify(item.referenciasConcluidas), item.atualizadoEm]);
    const mapaColecoes = new Map(dados.colecoes.map((item) => [item.id, randomUUID()]));
    const colecoes: Linha[] = dados.colecoes.map((item) => [mapaColecoes.get(item.id)!, ownerId, item.nome, item.cor ?? null, item.criadoEm, item.atualizadoEm]);
    const associacoes: Linha[] = dados.associacoesColecoes.map((item) => [ownerId, mapaColecoes.get(item.colecaoId)!, item.itemChave]);

    await inserirLote(txn, "grifos", ["ownerId", "livroSlug", "capitulo", "versiculo", "cor", "criadoEm"], grifos);
    await inserirLote(txn, "capitulos_lidos", ["ownerId", "livroSlug", "capitulo", "lidoEm"], capitulos);
    await inserirLote(txn, "notas", ["ownerId", "livroSlug", "capitulo", "versiculo", "texto", "criadoEm", "atualizadoEm", "grupoId"], notas);
    await inserirLote(txn, "livros_lidos", ["ownerId", "livroSlug", "lidoEm"], livros);
    await inserirLote(txn, "pesquisas_favoritas", ["ownerId", "termo", "favoritaEm"], pesquisas);
    await inserirLote(txn, "versiculos_salvos", ["ownerId", "livroSlug", "capitulo", "versiculo", "salvoEm"], salvos);
    await inserirLote(txn, "progresso_planos", ["ownerId", "planoId", "diaConcluido", "concluidoEm"], progressoPlanos);
    await inserirLote(txn, "sessoes_planos", ["ownerId", "planoId", "dia", "indiceAtual", "referenciasConcluidas", "atualizadoEm"], sessoes);
    await inserirLote(txn, "colecoes", ["id", "ownerId", "nome", "cor", "criadoEm", "atualizadoEm"], colecoes);
    await inserirLote(txn, "colecoes_associacoes", ["ownerId", "colecaoId", "itemChave"], associacoes);
    await inserirLote(txn, "perfil", ["ownerId", "nome", "avatarUri"], [[ownerId, dados.perfil.nome, dados.perfil.avatarUri]]);
  });
}
