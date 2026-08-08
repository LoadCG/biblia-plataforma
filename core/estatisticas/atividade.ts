// Junta grifos, notas e pesquisas favoritas numa lista única ordenada
// por data — é o dado que alimenta o card "Salvo" e a seção
// "Atividade" da aba Você, e a tela /salvo completa.
import { grifosRepository, notasRepository, pesquisasFavoritasRepository } from "../repositories";

export type ItemAtividade =
  | { tipo: "grifo"; livroSlug: string; capitulo: number; versiculo: number; criadoEm: string }
  | { tipo: "nota"; livroSlug: string; capitulo: number; versiculo: number; texto: string; criadoEm: string }
  | { tipo: "pesquisa"; termo: string; criadoEm: string };

export async function carregarAtividade(ownerId: string): Promise<ItemAtividade[]> {
  const [grifos, notas, pesquisas] = await Promise.all([
    grifosRepository.listarTodos(ownerId),
    notasRepository.listarTodas(ownerId),
    pesquisasFavoritasRepository.listarTodas(ownerId),
  ]);

  const itens: ItemAtividade[] = [
    ...grifos.map((g) => ({
      tipo: "grifo" as const,
      livroSlug: g.livroSlug,
      capitulo: g.capitulo,
      versiculo: g.versiculo,
      criadoEm: g.criadoEm,
    })),
    ...notas.map((n) => ({
      tipo: "nota" as const,
      livroSlug: n.livroSlug,
      capitulo: n.capitulo,
      versiculo: n.versiculo,
      texto: n.texto,
      criadoEm: n.criadoEm,
    })),
    ...pesquisas.map((p) => ({ tipo: "pesquisa" as const, termo: p.termo, criadoEm: p.criadoEm })),
  ];

  return itens.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export function chaveAtividade(item: ItemAtividade): string {
  if (item.tipo === "pesquisa") return `pesquisa-${item.termo}`;
  return `${item.tipo}-${item.livroSlug}-${item.capitulo}-${item.versiculo}`;
}
