import { Text, View } from "react-native";
import type { Conquista } from "../core/content/conquistas";

export function FaixaConquistas({ conquistas }: { conquistas: Conquista[] }) {
  return (
    <View className="flex-row gap-2 mb-3" accessibilityLabel="Conquistas de leitura">
      {conquistas.map((c) => (
        <View
          key={c.id}
          accessibilityLabel={c.titulo}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            c.conquistada ? "bg-cor-destaque dark:bg-cor-destaque-dark" : "bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark opacity-40"
          }`}
        >
          <Text className={c.conquistada ? "text-white text-xs" : "text-cor-texto-suave dark:text-cor-texto-suave-dark text-xs"}>
            {c.icone}
          </Text>
        </View>
      ))}
    </View>
  );
}
