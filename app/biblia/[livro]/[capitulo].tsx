import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent, Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../../../components/BotaoTema";
import { ModalNota } from "../../../components/ModalNota";
import { buscarReferencia } from "../../../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../../../core/biblia/tipos";
import { livros, obterLivro } from "../../../core/content/livros";
import {
  carregarFonteSerifada,
  carregarIndiceFonte,
  FAMILIA_SERIFADA,
  INDICE_PADRAO,
  salvarFonteSerifada,
  salvarIndiceFonte,
  TAMANHOS_FONTE,
} from "../../../core/leitura/preferenciaFonte";
import { salvarUltimaLeitura } from "../../../core/leitura/ultimaLeitura";
import { grifosRepository, notasRepository, progressoRepository } from "../../../core/repositories";
import { useOwnerId } from "../../../core/useOwnerId";

export default function Leitura() {
  const params = useLocalSearchParams<{ livro: string; capitulo: string; versiculo?: string }>();
  const livro = obterLivro(params.livro ?? "");
  const capitulo = parseInt(params.capitulo ?? "", 10);
  const versiculoAlvo = params.versiculo ? parseInt(params.versiculo, 10) : null;
  const ownerId = useOwnerId();

  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState(false);
  const [grifos, setGrifos] = useState<Set<number>>(new Set());
  const [capituloLido, setCapituloLido] = useState(false);
  const [notas, setNotas] = useState<Map<number, string>>(new Map());
  const [versiculoEditandoNota, setVersiculoEditandoNota] = useState<number | null>(null);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState<number | null>(null);
  const [indiceFonte, setIndiceFonte] = useState(INDICE_PADRAO);
  const [fonteSerifada, setFonteSerifada] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [versiculoRealcado, setVersiculoRealcado] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const posicoes = useRef<Record<number, number>>({});

  useEffect(() => {
    carregarIndiceFonte().then(setIndiceFonte);
    carregarFonteSerifada().then(setFonteSerifada);
  }, []);

  function ajustarFonte(delta: number) {
    setIndiceFonte((atual) => {
      const novo = Math.min(TAMANHOS_FONTE.length - 1, Math.max(0, atual + delta));
      salvarIndiceFonte(novo);
      return novo;
    });
  }

  function alternarFonteSerifada() {
    setFonteSerifada((atual) => {
      const novo = !atual;
      salvarFonteSerifada(novo);
      return novo;
    });
  }

  const indiceLivro = livro ? livros.indexOf(livro) : -1;
  const valido = !!livro && !!capitulo && capitulo >= 1 && capitulo <= livro.capitulos;

  useEffect(() => {
    if (!valido || !livro) return;
    setDados(null);
    setErro(false);
    buscarReferencia(`${livro.nome} ${capitulo}`)
      .then(setDados)
      .catch(() => setErro(true));
  }, [valido, livro, capitulo]);

  useEffect(() => {
    if (!valido || !livro) return;
    salvarUltimaLeitura(livro.slug, capitulo);
  }, [valido, livro, capitulo]);

  useEffect(() => {
    if (!ownerId || !livro) return;
    grifosRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setGrifos(new Set(itens.map((g) => g.versiculo)));
    });
    progressoRepository.estaLido(ownerId, { livroSlug: livro.slug, capitulo }).then(setCapituloLido);
    notasRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setNotas(new Map(itens.map((n) => [n.versiculo, n.texto])));
    });
  }, [ownerId, livro, capitulo]);

  const jaRolou = useRef(false);
  useEffect(() => {
    jaRolou.current = false;
    setVersiculoSelecionado(null);
    setProgresso(0);
  }, [versiculoAlvo, dados]);

  function aoMedirVersiculo(numero: number, y: number) {
    posicoes.current[numero] = y;
    // Dispara a rolagem aqui, não num useEffect separado: o layout de
    // cada versículo só é medido de forma assíncrona (onLayout), então um
    // efeito rodando logo após setDados() ainda não teria a posição —
    // rolar a partir do próprio onLayout garante que ela já existe.
    if (!jaRolou.current && numero === versiculoAlvo) {
      jaRolou.current = true;
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true }));
      setVersiculoRealcado(numero);
      setTimeout(() => setVersiculoRealcado((atual) => (atual === numero ? null : atual)), 2500);
    }
  }

  function aoRolar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const alturaRolavel = contentSize.height - layoutMeasurement.height;
    setProgresso(alturaRolavel > 0 ? Math.min(1, Math.max(0, contentOffset.y / alturaRolavel)) : 0);
  }

  if (!livro || !valido) {
    return (
      <View className="flex-1 items-center justify-center bg-cor-fundo dark:bg-cor-fundo-dark px-6">
        <Text className="text-cor-texto dark:text-cor-texto-dark">Capítulo não encontrado.</Text>
      </View>
    );
  }

  async function alternarGrifo(numeroVersiculo: number) {
    if (!ownerId || !livro) return;
    const ativo = await grifosRepository.alternar(ownerId, { livroSlug: livro.slug, capitulo, versiculo: numeroVersiculo });
    setGrifos((atual) => {
      const novo = new Set(atual);
      if (ativo) novo.add(numeroVersiculo);
      else novo.delete(numeroVersiculo);
      return novo;
    });
  }

  async function alternarCapituloLido() {
    if (!ownerId || !livro) return;
    const ativo = await progressoRepository.alternar(ownerId, { livroSlug: livro.slug, capitulo });
    setCapituloLido(ativo);
  }

  async function salvarNota(texto: string) {
    if (!ownerId || !livro || versiculoEditandoNota === null) return;
    const ref = { livroSlug: livro.slug, capitulo, versiculo: versiculoEditandoNota };
    if (texto) {
      await notasRepository.salvar(ownerId, ref, texto);
      setNotas((atual) => new Map(atual).set(versiculoEditandoNota, texto));
    } else {
      await notasRepository.remover(ownerId, ref);
      setNotas((atual) => {
        const novo = new Map(atual);
        novo.delete(versiculoEditandoNota);
        return novo;
      });
    }
    setVersiculoEditandoNota(null);
  }

  async function removerNota() {
    if (!ownerId || !livro || versiculoEditandoNota === null) return;
    await notasRepository.remover(ownerId, { livroSlug: livro.slug, capitulo, versiculo: versiculoEditandoNota });
    setNotas((atual) => {
      const novo = new Map(atual);
      novo.delete(versiculoEditandoNota);
      return novo;
    });
    setVersiculoEditandoNota(null);
  }

  function selecionarVersiculo(numero: number) {
    setVersiculoSelecionado((atual) => (atual === numero ? null : numero));
  }

  // Capítulo anterior/próximo, cruzando para o livro vizinho nas
  // fronteiras (ex.: Gênesis 1 não tem anterior; Malaquias 4 → Mateus 1).
  const anterior =
    capitulo > 1
      ? { slug: livro.slug, nome: livro.nome, capitulo: capitulo - 1 }
      : indiceLivro > 0
        ? { slug: livros[indiceLivro - 1].slug, nome: livros[indiceLivro - 1].nome, capitulo: livros[indiceLivro - 1].capitulos }
        : null;

  const proximo =
    capitulo < livro.capitulos
      ? { slug: livro.slug, nome: livro.nome, capitulo: capitulo + 1 }
      : indiceLivro < livros.length - 1
        ? { slug: livros[indiceLivro + 1].slug, nome: livros[indiceLivro + 1].nome, capitulo: 1 }
        : null;

  const tamanhoFonte = TAMANHOS_FONTE[indiceFonte];

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="h-0.5 bg-cor-borda dark:bg-cor-borda-dark">
        <View className="h-0.5 bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
      </View>

      <View className="border-b border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark">
        <View className="px-5 py-3 max-w-2xl w-full mx-auto flex-row items-center justify-end">
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={() => ajustarFonte(-1)}
                disabled={indiceFonte === 0}
                accessibilityLabel="Diminuir tamanho da fonte"
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark"
              >
                <Text className={`text-xs font-bold ${indiceFonte === 0 ? "text-cor-texto-suave dark:text-cor-texto-suave-dark opacity-40" : "text-cor-texto dark:text-cor-texto-dark"}`}>
                  A-
                </Text>
              </Pressable>
              <Pressable
                onPress={() => ajustarFonte(1)}
                disabled={indiceFonte === TAMANHOS_FONTE.length - 1}
                accessibilityLabel="Aumentar tamanho da fonte"
                className="w-10 h-10 items-center justify-center rounded-full border border-cor-borda dark:border-cor-borda-dark"
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
              </Pressable>
              <Pressable
                onPress={alternarFonteSerifada}
                accessibilityLabel={fonteSerifada ? "Desativar fonte serifada" : "Ativar fonte serifada"}
                className={`w-10 h-10 items-center justify-center rounded-full border ${
                  fonteSerifada
                    ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark"
                    : "border-cor-borda dark:border-cor-borda-dark"
                }`}
              >
                <Text style={{ fontFamily: FAMILIA_SERIFADA }} className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark">
                  Aa
                </Text>
              </Pressable>
            </View>
            <BotaoTema />
          </View>
        </View>
      </View>

      <ScrollView ref={scrollRef} onScroll={aoRolar} scrollEventThrottle={32} className="flex-1">
        <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
          <Pressable
            onPress={alternarCapituloLido}
            className={`self-start px-4 py-2.5 rounded-full mb-6 ${
              capituloLido
                ? "bg-green-600"
                : "border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
            }`}
          >
            <Text className={`text-sm font-semibold ${capituloLido ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"}`}>
              {capituloLido ? "✓ Capítulo lido" : "Marcar capítulo como lido"}
            </Text>
          </Pressable>

          {erro ? (
            <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">
              Não foi possível carregar este capítulo agora. Tente de novo em instantes.
            </Text>
          ) : !dados ? (
            <ActivityIndicator />
          ) : dados.versiculos ? (
            dados.versiculos.map((v) => {
              const grifado = grifos.has(v.numero);
              const temNota = notas.has(v.numero);
              const selecionado = v.numero === versiculoSelecionado;
              return (
                <View key={v.numero} onLayout={(e) => aoMedirVersiculo(v.numero, e.nativeEvent.layout.y)} className="mb-0.5 -mx-2">
                  <Pressable
                    onPress={() => selecionarVersiculo(v.numero)}
                    className={`rounded-lg px-2 py-1.5 ${
                      grifado ? "bg-cor-grifo dark:bg-cor-grifo-dark" : v.numero === versiculoRealcado ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""
                    } ${selecionado ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""} ${
                      v.numero === versiculoAlvo ? "border-l-4 border-cor-destaque dark:border-cor-destaque-dark" : ""
                    }`}
                  >
                    <Text
                      className="text-cor-texto dark:text-cor-texto-dark"
                      style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.65, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }}
                    >
                      <Text
                        className="text-cor-texto-suave dark:text-cor-texto-suave-dark font-semibold"
                        style={{ fontSize: tamanhoFonte * 0.62 }}
                      >
                        {"  "}
                        {v.numero}{" "}
                      </Text>
                      {v.texto}
                      {temNota && !selecionado ? (
                        <Text className="text-cor-destaque dark:text-cor-destaque-dark"> 🗒</Text>
                      ) : null}
                    </Text>
                    {temNota ? (
                      <Text
                        className="text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5"
                        style={{ fontSize: tamanhoFonte * 0.78 }}
                      >
                        📝 {notas.get(v.numero)}
                      </Text>
                    ) : null}
                  </Pressable>

                  {selecionado ? (
                    <View className="flex-row gap-2 px-2 py-2">
                      <Pressable
                        onPress={() => alternarGrifo(v.numero)}
                        className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                          grifado
                            ? "bg-cor-grifo dark:bg-cor-grifo-dark border-cor-grifo-fg dark:border-cor-grifo-fg-dark"
                            : "border-cor-borda dark:border-cor-borda-dark"
                        }`}
                      >
                        <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
                          {grifado ? "✓ Grifado" : "✎ Grifar"}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setVersiculoEditandoNota(v.numero)}
                        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-cor-borda dark:border-cor-borda-dark"
                      >
                        <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">
                          {temNota ? "🗒 Editar nota" : "🗒 Anotar"}
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              );
            })
          ) : (
            <Text
              className="text-cor-texto dark:text-cor-texto-dark"
              style={{ fontSize: tamanhoFonte, lineHeight: tamanhoFonte * 1.65, fontFamily: fonteSerifada ? FAMILIA_SERIFADA : undefined }}
            >
              {dados.texto}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Barra fixa de navegação — decisão registrada em
          PLANO-NAVEGACAO.md item 1.4: trocar de capítulo usa replace
          (não empilha uma tela por capítulo lido em sequência); tocar
          no nome do livro abre o seletor como modal (item 3.5). */}
      <View className="border-t border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark">
        <View className="px-3 py-2.5 max-w-2xl w-full mx-auto flex-row items-center justify-between">
          <Pressable
            onPress={() => anterior && router.replace(`/biblia/${anterior.slug}/${anterior.capitulo}`)}
            disabled={!anterior}
            accessibilityLabel="Capítulo anterior"
            className={`w-10 h-10 items-center justify-center rounded-full ${anterior ? "" : "opacity-30"}`}
          >
            <Text className="text-lg text-cor-texto dark:text-cor-texto-dark">←</Text>
          </Pressable>

          <Link href={`/biblia/escolher/${livro.slug}`} asChild>
            <Pressable className="flex-1 items-center px-2 py-1.5">
              <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark" numberOfLines={1}>
                {livro.nome} {capitulo}
              </Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={() => proximo && router.replace(`/biblia/${proximo.slug}/${proximo.capitulo}`)}
            disabled={!proximo}
            accessibilityLabel="Próximo capítulo"
            className={`w-10 h-10 items-center justify-center rounded-full ${proximo ? "" : "opacity-30"}`}
          >
            <Text className="text-lg text-cor-texto dark:text-cor-texto-dark">→</Text>
          </Pressable>
        </View>
      </View>

      {versiculoEditandoNota !== null ? (
        <ModalNota
          key={versiculoEditandoNota}
          visivel
          versiculo={versiculoEditandoNota}
          textoInicial={notas.get(versiculoEditandoNota) ?? ""}
          onFechar={() => setVersiculoEditandoNota(null)}
          onSalvar={salvarNota}
          onRemover={removerNota}
        />
      ) : null}
    </View>
  );
}
