import Svg, { Path, Ellipse, Circle } from "react-native-svg";

/** Livros e ramo em cena editorial própria, sem assets remotos. */
export function IlustracaoPlano({ escuro = false }: { escuro?: boolean }) {
  const tinta = escuro ? "#e0a75e" : "#8a5a2b";
  const papel = escuro ? "#3a3226" : "#fffaf1";
  const folha = escuro ? "#b5bd91" : "#77835c";

  return (
    <Svg width="100%" height="100%" viewBox="0 0 260 180" fill="none">
      <Ellipse cx={127} cy={165} rx={101} ry={8} fill={tinta} fillOpacity={0.14} />

      {/* O ramo fica ao fundo para não cruzar as páginas. */}
      <Path d="M178 113c10-29 18-52 36-83m-30 68c-12-10-19-20-21-33m27 18c13-7 22-16 27-29m-43 54c-13-4-22-11-28-22m54-13c12-1 22-7 31-16" stroke={tinta} strokeWidth={3} strokeLinecap="round" />
      <Path d="M163 66c-12-2-20-9-22-20 12 1 20 8 22 20Zm16-8c0-13 6-22 17-28 1 12-5 22-17 28Zm17-24c2-12 10-20 22-22 0 12-8 20-22 22Zm-26 56c-12-2-20-8-23-18 12 0 20 6 23 18Zm35-20c10-5 21-4 30 2-8 9-19 10-30-2Z" fill={folha} fillOpacity={0.9} stroke={escuro ? "#c3c99f" : "#87916a"} strokeWidth={1.2} strokeLinejoin="round" />
      <Circle cx={232} cy={19} r={2.5} fill={escuro ? "#e0a75e" : "#d6b16d"} fillOpacity={0.75} />

      {/* Livro inferior: capa e páginas em perspectiva. */}
      <Path d="M25 132c27-10 57-9 83 1 25-11 57-14 94-7v20c-34-5-65-2-94 12-27-12-55-15-83-7v-19Z" fill={folha} stroke={tinta} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M31 137c25-7 51-6 76 4v10c-25-10-51-11-76-4v-10Zm83 4c25-10 52-13 81-9v10c-29-4-56-1-81 9v-10Z" fill={papel} />
      <Path d="M107 141v14" stroke={tinta} strokeWidth={2} />

      {/* Segundo volume, com lombada marcada em tom de couro. */}
      <Path d="M35 104c27-10 55-8 76 1 23-10 49-12 81-6l-3 22c-29-5-54-2-78 11-24-12-49-15-76-8v-20Z" fill={escuro ? "#704b2b" : "#b67d48"} stroke={tinta} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M44 108c21-6 43-5 64 3v7c-21-8-43-9-64-3v-7Zm74 3c20-8 42-10 65-7v8c-23-3-45-1-65 7v-8Z" fill={papel} />
      <Path d="M108 111v12" stroke={tinta} strokeWidth={2} />
      <Path d="M38 127c26-7 51-5 74 5 23-11 50-15 78-10" stroke={tinta} strokeWidth={2} strokeLinecap="round" />

      {/* Bíblia aberta no topo da pilha. */}
      <Path d="M47 76c19-8 40-8 62 1v35c-22-9-43-9-62-1V76Zm62 1c20-9 40-10 62-4v35c-22-6-42-4-62 4V77Z" fill={papel} stroke={tinta} strokeWidth={2.8} strokeLinejoin="round" />
      <Path d="M109 79v33m-53-27c14-4 29-4 43 1m-43 7c14-4 29-4 43 1m20-9c12-4 24-5 36-3m-36 11c12-4 24-5 36-3" stroke={tinta} strokeWidth={1.6} strokeLinecap="round" opacity={0.72} />
      <Path d="M43 112c23-8 45-7 66 3 20-10 42-12 65-7" stroke="#c89c64" strokeWidth={4} strokeLinecap="round" />

    </Svg>
  );
}
