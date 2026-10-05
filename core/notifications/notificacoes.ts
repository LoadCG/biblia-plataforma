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

/**
 * Solicita permissão do sistema operacional para enviar notificações.
 * Deve ser chamado antes de agendar qualquer gatilho.
 */
export async function pedirPermissaoNotificacoes(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

const IDENTIFICADOR_LEMBRETE = "lembrete-diario-biblia";
const TITULO_LEMBRETE_ANTIGO = "Versículo do dia";
const CORPO_LEMBRETE_ANTIGO = "Sua leitura de hoje já está esperando por você.";

/** Cancela somente o lembrete diário deste app, preservando outras notificações agendadas. */
export async function cancelarLembreteDiario() {
  if (Platform.OS === "web") return;
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  const lembretesDoApp = agendadas.filter(({ content }) => {
    if (content.data?.tipo === IDENTIFICADOR_LEMBRETE) return true;
    // Compatibilidade com lembretes criados antes de adicionarmos o marcador.
    return content.title === TITULO_LEMBRETE_ANTIGO && content.body === CORPO_LEMBRETE_ANTIGO;
  });
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
    },
  });
  return true;
}
