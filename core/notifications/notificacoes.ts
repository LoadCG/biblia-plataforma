import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuração padrão de como o app se comporta quando a notificação
// chega com o app em primeiro plano.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const IDENTIFICADOR_LEMBRETE = "lembrete-diario-biblia";
const CANAL_LEMBRETE_ANDROID = "lembrete-diario";
const TITULO_LEMBRETE_ANTIGO = "Versículo do dia";
const CORPO_LEMBRETE_ANTIGO = "Sua leitura de hoje já está esperando por você.";

function lembreteDoApp({ content }: Notifications.NotificationRequest) {
  if (content.data?.tipo === IDENTIFICADOR_LEMBRETE) return true;
  // Compatibilidade com lembretes criados antes de adicionarmos o marcador.
  return content.title === TITULO_LEMBRETE_ANTIGO && content.body === CORPO_LEMBRETE_ANTIGO;
}

function permissaoConcedida(permissao: Notifications.NotificationPermissionsStatus) {
  return permissao.granted || (
    Platform.OS === "ios" && permissao.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/** Consulta o estado atual sem solicitar ou exibir um novo pedido de permissão. */
export async function notificacoesPermitidas(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  return permissaoConcedida(await Notifications.getPermissionsAsync());
}

/** Informa se o lembrete diário está realmente agendado no sistema operacional. */
export async function lembreteDiarioAgendado(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  return agendadas.some(lembreteDoApp);
}

/**
 * Solicita permissão do sistema operacional para enviar notificações.
 * Deve ser chamado antes de agendar qualquer gatilho.
 */
export async function pedirPermissaoNotificacoes(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CANAL_LEMBRETE_ANDROID, {
      name: "Lembrete diário",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permissaoAtual = await Notifications.getPermissionsAsync();
  if (permissaoConcedida(permissaoAtual)) return true;

  const permissaoSolicitada = await Notifications.requestPermissionsAsync();
  return permissaoConcedida(permissaoSolicitada);
}

/** Cancela somente o lembrete diário deste app, preservando outras notificações agendadas. */
export async function cancelarLembreteDiario() {
  if (Platform.OS === "web") return;
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  const lembretesDoApp = agendadas.filter(lembreteDoApp);
  await Promise.all(lembretesDoApp.map(({ identifier }) => Notifications.cancelScheduledNotificationAsync(identifier)));
}

/**
 * Agenda um lembrete diário num horário fixo (hora e minuto). Retorna
 * false se estiver no web ou se a permissão não for concedida.
 * Exemplo: 07:00 da manhã.
 */
export async function agendarLembreteDiario(hora: number, minuto: number, titulo: string, corpo: string) {
  if (Platform.OS === "web") return false;

  const temPermissao = await pedirPermissaoNotificacoes();
  if (!temPermissao) return false;

  // Cancela somente instâncias anteriores deste lembrete para não duplicar.
  await cancelarLembreteDiario();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
      sound: true,
      data: { tipo: IDENTIFICADOR_LEMBRETE },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
      ...(Platform.OS === "android" ? { channelId: CANAL_LEMBRETE_ANDROID } : {}),
    },
  });
  return true;
}
