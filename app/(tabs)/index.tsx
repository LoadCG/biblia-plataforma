import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { IconeUI } from "../../components/icone/IconeUI";
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
import { mostrarToast } from "../../core/util/toast";
import { obterSaudacao, type PeriodoDoDia } from "../../core/util/periodoDoDia";
import { usePeriodoDoDia } from "../../core/util/usePeriodoDoDia";
import { TEMAS_BUSCA } from "../../core/biblia/temasBusca";
import { IlustracaoTema } from "../../components/IlustracaoTema";
import { FAMILIA_SERIFADA } from "../../core/leitura/preferenciaFonte";
import type { CapituloLido } from "../../core/types/leitura";

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

function resolverPeriodoDaPrevia(valor: string | string[] | undefined): PeriodoDoDia | null {
  const periodo = Array.isArray(valor) ? valor[0] : valor;
  return periodo === "manha" || periodo === "tarde" || periodo === "noite" ? periodo : null;
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
        <IconeUI name="book-collection" size={18} color={escuro ? "#e0a75e" : "#8a5a2b"} />
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
  const parametros = useLocalSearchParams<{ previewPeriodo?: string | string[] }>();
  const ownerId = useOwnerId();
  const [lidos, setLidos] = useState<string[]>([]);
  const [sequencia, setSequencia] = useState(0);
  const [recentes, setRecentes] = useState<CapituloLido[]>([]);
  const [lembretePlano, setLembretePlano] = useState<LembretePlano | null>(null);
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const periodoReal = usePeriodoDoDia();
  const periodoPrevia = resolverPeriodoDaPrevia(parametros.previewPeriodo);
  // Permite comparar as três cenas no Expo Web durante desenvolvimento,
  // sem alterar a saudação real, o relógio do dispositivo ou builds publicados.
  const periodoDoDia = __DEV__ && Platform.OS === "web" ? periodoPrevia ?? periodoReal : periodoReal;
  const desktop = useWindowDimensions().width >= 1024;
  const refContinueLendo = useArrastarParaRolar();

  useEffect(() => {
    if (!ownerId) return;
    let ativo = true;
    Promise.allSettled([
      livrosLidosRepository.listar(ownerId),
      progressoRepository.listarTodos(ownerId),
      obterLembretePlano(ownerId, planosLeitura),
    ]).then(([resultadoLidos, resultadoProgresso, resultadoLembrete]) => {
      if (!ativo) return;
      let falhou = false;
      if (resultadoLidos.status === "fulfilled") setLidos(resultadoLidos.value);
      else falhou = true;
      if (resultadoProgresso.status === "fulfilled") {
        const itens = resultadoProgresso.value;
        setSequencia(calcularSequenciaAtual(itens.map((i) => i.lidoEm)));
        setRecentes(capitulosRecentes(itens, 10));
      } else falhou = true;
      if (resultadoLembrete.status === "fulfilled") setLembretePlano(resultadoLembrete.value);
      else falhou = true;
      if (falhou) mostrarToast("Não foi possível carregar alguns dados da página inicial", { severidade: "erro" });
    });
    return () => { ativo = false; };
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const conquistas = useMemo(() => calcularConquistas(lidosSet), [lidosSet]);

  const saudacao = obterSaudacao(periodoDoDia);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-4 pt-4 pb-10 max-w-2xl lg:max-w-6xl w-full mx-auto">
        {/* Top Header & Saudação */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-xl lg:text-3xl font-bold tracking-tight text-cor-texto dark:text-cor-texto-dark" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>
              {saudacao}
            </Text>
            <Text className="text-sm lg:text-base text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">
              Seu momento com a Palavra
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <BotaoTema />
            {/* Notificações não são possíveis no web sem um servidor
                (Web Push exige backend pra disparar o push no horário
                certo — o projeto não tem, por decisão, ver TODO.md),
                então o sino nem aparece lá — um placeholder "em breve"
                sem previsão real de virar algo só confundiria. No
                nativo, o lembrete diário já é 100% real e local (sem
                servidor nenhum, ver core/notifications/), só ainda sem
                app publicado em loja pra alguém usar — o sino leva
                direto pro toggle de verdade em Configurações, em vez
                de ser um ícone morto. */}
            {Platform.OS !== "web" ? (
              <Pressable
                onPress={() => router.push("/configuracoes")}
                accessibilityRole="link"
                accessibilityLabel="Lembrete diário de leitura"
                className="w-8 h-8 items-center justify-center active:opacity-60"
              >
                <IconeUI name="notification" size={24} className="text-cor-texto dark:text-cor-texto-dark" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View className="xl:flex-row xl:items-start xl:gap-6">
          <View className="xl:flex-[1.2] xl:min-w-0">
            <CardVersiculoDia periodoDoDia={periodoDoDia} />

            {desktop ? (
              <View className="mt-7">
                <View className="flex-row items-end justify-between mb-3">
                  <View>
                    <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark" style={{ fontFamily: FAMILIA_SERIFADA }}>Para o seu dia</Text>
                    <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">Uma pausa breve, guiada por um tema.</Text>
                  </View>
                  <Pressable onPress={() => router.push("/pesquisa")} accessibilityRole="link" className="flex-row items-center gap-1 py-2 active:opacity-70">
                    <Text className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark">Ver todos</Text>
                    <IconeUI name="next-chevron" size={18} color={escuro ? "#e0a75e" : "#8a5a2b"} />
                  </Pressable>
                </View>
                <View className="flex-row gap-3">
                  {TEMAS_BUSCA.filter((tema) => ["ansiedade", "esperanca", "sabedoria"].includes(tema.id)).map((tema) => (
                    <Pressable
                      key={tema.id}
                      onPress={() => router.push({ pathname: "/pesquisa", params: { tema: tema.id, origem: "inicio" } })}
                      accessibilityRole="link"
                      accessibilityLabel={`${tema.titulo}. ${tema.descricao}`}
                      className="flex-1 min-h-44 rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 justify-between active:opacity-80"
                    >
                      <View className="self-end opacity-90">
                        <IlustracaoTema tema={tema.id} cor={escuro ? tema.corTextoDark : tema.corTexto} tamanho={76} />
                      </View>
                      <View>
                        <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">{tema.titulo}</Text>
                        <Text numberOfLines={2} className="text-xs leading-4 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">{tema.descricao}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <View className="xl:flex-[0.85] xl:min-w-0 xl:pt-1">

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
              <IconeUI name="next-chevron" size={20} color={escuro ? "#c9bfa8" : "#6b6153"} />
            </Pressable>
          </Link>
        ) : null}

        {/* Superfície clara no tema padrão, alinhada aos cards editoriais
            da referência. No tema escuro, o dourado preserva o destaque
            com texto escuro para manter contraste. */}
        <Link href="/resumos" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Estudo por Resumos, ${lidos.length} de ${livros.length} livros lidos`}
            className="flex-row items-center justify-between rounded-[28px] bg-cor-destaque-fundo dark:bg-cor-destaque-dark px-5 py-5 mb-4 shadow-sm active:opacity-90"
          >
            <View className="flex-1 pr-5">
              <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-cor-texto-suave dark:text-cor-texto/65 mb-1.5">
                Sua jornada
              </Text>
              <Text className="text-xl font-bold text-cor-texto dark:text-cor-texto mb-1">Estudo por Resumos</Text>
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto/75 mb-3">
                {lidos.length} de {livros.length} livros lidos
              </Text>
              <View
                accessibilityRole="progressbar"
                accessibilityLabel="Progresso dos livros lidos"
                accessibilityValue={{ min: 0, max: livros.length, now: lidos.length }}
                className="h-1.5 rounded-full bg-cor-texto/10 dark:bg-cor-texto/15"
              >
                <View
                  className="h-1.5 rounded-full bg-cor-destaque dark:bg-cor-texto"
                  style={{ width: `${livros.length > 0 ? (lidos.length / livros.length) * 100 : 0}%` }}
                />
              </View>
            </View>
            <View className="w-14 h-14 rounded-full bg-white/60 dark:bg-cor-texto/10 items-center justify-center border border-cor-borda dark:border-cor-texto/10">
              <IconeUI name="book-collection" size={25} color={escuro ? "#e0a75e" : "#8a5a2b"} />
            </View>
          </Pressable>
        </Link>

        <CardStreak sequencia={sequencia} />

        <CardConquistas conquistas={conquistas} />

        <Link href="/estatisticas" className="mt-4 text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark self-center py-2">
          Ver todas as estatísticas
        </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
