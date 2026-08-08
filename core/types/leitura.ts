// Tipos centrais dos dados do usuário (grifos, progresso, notas). Todo
// registro carrega `ownerId` desde o início — hoje é um UUID anônimo por
// dispositivo (ver core/owner.ts), amanhã vira o ID da conta, sem
// precisar mudar esses tipos nem os repositórios que os usam.

export type ReferenciaVersiculo = {
  livroSlug: string;
  capitulo: number;
  versiculo: number;
};

export type Grifo = ReferenciaVersiculo & {
  ownerId: string;
  criadoEm: string;
  cor?: string;
};

export type ReferenciaCapitulo = {
  livroSlug: string;
  capitulo: number;
};

export type CapituloLido = ReferenciaCapitulo & {
  ownerId: string;
  lidoEm: string;
};

export type Nota = ReferenciaVersiculo & {
  ownerId: string;
  texto: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type PesquisaFavorita = {
  ownerId: string;
  termo: string;
  criadoEm: string;
};
