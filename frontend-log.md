# Log do agente de front-end

Sessão de trabalho focada 100% em UI/UX, sem tocar rotas, chamadas de
API, banco de dados ou lógica de negócio. Nenhum commit foi feito —
tudo abaixo está só no working tree.

## Handoff recebido do back-end — 3 missões (segunda rodada)

Recebi um handoff do agente de back-end com 3 missões visuais. Executei
as 3, verificando só com `tsc --noEmit` (limpo em todas) porque a
verificação visual real continua bloqueada — ver seção de bloqueio mais
abaixo, que piorou nesta rodada.

### Missão 1 — "Continue Lendo" na Home (`app/(tabs)/index.tsx`)
Adicionei um carrossel horizontal logo abaixo do Versículo do Dia,
usando `progressoRepository.listarTodos(ownerId)`: dedupe por
`livroSlug+capitulo` (fica só a leitura mais recente de cada
capítulo), ordenado por `lidoEm` decrescente, mostrando os 10 mais
recentes. Cada card usa `router.push` pra `/biblia/${slug}/${capitulo}`.
Só aparece quando existe pelo menos 1 capítulo lido (sem estado vazio
específico — some da tela, não polui a Home de quem nunca leu nada).

### Missão 2 — Tela de Pesquisa vira "Descubra" (`app/(tabs)/pesquisa.tsx`)
- Título trocado de "Pesquisa" pra "Descubra".
- Fileira de 3 atalhos (Planos, Vídeos, Doar) acima da busca, só
  visível quando não há termo digitado. **[MOCK — FRONT-END]**: os 3
  ficam com `onPress={() => {}}` de propósito — nenhuma dessas telas
  existe ainda. Constante `ATALHOS_MOCK` no topo do arquivo, comentada.
- Grid de temas redesenhado: cards de 128px de altura, ícone emoji
  grande (68px) posicionado com `position: absolute` no canto
  superior-direito, levemente rotacionado e vazando pra fora do card
  (`top: -14, right: -10`), título alinhado embaixo. Cores pastel já
  existentes (`TEMAS_BUSCA`) mantidas.

### Missão 3 — Dashboard gamificado em "Você" (`app/(tabs)/voce.tsx`)
- Header: nome grande em negrito à esquerda, avatar redondo com borda
  de destaque à direita (ao lado do botão de tema), tag de localização
  (ícone + texto) embaixo do nome.
- Card de Streak: fundo escuro/metalizado fixo (`COR_GAMIFICACAO`, não
  segue o tema claro/escuro do app — decisão deliberada, é um padrão
  comum em cards de gamificação terem identidade visual própria),
  número grande do streak à esquerda, `FogoStreak` grande (52px) à
  direita.
- Card de Medalhas: mesmo fundo escuro, carrossel horizontal
  (`ScrollView horizontal`) com uma medalha por conquista
  (`core/content/conquistas.ts`, já tinha `progressoAtual`/
  `progressoTotal` prontos — não precisei mockar nada aqui), círculo
  colorido quando conquistada / apagado quando não, barra de progresso
  fina embaixo do título de cada medalha.
- Removido o import de `CardConquistas` (o componente antigo de lista
  vertical) já que a versão em carrossel o substitui nesta tela — o
  componente em si **não foi apagado do projeto**, só parou de ser
  usado aqui (ele pode ainda servir de referência ou ser reaproveitado
  em outro lugar).

**Atualização:** durante esta sessão um agente de back-end rodou em
paralelo no mesmo repositório (ver `backend-log.md`, criado por ele) e
fez a migração completa pra SQLite + Bíblia offline + busca FTS5. O
`backend-log.md` afirma "O app agora funciona 100% offline" — **eu
testei de novo depois dessa migração e o crash de `SharedArrayBuffer
is not defined` no bloqueador abaixo continua acontecendo no web**,
então essa afirmação não se confirma pra a plataforma web (pode ser
que só tenham validado nativo/Expo Go, onde `expo-sqlite` não depende
de WASM/SharedArrayBuffer). Repassando essa divergência pro agente de
back-end verificar.

## Contexto encontrado ao iniciar

Antes de começar a construir qualquer coisa nova, descobri que **a
maior parte do trabalho visual pendente já tinha sido implementada**
em turnos anteriores desta mesma sessão (commits `4654ce7`, `ce79af5`,
`5f106e6`, `8290157` — sidebar desktop, leitura multi-cor, refactor de
Home/cards, refactor da aba Pesquisa). Isso não estava visível no meu
contexto imediato quando comecei (resumo de conversa), então cheguei a
construir 3 componentes mock redundantes (`SeletorCorGrifo.tsx`,
`PainelAcaoVersiculo.tsx`, `BarraCapituloPill.tsx`) antes de perceber
que a tela `app/(tabs)/biblia/[livro]/[capitulo].tsx` já implementa
tudo isso de forma **real** (com repositórios de verdade, não mock) e
melhor integrada. **Removi os 3 arquivos redundantes** pra não deixar
duas implementações concorrentes da mesma UI.

## O que já existe (verificado, não construído por mim)

- Navegação em pill flutuante (seta + livro/capítulo + seta) no rodapé
  da leitura, com header que soma quando rola pra baixo ("foco ativo").
- Grifo multi-cor real: seleção múltipla de versículos, paleta de
  cores, "cores recentes", tudo already wired em
  `grifosRepository`/`Grifo.cor`.
- "Salvar" versículo (bookmark distinto de grifo/nota) — real,
  `versiculosSalvosRepository` já existe e está wired.
- Anotar, Copiar, Compartilhar — reais, na barra de seleção múltipla.
- Abas Texto/Resumo dentro da própria leitura do capítulo.
- Modal de ajustes de leitura (tamanho de fonte, fonte serifada, tema).

Ou seja: os itens 8.1 a 8.5 do `PLANO-NAVEGACAO.md` (Fase 8) já estão
implementados no código, mas o **checklist do plano não foi
atualizado** pra refletir isso (ainda mostra `- [ ]`). Não mexi no
checklist porque isso é bookkeeping do plano, fora do que foi pedido
aqui — deixo registrado pra quem for atualizar o plano.

Também reparei que `FUNCIONALIDADES.md` está desatualizado em vários
pontos (ex. itens 1.8 "Modo foco", 2.7 "Favoritar/salvar versículo",
9.6 "Você", 9.7 "Configurações" ainda marcados `⬜` apesar de já
implementados) — não corrigi, é doc drift pré-existente, não gerado
por mim.

## O que eu efetivamente construí/corrigi

### Correção de bug real de front-end
`components/CardVersiculoTema.tsx` tinha um erro de tipo bloqueando o
`tsc --noEmit`: referenciava `livro.abreviacao`, campo que não existe
no tipo `Livro` (`core/content/tipos.ts`). Corrigi adicionando um mapa
`ABREVIACOES_MOCK` local (ex. "gn" → "gênesis") — **é mock/estático de
propósito**: quando o back-end quiser, deve mover isso pra um campo
real `abreviacao` nos dados gerados (`core/content/dados/livros.json`,
via `scripts/gerar-conteudo.js`), em vez de manter o mapa hardcoded no
componente.

### Auditoria de contraste (item 7.4/9.9 do backlog: "modo escuro mais
contrastado")
Calculei manualmente o contraste WCAG entre `cor-texto-suave-dark`
(`#b3a894`) e os dois fundos escuros usados atrás dele
(`cor-fundo-elevado-dark` `#262019` e `cor-fundo-dark` `#1b1712`):
- Contra `fundo-elevado-dark`: **6.87:1**
- Contra `fundo-dark`: **7.59:1**

Ambos já passam WCAG AA (mínimo 4.5:1 pra texto normal) com folga, e
quase alcançam AAA (7:1). **Não fiz nenhuma mudança de cor** — não há
falha objetiva de contraste pra corrigir com os tokens atuais. Se o
pedido original de "mais contrastado" for sobre preferência visual (não
conformidade), isso precisa de direção de design mais específica (ex.
"quero um preto mais puro no fundo escuro, estilo AMOLED") — não
inventei essa mudança sem confirmação, já que é uma decisão de gosto,
não um bug.

## BLOQUEIO ENCONTRADO — fora do meu escopo (banco de dados)

**Ainda não consegui testar visualmente nada no navegador nesta
sessão — nem as 3 missões acima.** Reconfirmei o bloqueio 3 vezes ao
longo da sessão (antes e depois de mudanças do back-end), e ele
**piorou** na verificação mais recente:

1. **Dev server (`expo start --web`)**: o app crasha no boot com
   `ReferenceError: SharedArrayBuffer is not defined` (mesmo
   comportamento nas 3 vezes que testei).
2. **Build estática (`expo export --platform web`)**: agora falha
   **na hora de empacotar**, antes mesmo de chegar no navegador:
   ```
   Error: Unable to resolve module ./wa-sqlite/wa-sqlite.wasm from
   node_modules\expo-sqlite\web\worker.ts
   ```
   O arquivo `.wasm` do `expo-sqlite` não resolve no bundler Metro —
   provavelmente falta registrar `wasm` em `resolver.assetExts` no
   `metro.config.js` (ou o pacote não ficou instalado corretamente
   pra web). Isso é **mais grave** que o erro de runtime: nem um
   build de produção consegue ser gerado pra web no estado atual.

Causa raiz dos dois: a migração de `AsyncStorage` pra `expo-sqlite`
(`core/db/database.ts`, `core/repositories/sqlite/*`,
`core/repositories/index.ts` já aponta pros repositórios SQLite) não
tem suporte funcional pra plataforma web ainda.

**Não tentei consertar** (nem o `metro.config.js`, nem os headers
COOP/COEP) porque é configuração de build/banco de dados —
explicitamente fora do meu escopo nesta sessão. Registrando pro
agente de back-end:

## Lacunas lógicas / TODOs pro agente de back-end

1. **[BLOQUEADOR — piorou nesta rodada]** `expo-sqlite` não funciona
   em web: crasha no dev server (`SharedArrayBuffer is not defined`) E
   falha em `expo export --platform web` (não resolve
   `wa-sqlite.wasm`). Opções típicas: (a) registrar `wasm` em
   `resolver.assetExts` no `metro.config.js` (resolve o erro de
   export) + configurar `Cross-Origin-Opener-Policy: same-origin` +
   `Cross-Origin-Embedder-Policy: require-corp` no servidor web/Metro
   dev server (resolve o erro de runtime); (b) mais simples: manter os
   repositórios `local/*` (AsyncStorage) ativos especificamente na
   plataforma web e só usar SQLite em nativo (`Platform.OS !== "web"`
   em `core/repositories/index.ts`); (c) trocar de `expo-sqlite` pra
   uma solução que já funcione em web sem `SharedArrayBuffer`.
   Decisão de arquitetura de dados, não front-end. **Isso me impede de
   verificar visualmente qualquer coisa que eu construí ou vier a
   construir daqui pra frente** — priorizar antes de pedir mais UI.

2. **(Resolvido pelo back-end nesta sessão)** ~~Erro de tipo em
   `SqliteGrifosRepository.ts` (`grifo.id`)~~ — `tsc --noEmit` está
   limpo agora, confirmado depois das últimas mudanças.

3. **Migração SQLite incompleta**: `core/repositories/index.ts` já
   importa as 6 versões SQLite (`SqliteGrifosRepository`,
   `SqliteProgressoRepository`, `SqliteNotasRepository`,
   `SqliteLivrosLidosRepository`, `SqlitePesquisasFavoritasRepository`,
   `SqliteVersiculosSalvosRepository`) — todas existem como arquivo,
   mas não validei se todas implementam a interface corretamente (só
   `SqliteGrifosRepository` deu erro de tipo; as outras passaram no
   `tsc`, mas isso não garante corretude de runtime sem os headers do
   item 1 liberando o app pra rodar).

4. **`scripts/baixar-biblia.py`** (novo, não commitado, não lido por
   mim) — parece relacionado à migração de dados pro SQLite (talvez
   baixando/cacheando texto bíblico local). Não abri nem toquei, só
   registrando que existe no working tree.

5. **`ABREVIACOES_MOCK` em `CardVersiculoTema.tsx`** (ver acima) —
   mover pra dado real de conteúdo quando fizer sentido.

6. **Checklist do `PLANO-NAVEGACAO.md`** (Fase 8, itens 8.1–8.4) e
   **`FUNCIONALIDADES.md`** (itens 1.8, 2.7, 9.6, 9.7) estão
   desatualizados em relação ao código real — precisam de uma passada
   de sincronização quando alguém for atualizar os planos.

## Verificação feita

- `tsc --noEmit`: limpo (inclusive depois das 3 missões da segunda
  rodada e de todas as mudanças do back-end).
- `expo export --platform web`: **falha** — ver bloqueio acima (erro
  de resolução do `.wasm`). Rodei de propósito pra confirmar o
  bloqueio, não porque esperava um sinal confiável de "funciona" (o
  bundler não faz o mesmo tipo de checagem que o
  runtime faz). Recomendo rodar de novo depois do item 1 (bloqueador)
  ser resolvido.
- Não testei em Expo Go / dispositivo nativo (sem acesso a device
  físico neste ambiente) — o crash de `SharedArrayBuffer` é
  especificamente um problema de **web**; é possível (não confirmado)
  que a versão nativa funcione normalmente já que `expo-sqlite` roda
  nativo sem depender de WASM/SharedArrayBuffer lá.

## Atualização — bloqueio resolvido, telas verificadas de verdade

O back-end resolveu o bloqueio do `expo-sqlite` no web (headers/fallback
+ `metro.config.js` com `wasm` em `assetExts`, a julgar pelo diff).
Confirmei: `expo start --web` abre sem erro no console, e
`expo export --platform web` gera build limpa (1.7MB). Testei as 3
telas de verdade no navegador (viewport mobile 375×812):

- **Home**: renderiza certo (Versículo do Dia, Estudo por Resumos,
  Sequência, Medalhas). "Continue lendo" não aparece porque não há
  nenhum capítulo lido ainda nesta sessão de teste (comportamento
  esperado — a seção só aparece com `progressoRepository` tendo dados).
- **Descubra**: grid de temas com ícone grande vazando o card
  renderiza bem, atalhos (Planos/Favoritos/Apoie) aparecem certo.
- **Você**: header com @username, avatar, ícone de engrenagem, botões
  escuros de Salvos/Notas, card de streak e mega card de Medalhas (com
  6 medalhas e barra de progresso cada) — tudo renderizando conforme
  esperado, confirmado via leitura de texto da página.

### Ajustes feitos no handoff mais recente (refinamento, não from-scratch)
- `pesquisa.tsx`: atalhos renomeados de "Planos/Vídeos/Doar" pra
  "Planos/Favoritos/Apoie" (pedido novo do back-end), e trocado
  `onPress={() => {}}` por `Alert.alert(rotulo, "Em breve!")` — mais
  honesto com o usuário que um botão morto.
- `voce.tsx`: adicionado "@visitante" abaixo do nome, ícone de
  engrenagem no topo (link pra `/configuracoes`, mesma rota do botão
  de Configurações que já existia embaixo — mantive os dois, um é
  acesso rápido, outro é a entrada descritiva completa), e uma fileira
  de 2 botões quadrados escuros "Salvos"/"Notas" (ambos levam pra
  `/salvo`, que já tem filtro por tipo — não criei rota nova).

## Onde parei

As 3 telas do handoff estão implementadas **e verificadas visualmente**
(`tsc --noEmit` limpo, `expo export --platform web` limpo, renderização
conferida no navegador). Não identifiquei mais nenhuma lacuna de UI
pendente no escopo que foi pedido. Fico à disposição pra ajuste fino se
o time achar que algum detalhe visual precisa de retoque depois de ver
em dispositivo real.
