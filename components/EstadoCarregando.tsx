import { ActivityIndicator, View } from "react-native";

type Props = {
  rotulo: string;
  className?: string;
};

export function EstadoCarregando({ rotulo, className = "" }: Props) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityLiveRegion="polite"
      className={`items-center justify-center py-10 ${className}`.trim()}
    >
      <ActivityIndicator accessibilityLabel={rotulo} />
    </View>
  );
}
