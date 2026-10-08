import { Link, Stack, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View } from "react-native";
import { coresDoGenero, descricaoDoGenero } from "../../core/content/genero";
import { livros, obterResumo } from "../../core/content/livros";
import {
  carregarPreferenciasLeitura,
  FAMILIA_SERIFADA,
  INDICE_PADRAO,
  salvarFonteSerifada,
  salvarIndiceFonte,
  TAMANHOS_FONTE,
} from "../../core/leitura/preferenciaFonte";
import { livrosLidosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";
import { BotaoTema } from "../../components/BotaoTema";
import { TextoComReferencias } from "../../components/TextoComReferencias";
import { Tooltip } from "../../components/Tooltip";
import { mostrarToast } from "../../core/util/toast";
import { ativarComEspaco } from "../../core/util/ativarComEspaco";
import { PressableComTecladoWeb } from "../../core/util/propsPressableWeb";

export function generateStaticParams() {
  return livros.map((livro) => ({ livro: livro.slug }));
}

export default function ResumoLivro() {
  const { livro: slug } = useLocalSearchParams<{ livro: string }>();
  const resumo = obterResumo(slug ?? "");
  const ownerId = useOwnerId();
  const [lido, setLido] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [indiceFonte, setIndiceFonte] = useState(INDICE_PADRAO);
  const [fonteSerifada, setFonteSerifada] = useState(false);
  const [carregandoPreferenciasFonte, setCarregandoPreferenciasFonte] = useState(true);
  const [salvandoPreferenciasFonte, setSalvandoPreferenciasFonte] = useState(false);

  function aoRolar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const alturaRolavel = contentSize.height - layoutMeasurement.height;
    setProgresso(alturaRolavel > 0 ? Math.min(1, Math.max(0, contentOffset.y / alturaRolavel)) : 0);
  }

  async function ajustarFonte(delta: number) {
    if (carregandoPreferenciasFonte || salvandoPreferenciasFonte) return;
    const novo = Math.min(TAMANHOS_FONTE.length - 1, Math.max(0, indiceFonte + delta));
    if (novo === indiceFonte) return;
    setSalvandoPreferenciasFonte(true);
    try {
      await salvarIndiceFonte(novo);
      setIndiceFonte(novo);
    } catch {
      mostrarToast("Não foi possível salvar o tamanho da fonte", { severidade: "erro" });
    } finally {
      setSalvandoPreferenciasFonte(false);
    }
  }

  useEffect(() => {
    if (!ownerId || !slug) return;
    livrosLidosRepository.estaLido(ownerId, slug)
      .then(setLido)
      .catch(() => mostrarToast("Não foi possível carregar o progresso deste livro", { severidade: "erro" }));
  }, [ownerId, slug]);

  useEffect(() => {
    let ativo = true;
    void carregarPreferenciasLeitura().then((preferencias) => {
      if (!ativo) return;
      if (preferencias.indiceFonte !== undefined) setIndiceFonte(preferencias.indiceFonte);
      if (preferencias.fonteSerifada !== undefined) setFonteSerifada(preferencias.fonteSerifada);
      if (preferencias.falhas) {
        mostrarToast("Uma preferência de leitura não pôde ser carregada", { severidade: "erro" });
      }
    }).finally(() => {
      if (ativo) setCarregandoPreferenciasFonte(false);
    });
    return () => { ativo = false; };
  }, []);

  async function alternarFonteSerifada() {
    if (carregandoPreferenciasFonte || salvandoPreferenciasFonte) return;
    const novo = !fonteSerifada;
    setSalvandoPreferenciasFonte(true);
    try {
      await salvarFonteSerifada(novo);
      setFonteSerifada(novo);
    } catch {
      mostrarToast("Não foi possível salvar a preferência de fonte", { severidade: "erro" });
    } finally {
      setSalvandoPreferenciasFonte(false);
    }
  }

  if (!resumo) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Livro não encontrado.</Text>
        <Link href="/resumos" className="text-cor-destaque dark:text-cor-destaque-dark mt-3">
          Voltar para todos os livros
        </Link>
      </View>
    );
  }

  const indice = livros.findIndex((l) => l.slug === resumo.slug);
  const anterior = indice > 0 ? livros[indice - 1] : null;
  const proximo = indice < livros.length - 1 ? livros[indice + 1] : null;
  const cores = coresDoGenero(resumo.genero);
  const tamanhoFonte = TAMANHOS_FONTE[indiceFonte];

  async function alternarLido() {
    if (!ownerId) return;
    const novoEstado = await livrosLidosRepository.alternar(ownerId, resumo!.slug);
    setLido(novoEstado);
  }

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Head>
        <title>{`Resumo de ${resumo.nome} — Bíblia Plataforma`}</title>
        <meta
          name="description"
          content={`Contexto histórico, autoria, estrutura e principais temas do livro de ${resumo.nome}.`}
        />
        <meta property="og:title" content={`Resumo de ${resumo.nome}`} />
        <meta property="og:description" content={`Entenda o livro de ${resumo.nome} antes de começar a leitura.`} />
      </Head>
      <Stack.Screen options={{ title: resumo.nome }} />
      <View className="h-0.5 bg-cor-borda dark:bg-cor-borda-dark">
        <View className="h-0.5 bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
      </View>
      <ScrollView onScroll={aoRolar} scrollEventThrottle={32} className="flex-1">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-5">
          <Link href="/resumos" className="text-cor-destaque dark:text-cor-destaque-dark">
            ← Todos os livros
          </Link>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <PressableComTecladoWeb
                onPress={() => ajustarFonte(-1)}
                disabled={carregandoPreferenciasFonte || salvandoPreferenciasFonte || indiceFonte === 0}
                accessibilityRole="button"
                accessibilityLabel="Diminuir tamanho da fonte"
                accessibilityState={{ disabled: carregandoPreferenciasFonte || salvandoPreferenciasFonte || indiceFonte === 0, busy: carregandoPreferenciasFonte || salvandoPreferenciasFonte }}
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-60"
              >
                <Text className={`text-xs font-bold ${indiceFonte === 0 ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40" : "text-cor-texto dark:text-cor-texto-dark"}`}>
                  A-
                </Text>
              </PressableComTecladoWeb>
              <PressableComTecladoWeb
                onPress={() => ajustarFonte(1)}
                disabled={carregandoPreferenciasFonte || salvandoPreferenciasFonte || indiceFonte === TAMANHOS_FONTE.length - 1}
                accessibilityRole="button"
                accessibilityLabel="Aumentar tamanho da fonte"
                accessibilityState={{ disabled: carregandoPreferenciasFonte || salvandoPreferenciasFonte || indiceFonte === TAMANHOS_FONTE.length - 1, busy: carregandoPreferenciasFonte || salvandoPreferenciasFonte }}
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-60"
              >
                <Text
                  className={`text-xs font-bold ${
                    indiceFonte === TAMANHOS_FONTE.length - 1
                      ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40"
                      : "text-cor-texto dark:text-cor-texto-dark"
                  }`}
                >
                  A+
                </Text>
              </PressableComTecladoWeb>
              <PressableComTecladoWeb
                onPress={alternarFonteSerifada}
                onKeyDown={(event) => ativarComEspaco(event, alternarFonteSerifada)}
                disabled={carregandoPreferenciasFonte || salvandoPreferenciasFonte}
                accessibilityRole="switch"
                accessibilityLabel="Fonte serifada"
                accessibilityState={{ checked: fonteSerifada, disabled: carregandoPreferenciasFonte || salvandoPreferenciasFonte, busy: carregandoPreferenciasFonte || salvandoPreferenciasFonte }}
                accessibilityChecked={fonteSerifada}
                className={`w-10 h-10 items-center justify-center rounded-full border active:opacity-60 ${
                  fonteSerifada
                    ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark"
                    : "border-cor-borda dark:border-cor-borda-dark"
                }`}
              >
                <Text style={{ fontFamily: FAMILIA_SERIFADA }} className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark">
                  Aa
                </Text>
              </PressableComTecladoWeb>
            </View>
            <BotaoTema />
          </View>
        </View>

        <Tooltip titulo={resumo.genero} descricao={descricaoDoGenero(resumo.genero)}>
          <View className={`self-start flex-row items-center gap-1 px-3 py-1 rounded-full mb-3 ${cores.bg}`}>
            <Text className={`text-xs font-semibold uppercase tracking-wide ${cores.texto}`}>{resumo.genero}</Text>
            <Text className={`text-[10px] ${cores.texto}`}>ⓘ</Text>
          </View>
        </Tooltip>
        <Text accessibilityRole="header" className="text-4xl font-extrabold text-cor-texto dark:text-cor-texto-dark mb-2 leading-tight">
          {resumo.nome}
        </Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Livro {resumo.numero} de 66 · {resumo.testamento} · {resumo.capitulos} capítulos ·{" "}
          {resumo.tempoLeituraMin} min de leitura
        </Text>

        <PressableComTecladoWeb
          onPress={alternarLido}
          accessibilityRole="checkbox"
          accessibilityLabel="Marcar livro como lido"
          accessibilityState={{ checked: lido }}
          accessibilityChecked={lido}
          className={`self-start px-4 py-2.5 rounded-full mb-6 active:opacity-70 ${
            lido ? "bg-green-600" : "border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
          }`}
        >
          <Text className={`text-sm font-semibold ${lido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
            {lido ? "✓ Livro lido" : "Marcar como lido"}
          </Text>
        </PressableComTecladoWeb>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark -mt-4 mb-6">
          Isso atualiza seu progresso nos resumos. A leitura dos capítulos é acompanhada separadamente na Bíblia.
        </Text>

        <View className="border border-cor-borda dark:border-cor-borda-dark rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-8">
          {resumo.fichaRapida.map((item, i) => (
            <View
              key={item.rotulo}
              className={`px-4 py-3 ${
                i < resumo.fichaRapida.length - 1 ? "border-b border-cor-borda dark:border-cor-borda-dark" : ""
              }`}
            >
              <Text className="text-xs font-semibold uppercase text-cor-texto-suave dark:text-cor-texto-suave-dark">
                {item.rotulo}
              </Text>
              <TextoComReferencias
                texto={item.valor}
                className="text-cor-texto dark:text-cor-texto-dark mt-0.5"
                style={{
                  fontSize: tamanhoFonte,
                  lineHeight: tamanhoFonte * 1.4,
                  fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined,
                }}
              />
            </View>
          ))}
        </View>

        {resumo.secoes.map((secao) => (
          <View key={secao.id} className="mb-8">
            <Text accessibilityRole="header" className="text-xl font-bold text-cor-texto dark:text-cor-texto-dark mb-3">{secao.titulo}</Text>
            {secao.lista
              ? secao.itens.map((item, i) => (
                  <TextoComReferencias
                    key={i}
                    texto={`•  ${item}`}
                    className="text-cor-texto dark:text-cor-texto-dark mb-2"
                    style={{
                      fontSize: tamanhoFonte,
                      lineHeight: tamanhoFonte * 1.6,
                      fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined,
                    }}
                  />
                ))
              : secao.paragrafos.map((paragrafo, i) => (
                  <TextoComReferencias
                    key={i}
                    texto={paragrafo}
                    className="text-cor-texto dark:text-cor-texto-dark mb-3.5"
                    style={{
                      fontSize: tamanhoFonte,
                      lineHeight: tamanhoFonte * 1.6,
                      fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined,
                    }}
                  />
                ))}
          </View>
        ))}

        <View className="flex-row gap-3 mt-4 border-t border-cor-borda dark:border-cor-borda-dark pt-5">
          <View className="flex-1">
            {anterior ? (
              <Link href={`/resumos/${anterior.slug}`} asChild>
                <Pressable accessibilityRole="link" className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3 active:opacity-70">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">← Anterior</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{anterior.nome}</Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
          <View className="flex-1">
            {proximo ? (
              <Link href={`/resumos/${proximo.slug}`} asChild>
                <Pressable accessibilityRole="link" className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3 items-end active:opacity-70">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Próximo →</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{proximo.nome}</Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
