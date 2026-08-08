import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Conquista } from "../core/content/conquistas";

function ItemConquista({ conquista, primeiro }: { conquista: Conquista; primeiro: boolean }) {
  const proporcao = conquista.progressoTotal > 0 ? conquista.progressoAtual / conquista.progressoTotal : 0;
  return (
    <View
      className={`flex-row items-start gap-3 py-3 ${primeiro ? "" : "border-t border-cor-borda dark:border-cor-borda-dark"}`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center shrink-0 ${
          conquista.conquistada ? "bg-cor-destaque dark:bg-cor-destaque-dark" : "bg-cor-fundo dark:bg-cor-fundo-dark opacity-60"
        }`}
      >
        <Text className={conquista.conquistada ? "text-white" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}>
          {conquista.icone}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">
          {conquista.titulo} {conquista.conquistada ? "✓" : ""}
        </Text>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1.5">{conquista.descricao}</Text>
        <View className="h-1.5 rounded-full bg-cor-fundo dark:bg-cor-fundo-dark overflow-hidden">
          <View
            className={`h-1.5 rounded-full ${conquista.conquistada ? "bg-cor-destaque dark:bg-cor-destaque-dark" : "bg-cor-texto-suave dark:bg-cor-texto-suave-dark"}`}
            style={{ width: `${Math.round(proporcao * 100)}%` }}
          />
        </View>
        <Text className="text-[10px] text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">
          {conquista.progressoAtual}/{conquista.progressoTotal}
        </Text>
      </View>
    </View>
  );
}

export function CardConquistas({ conquistas }: { conquistas: Conquista[] }) {
  const [expandido, setExpandido] = useState(false);
  const conquistadas = conquistas.filter((c) => c.conquistada);

  return (
    <View
      className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-4 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <Pressable
        onPress={() => setExpandido((v) => !v)}
        accessibilityLabel={expandido ? "Ocultar conquistas" : "Ver todas as conquistas"}
        className="flex-row items-center justify-between"
      >
        <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">
          🎖 Conquistas ({conquistadas.length}/{conquistas.length})
        </Text>
        <Text className="text-xs text-cor-destaque dark:text-cor-destaque-dark font-semibold">
          {expandido ? "Ocultar" : "Ver todas"}
        </Text>
      </Pressable>

      {!expandido ? (
        <View className="flex-row gap-2 mt-3">
          {conquistas.map((c) => (
            <View
              key={c.id}
              accessibilityLabel={`${c.titulo}${c.conquistada ? ", conquistada" : ", não conquistada"}`}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                c.conquistada ? "bg-cor-destaque dark:bg-cor-destaque-dark" : "bg-cor-fundo dark:bg-cor-fundo-dark opacity-50"
              }`}
            >
              <Text className={c.conquistada ? "text-white text-xs" : "text-cor-texto-suave dark:text-cor-texto-suave-dark text-xs"}>
                {c.icone}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="mt-1">
          {conquistas.map((c, i) => (
            <ItemConquista key={c.id} conquista={c} primeiro={i === 0} />
          ))}
        </View>
      )}
    </View>
  );
}
