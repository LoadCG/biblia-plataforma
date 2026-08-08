import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../core/biblia/tipos";

// Um card por referência curada de um tema (ver core/biblia/temasBusca.ts)
// — cada um busca e cacheia seu próprio versículo via BibliaAPI, sem
// travar os outros cards enquanto carrega.
export function CardVersiculoTema({ referencia }: { referencia: string }) {
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    setDados(null);
    setErro(false);
    buscarReferencia(referencia)
      .then(setDados)
      .catch(() => setErro(true));
  }, [referencia]);

  return (
    <View
      className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-2.5 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      {erro ? (
        <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">
          Não foi possível carregar {referencia} agora.
        </Text>
      ) : !dados ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text className="text-cor-texto dark:text-cor-texto-dark italic leading-6">{dados.texto}</Text>
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1.5">
            {dados.referencia}
          </Text>
        </>
      )}
    </View>
  );
}
