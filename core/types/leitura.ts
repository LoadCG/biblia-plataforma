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
  id?: number;
  ownerId: string;
  criadoEm: string;
  cor?: string;
};

export type ReferenciaCapitulo = {
  livroSlug: string;
  capitulo: number;
};

export type CapituloLido = ReferenciaCapitulo & {
  id?: number;
  ownerId: string;
  lidoEm: string;
};

export type Nota = ReferenciaVersiculo & {
  id?: number;
  ownerId: string;
  texto: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type PesquisaFavorita = {
  id?: number;
  ownerId: string;
  termo: string;
  criadoEm: string;
};

export type VersiculoSalvo = ReferenciaVersiculo & {
  id?: number;
  ownerId: string;
  salvoEm: string;
};
