import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { EstadoCarregando } from "../components/EstadoCarregando";
import { EstadoErro } from "../components/EstadoErro";
import { IconeConquista } from "../components/IconeConquista";
import { calcularConquistas, obterLivrosPendentes, type Conquista, type IdConquista } from "../core/content/conquistas";
import { normalizarOrigemMedalhas, obterDestinoVoltaMedalhas } from "../core/leitura/navegacaoMedalhas";
import { livrosLidosRepository } from "../core/repositories";
import { useOwnerId } from "../core/useOwnerId";

type Estado = { status: "carregando" } | { status: "erro" } | { status: "disponivel"; lidos: string[] };
const IDS_CONQUISTA = new Set<IdConquista>([
  "primeiro-livro", "pentateuco", "evangelhos", "antigo-testamento", "novo-testamento", "biblia-completa",
]);

function LinhaConquista({ conquista, origem }: { conquista: Conquista; origem: "inicio" | "voce" }) {
  const progresso = conquista.progressoTotal > 0 ? Math.min(1, conquista.progressoAtual / conquista.progressoTotal) : 0;
  const completa = conquista.conquistada;
  const estado = completa ? "Conquistada" : conquista.progressoAtual > 0 ? "Em andamento" : "Não iniciada";

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/medalhas", params: { conquista: conquista.id, origem } })}
      accessibilityRole="button"
      accessibilityLabel={`${conquista.titulo}, ${estado}, ${conquista.progressoAtual} de ${conquista.progressoTotal}`}
      accessibilityHint="Abre os detalhes deste marco de leitura"
      className={`flex-row items-center gap-4 rounded-2xl px-4 py-4 mb-3 border active:opacity-80 ${completa ? "bg-cor-destaque/10 border-cor-destaque dark:border-cor-destaque-dark" : "bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border-cor-borda dark:border-cor-borda-dark"}`}
    >
      <View className={`w-14 h-14 rounded-full items-center justify-center border-2 ${completa ? "bg-cor-destaque/20 border-cor-destaque dark:border-cor-destaque-dark" : "bg-cor-borda dark:bg-cor-borda-dark border-transparent"}`}>
        <IconeConquista conquistaId={conquista.id} conquistada={completa} tamanho={26} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">{conquista.titulo}</Text>
          {completa ? <Text accessibilityLabel="Conquistada" className="text-cor-destaque dark:text-cor-destaque-dark text-xs">✓</Text> : null}
        </View>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2">{conquista.descricao}</Text>
        <View className="flex-row items-center gap-2">
          <View accessibilityRole="progressbar" accessibilityLabel={`Progresso: ${conquista.titulo}`} accessibilityValue={{ min: 0, max: conquista.progressoTotal, now: conquista.progressoAtual, text: `${conquista.progressoAtual} de ${conquista.progressoTotal}` }} className="flex-1 h-1.5 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
            <View className="h-1.5 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${progresso * 100}%` }} />
          </View>
          <Text className="text-[10px] text-cor-texto-suave dark:text-cor-texto-suave-dark">{conquista.progressoAtual}/{conquista.progressoTotal} · {estado}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Medalhas() {
  const params = useLocalSearchParams<{ conquista?: string; origem?: string }>();
  const idSelecionado = Array.isArray(params.conquista) ? params.conquista[0] : params.conquista;
  const origem = normalizarOrigemMedalhas(params.origem);
  const detalheSelecionado = Boolean(idSelecionado);
  const idValido = Boolean(idSelecionado && IDS_CONQUISTA.has(idSelecionado as IdConquista));
  const ownerId = useOwnerId();
  const [estado, setEstado] = useState<Estado>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useFocusEffect(useCallback(() => {
    if (!ownerId) return;
    let ativo = true;
    setEstado({ status: "carregando" });
    livrosLidosRepository.listar(ownerId)
      .then((lidos) => { if (ativo) setEstado({ status: "disponivel", lidos }); })
      .catch(() => { if (ativo) setEstado({ status: "erro" }); });
    return () => { ativo = false; };
  }, [ownerId, tentativa]));

  const conquistas = useMemo(
    () => estado.status === "disponivel" ? calcularConquistas(new Set(estado.lidos)) : [],
    [estado],
  );
  const totalConquistadas = conquistas.filter((conquista) => conquista.conquistada).length;
  const conquistaAtiva = idValido
    ? conquistas.find((conquista) => conquista.id === idSelecionado)
    : undefined;
  const livrosPendentes = conquistaAtiva && estado.status === "disponivel"
    ? obterLivrosPendentes(conquistaAtiva.id, new Set(estado.lidos))
    : [];

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            onPress={() => router.replace(obterDestinoVoltaMedalhas(origem, detalheSelecionado))}
            accessibilityRole="button"
            accessibilityLabel={detalheSelecionado
              ? "Voltar para todas as medalhas"
              : `Voltar para ${origem === "inicio" ? "Início" : "seu perfil"}`}
            className="min-h-11 justify-center pr-3 active:opacity-70"
          >
            <Text className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
              {detalheSelecionado ? "← Todas as medalhas" : `← ${origem === "inicio" ? "Início" : "Você"}`}
            </Text>
          </Pressable>
          <BotaoTema />
        </View>
        <Text accessibilityRole="header" className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">
          {conquistaAtiva?.titulo ?? (detalheSelecionado ? "Detalhe da medalha" : "Medalhas")}
        </Text>

        {estado.status === "carregando" || !ownerId ? <EstadoCarregando rotulo="Carregando seu progresso de leitura" /> : null}
        {estado.status === "erro" ? (
          <EstadoErro
            titulo="Não foi possível carregar seu progresso"
            descricao="Suas medalhas continuam salvas. Tente carregar novamente."
            aoTentarNovamente={() => setTentativa((atual) => atual + 1)}
          />
        ) : null}
        {detalheSelecionado && estado.status === "disponivel" && (!idValido || !conquistaAtiva) ? (
          <View className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-5">
            <Text accessibilityRole="header" className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-2">Medalha não encontrada</Text>
            <Pressable onPress={() => router.replace({ pathname: "/medalhas", params: { origem } })} accessibilityRole="button" className="min-h-11 justify-center self-start">
              <Text className="text-cor-destaque dark:text-cor-destaque-dark">Ver todas as medalhas</Text>
            </Pressable>
          </View>
        ) : null}
        {conquistaAtiva ? (
          <View>
            <View className={`items-center rounded-3xl px-6 py-8 mb-5 border ${conquistaAtiva.conquistada ? "bg-cor-destaque/10 border-cor-destaque dark:border-cor-destaque-dark" : "bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border-cor-borda dark:border-cor-borda-dark"}`}>
              <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${conquistaAtiva.conquistada ? "bg-cor-destaque/20" : "bg-cor-borda dark:bg-cor-borda-dark"}`}>
                <IconeConquista conquistaId={conquistaAtiva.id} conquistada={conquistaAtiva.conquistada} tamanho={36} />
              </View>
              <Text accessibilityRole="header" className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark text-center">{conquistaAtiva.titulo}</Text>
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark text-center mt-2">{conquistaAtiva.descricao}</Text>
              <Text accessibilityLiveRegion="polite" className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark mt-4">
                {conquistaAtiva.conquistada ? "Conquistada" : conquistaAtiva.progressoAtual > 0 ? "Em andamento" : "Ainda não iniciada"} · {conquistaAtiva.progressoAtual} de {conquistaAtiva.progressoTotal}
              </Text>
              <View accessibilityRole="progressbar" accessibilityLabel={`Progresso de ${conquistaAtiva.titulo}`} accessibilityValue={{ min: 0, max: conquistaAtiva.progressoTotal, now: conquistaAtiva.progressoAtual, text: `${conquistaAtiva.progressoAtual} de ${conquistaAtiva.progressoTotal}` }} className="w-full h-2 rounded-full bg-cor-borda dark:bg-cor-borda-dark mt-3">
                <View className="h-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark" style={{ width: `${Math.min(1, conquistaAtiva.progressoAtual / conquistaAtiva.progressoTotal) * 100}%` }} />
              </View>
            </View>
            {conquistaAtiva.conquistada ? (
              <View className="rounded-2xl bg-cor-destaque/10 p-5">
                <Text className="text-base font-semibold text-cor-texto dark:text-cor-texto-dark">Marco concluído</Text>
                <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">Você concluiu este percurso de leitura. Continue explorando outros livros e temas.</Text>
              </View>
            ) : (
              <View className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border border-cor-borda dark:border-cor-borda-dark p-5">
                <Text accessibilityRole="header" className="text-base font-semibold text-cor-texto dark:text-cor-texto-dark mb-1">Próximo passo</Text>
                <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">
                  {conquistaAtiva.id === "primeiro-livro"
                    ? "Leia o resumo de qualquer livro para iniciar sua jornada. Se quiser, comece por:"
                    : livrosPendentes.length > 0
                      ? `Faltam ${livrosPendentes.length} ${livrosPendentes.length === 1 ? "livro" : "livros"} para este marco:`
                      : "Este marco não tem livros pendentes."}
                </Text>
                {livrosPendentes.slice(0, 6).map((livro) => (
                  <Link key={livro.slug} href={`/resumos/${livro.slug}`} className="py-2 text-cor-destaque dark:text-cor-destaque-dark">
                    Abrir resumo de {livro.nome} →
                  </Link>
                ))}
                {livrosPendentes.length > 6 ? <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-2">E mais {livrosPendentes.length - 6} livros.</Text> : null}
              </View>
            )}
          </View>
        ) : null}
        {estado.status === "disponivel" && !detalheSelecionado ? (
          <>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
              {totalConquistadas} de {conquistas.length} conquistadas — marcos privados de leitura, sem pontuação nem ranking.
            </Text>
            {conquistas.map((conquista) => <LinhaConquista key={conquista.id} conquista={conquista} origem={origem} />)}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
