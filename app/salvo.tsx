import { Link, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { CardAtividade } from "../components/CardAtividade";
import { EstadoVazio } from "../components/EstadoVazio";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../core/estatisticas/atividade";
import { useOwnerId } from "../core/useOwnerId";
import { obterLivro } from "../core/content/livros";
import { colecoesRepository, grifosRepository, notasRepository, pesquisasFavoritasRepository, versiculosSalvosRepository } from "../core/repositories";
import type { AssociacaoColecao, Colecao } from "../core/repositories/ColecoesRepository";
import { mostrarToast } from "../core/util/toast";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  const { filtro: filtroInicial } = useLocalSearchParams<{ filtro?: string }>();
  const ownerId = useOwnerId();
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);
  const [filtro, setFiltro] = useState<Filtro>(() => filtroValido(filtroInicial));
  const [termo, setTermo] = useState("");
  const [ordem, setOrdem] = useState<"recentes" | "biblica">("recentes");
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [associacoes, setAssociacoes] = useState<AssociacaoColecao[]>([]);
  const [colecaoFiltro, setColecaoFiltro] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [novaColecao, setNovaColecao] = useState("");
  const [editandoColecao, setEditandoColecao] = useState<Colecao | null>(null);
  const [nomeColecao, setNomeColecao] = useState("");

  const carregar = useCallback(async () => {
    if (!ownerId) return;
    const [itens, cols, associacoesCarregadas] = await Promise.all([carregarAtividade(ownerId), colecoesRepository.listar(ownerId), colecoesRepository.listarAssociacoes(ownerId)]);
    setAtividade(itens); setColecoes(cols); setAssociacoes(associacoesCarregadas);
  }, [ownerId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const chavesColecao = new Set(associacoes.filter((item) => !colecaoFiltro || item.colecaoId === colecaoFiltro).map((item) => item.itemChave));
  const filtrados = (filtro === "todos" ? atividade : atividade.filter((item) => item.tipo === filtro))
    .filter((item) => !colecaoFiltro || chavesColecao.has(chaveAtividade(item)))
    .filter((item) => {
      const busca = termo.trim().toLowerCase(); if (!busca) return true;
      const livro = item.tipo === "pesquisa" ? "" : obterLivro(item.livroSlug)?.nome ?? "";
      return `${livro} ${item.tipo === "nota" ? item.texto : item.tipo === "pesquisa" ? item.termo : `${item.capitulo}:${item.versiculo}`}`.toLowerCase().includes(busca);
    })
    .sort((a, b) => ordem === "recentes" ? new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime() : ordemBiblica(a) - ordemBiblica(b));

  function ordemBiblica(item: ItemAtividade): number {
    if (item.tipo === "pesquisa") return Number.MAX_SAFE_INTEGER;
    const numero = obterLivro(item.livroSlug)?.numero ?? 999;
    return numero * 1_000_000 + item.capitulo * 1_000 + item.versiculo;
  }

  async function criarColecao() {
    if (!ownerId || !novaColecao.trim()) return;
    await colecoesRepository.criar(ownerId, novaColecao); setNovaColecao(""); await carregar();
  }

  async function salvarNomeColecao() {
    if (!ownerId || !editandoColecao || !nomeColecao.trim()) return;
    await colecoesRepository.renomear(ownerId, editandoColecao.id, nomeColecao);
    setEditandoColecao(null); setNomeColecao(""); await carregar();
  }

  function confirmarRemocaoColecao(colecao: Colecao) {
    const remover = async () => { if (!ownerId) return; await colecoesRepository.remover(ownerId, colecao.id); if (colecaoFiltro === colecao.id) setColecaoFiltro(null); setEditandoColecao(null); await carregar(); };
    if (Platform.OS === "web") { if (window.confirm(`Excluir a coleção "${colecao.nome}"? Os itens salvos serão preservados.`)) remover(); return; }
    Alert.alert("Excluir coleção?", "Os itens salvos serão preservados.", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: remover }]);
  }

  async function associarSelecionados(colecaoId: string) {
    if (!ownerId || selecionados.size === 0) return;
    await colecoesRepository.associar(ownerId, colecaoId, [...selecionados]); setSelecionados(new Set()); await carregar(); mostrarToast("Itens adicionados à coleção");
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
    else if (item.tipo === "nota") await notasRepository.salvar(ownerId, ref!, item.texto);
    else if (item.tipo === "salvo") await versiculosSalvosRepository.alternar(ownerId, ref!);
    else await pesquisasFavoritasRepository.alternar(ownerId, item.termo);
  }

  async function excluirSelecionados() {
    if (!ownerId) return;
    const removidos = atividade.filter((item) => selecionados.has(chaveAtividade(item)));
    const associacoesRemovidas = associacoes.filter((item) => selecionados.has(item.itemChave));
    await Promise.all(removidos.map(excluirItem));
    await Promise.all(colecoes.map((colecao) => colecoesRepository.desassociar(ownerId, colecao.id, [...selecionados])));
    setSelecionados(new Set()); await carregar();
    mostrarToast(`${removidos.length} itens excluídos`, { acaoLabel: "Desfazer", onAcao: async () => { await Promise.all(removidos.map(restaurarItem)); for (const colecao of colecoes) { const chaves = associacoesRemovidas.filter((a) => a.colecaoId === colecao.id).map((a) => a.itemChave); if (chaves.length) await colecoesRepository.associar(ownerId, colecao.id, chaves); } await carregar(); } });
  }

  function limparFiltros() {
    setTermo("");
    setFiltro("todos");
    setOrdem("recentes");
    setColecaoFiltro(null);
    setSelecionados(new Set());
  }

  const possuiFiltrosAtivos = Boolean(
    termo.trim() || filtro !== "todos" || ordem !== "recentes" || colecaoFiltro || selecionados.size,
  );

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text accessibilityRole="header" className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Salvo</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Suas anotações, grifos e pesquisas favoritas, num só lugar.
        </Text>

        <View className="relative mb-3">
          <TextInput accessibilityLabel="Buscar nos itens salvos" value={termo} onChangeText={setTermo} placeholder="Buscar em notas, livros e pesquisas..." placeholderTextColor="#9ca3af" className="px-4 pr-12 py-3 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark" />
          {termo ? (
            <Pressable onPress={() => setTermo("")} accessibilityRole="button" accessibilityLabel="Limpar busca dos itens salvos" hitSlop={10} className="absolute right-3 top-2 h-9 w-9 items-center justify-center rounded-full active:opacity-60">
              <MaterialIcons name="close" size={20} color="#6b6257" />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-row flex-wrap gap-2 mb-3">
          <Pressable onPress={() => setOrdem("recentes")} accessibilityRole="radio" accessibilityState={{ checked: ordem === "recentes" }} className={`px-3 py-1.5 rounded-full border ${ordem === "recentes" ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">Mais recentes</Text></Pressable>
          <Pressable onPress={() => setOrdem("biblica")} accessibilityRole="radio" accessibilityState={{ checked: ordem === "biblica" }} className={`px-3 py-1.5 rounded-full border ${ordem === "biblica" ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">Ordem bíblica</Text></Pressable>
        </View>

        <View className="mb-4 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-3 py-3">
          <Text className="text-xs font-bold text-cor-texto dark:text-cor-texto-dark mb-2">Coleções</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            <Pressable onPress={() => setColecaoFiltro(null)} accessibilityRole="radio" accessibilityState={{ checked: !colecaoFiltro }} className={`px-3 py-1.5 rounded-full border ${!colecaoFiltro ? "border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">Todas</Text></Pressable>
            {colecoes.map((colecao) => <View key={colecao.id} className={`flex-row items-center rounded-full border ${colecaoFiltro === colecao.id ? "border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}><Pressable onPress={() => setColecaoFiltro(colecao.id)} accessibilityRole="radio" accessibilityState={{ checked: colecaoFiltro === colecao.id }} className="pl-3 pr-2 py-1.5"><Text className="text-xs text-cor-texto dark:text-cor-texto-dark">{colecao.nome} ({associacoes.filter((a) => a.colecaoId === colecao.id).length})</Text></Pressable><Pressable onPress={() => { setEditandoColecao(colecao); setNomeColecao(colecao.nome); }} accessibilityRole="button" accessibilityLabel={`Editar coleção ${colecao.nome}`} className="pr-3 py-1.5"><Text className="text-xs text-cor-destaque dark:text-cor-destaque-dark">✎</Text></Pressable></View>)}
          </View>
          {editandoColecao ? <View className="mb-3"><View className="flex-row gap-2"><TextInput accessibilityLabel="Nome da coleção" value={nomeColecao} onChangeText={setNomeColecao} className="flex-1 px-3 py-2 rounded-xl border border-cor-destaque dark:border-cor-destaque-dark text-cor-texto dark:text-cor-texto-dark" /><Pressable onPress={salvarNomeColecao} accessibilityRole="button" accessibilityLabel="Salvar nome da coleção" className="px-4 rounded-xl bg-cor-destaque dark:bg-cor-destaque-dark justify-center"><Text className="text-white dark:text-cor-texto font-bold">Salvar</Text></Pressable></View><Pressable onPress={() => confirmarRemocaoColecao(editandoColecao)} accessibilityRole="button" accessibilityLabel={`Excluir coleção ${editandoColecao.nome}`} className="self-start mt-2 py-2"><Text className="text-xs font-semibold text-red-600">Excluir coleção</Text></Pressable></View> : null}
          <View className="flex-row gap-2"><TextInput accessibilityLabel="Nome da nova coleção" value={novaColecao} onChangeText={setNovaColecao} placeholder="Nova coleção" placeholderTextColor="#9ca3af" className="flex-1 px-3 py-2 rounded-xl border border-cor-borda dark:border-cor-borda-dark text-cor-texto dark:text-cor-texto-dark" /><Pressable onPress={criarColecao} disabled={!novaColecao.trim()} accessibilityRole="button" accessibilityLabel="Criar coleção" className="px-4 rounded-xl bg-cor-destaque dark:bg-cor-destaque-dark justify-center disabled:opacity-40"><Text className="text-white dark:text-cor-texto font-bold">Criar</Text></Pressable></View>
        </View>

        {selecionados.size > 0 ? <View className="rounded-2xl border border-cor-destaque dark:border-cor-destaque-dark p-3 mb-4"><Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark mb-2">{selecionados.size} selecionado(s)</Text><View className="flex-row flex-wrap gap-2">{colecoes.map((colecao) => <Pressable key={colecao.id} onPress={() => associarSelecionados(colecao.id)} accessibilityRole="button" className="px-3 py-2 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark"><Text className="text-xs font-semibold text-cor-texto dark:text-cor-texto-dark">Adicionar a {colecao.nome}</Text></Pressable>)}<Pressable onPress={excluirSelecionados} accessibilityRole="button" className="px-3 py-2 rounded-full bg-red-600"><Text className="text-xs font-semibold text-white">Excluir</Text></Pressable></View></View> : null}

        <View className="flex-row flex-wrap gap-2 mb-4">
          {FILTROS.map(({ chave, rotulo }) => (
            <Pressable
              key={chave}
              onPress={() => setFiltro(chave)}
              accessibilityRole="tab"
              accessibilityLabel={rotulo}
              accessibilityState={{ selected: filtro === chave }}
              // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
              accessibilitySelected={filtro === chave}
              className={`px-3.5 py-1.5 rounded-full border active:opacity-70 ${
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
            </Pressable>
          ))}
        </View>

        {possuiFiltrosAtivos ? (
          <Pressable onPress={limparFiltros} accessibilityRole="button" accessibilityLabel="Limpar filtros e seleção" className="self-start flex-row items-center gap-1.5 mb-4 rounded-full border border-cor-borda dark:border-cor-borda-dark px-3 py-1.5 active:opacity-70">
            <MaterialIcons name="filter-alt-off" size={15} color="#8a5a2b" />
            <Text className="text-xs font-semibold text-cor-destaque dark:text-cor-destaque-dark">Limpar filtros</Text>
          </Pressable>
        ) : null}

        <Text accessibilityLiveRegion="polite" className="sr-only">{filtrados.length} itens salvos exibidos</Text>
        {filtrados.length === 0 ? (
          <EstadoVazio
            titulo="Nada aqui ainda"
            descricao="Grife, anote ou favorite uma busca durante a leitura pra ver aqui."
          />
        ) : (
          filtrados.map((item, indice) => { const chave = chaveAtividade(item); const livroAtual = item.tipo === "pesquisa" ? "Pesquisas" : obterLivro(item.livroSlug)?.nome ?? item.livroSlug; const anterior = filtrados[indice - 1]; const livroAnterior = anterior ? (anterior.tipo === "pesquisa" ? "Pesquisas" : obterLivro(anterior.livroSlug)?.nome ?? anterior.livroSlug) : null; return <View key={chave}>{ordem === "biblica" && livroAtual !== livroAnterior ? <Text className="text-xs font-bold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mt-3 mb-2">{livroAtual}</Text> : null}<CardAtividade item={item} onMudou={carregar} selecionado={selecionados.has(chave)} onSelecionar={() => setSelecionados((atuais) => { const novo = new Set(atuais); if (novo.has(chave)) novo.delete(chave); else novo.add(chave); return novo; })} /></View>; })
        )}
      </View>
    </ScrollView>
  );
}
