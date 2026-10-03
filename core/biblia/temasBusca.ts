import type { IdTema } from "./tiposTema";

// Temas pré-definidos pra aba Pesquisa — lista curada de referências
// por assunto, no mesmo espírito de REFERENCIAS_CURADAS em
// versiculoDoDia.ts. Cores usam a mesma paleta de genero.ts (bg/texto
// claros e escuros já testados de contraste).
export type Tema = {
  id: IdTema;
  titulo: string;
  descricao: string;
  /** Emoji só como rótulo de acessibilidade/fallback — o card usa a
   * ilustração SVG própria (`IlustracaoTema`), não este emoji cru
   * (ver `components/IlustracaoTema.tsx`). */
  icone: string;
  corBg: string;
  corBgDark: string;
  corTexto: string;
  corTextoDark: string;
  referencias: string[];
  temasRelacionados: IdTema[];
};

export const TEMAS_BUSCA: Tema[] = [
  {
    id: "amor",
    titulo: "Amor",
    descricao: "Cuidado, presença e amor que acolhe.",
    icone: "❤️",
    corBg: "#f8e1df",
    corBgDark: "#3a2624",
    corTexto: "#934840",
    corTextoDark: "#e0a99f",
    referencias: ["1 Coríntios 13:4-7", "João 3:16", "1 João 4:19", "Romanos 5:8"],
    temasRelacionados: ["perdao", "alegria"],
  },
  {
    id: "cura",
    titulo: "Cura",
    descricao: "Palavras para atravessar o tempo de restauração.",
    icone: "🌿",
    corBg: "#dff0e5",
    corBgDark: "#1e3527",
    corTexto: "#287a45",
    corTextoDark: "#8fd1a5",
    referencias: ["Salmos 147:3", "Jeremias 17:14", "Isaías 53:5", "Tiago 5:15"],
    temasRelacionados: ["esperanca", "ansiedade"],
  },
  {
    id: "ansiedade",
    titulo: "Ansiedade",
    descricao: "Encontre descanso em dias difíceis.",
    icone: "🕊️",
    corBg: "#e2eef0",
    corBgDark: "#1c2f32",
    corTexto: "#326b75",
    corTextoDark: "#9ecad2",
    referencias: ["Filipenses 4:6-7", "1 Pedro 5:7", "Mateus 6:34", "Salmos 94:19"],
    temasRelacionados: ["sabedoria", "cura"],
  },
  {
    id: "raiva",
    titulo: "Raiva",
    descricao: "Um caminho de calma para o coração.",
    icone: "🔥",
    corBg: "#f3e6d3",
    corBgDark: "#3a2c18",
    corTexto: "#8a5a2b",
    corTextoDark: "#e0c39a",
    referencias: ["Efésios 4:26", "Tiago 1:19-20", "Provérbios 15:1", "Colossenses 3:8"],
    temasRelacionados: ["sabedoria", "perdao"],
  },
  {
    id: "alegria",
    titulo: "Alegria",
    descricao: "Lembretes de gratidão e esperança.",
    icone: "☀️",
    corBg: "#ebe4f6",
    corBgDark: "#2c2438",
    corTexto: "#664795",
    corTextoDark: "#c4b3e6",
    referencias: ["Salmos 16:11", "Neemias 8:10", "Filipenses 4:4", "João 15:11"],
    temasRelacionados: ["amor", "esperanca"],
  },
  {
    id: "perdao",
    titulo: "Perdão",
    descricao: "Recomeço, graça e reconciliação.",
    icone: "🤍",
    corBg: "#f2e2f1",
    corBgDark: "#332030",
    corTexto: "#84477e",
    corTextoDark: "#d9a8d4",
    referencias: ["Efésios 4:32", "Mateus 6:14-15", "Colossenses 3:13", "1 João 1:9"],
    temasRelacionados: ["amor", "sabedoria"],
  },
  {
    id: "esperanca",
    titulo: "Esperança",
    descricao: "Promessas para firmar os próximos passos.",
    icone: "🌅",
    corBg: "#e7edf9",
    corBgDark: "#1f2a3d",
    corTexto: "#395990",
    corTextoDark: "#9db3d9",
    referencias: ["Romanos 15:13", "Jeremias 29:11", "Salmos 42:11", "Hebreus 11:1"],
    temasRelacionados: ["alegria", "cura"],
  },
  {
    id: "sabedoria",
    titulo: "Sabedoria",
    descricao: "Direção para escolhas do cotidiano.",
    icone: "📖",
    corBg: "#fdf1b8",
    corBgDark: "#4a3f14",
    corTexto: "#806000",
    corTextoDark: "#e0c34a",
    referencias: ["Tiago 1:5", "Provérbios 3:5-6", "Provérbios 9:10", "Colossenses 3:16"],
    temasRelacionados: ["ansiedade", "raiva"],
  },
];
