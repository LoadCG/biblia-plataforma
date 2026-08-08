import { localGrifosRepository } from "./local/LocalGrifosRepository";
import { localProgressoRepository } from "./local/LocalProgressoRepository";
import { localNotasRepository } from "./local/LocalNotasRepository";
import { localLivrosLidosRepository } from "./local/LocalLivrosLidosRepository";
import { localPesquisasFavoritasRepository } from "./local/LocalPesquisasFavoritasRepository";
import { localVersiculosSalvosRepository } from "./local/LocalVersiculosSalvosRepository";

// Na web, o expo-sqlite causa erros de SharedArrayBuffer.
// Para testar interfaces rapidamente na web, usamos o AsyncStorage local e evitamos importar sqlite.

export const grifosRepository = localGrifosRepository;
export const progressoRepository = localProgressoRepository;
export const notasRepository = localNotasRepository;
export const livrosLidosRepository = localLivrosLidosRepository;
export const pesquisasFavoritasRepository = localPesquisasFavoritasRepository;
export const versiculosSalvosRepository = localVersiculosSalvosRepository;

export { obterOwnerId } from "../owner";
