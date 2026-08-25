import Svg, { Path, Circle, Line } from "react-native-svg";

// Ilustrações originais pros cards de tema em "Descubra" (ver TODO.md,
// item 7 do plano original: "uma ilustração ou imagem gerada
// dinamicamente, com estilo próprio do nosso app, flutuando no card" —
// ficou faltando desde a reformulação visual, os cards usavam só o
// emoji cru de sistema). Sem gerador de imagem disponível, a
// alternativa que ainda cumpre "não copiar, identidade original" é
// desenhar um ícone de traço simples (line art) por tema, próprio,
// usando a mesma cor do texto do card — cada um vira parte da
// identidade visual do app, em vez de um emoji que renderiza diferente
// por sistema operacional (Windows/Mac/Android têm emoji sets
// distintos, ver auditoria de UI anterior).
export type IdTema = "amor" | "cura" | "ansiedade" | "raiva" | "alegria" | "perdao" | "esperanca" | "sabedoria";

type Props = {
  tema: IdTema;
  cor: string;
  tamanho?: number;
};

const TRACO = 1.6;

export function IlustracaoTema({ tema, cor, tamanho = 64 }: Props) {
  const comuns = { width: tamanho, height: tamanho, viewBox: "0 0 24 24", fill: "none" as const };

  switch (tema) {
    case "amor":
      return (
        <Svg {...comuns}>
          <Path
            d="M12 20.5c-4.8-3-8.5-6.4-8.5-10.3A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 8.5 3.2c0 3.9-3.7 7.3-8.5 10.3Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "cura":
      return (
        <Svg {...comuns}>
          <Path d="M12 21V9" stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Path
            d="M12 13c0-4.5 3-7.5 7.5-8-.5 4.5-3 7.5-7.5 8Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
          <Path
            d="M12 16c0-3.8-2.5-6.3-6-6.7.4 3.8 2.5 6.3 6 6.7Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "ansiedade":
      return (
        <Svg {...comuns}>
          <Path
            d="M4 9c1.6-3 4-4.5 8-4.5S18.4 6 20 9c-1 .8-2 1.2-3 1.2-1.8 0-2.6-1-5-1s-3.2 1-5 1c-1 0-2-.4-3-1.2Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
          <Path d="M6 14c4 1.6 8 1.6 12 0" stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Path d="M7 18c3.4 1.2 6.6 1.2 10 0" stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
        </Svg>
      );
    case "raiva":
      return (
        <Svg {...comuns}>
          <Path
            d="M12 21c3.6 0 6-2.3 6-5.6 0-3-1.8-5-3-8-.4 2-1.4 3-2.4 3.6.4-2.4-.4-4.6-2.6-6.4C10.4 7.2 9 9.5 9 12c-1-.4-1.6-1.4-1.8-2.6C6 11 6 13 6 15.4 6 18.7 8.4 21 12 21Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "alegria":
      return (
        <Svg {...comuns}>
          <Circle cx={12} cy={12} r={4.5} stroke={cor} strokeWidth={TRACO} />
          <Line x1={12} y1={2.5} x2={12} y2={5} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={12} y1={19} x2={12} y2={21.5} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={2.5} y1={12} x2={5} y2={12} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={19} y1={12} x2={21.5} y2={12} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={5.3} y1={5.3} x2={7} y2={7} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={17} y1={17} x2={18.7} y2={18.7} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={18.7} y1={5.3} x2={17} y2={7} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={7} y1={17} x2={5.3} y2={18.7} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
        </Svg>
      );
    case "perdao":
      return (
        <Svg {...comuns}>
          <Path d="M3 12h4l2.5-4L13 15l2-3h6" stroke={cor} strokeWidth={TRACO} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case "esperanca":
      return (
        <Svg {...comuns}>
          <Path d="M3 16a9 9 0 0 1 18 0" stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={3} y1={20} x2={21} y2={20} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={12} y1={4} x2={12} y2={7} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={5} y1={9} x2={7} y2={10.5} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
          <Line x1={19} y1={9} x2={17} y2={10.5} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
        </Svg>
      );
    case "sabedoria":
      return (
        <Svg {...comuns}>
          <Path
            d="M12 6.5c-1.6-1.3-3.6-2-6.5-2v12.5c2.9 0 4.9.7 6.5 2 1.6-1.3 3.6-2 6.5-2V4.5c-2.9 0-4.9.7-6.5 2Z"
            stroke={cor}
            strokeWidth={TRACO}
            strokeLinejoin="round"
          />
          <Line x1={12} y1={6.5} x2={12} y2={19} stroke={cor} strokeWidth={TRACO} strokeLinecap="round" />
        </Svg>
      );
    default:
      return null;
  }
}
