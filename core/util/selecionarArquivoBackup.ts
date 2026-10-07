import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { ErroBackup, TAMANHO_MAXIMO_BACKUP_BYTES } from "./validarBackup";

export async function selecionarArquivoBackup(): Promise<string | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    multiple: false,
    copyToCacheDirectory: true,
    base64: false,
  });
  if (resultado.canceled || resultado.assets.length === 0) return null;
  const arquivo = resultado.assets[0];
  if (arquivo.size !== undefined && arquivo.size > TAMANHO_MAXIMO_BACKUP_BYTES) {
    throw new ErroBackup("O arquivo é grande demais para ser restaurado (limite: 10 MB).");
  }
  const conteudo = await FileSystem.readAsStringAsync(arquivo.uri);
  if (conteudo.length > TAMANHO_MAXIMO_BACKUP_BYTES) {
    throw new ErroBackup("O arquivo é grande demais para ser restaurado (limite: 10 MB).");
  }
  return conteudo;
}
