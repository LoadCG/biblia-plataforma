import { substituirDadosPessoais } from "../repositories/substituirDadosPessoais";
import { aplicarPreferenciasRestauraveis } from "../storage/estadoUsuario";
import { coletarDadosPessoais, type DadosPessoais } from "./dadosPessoais";
import { exigirRecuperacaoAntesDeAcessarDados, limparSnapshotDeRecuperacao, salvarSnapshotDeRecuperacao } from "./restauracaoPendente";
import { notificarRestauracaoDadosConcluida } from "./eventoDadosPessoais";
import type { Nota, ReferenciaVersiculo } from "../types/leitura";

export class ErroRestauracaoBackup extends Error {
  constructor(message: string, readonly recuperacaoPendente = false) {
    super(message);
    this.name = "ErroRestauracaoBackup";
  }
}

function compararListas<T>(esperado: T[], encontrado: T[], chave: (item: T) => string): boolean {
  if (esperado.length !== encontrado.length) return false;
  const chavesEsperadas = esperado.map(chave).sort();
  const chavesEncontradas = encontrado.map(chave).sort();
  return chavesEsperadas.every((valor, indice) => valor === chavesEncontradas[indice]);
}

function chaveReferencia(ref: ReferenciaVersiculo) {
  return `${ref.livroSlug}:${ref.capitulo}:${ref.versiculo}`;
}

function normalizarNotas(notas: Nota[]) {
  return notas.flatMap((nota) => {
    const referencias = nota.referencias?.length
      ? nota.referencias
      : [{ livroSlug: nota.livroSlug, capitulo: nota.capitulo, versiculo: nota.versiculo }];
    return referencias.map((ref) => JSON.stringify({
      ref: chaveReferencia(ref), texto: nota.texto, criadoEm: nota.criadoEm,
      atualizadoEm: nota.atualizadoEm, grupoId: nota.grupoId ?? null,
    }));
  });
}

function normalizarPreferencias(preferencias: Record<string, string | null>) {
  const chavesPortateis = ["ultima-leitura", "tamanho-fonte-leitura", "fonte-serifada-leitura", "tema-preferido"];
  return JSON.stringify(Object.fromEntries(chavesPortateis
    .map((chave) => [chave, preferencias[chave] ?? null])
    .sort(([a], [b]) => String(a).localeCompare(String(b)))));
}

export function identificarDivergenciaRestauracao(esperado: DadosPessoais, encontrado: DadosPessoais): string | null {
  const comparacoes: [string, boolean][] = [
    ["perfil", esperado.perfil.nome === encontrado.perfil.nome && esperado.perfil.avatarUri === encontrado.perfil.avatarUri],
    ["grifos", compararListas(esperado.grifos, encontrado.grifos, (item) => JSON.stringify({
      ref: chaveReferencia(item), cor: item.cor ?? null, criadoEm: item.criadoEm,
    }))],
    ["capítulos lidos", compararListas(esperado.capitulosLidos, encontrado.capitulosLidos, (item) => JSON.stringify({
      livroSlug: item.livroSlug, capitulo: item.capitulo, lidoEm: item.lidoEm,
    }))],
    ["anotações", compararListas(normalizarNotas(esperado.notas), normalizarNotas(encontrado.notas), (item) => item)],
    ["livros lidos", compararListas(esperado.livrosLidos, encontrado.livrosLidos, (item) => item)],
    ["pesquisas favoritas", compararListas(esperado.pesquisasFavoritas, encontrado.pesquisasFavoritas, (item) => JSON.stringify({ termo: item.termo.trim(), criadoEm: item.criadoEm }))],
    ["versículos salvos", compararListas(esperado.versiculosSalvos, encontrado.versiculosSalvos, (item) => JSON.stringify({
      ref: chaveReferencia(item), salvoEm: item.salvoEm,
    }))],
    ["sessões de planos", compararListas(esperado.sessoesPlanos, encontrado.sessoesPlanos, (item) => JSON.stringify({ ...item, ownerId: undefined }))],
    ["preferências", normalizarPreferencias(esperado.preferenciasLocais) === normalizarPreferencias(encontrado.preferenciasLocais)],
  ];
  const falha = comparacoes.find(([, corresponde]) => !corresponde);
  if (falha) return falha[0];

  const conclusoesEsperadas = esperado.planos.flatMap((plano) => plano.diasConcluidos.map((dia) => ({
    planoId: plano.planoId, dia, concluidoEm: plano.datasConclusao?.[String(dia)] ?? esperado.exportadoEm,
  })));
  const conclusoesEncontradas = encontrado.planos.flatMap((plano) => plano.diasConcluidos.map((dia) => ({
    planoId: plano.planoId, dia, concluidoEm: plano.datasConclusao?.[String(dia)] ?? encontrado.exportadoEm,
  })));
  if (!compararListas(conclusoesEsperadas, conclusoesEncontradas, (item) => JSON.stringify(item))) return "progresso dos planos";

  const colecoesEsperadas = esperado.colecoes.map(({ id: _id, ownerId: _ownerId, ...item }) => JSON.stringify(item)).sort();
  const colecoesEncontradas = encontrado.colecoes.map(({ id: _id, ownerId: _ownerId, ...item }) => JSON.stringify(item)).sort();
  if (!compararListas(colecoesEsperadas, colecoesEncontradas, (item) => item)) return "coleções";

  const nomesPorIdEsperado = new Map(esperado.colecoes.map((item) => [item.id, JSON.stringify({ nome: item.nome, cor: item.cor ?? null, criadoEm: item.criadoEm, atualizadoEm: item.atualizadoEm })]));
  const nomesPorIdEncontrado = new Map(encontrado.colecoes.map((item) => [item.id, JSON.stringify({ nome: item.nome, cor: item.cor ?? null, criadoEm: item.criadoEm, atualizadoEm: item.atualizadoEm })]));
  const associacoesEsperadas = esperado.associacoesColecoes.map((item) => JSON.stringify({ colecao: nomesPorIdEsperado.get(item.colecaoId), itemChave: item.itemChave }));
  const associacoesEncontradas = encontrado.associacoesColecoes.map((item) => JSON.stringify({ colecao: nomesPorIdEncontrado.get(item.colecaoId), itemChave: item.itemChave }));
  if (!compararListas(associacoesEsperadas, associacoesEncontradas, (item) => item)) return "associações das coleções";
  return null;
}

export async function restaurarDadosPessoais(ownerId: string, dados: DadosPessoais): Promise<void> {
  const snapshot = await coletarDadosPessoais(ownerId);
  await salvarSnapshotDeRecuperacao({ ownerId, snapshot });

  try {
    await substituirDadosPessoais(ownerId, dados);
    await aplicarPreferenciasRestauraveis(dados.preferenciasLocais);
    const restaurados = await coletarDadosPessoais(ownerId);
    const categoriaDivergente = identificarDivergenciaRestauracao(dados, restaurados);
    if (categoriaDivergente) {
      throw new Error(`A conferência dos dados restaurados encontrou diferenças em ${categoriaDivergente}.`);
    }
    await limparSnapshotDeRecuperacao();
    notificarRestauracaoDadosConcluida();
  } catch {
    try {
      await substituirDadosPessoais(ownerId, snapshot);
      await aplicarPreferenciasRestauraveis(snapshot.preferenciasLocais);
      await limparSnapshotDeRecuperacao();
      throw new ErroRestauracaoBackup("Não foi possível concluir a restauração. Os dados anteriores foram recuperados.");
    } catch (erro) {
      if (erro instanceof ErroRestauracaoBackup) throw erro;
      exigirRecuperacaoAntesDeAcessarDados();
      notificarRestauracaoDadosConcluida();
      throw new ErroRestauracaoBackup(
        "A restauração foi interrompida. O app tentará recuperar seus dados anteriores ao abrir novamente.",
        true
      );
    }
  }
}
