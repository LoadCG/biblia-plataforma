import { Platform } from "react-native";

// Bug real, reportado pelo usuário (2026-08-20): "se clicar, segurar e
// arrastar para cima sobre a navbar do celular, durante a leitura
// bíblica, a navbar vai um pouco para cima e uma div marrom aparece
// abaixo dela, cobrindo parte do conteúdo" — só na leitura bíblica
// (única tela com barra flutuante fixa por cima do conteúdo, além da
// tab bar).
//
// Causa raiz: o HTML servido pelo Expo Router define
// `html, body, #root { height: 100% }` (visível batendo `curl` no dev
// server — vem de `ScrollViewStyleReset`, embutido no template padrão
// do `expo-router/build/static/html.js`). No mobile, `100%` é
// recalculado contra a altura *visível* do viewport, que muda
// dinamicamente conforme a barra de endereço do navegador anima pra
// dentro/fora durante um gesto de arrasto — por um instante o layout
// (calculado pra altura antiga) fica menor que o viewport de verdade,
// expondo o `background-color` cru do `body` (`global.css`,
// `#faf8f4`/`#1b1712` — o "marrom" relatado é o tom escuro) por baixo
// dos elementos fixados no fim da tela. É o clássico "bug do 100vh no
// mobile"; a correção moderna é `100dvh` (dynamic viewport height, que
// o navegador recalcula sozinho conforme a UI dele muda).
//
// **Por que isso é JS e não só CSS em `app/+html.tsx`:** o Expo Router
// só usa `+html.tsx` pra customizar o documento quando `web.output` é
// `"static"`/`"server"` — este projeto usa o padrão `"single"` (ver
// `TODO.md`, item E, decisão de não ativar `static` por risco em rotas
// dinâmicas), então um `+html.tsx` normal não teria efeito nenhum nem
// no dev nem no build publicado no Vercel. `app/+html.tsx` foi criado
// mesmo assim (documentado lá) como preparo pra se o projeto um dia
// migrar pra `static`/`server` — mas a correção que roda de verdade
// hoje é esta aqui, injetando o `<style>` em runtime.
export function corrigirAlturaViewportMobile(): void {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  if (document.getElementById("altura-dinamica-viewport")) return;

  const estilo = document.createElement("style");
  estilo.id = "altura-dinamica-viewport";
  // Mesma especificidade do seletor original (`html,body,#root`) —
  // como esta tag é inserida depois no `<head>`, a cascata garante que
  // esta declaração vence em navegadores que suportam `dvh`; nos que
  // não suportam, a linha inteira é ignorada e o `100%` original do
  // Expo continua valendo (nunca fica sem altura nenhuma).
  estilo.textContent = "html,body,#root{height:100dvh}";
  document.head.appendChild(estilo);
}
