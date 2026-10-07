import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { coletarDadosPessoais, type DadosPessoais } from "../core/util/dadosPessoais";
import { restaurarDadosPessoais, ErroRestauracaoBackup } from "../core/util/restaurarDadosPessoais";
import { selecionarArquivoBackup } from "../core/util/selecionarArquivoBackup";
import { ErroBackup, validarBackupJson, type ResumoBackup } from "../core/util/validarBackup";
import { mostrarToast } from "../core/util/toast";

type Props = { visivel: boolean; ownerId: string | null; escuro: boolean; onFechar: () => void; onConcluido: () => void };

function contarDados(dados: DadosPessoais) {
  return dados.grifos.length + dados.capitulosLidos.length
    + dados.notas.reduce((total, nota) => total + (nota.referencias?.length ?? 1), 0)
    + dados.livrosLidos.length + dados.pesquisasFavoritas.length + dados.versiculosSalvos.length
    + dados.planos.reduce((total, plano) => total + plano.diasConcluidos.length, 0)
    + dados.sessoesPlanos.length + dados.colecoes.length + dados.associacoesColecoes.length;
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data));
}

function LinhaResumo({ titulo, valor }: { titulo: string; valor: number }) {
  if (valor === 0) return null;
  return <View className="flex-row justify-between py-1"><Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">{titulo}</Text><Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">{valor}</Text></View>;
}

export function RestaurarDadosModal({ visivel, ownerId, escuro, onFechar, onConcluido }: Props) {
  const [dados, setDados] = useState<DadosPessoais | null>(null);
  const [resumo, setResumo] = useState<ResumoBackup | null>(null);
  const [quantidadeAtual, setQuantidadeAtual] = useState(0);
  const [confirmacaoAtiva, setConfirmacaoAtiva] = useState(false);
  const [carregandoArquivo, setCarregandoArquivo] = useState(false);
  const [restaurando, setRestaurando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (visivel) return;
    setDados(null);
    setResumo(null);
    setQuantidadeAtual(0);
    setConfirmacaoAtiva(false);
    setCarregandoArquivo(false);
    setRestaurando(false);
    setErro(null);
  }, [visivel]);

  async function selecionarArquivo() {
    if (carregandoArquivo || restaurando) return;
    setCarregandoArquivo(true);
    setErro(null);
    try {
      const conteudo = await selecionarArquivoBackup();
      if (conteudo === null) return;
      const validado = await validarBackupJson(conteudo);
      setDados(validado.dados);
      setResumo(validado.resumo);
      if (ownerId) {
        const atuais = await coletarDadosPessoais(ownerId);
        setQuantidadeAtual(contarDados(atuais));
      }
      setConfirmacaoAtiva(false);
    } catch (falha) {
      setDados(null);
      setResumo(null);
      setErro(falha instanceof ErroBackup ? falha.message : "Não foi possível abrir o backup selecionado.");
    } finally {
      setCarregandoArquivo(false);
    }
  }

  async function confirmarRestauracao() {
    if (!dados || !ownerId || restaurando) return;
    setRestaurando(true);
    setErro(null);
    try {
      await restaurarDadosPessoais(ownerId, dados);
      mostrarToast("Backup restaurado. Seus dados e preferências foram atualizados.", { severidade: "sucesso" });
      onConcluido();
    } catch (falha) {
      const mensagem = falha instanceof ErroRestauracaoBackup
        ? falha.message
        : "Não foi possível restaurar o backup. Os dados anteriores foram preservados.";
      setErro(mensagem);
    } finally {
      setRestaurando(false);
    }
  }

  const fundo = "bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark";
  const texto = "text-cor-texto dark:text-cor-texto-dark";
  const textoSuave = "text-cor-texto-suave dark:text-cor-texto-suave-dark";

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={() => { if (!restaurando) onFechar(); }}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4 py-6">
        <View className={`w-full max-w-lg max-h-full rounded-3xl p-5 ${fundo}`}>
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 pr-3">
              <Text accessibilityRole="header" className={`text-xl font-bold ${texto}`}>
                {confirmacaoAtiva ? "Confirmar restauração" : "Restaurar dados"}
              </Text>
              <Text className={`text-sm mt-1 ${textoSuave}`}>
                {confirmacaoAtiva ? "Revise o efeito da substituição antes de prosseguir." : "Selecione um arquivo JSON exportado pela Bíblia Plataforma."}
              </Text>
            </View>
            <Pressable onPress={onFechar} disabled={restaurando} accessibilityRole="button" accessibilityLabel="Fechar restauração" className="min-w-11 min-h-11 items-center justify-center rounded-full active:opacity-60">
              <Text className={`text-xl ${texto}`}>×</Text>
            </Pressable>
          </View>

          <ScrollView className="shrink" contentContainerStyle={{ paddingBottom: 4 }}>
            {!confirmacaoAtiva ? (
              <>
                <Text className={`text-sm leading-5 mb-4 ${textoSuave}`}>
                  O arquivo é lido neste dispositivo e não é enviado para a internet. A restauração substitui os dados pessoais do perfil atual.
                </Text>
                <Pressable
                  onPress={selecionarArquivo}
                  disabled={carregandoArquivo || restaurando}
                  accessibilityRole="button"
                  className="min-h-12 flex-row items-center justify-center rounded-xl border border-cor-borda dark:border-cor-borda-dark px-4 active:opacity-70"
                >
                  {carregandoArquivo ? <ActivityIndicator /> : <Text className={`font-semibold ${texto}`}>{dados ? "Selecionar outro arquivo" : "Escolher arquivo JSON"}</Text>}
                </Pressable>

                {resumo ? (
                  <View className="mt-4 rounded-2xl border border-cor-borda dark:border-cor-borda-dark p-4">
                    <Text className={`font-semibold mb-2 ${texto}`}>Prévia do backup</Text>
                    <Text className={`text-xs mb-3 ${textoSuave}`}>Exportado em {formatarData(resumo.exportadoEm)}</Text>
                    <LinhaResumo titulo="Grifos" valor={resumo.grifos} />
                    <LinhaResumo titulo="Capítulos lidos" valor={resumo.capitulosLidos} />
                    <LinhaResumo titulo="Versículos em anotações" valor={resumo.versiculosEmNotas} />
                    <LinhaResumo titulo="Livros lidos" valor={resumo.livrosLidos} />
                    <LinhaResumo titulo="Pesquisas favoritas" valor={resumo.pesquisasFavoritas} />
                    <LinhaResumo titulo="Versículos salvos" valor={resumo.versiculosSalvos} />
                    <LinhaResumo titulo="Dias de planos" valor={resumo.diasConcluidos} />
                    <LinhaResumo titulo="Sessões em andamento" valor={resumo.sessoesPlanos} />
                    <LinhaResumo titulo="Coleções" valor={resumo.colecoes} />
                    <LinhaResumo titulo="Itens em coleções" valor={resumo.associacoesColecoes} />
                    {resumo.fotoPerfilNaoIncluida ? <Text className="text-xs leading-5 text-feedback-aviso-texto dark:text-feedback-aviso-texto-dark mt-3">A foto do perfil não está dentro do JSON e será removida do perfil restaurado.</Text> : null}
                    <Text className={`text-xs leading-5 mt-3 ${textoSuave}`}>
                      Tema e preferências de leitura podem ser restaurados. Notificações, permissão do sistema e onboarding permanecem neste dispositivo.
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <View className="rounded-2xl border border-feedback-aviso-texto/40 dark:border-feedback-aviso-texto-dark/40 p-4">
                <Text className={`font-semibold mb-2 ${texto}`}>Os dados atuais serão substituídos</Text>
                <Text className={`text-sm leading-5 ${textoSuave}`}>
                  Este perfil tem aproximadamente {quantidadeAtual} registros de leitura e organização. O backup contém {resumo ? resumo.grifos + resumo.capitulosLidos + resumo.versiculosEmNotas + resumo.livrosLidos + resumo.pesquisasFavoritas + resumo.versiculosSalvos + resumo.diasConcluidos + resumo.sessoesPlanos + resumo.colecoes + resumo.associacoesColecoes : 0}. Depois de concluir, os dados atuais não poderão ser recuperados por esta tela.
                </Text>
                <Text className={`text-sm leading-5 mt-3 ${textoSuave}`}>
                  As notificações e a permissão do sistema serão mantidas. Se precisar guardar os dados atuais, cancele e exporte um backup antes de continuar.
                </Text>
              </View>
            )}

            {erro ? <Text accessibilityRole="alert" className="text-sm leading-5 text-red-700 dark:text-red-300 mt-4">{erro}</Text> : null}
          </ScrollView>

          <View className="flex-row justify-end gap-2 mt-5">
            <Pressable onPress={confirmacaoAtiva ? () => setConfirmacaoAtiva(false) : onFechar} disabled={restaurando} accessibilityRole="button" className="min-h-11 justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark px-4 active:opacity-70">
              <Text className={texto}>{confirmacaoAtiva ? "Voltar" : "Cancelar"}</Text>
            </Pressable>
            {confirmacaoAtiva ? (
              <Pressable onPress={confirmarRestauracao} disabled={restaurando} accessibilityRole="button" className="min-h-11 min-w-36 flex-row items-center justify-center rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-4 active:opacity-70">
                {restaurando ? <ActivityIndicator color={escuro ? "#21160f" : "#fff"} /> : <Text className="font-semibold text-white dark:text-black">Restaurar backup</Text>}
              </Pressable>
            ) : (
              <Pressable onPress={() => { if (dados) setConfirmacaoAtiva(true); }} disabled={!dados || carregandoArquivo} accessibilityRole="button" className={`min-h-11 justify-center rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-4 active:opacity-70 ${!dados ? "opacity-40" : ""}`}>
                <Text className="font-semibold text-white dark:text-black">Continuar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
