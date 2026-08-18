import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Conquista } from "../core/content/conquistas";

export function CardConquistas({ conquistas }: { conquistas: Conquista[] }) {
  // Mostra apenas 3 medalhas de destaque por enquanto
  const topConquistas = conquistas.slice(1, 4); // Ignora a "Primeiro Passo" pra focar nas maiores
  const [conquistaAberta, setConquistaAberta] = useState<Conquista | null>(null);

  return (
    <View className="rounded-3xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-6 mb-4 shadow-sm">
      <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-6">
        Medalhas
      </Text>
      
      <View className="flex-row justify-between mb-6">
        {topConquistas.map((c, index) => {
          const completa = c.conquistada;
          return (
            <Pressable key={c.id} onPress={() => setConquistaAberta(c)} className="items-center flex-1 active:opacity-70">
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-3 border-2 ${
                  completa
                    ? 'bg-cor-destaque/20 border-cor-destaque dark:border-cor-destaque-dark'
                    : 'bg-cor-borda dark:bg-cor-borda-dark border-transparent'
                }`}
              >
                <MaterialIcons
                  name={c.id === 'novo-testamento' ? 'auto-awesome' : c.id === 'pentateuco' ? 'menu-book' : 'emoji-events'}
                  size={32}
                  color={completa ? '#e0a75e' : '#9ca3af'}
                />
                {!completa && (
                  <View className="absolute bottom-1 bg-cor-fundo/80 dark:bg-cor-fundo-dark/80 px-2 rounded-full">
                    <Text className="text-[10px] text-cor-texto dark:text-cor-texto-dark font-bold">{c.progressoAtual}</Text>
                  </View>
                )}
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

      <Pressable onPress={() => router.push("/voce")} className="bg-cor-borda dark:bg-cor-borda-dark self-start px-5 py-2 rounded-full active:opacity-70">
        <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Ver Todos</Text>
      </Pressable>

      <Modal visible={!!conquistaAberta} transparent animationType="fade" onRequestClose={() => setConquistaAberta(null)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setConquistaAberta(null)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-6">
            {conquistaAberta ? (
              <>
                <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-1.5">{conquistaAberta.titulo}</Text>
                <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">{conquistaAberta.descricao}</Text>
                <Text className="text-xs font-semibold text-cor-destaque dark:text-cor-destaque-dark mb-4">
                  {conquistaAberta.conquistada ? "Conquistada ✓" : `${conquistaAberta.progressoAtual} de ${conquistaAberta.progressoTotal}`}
                </Text>
                <Pressable onPress={() => setConquistaAberta(null)} className="self-end px-4 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70">
                  <Text className="text-white font-semibold text-sm">Fechar</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
