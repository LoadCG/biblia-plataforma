export type Perfil = {
  nome: string;
  avatarUri: string | null;
};

export const PERFIL_PADRAO: Perfil = { nome: "Visitante", avatarUri: null };

// Perfil local, sem conta — mesma decisão de "ownerId trocável" do
// resto do app (ver PLANO-PLATAFORMA.md Decisão 2): guarda nome/foto
// por dispositivo hoje, pronto pra virar perfil de conta de verdade
// mais tarde sem mudar quem consome isto.
export interface PerfilRepository {
  obter(ownerId: string): Promise<Perfil>;
  salvar(ownerId: string, perfil: Perfil): Promise<void>;
}
