import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { referenciaAleatoria, referenciaDoDia } from "../core/biblia/versiculoDoDia";
import type { CapituloTexto } from "../core/biblia/tipos";

export function CardVersiculoDia() {
  const [referencia, setReferencia] = useState(() => referenciaDoDia());
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    setCarregando(true);
    setErro(false);
    buscarReferencia(referencia)
      .then(setDados)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [referencia]);

  function sortearOutro() {
    setReferencia((atual) => referenciaAleatoria(atual));
  }

  // API fora do ar: não mostra o card em vez de quebrar a home com um erro.
  if (erro) return null;

  return (
    <View className="rounded-xl border-l-4 border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque-fundo/40 dark:bg-cor-destaque-fundo-dark/60 px-4 py-3 mb-4">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-xs font-bold uppercase tracking-wide text-cor-destaque dark:text-cor-destaque-dark">
          ✦ Versículo do dia
        </Text>
        <Pressable onPress={sortearOutro} accessibilityLabel="Ver outro versículo" className="px-2 py-1">
          <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">🎲</Text>
        </Pressable>
      </View>
      {carregando ? (
        <ActivityIndicator className="my-2" />
      ) : (
        <>
          <Text className="text-cor-texto dark:text-cor-texto-dark italic leading-6">{dados?.texto}</Text>
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1.5">
            {dados?.referencia}
          </Text>
        </>
      )}
    </View>
  );
}
