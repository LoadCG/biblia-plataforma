import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  ativo: boolean;
  tamanho?: number;
};

// Cinza e parado quando a sequência está em 0, colorido e "respirando"
// (escala + opacidade em loop) quando há pelo menos 1 dia — sem
// depender de Lottie/asset externo, só Animated + react-native-svg.
export function FogoStreak({ ativo, tamanho = 48 }: Props) {
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!ativo) {
      escala.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(escala, { toValue: 1.08, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(escala, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ativo, escala]);

  return (
    <Animated.View style={{ transform: [{ scale: escala }] }}>
      <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
        <Path
          d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.8.3 3 2 3 5.5a6 6 0 1 1-12 0c0-4 2-5 3-8 0 1.5.5 2.5 1 3.5C10.3 6 10.5 3.5 12 2Z"
          fill={ativo ? "#e0762b" : "#9a9284"}
          opacity={ativo ? 1 : 0.5}
        />
      </Svg>
    </Animated.View>
  );
}
