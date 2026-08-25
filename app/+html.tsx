// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html
import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";

// Este arquivo é web-only e customiza o `<html>` raiz servido pelo Expo
// Router — sem ele, o Expo usa um template padrão embutido (visível
// batendo `curl` no dev server: `<style id="expo-reset">` com
// `html, body, #root { height: 100% }`).
//
// Bug real, reportado pelo usuário (2026-08-20): "se clicar, segurar e
// arrastar para cima sobre a navbar do celular, durante a leitura
// bíblica, a navbar vai um pouco para cima e uma div marrom aparece
// abaixo dela, cobrindo parte do conteúdo" — só na leitura bíblica
// (única tela com barra flutuante fixa por cima do conteúdo, além da
// tab bar). Causa raiz: `height: 100%` no mobile é recalculado contra
// a altura *visível* do viewport, que muda dinamicamente conforme a
// barra de endereço do navegador anima pra dentro/fora durante um
// gesto de arrasto — por um instante o layout (calculado pra altura
// antiga) fica menor que o viewport de verdade, expondo o
// `background-color` cru do `body` (definido em `global.css`,
// `#faf8f4`/`#1b1712` — o "marrom" relatado é o tom escuro) por baixo
// dos elementos posicionados no fim da tela. Esse é o clássico "bug do
// 100vh no mobile"; a correção moderna é `100dvh` (dynamic viewport
// height, que o navegador já recalcula sozinho conforme a UI dele
// muda), com fallback pra `100%` em navegadores mais antigos sem
// suporte (a declaração de `100dvh` é simplesmente ignorada por eles,
// mantendo o `100%` anterior).
function AlturaDinamicaViewport() {
  return (
    <style
      id="altura-dinamica-viewport"
      dangerouslySetInnerHTML={{
        __html: `html,body,#root{height:100dvh}`,
      }}
    />
  );
}

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  // This is only required for server-side rendering.
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="pt-BR" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />
        {/* Precisa vir DEPOIS do ScrollViewStyleReset — mesma
            especificidade de seletor (`#root,body,html`/`html,body,#root`),
            então a ordem no documento decide qual `height` vence. */}
        <AlturaDinamicaViewport />

        {headNodes}

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
