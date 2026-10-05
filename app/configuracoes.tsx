import { Link, router } from "expo-router";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, Share, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import {
  carregarFonteSerifada,
  carregarIndiceFonte,
  FAMILIA_SERIFADA,
  INDICE_PADRAO,
  salvarFonteSerifada,
  salvarIndiceFonte,
  TAMANHOS_FONTE,
} from "../core/leitura/preferenciaFonte";
import { agendarLembreteDiario, cancelarLembreteDiario } from "../core/notifications/notificacoes";
import { HORARIO_LEMBRETE_PADRAO, lembreteDiarioAtivo, salvarLembreteDiarioAtivo } from "../core/notifications/preferenciaNotificacao";
import { alternarTema, restaurarTemaPadrao, useColorScheme } from "../core/theme";
import { apagarDadosPessoais, coletarDadosPessoais } from "../core/util/dadosPessoais";
import { mostrarToast } from "../core/util/toast";
import { useOwnerId } from "../core/useOwnerId";
import { reiniciarOnboarding } from "../core/leitura/onboarding";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

function Secao({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text accessibilityRole="header" className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2 px-1">
        {titulo}
      </Text>
      {descricao ? <Descricao>{descricao}</Descricao> : null}
      <View className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark shadow-sm overflow-hidden" style={SOMBRA}>
        {children}
      </View>
    </View>
  );
}

function Descricao({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-sm leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3 px-1">
      {children}
    </Text>
  );
}

function Linha({ children, ultima }: { children: React.ReactNode; ultima?: boolean }) {
  return (
    <View className={`px-4 py-3.5 ${ultima ? "" : "border-b border-cor-borda dark:border-cor-borda-dark"}`}>
      {children}
    </View>
  );
}

export default function Configuracoes() {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const ownerId = useOwnerId();
  const [indiceFonte, setIndiceFonte] = useState(INDICE_PADRAO);
  const [fonteSerifada, setFonteSerifada] = useState(false);
  const [lembreteAtivo, setLembreteAtivo] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [salvandoPreferencias, setSalvandoPreferencias] = useState(false);
  const [alterandoLembrete, setAlterandoLembrete] = useState(false);

  useEffect(() => {
    let ativo = true;
    Promise.all([carregarIndiceFonte(), carregarFonteSerifada(), lembreteDiarioAtivo()])
      .then(([indice, serifada, lembrete]) => {
        if (!ativo) return;
        setIndiceFonte(indice);
        setFonteSerifada(serifada);
        setLembreteAtivo(lembrete);
      })
      .catch(() => {
        if (ativo) mostrarToast("Não foi possível carregar todas as configurações", { severidade: "erro" });
      });
    return () => { ativo = false; };
  }, []);

  async function alternarLembreteDiario() {
    if (alterandoLembrete) return;
    if (Platform.OS === "web") {
      mostrarToast("Notificações diárias funcionam no app instalado (Android/iOS)", { severidade: "informacao" });
      return;
    }
    const novo = !lembreteAtivo;
    setAlterandoLembrete(true);
    try {
      if (novo) {
        const agendado = await agendarLembreteDiario(
          HORARIO_LEMBRETE_PADRAO.hora,
          HORARIO_LEMBRETE_PADRAO.minuto,
          "Versículo do dia",
          "Sua leitura de hoje já está esperando por você."
        );
        if (!agendado) {
          mostrarToast("Permita notificações nas configurações do dispositivo para ativar o lembrete.", {
            severidade: "aviso",
            acaoLabel: "Abrir configurações",
            onAcao: () => {
              Linking.openSettings().catch(() => {
                mostrarToast("Não foi possível abrir as configurações do dispositivo", { severidade: "erro" });
              });
            },
          });
          return;
        }
      } else {
        await cancelarLembreteDiario();
      }
      await salvarLembreteDiarioAtivo(novo);
      setLembreteAtivo(novo);
    } catch {
      mostrarToast("Não foi possível atualizar o lembrete diário", { severidade: "erro" });
    } finally {
      setAlterandoLembrete(false);
    }
  }

  async function ajustarFonte(delta: number) {
    if (salvandoPreferencias) return;
    const novo = Math.min(TAMANHOS_FONTE.length - 1, Math.max(0, indiceFonte + delta));
    if (novo === indiceFonte) return;
    setSalvandoPreferencias(true);
    try {
      await salvarIndiceFonte(novo);
      setIndiceFonte(novo);
    } catch {
      mostrarToast("Não foi possível salvar o tamanho da fonte", { severidade: "erro" });
    } finally {
      setSalvandoPreferencias(false);
    }
  }

  async function alternarFonteSerifada() {
    if (salvandoPreferencias) return;
    const novo = !fonteSerifada;
    setSalvandoPreferencias(true);
    try {
      await salvarFonteSerifada(novo);
      setFonteSerifada(novo);
    } catch {
      mostrarToast("Não foi possível salvar a preferência de fonte", { severidade: "erro" });
    } finally {
      setSalvandoPreferencias(false);
    }
  }

  async function exportarMeusDados() {
    if (!ownerId || exportando) return;
    setExportando(true);
    try {
      const dados = await coletarDadosPessoais(ownerId);
      const json = JSON.stringify(dados, null, 2);
      if (Platform.OS === "web") {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        mostrarToast("Dados exportados!", { severidade: "sucesso" });
      } else {
        await Share.share({ message: json });
      }
    } catch {
      mostrarToast("Não foi possível exportar seus dados", { severidade: "erro" });
    } finally {
      setExportando(false);
    }
  }

  async function apagarMeusDados() {
    if (!ownerId || apagando) return;
    setApagando(true);
    let apagado = false;
    try {
      const dados = await coletarDadosPessoais(ownerId);
      await apagarDadosPessoais(ownerId, dados);
      // A exclusão de preferências locais também precisa retirar o lembrete do SO.
      let lembreteCancelado = true;
      try {
        await cancelarLembreteDiario();
      } catch {
        lembreteCancelado = false;
      }
      setIndiceFonte(INDICE_PADRAO);
      setFonteSerifada(false);
      setLembreteAtivo(false);
      restaurarTemaPadrao();
      apagado = true;
      mostrarToast(
        lembreteCancelado
          ? "Todos os seus dados foram apagados"
          : "Dados apagados, mas não foi possível cancelar o lembrete agendado",
        { severidade: lembreteCancelado ? "sucesso" : "aviso" }
      );
    } catch {
      mostrarToast("Não foi possível apagar todos os dados. Tente novamente.", { severidade: "erro" });
    } finally {
      setApagando(false);
      if (apagado) setConfirmarApagar(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text accessibilityRole="header" className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-5">Configurações</Text>
        <Descricao>Personalize sua leitura e gerencie os dados guardados neste dispositivo.</Descricao>

        <Secao titulo="Leitura" descricao="Esses ajustes são compartilhados pela leitura da Bíblia e pelos resumos.">
          <Linha>
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold mb-2.5">Tamanho da fonte</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => ajustarFonte(-1)}
                disabled={indiceFonte === 0 || salvandoPreferencias}
                accessibilityRole="button"
                accessibilityLabel="Diminuir tamanho da fonte"
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-60"
              >
                <Text
                  className={`text-xs font-bold ${indiceFonte === 0 ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40" : "text-cor-texto dark:text-cor-texto-dark"}`}
                >
                  A-
                </Text>
              </Pressable>
              <Pressable
                onPress={() => ajustarFonte(1)}
                disabled={indiceFonte === TAMANHOS_FONTE.length - 1 || salvandoPreferencias}
                accessibilityRole="button"
                accessibilityLabel="Aumentar tamanho da fonte"
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-60"
              >
                <Text
                  className={`text-xs font-bold ${
                    indiceFonte === TAMANHOS_FONTE.length - 1
                      ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40"
                      : "text-cor-texto dark:text-cor-texto-dark"
                  }`}
                >
                  A+
                </Text>
              </Pressable>
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark ml-1">
                {TAMANHOS_FONTE[indiceFonte]}px
              </Text>
            </View>
            <Text
              accessibilityRole="text"
              accessibilityLabel="Prévia do texto bíblico"
              style={{ fontSize: TAMANHOS_FONTE[indiceFonte], fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }}
              className="text-cor-texto dark:text-cor-texto-dark mt-3 leading-7"
            >
              A tua palavra é lâmpada para os meus pés.
            </Text>
          </Linha>
          <Linha ultima>
            <Pressable
              onPress={alternarFonteSerifada}
              disabled={salvandoPreferencias}
              accessibilityRole="switch"
              accessibilityLabel="Fonte serifada"
              accessibilityState={{ checked: fonteSerifada }}
              // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilityChecked={fonteSerifada}
              className="flex-row items-center justify-between active:opacity-70"
            >
              <View>
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Fonte serifada</Text>
                <Text style={{ fontFamily: FAMILIA_SERIFADA }} className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
                  Aa · usada na leitura da Bíblia e dos resumos
                </Text>
              </View>
              <View
                className={`w-11 h-6 rounded-full justify-center px-0.5 ${
                  fonteSerifada ? "bg-cor-destaque dark:bg-cor-destaque-dark items-end" : "bg-cor-borda dark:bg-cor-borda-dark items-start"
                }`}
              >
                <View className="w-5 h-5 rounded-full bg-white" />
              </View>
            </Pressable>
          </Linha>
        </Secao>

        <Secao titulo="Aparência" descricao="O tema escolhido é aplicado em todas as telas deste dispositivo.">
          <Linha ultima>
            <Pressable
              onPress={alternarTema}
              accessibilityRole="switch"
              accessibilityLabel="Tema"
              accessibilityState={{ checked: escuro }}
              // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilityChecked={escuro}
              className="flex-row items-center justify-between active:opacity-70"
            >
              <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Tema</Text>
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {escuro ? "☾ Escuro" : "☀ Claro"} · toque pra trocar
              </Text>
            </Pressable>
          </Linha>
        </Secao>

        <Secao titulo="Notificações">
          {Platform.OS === "web" ? (
            <Linha ultima>
              <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Lembrete diário</Text>
              <Text className="text-xs leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">
                Lembretes locais estão disponíveis no app instalado para Android e iOS. A versão web não agenda notificações.
              </Text>
            </Linha>
          ) : <Linha ultima>
            <Pressable
              onPress={alternarLembreteDiario}
              disabled={alterandoLembrete}
              accessibilityRole="switch"
              accessibilityLabel="Lembrete diário"
              accessibilityState={{ checked: lembreteAtivo }}
              // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilityChecked={lembreteAtivo}
              className="flex-row items-center justify-between active:opacity-70"
            >
              <View className="flex-1 pr-3">
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Lembrete diário</Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
                  Um aviso diário às {String(HORARIO_LEMBRETE_PADRAO.hora).padStart(2, "0")}:{String(HORARIO_LEMBRETE_PADRAO.minuto).padStart(2, "0")}. O horário é fixo nesta versão.
                </Text>
              </View>
              <View
                className={`w-11 h-6 rounded-full justify-center px-0.5 ${
                  lembreteAtivo ? "bg-cor-destaque dark:bg-cor-destaque-dark items-end" : "bg-cor-borda dark:bg-cor-borda-dark items-start"
                }`}
              >
                <View className="w-5 h-5 rounded-full bg-white" />
              </View>
            </Pressable>
          </Linha>}
        </Secao>

        <Secao titulo="Meus dados" descricao="Seu perfil e sua atividade ficam neste dispositivo e não são sincronizados entre aparelhos.">
          <Linha>
            <Link href="/privacidade" asChild>
              <Pressable accessibilityRole="link" className="flex-row items-center justify-between active:opacity-70">
                <View><Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Como meus dados são guardados</Text><Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Privacidade e armazenamento neste dispositivo</Text></View>
                <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
              </Pressable>
            </Link>
          </Linha>
          <Linha>
            <Pressable
              onPress={exportarMeusDados}
              disabled={exportando}
              accessibilityRole="button"
              accessibilityLabel="Exportar meus dados"
              className={`flex-row items-center justify-between active:opacity-70 ${exportando ? "opacity-40" : ""}`}
            >
              <View className="flex-1 pr-3">
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Exportar meus dados</Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
                  Arquivo JSON com perfil, preferências, grifos, notas, salvos, pesquisas favoritas, coleções e progresso de leitura e planos.
                </Text>
              </View>
              <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
            </Pressable>
          </Linha>
          <Linha ultima>
            <Pressable onPress={() => setConfirmarApagar(true)} accessibilityRole="button" accessibilityLabel="Apagar todos os meus dados" className="flex-row items-center justify-between active:opacity-70">
              <View className="flex-1 pr-3">
                <Text className="text-red-600 font-semibold">Apagar todos os meus dados</Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
                  Remove perfil, preferências, grifos, notas, salvos, pesquisas favoritas, coleções e progresso deste dispositivo. A ação não pode ser desfeita.
                </Text>
              </View>
              <Text className="text-red-600">→</Text>
            </Pressable>
          </Linha>
        </Secao>

        <Secao titulo="Sobre">
          <Linha>
            <Link href="/ajuda" asChild>
              <Pressable accessibilityRole="link" className="flex-row items-center justify-between active:opacity-70">
                <View><Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Ajuda e como usar</Text><Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Entenda seu progresso e os recursos do app</Text></View>
                <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
              </Pressable>
            </Link>
          </Linha>
          <Linha>
            <Pressable onPress={async () => {
              try {
                await reiniciarOnboarding();
                router.push("/onboarding");
              } catch {
                mostrarToast("Não foi possível reiniciar a apresentação", { severidade: "erro" });
              }
            }} accessibilityRole="button" className="flex-row items-center justify-between active:opacity-70">
              <View><Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Rever apresentação</Text><Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Veja novamente os recursos principais</Text></View>
              <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
            </Pressable>
          </Linha>
          <Linha ultima>
            <Link href="/sobre" asChild>
              <Pressable accessibilityRole="link" className="flex-row items-center justify-between active:opacity-70">
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Sobre o projeto</Text>
                <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">→</Text>
              </Pressable>
            </Link>
          </Linha>
        </Secao>
      </View>

      <Modal visible={confirmarApagar} transparent animationType="fade" onRequestClose={() => setConfirmarApagar(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setConfirmarApagar(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-6">
            <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-1.5">Apagar todos os meus dados?</Text>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
              Isso remove permanentemente seu perfil e preferências locais, grifos, notas, salvos, pesquisas favoritas,
              coleções e progresso de leitura e planos deste dispositivo. Essa ação não pode ser desfeita.
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setConfirmarApagar(false)}
                disabled={apagando}
                accessibilityRole="button"
                className="px-4 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-70"
              >
                <Text className="text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={apagarMeusDados}
                disabled={apagando}
                accessibilityRole="button"
                className={`px-4 py-2 rounded-full bg-red-600 active:opacity-70 ${apagando ? "opacity-60" : ""}`}
              >
                <Text className="text-white font-semibold">{apagando ? "Apagando..." : "Apagar tudo"}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
