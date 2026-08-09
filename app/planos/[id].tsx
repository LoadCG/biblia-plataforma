import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { obterPlano } from "../../core/content/planos";
import { livros } from "../../core/content/livros";
import { planosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

// Referências vêm como "Mateus 1" (sem versículo) — mesmo padrão de
// parsing usado em CardVersiculoTema.tsx e pesquisa.tsx, aqui só sem o
// grupo de versículo.
function hrefDaReferencia(ref: string): string | null {
  const match = ref.match(/(.+?)\s+(\d+)$/);
  if (!match) return null;
  const nomeLivro = match[1].trim().toLowerCase();
  const capitulo = match[2];
  const livro = livros.find((l) => l.nome.toLowerCase() === nomeLivro || l.abreviacao?.toLowerCase() === nomeLivro);
  if (!livro) return null;
  return `/biblia/${livro.slug}/${capitulo}`;
}

export default function DetalhePlano() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plano = obterPlano(id ?? "");
  const ownerId = useOwnerId();
  const [diasConcluidos, setDiasConcluidos] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!ownerId || !plano) return;
    planosRepository.listarDiasConcluidos(ownerId, plano.id).then((dias) => setDiasConcluidos(new Set(dias)));
  }, [ownerId, plano]);

  async function alternarDia(dia: number) {
    if (!ownerId || !plano) return;
    const ativo = await planosRepository.alternarDiaConcluido(ownerId, plano.id, dia);
    setDiasConcluidos((atual) => {
      const novo = new Set(atual);
      if (ativo) novo.add(dia);
      else novo.delete(dia);
      return novo;
    });
  }

  if (!plano) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Plano não encontrado.</Text>
        <Link href="/planos" className="text-cor-destaque dark:text-cor-destaque-dark mt-3">
          Voltar para os planos
        </Link>
      </View>
    );
  }

  const progresso = plano.duracaoDias > 0 ? Math.min(1, diasConcluidos.size / plano.duracaoDias) : 0;

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/planos" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Planos
          </Link>
          <BotaoTema />
        </View>

        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">{plano.titulo}</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">{plano.descricao}</Text>

        <View className="flex-row items-center gap-2 mb-6">
          <View className="flex-1 h-2 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
            <View className="h-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
          </View>
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {diasConcluidos.size}/{plano.duracaoDias} dias
          </Text>
        </View>

        {plano.dias.map((diaPlano) => {
          const concluido = diasConcluidos.has(diaPlano.dia);
          return (
            <View
              key={diaPlano.dia}
              className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-2.5 shadow-sm"
              style={SOMBRA}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">Dia {diaPlano.dia}</Text>
                <Pressable
                  onPress={() => alternarDia(diaPlano.dia)}
                  accessibilityLabel={concluido ? "Desmarcar dia como concluído" : "Marcar dia como concluído"}
                  className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    concluido ? "bg-green-600" : "border border-cor-borda dark:border-cor-borda-dark"
                  }`}
                >
                  <MaterialIcons name={concluido ? "check-circle" : "radio-button-unchecked"} size={16} color={concluido ? "white" : "#6b6153"} />
                  <Text className={`text-xs font-semibold ${concluido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
                    {concluido ? "Concluído" : "Marcar"}
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {diaPlano.referencias.map((ref) => {
                  const href = hrefDaReferencia(ref);
                  const conteudo = (
                    <View className="px-3 py-1.5 rounded-full bg-cor-fundo dark:bg-cor-fundo-dark border border-cor-borda dark:border-cor-borda-dark">
                      <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{ref}</Text>
                    </View>
                  );
                  return href ? (
                    <Link key={ref} href={href} asChild>
                      <Pressable>{conteudo}</Pressable>
                    </Link>
                  ) : (
                    <View key={ref}>{conteudo}</View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
