import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  visivel: boolean;
  versiculo: number;
  textoInicial: string;
  onFechar: () => void;
  onSalvar: (texto: string) => void;
  onRemover: () => void;
};

// `key` no ponto de uso deve mudar por versículo (ver leitura bíblica),
// pra este componente remontar e reiniciar o campo de texto sempre que
// abrir uma nota diferente, em vez de sincronizar estado via useEffect.
export function ModalNota({ visivel, versiculo, textoInicial, onFechar, onSalvar, onRemover }: Props) {
  const [texto, setTexto] = useState(textoInicial);

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full max-w-md rounded-xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-5">
          <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-3">
            Nota — versículo {versiculo}
          </Text>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            multiline
            autoFocus
            placeholder="Escreva sua nota..."
            placeholderTextColor="#9ca3af"
            className="min-h-[120px] rounded-lg border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark text-cor-texto dark:text-cor-texto-dark p-3 mb-4"
            textAlignVertical="top"
          />
          <View className="flex-row justify-between items-center">
            {textoInicial ? (
              <Pressable onPress={onRemover} accessibilityRole="button" className="px-3 py-2 active:opacity-60">
                <Text className="text-red-600 font-semibold">Remover</Text>
              </Pressable>
            ) : (
              <View />
            )}
            <View className="flex-row gap-2">
              <Pressable onPress={onFechar} accessibilityRole="button" className="px-4 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-70">
                <Text className="text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => onSalvar(texto.trim())}
                accessibilityRole="button"
                className="px-4 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70"
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
