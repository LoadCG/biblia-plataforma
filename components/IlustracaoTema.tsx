import Svg, { Path, Circle, Line, Ellipse } from "react-native-svg";
import type { IdTema } from "../core/biblia/tiposTema";

// Mini ilustrações editoriais locais para categorias de Descubra.
type Props = {
  tema: IdTema;
  cor: string;
  tamanho?: number;
};

export function IlustracaoTema({ tema, cor, tamanho = 64 }: Props) {
  const comuns = { width: tamanho, height: tamanho * 0.8, viewBox: "0 0 120 96", fill: "none" as const };
  const tinta = cor;
  const folha = tema === "cura" || tema === "perdao" ? "#89936b" : "#a28a62";

  // Mini cenas editoriais, em formas locais e sem texto: os títulos e
  // descrições reais permanecem no card e a arte é ocultada da árvore A11y.
  switch (tema) {
    case "amor":
      return (
        <Svg {...comuns}>
          <Ellipse cx="61" cy="84" rx="44" ry="7" fill={folha} fillOpacity={0.18} />
          <Path d="M18 78c17-8 31-8 45 0s27 8 40 0" stroke={folha} strokeWidth="2" />
          <Path d="M60 70C39 57 36 44 43 38c7-6 15 0 17 7 3-8 12-13 19-7 9 8 1 22-19 32Z" fill={cor} fillOpacity={0.2} stroke={tinta} strokeWidth="2.2" strokeLinejoin="round" />
          <Path d="M60 70c0-11 1-17 5-25" stroke={tinta} strokeWidth="1.6" strokeLinecap="round" />
          <Circle cx="35" cy="31" r="3" fill={cor} fillOpacity="0.45" />
          <Circle cx="89" cy="34" r="2" fill={cor} fillOpacity="0.35" />
        </Svg>
      );
    case "cura":
      return (
        <Svg {...comuns}>
          <Path d="M11 82c24-4 48-4 96 0" stroke={folha} strokeWidth="2" strokeLinecap="round" />
          <Path d="M57 78c8-15 16-27 30-39M64 65 43 50m32 1 18 9M54 74 39 67" stroke={folha} strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M85 39c-2-13 5-21 19-23 0 14-7 22-19 23Zm-21 27C50 65 42 58 40 47c13 1 21 7 24 19Zm30-7c2-12 10-18 22-18-2 12-10 18-22 18ZM55 75c-11 1-19-4-24-14 12-2 20 3 24 14Z" fill={folha} fillOpacity="0.72" stroke={tinta} strokeWidth="1.2" />
          <Circle cx="22" cy="33" r="9" fill="#e8c88b" fillOpacity="0.55" />
        </Svg>
      );
    case "ansiedade":
      return (
        <Svg {...comuns}>
          <Path d="M5 81c23-8 47-7 109 0" stroke={folha} strokeWidth="2" />
          <Path d="M17 69c12-8 25-8 38 0m-44-9c13-7 26-7 39 0m11 8c13-8 27-8 40 0m-37-9c13-7 26-7 39 0" stroke={tinta} strokeWidth="2" strokeLinecap="round" opacity="0.58" />
          <Path d="M17 49c4-11 13-18 27-19-1 13-9 21-24 23m3 2c8-7 16-9 25-8" fill={folha} fillOpacity="0.48" stroke={tinta} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M86 48c4-10 12-16 25-17-2 12-9 19-22 21m2 2c7-6 14-8 22-7" fill={folha} fillOpacity="0.4" stroke={tinta} strokeWidth="1.5" strokeLinejoin="round" />
          <Circle cx="63" cy="25" r="8" fill="#e8c88b" fillOpacity="0.55" />
        </Svg>
      );
    case "raiva":
      return (
        <Svg {...comuns}>
          <Ellipse cx="61" cy="81" rx="40" ry="7" fill="#9e7144" fillOpacity="0.2" />
          <Path d="M21 78c10-11 20-14 32-8m14 8c12-10 24-12 38-5" stroke={folha} strokeWidth="2.2" strokeLinecap="round" />
          <Path d="M63 73c-15-8-21-21-15-31 4-7 11-8 16-2 1-11 9-17 17-12 9 6 4 18 1 24 10-4 17 1 16 10-2 12-18 16-35 11Z" fill="#e1a953" fillOpacity="0.36" stroke={tinta} strokeWidth="2.1" strokeLinejoin="round" />
          <Path d="M63 71c-5-9-4-18 2-27 4 8 5 16 1 27m6-1c1-7 5-12 12-16-1 8-5 13-12 16Z" fill="#d78a38" fillOpacity="0.6" />
          <Circle cx="30" cy="38" r="2" fill="#e8c88b" />
        </Svg>
      );
    case "alegria":
      return (
        <Svg {...comuns}>
          <Path d="M9 80c25-4 47-4 102 0" stroke={folha} strokeWidth="2" />
          <Path d="M13 78 49 49m0 0L36 34m13 15 16-23m-4 39 27-29m-21 50 28-26m-45-1L29 63" stroke={folha} strokeWidth="2" strokeLinecap="round" />
          <Path d="M49 50c-10 2-17-3-19-13 10-2 17 3 19 13Zm1-2c-2-10 3-17 13-20 2 10-3 17-13 20Zm11 18c-9 2-16-2-19-11 10-2 16 2 19 11Zm26-25c-9 1-15-4-16-13 9-1 15 4 16 13Zm-1 25c-8 2-15-2-17-10 9-2 15 2 17 10Z" fill={folha} fillOpacity="0.75" stroke={tinta} strokeWidth="1.3" />
          <Circle cx="91" cy="27" r="10" fill="#e8c88b" fillOpacity="0.62" />
        </Svg>
      );
    case "perdao":
      return (
        <Svg {...comuns}>
          <Path d="M13 77c15-17 27-26 49-32 14-4 27-3 43 1" stroke={folha} strokeWidth="2.3" strokeLinecap="round" />
          <Path d="M61 46c-9-12-7-23 3-27 9-4 16 3 17 12 6-8 17-9 22-1 7 11-4 22-26 27Z" fill={folha} fillOpacity="0.48" stroke={tinta} strokeWidth="1.8" strokeLinejoin="round" />
          <Path d="M59 48c-12-8-24-10-39-7m39 7c-9-2-17-1-25 3m56-18c10-8 20-10 31-8m-31 8c8-2 15-1 22 2" stroke={tinta} strokeWidth="1.6" strokeLinecap="round" />
          <Path d="M38 69c14 4 28 4 42 0" stroke="#c89c64" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </Svg>
      );
    case "esperanca":
      return (
        <Svg {...comuns}>
          <Path d="M5 79c22-14 38-12 58 0s35 10 53-1" stroke="#8b9a68" strokeWidth="3" />
          <Path d="M4 84c24-7 42-5 61 2 18 6 35 2 51-4" stroke="#b49a70" strokeWidth="2" />
          <Path d="M15 73c14-8 26-8 39 0m22 1c13-8 24-8 37-1" stroke={folha} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="67" cy="42" r="19" fill="#eab65f" fillOpacity="0.52" />
          <Path d="M28 73a39 39 0 0 1 78 0" stroke={tinta} strokeWidth="1.8" strokeOpacity="0.45" />
          <Line x1="67" y1="12" x2="67" y2="18" stroke={tinta} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="38" y1="28" x2="43" y2="32" stroke={tinta} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="96" y1="28" x2="91" y2="32" stroke={tinta} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      );
    case "sabedoria":
      return (
        <Svg {...comuns}>
          <Ellipse cx="63" cy="80" rx="43" ry="7" fill="#806346" fillOpacity="0.18" />
          <Path d="M22 52c16-6 29-6 43 0v25c-14-6-27-6-43 0V52Zm43 0c14-6 28-6 43 0v25c-15-6-29-6-43 0V52Z" fill="#f8f0df" stroke={tinta} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M65 54v22m-36-16c9-3 17-3 27 1m19-1c9-4 18-4 27-1" stroke={tinta} strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
          <Path d="M17 78c31-8 64-8 104 0v6c-40-7-73-7-104 0v-6Z" fill="#c89c64" fillOpacity="0.78" />
          <Path d="M89 48c5-11 10-18 18-25m-17 17c-8-1-13-5-16-12 9 0 15 4 16 12Zm10-13c0-9 4-15 12-19 1 8-3 15-12 19Z" stroke={folha} strokeWidth="1.8" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
}
