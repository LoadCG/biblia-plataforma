import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { BotaoTema } from "../../components/BotaoTema";
import { EstadoVazio } from "../../components/EstadoVazio";
import { buscarLivros } from "../../core/content/busca";
import { coresDoGenero } from "../../core/content/genero";
import { livros } from "../../core/content/livros";
import type { Livro } from "../../core/content/tipos";
import { livrosLidosRepository } from "../../core/repositories";
import { useOwnerId } from "../../core/useOwnerId";

function CardLivro({ livro, lido, trecho }: { livro: Livro; lido: boolean; trecho: string | null }) {
  const cores = coresDoGenero(livro.genero);
  return (
    <Link href={`/resumos/${livro.slug}`} asChild>
      <Pressable
        className={`flex-row items-center gap-3 px-4 py-3 rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2 shadow-sm active:opacity-80 ${
          lido ? "border border-green-600" : ""
        }`}
        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.texto}`}>{livro.numero}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">{livro.genero}</Text>
          {trecho ? (
            <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5 italic" numberOfLines={2}>
              "{trecho}"
            </Text>
          ) : null}
        </View>
        {lido ? <Text className="text-green-600 font-bold">✓</Text> : null}
      </Pressable>
    </Link>
  );
}

export default function ListaResumos() {
  const ownerId = useOwnerId();
  const [termo, setTermo] = useState("");
  const [lidos, setLidos] = useState<string[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);
  const listaFiltrada = useMemo(() => buscarLivros(termo), [termo]);

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.livro.slug}
        renderItem={({ item }) => <CardLivro livro={item.livro} lido={lidosSet.has(item.livro.slug)} trecho={item.trecho} />}
        contentContainerClassName="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-3">
                <Link href="/" className="text-cor-destaque dark:text-cor-destaque-dark text-sm mb-1">
                  ← Início
                </Link>
                <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark">Estude por resumos</Text>
              </View>
              <BotaoTema />
            </View>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
              {lidos.length} de {livros.length} livros lidos
            </Text>
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Buscar por livro ou palavra no resumo..."
              placeholderTextColor="#9ca3af"
              className="px-4 py-3 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark"
            />
          </View>
        }
        ListEmptyComponent={<EstadoVazio titulo="Nenhum livro encontrado" descricao="Tente buscar por outro nome ou palavra." />}
      />
    </View>
  );
}
