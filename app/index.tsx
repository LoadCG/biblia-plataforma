import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { coresDoGenero } from "../core/content/genero";
import { livros } from "../core/content/livros";
import type { Livro } from "../core/content/tipos";
import { livrosLidosRepository } from "../core/repositories";
import { useOwnerId } from "../core/useOwnerId";
import { BotaoTema } from "../components/BotaoTema";

function CardLivro({ livro, lido }: { livro: Livro; lido: boolean }) {
  const cores = coresDoGenero(livro.genero);
  return (
    <Link href={`/resumos/${livro.slug}`} asChild>
      <Pressable
        className={`flex-row items-center gap-3 px-4 py-3 border rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark mb-2 ${
          lido ? "border-green-600" : "border-cor-borda dark:border-cor-borda-dark"
        }`}
      >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.texto}`}>{livro.numero}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{livro.nome}</Text>
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">{livro.genero}</Text>
        </View>
        {lido ? <Text className="text-green-600 font-bold">✓</Text> : null}
      </Pressable>
    </Link>
  );
}

export default function Home() {
  const ownerId = useOwnerId();
  const [termo, setTermo] = useState("");
  const [lidos, setLidos] = useState<string[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
  }, [ownerId]);

  const lidosSet = useMemo(() => new Set(lidos), [lidos]);

  const listaFiltrada = useMemo(() => {
    const termoNormalizado = termo.trim().toLowerCase();
    if (!termoNormalizado) return livros;
    return livros.filter((l) => l.nome.toLowerCase().includes(termoNormalizado));
  }, [termo]);

  return (
    <View className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <CardLivro livro={item} lido={lidosSet.has(item.slug)} />}
        contentContainerClassName="px-4 pt-6 pb-10 max-w-2xl w-full mx-auto"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark flex-1 mr-3">
                Resumo dos 66 Livros da Bíblia
              </Text>
              <BotaoTema />
            </View>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
              {lidos.length} de {livros.length} livros lidos
            </Text>
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Buscar por nome do livro..."
              placeholderTextColor="#9ca3af"
              className="px-4 py-3 rounded-full border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark text-cor-texto dark:text-cor-texto-dark"
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-cor-texto-suave dark:text-cor-texto-suave-dark mt-6">
            Nenhum livro encontrado.
          </Text>
        }
      />
    </View>
  );
}
