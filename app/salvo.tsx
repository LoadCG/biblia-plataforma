import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { CardAtividade } from "../components/CardAtividade";
import { EstadoVazio } from "../components/EstadoVazio";
import { carregarAtividade, chaveAtividade, type ItemAtividade } from "../core/estatisticas/atividade";
import { useOwnerId } from "../core/useOwnerId";

type Filtro = "todos" | "grifo" | "nota" | "pesquisa" | "salvo";

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: "todos", rotulo: "Todos" },
  { chave: "salvo", rotulo: "Salvos" },
  { chave: "nota", rotulo: "Anotações" },
  { chave: "grifo", rotulo: "Grifados" },
  { chave: "pesquisa", rotulo: "Pesquisas" },
];

export default function Salvo() {
  const ownerId = useOwnerId();
  const [atividade, setAtividade] = useState<ItemAtividade[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const carregar = useCallback(async () => {
    if (!ownerId) return;
    setAtividade(await carregarAtividade(ownerId));
  }, [ownerId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = filtro === "todos" ? atividade : atividade.filter((item) => item.tipo === filtro);

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Salvo</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          Suas anotações, grifos e pesquisas favoritas, num só lugar.
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-4">
          {FILTROS.map(({ chave, rotulo }) => (
            <Pressable
              key={chave}
              onPress={() => setFiltro(chave)}
              className={`px-3.5 py-1.5 rounded-full border active:opacity-70 ${
                filtro === chave
                  ? "bg-cor-destaque dark:bg-cor-destaque-dark border-cor-destaque dark:border-cor-destaque-dark"
                  : "border-cor-borda dark:border-cor-borda-dark"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  filtro === chave ? "text-white" : "text-cor-texto dark:text-cor-texto-dark"
                }`}
              >
                {rotulo}
              </Text>
            </Pressable>
          ))}
        </View>

        {filtrados.length === 0 ? (
          <EstadoVazio
            titulo="Nada aqui ainda"
            descricao="Grife, anote ou favorite uma busca durante a leitura pra ver aqui."
          />
        ) : (
          filtrados.map((item) => <CardAtividade key={chaveAtividade(item)} item={item} onMudou={carregar} />)
        )}
      </View>
    </ScrollView>
  );
}
