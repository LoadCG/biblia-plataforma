// Service worker mínimo pra dar offline de verdade na versão web (ver
// 7.3 do FUNCIONALIDADES.md — o site antigo tinha isso, foi perdido na
// migração pra Expo Router). Estratégia deliberadamente simples e
// segura, não agressiva:
//
// - Navegação (HTML): network-first, cai pro cache só se a rede
//   falhar. Isso garante que quem está online sempre recebe a versão
//   mais nova do app — nunca fica "preso" numa versão antiga cacheada
//   (o problema clássico de service worker mal feito).
// - Assets estáticos (JS/CSS com hash no nome, gerados pelo build):
//   cache-first. Seguro porque o conteúdo nunca muda sob o mesmo nome
//   de arquivo (o hash muda quando o conteúdo muda) — não precisa de
//   invalidação manual.
// - Requisições de outra origem (ex. bible-api.com) não são
//   interceptadas — cache de API já é responsabilidade do
//   core/biblia/BibliaAPI.ts, em memória.
const CACHE_NAME = "biblia-plataforma-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add("/").catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return resposta;
        })
        .catch(() => caches.match(request).then((cache) => cache || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cache) => {
      if (cache) return cache;
      return fetch(request).then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        }
        return resposta;
      });
    })
  );
});
