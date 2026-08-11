import { useEffect, useRef, useState } from "react";
import { Animated, Text } from "react-native";
import { ouvirToast } from "../core/util/toast";

const DURACAO_MS = 2000;

// Montado uma vez em app/_layout.tsx — qualquer lugar do app dispara
// um toast chamando `mostrarToast(mensagem)`, sem precisar de Context.
export function Toast() {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const opacidade = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return ouvirToast((novaMensagem) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMensagem(novaMensagem);
      Animated.timing(opacidade, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacidade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setMensagem(null));
      }, DURACAO_MS);
    });
  }, [opacidade]);

  if (!mensagem) return null;

  return (
    <Animated.View
      pointerEvents="none"
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
      <Animated.View className="bg-cor-texto dark:bg-cor-texto-dark px-4 py-2.5 rounded-full shadow-md max-w-[85%]">
        <Text className="text-cor-fundo dark:text-cor-fundo-dark text-sm font-semibold text-center">{mensagem}</Text>
      </Animated.View>
    </Animated.View>
  );
}
