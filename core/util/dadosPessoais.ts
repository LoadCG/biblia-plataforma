// Exportar/apagar meus dados — direito básico de privacidade (ver
// FUNCIONALIDADES.md 6.4), disponível mesmo sem conta: hoje todo dado do
// app já é isolado por `ownerId` anônimo por dispositivo, então exportar/
// apagar já faz sentido antes de qualquer sistema de login existir.
import { planosLeitura } from "../content/planos";
import {
  grifosRepository,
  livrosLidosRepository,
  notasRepository,
  pesquisasFavoritasRepository,
  planosRepository,
  progressoRepository,
  versiculosSalvosRepository,
} from "../repositories";
import type { Grifo, Nota, PesquisaFavorita, CapituloLido, VersiculoSalvo } from "../types/leitura";

export type DadosPessoais = {
  exportadoEm: string;
  grifos: Grifo[];
  capitulosLidos: CapituloLido[];
  notas: Nota[];
  livrosLidos: string[];
  pesquisasFavoritas: PesquisaFavorita[];
  versiculosSalvos: VersiculoSalvo[];
  planos: { planoId: string; diasConcluidos: number[] }[];
};

export async function coletarDadosPessoais(ownerId: string): Promise<DadosPessoais> {
  const [grifos, capitulosLidos, notas, livrosLidos, pesquisasFavoritas, versiculosSalvos] = await Promise.all([
    grifosRepository.listarTodos(ownerId),
    progressoRepository.listarTodos(ownerId),
    notasRepository.listarTodas(ownerId),
    livrosLidosRepository.listar(ownerId),
    pesquisasFavoritasRepository.listarTodas(ownerId),
    versiculosSalvosRepository.listarTodos(ownerId),
  ]);

  const planos = (
    await Promise.all(
      planosLeitura.map(async (plano) => ({
        planoId: plano.id,
        diasConcluidos: await planosRepository.listarDiasConcluidos(ownerId, plano.id),
      }))
    )
  ).filter((p) => p.diasConcluidos.length > 0);

  return {
    exportadoEm: new Date().toISOString(),
    grifos,
    capitulosLidos,
    notas,
    livrosLidos,
    pesquisasFavoritas,
    versiculosSalvos,
    planos,
  };
}

// Reaproveita os métodos de alternar/remover já existentes em cada
// repositório (todos idempotentes: chamar em cima de um item existente
// sempre remove) em vez de criar um `apagarTudo` novo em cada um —
// menos superfície de código pra uma ação que, na prática, roda raras
// vezes (o usuário decide apagar tudo, não é um caminho quente).
export async function apagarDadosPessoais(ownerId: string, dados: DadosPessoais): Promise<void> {
  await Promise.all([
    ...dados.grifos.map((g) => grifosRepository.alternar(ownerId, g)),
    dados.capitulosLidos.length
      ? progressoRepository.definirVarios(
          ownerId,
          dados.capitulosLidos.map((c) => ({ livroSlug: c.livroSlug, capitulo: c.capitulo })),
          false
        )
      : null,
    ...dados.notas.map((n) => notasRepository.remover(ownerId, n)),
    ...dados.livrosLidos.map((slug) => livrosLidosRepository.alternar(ownerId, slug)),
    ...dados.pesquisasFavoritas.map((p) => pesquisasFavoritasRepository.alternar(ownerId, p.termo)),
    ...dados.versiculosSalvos.map((v) => versiculosSalvosRepository.alternar(ownerId, v)),
    ...dados.planos.map((p) =>
      Promise.all(p.diasConcluidos.map((dia) => planosRepository.alternarDiaConcluido(ownerId, p.planoId, dia)))
    ),
  ]);
}
