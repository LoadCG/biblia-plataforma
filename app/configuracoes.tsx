import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
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
import { agendarLembreteDiario, cancelarTodosLembretes } from "../core/notifications/notificacoes";
import { HORARIO_LEMBRETE_PADRAO, lembreteDiarioAtivo, salvarLembreteDiarioAtivo } from "../core/notifications/preferenciaNotificacao";
import { alternarTema, useColorScheme } from "../core/theme";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2 px-1">
        {titulo}
      </Text>
      <View className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark shadow-sm overflow-hidden" style={SOMBRA}>
        {children}
      </View>
    </View>
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
  const [indiceFonte, setIndiceFonte] = useState(INDICE_PADRAO);
  const [fonteSerifada, setFonteSerifada] = useState(false);
  const [lembreteAtivo, setLembreteAtivo] = useState(false);

  useEffect(() => {
    carregarIndiceFonte().then(setIndiceFonte);
    carregarFonteSerifada().then(setFonteSerifada);
    lembreteDiarioAtivo().then(setLembreteAtivo);
  }, []);

  async function alternarLembreteDiario() {
    if (Platform.OS === "web") {
      Alert.alert("Não disponível no navegador", "Notificações diárias funcionam no app instalado (Android/iOS).");
      return;
    }
    const novo = !lembreteAtivo;
    if (novo) {
      await agendarLembreteDiario(
        HORARIO_LEMBRETE_PADRAO.hora,
        HORARIO_LEMBRETE_PADRAO.minuto,
        "Versículo do dia",
        "Sua leitura de hoje já está esperando por você."
      );
    } else {
      await cancelarTodosLembretes();
    }
    salvarLembreteDiarioAtivo(novo);
    setLembreteAtivo(novo);
  }

  function ajustarFonte(delta: number) {
    setIndiceFonte((atual) => {
      const novo = Math.min(TAMANHOS_FONTE.length - 1, Math.max(0, atual + delta));
      salvarIndiceFonte(novo);
      return novo;
    });
  }

  function alternarFonteSerifada() {
    setFonteSerifada((atual) => {
      const novo = !atual;
      salvarFonteSerifada(novo);
      return novo;
    });
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
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-5">Configurações</Text>

        <Secao titulo="Leitura">
          <Linha>
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold mb-2.5">Tamanho da fonte</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => ajustarFonte(-1)}
                disabled={indiceFonte === 0}
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
                disabled={indiceFonte === TAMANHOS_FONTE.length - 1}
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
          </Linha>
          <Linha ultima>
            <Pressable onPress={alternarFonteSerifada} className="flex-row items-center justify-between active:opacity-70">
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

        <Secao titulo="Aparência">
          <Linha ultima>
            <Pressable onPress={alternarTema} className="flex-row items-center justify-between active:opacity-70">
              <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Tema</Text>
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {escuro ? "☾ Escuro" : "☀ Claro"} · toque pra trocar
              </Text>
            </Pressable>
          </Linha>
        </Secao>

        <Secao titulo="Notificações">
          <Linha ultima>
            <Pressable onPress={alternarLembreteDiario} className="flex-row items-center justify-between active:opacity-70">
              <View className="flex-1 pr-3">
                <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Lembrete diário</Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
                  Um aviso todo dia às {String(HORARIO_LEMBRETE_PADRAO.hora).padStart(2, "0")}h pra não perder a leitura
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
          </Linha>
        </Secao>

        <Secao titulo="Dados">
          <Linha>
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Cores de grifo</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Em breve</Text>
          </Linha>
          <Linha ultima>
            <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Contraste</Text>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Em breve</Text>
          </Linha>
        </Secao>
      </View>
    </ScrollView>
  );
}
