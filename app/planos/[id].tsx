import { Link, router, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BotaoTema } from "../../components/BotaoTema";
import { IlustracaoPlano } from "../../components/IlustracaoPlano";
import { EstadoCarregando } from "../../components/EstadoCarregando";
import { EstadoErro } from "../../components/EstadoErro";
import { obterPlano, planosLeitura } from "../../core/content/planos";
import { hrefReferenciaBiblica } from "../../core/biblia/parseReferencia";
import type { SessaoPlano } from "../../core/repositories/PlanosRepository";
import { planosRepository } from "../../core/repositories";
import { useColorScheme } from "../../core/theme";
import { useOwnerId } from "../../core/useOwnerId";
import { DicaContextual } from "../../components/DicaContextual";
import { mostrarToast } from "../../core/util/toast";
import { FAMILIA_SERIFADA } from "../../core/leitura/preferenciaFonte";

const SOMBRA = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } };

export function generateStaticParams() {
  return planosLeitura.map((plano) => ({ id: plano.id }));
}

// Referências vêm como "Mateus 1" (sem versículo) — mesmo padrão de
// parsing usado em CardVersiculoTema.tsx e pesquisa.tsx, aqui só sem o
// grupo de versículo.
export default function DetalhePlano() {
  const desktop = useWindowDimensions().width >= 1024;
  const { id } = useLocalSearchParams<{ id: string }>();
  const plano = obterPlano(id ?? "");
  const ownerId = useOwnerId();
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const [diasConcluidos, setDiasConcluidos] = useState<Set<number>>(new Set());
  const [sessoes, setSessoes] = useState<Record<number, SessaoPlano>>({});
  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [acaoEmAndamento, setAcaoEmAndamento] = useState<number | null>(null);

  useEffect(() => {
    if (!ownerId || !plano) {
      setCarregando(true);
      return;
    }
    let ativo = true;
    setCarregando(true);
    setErroAoCarregar(false);
    Promise.all([
      planosRepository.listarDiasConcluidos(ownerId, plano.id),
      Promise.all(plano.dias.map((dia) => planosRepository.obterSessao(ownerId, plano.id, dia.dia))),
    ]).then(([dias, sessoesCarregadas]) => {
      if (!ativo) return;
      setDiasConcluidos(new Set(dias));
      setSessoes(Object.fromEntries(sessoesCarregadas.filter(Boolean).map((sessao) => [sessao!.dia, sessao!])));
    }).catch(() => {
      if (ativo) setErroAoCarregar(true);
    }).finally(() => {
      if (ativo) setCarregando(false);
    });
    return () => { ativo = false; };
  }, [ownerId, plano, tentativa]);

  async function iniciarDia(dia: number, reiniciar = false) {
    if (!ownerId || !plano) return;
    setAcaoEmAndamento(dia);
    try {
      const conteudo = plano.dias.find((item) => item.dia === dia);
      if (!conteudo) return;
      const sessao = reiniciar ? null : await planosRepository.obterSessao(ownerId, plano.id, dia);
      const indice = Math.min(sessao?.indiceAtual ?? 0, conteudo.referencias.length - 1);
      const href = hrefReferenciaBiblica(conteudo.referencias[indice]);
      if (!href) {
        mostrarToast("Não foi possível abrir a referência deste dia.");
        return;
      }
      await planosRepository.salvarSessao(ownerId, plano.id, dia, indice, sessao?.referenciasConcluidas ?? []);
      const separador = href.includes("?") ? "&" : "?";
      router.push(`${href}${separador}planoId=${encodeURIComponent(plano.id)}&diaPlano=${dia}&indicePlano=${indice}`);
    } catch {
      mostrarToast("Não foi possível iniciar esta sessão. Tente novamente.");
    } finally {
      setAcaoEmAndamento(null);
    }
  }

  async function alternarDia(dia: number) {
    if (!ownerId || !plano) return;
    setAcaoEmAndamento(dia);
    try {
      const ativo = await planosRepository.alternarDiaConcluido(ownerId, plano.id, dia);
      setDiasConcluidos((atual) => {
        const novo = new Set(atual);
        if (ativo) novo.add(dia);
        else novo.delete(dia);
        return novo;
      });
    } catch {
      mostrarToast("Não foi possível atualizar o progresso. Tente novamente.");
    } finally {
      setAcaoEmAndamento(null);
    }
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
  const proximoPendente = plano.dias.find((dia) => !diasConcluidos.has(dia.dia));

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Head>
        <title>{`${plano.titulo} — Bíblia Plataforma`}</title>
        <meta name="description" content={`${plano.descricao} Plano guiado de ${plano.duracaoDias} dias.`} />
      </Head>
      <View className="px-5 pt-6 lg:pt-10 pb-10 max-w-2xl lg:max-w-6xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/planos" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Planos
          </Link>
          <BotaoTema />
        </View>

        <View className={desktop ? "flex-row items-center justify-between rounded-[28px] border border-cor-borda dark:border-cor-borda-dark bg-cor-destaque-fundo dark:bg-cor-fundo-elevado-dark px-7 py-6 mb-5" : undefined}>
          <View className="flex-1 lg:pr-8">
            {desktop ? <Text className="text-[11px] font-semibold uppercase tracking-[1.8px] text-cor-destaque dark:text-cor-destaque-dark mb-2">Plano de leitura</Text> : null}
            <Text accessibilityRole="header" className="text-2xl lg:text-4xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1" style={desktop ? { fontFamily: FAMILIA_SERIFADA } : undefined}>{plano.titulo}</Text>
            <Text className="text-sm lg:text-base text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4 lg:mb-0">{plano.descricao}</Text>
          </View>
          {desktop ? <View aria-hidden={true} className="w-[220px] h-[150px]"><IlustracaoPlano escuro={escuro} /></View> : null}
        </View>
        <DicaContextual id="planos" titulo="Sessões guiadas" descricao="Comece um dia e avance pelas leituras na ordem. Seu ponto de retomada fica salvo neste dispositivo." />

        {erroAoCarregar ? (
          <EstadoErro titulo="Não foi possível carregar seu progresso" descricao="Tente novamente para ver os dias concluídos e retomar sua sessão." aoTentarNovamente={() => setTentativa((valor) => valor + 1)} />
        ) : carregando ? (
          <EstadoCarregando rotulo="Carregando progresso do plano" />
        ) : <>
        <View className={desktop ? "w-full max-w-4xl self-center" : "w-full"}>
        <View className="flex-row items-center gap-2 mb-6">
          <View className="flex-1 h-2 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
            <View className="h-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
          </View>
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {diasConcluidos.size}/{plano.duracaoDias} dias
          </Text>
        </View>

        {proximoPendente ? (
          <Pressable onPress={() => iniciarDia(proximoPendente.dia)} disabled={acaoEmAndamento !== null} accessibilityRole="button" className="rounded-2xl bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-4 mb-5 active:opacity-80 disabled:opacity-60">
            <Text className="text-white dark:text-cor-texto text-xs font-semibold">PRÓXIMO PASSO · DIA {proximoPendente.dia}</Text>
            <Text className="text-white dark:text-cor-texto text-lg font-extrabold mt-1">{sessoes[proximoPendente.dia] ? "Continuar sessão" : "Começar leitura de hoje"}</Text>
          </Pressable>
        ) : <View className="rounded-2xl bg-green-700 px-5 py-4 mb-5"><Text className="text-white font-bold">✓ Plano concluído</Text></View>}

        {plano.dias.map((diaPlano) => {
          const concluido = diasConcluidos.has(diaPlano.dia);
          return (
            <View
              key={diaPlano.dia}
              className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-2.5 shadow-sm"
              style={SOMBRA}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">Dia {diaPlano.dia}</Text>
                  {diaPlano.titulo ? <Text className="text-xs text-cor-destaque dark:text-cor-destaque-dark font-semibold">{diaPlano.titulo}</Text> : null}
                </View>
                <Pressable
                  onPress={() => alternarDia(diaPlano.dia)}
                  disabled={acaoEmAndamento !== null}
                  accessibilityRole="checkbox"
                  accessibilityLabel={concluido ? "Desmarcar dia como concluído" : "Marcar dia como concluído"}
                  accessibilityState={{ checked: concluido }}
                  // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                  accessibilityChecked={concluido}
                  className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full active:opacity-70 ${
                    concluido ? "bg-green-600" : "border border-cor-borda dark:border-cor-borda-dark"
                  }`}
                >
                  <MaterialIcons name={concluido ? "check-circle" : "radio-button-unchecked"} size={16} color={concluido ? "white" : escuro ? "#b3a894" : "#6b6153"} />
                  <Text className={`text-xs font-semibold ${concluido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
                    {concluido ? "Concluído" : "Marcar"}
                  </Text>
                </Pressable>
              </View>

              {diaPlano.reflexao ? (
                <View className="rounded-xl bg-cor-fundo dark:bg-cor-fundo-dark px-3 py-3 mb-3">
                  <Text className="text-sm text-cor-texto dark:text-cor-texto-dark leading-5">{diaPlano.reflexao}</Text>
                  {diaPlano.pergunta ? <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mt-2">Para refletir: {diaPlano.pergunta}</Text> : null}
                </View>
              ) : null}

              <View className="flex-row flex-wrap gap-2">
                {diaPlano.referencias.map((ref) => {
                  const href = hrefReferenciaBiblica(ref);
                  const conteudo = (
                    <View className="px-3 py-1.5 rounded-full bg-cor-fundo dark:bg-cor-fundo-dark border border-cor-borda dark:border-cor-borda-dark">
                      <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{ref}</Text>
                    </View>
                  );
                  return href ? (
                    <Link key={ref} href={href} asChild>
                      <Pressable accessibilityRole="link" className="active:opacity-70">{conteudo}</Pressable>
                    </Link>
                  ) : (
                    <View key={ref}>{conteudo}</View>
                  );
                })}
              </View>
              <Pressable
                onPress={() => iniciarDia(diaPlano.dia, concluido)}
                disabled={acaoEmAndamento !== null}
                accessibilityRole="button"
                className="mt-3 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-4 py-2.5 items-center active:opacity-80"
              >
                <Text className="text-white dark:text-cor-texto font-bold text-sm">
                  {concluido ? "Revisar leituras" : sessoes[diaPlano.dia] ? "Continuar sessão" : "Começar este dia"}
                </Text>
              </Pressable>
            </View>
          );
        })}
        </View>
        </>}
      </View>
    </ScrollView>
  );
}
