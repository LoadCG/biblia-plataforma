import { Platform, Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSelecaoArrasto } from "../core/util/useSelecaoArrasto";
import { calcularColunasGradeCapitulos } from "../core/util/calcularColunasGradeCapitulos";

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
  /** Diferencia estados de leitura de marcações visuais sem confundir a pessoa. */
  rotuloEstado?: "lido" | "grifado";
  /** Quando presente, a grade entra em modo de seleção múltipla. No web,
   * arrastar estende a seleção por um intervalo inteiro; em tela de toque,
   * um toque simples alterna um capítulo e segurar brevemente antes de arrastar
   * inicia o intervalo (ver `useSelecaoArrasto`). O app nativo continua com
   * seleção por toque e pelos controles de intervalo. */
  selecionados?: Set<number>;
  onAlternarSelecionado?: (capitulo: number) => void;
  onMudarSelecaoEmMassa?: (novo: Set<number>) => void;
  capituloInicioIntervalo?: number | null;
  modoIntervalo?: boolean;
};

// Colunas por faixa de largura — quanto mais tela, mais colunas, sem
// nunca passar do total de capítulos do livro (um livro de 1 capítulo
// não deveria abrir 8 colunas vazias, por exemplo). O NativeWind só
// enxerga classes de largura escritas como texto literal no código
// (ver Decisão 10 do PLANO-PLATAFORMA.md) — por isso a largura da
// célula usa `style` inline com porcentagem calculada, não uma classe
// Tailwind interpolada dinamicamente, que simplesmente não funcionaria.
export function GradeCapitulos({
  totalCapitulos,
  lidos,
  onSelecionar,
  onSelecionarLongo,
  rotulo = "Capítulo",
  rotuloEstado = "lido",
  selecionados,
  onAlternarSelecionado,
  onMudarSelecaoEmMassa,
  capituloInicioIntervalo,
  modoIntervalo = false,
}: Props) {
  const { width } = useWindowDimensions();
  const colunas = calcularColunasGradeCapitulos(width, totalCapitulos);
  const capitulos = Array.from({ length: totalCapitulos }, (_, i) => i + 1);
  const modoSelecao = !!selecionados;

  const refArrasto = useSelecaoArrasto({
    ativo: modoSelecao && !modoIntervalo,
    selecionados: selecionados ?? SET_VAZIO,
    onMudarSelecao: onMudarSelecaoEmMassa ?? (() => {}),
  });

  return (
    <View
      ref={refArrasto as any}
      // @ts-expect-error dataSet é suportado por React Native Web para esta pista visual exclusivamente web.
      dataSet={{ selecaoArrasto: String(modoSelecao) }}
      className="flex-row flex-wrap -m-1"
    >
      {capitulos.map((n) => {
        const lido = lidos.has(n);
        const selecionado = selecionados?.has(n) ?? false;
        const inicioIntervalo = capituloInicioIntervalo === n;
        return (
          <View key={n} style={{ width: `${100 / colunas}%` }} className="p-1">
            <Pressable
              testID={`${rotulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}-${n}`}
              // No web, o toque (com ou sem arraste) é tratado inteiramente
              // pelo useSelecaoArrasto (pointerdown/up no container) — dar
              // onPress aqui também faria a seleção alternar duas vezes por
              // toque. Fora do web (app nativo, sem suporte a arraste ainda),
              // o toque direto no Pressable é o único jeito de selecionar.
              onPress={Platform.OS === "web" && modoSelecao && !modoIntervalo ? undefined : () => (modoSelecao ? onAlternarSelecionado?.(n) : onSelecionar(n))}
              onLongPress={!modoSelecao && onSelecionarLongo ? () => onSelecionarLongo(n) : undefined}
              // @ts-expect-error dataSet é uma extensão do react-native-web pra atributos data-* no DOM, usada pelo useSelecaoArrasto pra achar a célula sob o ponteiro durante o arraste
              dataSet={{ capitulo: String(n) }}
              accessibilityRole={modoSelecao ? "checkbox" : "button"}
              accessibilityLabel={`${rotulo} ${n}${lido ? `, ${rotuloEstado}` : ""}${inicioIntervalo ? ", início do intervalo" : ""}`}
              accessibilityHint={modoIntervalo ? "Toque no primeiro e no último capítulo para selecionar o intervalo." : undefined}
              accessibilityState={modoSelecao ? { checked: selecionado } : undefined}
              // accessibilityChecked é extensão do React Native Web; a
              // accessibilityState, sozinha, não expõe aria-checked aqui.
              accessibilityChecked={modoSelecao ? selecionado : undefined}
              className={`aspect-square items-center justify-center rounded-lg border-2 active:opacity-60 ${
                inicioIntervalo
                  ? "border-amber-600 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50"
                  : selecionado
                  ? "border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque/20"
                  : lido && rotuloEstado === "lido"
                    ? "border-green-600 bg-green-600"
                    : lido
                      ? "border-yellow-500 bg-yellow-300/40 dark:border-yellow-400 dark:bg-yellow-600/30"
                      : "border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  inicioIntervalo
                    ? "text-amber-900 dark:text-amber-100"
                    : selecionado
                    ? "text-cor-destaque dark:text-cor-destaque-dark"
                    : lido && rotuloEstado === "lido"
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
