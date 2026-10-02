import { ActivityIndicator, Text, View } from "react-native";
import { useColorScheme } from "../core/theme";

type Props = {
  rotulo: string;
  className?: string;
};

export function EstadoCarregando({ rotulo, className = "" }: Props) {
  const { colorScheme } = useColorScheme();
  const corDestaque = colorScheme === "dark" ? "#e0a75e" : "#8a5a2b";

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityLiveRegion="polite"
      className={`items-center justify-center py-10 ${className}`.trim()}
    >
      <ActivityIndicator accessibilityLabel={rotulo} color={corDestaque} />
      <Text accessible={false} className="mt-2 text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">
        {rotulo}
      </Text>
    </View>
  );
}
