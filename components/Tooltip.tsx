import { useState, type ReactNode } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

type Props = {
  titulo: string;
  descricao: string;
  children: ReactNode;
};

// Explicação sob demanda de um termo/função — tocar (qualquer
// plataforma) abre um modal curto com título + descrição; no web
// também usa o `title` nativo do navegador (tooltip de hover), de
// graça, sem duplicar lógica. Preferido a um Popover posicionado
// dinamicamente: mais simples de acertar em qualquer tamanho de tela,
// e reaproveita o mesmo padrão visual já usado em "Saiba mais" das
// conquistas (CardConquistas.tsx).
export function Tooltip({ titulo, descricao, children }: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setAberto(true)}
        accessibilityRole="button"
        accessibilityLabel={`O que é ${titulo}?`}
        className="active:opacity-60"
        {...(Platform.OS === "web" ? { title: descricao } : {})}
      >
        {children}
      </Pressable>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setAberto(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-5">
            <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark mb-1.5">{titulo}</Text>
            <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-4">{descricao}</Text>
            <Pressable onPress={() => setAberto(false)} accessibilityRole="button" className="self-end px-4 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70">
              <Text className="text-white font-semibold text-sm">Entendi</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
