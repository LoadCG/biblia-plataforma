import { AccessibilityInfo } from "react-native";
import { useEffect, useState } from "react";

/** Respeita a preferência de movimento reduzido do sistema operacional/navegador. */
export function useMovimentoReduzido() {
  // Mantém o conteúdo estático até a preferência ser consultada, evitando
  // iniciar uma animação antes de respeitar a configuração do dispositivo.
  const [reduzido, setReduzido] = useState(true);

  useEffect(() => {
    let montado = true;
    let preferenciaAlterada = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((preferencia) => {
        // Uma alteração recebida enquanto a consulta inicial está pendente é
        // mais recente e não deve ser sobrescrita por uma resposta atrasada.
        if (montado && !preferenciaAlterada) setReduzido(preferencia);
      })
      .catch(() => {
        // Em caso de falha, mantém a opção segura e estática.
      });

    const assinatura = AccessibilityInfo.addEventListener("reduceMotionChanged", (preferencia) => {
      preferenciaAlterada = true;
      setReduzido(preferencia);
    });

    return () => {
      montado = false;
      assinatura.remove();
    };
  }, []);

  return reduzido;
}
