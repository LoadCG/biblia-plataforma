import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { acaoStreak, mensagemStreak } from "../core/estatisticas/mensagemStreak";
import type { ResumoSequencia } from "../core/estatisticas/streak";
import { FogoStreak } from "./FogoStreak";
import { SemanaSequencia } from "./SemanaSequencia";

export function CardStreak({ resumo }: { resumo: ResumoSequencia }) {
  const ativo = resumo.atual > 0;
  const acao = acaoStreak(resumo);
  return (
    <View
      accessibilityRole="summary"
      className="rounded-3xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-5 py-4 mb-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark mb-1">
            Sua sequência
          </Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark leading-tight">
            {mensagemStreak(resumo)}
          </Text>
        </View>
        <View className="items-center justify-center bg-cor-borda dark:bg-cor-borda-dark rounded-full w-16 h-16 border-2 border-cor-destaque/30">
          <Text className="text-xl font-black text-cor-texto dark:text-cor-texto-dark">{resumo.atual}</Text>
          <View className="-mt-1">
            <FogoStreak ativo={ativo} />
          </View>
        </View>
      </View>
      {resumo.recorde > 0 ? (
        <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mt-3">
          Seu melhor ritmo: {resumo.recorde} {resumo.recorde === 1 ? "dia" : "dias"}
        </Text>
      ) : null}
      <SemanaSequencia resumo={resumo} />
      {acao ? (
        <Link href="/leitura" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={acao.nomeAcessivel}
            className="self-start min-h-11 justify-center mt-2 active:opacity-70"
          >
            <Text className="text-sm font-bold text-cor-destaque dark:text-cor-destaque-dark">
              {acao.rotulo}
            </Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}
