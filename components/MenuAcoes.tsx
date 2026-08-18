import { Modal, Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type AcaoMenu = {
  label: string;
  onPress: () => void;
  destrutiva?: boolean;
  icone?: keyof typeof MaterialIcons.glyphMap;
};

type Props = {
  acoes: AcaoMenu[];
  aberto: boolean;
  onFechar: () => void;
};

// Bottom sheet reaproveitado por qualquer card de Salvo/Atividade —
// abre tocando no "⋮" (mobile) ou com o botão direito do card no web
// (ver CardAtividade). Não substitui o menu de contexto da página
// inteira, só o do card específico (Revisão estratégica item 5 do
// PLANO-NAVEGACAO.md).
export function MenuAcoes({ acoes, aberto, onFechar }: Props) {
  if (!aberto) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable className="flex-1 justify-end bg-black/30" onPress={onFechar}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark rounded-t-2xl pb-6 pt-2 max-w-2xl w-full mx-auto"
        >
          <View className="w-10 h-1 rounded-full bg-cor-borda dark:bg-cor-borda-dark self-center my-2" />
          {acoes.map((acao, indice) => (
            <Pressable
              key={indice}
              onPress={() => {
                onFechar();
                acao.onPress();
              }}
              className="flex-row items-center gap-3 px-5 py-3.5 active:bg-cor-borda dark:active:bg-cor-borda-dark"
            >
              {acao.icone ? (
                <MaterialIcons
                  name={acao.icone}
                  size={20}
                  color={acao.destrutiva ? "#dc2626" : undefined}
                  className={acao.destrutiva ? "" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"}
                />
              ) : null}
              <Text className={`text-base ${acao.destrutiva ? "text-red-600" : "text-cor-texto dark:text-cor-texto-dark"}`}>
                {acao.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
