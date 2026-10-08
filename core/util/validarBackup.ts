import type { AssociacaoColecao, Colecao } from "../repositories/ColecoesRepository";
import type { SessaoPlano } from "../repositories/PlanosRepository";
import type { DadosPessoais } from "./dadosPessoais";
import type { CapituloLido, Grifo, Nota, PesquisaFavorita, ReferenciaVersiculo, VersiculoSalvo } from "../types/leitura";
import { normalizarVelocidadeAudio } from "../leitura/constantesAudio";

export const TAMANHO_MAXIMO_BACKUP_BYTES = 10 * 1024 * 1024;
export const VERSAO_BACKUP_ATUAL = 1;

type Objeto = Record<string, unknown>;
type CatalogoBiblico = Map<string, number[]>;

export type ResumoBackup = {
  exportadoEm: string;
  grifos: number;
  capitulosLidos: number;
  notas: number;
  versiculosEmNotas: number;
  livrosLidos: number;
  pesquisasFavoritas: number;
  versiculosSalvos: number;
  diasConcluidos: number;
  sessoesPlanos: number;
  colecoes: number;
  associacoesColecoes: number;
  fotoPerfilNaoIncluida: boolean;
};

export type BackupValidado = { dados: DadosPessoais; resumo: ResumoBackup };

export class ErroBackup extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErroBackup";
  }
}

function objeto(valor: unknown, caminho: string): Objeto {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    throw new ErroBackup(`O campo ${caminho} precisa ser um objeto.`);
  }
  return valor as Objeto;
}

function lista(valor: unknown, caminho: string): unknown[] {
  if (!Array.isArray(valor)) throw new ErroBackup(`O campo ${caminho} precisa ser uma lista.`);
  return valor;
}

function texto(valor: unknown, caminho: string, limite = 50000, permitirVazio = false): string {
  if (typeof valor !== "string" || valor.length > limite || (!permitirVazio && !valor.trim())) {
    throw new ErroBackup(`O campo ${caminho} está vazio ou tem um formato inválido.`);
  }
  return valor;
}

function dataIso(valor: unknown, caminho: string): string {
  const resultado = texto(valor, caminho, 64);
  if (!Number.isFinite(Date.parse(resultado))) throw new ErroBackup(`A data em ${caminho} é inválida.`);
  return resultado;
}

function inteiro(valor: unknown, caminho: string, minimo = 1, maximo = 100000): number {
  if (typeof valor !== "number" || !Number.isSafeInteger(valor) || valor < minimo || valor > maximo) {
    throw new ErroBackup(`O número em ${caminho} está fora do intervalo aceito.`);
  }
  return valor;
}

function unico<T>(itens: T[], chave: (item: T) => string, caminho: string) {
  const vistos = new Set<string>();
  for (const item of itens) {
    const id = chave(item);
    if (vistos.has(id)) throw new ErroBackup(`Há itens duplicados em ${caminho}.`);
    vistos.add(id);
  }
}

function chaveReferencia(ref: ReferenciaVersiculo) {
  return `${ref.livroSlug}:${ref.capitulo}:${ref.versiculo}`;
}

async function carregarCatalogoBiblico(): Promise<CatalogoBiblico> {
  const [{ livros }, bibliaModulo] = await Promise.all([
    import("../content/livros"),
    import("../../assets/biblia.json"),
  ]);
  const biblia = (bibliaModulo as unknown as { default?: unknown }).default ?? bibliaModulo;
  if (!Array.isArray(biblia)) throw new ErroBackup("Não foi possível validar o catálogo bíblico deste app.");

  const capitulosPorAbreviacao = new Map<string, number[]>();
  for (const item of biblia) {
    const registro = objeto(item, "catálogo bíblico");
    if (typeof registro.abbrev !== "string" || !Array.isArray(registro.chapters)) continue;
    capitulosPorAbreviacao.set(registro.abbrev, registro.chapters.map((capitulo) => Array.isArray(capitulo) ? capitulo.length : 0));
  }

  const catalogo: CatalogoBiblico = new Map();
  for (const livro of livros) {
    const contagens = livro.abreviacao ? capitulosPorAbreviacao.get(livro.abreviacao) : undefined;
    if (contagens) catalogo.set(livro.slug, contagens);
  }
  if (catalogo.size !== livros.length) throw new ErroBackup("O catálogo bíblico deste app está incompleto.");
  return catalogo;
}

function validarReferencia(valor: unknown, caminho: string, catalogo: CatalogoBiblico): ReferenciaVersiculo {
  const registro = objeto(valor, caminho);
  const livroSlug = texto(registro.livroSlug, `${caminho}.livroSlug`, 80);
  const capitulos = catalogo.get(livroSlug);
  if (!capitulos) throw new ErroBackup(`O livro bíblico em ${caminho} não existe neste app.`);
  const capitulo = inteiro(registro.capitulo, `${caminho}.capitulo`, 1, capitulos.length);
  const versiculo = inteiro(registro.versiculo, `${caminho}.versiculo`, 1, capitulos[capitulo - 1]);
  return { livroSlug, capitulo, versiculo };
}

function preferenciaRestauravel(preferencias: unknown, catalogo: CatalogoBiblico) {
  const origem = objeto(preferencias, "preferenciasLocais");
  const resultado: Record<string, string | null> = {};
  const tamanho = origem["tamanho-fonte-leitura"];
  if (tamanho !== undefined && tamanho !== null) {
    const indice = Number(tamanho);
    if (!Number.isInteger(indice) || indice < 0 || indice > 2) throw new ErroBackup("O tamanho de fonte salvo no backup é inválido.");
    resultado["tamanho-fonte-leitura"] = String(indice);
  }
  const serifada = origem["fonte-serifada-leitura"];
  if (serifada !== undefined && serifada !== null) {
    if (serifada !== "0" && serifada !== "1") throw new ErroBackup("A preferência de fonte salva no backup é inválida.");
    resultado["fonte-serifada-leitura"] = serifada;
  }
  const tema = origem["tema-preferido"];
  if (tema !== undefined && tema !== null) {
    if (tema !== "light" && tema !== "dark") throw new ErroBackup("O tema salvo no backup é inválido.");
    resultado["tema-preferido"] = tema;
  }
  const velocidade = origem["velocidade-leitura-dispositivo"];
  if (velocidade !== undefined && velocidade !== null) {
    const normalizada = typeof velocidade === "string" ? normalizarVelocidadeAudio(velocidade) : null;
    if (normalizada === null) {
      throw new ErroBackup("A velocidade de leitura salva no backup é inválida.");
    }
    resultado["velocidade-leitura-dispositivo"] = normalizada;
  }
  const ultimaLeitura = origem["ultima-leitura"];
  if (ultimaLeitura !== undefined && ultimaLeitura !== null) {
    let leitura: unknown;
    try { leitura = JSON.parse(texto(ultimaLeitura, "preferenciasLocais.ultima-leitura", 256)); }
    catch { throw new ErroBackup("A última leitura salva no backup é inválida."); }
    const registro = objeto(leitura, "preferenciasLocais.ultima-leitura");
    const referencia = validarReferencia({ ...registro, versiculo: 1 }, "preferenciasLocais.ultima-leitura", catalogo);
    resultado["ultima-leitura"] = JSON.stringify({ livroSlug: referencia.livroSlug, capitulo: referencia.capitulo });
  }
  return resultado;
}

export async function validarBackupJson(conteudo: string): Promise<BackupValidado> {
  if (conteudo.length > TAMANHO_MAXIMO_BACKUP_BYTES) {
    throw new ErroBackup("O arquivo é grande demais para ser restaurado (limite: 10 MB). ");
  }

  let bruto: unknown;
  try { bruto = JSON.parse(conteudo); }
  catch { throw new ErroBackup("O arquivo não contém um JSON válido."); }

  const raiz = objeto(bruto, "arquivo");
  const versao = raiz.versaoFormato === undefined ? 0 : inteiro(raiz.versaoFormato, "versaoFormato", 1, 1000);
  if (versao > VERSAO_BACKUP_ATUAL) throw new ErroBackup("Este backup foi criado por uma versão mais nova do app. Atualize o app antes de restaurá-lo.");
  if (versao !== 0 && versao !== VERSAO_BACKUP_ATUAL) throw new ErroBackup("A versão deste backup não é compatível com o app.");

  const exportadoEm = dataIso(raiz.exportadoEm, "exportadoEm");
  const catalogo = await carregarCatalogoBiblico();
  const [{ planosLeitura }, { livros }] = await Promise.all([
    import("../content/planos"),
    import("../content/livros"),
  ]);
  const livroSlugs = new Set(livros.map((livro) => livro.slug));
  const planoPorId = new Map(planosLeitura.map((plano) => [plano.id, plano]));
  let totalRegistros = 0;
  const contar = (quantidade: number, caminho: string) => {
    totalRegistros += quantidade;
    if (totalRegistros > 100000) throw new ErroBackup(`O backup ultrapassa o limite de registros em ${caminho}.`);
  };

  const perfilBruto = objeto(raiz.perfil, "perfil");
  const nomePerfil = texto(perfilBruto.nome, "perfil.nome", 100);
  const fotoPerfilNaoIncluida = perfilBruto.avatarUri !== null && perfilBruto.avatarUri !== undefined;
  const perfil = { nome: nomePerfil, avatarUri: null };

  const grifos = lista(raiz.grifos, "grifos").map((valor, indice): Grifo => {
    const caminho = `grifos[${indice}]`;
    const referencia = validarReferencia(valor, caminho, catalogo);
    const registro = objeto(valor, caminho);
    const cor = registro.cor;
    const coresPermitidas = [
      "bg-yellow-300/40 dark:bg-yellow-600/30", "bg-red-300/40 dark:bg-red-600/30",
      "bg-green-300/40 dark:bg-green-600/30", "bg-blue-300/40 dark:bg-blue-600/30",
      "bg-purple-300/40 dark:bg-purple-600/30", "bg-orange-300/40 dark:bg-orange-600/30",
    ];
    if (cor !== undefined && cor !== null && !coresPermitidas.includes(String(cor))) throw new ErroBackup(`A cor em ${caminho} não é aceita.`);
    return { ...referencia, ownerId: "", criadoEm: dataIso(registro.criadoEm, `${caminho}.criadoEm`), ...(cor ? { cor: String(cor) } : {}) };
  });
  unico(grifos, chaveReferencia, "grifos"); contar(grifos.length, "grifos");

  const capitulosLidos = lista(raiz.capitulosLidos, "capitulosLidos").map((valor, indice): CapituloLido => {
    const caminho = `capitulosLidos[${indice}]`;
    const registro = objeto(valor, caminho);
    const ref = validarReferencia({ ...registro, versiculo: 1 }, caminho, catalogo);
    return { livroSlug: ref.livroSlug, capitulo: ref.capitulo, ownerId: "", lidoEm: dataIso(registro.lidoEm, `${caminho}.lidoEm`) };
  });
  unico(capitulosLidos, (item) => `${item.livroSlug}:${item.capitulo}`, "capitulosLidos"); contar(capitulosLidos.length, "capitulosLidos");

  const notas: Nota[] = [];
  const chavesNotas = new Set<string>();
  const gruposNotas = new Set<string>();
  const chavesAtividade = new Set<string>();
  let versiculosEmNotas = 0;
  for (const [indice, valor] of lista(raiz.notas, "notas").entries()) {
    const caminho = `notas[${indice}]`;
    const registro = objeto(valor, caminho);
    const base = validarReferencia(registro, caminho, catalogo);
    const referenciasBrutas = registro.referencias === undefined ? [base] : lista(registro.referencias, `${caminho}.referencias`);
    if (referenciasBrutas.length < 1 || referenciasBrutas.length > 1000) throw new ErroBackup(`A quantidade de versículos em ${caminho} é inválida.`);
    const referencias = referenciasBrutas.map((ref, posicao) => validarReferencia(ref, `${caminho}.referencias[${posicao}]`, catalogo));
    unico(referencias, chaveReferencia, `${caminho}.referencias`);
    if (!referencias.some((ref) => chaveReferencia(ref) === chaveReferencia(base))) throw new ErroBackup(`A referência principal de ${caminho} não pertence ao grupo.`);
    const grupoId = registro.grupoId === undefined || registro.grupoId === null ? undefined : texto(registro.grupoId, `${caminho}.grupoId`, 128);
    if (referencias.length > 1 && !grupoId) throw new ErroBackup(`A nota multi-versículo em ${caminho} não tem identificador de grupo.`);
    if (grupoId && gruposNotas.has(grupoId)) throw new ErroBackup(`O grupo de anotações ${grupoId} está duplicado no backup.`);
    if (grupoId) gruposNotas.add(grupoId);
    const nota = {
      ...base,
      ownerId: "",
      texto: texto(registro.texto, `${caminho}.texto`, 50000, true),
      criadoEm: dataIso(registro.criadoEm, `${caminho}.criadoEm`),
      atualizadoEm: dataIso(registro.atualizadoEm ?? registro.criadoEm, `${caminho}.atualizadoEm`),
      ...(grupoId ? { grupoId } : {}),
      referencias,
    };
    for (const ref of referencias) {
      const chave = chaveReferencia(ref);
      if (chavesNotas.has(chave)) throw new ErroBackup("Há versículos repetidos entre as anotações do backup.");
      chavesNotas.add(chave);
    }
    versiculosEmNotas += referencias.length;
    notas.push(nota);
    chavesAtividade.add(grupoId ? `nota-grupo-${grupoId}` : `nota-${base.livroSlug}-${base.capitulo}-${base.versiculo}`);
  }
  contar(versiculosEmNotas, "notas");

  const livrosLidos = lista(raiz.livrosLidos, "livrosLidos").map((valor, indice) => {
    const slug = texto(valor, `livrosLidos[${indice}]`, 80);
    if (!livroSlugs.has(slug)) throw new ErroBackup(`O livro em livrosLidos[${indice}] não existe neste app.`);
    return slug;
  });
  unico(livrosLidos, (slug) => slug, "livrosLidos"); contar(livrosLidos.length, "livrosLidos");

  const pesquisasFavoritas = lista(raiz.pesquisasFavoritas, "pesquisasFavoritas").map((valor, indice): PesquisaFavorita => {
    const caminho = `pesquisasFavoritas[${indice}]`;
    const registro = objeto(valor, caminho);
    return { ownerId: "", termo: texto(registro.termo, `${caminho}.termo`, 200), criadoEm: dataIso(registro.criadoEm ?? registro.favoritaEm, `${caminho}.criadoEm`) };
  });
  unico(pesquisasFavoritas, (item) => item.termo.trim().toLocaleLowerCase("pt-BR"), "pesquisasFavoritas"); contar(pesquisasFavoritas.length, "pesquisasFavoritas");
  for (const pesquisa of pesquisasFavoritas) chavesAtividade.add(`pesquisa-${pesquisa.termo}`);

  const versiculosSalvos = lista(raiz.versiculosSalvos, "versiculosSalvos").map((valor, indice): VersiculoSalvo => {
    const caminho = `versiculosSalvos[${indice}]`;
    const ref = validarReferencia(valor, caminho, catalogo);
    const registro = objeto(valor, caminho);
    return { ...ref, ownerId: "", salvoEm: dataIso(registro.salvoEm, `${caminho}.salvoEm`) };
  });
  unico(versiculosSalvos, chaveReferencia, "versiculosSalvos"); contar(versiculosSalvos.length, "versiculosSalvos");
  for (const item of versiculosSalvos) chavesAtividade.add(`salvo-${item.livroSlug}-${item.capitulo}-${item.versiculo}`);
  for (const item of grifos) chavesAtividade.add(`grifo-${item.livroSlug}-${item.capitulo}-${item.versiculo}`);

  const planos = lista(raiz.planos, "planos").map((valor, indice) => {
    const caminho = `planos[${indice}]`;
    const registro = objeto(valor, caminho);
    const planoId = texto(registro.planoId, `${caminho}.planoId`, 100);
    const plano = planoPorId.get(planoId);
    if (!plano) throw new ErroBackup(`O plano em ${caminho} não existe nesta versão do app.`);
    const dias = lista(registro.diasConcluidos, `${caminho}.diasConcluidos`).map((dia, posicao) => inteiro(dia, `${caminho}.diasConcluidos[${posicao}]`, 1, plano.dias.length));
    unico(dias, (dia) => String(dia), `${caminho}.diasConcluidos`);
    const datasRaw = registro.datasConclusao === undefined ? {} : objeto(registro.datasConclusao, `${caminho}.datasConclusao`);
    const datasConclusao = Object.fromEntries(dias.map((dia) => [
      String(dia), dataIso(datasRaw[String(dia)] ?? exportadoEm, `${caminho}.datasConclusao.${dia}`),
    ]));
    contar(dias.length, caminho);
    return { planoId, diasConcluidos: dias, datasConclusao };
  });
  unico(planos, (plano) => plano.planoId, "planos");

  const sessoesPlanos = lista(raiz.sessoesPlanos, "sessoesPlanos").map((valor, indice): SessaoPlano => {
    const caminho = `sessoesPlanos[${indice}]`;
    const registro = objeto(valor, caminho);
    const planoId = texto(registro.planoId, `${caminho}.planoId`, 100);
    const dia = inteiro(registro.dia, `${caminho}.dia`);
    const plano = planoPorId.get(planoId);
    const diaPlano = plano?.dias.find((item) => item.dia === dia);
    if (!diaPlano) throw new ErroBackup(`A sessão em ${caminho} não corresponde a um dia disponível.`);
    const indiceAtual = inteiro(registro.indiceAtual, `${caminho}.indiceAtual`, 0, Math.max(0, diaPlano.referencias.length - 1));
    const concluidas = lista(registro.referenciasConcluidas, `${caminho}.referenciasConcluidas`).map((ref, posicao) => {
      const referencia = texto(ref, `${caminho}.referenciasConcluidas[${posicao}]`, 300);
      if (!diaPlano.referencias.includes(referencia)) throw new ErroBackup(`Há uma referência que não pertence à sessão em ${caminho}.`);
      return referencia;
    });
    unico(concluidas, (ref) => ref, `${caminho}.referenciasConcluidas`);
    contar(1, caminho);
    return { ownerId: "", planoId, dia, indiceAtual, referenciasConcluidas: concluidas, atualizadoEm: dataIso(registro.atualizadoEm, `${caminho}.atualizadoEm`) };
  });
  unico(sessoesPlanos, (sessao) => `${sessao.planoId}:${sessao.dia}`, "sessoesPlanos");

  const colecoes = lista(raiz.colecoes, "colecoes").map((valor, indice): Colecao => {
    const caminho = `colecoes[${indice}]`;
    const registro = objeto(valor, caminho);
    return {
      id: texto(registro.id, `${caminho}.id`, 128), ownerId: "",
      nome: texto(registro.nome, `${caminho}.nome`, 80),
      ...(typeof registro.cor === "string" ? { cor: texto(registro.cor, `${caminho}.cor`, 64) } : {}),
      criadoEm: dataIso(registro.criadoEm, `${caminho}.criadoEm`), atualizadoEm: dataIso(registro.atualizadoEm, `${caminho}.atualizadoEm`),
    };
  });
  unico(colecoes, (colecao) => colecao.id, "colecoes"); contar(colecoes.length, "colecoes");
  const idsColecoes = new Set(colecoes.map((colecao) => colecao.id));
  const associacoesColecoes = lista(raiz.associacoesColecoes, "associacoesColecoes").map((valor, indice): AssociacaoColecao => {
    const caminho = `associacoesColecoes[${indice}]`;
    const registro = objeto(valor, caminho);
    const colecaoId = texto(registro.colecaoId, `${caminho}.colecaoId`, 128);
    if (!idsColecoes.has(colecaoId)) throw new ErroBackup(`Uma associação em ${caminho} aponta para uma coleção ausente.`);
    const itemChave = texto(registro.itemChave, `${caminho}.itemChave`, 500);
    if (!chavesAtividade.has(itemChave)) throw new ErroBackup(`Uma associação em ${caminho} aponta para um item ausente do backup.`);
    contar(1, caminho);
    return { ownerId: "", colecaoId, itemChave };
  });
  unico(associacoesColecoes, (item) => `${item.colecaoId}:${item.itemChave}`, "associacoesColecoes");

  const preferenciasLocais = preferenciaRestauravel(raiz.preferenciasLocais, catalogo);
  const dados: DadosPessoais = {
    versaoFormato: VERSAO_BACKUP_ATUAL,
    exportadoEm,
    perfil,
    grifos,
    capitulosLidos,
    notas,
    livrosLidos,
    pesquisasFavoritas,
    versiculosSalvos,
    planos,
    preferenciasLocais,
    colecoes,
    associacoesColecoes,
    sessoesPlanos,
  };

  return {
    dados,
    resumo: {
      exportadoEm,
      grifos: grifos.length,
      capitulosLidos: capitulosLidos.length,
      notas: notas.length,
      versiculosEmNotas,
      livrosLidos: livrosLidos.length,
      pesquisasFavoritas: pesquisasFavoritas.length,
      versiculosSalvos: versiculosSalvos.length,
      diasConcluidos: planos.reduce((total, plano) => total + plano.diasConcluidos.length, 0),
      sessoesPlanos: sessoesPlanos.length,
      colecoes: colecoes.length,
      associacoesColecoes: associacoesColecoes.length,
      fotoPerfilNaoIncluida,
    },
  };
}
