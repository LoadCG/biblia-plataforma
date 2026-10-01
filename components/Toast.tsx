import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { IconeUI } from "./icone/IconeUI";
import { ouvirToast, type PayloadToast, type SeveridadeToast } from "../core/util/toast";

const DURACAO_PADRAO_MS = 2000;
const DURACAO_COM_ACAO_MS = 4000;

const ESTILOS_SEVERIDADE: Record<SeveridadeToast, { container: string; texto: string; acao: string; icone?: "complete" | "warning" | "info" }> = {
  neutra: { container: "bg-cor-texto dark:bg-cor-texto-dark", texto: "text-cor-fundo dark:text-cor-fundo-dark", acao: "bg-cor-fundo/15 dark:bg-cor-fundo-dark/15" },
  sucesso: { container: "bg-feedback-sucesso-fundo dark:bg-feedback-sucesso-fundo-dark", texto: "text-feedback-sucesso-texto dark:text-feedback-sucesso-texto-dark", acao: "bg-feedback-sucesso-texto/10 dark:bg-feedback-sucesso-texto-dark/10", icone: "complete" },
  aviso: { container: "bg-feedback-aviso-fundo dark:bg-feedback-aviso-fundo-dark", texto: "text-feedback-aviso-texto dark:text-feedback-aviso-texto-dark", acao: "bg-feedback-aviso-texto/10 dark:bg-feedback-aviso-texto-dark/10", icone: "warning" },
  erro: { container: "bg-feedback-erro-fundo dark:bg-feedback-erro-fundo-dark", texto: "text-feedback-erro-texto dark:text-feedback-erro-texto-dark", acao: "bg-feedback-erro-texto/10 dark:bg-feedback-erro-texto-dark/10", icone: "warning" },
  informacao: { container: "bg-feedback-info-fundo dark:bg-feedback-info-fundo-dark", texto: "text-feedback-info-texto dark:text-feedback-info-texto-dark", acao: "bg-feedback-info-texto/10 dark:bg-feedback-info-texto-dark/10", icone: "info" },
};

// Montado uma vez em app/_layout.tsx — qualquer lugar do app dispara
// um toast chamando `mostrarToast(mensagem)`, sem precisar de Context.
// Suporta um botão de ação opcional (ex. "Desfazer") — usado hoje pela
// marcação de capítulos em massa, pra reverter sem precisar refazer a
// seleção manualmente.
export function Toast() {
  const [payload, setPayload] = useState<PayloadToast | null>(null);
  const opacidade = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function esconder() {
    Animated.timing(opacidade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setPayload(null));
  }

  useEffect(() => {
    return ouvirToast((novoPayload) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPayload(novoPayload);
      Animated.timing(opacidade, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      const duracao = novoPayload.duracaoMs ?? (novoPayload.acaoLabel ? DURACAO_COM_ACAO_MS : DURACAO_PADRAO_MS);
      timeoutRef.current = setTimeout(esconder, duracao);
    });
  }, [opacidade]);

  if (!payload) return null;
  const estilo = ESTILOS_SEVERIDADE[payload.severidade ?? "neutra"];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: 90,
        left: 0,
        right: 0,
        alignItems: "center",
        opacity: opacidade,
        zIndex: 999,
      }}
    >
      <Animated.View
        pointerEvents="auto"
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={payload.acaoLabel ? `${payload.mensagem}. Ação disponível: ${payload.acaoLabel}` : payload.mensagem}
        className={`flex-row items-center gap-2.5 ${estilo.container} py-2 rounded-full shadow-md max-w-[90%] ${
          payload.acaoLabel ? "pl-4 pr-2" : "px-4"
        }`}
      >
        {estilo.icone ? <IconeUI name={estilo.icone} size={18} weight="bold" className={estilo.texto} /> : null}
        <Text className={`${estilo.texto} text-sm font-semibold shrink`}>{payload.mensagem}</Text>
        {payload.acaoLabel ? (
          <Pressable
            onPress={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              payload.onAcao?.();
              esconder();
            }}
            accessibilityRole="button"
            accessibilityLabel={payload.acaoLabel}
            accessibilityHint="Ativa a ação antes que o aviso desapareça"
            className={`px-3 py-1.5 rounded-full ${estilo.acao} active:opacity-70`}
          >
            <Text className={`${estilo.texto} text-sm font-bold`}>{payload.acaoLabel}</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}
