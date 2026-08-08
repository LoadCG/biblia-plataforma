import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CardConquistas } from "../../components/CardConquistas";
import { CardStreak } from "../../components/CardStreak";
import { CardVersiculoDia } from "../../components/CardVersiculoDia";
import { BotaoTema } from "../../components/BotaoTema";
import { calcularConquistas } from "../../core/content/conquistas";
import { livros, obterLivro } from "../../core/content/livros";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { livrosLidosRepository, progressoRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";
import type { CapituloLido } from "../../core/types/leitura";

function obterSaudacao() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

// "Continue Lendo": um capítulo só aparece uma vez, na posição da
// leitura mais recente dele — sem isso, reler o mesmo capítulo várias
// vezes criaria cards duplicados no carrossel.
function capitulosRecentes(itens: CapituloLido[], limite: number) {
  const maisRecentePorCapitulo = new Map<string, CapituloLido>();
  for (const item of itens) {
    const chave = `${item.livroSlug}-${item.capitulo}`;
    const existente = maisRecentePorCapitulo.get(chave);
    if (!existente || new Date(item.lidoEm) > new Date(existente.lidoEm)) {
      maisRecentePorCapitulo.set(chave, item);
    }
  }
  return Array.from(maisRecentePorCapitulo.values())
    .sort((a, b) => new Date(b.lidoEm).getTime() - new Date(a.lidoEm).getTime())
    .slice(0, limite);
}

function CardContinueLendo({ item }: { item: CapituloLido }) {
  const livro = obterLivro(item.livroSlug);
  if (!livro) return null;

  return (
    <Pressable
      onPress={() => router.push(`/biblia/${livro.slug}/${item.capitulo}`)}
      className="w-32 mr-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-3.5 py-4 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <View className="w-9 h-9 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center mb-2.5">
        <MaterialIcons name="auto-stories" size={18} color="#8a5a2b" />
      </View>
      <Text numberOfLines={1} className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">
        {livro.nome}
      </Text>
      <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
        Capítulo {item.capitulo}
      </Text>
    </Pressable>
  );
}

export default function Inicio() {
  const ownerId = useOwnerId();
  const [lidos, setLidos] = useState<string[]>([]);
  const [sequencia, setSequencia] = useState(0);
  const [recentes, setRecentes] = useState<CapituloLido[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
    progressoRepository.listarTodos(ownerId).then((itens) => {
      setSequencia(calcularSequenciaAtual(itens.map((i) => i.lidoEm)));
      setRecentes(capitulosRecentes(itens, 10));
    });
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const conquistas = useMemo(() => calcularConquistas(lidosSet), [lidosSet]);

  const saudacao = obterSaudacao();

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-4 pb-10 max-w-2xl w-full mx-auto">
        {/* Top Header & Saudação */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold tracking-tight text-cor-texto dark:text-cor-texto-dark">
            {saudacao}
          </Text>
          <View className="flex-row items-center gap-3">
            <BotaoTema />
            <Pressable className="w-8 h-8 items-center justify-center">
              <MaterialIcons name="notifications-none" size={24} className="text-cor-texto dark:text-cor-texto-dark" />
            </Pressable>
          </View>
        </View>

        <CardVersiculoDia />

        {recentes.length > 0 ? (
          <View className="mb-4 -mx-4 px-4">
            <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-2.5">Continue lendo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentes.map((item) => (
                <CardContinueLendo key={`${item.livroSlug}-${item.capitulo}`} item={item} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Resumos Div */}
        <Link href="/resumos" asChild>
          <Pressable
            className="flex-row items-center justify-between rounded-3xl bg-cor-destaque dark:bg-cor-destaque-dark px-6 py-5 mb-4 shadow-sm"
          >
            <View>
              <Text className="text-xl font-bold text-white mb-1">Estudo por Resumos</Text>
              <Text className="text-sm text-white/80">
                {lidos.length} de {livros.length} livros lidos
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <MaterialIcons name="menu-book" size={24} color="white" />
            </View>
          </Pressable>
        </Link>

        <CardStreak sequencia={sequencia} />

        <CardConquistas conquistas={conquistas} />

        <Link href="/estatisticas" className="mt-4 text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark self-center py-2">
          Ver todas as estatísticas
        </Link>
      </View>
    </ScrollView>
  );
}
