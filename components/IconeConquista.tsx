import Svg, { Circle, Path } from "react-native-svg";
import type { IdConquista } from "../core/content/conquistas";

type Props = {
  conquistaId: IdConquista;
  conquistada: boolean;
  tamanho?: number;
};

const PALETA = {
  conquistada: { metal: "#d7a956", brilho: "#f8e5b8", tinta: "#68411f", fita: "#a44f3d" },
  bloqueada: { metal: "#c9c3b8", brilho: "#eeeae2", tinta: "#746e64", fita: "#989185" },
} as const;

/** Medalhões vetoriais próprios; o nome e o estado são anunciados pelo card. */
export function IconeConquista({ conquistaId, conquistada, tamanho = 48 }: Props) {
  const cores = conquistada ? PALETA.conquistada : PALETA.bloqueada;

  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 80 80" fill="none" aria-hidden={true}>
      <Path d="m23 51-5 25 17-9 5 12 5-28m7 0 5 28 5-12 17 9-5-25" fill={cores.fita} stroke={cores.tinta} strokeWidth="1.6" strokeLinejoin="round" />
      <Path d="m26 57-2 11 9-5m23-6 2 11 9-5" stroke={cores.brilho} strokeWidth="1.6" strokeLinecap="round" opacity={0.8} />
      <Circle cx="40" cy="34" r="28" fill={cores.metal} stroke={cores.tinta} strokeWidth="2.4" />
      <Circle cx="40" cy="34" r="23" fill={cores.brilho} stroke={cores.tinta} strokeWidth="1.4" />
      <Circle cx="40" cy="34" r="19" fill={cores.metal} fillOpacity={0.34} stroke={cores.tinta} strokeWidth="1" strokeOpacity={0.58} />

      {conquistaId === "primeiro-livro" ? (
        <>
          <Path d="M26 43c5-2 10-1 14 2 4-3 9-4 14-2V28c-5-2-10-1-14 2-4-3-9-4-14-2v15Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M40 30v15m-10-12c3-1 5 0 7 1m13-1c-3-1-5 0-7 1" stroke={cores.tinta} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="m40 17 1.8 3.5 3.9.6-2.8 2.7.7 3.8-3.6-1.8-3.5 1.8.7-3.8-2.8-2.7 3.9-.6L40 17Z" fill={cores.tinta} />
        </>
      ) : null}

      {conquistaId === "pentateuco" ? (
        <>
          <Path d="M27 28h25v18H27z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" />
          <Path d="M31 24h24v18H31z" fill={cores.metal} stroke={cores.tinta} strokeWidth="2" />
          <Path d="M35 20h19v18H35z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" />
          <Path d="M40 24v10m-4-5h8" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="30" cy="37" r="1.4" fill={cores.tinta} /><Circle cx="50" cy="43" r="1.4" fill={cores.tinta} />
        </>
      ) : null}

      {conquistaId === "evangelhos" ? (
        <>
          <Path d="M25 29c6-2 11-1 15 2 4-3 9-4 15-2v16c-6-2-11-1-15 2-4-3-9-4-15-2V29Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M40 31v16m-10-13c3-.5 5 0 7 1m13-1c-3-.5-5 0-7 1" stroke={cores.tinta} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="m40 17 1.8 3.8 4.2 1.2-4.2 1.4-1.8 3.7-1.5-3.7-4-1.4 4-1.2 1.5-3.8Z" fill={cores.tinta} strokeLinejoin="round" />
        </>
      ) : null}

      {conquistaId === "antigo-testamento" ? (
        <>
          <Path d="M26 42c9-1 13 0 14 3V29c-3-3-7-4-14-3v16Zm28 0c-9-1-13 0-14 3V29c3-3 7-4 14-3v16Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="m28 25 3-4h18l3 4m-12 6v10m-9-8h4m16 0h-4" stroke={cores.tinta} strokeWidth="1.6" strokeLinecap="round" />
          <Circle cx="31" cy="34" r="1.3" fill={cores.tinta} /><Circle cx="49" cy="34" r="1.3" fill={cores.tinta} />
        </>
      ) : null}

      {conquistaId === "novo-testamento" ? (
        <>
          <Path d="M27 31c5-4 10-3 13 1v15c-3-4-8-5-13-1V31Zm26 0c-5-4-10-3-13 1v15c3-4 8-5 13-1V31Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M40 18v10m-5-5h10" stroke={cores.tinta} strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M31 37c2-1 4-1 6 0m16 0c-2-1-4-1-6 0" stroke={cores.tinta} strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : null}

      {conquistaId === "historia-israel" ? (
        <>
          <Path d="M29 24h22v24H29z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" />
          <Path d="M33 29h14m-14 5h9m-9 5h12" stroke={cores.tinta} strokeWidth="1.6" strokeLinecap="round" />
          <Path d="M25 47c4-5 8-5 12 0s8 5 12 0 7-4 10 0" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="26" cy="25" r="3" fill={cores.metal} stroke={cores.tinta} strokeWidth="1.5" />
          <Circle cx="54" cy="47" r="3" fill={cores.metal} stroke={cores.tinta} strokeWidth="1.5" />
        </>
      ) : null}

      {conquistaId === "poesia-sabedoria" ? (
        <>
          <Path d="M27 46c13-2 22-12 27-24-14 2-24 10-27 24Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M27 47c7-8 14-14 23-20m-13 12 1-8m5 2 7 1" stroke={cores.tinta} strokeWidth="1.7" strokeLinecap="round" />
          <Path d="M25 49c6-1 11-1 16 1" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="31" cy="25" r="2" fill={cores.tinta} /><Circle cx="51" cy="44" r="1.7" fill={cores.tinta} />
        </>
      ) : null}

      {conquistaId === "profetas" ? (
        <>
          <Path d="m27 34 23-9v20l-23-8v-3Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="m33 38 4 11h7l-5-9m13-13 5-4m-5 11h7m-7 7 5 4" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M24 32v7" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : null}

      {conquistaId === "cartas" ? (
        <>
          <Path d="M25 27h30v21H25z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" />
          <Path d="m27 30 13 11 13-11M27 45l9-8m17 8-9-8" stroke={cores.tinta} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="40" cy="40" r="4" fill={cores.metal} stroke={cores.tinta} strokeWidth="1.6" />
          <Path d="m40 37 1 2 2 .3-1.5 1.4.4 2-1.9-1-1.8 1 .3-2-1.5-1.4 2-.3 1-2Z" fill={cores.tinta} />
        </>
      ) : null}

      {conquistaId === "biblia-completa" ? (
        <>
          <Path d="M25 31c6-2 11-1 15 2 4-3 9-4 15-2v15c-6-2-11-1-15 2-4-3-9-4-15-2V31Z" fill={cores.brilho} stroke={cores.tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M40 33v15m-10-13c3-.5 5 0 7 1m13-1c-3-.5-5 0-7 1" stroke={cores.tinta} strokeWidth="1.5" strokeLinecap="round" />
          <Circle cx="51" cy="22" r="9" fill={cores.metal} stroke={cores.tinta} strokeWidth="2" />
          <Path d="m47 22 2.5 2.5 5-5" stroke={cores.tinta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
    </Svg>
  );
}
