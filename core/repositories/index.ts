import { sqliteGrifosRepository } from "./sqlite/SqliteGrifosRepository";
import { sqliteProgressoRepository } from "./sqlite/SqliteProgressoRepository";
import { sqliteNotasRepository } from "./sqlite/SqliteNotasRepository";
import { sqliteLivrosLidosRepository } from "./sqlite/SqliteLivrosLidosRepository";
import { sqlitePesquisasFavoritasRepository } from "./sqlite/SqlitePesquisasFavoritasRepository";
import { sqliteVersiculosSalvosRepository } from "./sqlite/SqliteVersiculosSalvosRepository";
import { sqlitePlanosRepository } from "./sqlite/SqlitePlanosRepository";

// No nativo (iOS/Android), exportamos os repositórios reais do SQLite.

export const grifosRepository = sqliteGrifosRepository;
export const progressoRepository = sqliteProgressoRepository;
export const notasRepository = sqliteNotasRepository;
export const livrosLidosRepository = sqliteLivrosLidosRepository;
export const pesquisasFavoritasRepository = sqlitePesquisasFavoritasRepository;
export const versiculosSalvosRepository = sqliteVersiculosSalvosRepository;
export const planosRepository = sqlitePlanosRepository;

export { obterOwnerId } from "../owner";
