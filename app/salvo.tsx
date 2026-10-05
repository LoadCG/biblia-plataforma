import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { CardAtividade } from "../components/CardAtividade";
import { EstadoVazio } from "../components/EstadoVazio";
import { EstadoCarregando } from "../components/EstadoCarregando";
import { EstadoErro } from "../components/EstadoErro";
import { carregarAtividade, chaveAtividade, dataMaisRecente, type ItemAtividade } from "../core/estatisticas/atividade";
import { useOwnerId } from "../core/useOwnerId";
import { obterLivro } from "../core/content/livros";
import { colecoesRepository, grifosRepository, notasRepository, pesquisasFavoritasRepository, versiculosSalvosRepository } from "../core/repositories";
import type { AssociacaoColecao, Colecao } from "../core/repositories/ColecoesRepository";
import { mostrarToast } from "../core/util/toast";
import { IconeUI } from "../components/icone/IconeUI";
import { useColorScheme } from "../core/theme";
import { normalizarBusca } from "../core/biblia/relevanciaBusca";

type Filtro = "todos" | "grifo" | "nota" | "pesquisa" | "salvo";

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: "todos", rotulo: "Todos" },
  { chave: "salvo", rotulo: "Salvos" },
  { chave: "nota", rotulo: "Anotações" },
  { chave: "grifo", rotulo: "Grifados" },
  { chave: "pesquisa", rotulo: "Pesquisas" },
];

const CHAVES_FILTRO = FILTROS.map((f) => f.chave);

function filtroValido(valor: string | undefined): Filtro {
  return CHAVES_FILTRO.includes(valor as Filtro) ? (valor as Filtro) : "todos";
}

export default function Salvo() {
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const { filtro: filtroInicial } = useLocalSearchParams<{ filtro?: string }>();
  const ownerId = useOwnerId();
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erroAoCarregar, setErroAoCarregar] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>(() => filtroValido(filtroInicial));
  const [termo, setTermo] = useState("");
  const [ordem, setOrdem] = useState<"recentes" | "biblica">("recentes");
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [associacoes, setAssociacoes] = useState<AssociacaoColecao[]>([]);
  const [colecaoFiltro, setColecaoFiltro] = useState<string | null>(null);
  const [gerenciandoColecoes, setGerenciandoColecoes] = useState(false);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [novaColecao, setNovaColecao] = useState("");
  const [editandoColecao, setEditandoColecao] = useState<Colecao | null>(null);
  const [nomeColecao, setNomeColecao] = useState("");

  const carregar = useCallback(async () => {
    if (!ownerId) {
      setCarregando(true);
      return;
    }
    setCarregando(true);
    setErroAoCarregar(false);
    try {
      const [itens, cols, associacoesCarregadas] = await Promise.all([carregarAtividade(ownerId), colecoesRepository.listar(ownerId), colecoesRepository.listarAssociacoes(ownerId)]);
      setAtividade(itens); setColecoes(cols); setAssociacoes(associacoesCarregadas);
    } catch {
      setErroAoCarregar(true);
    } finally {
      setCarregando(false);
    }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar, tentativa]));

  useEffect(() => {
    if (filtroInicial) setFiltro(filtroValido(filtroInicial));
  }, [filtroInicial]);

  const chavesColecao = new Set(associacoes.filter((item) => !colecaoFiltro || item.colecaoId === colecaoFiltro).map((item) => item.itemChave));
  const buscaNormalizada = normalizarBusca(termo);
  const filtrados = (filtro === "todos" ? atividade : atividade.filter((item) => item.tipo === filtro))
    .filter((item) => !colecaoFiltro || chavesColecao.has(chaveAtividade(item)))
    .filter((item) => {
      if (!buscaNormalizada) return true;
      const livro = item.tipo === "pesquisa" ? "" : obterLivro(item.livroSlug)?.nome ?? "";
      const referenciasNota = item.tipo === "nota"
        ? (item.referencias ?? [{ livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo }])
            .map((ref) => `${ref.capitulo}:${ref.versiculo}`)
            .join(" ")
        : item.tipo === "pesquisa" ? "" : `${item.capitulo}:${item.versiculo}`;
      return normalizarBusca(`${livro} ${item.tipo === "nota" ? `${referenciasNota} ${item.texto}` : item.tipo === "pesquisa" ? item.termo : referenciasNota}`).includes(buscaNormalizada);
    })
    .sort((a, b) => ordem === "recentes" ? new Date(dataMaisRecente(b)).getTime() - new Date(dataMaisRecente(a)).getTime() : ordemBiblica(a) - ordemBiblica(b));

  function ordemBiblica(item: ItemAtividade): number {
    if (item.tipo === "pesquisa") return Number.MAX_SAFE_INTEGER;
    const numero = obterLivro(item.livroSlug)?.numero ?? 999;
    return numero * 1_000_000 + item.capitulo * 1_000 + item.versiculo;
  }

  async function criarColecao() {
    if (!ownerId || !novaColecao.trim()) return;
    try {
      await colecoesRepository.criar(ownerId, novaColecao);
      setNovaColecao("");
      await carregar();
      mostrarToast("Coleção criada", { severidade: "sucesso" });
    } catch {
      mostrarToast("Não foi possível criar a coleção. Tente novamente.", { severidade: "erro" });
    }
  }

  async function salvarNomeColecao() {
    if (!ownerId || !editandoColecao || !nomeColecao.trim()) return;
    try {
      await colecoesRepository.renomear(ownerId, editandoColecao.id, nomeColecao);
      setEditandoColecao(null); setNomeColecao("");
      await carregar();
      mostrarToast("Coleção atualizada", { severidade: "sucesso" });
    } catch {
      mostrarToast("Não foi possível salvar o nome. Ele continua no campo para você tentar novamente.", { severidade: "erro" });
    }
  }

  function confirmarRemocaoColecao(colecao: Colecao) {
    const remover = async () => {
      if (!ownerId) return;
      try {
        await colecoesRepository.remover(ownerId, colecao.id);
        if (colecaoFiltro === colecao.id) setColecaoFiltro(null);
        setEditandoColecao(null);
        await carregar();
        mostrarToast("Coleção excluída; seus itens foram preservados", { severidade: "sucesso" });
      } catch {
        mostrarToast("Não foi possível excluir a coleção. Tente novamente.", { severidade: "erro" });
      }
    };
    if (Platform.OS === "web") { if (window.confirm(`Excluir a coleção "${colecao.nome}"? Os itens salvos serão preservados.`)) remover(); return; }
    Alert.alert("Excluir coleção?", "Os itens salvos serão preservados.", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: remover }]);
  }

  async function associarSelecionados(colecaoId: string) {
    if (!ownerId || selecionados.size === 0) return;
    try {
      await colecoesRepository.associar(ownerId, colecaoId, [...selecionados]);
      setSelecionados(new Set());
      setModoSelecao(false);
      await carregar();
      mostrarToast("Itens adicionados à coleção", { severidade: "sucesso" });
    } catch {
      mostrarToast("Não foi possível adicionar os itens. A seleção continua ativa para tentar novamente.", { severidade: "erro" });
    }
  }

  async function excluirItem(item: ItemAtividade) {
    if (!ownerId) return;
    const ref = item.tipo === "pesquisa" ? null : { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo };
    if (item.tipo === "grifo") await grifosRepository.alternar(ownerId, ref!, item.cor);
    else if (item.tipo === "nota") await notasRepository.remover(ownerId, ref!);
    else if (item.tipo === "salvo") await versiculosSalvosRepository.alternar(ownerId, ref!);
    else await pesquisasFavoritasRepository.alternar(ownerId, item.termo);
  }

  async function restaurarItem(item: ItemAtividade) {
    if (!ownerId) return;
    const ref = item.tipo === "pesquisa" ? null : { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo };
    if (item.tipo === "grifo") await grifosRepository.alternar(ownerId, ref!, item.cor);
    else if (item.tipo === "nota") {
      if (item.grupoId) await notasRepository.salvarVarios(ownerId, item.referencias ?? [ref!], item.texto, item.grupoId);
      else await notasRepository.salvar(ownerId, ref!, item.texto);
    }
    else if (item.tipo === "salvo") await versiculosSalvosRepository.alternar(ownerId, ref!);
    else await pesquisasFavoritasRepository.alternar(ownerId, item.termo);
  }

  async function excluirSelecionados() {
    if (!ownerId) return;
    const removidos = atividade.filter((item) => selecionados.has(chaveAtividade(item)));
    const associacoesRemovidas = associacoes.filter((item) => selecionados.has(item.itemChave));
    try {
      await Promise.all(removidos.map(excluirItem));
      await Promise.all(colecoes.map((colecao) => colecoesRepository.desassociar(ownerId, colecao.id, [...selecionados])));
      setSelecionados(new Set());
      setModoSelecao(false);
      await carregar();
      mostrarToast(`${removidos.length} itens excluídos`, {
        severidade: "sucesso",
        acaoLabel: "Desfazer",
        onAcao: async () => {
          try {
            await Promise.all(removidos.map(restaurarItem));
            for (const colecao of colecoes) {
              const chaves = associacoesRemovidas.filter((a) => a.colecaoId === colecao.id).map((a) => a.itemChave);
              if (chaves.length) await colecoesRepository.associar(ownerId, colecao.id, chaves);
            }
            await carregar();
            mostrarToast("Exclusão desfeita", { severidade: "sucesso" });
          } catch {
            await carregar();
            mostrarToast("Não foi possível desfazer tudo. Confira a lista atualizada.", { severidade: "erro" });
          }
        },
      });
    } catch {
      setSelecionados(new Set());
      setModoSelecao(false);
      await carregar();
      mostrarToast("A exclusão foi interrompida. Atualizei a lista; confira os itens antes de tentar novamente.", { severidade: "aviso" });
    }
  }

  function limparFiltros() {
    setTermo("");
    setFiltro("todos");
    setOrdem("recentes");
    setColecaoFiltro(null);
    setSelecionados(new Set());
    setModoSelecao(false);
  }

  const possuiFiltrosAtivos = Boolean(
    termo.trim() || filtro !== "todos" || ordem !== "recentes" || colecaoFiltro || selecionados.size,
  );
  const quantidadePorFiltro = (chave: Filtro) => chave === "todos"
    ? atividade.length
    : atividade.filter((item) => item.tipo === chave).length;
  const quantidadeItens = atividade.length;
  const quantidadeAnotacoes = atividade.filter((item) => item.tipo === "nota").length;
  const quantidadeAnotacoesNaColecao = atividade.filter((item) => item.tipo === "nota" && chavesColecao.has(chaveAtividade(item))).length;
  const vazioDeAnotacoes = filtro === "nota" && filtrados.length === 0;
  const vazioPorBusca = vazioDeAnotacoes && Boolean(buscaNormalizada);
  const vazioPorColecao = vazioDeAnotacoes && Boolean(colecaoFiltro) && quantidadeAnotacoesNaColecao === 0;

  function limparBusca() {
    setTermo("");
  }

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try { await carregar(); } finally { setAtualizando(false); }
  }, [carregar]);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark" refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={escuro ? "#e0a75e" : "#8a5a2b"} />}>
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text accessibilityRole="header" className="text-3xl font-extrabold text-cor-texto dark:text-cor-texto-dark mb-1">Minha biblioteca</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          {quantidadeItens === 1 ? "1 item guardado para sua leitura." : `${quantidadeItens} itens guardados para sua leitura.`}
        </Text>

        <View className="relative mb-3">
          <View pointerEvents="none" className="absolute left-4 top-0 bottom-0 justify-center z-10"><IconeUI name="search" size={18} color={escuro ? "#b3a894" : "#6b6153"} /></View>
          <TextInput testID="busca-salvo" accessibilityLabel="Buscar nos itens salvos" value={termo} onChangeText={setTermo} placeholder="Buscar por livro, referência ou nota" placeholderTextColor="#8c8273" returnKeyType="search" className="min-h-12 pl-11 pr-12 py-3 rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark" />
          {termo ? (
            <Pressable testID="limpar-busca-salvo" onPress={() => setTermo("")} accessibilityRole="button" accessibilityLabel="Limpar busca dos itens salvos" hitSlop={10} className="absolute right-3 top-2 h-9 w-9 items-center justify-center rounded-full active:opacity-60">
              <IconeUI name="close" size={20} color={escuro ? "#b3a894" : "#6b6257"} />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-row flex-wrap items-center gap-2 mb-4">
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mr-1">Ordenar:</Text>
          <Pressable onPress={() => setOrdem("recentes")} accessibilityRole="radio" accessibilityLabel="Ordenar por mais recentes" accessibilityState={{ checked: ordem === "recentes" }} className={`min-h-10 px-3.5 justify-center rounded-full border ${ordem === "recentes" ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Mais recentes</Text></Pressable>
          <Pressable onPress={() => setOrdem("biblica")} accessibilityRole="radio" accessibilityLabel="Ordenar pela ordem bíblica" accessibilityState={{ checked: ordem === "biblica" }} className={`min-h-10 px-3.5 justify-center rounded-full border ${ordem === "biblica" ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Ordem bíblica</Text></Pressable>
        </View>

        <View className="mb-4 rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4">
          <View className="flex-row items-center justify-between gap-3 mb-3">
            <View className="flex-1">
              <Text accessibilityRole="header" className="text-sm font-extrabold text-cor-texto dark:text-cor-texto-dark">Coleções</Text>
              <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5">Agrupe itens por tema ou estudo.</Text>
            </View>
            <Pressable onPress={() => { setGerenciandoColecoes((aberto) => !aberto); setEditandoColecao(null); }} accessibilityRole="button" accessibilityLabel={gerenciandoColecoes ? "Concluir gerenciamento de coleções" : "Gerenciar coleções"} className="min-h-10 flex-row items-center gap-1.5 rounded-full px-3 bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark active:opacity-70">
              <IconeUI name={gerenciandoColecoes ? "close" : "edit"} size={15} color={escuro ? "#e0a75e" : "#8a5a2b"} />
              <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">{gerenciandoColecoes ? "Concluir" : "Gerenciar"}</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Pressable onPress={() => setColecaoFiltro(null)} accessibilityRole="radio" accessibilityState={{ checked: !colecaoFiltro }} className={`min-h-10 flex-row items-center rounded-full border px-3 ${!colecaoFiltro ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}>
              <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Todas</Text>
              <Text className="text-[11px] font-bold text-cor-texto-suave dark:text-cor-texto-suave-dark ml-1.5">{quantidadeItens}</Text>
            </Pressable>
            {colecoes.map((colecao) => {
              const quantidade = associacoes.filter((associacao) => associacao.colecaoId === colecao.id).length;
              const ativa = colecaoFiltro === colecao.id;
              return (
                <View key={colecao.id} className={`flex-row items-center rounded-full border ${ativa ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}>
                  <Pressable onPress={() => setColecaoFiltro(colecao.id)} accessibilityRole="radio" accessibilityState={{ checked: ativa }} accessibilityLabel={`${colecao.nome}, ${quantidade} itens`} className="min-h-10 flex-row items-center pl-3 pr-2">
                    <Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{colecao.nome}</Text>
                    <Text className="text-[11px] font-bold text-cor-texto-suave dark:text-cor-texto-suave-dark ml-1.5">{quantidade}</Text>
                  </Pressable>
                  {gerenciandoColecoes ? <Pressable onPress={() => { setEditandoColecao(colecao); setNomeColecao(colecao.nome); }} accessibilityRole="button" accessibilityLabel={`Editar coleção ${colecao.nome}`} className="min-w-10 min-h-10 items-center justify-center pr-1"><IconeUI name="edit" size={15} color={escuro ? "#e0a75e" : "#8a5a2b"} /></Pressable> : null}
                </View>
              );
            })}
          </View>
          {gerenciandoColecoes && editandoColecao ? (
            <View className="mt-3 pt-3 border-t border-cor-borda dark:border-cor-borda-dark">
              <Text className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark mb-2">Editar {editandoColecao.nome}</Text>
              <View className="flex-row gap-2">
                <TextInput accessibilityLabel="Nome da coleção" value={nomeColecao} onChangeText={setNomeColecao} returnKeyType="done" className="flex-1 min-h-11 px-3 py-2 rounded-xl border border-cor-borda dark:border-cor-borda-dark text-cor-texto dark:text-cor-texto-dark" />
                <Pressable onPress={salvarNomeColecao} disabled={!nomeColecao.trim()} accessibilityRole="button" accessibilityLabel="Salvar nome da coleção" className="min-h-11 px-4 rounded-xl bg-cor-destaque dark:bg-cor-destaque-dark justify-center disabled:opacity-40"><Text className="text-white dark:text-cor-texto font-bold">Salvar</Text></Pressable>
              </View>
              <Pressable onPress={() => confirmarRemocaoColecao(editandoColecao)} accessibilityRole="button" accessibilityLabel={`Excluir coleção ${editandoColecao.nome}`} className="self-start min-h-11 justify-center px-2 mt-1"><Text className="text-sm font-semibold text-red-600 dark:text-red-400">Excluir coleção</Text></Pressable>
            </View>
          ) : null}
          {gerenciandoColecoes ? (
            <View className="flex-row gap-2 mt-3 pt-3 border-t border-cor-borda dark:border-cor-borda-dark">
              <TextInput accessibilityLabel="Nome da nova coleção" value={novaColecao} onChangeText={setNovaColecao} placeholder="Nome da nova coleção" placeholderTextColor="#8c8273" returnKeyType="done" onSubmitEditing={() => { void criarColecao(); }} className="flex-1 min-h-11 px-3 py-2 rounded-xl border border-cor-borda dark:border-cor-borda-dark text-cor-texto dark:text-cor-texto-dark" />
              <Pressable onPress={criarColecao} disabled={!novaColecao.trim()} accessibilityRole="button" accessibilityLabel="Criar coleção" className="min-h-11 px-4 rounded-xl bg-cor-destaque dark:bg-cor-destaque-dark justify-center disabled:opacity-40"><Text className="text-white dark:text-cor-texto font-bold">Criar</Text></Pressable>
            </View>
          ) : null}
        </View>

        {selecionados.size > 0 ? (
          <View className="rounded-2xl border border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark p-4 mb-4">
            <View className="flex-row items-center justify-between gap-2 mb-3">
              <Text accessibilityRole="header" className="text-sm font-extrabold text-cor-texto dark:text-cor-texto-dark">{selecionados.size} {selecionados.size === 1 ? "item selecionado" : "itens selecionados"}</Text>
              <Pressable onPress={() => { setSelecionados(new Set()); setModoSelecao(false); }} accessibilityRole="button" accessibilityLabel="Cancelar seleção" className="min-h-10 justify-center px-2 active:opacity-70"><Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">Cancelar</Text></Pressable>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {colecoes.map((colecao) => <Pressable key={colecao.id} onPress={() => associarSelecionados(colecao.id)} accessibilityRole="button" accessibilityLabel={`Adicionar itens selecionados a ${colecao.nome}`} className="min-h-10 justify-center px-3 rounded-full border border-cor-destaque/30 dark:border-cor-destaque-dark/30 bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"><Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">{colecao.nome}</Text></Pressable>)}
              <Pressable onPress={excluirSelecionados} accessibilityRole="button" accessibilityLabel={`Excluir ${selecionados.size} itens selecionados`} className="min-h-10 flex-row items-center gap-1.5 px-3 rounded-full bg-red-600 active:opacity-80"><IconeUI name="delete" size={15} color="#ffffff" /><Text className="text-xs font-bold text-white">Excluir</Text></Pressable>
            </View>
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
          {FILTROS.map(({ chave, rotulo }) => (
            <Pressable
              key={chave}
              onPress={() => setFiltro(chave)}
              accessibilityRole="tab"
              accessibilityLabel={rotulo}
              accessibilityState={{ selected: filtro === chave }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={filtro === chave}
              className={`min-h-10 flex-row items-center gap-1.5 px-3.5 rounded-full border active:opacity-70 ${
                filtro === chave
                  ? "bg-cor-destaque dark:bg-cor-destaque-dark border-cor-destaque dark:border-cor-destaque-dark"
                  : "border-cor-borda dark:border-cor-borda-dark"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  filtro === chave ? "text-white dark:text-cor-texto" : "text-cor-texto dark:text-cor-texto-dark"
                }`}
              >
                {rotulo}
              </Text>
              <Text className={`text-[11px] font-bold ${filtro === chave ? "text-white/80 dark:text-cor-texto/80" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}`}>
                {quantidadePorFiltro(chave)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {possuiFiltrosAtivos ? (
          <Pressable testID="limpar-filtros-salvo" onPress={limparFiltros} accessibilityRole="button" accessibilityLabel="Limpar filtros e seleção" className="self-start flex-row items-center gap-1.5 mb-4 rounded-full border border-cor-borda dark:border-cor-borda-dark px-3 py-1.5 active:opacity-70">
            <IconeUI name="clear-filter" size={15} color={escuro ? "#e0a75e" : "#8a5a2b"} />
            <Text className="text-xs font-semibold text-cor-destaque dark:text-cor-destaque-dark">Limpar filtros</Text>
          </Pressable>
        ) : null}

        <View className="flex-row items-center justify-between mb-2">
          <Text accessibilityLiveRegion="polite" className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark">{possuiFiltrosAtivos && !selecionados.size ? `Mostrando ${filtrados.length} de ${quantidadeItens}` : `${filtrados.length} ${filtrados.length === 1 ? "item" : "itens"}`}</Text>
          {modoSelecao || filtrados.length > 0 ? <Pressable onPress={() => { setModoSelecao((ativo) => !ativo); setSelecionados(new Set()); }} accessibilityRole="button" accessibilityLabel={modoSelecao ? "Sair do modo de seleção" : "Selecionar itens"} className="min-h-10 flex-row items-center gap-1.5 px-2 active:opacity-70"><IconeUI name={modoSelecao ? "close" : "select-many"} size={16} color={escuro ? "#e0a75e" : "#8a5a2b"} /><Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">{modoSelecao ? "Cancelar seleção" : "Selecionar"}</Text></Pressable> : null}
        </View>
        {erroAoCarregar ? (
          <EstadoErro titulo="Não foi possível carregar seus itens salvos" descricao="Tente novamente. Suas anotações e coleções continuam guardadas neste dispositivo." aoTentarNovamente={() => setTentativa((valor) => valor + 1)} />
        ) : carregando ? (
          <EstadoCarregando rotulo="Carregando itens salvos" />
        ) : filtrados.length === 0 ? (
          <EstadoVazio
            titulo={vazioDeAnotacoes
              ? vazioPorBusca ? "Nenhuma anotação encontrada" : vazioPorColecao ? "Nenhuma anotação nesta coleção" : "Você ainda não tem anotações"
              : quantidadeItens === 0 ? "Sua biblioteca está vazia" : "Nenhum item encontrado"}
            descricao={vazioDeAnotacoes
              ? vazioPorBusca ? "Tente outro termo. A busca considera o texto da nota, o nome do livro e a referência, sem diferenciar acentos." : vazioPorColecao ? "As anotações aparecem aqui quando forem adicionadas a esta coleção." : "Suas anotações feitas durante a leitura ficam reunidas aqui para você retomar quando quiser."
              : quantidadeItens === 0 ? "Salve versículos, faça anotações ou grife passagens durante a leitura. Eles ficam reunidos aqui." : "Experimente outro termo ou ajuste os filtros para encontrar o que procura."}
            acao={vazioDeAnotacoes
              ? vazioPorBusca ? { rotulo: "Limpar busca", aoPressionar: limparBusca }
                : vazioPorColecao ? { rotulo: "Ver todas as anotações", aoPressionar: () => setColecaoFiltro(null) }
                  : quantidadeAnotacoes === 0 ? { rotulo: "Abrir a Bíblia", aoPressionar: () => router.push("/biblia") } : undefined
              : quantidadeItens === 0 ? { rotulo: "Abrir a Bíblia", aoPressionar: () => router.push("/biblia") } : possuiFiltrosAtivos ? { rotulo: "Limpar filtros", aoPressionar: limparFiltros } : undefined}
          />
        ) : (
          filtrados.map((item, indice) => { const chave = chaveAtividade(item); const livroAtual = item.tipo === "pesquisa" ? "Pesquisas" : obterLivro(item.livroSlug)?.nome ?? item.livroSlug; const anterior = filtrados[indice - 1]; const livroAnterior = anterior ? (anterior.tipo === "pesquisa" ? "Pesquisas" : obterLivro(anterior.livroSlug)?.nome ?? anterior.livroSlug) : null; return <View key={chave}>{ordem === "biblica" && livroAtual !== livroAnterior ? <Text className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mt-3 mb-2">{livroAtual}</Text> : null}<CardAtividade item={item} modoBiblioteca onMudou={carregar} selecionado={selecionados.has(chave)} onSelecionar={modoSelecao ? () => setSelecionados((atuais) => { const novo = new Set(atuais); if (novo.has(chave)) novo.delete(chave); else novo.add(chave); return novo; }) : undefined} /></View>; })
        )}
      </View>
    </ScrollView>
  );
}
