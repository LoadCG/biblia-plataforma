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
const CACHE_PREFIX = "biblia-plataforma-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;

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
      .then((chaves) => Promise.all(
        chaves
          .filter((chave) => chave.startsWith(CACHE_PREFIX) && chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const respostaDaRede = fetch(request);

    // O cache é parte do ciclo do evento, mas não precisa atrasar a resposta
    // que a pessoa já pode começar a ler. Falhas de cache não afetam a navegação.
    event.waitUntil(
      respostaDaRede
        .then((resposta) => {
          if (!resposta.ok) return;
          return caches.open(CACHE_NAME).then((cache) => cache.put(request, resposta.clone()));
        })
        .catch(() => {})
    );

    event.respondWith(
      respostaDaRede.catch(() =>
        caches.open(CACHE_NAME).then((cache) => cache.match(request))
      )
    );
    return;
  }

  let veioDaRede = false;
  const resposta = caches.open(CACHE_NAME).then((cache) => cache.match(request)).then((cache) => {
    if (cache) return cache;
    veioDaRede = true;
    return fetch(request);
  });

  event.waitUntil(
    resposta
      .then((resultado) => {
        if (!veioDaRede || !resultado.ok) return;
        return caches.open(CACHE_NAME).then((cache) => cache.put(request, resultado.clone()));
      })
      .catch(() => {})
  );
  event.respondWith(resposta);
});
