import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../../../components/BotaoTema";
import { apenasCapitulo, buscarReferencia } from "../../../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../../../core/biblia/tipos";
import { livros, obterLivro } from "../../../core/content/livros";
import { grifosRepository, progressoRepository } from "../../../core/repositories";
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

  const scrollRef = useRef<ScrollView>(null);
  const posicoes = useRef<Record<number, number>>({});

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
    if (!ownerId || !livro) return;
    grifosRepository.listarPorCapitulo(ownerId, livro.slug, capitulo).then((itens) => {
      setGrifos(new Set(itens.map((g) => g.versiculo)));
    });
    progressoRepository.estaLido(ownerId, { livroSlug: livro.slug, capitulo }).then(setCapituloLido);
  }, [ownerId, livro, capitulo]);

  const jaRolou = useRef(false);
  useEffect(() => {
    jaRolou.current = false;
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
    }
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

  return (
    <ScrollView ref={scrollRef} className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href={`/biblia/${livro.slug}`} className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Trocar de capítulo
          </Link>
          <BotaoTema />
        </View>

        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-4">
          {livro.nome} {capitulo}
        </Text>

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
            return (
              <View
                key={v.numero}
                onLayout={(e) => aoMedirVersiculo(v.numero, e.nativeEvent.layout.y)}
                className={`flex-row mb-3 rounded-lg px-2 py-1 -mx-2 ${
                  grifado ? "bg-yellow-200 dark:bg-yellow-900" : ""
                } ${v.numero === versiculoAlvo ? "border-l-4 border-cor-destaque dark:border-cor-destaque-dark" : ""}`}
              >
                <Pressable onPress={() => alternarGrifo(v.numero)} className="mr-2 mt-0.5">
                  <Text className={grifado ? "text-yellow-700 dark:text-yellow-300" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}>
                    ✎
                  </Text>
                </Pressable>
                <Text className="flex-1 text-cor-texto dark:text-cor-texto-dark leading-6">
                  <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">{v.numero} </Text>
                  {v.texto}
                </Text>
              </View>
            );
          })
        ) : (
          <Text className="text-cor-texto dark:text-cor-texto-dark leading-6">{dados.texto}</Text>
        )}

        <View className="flex-row gap-3 mt-6 border-t border-cor-borda dark:border-cor-borda-dark pt-5">
          <View className="flex-1">
            {anterior ? (
              <Link href={`/biblia/${anterior.slug}/${anterior.capitulo}`} asChild>
                <Pressable className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">← Anterior</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">
                    {anterior.nome} {anterior.capitulo}
                  </Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
          <View className="flex-1">
            {proximo ? (
              <Link href={`/biblia/${proximo.slug}/${proximo.capitulo}`} asChild>
                <Pressable className="border border-cor-borda dark:border-cor-borda-dark rounded-xl p-3 items-end">
                  <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Próximo →</Text>
                  <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">
                    {proximo.nome} {proximo.capitulo}
                  </Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
