import { Text, View } from "react-native";
import type { ResumoSequencia } from "../core/estatisticas/streak";

const FORMATAR_DATA_ACESSIVEL = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function SemanaSequencia({ resumo }: { resumo: ResumoSequencia }) {
  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">Últimos 7 dias</Text>
        <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">
          {resumo.diasAtivosSemana} de 7 dias com leitura
        </Text>
      </View>
      <View className="flex-row justify-between">
        {resumo.semana.map((dia) => (
          <View
            key={dia.data.getTime()}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${FORMATAR_DATA_ACESSIVEL.format(dia.data)}: ${dia.ativo ? "leitura registrada" : "sem leitura marcada"}${dia.hoje ? ", hoje" : ""}`}
            className="items-center gap-1"
          >
            <Text aria-hidden={true} className="text-[10px] text-cor-texto-suave dark:text-cor-texto-suave-dark">
              {dia.etiqueta}
            </Text>
            <View
              aria-hidden={true}
              className={`w-7 h-7 rounded-full items-center justify-center border ${
                dia.ativo
                  ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque/40 dark:border-cor-destaque-dark/40"
                  : "bg-transparent border-cor-borda dark:border-cor-borda-dark"
              } ${dia.hoje ? "border-2" : ""}`}
            >
              <Text className={`text-[10px] font-bold ${dia.ativo ? "text-cor-destaque dark:text-cor-destaque-dark" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}`}>
                {dia.data.getDate()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
