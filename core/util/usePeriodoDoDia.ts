import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { obterPeriodoDoDia, type PeriodoDoDia } from "./periodoDoDia";

export function usePeriodoDoDia(): PeriodoDoDia {
  const [periodo, setPeriodo] = useState(() => obterPeriodoDoDia(new Date()));

  useEffect(() => {
    const atualizar = () => setPeriodo(obterPeriodoDoDia(new Date()));
    const intervalo = setInterval(atualizar, 60_000);
    const assinaturaAppState = AppState.addEventListener("change", (estado) => {
      if (estado === "active") atualizar();
    });

    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", atualizar);
    }

    return () => {
      clearInterval(intervalo);
      assinaturaAppState.remove();
      if (Platform.OS === "web" && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", atualizar);
      }
    };
  }, []);

  return periodo;
}
