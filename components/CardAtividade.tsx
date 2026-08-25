import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { obterLivro } from "../core/content/livros";
import { compartilhar } from "../core/estatisticas/compartilhador";
import type { ItemAtividade } from "../core/estatisticas/atividade";
import { grifosRepository, notasRepository, pesquisasFavoritasRepository, versiculosSalvosRepository } from "../core/repositories";
import { linkVersiculo } from "../core/util/linkVersiculo";
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
  const link = livro && item.tipo !== "pesquisa" ? linkVersiculo(livro.slug, item.capitulo, item.versiculo) : null;
  const referenciaComLink = referencia ? `${referencia}${link ? `\n${link}` : ""}` : null;

  async function excluir() {
    if (!ownerId) return;
    if (item.tipo === "grifo") {
      await grifosRepository.alternar(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
    } else if (item.tipo === "nota") {
      await notasRepository.remover(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
    } else if (item.tipo === "salvo") {
      await versiculosSalvosRepository.alternar(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
    } else {
      await pesquisasFavoritasRepository.alternar(ownerId, item.termo);
    }
    onMudou();
  }

  const acoes: AcaoMenu[] =
    item.tipo === "pesquisa"
      ? [
          { label: "Copiar termo", icone: "content-copy", onPress: () => compartilhar(item.termo) },
          { label: "Excluir", icone: "delete-outline", onPress: excluir, destrutiva: true },
        ]
      : [
          {
            label: "Ler",
            icone: "menu-book",
            onPress: () => router.push(`/biblia/${item.livroSlug}/${item.capitulo}?versiculo=${item.versiculo}`),
          },
          { label: "Compartilhar", icone: "share", onPress: () => compartilhar(referenciaComLink ?? "") },
          { label: "Resumo do livro", icone: "auto-stories", onPress: () => router.push(`/resumos/${item.livroSlug}`) },
          { label: "Copiar", icone: "content-copy", onPress: () => compartilhar(item.tipo === "nota" ? item.texto : (referencia ?? "")) },
          ...(item.tipo === "nota" ? [{ label: "Editar", icone: "edit" as const, onPress: () => setEditando(true) }] : []),
          { label: "Excluir", icone: "delete-outline", onPress: excluir, destrutiva: true },
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
              : item.tipo === "salvo"
                ? `Você salvou ${referencia}`
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
        <Pressable onPress={() => setMenuAberto(true)} accessibilityRole="button" accessibilityLabel="Mais opções" hitSlop={10} className="active:opacity-60">
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
            const ref = { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo };
            // `ModalNota` já manda o texto trimado, mas o valor pode
            // ter ficado vazio (nota apagada por completo) — nesse
            // caso remove em vez de salvar uma nota vazia (achado
            // real, 2026-08-20, mesmo tratamento que já existia em
            // `salvarNota` na tela de leitura).
            if (texto) {
              await notasRepository.salvar(ownerId, ref, texto);
            } else {
              await notasRepository.remover(ownerId, ref);
            }
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
