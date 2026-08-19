import { Pressable, Text, View, useWindowDimensions } from "react-native";

type Props = {
  totalCapitulos: number;
  lidos: Set<number>;
  onSelecionar: (capitulo: number) => void;
  /** Quando presente, a grade entra em modo de seleção múltipla: tocar
   * um capítulo alterna sua seleção (`onAlternarSelecionado`) em vez de
   * navegar (`onSelecionar`) — usado na marcação em massa. */
  selecionados?: Set<number>;
  onAlternarSelecionado?: (capitulo: number) => void;
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

export function GradeCapitulos({ totalCapitulos, lidos, onSelecionar, selecionados, onAlternarSelecionado }: Props) {
  const { width } = useWindowDimensions();
  const colunas = calcularColunas(width, totalCapitulos);
  const capitulos = Array.from({ length: totalCapitulos }, (_, i) => i + 1);
  const modoSelecao = !!selecionados;

  return (
    <View className="flex-row flex-wrap -m-1">
      {capitulos.map((n) => {
        const lido = lidos.has(n);
        const selecionado = selecionados?.has(n) ?? false;
        return (
          <View key={n} style={{ width: `${100 / colunas}%` }} className="p-1">
            <Pressable
              onPress={() => (modoSelecao ? onAlternarSelecionado?.(n) : onSelecionar(n))}
              accessibilityLabel={
                modoSelecao
                  ? `Capítulo ${n}${lido ? ", lido" : ""}${selecionado ? ", selecionado" : ""}`
                  : `Capítulo ${n}${lido ? ", lido" : ""}`
              }
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
