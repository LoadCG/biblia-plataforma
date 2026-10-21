# Inventário de rotas e checkpoints de migração

**Revisão inicial:** 2026-10-20
**Atualização integrada:** 2026-10-20

**Escopo:** inventário de rotas Expo Router, URLs legadas, redirecionamentos e exportação estática. Auditoria de navegação interna fora da landing e de `core/content/temasEvangelisticos.ts`. Nenhuma rota foi migrada.

Este documento complementa `docs/PLANEJAMENTO-LANDING-EVANGELISMO.md`. É uma fotografia do código encontrado nesta revisão, não uma decisão de migrar as rotas nem autorização para publicação.

## 1. Resumo verificável

- A web abre a landing em `/`, via `app/index.web.tsx` e `components/LandingEvangelismo.web.tsx`. A entrada nativa usa `app/index.tsx` e redireciona para `/biblia`.
- O grupo `app/(tabs)` não aparece no endereço público. Suas rotas ficam no shell de abas definido em `app/(tabs)/_layout.tsx`.
- `/biblia` é a tela inicial do app. `/leitura` abre o fluxo de leitura, retomando o último capítulo ou mostrando o seletor. Os capítulos têm URL canônica `/leitura/:livro/:capitulo`.
- O código mantém rotas de compatibilidade `/biblia/escolher...` e `/biblia/:livro/:capitulo`, além de redirecionamentos Vercel para URLs antigas de capítulo e escolha.
- A exportação web é estática. O build configurado no Vercel gera conteúdo, exporta as páginas Expo e cria 1.189 arquivos de capítulo para 66 livros.
- A auditoria de links não encontrou caminho interno comprovadamente quebrado no escopo. Nenhuma alteração de código foi necessária.

## 2. Inventário de rotas Expo Router

Os grupos entre parênteses são organizacionais e não fazem parte da URL. Segmentos entre colchetes são dinâmicos.

| URL pública atual | Arquivo ou origem | Papel observado |
|---|---|---|
| `/` | `app/index.web.tsx` | Landing evangelística somente na web. |
| `/` no app nativo | `app/index.tsx` | Redireciona para `/biblia`. |
| `/biblia` | `app/(tabs)/biblia.tsx` | Home do app, primeira aba. |
| `/leitura` | `app/(tabs)/leitura/index.tsx` | Retoma a última leitura local ou encaminha para escolher livro. |
| `/leitura/escolher` | `app/(tabs)/leitura/escolher/index.tsx` | Seleção de livro e capítulo. |
| `/leitura/escolher/:livro/:capitulo` | `app/(tabs)/leitura/escolher/[livro]/[capitulo].tsx` | Seleção de intervalo/versículos associada a um capítulo. |
| `/leitura/:livro/:capitulo` | `app/(tabs)/leitura/[livro]/[capitulo].tsx` | Leitura de capítulo; também é o padrão produzido pelo gerador estático. |
| `/pesquisa` | `app/(tabs)/pesquisa.tsx` | Pesquisa e descoberta. |
| `/voce` | `app/(tabs)/voce.tsx` | Perfil e progresso local. |
| `/biblia/:livro/:capitulo` | `app/(tabs)/biblia/[livro]/[capitulo].tsx` | Alias Expo que redireciona para `/leitura/:livro/:capitulo`. |
| `/biblia/escolher` | `app/(tabs)/biblia/escolher/index.tsx` | Alias Expo que redireciona para `/leitura/escolher`. |
| `/biblia/escolher/:livro/:capitulo` | `app/(tabs)/biblia/escolher/[livro]/[capitulo].tsx` | Alias Expo que redireciona para `/leitura/escolher/:livro/:capitulo`. |
| `/ajuda` | `app/ajuda.tsx` | Ajuda e atalhos de navegação. |
| `/configuracoes` | `app/configuracoes.tsx` | Preferências e dados locais. |
| `/conhecer` | `app/conhecer/index.tsx` | Hub de leituras introdutórias e temas. |
| `/conhecer/jesus` | `app/conhecer/jesus.tsx` | Estudo introdutório sobre Jesus. |
| `/conhecer/biblia` | `app/conhecer/biblia.tsx` | Estudo introdutório sobre a Bíblia. |
| `/conhecer/salvacao` | `app/conhecer/salvacao.tsx` | Estudo introdutório sobre salvação. |
| `/conhecer/temas/:tema` | `app/conhecer/temas/[tema].tsx` | Página editorial para um tema. Nesta versão, abre leitura, sem envio de formulário. |
| `/estatisticas` | `app/estatisticas.tsx` | Resumo de atividade de leitura. |
| `/medalhas` | `app/medalhas.tsx` | Conquistas locais, com parâmetros opcionais de origem/detalhe. |
| `/onboarding` | `app/onboarding.tsx` | Apresentação inicial do app nativo. |
| `/planos` | `app/planos/index.tsx` | Catálogo de planos. |
| `/planos/:id` | `app/planos/[id].tsx` | Detalhe de plano. |
| `/privacidade` | `app/privacidade.tsx` | Explicação sobre dados locais. |
| `/resumos` | `app/resumos/index.tsx` | Catálogo de resumos. |
| `/resumos/:livro` | `app/resumos/[livro].tsx` | Resumo de um livro. |
| `/salvo` | `app/salvo.tsx` | Versículos, notas e itens guardados. |
| `/sobre` | `app/sobre.tsx` | Informações do app e da metodologia. |

`app/_layout.tsx` envolve as rotas com o shell global, tema, status da splash no nativo, onboarding e `Toast`. `app/+html.tsx` define o documento HTML web compartilhado. A presença de páginas do app em caminhos de topo é atual e intencionalmente não foi alterada nesta tarefa.

## 3. URLs legadas e redirects

O arquivo `vercel.json` configura `cleanUrls: true` e `trailingSlash: false`, e contém estes redirects permanentes (`permanent: true`):

| Origem legada | Destino | Evidência |
|---|---|---|
| `/biblia/escolher` | `/leitura/escolher` | `vercel.json`, primeira regra. |
| `/biblia/escolher/:livro/:capitulo` | `/leitura/escolher/:livro/:capitulo` | `vercel.json`, segunda regra. |
| `/biblia/:livro/:capitulo.html` | `/leitura/:livro/:capitulo` | `vercel.json`, terceira regra, mantém compatibilidade com extensão antiga. |
| `/biblia/:livro/:capitulo` | `/leitura/:livro/:capitulo` | `vercel.json`, quarta regra. |

Existem também aliases implementados em Expo Router, listados na seção anterior. Os redirects de hospedagem e os aliases da aplicação são camadas distintas. A precedência efetiva deve ser conferida em Preview Deploy antes de uma mudança que altere padrões ou ordem das regras.

Não há redirects no Vercel para mover `/planos`, `/resumos`, `/pesquisa`, `/voce`, `/salvo`, `/configuracoes`, `/ajuda`, `/privacidade`, `/sobre`, `/estatisticas` ou `/medalhas`. Essas rotas continuam publicadas nos caminhos atuais. Uma migração futura sob `/biblia/...` exige mapear cada rota e decidir aliases permanentes; não se deve supor que a raiz ou uma página genérica cubra os caminhos removidos.

## 4. Exportação e publicação

Evidências de configuração e geração:

1. `package.json` define `export:web` como exportação Expo para web com limpeza do diretório, seguida de `scripts/gerar-rotas-leitura.js`.
2. O comando configurado em `vercel.json` executa `scripts/gerar-conteudo.js`, `npx expo export --platform web --clear` e o gerador de rotas de leitura. A pasta publicada é `dist`.
3. `app.json` configura `web.output` como `static` e `expo-router.asyncRoutes.web` como `true`.
4. `scripts/gerar-rotas-leitura.js` percorre `assets/biblia.json` e grava um HTML por livro/capítulo sob `dist/leitura/:slug/:capitulo.html`.
5. Leitura somente dos dados locais nesta revisão: `assets/biblia.json` tem 66 livros e 1.189 capítulos. A contagem foi calculada em memória com Node, sem gerar arquivos.
6. `scripts/verificar-export-estatico.js` verifica rotas de landing, estudos, temas, alguns resumos e planos, metadados, favicon e a existência de todos os 1.189 HTML de capítulos. Esse verificador requer um export existente, portanto não foi executado nesta revisão para evitar concorrer com outros trabalhos no diretório `dist`.
7. `public/sw.js` usa navegação network-first e recorre ao cache da rota solicitada ou `/` em falha de rede. O cache tem nome `biblia-plataforma-v1`; ao ativar, remove caches com outro nome. Uma alteração de raiz/fallback tem impacto em visitantes que já instalaram o service worker.

O script `scripts/servir-export-estatico.js` permite servir um diretório de export local e tenta arquivo direto, arquivo com `.html` e `index.html`. Isso é conveniência de desenvolvimento, não prova suficiente de precedência de redirects no Vercel.

## 5. Auditoria de links internos

### Método e limite

Foram enumerados arquivos de rota e examinadas ocorrências de `href`, `router.push` e `router.replace` em `app`, `components` e `core`, excluindo `components/LandingEvangelismo.web.tsx` e `core/content/temasEvangelisticos.ts`, conforme o escopo. Caminhos estáticos foram comparados com rotas da seção 2; caminhos parametrizados foram comparados com rotas dinâmicas e dados de plano/livro. Redirects Expo e Vercel foram considerados válidos quando correspondem à rota de destino existente.

### Resultado

Nenhum link interno comprovadamente quebrado foi identificado. Exemplos confirmados:

- links de tab `/biblia`, `/leitura`, `/pesquisa` e `/voce` têm páginas correspondentes no grupo `(tabs)`;
- atalhos `/leitura/escolher`, `/planos`, `/resumos`, `/salvo`, `/configuracoes`, `/ajuda`, `/privacidade`, `/sobre`, `/estatisticas` e `/medalhas` têm rotas correspondentes;
- links dinâmicos de resumo usam `/resumos/:livro`, e os de plano usam `/planos/:id`;
- navegação antiga para `/biblia/escolher...` e `/biblia/:livro/:capitulo` tem aliases Expo e regras permanentes Vercel para o padrão atual;
- links editoriais de referências usam `/leitura/:livro/:capitulo`, rota definida e gerada pelo export.

**Alterações de links nesta revisão: nenhuma.** O relatório não afirma que todos os valores dinâmicos possíveis foram visitados em navegador. Também não valida resposta HTTP de produção, query strings sob redirects, comportamento de botão Voltar em plataforma nativa, nem a exportação atual em `dist`.

## 6. Roadmap de migração com checkpoints

Nenhum checkpoint abaixo foi executado. Estes critérios são uma proposta de controle para eventual reorganização, pois a migração não faz parte da tarefa atual.

| Checkpoint | Entrega verificável | Critério de qualidade para avançar |
|---|---|---|
| R0. Congelar o mapa atual | Revisar e aprovar este inventário, incluir rotas omitidas e decidir se páginas públicas atuais serão preservadas. | Cada URL pública conhecida tem dono editorial/técnico e política explícita: manter, mover, redirecionar ou retirar. |
| R1. Definir canônicos | Aprovar `/` landing, `/biblia` home do app, `/leitura` entrada do leitor, padrão de capítulo e prefixo futuro para páginas do app. | Nenhuma URL tem dois significados; web e nativo têm comportamento documentado; formato de slug/capítulo está fixo. |
| R2. Matriz legado → canônico | Incluir aliases de capítulos, seletores, planos, resumos, busca, perfil, configurações e páginas auxiliares, com parâmetros que precisam sobreviver. | Para cada URL antiga há destino ou justificativa de retirada; query relevante e histórico de links são considerados. |
| R3. Prova técnica isolada | Testar a proposta em branch/preview, sem substituir a produção. Conferir Expo Router SDK 57, export estático, Vercel e service worker. | Saída `dist` contém uma página por caminho canônico; os redirects não fazem loop nem capturam rotas novas; `/` não vira fallback para erro. |
| R4. Compatibilidade de navegação | Abrir rotas direto, atualizar, usar Voltar/Avançar, navegar de links internos e simular acesso a URL antiga. | Links internos apontam para canônicos novos; aliases preservam capítulo, livro e parâmetros aceitos; sem rota vazia ou tela sem saída. |
| R5. Verificação web e nativa | Conferir em Preview e em build nativo, incluindo onboarding, abas, tema, leitor, dispositivos móveis e acessibilidade básica. | A raiz web continua landing; entrada nativa continua `/biblia`; leitor retoma/escolhe conforme produto aprovado; teclado e leitor de tela operam. |
| R6. Service worker e retorno | Testar primeira visita, atualização após uma versão antiga, modo offline e falha de rota. Ensaiar rollback do Preview/produção. | Visitante online recebe nova versão; offline recebe apenas conteúdo apropriado; página inexistente não apresenta landing como se fosse destino válido. |
| R7. Revisão e autorização | Revisar SEO, links externos, conteúdo, privacidade, domínio e responsáveis. | Plano de redirects aprovado; URL canônica, metadados e titular definidos; produção só após autorização de quem responde pelo site. |

### Critérios mínimos de qualidade técnica

- Não mudar em lote rotas do Expo Router sem preservar os nomes de rota e grupos de navegação onde forem necessários.
- Redirects devem ser permanentes apenas quando a mudança canônica estiver aprovada; Preview deve demonstrar ausência de loop e destino correto.
- Cobrir cada rota estática em verificação automatizada ou lista equivalente, incluindo slugs e capítulos; não depender de uma única página inicial como prova.
- Testar URLs antigas diretamente, não somente a navegação interna, e confirmar códigos/status e URL final no Preview Vercel.
- Preservar query parameters que tenham significado, como capítulo/versículo, origem da navegação ou plano ativo, apenas quando o destino os suporta.
- Revisar `public/sw.js`: atualização, cache de navegação e fallback são comportamento de produto, não apenas detalhe de build.
- Separar evidência de build local da evidência do roteamento Vercel; export estático não comprova regras de redirects em produção.
- Repetir validação de entrada nativa e web. O mesmo arquivo de índice tem implementações por plataforma.

## 7. Verificações executadas e não executadas

| Verificação | Resultado | Limite |
|---|---|---|
| Leitura de `app` e configuração de rotas | Concluída por inspeção de fontes e arquivos de rota. | Inspeção estática não executa navegação. |
| Auditoria de referências `href`/`router` no escopo | Nenhuma quebra comprovada. | Rotas com parâmetros não foram exaustivamente percorridas por navegador. |
| Contagem da Bíblia em `assets/biblia.json` | 66 livros, 1.189 capítulos. | Não comprova que `dist` atual contém os arquivos. |
| Exportação/build (`npm run export:web`) | **Estado integrado mais recente: passou**, gerando 123 rotas estáticas e 1.189 capítulos. | Exportação local não comprova precedência de redirects do Vercel em produção. |
| Verificador (`npm run check:static`) | **Estado integrado mais recente: passou**, conferindo 23 rotas críticas e 1.312 arquivos HTML. | Verifica artefatos estáticos locais, não respostas HTTP da implantação. |
| Typecheck (`npm run typecheck`) | **Estado integrado mais recente: passou sem erros**, após correções independentes em `app/(tabs)/biblia.tsx` e `app/(tabs)/leitura/[livro]/[capitulo].tsx`. | O registro anterior de falha abaixo é histórico e foi superado por esta execução integrada. |
| Testes automatizados | Não executados. | Fora da verificação somente documental solicitada. |
| Verificação de espaços finais no relatório | Concluída após salvar este arquivo. | Confirma formatação básica, não semântica do conteúdo. |

### Estado atual integrado

Na integração de 2026-10-20, exportação, verificador estático e typecheck passaram conforme os resultados acima. A revisão inicial deste inventário não executou o verificador e registrou uma falha de typecheck; esses apontamentos descrevem corretamente aquela etapa, mas não são o resultado vigente. Permanecem pendentes a validação de redirects e respostas HTTP em Preview Vercel, teste offline do service worker e aprovação da matriz de URLs antes de qualquer migração.
