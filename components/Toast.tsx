import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { ouvirToast, type PayloadToast } from "../core/util/toast";

const DURACAO_PADRAO_MS = 2000;
const DURACAO_COM_ACAO_MS = 4000;

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
        className={`flex-row items-center gap-3 bg-cor-texto dark:bg-cor-texto-dark py-2 rounded-full shadow-md max-w-[90%] ${
          payload.acaoLabel ? "pl-4 pr-2" : "px-4"
        }`}
      >
        <Text className="text-cor-fundo dark:text-cor-fundo-dark text-sm font-semibold shrink">{payload.mensagem}</Text>
        {payload.acaoLabel ? (
          <Pressable
            onPress={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              payload.onAcao?.();
              esconder();
            }}
            className="px-3 py-1.5 rounded-full bg-cor-fundo/15 dark:bg-cor-fundo-dark/15 active:opacity-70"
          >
            <Text className="text-cor-fundo dark:text-cor-fundo-dark text-sm font-bold">{payload.acaoLabel}</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}
