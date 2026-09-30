import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { concluirOnboarding } from "../core/leitura/onboarding";
import { mostrarToast } from "../core/util/toast";

const PASSOS = [
  { icone: "auto-stories" as const, titulo: "Sua Bíblia, sempre disponível", texto: "Leia e pesquise toda a Bíblia mesmo sem conexão. Ajuste fonte e tema para o seu ritmo." },
  { icone: "edit-note" as const, titulo: "Guarde o que importa", texto: "Grife em cores, salve versículos e escreva notas privadas, armazenadas somente neste dispositivo." },
  { icone: "event-note" as const, titulo: "Caminhe um dia de cada vez", texto: "Use planos guiados, acompanhe sua constância e celebre marcos sem competição." },
];

export default function Onboarding() {
  const [passo, setPasso] = useState(0);
  const atual = PASSOS[passo];
  async function finalizar(destino: "/" | "/planos") {
    try {
      await concluirOnboarding();
      router.replace(destino);
    } catch {
      mostrarToast("Não foi possível salvar a conclusão da apresentação");
    }
  }
  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark px-6 py-10 items-center justify-center">
      <View className="w-full max-w-md">
        <View className="w-16 h-16 rounded-3xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center mb-6">
          <MaterialIcons name={atual.icone} size={32} className="text-cor-destaque dark:text-cor-destaque-dark" />
        </View>
        <Text accessibilityRole="header" className="text-3xl font-extrabold text-cor-texto dark:text-cor-texto-dark mb-3">{atual.titulo}</Text>
        <Text className="text-base leading-7 text-cor-texto-suave dark:text-cor-texto-suave-dark mb-8">{atual.texto}</Text>
        <View
          className="flex-row gap-2 mb-8"
          accessibilityRole="progressbar"
          accessibilityLabel="Progresso da apresentação"
          accessibilityValue={{ min: 1, max: PASSOS.length, now: passo + 1, text: `Passo ${passo + 1} de ${PASSOS.length}` }}
        >
          {PASSOS.map((_, indice) => <View key={indice} className={`h-2 rounded-full ${indice === passo ? "w-8 bg-cor-destaque dark:bg-cor-destaque-dark" : "w-2 bg-cor-borda dark:bg-cor-borda-dark"}`} />)}
        </View>
        {passo < PASSOS.length - 1 ? (
          <Pressable onPress={() => setPasso((valor) => valor + 1)} accessibilityRole="button" className="rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-3.5 items-center active:opacity-80">
            <Text className="text-white dark:text-cor-texto font-bold">Continuar</Text>
          </Pressable>
        ) : (
          <View className="gap-3">
            <Pressable onPress={() => finalizar("/")} accessibilityRole="button" className="rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-3.5 items-center active:opacity-80"><Text className="text-white dark:text-cor-texto font-bold">Começar a ler</Text></Pressable>
            <Pressable onPress={() => finalizar("/planos")} accessibilityRole="button" className="rounded-full border border-cor-borda dark:border-cor-borda-dark px-5 py-3.5 items-center active:opacity-80"><Text className="text-cor-texto dark:text-cor-texto-dark font-bold">Explorar planos</Text></Pressable>
          </View>
        )}
        <Pressable onPress={() => finalizar("/")} accessibilityRole="button" className="items-center mt-5 py-2 active:opacity-60"><Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">Pular apresentação</Text></Pressable>
      </View>
    </View>
  );
}
