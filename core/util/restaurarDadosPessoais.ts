import { substituirDadosPessoais } from "../repositories/substituirDadosPessoais";
import { aplicarPreferenciasRestauraveis } from "../storage/estadoUsuario";
import { coletarDadosPessoais, type DadosPessoais } from "./dadosPessoais";
import { exigirRecuperacaoAntesDeAcessarDados, limparSnapshotDeRecuperacao, salvarSnapshotDeRecuperacao } from "./restauracaoPendente";
import { notificarRestauracaoDadosConcluida } from "./eventoDadosPessoais";

export class ErroRestauracaoBackup extends Error {
  constructor(message: string, readonly recuperacaoPendente = false) {
    super(message);
    this.name = "ErroRestauracaoBackup";
  }
}

function quantidades(dados: DadosPessoais) {
  return {
    grifos: dados.grifos.length,
    capitulosLidos: dados.capitulosLidos.length,
    referenciasEmNotas: dados.notas.reduce((total, nota) => total + (nota.referencias?.length ?? 1), 0),
    livrosLidos: dados.livrosLidos.length,
    pesquisasFavoritas: dados.pesquisasFavoritas.length,
    versiculosSalvos: dados.versiculosSalvos.length,
    diasConcluidos: dados.planos.reduce((total, plano) => total + plano.diasConcluidos.length, 0),
    sessoesPlanos: dados.sessoesPlanos.length,
    colecoes: dados.colecoes.length,
    associacoesColecoes: dados.associacoesColecoes.length,
  };
}

export async function restaurarDadosPessoais(ownerId: string, dados: DadosPessoais): Promise<void> {
  const snapshot = await coletarDadosPessoais(ownerId);
  await salvarSnapshotDeRecuperacao({ ownerId, snapshot });

  try {
    await substituirDadosPessoais(ownerId, dados);
    await aplicarPreferenciasRestauraveis(dados.preferenciasLocais);
    const restaurados = await coletarDadosPessoais(ownerId);
    const esperado = quantidades(dados);
    const encontrado = quantidades(restaurados);
    const categoriaDivergente = Object.keys(esperado).find(
      (chave) => esperado[chave as keyof typeof esperado] !== encontrado[chave as keyof typeof encontrado]
    );
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
