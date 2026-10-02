import Svg, { Circle, Line, Path } from "react-native-svg";
import type { PeriodoDoDia } from "../core/util/periodoDoDia";

type Paleta = {
  astro: string;
  colinaDistante: string;
  colinaProxima: string;
  traco: string;
  detalhe: string;
};

const PALETAS: Record<PeriodoDoDia, { claro: Paleta; escuro: Paleta }> = {
  manha: {
    claro: { astro: "#dfa94f", colinaDistante: "#cfad81", colinaProxima: "#a67b53", traco: "#8a5a2b", detalhe: "#f3cf91" },
    escuro: { astro: "#f0c774", colinaDistante: "#8d704a", colinaProxima: "#624a31", traco: "#e0a75e", detalhe: "#f5dcab" },
  },
  tarde: {
    claro: { astro: "#dc854a", colinaDistante: "#d49b67", colinaProxima: "#8e704f", traco: "#8a5a2b", detalhe: "#e4ae70" },
    escuro: { astro: "#f0a35d", colinaDistante: "#9a6440", colinaProxima: "#67452f", traco: "#e0a75e", detalhe: "#f5c285" },
  },
  noite: {
    claro: { astro: "#85729b", colinaDistante: "#958aa8", colinaProxima: "#655b75", traco: "#746788", detalhe: "#a79ab9" },
    escuro: { astro: "#f2daa0", colinaDistante: "#625c76", colinaProxima: "#393447", traco: "#c0b0dd", detalhe: "#e7ddbd" },
  },
};

type Props = {
  periodoDoDia: PeriodoDoDia;
  escuro: boolean;
  panoramica?: boolean;
};

/** Paisagem vetorial decorativa que acompanha Bom dia, Boa tarde e Boa noite. */
export function IlustracaoPeriodoDia({ periodoDoDia, escuro, panoramica = false }: Props) {
  const paleta = PALETAS[periodoDoDia][escuro ? "escuro" : "claro"];

  if (panoramica) {
    return (
      <Svg width="100%" height={138} viewBox="0 0 460 150" fill="none" preserveAspectRatio="xMidYMid slice">
        {periodoDoDia === "manha" ? (
          <>
            <Circle cx={326} cy={48} r={27} fill={paleta.astro} fillOpacity={0.78} />
            <Path d="M326 2v11m0 69v11M278 48h11m74 0h11M292 14l8 8m52 52 8 8m0-68-8 8m-52 52-8 8" stroke={paleta.astro} strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />
            <Path d="M61 48c12-11 24-11 36 0m17 9c9-8 18-8 27 0m174-27c8-7 16-7 24 0" stroke={paleta.detalhe} strokeWidth={2} strokeLinecap="round" />
          </>
        ) : null}
        {periodoDoDia === "tarde" ? (
          <>
            <Circle cx={104} cy={49} r={26} fill={paleta.astro} fillOpacity={0.84} />
            <Path d="M104 7v11m0 62v11M48 49h12m88 0h12M65 10l9 9m56 56 9 9m0-74-9 9m-56 56-9 9" stroke={paleta.astro} strokeOpacity={0.72} strokeWidth={2} strokeLinecap="round" />
            <Path d="M307 36c8-8 16-8 24 0m13 13c7-7 14-7 21 0M203 31c7-6 14-6 21 0" stroke={paleta.detalhe} strokeWidth={2} strokeLinecap="round" />
          </>
        ) : null}
        {periodoDoDia === "noite" ? (
          <>
            <Path d="M340 14c-5 7-7 14-5 22 3 15 17 25 32 25 5 0 9-1 13-3-5 10-15 16-27 16-17 0-30-13-30-30 0-13 7-24 17-30Z" fill={paleta.astro} />
            <Circle cx={255} cy={36} r={2.5} fill={paleta.detalhe} />
            <Circle cx={289} cy={57} r={2} fill={paleta.detalhe} />
            <Circle cx={303} cy={20} r={2.2} fill={paleta.detalhe} />
            <Path d="M277 13v7m-3.5-3.5h7" stroke={paleta.detalhe} strokeWidth={1.5} strokeLinecap="round" />
          </>
        ) : null}
        {/* Colinas em camadas, com curvas amplas como uma paisagem ao longe. */}
        <Path d="M0 101c48-32 83-39 123-28 34 9 52 31 86 31 45 0 73-36 119-43 44-7 86 10 132 38v51H0v-49Z" fill={paleta.colinaDistante} fillOpacity={0.46} />
        <Path d="M0 107c41-27 77-34 111-24 30 8 50 29 82 29 39 0 63-35 109-40 57-6 94 18 158 47v41H0v-53Z" fill={paleta.colinaDistante} fillOpacity={0.78} />
        <Path d="M0 124c43-19 80-25 120-18 40 7 66 26 108 25 46-1 77-25 118-32 41-7 75 2 114 18v38H0v-31Z" fill={paleta.colinaProxima} fillOpacity={0.88} />
        <Path d="M0 133c39-11 74-14 108-6m17 4c27 4 48 10 75 6m25 0c46 0 79-20 118-26 48-7 82 0 117 14" stroke={paleta.traco} strokeOpacity={0.76} strokeWidth={2} strokeLinecap="round" />

        {/* Ciprestes em silhueta: a escala da cena remete à paisagem da referência. */}
        <Path d="M40 29c-4 18-7 31-13 42-3 7-7 13-12 18h14l-15 15h14l-16 15h56l-16-15h14L51 89h14c-5-7-10-14-13-21-6-11-9-24-12-39Zm-4 90h8v14h-8Zm385-41c-3 13-5 21-10 29-2 4-5 8-8 11h10l-11 11h10l-12 12h40l-12-12h10l-11-11h10c-4-6-7-10-9-15-4-7-6-15-8-25h-9Zm-2 63h7v10h-7Z" fill={paleta.traco} fillOpacity={escuro ? 0.5 : 0.78} />
        <Path d="M35 64c2 14 7 27 14 39m370-18c2 10 6 18 11 27" stroke={paleta.detalhe} strokeOpacity={0.28} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M75 145c2-7 5-11 9-15m-2 16c2-5 5-8 10-11m-40 7c1-4 3-7 6-10m262 12c3-6 6-9 11-12m-5 14c3-5 6-7 11-9m38 7c2-4 4-7 8-9" stroke={paleta.detalhe} strokeOpacity={0.72} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width={116} height={72} viewBox="0 0 116 72" fill="none">
      {periodoDoDia === "manha" ? (
        <>
          <Circle cx={82} cy={25} r={15} fill={paleta.astro} fillOpacity={0.78} />
          <Path d="M34 24c4-4 8-4 12 0m5 7c3-3 6-3 9 0" stroke={paleta.detalhe} strokeWidth={1.8} strokeLinecap="round" />
        </>
      ) : null}

      {periodoDoDia === "tarde" ? (
        <>
          <Circle cx={34} cy={25} r={14} fill={paleta.astro} fillOpacity={0.84} />
          <Line x1={34} y1={5} x2={34} y2={9} stroke={paleta.astro} strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={14} y1={25} x2={18} y2={25} stroke={paleta.astro} strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={50} y1={25} x2={54} y2={25} stroke={paleta.astro} strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={20} y1={11} x2={23} y2={14} stroke={paleta.astro} strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={48} y1={11} x2={45} y2={14} stroke={paleta.astro} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M72 21c3-3 6-3 9 0m5 6c3-3 6-3 9 0" stroke={paleta.detalhe} strokeWidth={1.8} strokeLinecap="round" />
        </>
      ) : null}

      {periodoDoDia === "noite" ? (
        <>
          <Path d="M83 9c-2 3-3 6-2 9 1 7 7 12 14 12 2 0 4-.4 6-1.2-2 5-7 8.2-12.5 8.2-7.5 0-13.5-6-13.5-13.5 0-6.5 3.3-12 8-14.5Z" fill={paleta.astro} />
          <Circle cx={42} cy={18} r={1.8} fill={paleta.detalhe} />
          <Circle cx={58} cy={30} r={1.3} fill={paleta.detalhe} />
          <Circle cx={68} cy={12} r={1.5} fill={paleta.detalhe} />
          <Path d="M52 8v4m-2-2h4" stroke={paleta.detalhe} strokeWidth={1.2} strokeLinecap="round" />
        </>
      ) : null}

      <Path
        d="M0 53c12-10 22-14 33-12 9 2 14 8 23 8 11 0 18-12 31-12 12 0 20 8 29 17v18H0V53Z"
        fill={paleta.colinaDistante}
        fillOpacity={0.72}
      />
      <Path
        d="M0 61c14-7 23-9 34-7 10 2 18 9 29 9 13 0 21-8 31-10 8-2 15 0 22 4v15H0V61Z"
        fill={paleta.colinaProxima}
        fillOpacity={0.82}
      />
      <Path d="M0 65c13-4 23-4 33-1m27 2c13 0 21-6 31-8 9-2 16-1 25 3" stroke={paleta.traco} strokeOpacity={0.82} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
