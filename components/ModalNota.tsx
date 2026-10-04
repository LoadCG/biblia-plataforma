import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { IconeUI } from "./icone/IconeUI";
import { useColorScheme } from "../core/theme";
import { mostrarToast } from "../core/util/toast";
import { ConflitoAnotacaoExistente } from "../core/repositories/NotasRepository";
import type { ReferenciaVersiculo } from "../core/types/leitura";

type Props = {
  visivel: boolean;
  referencias: ReferenciaVersiculo[];
  referenciasAlteradas?: boolean;
  referencia?: string;
  textoInicial: string;
  onFechar: () => void;
  onSalvar: (texto: string) => Promise<void>;
  onRemover: () => Promise<void>;
};

// `key` no ponto de uso deve mudar por versículo (ver leitura bíblica),
// pra cada anotação abrir com o próprio texto e estado de edição.
export function ModalNota({ visivel, referencias, referenciasAlteradas = false, referencia, textoInicial, onFechar, onSalvar, onRemover }: Props) {
  const [texto, setTexto] = useState(textoInicial);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [confirmacao, setConfirmacao] = useState<"descartar" | "remover" | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const operacaoEmAndamento = useRef(false);
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const ocupado = salvando || removendo;
  const textoLimpo = texto.trim();
  const textoOriginal = textoInicial.trim();
  const textoAlterado = textoLimpo !== textoOriginal;
  const alterado = textoAlterado || referenciasAlteradas;

  useEffect(() => {
    if (!visivel) return;
    setTexto(textoInicial);
    setConfirmacao(null);
    setErro(null);
  }, [visivel, textoInicial]);

  function fecharOuConfirmar() {
    if (ocupado) return;
    if (alterado) {
      setConfirmacao("descartar");
      return;
    }
    onFechar();
  }

  async function salvar() {
    if (ocupado || operacaoEmAndamento.current || !textoLimpo || !alterado) return;
    operacaoEmAndamento.current = true;
    setSalvando(true);
    setErro(null);
    try {
      await onSalvar(textoLimpo);
      mostrarToast("Anotação salva", { severidade: "sucesso" });
      onFechar();
    } catch (falha) {
      if (falha instanceof ConflitoAnotacaoExistente) {
        const versiculosEmConflito = falha.referencias.map((ref) => `v. ${ref.versiculo}`).join(", ");
        setErro(`Já existe anotação em ${versiculosEmConflito}. Selecione versículos sem anotação ou edite o grupo existente.`);
      } else {
        setErro("Não foi possível salvar. A anotação continua aberta para você tentar novamente.");
      }
    } finally {
      operacaoEmAndamento.current = false;
      setSalvando(false);
    }
  }

  async function remover() {
    if (ocupado || operacaoEmAndamento.current) return;
    operacaoEmAndamento.current = true;
    setRemovendo(true);
    setErro(null);
    try {
      await onRemover();
      mostrarToast("Anotação removida", { severidade: "sucesso" });
      onFechar();
    } catch {
      setErro("Não foi possível remover. A anotação continua disponível para você tentar novamente.");
      setConfirmacao(null);
    } finally {
      operacaoEmAndamento.current = false;
      setRemovendo(false);
    }
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={fecharOuConfirmar} statusBarTranslucent>
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-5 bg-black/50"
        behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
      >
        <Pressable
          className="absolute inset-0"
          onPress={fecharOuConfirmar}
          accessibilityRole="button"
          accessibilityLabel="Fechar anotação"
          disabled={ocupado}
        />
        <ScrollView
          className="w-full max-w-lg flex-grow-0"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full rounded-3xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-5 shadow-xl">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <IconeUI name="note" size={20} color={escuro ? "#e0a75e" : "#8a5a2b"} />
                  <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark">Anotação</Text>
                </View>
                <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
                  {referencia ?? `Versículo ${referencias[0]?.versiculo ?? ""}`}
                </Text>
                {referencias.length > 1 ? (
                  <Text className="text-xs font-semibold text-cor-destaque dark:text-cor-destaque-dark mt-1">
                    Vinculada a {referencias.length} versículos
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={fecharOuConfirmar}
                disabled={ocupado}
                accessibilityRole="button"
                accessibilityLabel="Fechar anotação"
                hitSlop={8}
                className="w-10 h-10 -mt-1 -mr-1 rounded-full items-center justify-center active:bg-cor-borda dark:active:bg-cor-borda-dark"
              >
                <IconeUI name="close" size={20} color={escuro ? "#ece5d8" : "#2a241c"} />
              </Pressable>
            </View>

            <TextInput
              value={texto}
              onChangeText={(valor) => { setTexto(valor); setErro(null); setConfirmacao(null); }}
              multiline
              autoFocus
              accessibilityLabel="Texto da anotação"
              accessibilityHint="Escreva uma reflexão ou observação para este versículo."
              placeholder="Escreva uma reflexão ou observação..."
              placeholderTextColor={escuro ? "#9e9587" : "#8b8175"}
              className="min-h-[160px] max-h-[42vh] rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark text-cor-texto dark:text-cor-texto-dark p-4 text-base"
              textAlignVertical="top"
              editable={!ocupado}
              selectionColor={escuro ? "#e0a75e" : "#8a5a2b"}
            />
            <View className="flex-row justify-between items-center mt-2 mb-4">
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {referenciasAlteradas && !textoAlterado
                  ? "Novos versículos ainda não vinculados"
                  : alterado
                    ? "Alterações não salvas"
                    : textoOriginal ? "Anotação salva" : "Sua anotação é privada neste dispositivo"}
              </Text>
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark" accessibilityLabel={`${texto.length} caracteres`}>
                {texto.length} caracteres
              </Text>
            </View>

            {erro ? (
              <View accessibilityRole="alert" className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2.5 mb-3">
                <Text className="text-sm text-red-800 dark:text-red-200">{erro}</Text>
              </View>
            ) : null}

            {confirmacao === "descartar" ? (
              <View className="rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark p-3 mb-3">
                <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">Descartar as alterações?</Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1 mb-3">
                  {referenciasAlteradas && !textoAlterado
                    ? "Os novos vínculos com versículos ainda não foram salvos."
                    : "O texto que você escreveu ainda não foi salvo."}
                </Text>
                <View className="flex-row justify-end gap-2">
                  <Pressable onPress={() => setConfirmacao(null)} accessibilityRole="button" className="rounded-full px-3 py-2 active:opacity-70">
                    <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">Continuar editando</Text>
                  </Pressable>
                  <Pressable onPress={onFechar} accessibilityRole="button" className="rounded-full bg-red-700 px-3 py-2 active:opacity-80">
                    <Text className="text-sm font-semibold text-white">Descartar</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            {confirmacao === "remover" ? (
              <View className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 mb-3">
                <Text className="text-sm font-semibold text-red-900 dark:text-red-100">Excluir esta anotação?</Text>
                <Text className="text-xs text-red-800 dark:text-red-200 mt-1 mb-3">
                  {alterado ? "A anotação salva e as alterações ainda não salvas serão perdidas." : "Essa ação não pode ser desfeita."}
                </Text>
                <View className="flex-row justify-end gap-2">
                  <Pressable onPress={() => setConfirmacao(null)} accessibilityRole="button" className="rounded-full px-3 py-2 active:opacity-70">
                    <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={remover} disabled={ocupado} accessibilityRole="button" className="rounded-full bg-red-700 px-3 py-2 active:opacity-80">
                    <Text className="text-sm font-semibold text-white">{removendo ? "Excluindo..." : "Excluir anotação"}</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <View className="flex-row items-center justify-between gap-2">
              {textoOriginal ? (
                <Pressable
                  onPress={() => { setErro(null); setConfirmacao("remover"); }}
                  disabled={ocupado}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir anotação"
                  className="min-h-11 justify-center rounded-full px-3 active:opacity-70"
                >
                  <Text className="text-sm font-semibold text-red-700 dark:text-red-300">Excluir</Text>
                </Pressable>
              ) : <View />}
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={fecharOuConfirmar}
                  disabled={ocupado}
                  accessibilityRole="button"
                  className="min-h-11 justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark px-4 active:opacity-70"
                >
                  <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={salvar}
                  disabled={ocupado || !alterado || !textoLimpo}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar anotação"
                  className={`min-h-11 min-w-24 flex-row items-center justify-center gap-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-4 ${ocupado || !alterado || !textoLimpo ? "opacity-50" : "active:opacity-80"}`}
                >
                  {salvando ? <ActivityIndicator size="small" color="white" /> : null}
                  <Text className="text-sm font-semibold text-white">{salvando ? "Salvando..." : "Salvar"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
