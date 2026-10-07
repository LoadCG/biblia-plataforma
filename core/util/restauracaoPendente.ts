import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DadosPessoais } from "./dadosPessoais";
import { validarBackupJson } from "./validarBackup";
import { substituirDadosPessoais } from "../repositories/substituirDadosPessoais";
import { aplicarPreferenciasRestauraveis } from "../storage/estadoUsuario";

export const CHAVE_RESTAURACAO_PENDENTE = "restauracao-dados-pendente-v1";

type RestauracaoPendente = { versao: 1; ownerId: string; snapshot: DadosPessoais };
let acessoLocalBloqueado = false;

export function exigirRecuperacaoAntesDeAcessarDados() {
  acessoLocalBloqueado = true;
}

export function acessoLocalPrecisaDeRecuperacao() {
  return acessoLocalBloqueado;
}

export async function salvarSnapshotDeRecuperacao(pendente: Omit<RestauracaoPendente, "versao">): Promise<void> {
  await AsyncStorage.setItem(CHAVE_RESTAURACAO_PENDENTE, JSON.stringify({ ...pendente, versao: 1 }));
}

export async function limparSnapshotDeRecuperacao(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_RESTAURACAO_PENDENTE);
}

/** Recupera a cópia anterior antes que as telas consultem os repositórios. */
export async function recuperarRestauracaoPendente(): Promise<void> {
  const bruto = await AsyncStorage.getItem(CHAVE_RESTAURACAO_PENDENTE);
  if (!bruto) return;
  let pendente: RestauracaoPendente;
  try {
    const valor: unknown = JSON.parse(bruto);
    if (!valor || typeof valor !== "object" || Array.isArray(valor)) throw new Error("Formato inválido");
    const registro = valor as Record<string, unknown>;
    if (registro.versao !== 1 || typeof registro.ownerId !== "string" || !registro.ownerId || !registro.snapshot || typeof registro.snapshot !== "object") {
      throw new Error("Marcador de recuperação incompleto");
    }
    pendente = { versao: 1, ownerId: registro.ownerId, snapshot: registro.snapshot as DadosPessoais };
    if (!pendente.snapshot.exportadoEm || !pendente.snapshot.perfil || !Array.isArray(pendente.snapshot.grifos) ||
      !Array.isArray(pendente.snapshot.capitulosLidos) || !Array.isArray(pendente.snapshot.notas) ||
      !Array.isArray(pendente.snapshot.livrosLidos) || !Array.isArray(pendente.snapshot.pesquisasFavoritas) ||
      !Array.isArray(pendente.snapshot.versiculosSalvos) || !Array.isArray(pendente.snapshot.planos) ||
      !pendente.snapshot.preferenciasLocais || !Array.isArray(pendente.snapshot.colecoes) ||
      !Array.isArray(pendente.snapshot.associacoesColecoes) || !Array.isArray(pendente.snapshot.sessoesPlanos)) {
      throw new Error("Cópia de recuperação incompatível");
    }
    // Snapshots locais anteriores podem anteceder o envelope versionado;
    // passam pelo mesmo parser seguro antes de serem regravados.
    const avatarLocal = pendente.snapshot.perfil.avatarUri;
    const normalizado = await validarBackupJson(JSON.stringify(pendente.snapshot));
    pendente.snapshot = normalizado.dados;
    // O parser de backup descarta caminhos de arquivo do dispositivo de origem;
    // na recuperação local, o avatar pertence ao mesmo dispositivo e deve voltar.
    pendente.snapshot.perfil.avatarUri = avatarLocal;
  } catch {
    throw new Error("A restauração foi interrompida e o arquivo de recuperação não pôde ser validado. Os dados não foram alterados novamente.");
  }

  await substituirDadosPessoais(pendente.ownerId, pendente.snapshot);
  await aplicarPreferenciasRestauraveis(pendente.snapshot.preferenciasLocais);
  await limparSnapshotDeRecuperacao();
  acessoLocalBloqueado = false;
}
