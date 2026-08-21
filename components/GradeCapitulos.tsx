import { Platform, Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSelecaoArrasto } from "../core/util/useSelecaoArrasto";

const SET_VAZIO = new Set<number>();

type Props = {
  totalCapitulos: number;
  lidos: Set<number>;
  onSelecionar: (capitulo: number) => void;
  /** Toque longo numa célula — usado pra abrir um atalho alternativo
   * sem competir com o toque simples (ex.: escolher um versículo
   * específico em vez de abrir o capítulo inteiro). */
  onSelecionarLongo?: (capitulo: number) => void;
  /** Rótulo singular usado no `accessibilityLabel` de cada célula
   * ("Capítulo N" por padrão, "Versículo N" quando a grade representa
   * versículos em vez de capítulos). */
  rotulo?: string;
  /** Quando presente, a grade entra em modo de seleção múltipla. No web,
   * pressionar-e-arrastar estende a seleção por um intervalo inteiro
   * (ver `useSelecaoArrasto`); em toque simples (ou no app nativo, sem
   * suporte a arraste ainda) cada capítulo alterna via
   * `onAlternarSelecionado`. */
  selecionados?: Set<number>;
  onAlternarSelecionado?: (capitulo: number) => void;
  onMudarSelecaoEmMassa?: (novo: Set<number>) => void;
};

// Colunas por faixa de largura — quanto mais tela, mais colunas, sem
// nunca passar do total de capítulos do livro (um livro de 1 capítulo
// não deveria abrir 8 colunas vazias, por exemplo). O NativeWind só
// enxerga classes de largura escritas como texto literal no código
// (ver Decisão 10 do PLANO-PLATAFORMA.md) — por isso a largura da
// célula usa `style` inline com porcentagem calculada, não uma classe
// Tailwind interpolada dinamicamente, que simplesmente não funcionaria.
function calcularColunas(largura: number, totalCapitulos: number): number {
  const base = largura < 400 ? 6 : largura < 640 ? 8 : largura < 900 ? 10 : 12;
  return Math.max(1, Math.min(base, totalCapitulos));
}

export function GradeCapitulos({
  totalCapitulos,
  lidos,
  onSelecionar,
  onSelecionarLongo,
  rotulo = "Capítulo",
  selecionados,
  onAlternarSelecionado,
  onMudarSelecaoEmMassa,
}: Props) {
  const { width } = useWindowDimensions();
  const colunas = calcularColunas(width, totalCapitulos);
  const capitulos = Array.from({ length: totalCapitulos }, (_, i) => i + 1);
  const modoSelecao = !!selecionados;

  const refArrasto = useSelecaoArrasto({
    ativo: modoSelecao,
    selecionados: selecionados ?? SET_VAZIO,
    onMudarSelecao: onMudarSelecaoEmMassa ?? (() => {}),
  });

  return (
    <View ref={refArrasto as any} className="flex-row flex-wrap -m-1">
      {capitulos.map((n) => {
        const lido = lidos.has(n);
        const selecionado = selecionados?.has(n) ?? false;
        return (
          <View key={n} style={{ width: `${100 / colunas}%` }} className="p-1">
            <Pressable
              // No web, o toque (com ou sem arraste) é tratado inteiramente
              // pelo useSelecaoArrasto (pointerdown/up no container) — dar
              // onPress aqui também faria a seleção alternar duas vezes por
              // toque. Fora do web (app nativo, sem suporte a arraste ainda),
              // o toque direto no Pressable é o único jeito de selecionar.
              onPress={Platform.OS === "web" && modoSelecao ? undefined : () => (modoSelecao ? onAlternarSelecionado?.(n) : onSelecionar(n))}
              onLongPress={!modoSelecao && onSelecionarLongo ? () => onSelecionarLongo(n) : undefined}
              // @ts-expect-error dataSet é uma extensão do react-native-web pra atributos data-* no DOM, usada pelo useSelecaoArrasto pra achar a célula sob o ponteiro durante o arraste
              dataSet={{ capitulo: String(n) }}
              accessibilityRole={modoSelecao ? "checkbox" : "button"}
              accessibilityLabel={`${rotulo} ${n}${lido ? ", lido" : ""}`}
              accessibilityState={modoSelecao ? { checked: selecionado } : { selected: lido }}
              // accessibilityChecked/accessibilitySelected: extensões do
              // react-native-web (não existem nos tipos do React Native,
              // por isso o @ts-expect-error acima em `dataSet` também
              // cobre estas duas) — accessibilityState sozinho não vira
              // aria-checked/aria-selected nesta versão do RNW (0.21.2).
              accessibilityChecked={modoSelecao ? selecionado : undefined}
              accessibilitySelected={!modoSelecao ? lido : undefined}
              className={`aspect-square items-center justify-center rounded-lg border-2 active:opacity-60 ${
                selecionado
                  ? "border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque/20"
                  : lido
                    ? "border-green-600 bg-green-600"
                    : "border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selecionado
                    ? "text-cor-destaque dark:text-cor-destaque-dark"
                    : lido
                      ? "text-white"
                      : "text-cor-texto dark:text-cor-texto-dark"
                }`}
              >
                {n}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
