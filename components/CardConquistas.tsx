import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { selecionarDestaquesConquistas, type Conquista } from "../core/content/conquistas";
import { IconeConquista } from "./IconeConquista";

export function CardConquistas({ conquistas }: { conquistas: Conquista[] }) {
  const destaques = selecionarDestaquesConquistas(conquistas);

  return (
    <View className="rounded-3xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-6 mb-4 shadow-sm">
      <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-6">
        Medalhas
      </Text>
      
      <View className="flex-row justify-between mb-6">
        {destaques.map((c) => {
          const completa = c.conquistada;
          return (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: "/medalhas", params: { conquista: c.id, origem: "inicio" } })}
              accessibilityRole="button"
              accessibilityLabel={`${c.titulo}, ${completa ? "conquistada" : `${c.progressoAtual} de ${c.progressoTotal}`}`}
              className="items-center flex-1 active:opacity-70"
            >
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-3 border-2 ${
                  completa
                    ? 'bg-cor-destaque/20 border-cor-destaque dark:border-cor-destaque-dark'
                    : 'bg-cor-borda dark:bg-cor-borda-dark border-transparent'
                }`}
              >
                <IconeConquista conquistaId={c.id} conquistada={completa} tamanho={64} />
              </View>
              <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark text-center leading-tight mb-1">
                {c.titulo}
              </Text>
              <Text className="text-[10px] text-cor-destaque dark:text-cor-destaque-dark text-center underline decoration-dotted">
                Saiba mais
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => router.push({ pathname: "/medalhas", params: { origem: "inicio" } })} accessibilityRole="button" className="bg-cor-borda dark:bg-cor-borda-dark self-start px-5 py-2 rounded-full active:opacity-70">
        <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Ver todos</Text>
      </Pressable>

    </View>
  );
}
