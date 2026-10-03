import { mostrarToast } from "../util/toast";
import { copiarTexto, compartilharTexto, type OpcoesCompartilhamento, type ResultadoCompartilhamento } from "../util/compartilhamento";
import { registrarCompartilhamento } from "./compartilhamentos";

type ResultadoAcao = ResultadoCompartilhamento | "falhou";
type OpcoesAcao = OpcoesCompartilhamento & { mensagemCompartilhado?: string; mensagemCopiado?: string };

async function registrarSucesso(resultado: ResultadoCompartilhamento, opcoes: OpcoesAcao): Promise<void> {
  if (resultado !== "cancelado") {
    try {
      await registrarCompartilhamento();
    } catch {
      // Uma falha no contador local não deve alterar o resultado da ação.
    }
  }
  if (resultado === "compartilhado") {
    mostrarToast(opcoes.mensagemCompartilhado ?? "Conteúdo compartilhado.", { severidade: "sucesso" });
  } else if (resultado === "copiado") {
    mostrarToast(opcoes.mensagemCopiado ?? "Conteúdo copiado.", { severidade: "sucesso" });
  }
}

export async function compartilhar(texto: string, opcoes: OpcoesAcao = {}): Promise<ResultadoAcao> {
  try {
    const resultado = await compartilharTexto(texto, {
      titulo: opcoes.titulo ?? "Compartilhar versículo",
      url: opcoes.url,
      textoCopiado: opcoes.textoCopiado,
    });
    await registrarSucesso(resultado, opcoes);
    return resultado;
  } catch {
    mostrarToast("Não foi possível compartilhar nem copiar o conteúdo. Verifique as permissões do navegador.", { severidade: "erro" });
    return "falhou";
  }
}

export async function copiar(texto: string, opcoes: OpcoesAcao = {}): Promise<ResultadoAcao> {
  try {
    const resultado = await copiarTexto(texto);
    await registrarSucesso(resultado, opcoes);
    return resultado;
  } catch {
    mostrarToast("Não foi possível copiar o conteúdo. Tente novamente.", { severidade: "erro" });
    return "falhou";
  }
}
