import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { dicaJaVista, marcarDicaVista } from "../core/leitura/onboarding";
import { mostrarToast } from "../core/util/toast";

export function DicaContextual({ id, titulo, descricao }: { id: string; titulo: string; descricao: string }) {
  const [visivel, setVisivel] = useState(false);
  const [erroAoCarregar, setErroAoCarregar] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const salvamentoEmAndamento = useRef(false);
  useEffect(() => {
    let ativo = true;
    setVisivel(false);
    setErroAoCarregar(false);
    dicaJaVista(id)
      .then((vista) => { if (ativo) setVisivel(!vista); })
      .catch(() => { if (ativo) setErroAoCarregar(true); });
    return () => { ativo = false; };
  }, [id, tentativa]);
  async function fecharDica() {
    if (salvamentoEmAndamento.current) return;
    salvamentoEmAndamento.current = true;
    setSalvando(true);
    try {
      await marcarDicaVista(id);
      setVisivel(false);
    } catch {
      mostrarToast("Não foi possível salvar que você viu esta dica", { severidade: "erro" });
    } finally {
      salvamentoEmAndamento.current = false;
      setSalvando(false);
    }
  }
  if (erroAoCarregar) {
    return (
      <View accessibilityRole="alert" className="flex-row items-center justify-between gap-3 rounded-xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-3 py-2 mb-4">
        <Text className="flex-1 text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark">Não foi possível carregar esta dica.</Text>
        <Pressable
          onPress={() => setTentativa((valor) => valor + 1)}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar a dica novamente"
          className="min-h-11 justify-center px-3 active:opacity-70"
        >
          <Text className="font-semibold text-cor-destaque dark:text-cor-destaque-dark">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }
  if (!visivel) return null;
  return (
    <View accessibilityRole="summary" className="rounded-2xl border border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark px-4 py-3 mb-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-cor-texto dark:text-cor-texto-dark">{titulo}</Text>
          <Text className="text-xs leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">{descricao}</Text>
        </View>
        <Pressable
          onPress={fecharDica}
          disabled={salvando}
          accessibilityRole="button"
          accessibilityLabel="Entendi, fechar dica"
          accessibilityState={{ disabled: salvando, busy: salvando }}
          className="min-h-11 min-w-11 justify-center px-3 -mr-2 active:opacity-60 disabled:opacity-60"
        >
          <Text className="font-bold text-cor-destaque dark:text-cor-destaque-dark">{salvando ? "Salvando…" : "Entendi"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
