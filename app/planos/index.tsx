import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { IconeUI } from "../../components/icone/IconeUI";
import { BotaoTema } from "../../components/BotaoTema";
import { IlustracaoPlano } from "../../components/IlustracaoPlano";
import { EstadoCarregando } from "../../components/EstadoCarregando";
import { EstadoErro } from "../../components/EstadoErro";
import { planosLeitura, type PlanoLeitura } from "../../core/content/planos";
import { planosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";
import { FAMILIA_SERIFADA } from "../../core/leitura/preferenciaFonte";
import { useColorScheme } from "../../core/theme";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

function CardPlano({ plano, diasConcluidos, desktop }: { plano: PlanoLeitura; diasConcluidos: number | null; desktop: boolean }) {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const progresso = diasConcluidos !== null && plano.duracaoDias > 0
    ? Math.min(1, diasConcluidos / plano.duracaoDias)
    : null;
  const concluido = diasConcluidos !== null && diasConcluidos >= plano.duracaoDias;
  const acao = concluido ? "Plano concluído" : diasConcluidos === null ? "Progresso indisponível" : diasConcluidos > 0 ? "Continuar plano" : "Conhecer plano";
  const icone = plano.id === "sabedoria-7" ? "wisdom" : "book-collection";

  return (
    <Link href={`/planos/${plano.id}`} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={`${plano.titulo}. ${acao}`} accessibilityHint="Abre o plano de leitura guiado" className={`rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4 mb-3 shadow-sm active:opacity-80 ${desktop ? "w-[48.5%]" : ""}`} style={SOMBRA}>
        <View className="flex-row items-center gap-3 mb-3">
          <View aria-hidden={true} className="w-11 h-11 rounded-2xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center">
            <IconeUI name={icone} size={22} className="text-cor-destaque dark:text-cor-destaque-dark" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark flex-1">{plano.titulo}</Text>
              {concluido ? <IconeUI name="complete" size={20} color={escuro ? "#7bd69a" : "#287a45"} /> : null}
            </View>
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5" numberOfLines={3}>
              {plano.descricao}
            </Text>
            <View accessibilityLabel={`${plano.duracaoDias} dias, público ${plano.editorial?.publico ?? "geral"}`} className="flex-row items-center gap-2 mt-2">
              <Text className="text-[11px] font-semibold text-cor-destaque dark:text-cor-destaque-dark">{plano.duracaoDias} dias</Text>
              <Text aria-hidden={true} className="text-[11px] text-cor-texto-suave dark:text-cor-texto-suave-dark">•</Text>
              <Text className="text-[11px] text-cor-texto-suave dark:text-cor-texto-suave-dark capitalize">{plano.editorial?.publico ?? "geral"}</Text>
            </View>
          </View>
        </View>
        {progresso !== null && diasConcluidos !== null ? (
          <View className="flex-row items-center gap-2">
            <View accessibilityRole="progressbar" accessibilityLabel={`Progresso de ${plano.titulo}`} accessibilityValue={{ min: 0, max: plano.duracaoDias, now: diasConcluidos, text: `${diasConcluidos} de ${plano.duracaoDias} dias` }} className="flex-1 h-1.5 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
              <View className="h-1.5 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
            </View>
            <Text className="text-[11px] font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">
              {diasConcluidos}/{plano.duracaoDias} dias
            </Text>
          </View>
        ) : (
          <Text accessibilityRole="text" className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {diasConcluidos === null ? "Progresso indisponível" : "Ainda não iniciado"}
          </Text>
        )}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-cor-borda dark:border-cor-borda-dark">
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {diasConcluidos === null ? "Abra para ver o plano" : concluido ? "Trilha finalizada" : diasConcluidos > 0 ? "Retome no seu ritmo" : "Ainda não iniciado"}
          </Text>
          <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">
            {diasConcluidos === null ? "Abrir plano →" : concluido ? "Ver plano →" : diasConcluidos > 0 ? "Continuar →" : "Conhecer plano →"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function Planos() {
  const desktop = useWindowDimensions().width >= 1024;
  const ownerId = useOwnerId();
  const [progressoPorPlano, setProgressoPorPlano] = useState<Record<string, number | null>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!ownerId) {
      setCarregando(true);
      return;
    }
    let ativo = true;
    setCarregando(true);
    setErro(false);
    Promise.all(planosLeitura.map(async (plano) => {
      try {
        const dias = await planosRepository.listarDiasConcluidos(ownerId, plano.id);
        return [plano.id, dias.length] as const;
      } catch {
        return [plano.id, null] as const;
      }
    })).then((pares) => {
      if (!ativo) return;
      setProgressoPorPlano(Object.fromEntries(pares));
      setErro(pares.some(([, progresso]) => progresso === null));
    }).finally(() => {
      if (ativo) setCarregando(false);
    });
    return () => { ativo = false; };
  }, [ownerId, tentativa]);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 lg:pt-10 pb-10 max-w-2xl lg:max-w-6xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          {/* /planos é acessível tanto da Início quanto de Descubra
              (ver TODO.md, item 6 do backlog de UI) — "← Voltar" com
              router.back() reflete de onde a pessoa realmente veio, em
              vez de fixar um destino que pode estar errado pra metade
              dos casos. Cai pra Início só se não houver histórico
              (ex.: URL aberta direto). */}
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="min-h-11 flex-row items-center gap-1 pr-3 active:opacity-70"
          >
            <IconeUI name="back" size={18} className="text-cor-destaque dark:text-cor-destaque-dark" />
            <Text className="text-cor-destaque dark:text-cor-destaque-dark text-sm">Voltar</Text>
          </Pressable>
          <BotaoTema />
        </View>
        <Text accessibilityRole="header" className="text-2xl lg:text-4xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>Planos de leitura</Text>
        <Text className="text-sm lg:text-base text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5 lg:mb-7">
          Trilhas guiadas pela Bíblia, um dia de cada vez.
        </Text>

        {desktop ? (
          <Pressable
            onPress={() => router.push("/planos/sabedoria-7")}
            accessibilityRole="link"
            accessibilityLabel="Conhecer o plano Semana da Sabedoria, 7 dias"
            className="flex-row items-center justify-between rounded-[28px] border border-cor-borda dark:border-cor-borda-dark bg-cor-destaque-fundo dark:bg-cor-fundo-elevado-dark p-7 mb-8 overflow-hidden active:opacity-90"
          >
            <View className="flex-1 max-w-2xl pr-8">
              <Text className="text-[11px] font-semibold uppercase tracking-[1.8px] text-cor-destaque dark:text-cor-destaque-dark mb-2">Um convite para esta semana</Text>
              <Text className="text-3xl font-bold text-cor-texto dark:text-cor-texto-dark mb-2" style={{ fontFamily: FAMILIA_SERIFADA }}>Cresça um pouco todos os dias</Text>
              <Text className="text-base text-cor-texto-suave dark:text-cor-texto-suave-dark leading-6 mb-5">Conheça a Semana da Sabedoria: sete dias pelos livros poéticos e sapienciais para fortalecer a mente e o espírito.</Text>
              <View className="self-start flex-row items-center gap-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-3">
                <Text className="text-sm font-bold text-white dark:text-cor-texto">Conhecer o plano</Text>
                <IconeUI name="next" size={18} className="text-white dark:text-cor-texto" />
              </View>
            </View>
            <View aria-hidden={true} className="w-[270px] h-[170px] mr-5">
              <IlustracaoPlano />
            </View>
          </Pressable>
        ) : null}

        {erro && !carregando ? (
          <EstadoErro titulo="Não foi possível carregar todo o progresso" descricao="Os planos continuam disponíveis. Tente novamente para atualizar seu avanço." aoTentarNovamente={() => setTentativa((valor) => valor + 1)} />
        ) : null}
        {carregando ? (
          <EstadoCarregando rotulo="Carregando progresso dos planos" />
        ) : (
          <View className={desktop ? "flex-row flex-wrap justify-between" : undefined}>
            {planosLeitura.map((plano) => (
              <CardPlano key={plano.id} plano={plano} diasConcluidos={progressoPorPlano[plano.id] ?? null} desktop={desktop} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
