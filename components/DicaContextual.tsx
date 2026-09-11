import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { dicaJaVista, marcarDicaVista } from "../core/leitura/onboarding";

export function DicaContextual({ id, titulo, descricao }: { id: string; titulo: string; descricao: string }) {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => { dicaJaVista(id).then((vista) => setVisivel(!vista)); }, [id]);
  if (!visivel) return null;
  return (
    <View accessibilityRole="summary" className="rounded-2xl border border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark px-4 py-3 mb-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-cor-texto dark:text-cor-texto-dark">{titulo}</Text>
          <Text className="text-xs leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">{descricao}</Text>
        </View>
        <Pressable
          onPress={() => { marcarDicaVista(id); setVisivel(false); }}
          accessibilityRole="button"
          accessibilityLabel="Entendi, fechar dica"
          className="px-3 py-2 -mr-2 active:opacity-60"
        >
          <Text className="font-bold text-cor-destaque dark:text-cor-destaque-dark">Entendi</Text>
        </Pressable>
      </View>
    </View>
  );
}
