import { useEffect, useState } from "react";
import { obterOwnerId } from "./repositories";
import { observarRestauracaoDados } from "./util/eventoDadosPessoais";
import { mostrarToast } from "./util/toast";

// Hook fino sobre obterOwnerId() — a maioria das telas só precisa disso
// pra chamar os repositórios.
export function useOwnerId(): string | null {
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    obterOwnerId().then((id) => {
      if (ativo) setOwnerId(id);
    }).catch(() => {
      if (ativo) mostrarToast("Não foi possível recuperar os dados locais. Feche e abra o app para tentar novamente.", { severidade: "erro" });
    });
    const pararObservacao = observarRestauracaoDados(() => {
      if (!ativo) return;
      setOwnerId(null);
      temporizador = setTimeout(() => {
        if (ativo) obterOwnerId().then(setOwnerId).catch(() => mostrarToast("Não foi possível atualizar os dados restaurados", { severidade: "erro" }));
      }, 0);
    });
    return () => {
      ativo = false;
      pararObservacao();
      if (temporizador) clearTimeout(temporizador);
    };
  }, []);

  return ownerId;
}
