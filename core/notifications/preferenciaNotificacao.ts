// Se o lembrete diário está ligado, persistido por dispositivo — mesmo
// padrão de core/leitura/preferenciaFonte.ts. As funções de
// agendar/cancelar em core/notifications/notificacoes.ts são ações
// (fire-and-forget), não guardam estado próprio; este módulo é o que
// permite a tela de Configurações saber se o toggle deve aparecer
// ligado ao reabrir o app.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "lembrete-diario-ativo";
const HORA_PADRAO = 7;
const MINUTO_PADRAO = 0;

export async function lembreteDiarioAtivo(): Promise<boolean> {
  return (await AsyncStorage.getItem(CHAVE)) === "1";
}

export function salvarLembreteDiarioAtivo(ativo: boolean): void {
  AsyncStorage.setItem(CHAVE, ativo ? "1" : "0").catch(() => {});
}

export const HORARIO_LEMBRETE_PADRAO = { hora: HORA_PADRAO, minuto: MINUTO_PADRAO };
