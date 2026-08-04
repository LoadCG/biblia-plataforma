// Cores portadas 1:1 das variáveis CSS do site atual
// (docs/assets/style.css, blocos :root e :root[data-tema="escuro"]).
// Uso: `bg-cor-fundo dark:bg-cor-fundo-dark`, etc.
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cor: {
          fundo: "#faf8f4",
          "fundo-dark": "#1b1712",
          "fundo-elevado": "#ffffff",
          "fundo-elevado-dark": "#262019",
          texto: "#2a241c",
          "texto-dark": "#ece5d8",
          "texto-suave": "#6b6153",
          "texto-suave-dark": "#b3a894",
          borda: "#e6ded0",
          "borda-dark": "#3a3226",
          destaque: "#8a5a2b",
          "destaque-dark": "#e0a75e",
          "destaque-fundo": "#f3e6d3",
          "destaque-fundo-dark": "#3a2c18",
          grifo: "#fdf1b8",
          "grifo-dark": "#4a3f14",
          "grifo-fg": "#caa000",
          "grifo-fg-dark": "#e0c34a",
        },
        genero: {
          lei: "#395990",
          "lei-bg": "#e7edf9",
          historico: "#8a5a2b",
          "historico-bg": "#f3e6d3",
          poetico: "#84477e",
          "poetico-bg": "#f2e2f1",
          profetico: "#934840",
          "profetico-bg": "#f8e1df",
          evangelho: "#287a45",
          "evangelho-bg": "#dff0e5",
          carta: "#326b75",
          "carta-bg": "#e2eef0",
          apocaliptico: "#664795",
          "apocaliptico-bg": "#ebe4f6",
        },
      },
    },
  },
  plugins: [],
};
