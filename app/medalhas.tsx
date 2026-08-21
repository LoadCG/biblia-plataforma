import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { calcularConquistas, type Conquista } from "../core/content/conquistas";
import { livrosLidosRepository } from "../core/repositories";
import { useOwnerId } from "../core/useOwnerId";

function LinhaConquista({ conquista }: { conquista: Conquista }) {
  const progresso = conquista.progressoTotal > 0 ? Math.min(1, conquista.progressoAtual / conquista.progressoTotal) : 0;
  const completa = conquista.conquistada;

  return (
    <View
      className={`flex-row items-center gap-4 rounded-2xl px-4 py-4 mb-3 border ${
        completa
          ? "bg-cor-destaque/10 border-cor-destaque dark:border-cor-destaque-dark"
          : "bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark border-cor-borda dark:border-cor-borda-dark"
      }`}
    >
      <View
        className={`w-14 h-14 rounded-full items-center justify-center border-2 ${
          completa
            ? "bg-cor-destaque/20 border-cor-destaque dark:border-cor-destaque-dark"
            : "bg-cor-borda dark:bg-cor-borda-dark border-transparent"
        }`}
      >
        <Text style={{ fontSize: 26, opacity: completa ? 1 : 0.4 }}>{conquista.icone}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Text className="text-sm font-bold text-cor-texto dark:text-cor-texto-dark">{conquista.titulo}</Text>
          {completa ? <Text className="text-cor-destaque dark:text-cor-destaque-dark text-xs">✓</Text> : null}
        </View>
        <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-2">{conquista.descricao}</Text>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 h-1.5 rounded-full bg-cor-borda dark:bg-cor-borda-dark">
            <View
              className="h-1.5 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark"
              style={{ width: `${progresso * 100}%` }}
            />
          </View>
          <Text className="text-[10px] text-cor-texto-suave dark:text-cor-texto-suave-dark">
            {conquista.progressoAtual}/{conquista.progressoTotal}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function Medalhas() {
  const ownerId = useOwnerId();
  const [lidos, setLidos] = useState<string[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    livrosLidosRepository.listar(ownerId).then(setLidos);
  }, [ownerId]);

  const conquistas = useMemo(() => calcularConquistas(new Set(lidos)), [lidos]);
  const totalConquistadas = conquistas.filter((c) => c.conquistada).length;

  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Medalhas</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">
          {totalConquistadas} de {conquistas.length} conquistadas — marcos de leitura ligados aos livros da Bíblia, sem pontuação nem ranking.
        </Text>

        {conquistas.map((c) => (
          <LinhaConquista key={c.id} conquista={c} />
        ))}
      </View>
    </ScrollView>
  );
}
