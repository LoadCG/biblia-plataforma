# Auditoria do service worker

**Revisão:** 2026-10-20
**Arquivos nesta rodada:** `public/sw.js` e este relatório. Rotas, `vercel.json`, landing, conteúdo e dependências não foram alterados.

## Resumo

O service worker implementa navegação network-first e cache-first para demais requisições GET da mesma origem. Em navegações offline, devolve apenas uma cópia em cache da URL pedida, sem usar `/` como fallback genérico. A leitura estática de capítulos pode ser armazenada quando a pessoa os abre online; os capítulos não são pré-cacheados em massa.

Foram identificados três problemas no fluxo de cache: respostas HTTP não bem-sucedidas podiam ser armazenadas, as gravações no cache não faziam parte do ciclo de vida do evento e uma falha de rede em URL sem cache podia devolver a landing em `/`. `public/sw.js` agora grava somente respostas bem-sucedidas, registra a gravação com `event.waitUntil()` sem atrasar a resposta visível e, offline, devolve somente a URL pedida se ela estiver em cache. A estratégia de rede e o nome do cache foram mantidos.

Não foi possível concluir uma reprodução em navegador offline sem iniciar serviço/build, e isso foi evitado para não concorrer com as outras frentes. A conclusão do defeito vem do fluxo explícito do `fetch` handler: `fetch()` resolve a resposta HTTP, o código anterior sempre chamava `cache.put`, e o `catch` cobre apenas falhas de rede. O limite da validação está registrado abaixo.

## Instruções consultadas

Antes de alterar o arquivo, consultei a [documentação exata do Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), conforme `AGENTS.md`. O código alterado é um service worker web padrão e não usa uma API Expo específica.

Para conferir o ciclo do navegador, consultei a documentação da MDN sobre [`fetch` em Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event), [`FetchEvent.respondWith`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith), [instalação de Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event) e [operação offline](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).

## Comportamento observado nas fontes

### Registro e instalação

- `core/registrarServiceWorker.ts` registra `/sw.js` somente na web e não registra o worker durante desenvolvimento (`__DEV__`). Em desenvolvimento, a limpeza agora considera somente registros cuja origem e caminho do script correspondem a este `/sw.js`, e caches com o prefixo `biblia-plataforma-`.
- `public/sw.js` usa o nome `biblia-plataforma-v1`.
- Na instalação, chama `skipWaiting()` e tenta armazenar `/`. A falha desse pré-cache é absorvida. Nesta versão, a instalação ainda pode ser ativada sem a raiz pré-cacheada.
- Na ativação, remove somente versões antigas de Cache Storage com o prefixo `biblia-plataforma-` e executa `clients.claim()`. Caches de outras aplicações na mesma origem são preservados.

Não concluí que o `catch` do pré-cache destrói o cache offline antigo: a versão anterior e a atual usam o mesmo nome de cache, e a rotina de ativação preserva esse nome. A consequência observável de uma falha no primeiro pré-cache é um worker ativo sem a raiz offline inicial, não a remoção comprovada de um cache anterior. Uma navegação online posterior ainda pode popular o cache.

### Navegações e rotas estáticas

- Requisições de navegação fazem fetch de rede primeiro. Uma resposta obtida é devolvida ao navegador; em falha de rede, o worker tenta somente o cache da URL pedida.
- O fetch handler guarda a resposta navegada com a URL original como chave. A gravação agora é aguardada pelo ciclo do evento, mas não pela resposta entregue à pessoa.
- O export estático publicado em `dist` contém rotas Expo e o script `scripts/gerar-rotas-leitura.js` acrescenta 1.189 páginas HTML para capítulos. Elas não são pré-cacheadas no evento `install`; cada rota entra no cache quando visitada e a resposta é gravada com sucesso.
- Uma rota válida ainda não visitada e uma URL sem cache não recebem a landing como substituta quando a rede falha. O navegador apresenta o erro offline padrão. Uma tela offline própria não faz parte desta pequena correção.
- Uma resposta 404/500 normalmente resolve `fetch()` em vez de lançar exceção; ela não é armazenada. A gravação só ocorre para respostas `ok`.

### Outros recursos GET

Para requisições GET same-origin que não são navegação, o worker procura cache primeiro e busca a rede se não houver cópia. Somente respostas com `ok` são armazenadas nessa parte. Requisições de outra origem, inclusive a API bíblica externa, não passam pelo cache deste service worker.

## Correção aplicada

Em `public/sw.js`:

- respostas bem-sucedidas continuam sendo devolvidas e sua gravação é mantida no ciclo do fetch event por `event.waitUntil()`;
- respostas HTTP de erro continuam sendo devolvidas à navegação atual, mas não substituem uma versão bem-sucedida que já esteja em cache;
- falhas de rede devolvem somente a URL pedida caso exista em cache. O fallback genérico para `/` foi removido, evitando mostrar a landing em uma leitura offline não armazenada ou numa URL inválida;
- se não houver cópia da própria URL, a promessa de resposta rejeita e o navegador mostra seu erro offline padrão.

Não houve mudança do nome do cache, das chaves, do escopo, das rotas ou da estratégia network-first/cache-first. A mudança intencional é que uma rota ainda não armazenada deixa de receber a landing ao ser acessada offline; sem cópia local, o navegador mostra erro de conexão. Um risco residual é o host responder `200` para uma rota inexistente por fallback de SPA; `response.ok` sozinho não distingue esse caso. O comportamento do Vercel para URLs ausentes deve ser conferido em Preview.

## Checkpoints para um upgrade seguro

| Checkpoint | Verificação | Critério de aceite |
|---|---|---|
| SW1. Estado anterior | Em perfil com worker/cache de versão anterior, abrir uma página válida e confirmar que ela fica disponível offline. | A linha-base e o cache anterior estão registrados antes do upgrade. |
| SW2. Primeira instalação | Limpar registro e Cache Storage, carregar a origem online, depois tentar abrir a landing e uma rota interna offline. | O cache inicial contém a raiz; a landing visitada abre offline. Uma rota ainda não cacheada não é substituída pela landing. |
| SW3. Respostas HTTP e URLs offline | Solicitar rota válida e rota inexistente, confirmar status e repetir a navegação offline. Conferir também uma URL válida ainda não visitada. | A rota válida visitada pode ser reutilizada; 404/500 não são armazenados; URL inexistente ou sem cache não mostra a landing. Verificar se o host transforma rota inexistente em `200`. |
| SW4. Catálogo estático | Abrir uma rota editorial, um capítulo gerado e um recurso com query string; desconectar e abrir URLs já visitadas. | Cada URL visitada funciona offline conforme a política aprovada. Não presumir que todos os 1.189 capítulos estejam pré-cacheados. |
| SW5. Atualização controlada | Com worker e cache antigos ativos, publicar o novo `sw.js` em Preview. Conferir `installing`, `waiting`, `active`, cache preservado e comportamento de abas abertas. | O worker novo controla a página sem perder páginas offline úteis nem deixar uma versão mista de HTML e bundles. |
| SW6. Falha e rollback | Simular queda durante update e fazer rollback do arquivo/deploy em Preview, comparando com o estado inicial. | Worker/cache antigos continuam utilizáveis quando o update falha; o rollback publica uma versão de `sw.js` que o navegador consegue atualizar sem intervenção manual. |
| SW7. Aprovação | Conferir em navegadores móveis usados pelo público e em uma instalação persistente que já visitou a versão anterior. | Navegação online, offline, atualização e recuperação estão documentadas antes de produção. |

## Compatibilidade e rollback

**Compatibilidade:** não houve troca do cache name nem do formato de URL em Cache Storage. Clientes já controlados pelo worker atual continuam recebendo o worker atualizado pela estratégia normal do navegador. O worker deixa de salvar respostas cujo status não seja sucesso, remove o fallback genérico para `/` e limpa apenas versões anteriores do próprio app. Caches de terceiros na mesma origem são preservados.

**Rollback:** se o Preview mostrar regressão, reverta somente as mudanças em `public/sw.js` ou o deploy que as contém. A alteração não migra dados de cache, então não exige restauração de Cache Storage. Depois de reverter, validar a atualização do worker em um perfil controlado pela versão nova; a distribuição depende do ciclo do navegador, portanto não se deve prometer retorno instantâneo em todas as abas abertas.

## Verificações e limites

- Inspeção estática de `public/sw.js`, `core/registrarServiceWorker.ts`, `app.json`, `vercel.json` e `scripts/gerar-rotas-leitura.js`.
- Durante a frente isolada do service worker, export e navegador offline não foram executados para evitar conflito com as outras frentes.
- Nenhum commit ou deploy foi feito.

## Verificação integrada posterior

- Depois que todas as frentes encerraram suas edições, `npm run export:web` passou e gerou 123 rotas estáticas e 1.189 capítulos.
- `npm run check:static` passou, verificando 23 rotas críticas e 1.312 arquivos HTML.
- Uma verificação posterior do projeto também concluiu `npm run typecheck` sem erros, após correção isolada em telas do app não relacionadas ao service worker.
- Esta correção incremental não teve build, testes nem reprodução offline, conforme o escopo solicitado. Os checkpoints SW1–SW7 continuam necessários para confirmar o comportamento em browser com cache persistente e em Preview Vercel.

## Rodada de isolamento de caches

**Data:** 2026-10-21.

- A ativação do service worker agora remove apenas caches antigos com prefixo `biblia-plataforma-`, mantendo o cache `biblia-plataforma-v1` e preservando caches de outras aplicações na mesma origem.
- A limpeza de desenvolvimento deixa de desregistrar qualquer service worker do navegador. Ela só remove registros cujo script esteja na origem atual e no caminho `/sw.js`, além de caches próprios identificados pelo mesmo prefixo.
- O nome do cache ativo e as chaves armazenadas não mudaram. Não foi feita migração ou exclusão dos dados do app.
- `node --check public/sw.js`, `npm run typecheck` e a validação offline no navegador/Preview ainda precisam ser executados antes de considerar a rodada tecnicamente fechada.

## Rodada de leitura isolada do cache

**Data:** 2026-10-21.

### Achado

O service worker apagava apenas caches com o prefixo do app na ativação, mas consultava `caches.match(request)` nas leituras offline e cache-first. `CacheStorage.match()` pesquisa todos os caches da origem em ordem de criação. Assim, uma resposta com a mesma URL em um cache de outra aplicação na origem poderia ser devolvida pelo worker deste app, apesar de esse cache ser preservado como pertencente a terceiro.

### Correção

Em `public/sw.js`, as buscas de navegação offline e de recursos agora abrem `biblia-plataforma-v1` e consultam apenas esse cache por meio de `Cache.match()`. Escritas, prefixo, nome e política de descarte permanecem iguais. Isso alinha a leitura com o isolamento já aplicado à ativação.

### Verificação e limites

- `node --check public/sw.js`: executado após a correção para validar sintaxe.
- Não foi feita uma reprodução com dois caches concorrentes, browser offline ou Preview. A ausência de colisão entre caches está sustentada pela chamada explícita a `caches.open(CACHE_NAME)` antes de cada leitura; atualização persistente e operação offline seguem pendentes nos checkpoints SW1–SW7.
- Não foram alterados `core/registrarServiceWorker.ts` nem `scripts/verificar-export-estatico.js` nesta rodada. A inspeção integral dos diffs existentes não revelou defeito concreto adicional nesses arquivos.
