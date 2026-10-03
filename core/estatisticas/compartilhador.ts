import { mostrarToast } from "../util/toast";
import { copiarTexto, compartilharTexto, type ResultadoCompartilhamento } from "../util/compartilhamento";
import { registrarCompartilhamento } from "./compartilhamentos";

type ResultadoAcao = ResultadoCompartilhamento | "falhou";

async function registrarSucesso(resultado: ResultadoCompartilhamento): Promise<void> {
  if (resultado !== "cancelado") {
    try {
      await registrarCompartilhamento();
    } catch {
      // Uma falha no contador local não deve alterar o resultado da ação.
    }
  }
  if (resultado === "compartilhado") {
    mostrarToast("Conteúdo compartilhado.", { severidade: "sucesso" });
  } else if (resultado === "copiado") {
    mostrarToast("Conteúdo copiado.", { severidade: "sucesso" });
  }
}

export async function compartilhar(texto: string): Promise<ResultadoAcao> {
  try {
    const resultado = await compartilharTexto(texto, { titulo: "Compartilhar versículo" });
    await registrarSucesso(resultado);
    return resultado;
  } catch {
    mostrarToast("Não foi possível compartilhar nem copiar o conteúdo. Verifique as permissões do navegador.", { severidade: "erro" });
    return "falhou";
  }
}

export async function copiar(texto: string): Promise<ResultadoAcao> {
  try {
    const resultado = await copiarTexto(texto);
    await registrarSucesso(resultado);
    return resultado;
  } catch {
    mostrarToast("Não foi possível copiar o conteúdo. Tente novamente.", { severidade: "erro" });
    return "falhou";
  }
}
