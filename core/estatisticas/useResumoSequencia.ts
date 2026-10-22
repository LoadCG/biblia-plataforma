import { useEffect, useMemo, useState } from "react";
import { resumirSequencia } from "./streak";

/** Atualiza o resumo no próximo dia local sem exigir navegação ou recarga. */
export function useResumoSequencia(datasISO: readonly string[]) {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const instante = new Date();
    const proximoDia = new Date(instante);
    proximoDia.setHours(24, 0, 0, 50);
    const timer = setTimeout(
      () => setAgora(new Date()),
      Math.max(1, proximoDia.getTime() - instante.getTime()),
    );
    return () => clearTimeout(timer);
  }, [agora, datasISO]);

  return useMemo(() => resumirSequencia(datasISO, agora), [datasISO, agora]);
}
