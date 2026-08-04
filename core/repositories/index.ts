// Único lugar do projeto que decide qual implementação de cada
// repositório está ativa. Hoje: local (AsyncStorage). Quando o banco de
// dados entrar (Supabase/Firebase, ver PLANO-PLATAFORMA.md), troca-se a
// importação aqui — nenhuma tela precisa mudar, porque todas dependem só
// da interface (GrifosRepository, ProgressoRepository, NotasRepository).
import { localGrifosRepository } from "./local/LocalGrifosRepository";
import { localProgressoRepository } from "./local/LocalProgressoRepository";
import { localNotasRepository } from "./local/LocalNotasRepository";
import { localLivrosLidosRepository } from "./local/LocalLivrosLidosRepository";

export const grifosRepository = localGrifosRepository;
export const progressoRepository = localProgressoRepository;
export const notasRepository = localNotasRepository;
export const livrosLidosRepository = localLivrosLidosRepository;

export { obterOwnerId } from "../owner";
