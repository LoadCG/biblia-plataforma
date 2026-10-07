import * as DocumentPicker from "expo-document-picker";
import { ErroBackup, TAMANHO_MAXIMO_BACKUP_BYTES } from "./validarBackup";

export async function selecionarArquivoBackup(): Promise<string | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    multiple: false,
    base64: false,
  });
  if (resultado.canceled || resultado.assets.length === 0) return null;
  const arquivo = resultado.assets[0];
  if (arquivo.size !== undefined && arquivo.size > TAMANHO_MAXIMO_BACKUP_BYTES) {
    throw new ErroBackup("O arquivo é grande demais para ser restaurado (limite: 10 MB).");
  }
  if (!arquivo.file) throw new ErroBackup("Não foi possível ler o arquivo selecionado no navegador.");
  const conteudo = await arquivo.file.text();
  if (conteudo.length > TAMANHO_MAXIMO_BACKUP_BYTES) {
    throw new ErroBackup("O arquivo é grande demais para ser restaurado (limite: 10 MB).");
  }
  return conteudo;
}
