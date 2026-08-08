import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { obterLivro } from "../core/content/livros";
import { compartilhar } from "../core/estatisticas/compartilhador";
import type { ItemAtividade } from "../core/estatisticas/atividade";
import { grifosRepository, notasRepository, pesquisasFavoritasRepository } from "../core/repositories";
import { tempoRelativo } from "../core/util/tempoRelativo";
import { useOwnerId } from "../core/useOwnerId";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { ModalNota } from "./ModalNota";

type Props = {
  item: ItemAtividade;
  onMudou: () => void;
};

// Um item de Salvo/Atividade — grifo, nota ou pesquisa favoritada — com
// o menu de 3 pontinhos (ver MenuAcoes) acionável tanto pelo ícone
// quanto pelo botão direito do mouse no web (onContextMenu; RN Web
// repassa esse prop pro elemento DOM mesmo sem estar nos tipos do RN,
// por isso o cast).
export function CardAtividade({ item, onMudou }: Props) {
  const ownerId = useOwnerId();
  const [menuAberto, setMenuAberto] = useState(false);
  const [editando, setEditando] = useState(false);

  const livro = item.tipo !== "pesquisa" ? obterLivro(item.livroSlug) : null;
  const referencia = livro && item.tipo !== "pesquisa" ? `${livro.nome} ${item.capitulo}:${item.versiculo}` : null;

  async function excluir() {
    if (!ownerId) return;
    if (item.tipo === "grifo") {
      await grifosRepository.alternar(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
    } else if (item.tipo === "nota") {
      await notasRepository.remover(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
    } else {
      await pesquisasFavoritasRepository.alternar(ownerId, item.termo);
    }
    onMudou();
  }

  const acoes: AcaoMenu[] =
    item.tipo === "pesquisa"
      ? [
          { label: "Copiar termo", onPress: () => compartilhar(item.termo) },
          { label: "Excluir", onPress: excluir, destrutiva: true },
        ]
      : [
          {
            label: "Ler",
            onPress: () => router.push(`/biblia/${item.livroSlug}/${item.capitulo}?versiculo=${item.versiculo}`),
          },
          { label: "Compartilhar", onPress: () => compartilhar(referencia ?? "") },
          { label: "Resumo do livro", onPress: () => router.push(`/resumos/${item.livroSlug}`) },
          { label: "Copiar", onPress: () => compartilhar(item.tipo === "nota" ? item.texto : (referencia ?? "")) },
          ...(item.tipo === "nota" ? [{ label: "Editar", onPress: () => setEditando(true) }] : []),
          { label: "Excluir", onPress: excluir, destrutiva: true },
        ];

  return (
    <View
      {...(Platform.OS === "web"
        ? { onContextMenu: (e: { preventDefault: () => void }) => { e.preventDefault(); setMenuAberto(true); } }
        : {})}
      className="flex-row items-start justify-between rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3 mb-2 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <View className="flex-1 mr-2">
        <Text className="text-cor-texto dark:text-cor-texto-dark text-sm">
          {item.tipo === "grifo"
            ? `Você grifou ${referencia}`
            : item.tipo === "nota"
              ? `Nota em ${referencia}`
              : `Busca favorita: "${item.termo}"`}
        </Text>
        {item.tipo === "nota" ? (
          <Text numberOfLines={2} className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5 italic">
            {item.texto}
          </Text>
        ) : null}
      </View>
      <View className="items-end">
        <Text className="text-[10px] text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1">{tempoRelativo(item.criadoEm)}</Text>
        <Pressable onPress={() => setMenuAberto(true)} accessibilityLabel="Mais opções" hitSlop={10}>
          <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark text-base">⋮</Text>
        </Pressable>
      </View>

      <MenuAcoes acoes={acoes} aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      {editando && item.tipo === "nota" ? (
        <ModalNota
          visivel
          versiculo={item.versiculo}
          textoInicial={item.texto}
          onFechar={() => setEditando(false)}
          onSalvar={async (texto) => {
            if (!ownerId) return;
            await notasRepository.salvar(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo }, texto);
            setEditando(false);
            onMudou();
          }}
          onRemover={async () => {
            await excluir();
            setEditando(false);
          }}
        />
      ) : null}
    </View>
  );
}
