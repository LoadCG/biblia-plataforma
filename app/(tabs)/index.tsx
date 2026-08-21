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
import { planosLeitura } from "../../core/content/planos";
import { calcularSequenciaAtual } from "../../core/estatisticas/streak";
import { obterLembretePlano, type LembretePlano } from "../../core/leitura/lembretePlanos";
import { livrosLidosRepository, progressoRepository } from "../../core/repositories";
import { useColorScheme } from "../../core/theme";
import { useOwnerId } from "../../core/useOwnerId";
import { useArrastarParaRolar } from "../../core/util/useArrastarParaRolar";
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

function CardContinueLendo({ item, escuro }: { item: CapituloLido; escuro: boolean }) {
  const livro = obterLivro(item.livroSlug);
  if (!livro) return null;

  return (
    <Pressable
      onPress={() => router.push(`/biblia/${livro.slug}/${item.capitulo}`)}
      accessibilityRole="link"
      accessibilityLabel={`${livro.nome}, capítulo ${item.capitulo}`}
      className="w-32 mr-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-3.5 py-4 shadow-sm active:opacity-80"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <View className="w-9 h-9 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center mb-2.5">
        <MaterialIcons name="auto-stories" size={18} color={escuro ? "#e0a75e" : "#8a5a2b"} />
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
  const [lembretePlano, setLembretePlano] = useState<LembretePlano | null>(null);
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const refContinueLendo = useArrastarParaRolar();

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
    progressoRepository.listarTodos(ownerId).then((itens) => {
      setSequencia(calcularSequenciaAtual(itens.map((i) => i.lidoEm)));
      setRecentes(capitulosRecentes(itens, 10));
    });
    obterLembretePlano(ownerId, planosLeitura).then(setLembretePlano);
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
            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Notificações (em breve)"
              accessibilityState={{ disabled: true }}
              className="w-8 h-8 items-center justify-center opacity-40"
            >
              <MaterialIcons name="notifications-none" size={24} className="text-cor-texto dark:text-cor-texto-dark" />
            </Pressable>
          </View>
        </View>

        <CardVersiculoDia />

        {recentes.length > 0 ? (
          <View className="mb-4 -mx-4 px-4">
            <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-2.5">Continue lendo</Text>
            <ScrollView ref={refContinueLendo} horizontal showsHorizontalScrollIndicator={false}>
              {recentes.map((item) => (
                <CardContinueLendo key={`${item.livroSlug}-${item.capitulo}`} item={item} escuro={escuro} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {lembretePlano ? (
          <Link href={`/planos/${lembretePlano.plano.id}`} asChild>
            <Pressable accessibilityRole="link" className="flex-row items-center justify-between rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border border-cor-borda dark:border-cor-borda-dark px-4 py-3.5 mb-4 active:opacity-80">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-0.5">
                  Que tal continuar o "{lembretePlano.plano.titulo}"?
                </Text>
                <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
                  {lembretePlano.diasConcluidos} de {lembretePlano.plano.duracaoDias} dias — sem pressa, retome quando quiser.
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={escuro ? "#c9bfa8" : "#6b6153"} />
            </Pressable>
          </Link>
        ) : null}

        {/* Resumos Div — no claro o fundo é escuro (cor-destaque) com
            texto branco; no escuro o token cor-destaque-dark é um
            dourado CLARO (feito pra texto/ícone sobre fundo escuro, não
            pra ser fundo com texto branco em cima — branco sobre esse
            dourado dava só ~2.1:1 de contraste, bem abaixo do mínimo
            de 4.5:1). Por isso o texto usa `dark:text-cor-texto`
            (marrom quase preto) só neste card. */}
        <Link href="/resumos" asChild>
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center justify-between rounded-3xl bg-cor-destaque dark:bg-cor-destaque-dark px-6 py-5 mb-4 shadow-sm active:opacity-90"
          >
            <View className="flex-1 pr-4">
              <Text className="text-xl font-bold text-white dark:text-cor-texto mb-1">Estudo por Resumos</Text>
              <Text className="text-sm text-white/80 dark:text-cor-texto/70 mb-2">
                {lidos.length} de {livros.length} livros lidos
              </Text>
              <View className="h-1.5 rounded-full bg-white/20 dark:bg-cor-texto/10">
                <View
                  className="h-1.5 rounded-full bg-white dark:bg-cor-texto"
                  style={{ width: `${livros.length > 0 ? (lidos.length / livros.length) * 100 : 0}%` }}
                />
              </View>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/20 dark:bg-cor-texto/10 items-center justify-center">
              <MaterialIcons name="menu-book" size={24} color={escuro ? "#2a241c" : "white"} />
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
