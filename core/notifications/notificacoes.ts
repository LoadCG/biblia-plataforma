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

/**
 * Cancela todas as notificações agendadas.
 */
export async function cancelarTodosLembretes() {
  if (Platform.OS === "web") return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Agenda um lembrete diário num horário fixo (hora e minuto).
 * Exemplo: 07:00 da manhã.
 */
export async function agendarLembreteDiario(hora: number, minuto: number, titulo: string, corpo: string) {
  if (Platform.OS === "web") return;

  const temPermissao = await pedirPermissaoNotificacoes();
  if (!temPermissao) return;

  // Cancela anteriores para não duplicar se o usuário alterar o horário
  await cancelarTodosLembretes();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
    },
  });
}
