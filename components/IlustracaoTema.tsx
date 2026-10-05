import Svg, { Circle, Ellipse, Line, Path } from "react-native-svg";
import type { IdTema } from "../core/biblia/tiposTema";

// Ilustrações editoriais locais de Descubra. Os títulos dos temas carregam o
// significado acessível; a arte é decorativa e não depende de recursos remotos.
type Props = {
  tema: IdTema;
  cor: string;
  tamanho?: number;
};

const OURO = "#d5a457";
const SÁLVIA = "#89936f";
const TERRA = "#a7764d";
const TRAÇO = 2.6;

export function IlustracaoTema({ tema, cor, tamanho = 64 }: Props) {
  const comuns = { width: tamanho, height: tamanho * 0.8, viewBox: "0 0 120 96", fill: "none" as const };
  const linha = { stroke: cor, strokeWidth: TRAÇO, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (tema) {
    case "amor":
      return (
        <Svg {...comuns}>
          <Ellipse cx="60" cy="83" rx="35" ry="5" fill={TERRA} fillOpacity={0.14} />
          <Path d="M60 75C49 65 31 53 31 40c0-9 6-15 15-15 7 0 12 4 14 10 3-6 8-10 15-10 9 0 15 6 15 15 0 13-18 25-30 35Z" fill={cor} fillOpacity={0.2} {...linha} />
          <Path d="M60 74c-14 5-27 1-36-9m36 9c14 5 27 1 36-9" stroke={SÁLVIA} strokeWidth="3" strokeLinecap="round" />
          <Path d="M41 59c5 4 10 6 16 7m22-7c-5 4-10 6-16 7" stroke={cor} strokeWidth="1.8" strokeLinecap="round" opacity={0.75} />
          <Circle cx="23" cy="31" r="2.5" fill={OURO} /><Circle cx="97" cy="31" r="2.5" fill={OURO} />
        </Svg>
      );
    case "cura":
      return (
        <Svg {...comuns}>
          <Path d="M16 82c24-3 54-3 88 0" stroke={TERRA} strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M59 79c1-17 7-31 21-44" stroke={SÁLVIA} strokeWidth="3.2" strokeLinecap="round" />
          <Path d="M70 57c-15 1-23-6-25-19 14 0 22 6 25 19Zm8-14c0-13 7-20 20-22 1 14-6 21-20 22Zm-15 28c-12 0-20-6-23-17 12-1 20 5 23 17Z" fill={SÁLVIA} fillOpacity={0.58} stroke={cor} strokeWidth="1.8" strokeLinejoin="round" />
          <Circle cx="31" cy="29" r="11" fill={OURO} fillOpacity={0.25} stroke={OURO} strokeWidth="1.8" />
          <Path d="M31 23v12m-6-6h12" stroke={cor} strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M21 44c-4 4-6 9-6 15m27-18c3 4 5 8 5 13" stroke={OURO} strokeWidth="1.8" strokeLinecap="round" opacity={0.8} />
        </Svg>
      );
    case "ansiedade":
      return (
        <Svg {...comuns}>
          <Path d="M14 74c13-11 26-11 39 0s26 11 53 0M10 83c15-8 28-8 42 0s29 8 58 0" stroke={SÁLVIA} strokeWidth="2.8" strokeLinecap="round" />
          <Path d="M18 60c13-10 25-10 38 0m8 0c12-10 24-10 37 0" stroke={cor} strokeWidth="2.4" strokeLinecap="round" opacity={0.72} />
          <Path d="M73 18a23 23 0 1 0 27 31A20 20 0 0 1 73 18Z" fill={OURO} fillOpacity={0.32} stroke={cor} strokeWidth="2.4" strokeLinejoin="round" />
          <Circle cx="34" cy="37" r="2" fill={OURO} /><Circle cx="48" cy="27" r="1.8" fill={OURO} />
          <Path d="M24 49c5 2 9 2 14 0" stroke={cor} strokeWidth="1.8" strokeLinecap="round" opacity={0.55} />
        </Svg>
      );
    case "raiva":
      return (
        <Svg {...comuns}>
          <Ellipse cx="61" cy="82" rx="33" ry="5" fill={TERRA} fillOpacity={0.16} />
          <Path d="M60 78C47 68 39 58 40 47c1-9 7-17 16-24 0 10 4 14 8 18 1-13 8-23 18-31 0 15 12 22 12 39 0 13-11 25-34 29Z" fill={OURO} fillOpacity={0.34} stroke={cor} strokeWidth="2.8" strokeLinejoin="round" />
          <Path d="M62 72c-7-6-10-12-8-19 2-5 5-8 9-12 1 7 5 10 8 13 0-6 4-11 8-15 0 8 7 12 7 21 0 8-8 13-24 12Z" fill={TERRA} fillOpacity={0.6} stroke={TERRA} strokeWidth="1.4" strokeLinejoin="round" />
          <Path d="M25 37l7 5m-3-17 5 8m59 4 6-5m-3 14 8-2" stroke={OURO} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );
    case "alegria":
      return (
        <Svg {...comuns}>
          <Path d="M15 79c25-5 57-5 90 0" stroke={SÁLVIA} strokeWidth="2.6" strokeLinecap="round" />
          <Circle cx="61" cy="42" r="18" fill={OURO} fillOpacity={0.32} stroke={cor} strokeWidth="2.5" />
          <Path d="M61 12v7m0 46v7M31 42h7m46 0h7M40 21l5 5m32 32 5 5m0-42-5 5M45 58l-5 5" stroke={OURO} strokeWidth="2.8" strokeLinecap="round" />
          <Path d="M24 76c4-11 11-17 22-19-1 12-8 18-22 19Zm1 1c12-2 20 1 25 9m46-10c-4-10-11-16-22-18 1 12 8 17 22 18Zm-1 1c-11-2-19 1-24 8" fill={SÁLVIA} fillOpacity={0.54} stroke={cor} strokeWidth="1.8" strokeLinejoin="round" />
        </Svg>
      );
    case "perdao":
      return (
        <Svg {...comuns}>
          <Path d="M27 47c2-15 17-25 32-20l7 3-7 9m34 10c-2 15-17 25-32 20l-7-3 7-9" stroke={cor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M39 46c2-8 10-13 18-11m24 15c-2 8-10 13-18 11" stroke={SÁLVIA} strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M60 39c-8-7-7-15 0-18 6 3 7 9 3 14m-3 22c8 7 7 15 0 18-6-3-7-9-3-14" fill={SÁLVIA} fillOpacity={0.56} stroke={cor} strokeWidth="1.8" strokeLinejoin="round" />
          <Circle cx="24" cy="72" r="2.4" fill={OURO} /><Circle cx="96" cy="24" r="2.4" fill={OURO} />
          <Path d="M14 82c15-4 27-4 39 0m14 0c13-4 25-4 39 0" stroke={TERRA} strokeWidth="2" strokeLinecap="round" opacity={0.65} />
        </Svg>
      );
    case "esperanca":
      return (
        <Svg {...comuns}>
          <Path d="M13 78c15-12 30-12 47 0s32 12 47 0v8H13v-8Z" fill={SÁLVIA} fillOpacity={0.28} />
          <Path d="M13 78c15-12 30-12 47 0s32 12 47 0" stroke={SÁLVIA} strokeWidth="2.8" strokeLinecap="round" />
          <Path d="M29 71a31 31 0 0 1 62 0" fill={OURO} fillOpacity={0.22} stroke={cor} strokeWidth="2.8" strokeLinecap="round" />
          <Path d="M60 34V23m-22 20-8-7m52 7 8-7m-44 2-5-9m34 9 5-9" stroke={OURO} strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M8 88c21-4 41-4 55 0s32 4 49 0" stroke={TERRA} strokeWidth="2" strokeLinecap="round" opacity={0.72} />
          <Circle cx="60" cy="69" r="3" fill={OURO} />
        </Svg>
      );
    case "sabedoria":
      return (
        <Svg {...comuns}>
          <Path d="M14 73c17-5 32-4 46 3 14-7 29-8 46-3v12c-17-5-32-4-46 3-14-7-29-8-46-3V73Z" fill={OURO} fillOpacity={0.2} stroke={cor} strokeWidth="2.8" strokeLinejoin="round" />
          <Path d="M60 76V40m0 36c-12-7-26-8-40-5V39c14-3 28-2 40 5m0 32c12-7 26-8 40-5V39c-14-3-28-2-40 5" fill="#fffaf0" fillOpacity={0.8} stroke={cor} strokeWidth="2.6" strokeLinejoin="round" />
          <Path d="M28 49c9-1 17 0 24 4m-24 4c9-1 17 0 24 4m40-12c-9-1-17 0-24 4m24 4c-9-1-17 0-24 4" stroke={TERRA} strokeWidth="1.8" strokeLinecap="round" opacity={0.72} />
          <Path d="m60 15 3.3 7.2 7.7.8-5.8 5.2 1.6 7.6-6.8-3.9-6.8 3.9 1.6-7.6-5.8-5.2 7.7-.8L60 15Z" fill={OURO} stroke={cor} strokeWidth="1.4" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
}
