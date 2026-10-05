import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { obterLivro } from "../core/content/livros";
import { copiar, compartilhar } from "../core/estatisticas/compartilhador";
import { dataMaisRecente, type ItemAtividade } from "../core/estatisticas/atividade";
import { formatarReferenciaVersiculos } from "../core/biblia/formatarReferenciaVersiculos";
import { grifosRepository, notasRepository, pesquisasFavoritasRepository, versiculosSalvosRepository } from "../core/repositories";
import { linkVersiculo } from "../core/util/linkVersiculo";
import { tempoRelativo } from "../core/util/tempoRelativo";
import { useOwnerId } from "../core/useOwnerId";
import { mostrarToast } from "../core/util/toast";
import { IconeUI, type IconeUINome } from "./icone/IconeUI";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { ModalNota } from "./ModalNota";

type Props = {
  item: ItemAtividade;
  onMudou: () => void;
  selecionado?: boolean;
  onSelecionar?: () => void;
  modoBiblioteca?: boolean;
};

const APRESENTACAO_TIPO: Record<ItemAtividade["tipo"], { rotulo: string; icone: IconeUINome }> = {
  grifo: { rotulo: "Grifado", icone: "featured" },
  nota: { rotulo: "Anotação", icone: "edit-note" },
  salvo: { rotulo: "Versículo salvo", icone: "bookmark-outline" },
  pesquisa: { rotulo: "Busca favorita", icone: "search" },
};

// Um item de Salvo/Atividade — grifo, nota ou pesquisa favoritada — com
// o menu de 3 pontinhos (ver MenuAcoes) acionável tanto pelo ícone
// quanto pelo botão direito do mouse no web (onContextMenu; RN Web
// repassa esse prop pro elemento DOM mesmo sem estar nos tipos do RN,
// por isso o cast).
export function CardAtividade({ item, onMudou, selecionado, onSelecionar, modoBiblioteca = false }: Props) {
  const ownerId = useOwnerId();
  const [menuAberto, setMenuAberto] = useState(false);
  const [editando, setEditando] = useState(false);

  const livro = item.tipo !== "pesquisa" ? obterLivro(item.livroSlug) : null;
  const referenciasNota = item.tipo === "nota"
    ? item.referencias ?? [{ livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo }]
    : [];
  const referencia = livro && item.tipo !== "pesquisa"
    ? item.tipo === "nota"
      ? formatarReferenciaVersiculos(referenciasNota)
      : `${livro.nome} ${item.capitulo}:${item.versiculo}`
    : null;
  const link = livro && item.tipo !== "pesquisa" ? linkVersiculo(livro.slug, item.capitulo, item.versiculo) : null;
  const referenciaComLink = referencia ? `${referencia}${link ? `\n${link}` : ""}` : null;
  const anotacaoComReferencia = item.tipo === "nota"
    ? `“${item.texto}”${referenciaComLink ? `\n\n${referenciaComLink}` : ""}`
    : referenciaComLink ?? "";
  const tituloItem = item.tipo === "pesquisa" ? item.termo : referencia ?? "Referência indisponível";
  const apresentacao = APRESENTACAO_TIPO[item.tipo];
  const aoPressionarConteudo = onSelecionar ?? (modoBiblioteca && item.tipo !== "pesquisa"
    ? () => router.push(`/biblia/${item.livroSlug}/${item.capitulo}?versiculo=${item.versiculo}`)
    : undefined);

  async function excluir(): Promise<boolean> {
    if (!ownerId) return false;
    try {
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
      return true;
    } catch {
      mostrarToast("Não foi possível excluir este item. Tente novamente.", { severidade: "erro" });
      return false;
    }
  }

  const acoes: AcaoMenu[] =
    item.tipo === "pesquisa"
      ? [
          { label: "Copiar termo", icone: "copy", onPress: () => copiar(item.termo) },
          { label: "Excluir", icone: "delete", onPress: excluir, destrutiva: true },
        ]
      : [
          {
            label: "Ler",
            icone: "open-book",
            onPress: () => router.push(`/biblia/${item.livroSlug}/${item.capitulo}?versiculo=${item.versiculo}`),
          },
          { label: "Compartilhar", icone: "share", onPress: () => compartilhar(item.tipo === "nota" ? anotacaoComReferencia : (referenciaComLink ?? ""), item.tipo === "nota" && referencia ? { titulo: `Anotação em ${referencia}` } : {}) },
          { label: "Resumo do livro", icone: "book-collection", onPress: () => router.push(`/resumos/${item.livroSlug}`) },
          { label: "Copiar", icone: "copy", onPress: () => copiar(item.tipo === "nota" ? anotacaoComReferencia : (referencia ?? "")) },
          ...(item.tipo === "nota" ? [{ label: "Editar", icone: "edit" as const, onPress: () => setEditando(true) }] : []),
          { label: "Excluir", icone: "delete", onPress: excluir, destrutiva: true },
        ];

  return (
    <View
      {...(Platform.OS === "web"
        ? { onContextMenu: (e: { preventDefault: () => void }) => { e.preventDefault(); setMenuAberto(true); } }
        : {})}
      className={`flex-row items-start justify-between rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 mb-3 ${modoBiblioteca ? "border border-cor-borda dark:border-cor-borda-dark py-4" : "py-3 shadow-sm"}`}
      style={modoBiblioteca ? undefined : { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      {onSelecionar ? (
        <Pressable onPress={onSelecionar} accessibilityRole="checkbox" accessibilityState={{ checked: !!selecionado }} accessibilityLabel={`Selecionar ${referencia ?? "pesquisa"}`}
          // @ts-expect-error extensão ARIA do react-native-web
          accessibilityChecked={!!selecionado}
          className={`${modoBiblioteca ? "w-11 h-11" : "w-7 h-7"} rounded-full border mr-3 items-center justify-center active:opacity-70 ${selecionado ? "bg-cor-destaque dark:bg-cor-destaque-dark border-cor-destaque dark:border-cor-destaque-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}>
          <Text className={selecionado ? "text-white dark:text-cor-texto font-bold" : "text-transparent"}>✓</Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={aoPressionarConteudo}
        disabled={!aoPressionarConteudo}
        accessibilityRole={aoPressionarConteudo ? "button" : undefined}
        accessibilityLabel={onSelecionar ? `Selecionar ${tituloItem}` : modoBiblioteca && item.tipo !== "pesquisa" ? `Ler ${tituloItem}` : undefined}
        accessibilityHint={onSelecionar ? "Ative para incluir ou remover este item da seleção." : modoBiblioteca && item.tipo !== "pesquisa" ? "Abre este versículo na Bíblia." : undefined}
        className={`flex-1 mr-2 ${aoPressionarConteudo ? "active:opacity-70" : ""}`}
      >
        {modoBiblioteca ? (
          <>
            <View className="self-start flex-row items-center gap-1.5 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark px-2.5 py-1 mb-2">
              <IconeUI name={apresentacao.icone} size={14} className="text-cor-destaque dark:text-cor-destaque-dark" />
              <Text className="text-[10px] font-bold uppercase tracking-wide text-cor-destaque dark:text-cor-destaque-dark">{apresentacao.rotulo}</Text>
            </View>
            <Text className="text-base font-bold text-cor-texto dark:text-cor-texto-dark" numberOfLines={2}>{tituloItem}</Text>
            {item.tipo === "nota" ? <Text numberOfLines={3} className="text-sm leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">{item.texto}</Text> : null}
          </>
        ) : (
          <>
            <Text className="text-cor-texto dark:text-cor-texto-dark text-sm">
              {item.tipo === "grifo"
                ? `Você grifou ${referencia}`
                : item.tipo === "nota"
                  ? `Nota em ${referencia}`
                  : item.tipo === "salvo"
                    ? `Você salvou ${referencia}`
                    : `Busca favorita: "${item.termo}"`}
            </Text>
            {item.tipo === "nota" ? <Text numberOfLines={2} className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mt-0.5 italic">{item.texto}</Text> : null}
          </>
        )}
      </Pressable>
      <View className="items-end">
        <Text className="text-[11px] text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1">{tempoRelativo(dataMaisRecente(item))}</Text>
        <Pressable onPress={() => setMenuAberto(true)} accessibilityRole="button" accessibilityLabel={`Mais opções para ${tituloItem}`} className="w-11 h-11 items-center justify-center rounded-full active:bg-cor-borda dark:active:bg-cor-borda-dark">
          <IconeUI name="more" size={20} className="text-cor-texto-suave dark:text-cor-texto-suave-dark" />
        </Pressable>
      </View>

      <MenuAcoes acoes={acoes} aberto={menuAberto} contexto={tituloItem} onFechar={() => setMenuAberto(false)} />

      {editando && item.tipo === "nota" ? (
        <ModalNota
          visivel
          referencias={referenciasNota}
          referencia={referencia ?? undefined}
          textoInicial={item.texto}
          onFechar={() => setEditando(false)}
          onSalvar={async (texto) => {
            if (!ownerId) throw new Error("Identificação local indisponível");
            const ref = { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo };
            if (item.grupoId) await notasRepository.salvarGrupo(ownerId, item.grupoId, texto);
            else await notasRepository.salvar(ownerId, ref, texto);
            setEditando(false);
            onMudou();
          }}
          onRemover={async () => {
            if (!ownerId) throw new Error("Identificação local indisponível");
            await notasRepository.remover(ownerId, { livroSlug: item.livroSlug, capitulo: item.capitulo, versiculo: item.versiculo });
            setEditando(false);
            onMudou();
          }}
        />
      ) : null}
    </View>
  );
}
