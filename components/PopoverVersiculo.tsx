import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../core/biblia/tipos";
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";

type Props = {
  referencia: string;
  refCapitulo: string;
  onFechar: () => void;
};

// Popover único, reaproveitado pra qualquer referência clicada no texto
// do resumo — não é recriado por referência, só troca `referencia`/`refCapitulo`.
// Se a bible-api.com estiver fora do ar, mostra erro amigável e some sem
// quebrar a leitura do resumo em volta (é um extra, não uma dependência
// crítica da tela).
// Nota: a prop não pode se chamar "ref" — React trata esse nome como
// especial (ref forwarding) e nunca repassaria o valor pro componente.
export function PopoverVersiculo({ referencia, refCapitulo, onFechar }: Props) {
  const [refAtual, setRefAtual] = useState(referencia);
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setRefAtual(referencia);
  }, [referencia]);

  useEffect(() => {
    setDados(null);
    setErro(null);
    buscarReferencia(refAtual)
      .then(setDados)
      .catch((e) => setErro(mensagemErroAmigavel(e)));
  }, [refAtual]);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onFechar}>
        <Pressable
          className="w-full max-w-md max-h-[70%] rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark flex-1 mr-3">
              {dados?.referencia ?? refAtual}
            </Text>
            <Pressable onPress={onFechar} hitSlop={8}>
              <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark text-lg">✕</Text>
            </Pressable>
          </View>

          {erro ? (
            <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">{erro}</Text>
          ) : !dados ? (
            <ActivityIndicator />
          ) : (
            <ScrollView>
              <Text className="text-cor-texto dark:text-cor-texto-dark leading-6">
                {dados.versiculos
                  ? dados.versiculos.map((v) => (
                      <Text key={v.numero}>
                        <Text className="text-xs font-bold text-cor-destaque dark:text-cor-destaque-dark">
                          {v.numero}{" "}
                        </Text>
                        {v.texto + " "}
                      </Text>
                    ))
                  : dados.texto}
              </Text>
            </ScrollView>
          )}

          {refAtual !== refCapitulo ? (
            <Pressable
              onPress={() => setRefAtual(refCapitulo)}
              className="self-start mt-4 px-4 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark"
            >
              <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">
                Ver capítulo inteiro
              </Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
