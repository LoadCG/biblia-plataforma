# Changelog

Todas as mudanças notáveis feitas no projeto serão documentadas neste arquivo.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased] - 2026-08-20

### Corrigido (repositório tornado público)
- **`.gitignore`**: adicionado `PROMPT-CONTINUACAO.md` (arquivo
  temporário de transferência de contexto entre sessões de IA, notas
  internas de trabalho — nunca deveria ser commitado, ficou de fora
  por sorte até agora).
- **`README.md` desatualizado sobre a arquitetura de dados**: dizia
  que a busca full-text usava "SQLite FTS5" e que o motor de biblia era
  "fetch/cache da bible-api.com", mas isso descreve só o nativo — o web
  usa busca em memória sobre JSON embutido e persistência via
  AsyncStorage (não SQLite), com a API externa como fallback só se a
  busca local falhar (ver 2026-08-19, item 7.3). Corrigido pra
  descrever os dois caminhos corretamente. Também atualizada a árvore
  de diretórios (faltavam `resumos/`, `medalhas.tsx`, `sobre.tsx`).

### Adicionado (backlog de UI, itens 1/3/5 por ordem de impacto)
- **Título "Você" na aba de perfil** (`FUNCIONALIDADES.md` 9.6): era
  a única das 4 abas principais sem rótulo identificando a tela.
  Adicionado no mesmo padrão de "Descubra" (`text-2xl font-bold`).
- **Barra de progresso no card "Estudo por Resumos" da Início**
  (`FUNCIONALIDADES.md` 3.1): antes só texto ("X de 66 livros lidos"),
  agora com barra fina abaixo, mesmo padrão visual de Planos. Testado
  ao vivo: trilho de 231px, preenchimento proporcional aos livros lidos.
- **Hierarquia visual do cabeçalho da leitura de capítulo**
  (`FUNCIONALIDADES.md` 2.2): título aumentado de 20px pra 24px e
  `border-b` separando o cabeçalho do conteúdo — os 3 blocos do topo
  (abas, título, "marcar como lido") estavam sem separação visual
  clara. Testado ao vivo (tamanho de fonte confirmado via
  `getComputedStyle`).

### Adicionado (pedido explícito do usuário)
- **Atalho de tema no cabeçalho da leitura de capítulo**
  (`FUNCIONALIDADES.md` 1.6b): segunda instância do `BotaoTema` direto
  no cabeçalho de `app/(tabs)/biblia/[livro]/[capitulo].tsx`, ao lado
  do botão "Aa" e do ícone de áudio — antes só dava pra trocar de tema
  durante a leitura abrindo o modal de ajustes primeiro. Testado ao
  vivo em largura mobile (375px): cabe sem gerar rolagem horizontal.

### Adicionado (itens "não óbvios" achados fora do plano)
- **Tela dedicada de escolher versículo** (`TODO.md` item J,
  `FUNCIONALIDADES.md` 2.2b): reconstruída depois de achar uma
  inconsistência real na documentação — o `TODO.md` listava essa tela
  como "feito", mas ela tinha sido removida em 2026-08-11 por um bug
  (buscava o texto usando o slug da URL em vez do nome do livro) e
  nunca foi reconstruída. Nova versão em
  `app/(tabs)/biblia/escolher/[livro]/[capitulo].tsx`, corrigindo o bug
  original (resolve o livro via `obterLivro(slug)` primeiro). Grade
  reaproveita `components/GradeCapitulos.tsx` (generalizado com uma
  prop `rotulo` opcional e um novo `onSelecionarLongo`), acessível por
  toque longo numa célula de capítulo na tela de Livros — toque simples
  continua abrindo a leitura, sem mudar o comportamento padrão. Testado
  ao vivo: grade certa (6 versículos de Salmos 23), toque simples e
  toque longo simulado via eventos de ponteiro navegando pros lugares
  certos.
- **Modo escuro AMOLED (9.9)**: decisão do usuário — fica fechado por
  ora (não é bug de acessibilidade, é só uma ideia de tema sem direção
  de design definida). Marcado como `✅` (investigado, sem ação
  necessária) em vez de `🔶` em `FUNCIONALIDADES.md`, mesmo padrão das
  outras decisões já fechadas.

### Corrigido (auditoria pontual de UI/navegação)
- **Contraste ruim nas pílulas de filtro da tela Salvo**
  (`app/salvo.tsx`): filtro selecionado usava `bg-cor-destaque(-dark)`
  (dourado claro no modo escuro) com `text-white` em cima — ~2,1:1 de
  contraste, o mesmo padrão de bug já corrigido antes em outros
  lugares (botão "Baixar" da leitura, card "Estudo por Resumos"), só
  que reintroduzido aqui. Corrigido pro mesmo padrão:
  `text-white dark:text-cor-texto`. Testado ao vivo: fundo
  `rgb(224,167,94)` com texto `rgb(42,36,28)` agora, contraste bom.
- **Link "Voltar para todos os livros" incorreto no resumo de um
  livro** (`app/resumos/[livro].tsx`): apontava pra `/` (Início) em
  vez de `/resumos` (a lista real de resumos), tanto no estado normal
  quanto no de "livro não encontrado". Corrigido nos dois lugares.
  Testado ao vivo, `href` confirmado como `/resumos`.

### Adicionado
- **Gerar imagem de versículo no nativo** (`TODO.md` item A,
  `FUNCIONALIDADES.md` 5.2): antes só funcionava no web (Canvas API).
  Instalado `react-native-view-shot` e `expo-sharing`. Criado
  `components/CartaoVersiculoImagem.tsx` — mesmo cartão visual do web
  (gradiente + Georgia + cores de marca), mas como `View` de verdade
  (usa `expo-linear-gradient`, já era dependência), renderizada fora
  da tela e capturada via `captureRef` assim que monta com o texto
  certo. O botão "Imagem" na leitura agora aparece em toda plataforma
  (antes só no web); o modal de preview ganhou "Compartilhar" (via
  `Sharing.shareAsync`) no lugar de "Baixar" quando não é web.
  Reverificado ao vivo que o caminho web continua funcionando igual
  depois da refatoração (canvas 1080×1080 real, PNG baixado). O
  caminho nativo em si não pôde ser testado ao vivo neste ambiente
  (sem dispositivo/simulador nativo disponível, só navegador) — só
  `tsc`/`jest` limpos e revisão de código.

### Corrigido
- **Acessibilidade — `accessibilityRole` faltando em dezenas de
  `Pressable`** (`TODO.md` item B, `FUNCIONALIDADES.md` 7.2): auditoria
  de todo `Pressable` das telas principais e componentes
  compartilhados (~24 arquivos, 100+ ocorrências) achou que a maioria
  já tinha `accessibilityLabel` de uma passada anterior, mas faltava
  `accessibilityRole` — sem role, leitor de tela não anuncia o
  elemento como interativo. Adicionado `role="button"/"link"/"tab"`
  em ~70 elementos, e três controles que eram toggles sem anunciar
  estado ("Fonte serifada", "Lembrete diário", "Favoritar busca",
  "Marcar livro como lido") ganharam `role="switch"/"checkbox"` +
  `accessibilityState` + a prop achatada equivalente
  (`accessibilityChecked`/`accessibilitySelected`, necessária nesta
  versão do react-native-web — ver achado técnico já documentado em
  `FUNCIONALIDADES.md` 7.2). Testado ao vivo no DOM (aria-checked/
  aria-selected corretos e reagindo a clique). Segue faltando teste
  com leitor de tela real (VoiceOver/NVDA) e foco visível por
  teclado.

## [Unreleased] - 2026-08-19 (continuação 6)

### Investigado (sem mudança de código em produção)
- **Foco visível em navegação por teclado** (`FUNCIONALIDADES.md`
  7.2): tentei adicionar uma regra CSS global de `outline` visível em
  elementos focados via Tab. Achado técnico real: o pipeline de
  CSS do NativeWind/Metro descarta silenciosamente qualquer seletor
  baseado em pseudo-classe de foco (`:focus`, `:focus-visible`, com ou
  sem `*`) — confirmado inspecionando `document.styleSheets` depois do
  build, a regra nunca aparece no CSS final. Combinar com `html.dark`
  como ancestral chega a travar o app inteiro (tela em branco, sem
  erro no console) — reproduzido isolando a mudança. Revertido; não
  implementado ainda. Próximo caminho provável: aplicar foco via
  className por componente em vez de CSS global, escopo bem maior
  (~90+ elementos interativos).

## [Unreleased] - 2026-08-19 (continuação 5)

### Investigado (sem mudança de código em produção)
- **Pré-renderização estática por rota / SEO** (`TODO.md` item E,
  `FUNCIONALIDADES.md` 7.1): testado `web.output: "static"` de
  verdade — precisou instalar `@expo/metro-runtime` (faltava). Gera
  23 rotas com HTML próprio, incluindo todas as telas "hub" do app.
  **Não ativado**: rotas dinâmicas (`/resumos/[livro]`,
  `/biblia/[livro]/[capitulo]`) geram um arquivo `[livro].html`
  literal e vazio (sem `generateStaticParams`, e o `vercel.json` atual
  manda tudo pro `index.html`, o que anularia o ganho sem também
  ajustar isso) — risco de quebrar navegação em produção sem um jeito
  de testar num preview deploy do Vercel antes. Revertido o
  `app.json`; `@expo/metro-runtime` ficou instalado (primeiro passo
  pra quando isso for retomado com mais cuidado).
- **Auditoria de performance** (`FUNCIONALIDADES.md` 7.4): medido de
  verdade com `npx expo export`: bundle principal 1.85MB/~483KB gzip
  (código, sem o texto da Bíblia — confirmado que a correção de
  leitura offline já isolou isso num chunk `lazy` separado); grade de
  capítulos não virtualizada (até 176 células), sem evidência de
  problema real, não mudado especulativamente.

## [Unreleased] - 2026-08-19 (continuação 4)

### Adicionado
- **Editar nome e foto do perfil, sem conta** (`FUNCIONALIDADES.md`
  9.6c): decisão do usuário — sem login real por enquanto, mas com
  perfil local (nome + foto) persistido por `ownerId` anônimo. Novo
  `PerfilRepository` (AsyncStorage no web, nova tabela SQLite `perfil`
  no nativo) e `components/ModalPerfil.tsx`, aberto ao tocar no
  cabeçalho de perfil em `/voce`. Foto via `expo-image-picker` (nova
  dependência, instalada com `npx expo install` pra ficar compatível
  com o SDK do projeto), recorte quadrado, comprimida e guardada como
  data URI. Perfil incluído em "Exportar/apagar meus dados" (6.4).
  Testado ao vivo: trocar nome, salvar, recarregar a página — nome
  persiste de verdade.

## [Unreleased] - 2026-08-19 (continuação 3)

### Corrigido
- **Leitura de capítulo no web sempre dependia da `bible-api.com`,
  mesmo com a Bíblia inteira já embutida no app** (`FUNCIONALIDADES.md`
  7.3): a migração pro SQLite (para busca full-text e leitura offline)
  só cobria o app nativo — no web, cada capítulo aberto sempre batia
  na API externa (só um cache LRU de 200 capítulos via AsyncStorage).
  Corrigido: novo `core/biblia/leituraLocalWeb.ts` lê
  `assets/biblia.json` direto no web (mesmo carregador cacheado
  compartilhado com a busca, extraído pra
  `core/biblia/bibliaLocalWeb.ts`); `buscarReferencia` tenta local
  primeiro, cai pra `bible-api.com` só como rede de segurança se a
  busca local falhar. Testado ao vivo: abrir um capítulo e buscar não
  geram nenhuma requisição pra `bible-api.com` (conferido na aba de
  rede do navegador); Metro faz code-splitting de verdade dos módulos
  novos em chunks carregados só sob demanda.
- **Busca "Na Bíblia" nunca funcionava no web** (`FUNCIONALIDADES.md`
  2.6) — achado durante auditoria de leitura offline. `buscarGlobal`
  tinha `if (isWeb) return [];`, um fallback que fazia a aba "Na
  Bíblia" da busca devolver zero resultados sempre, pra qualquer
  termo, silenciosamente (sem erro visível) — no app publicado no
  Vercel, que é web. Corrigido com um novo módulo
  `core/biblia/buscaGlobalWeb.ts`: busca em memória sobre o mesmo
  `assets/biblia.json` já embutido no app, carregado sob demanda
  (`import()` dinâmico, só quando alguém busca de verdade) e cacheado
  depois da primeira busca — evita ter que lidar com SQLite/WASM no
  navegador. Testado ao vivo: buscar "amor" retorna 50 resultados reais
  com link correto pro versículo; "coracao" (sem acento) encontra
  "coração" — normalização de acento funcionando; sem erros no console.

## [Unreleased] - 2026-08-19 (continuação 2)

### Corrigido
- **Estado de toggles não era anunciado pra leitor de tela**
  (`FUNCIONALIDADES.md` 7.2): tema, "Marcar capítulo como lido", abas
  Texto Bíblico/Resumo, cores de grifo, "Salvar" da seleção múltipla,
  "Amém" do Versículo do Dia, chips de filtro em `/salvo` e células de
  `GradeCapitulos` tinham `accessibilityLabel` mas nenhum
  `accessibilityState` — um leitor de tela lia o rótulo, nunca dizia
  se estava ligado/selecionado. Achado no processo: a versão do
  `react-native-web` do projeto (0.21.2) não traduz
  `accessibilityState={{checked/selected}}` pra `aria-checked`/
  `aria-selected` — só reconhece as props achatadas antigas
  `accessibilityChecked`/`accessibilitySelected`. Corrigido mantendo
  os dois em paralelo (nativo + web). Testado ao vivo lendo
  `aria-checked`/`aria-selected` do DOM antes/depois de cada
  interação.

## [Unreleased] - 2026-08-19 (continuação)

### Adicionado
- **Exportar/apagar meus dados** (`FUNCIONALIDADES.md` 6.4): nova
  seção "Meus dados" em Configurações. Exportar baixa um JSON (web) ou
  abre o share sheet (nativo) com tudo dos 7 repositórios do app
  (grifos, capítulos lidos, notas, livros lidos, pesquisas favoritas,
  versículos salvos, planos). Apagar remove tudo permanentemente,
  atrás de um modal de confirmação — reaproveita os métodos de
  alternar/remover já existentes em cada repositório (todos
  idempotentes) em vez de criar um `apagarTudo` novo em cada um.
  Testado ao vivo: marcar um capítulo como lido, exportar, apagar pelo
  fluxo real da UI, e confirmar que o dado sumiu de verdade do
  `localStorage` (não só que a UI relatou sucesso).
- **Página "Sobre o projeto"** (`app/sobre.tsx`, `FUNCIONALIDADES.md`
  8.3): metodologia, fonte do texto bíblico (Almeida Corrigida Fiel,
  domínio público), origem dos resumos (conteúdo autoral, posição
  tradicional citando visão acadêmica alternativa quando relevante),
  limitações, privacidade e link pro repositório — alcançada por
  Configurações → Sobre.

## [Unreleased] - 2026-08-19

### Corrigido
- **Vários elementos ficavam presos no visual do modo escuro e não
  mudavam pro modo claro junto com o resto do app** (reportado pelo
  usuário). Causa: alguns componentes usavam cores fixas em hex (via
  `style={{ backgroundColor/color }}` ou `color=` do `MaterialIcons`)
  em vez das classes `dark:` do Tailwind/NativeWind usadas no resto do
  app — então, ao trocar de tema, esses elementos simplesmente não
  reagiam, enquanto tudo ao redor mudava normalmente. Corrigido em:
  - `components/CardVersiculoDia.tsx` (card "Versículo do Dia" da
    Início): gradiente, texto e ícones eram fixos na paleta escura.
    Agora usam `useColorScheme()` pra escolher entre a paleta escura
    original e uma nova paleta clara (creme, a partir do token
    `cor-destaque-fundo`), com texto/ícones também trocando entre
    branco (escuro) e `cor-texto` (claro).
  - `app/(tabs)/voce.tsx`: os cards "Salvos"/"Notas", "Sequência
    Diária" e "Medalhas" (incluindo os selos do carrossel,
    `MedalhaCarrossel`) usavam a constante `COR_GAMIFICACAO`, uma
    paleta escura fixa. Substituída por `bg-cor-fundo-elevado
    dark:bg-cor-fundo-elevado-dark` (mesmo tratamento já usado nos
    outros cards da mesma tela, como Compartilhamentos) + uma tabela
    `CORES_TEMA` pros valores que precisam ser hex de verdade (ícones
    do `MaterialIcons`, que não aceitam `dark:`).
  - Ícones soltos com cor fixa que não seguiam o texto ao lado (que já
    trocava corretamente): o ícone "📍" da Você, o ícone do card
    "Continue lendo" da Início, os ícones "Planos"/"Favoritos"/"Apoie"
    da Descubra, e o ícone de dia concluído dos Planos de leitura.
  - Botão "Baixar" (gerar imagem de versículo, leitura bíblica): texto
    e ícone brancos fixos sobre `bg-cor-destaque dark:bg-cor-destaque-dark`
    — no escuro, esse token é um dourado claro, e branco em cima dava
    só ~2.1:1 de contraste (mesmo problema já resolvido antes no card
    "Estudo por Resumos" da Início, agora replicado aqui).
  Testado ao vivo alternando o tema várias vezes: os cards antes presos
  no visual escuro agora mudam de cor junto com o resto da tela nos
  dois sentidos (claro→escuro e escuro→claro), confirmado lendo
  `backgroundColor`/`color` computados antes/depois de cada troca.

## [Unreleased] - 2026-08-18 (continuação 10)

### Corrigido
- **Título do capítulo (livro + número) não aparecia na leitura
  bíblica** (reportado pelo usuário): a única ocorrência do título
  "Livro Capítulo" no cabeçalho da tela de leitura
  (`app/(tabs)/biblia/[livro]/[capitulo].tsx`) estava dentro do bloco
  `{focoAtivo && (...)}` — só visível no Modo Foco (ver 1.8), que
  começa **desativado** por padrão. No modo normal de leitura (a
  maioria do tempo), o cabeçalho tinha só a seta de voltar, as abas
  "Texto Bíblico"/"Resumo" e os ícones de áudio/ajustes — nenhum texto
  dizendo qual livro/capítulo está sendo lido, a não ser rolando até a
  barrinha de navegação bem no fim da tela. Corrigido: título "Livro
  Capítulo" adicionado também no cabeçalho do modo normal, abaixo da
  barra de abas — só na aba "Texto Bíblico" (a aba "Resumo" já tem seu
  próprio título grande, `resumo.nome`, então não duplica). Testado ao
  vivo: "Deuteronômio 3" aparece no topo da leitura antes do botão
  "Marcar capítulo como lido"; trocar pra aba "Resumo" não duplica o
  título.

## [Unreleased] - 2026-08-18 (continuação 9)

### Adicionado
- **Botão de limpar (X) na busca de livro da leitura bíblica**
  (pedido do usuário): o campo "Buscar livro..." em `/biblia/escolher`
  (acessado durante a leitura, ao tocar no nome do livro) não tinha
  jeito rápido de limpar o texto — só apagar letra por letra. Agora um
  "✕" aparece dentro do campo, à direita, só quando há texto digitado,
  e some de novo quando o campo está vazio. Testado ao vivo: aparece
  ao digitar, some ao voltar o campo pra vazio.

## [Unreleased] - 2026-08-18 (continuação 8)

### Corrigido
- **Atalhos "Favoritos" e "Apoie" (Descubra) indistinguíveis do
  atalho "Planos" de verdade**: os três atalhos no topo da aba
  Descubra tinham exatamente a mesma aparência, mas só "Planos" navega
  de verdade — os outros dois só mostram um `Alert` "Em breve!" ao
  tocar (já documentado como mock intencional no código, mas sem
  nenhuma pista visual). Mesmo problema de visibilidade de estado já
  corrigido antes pro sino de notificações e "Envie-me Diariamente"
  (ver 7.10): aplicado `opacity-40` e `accessibilityLabel` com "(em
  breve)" nos dois atalhos mock, consistente com o padrão já
  estabelecido no app pra funcionalidades ainda não implementadas.

## [Unreleased] - 2026-08-18 (continuação 7)

### Corrigido
- **Cabeçalho de `/configuracoes` sem botão de tema**: toda tela
  autônoma do app (`/estatisticas`, `/planos`, `/resumos`, `/salvo`,
  `/medalhas`) usa o mesmo padrão de cabeçalho — link "← Voltar" e
  `<BotaoTema />` lado a lado numa linha `flex-row justify-between`.
  `/configuracoes` era a única exceção: só tinha o link de voltar,
  sem o botão de tema, e nem usava a mesma estrutura de linha. Ironia
  à parte (é a tela de configurações de aparência), agora segue o
  mesmo padrão de cabeçalho de todo o resto do app.

## [Unreleased] - 2026-08-18 (continuação 6)

### Corrigido
Auditoria de navegação (a pedido do usuário — "continuar com melhorias
no fluxo do usuário [...] tem componentes que estão muito diferentes,
mesmo os que deviam ser parecidos"), feita com um agente de busca
dedicado, checando todo `router.push`/`Link href` do app contra as
rotas reais:
- **Botões "Salvos" e "Notas" (aba Você) levavam pro mesmo lugar sem
  filtro nenhum**: os dois abriam `/salvo` sem parâmetro, mostrando
  sempre a lista completa (Todos) — apesar de serem dois botões
  visualmente distintos, prometendo destinos diferentes. `app/salvo.tsx`
  ganhou suporte a `?filtro=salvo|nota|grifo|pesquisa` via
  `useLocalSearchParams` (com validação — um valor desconhecido ou
  ausente cai em "Todos", nunca quebra), e os dois botões de Você agora
  passam o filtro certo. Testado ao vivo: "Notas" abre `/salvo?filtro=nota`
  com o chip "Anotações" já selecionado (confirmado via classe CSS de
  seleção); "Salvos" abre `/salvo?filtro=salvo` com "Salvos" selecionado.
- **Rótulo "Ver Todos" (Início, maiúsculo) inconsistente com o resto do
  app** (que usa sempre minúsculo: "Ver todas as estatísticas", "Ver
  todas as medalhas", "Ver todas" no modal de conquista) — padronizado
  pra minúsculo.
- **"Ver mais" da Atividade (Você) sem contexto de quantidade**: outros
  pontos do app com "ver mais" mostram "X de Y" (medalhas, estatísticas);
  esse só dizia "Ver mais" sem indicar quantos itens existem além dos 5
  mostrados. Agora mostra "Ver mais (mostrando 5 de N)".

O agente também confirmou que nenhum `router.push`/`Link href` do app
aponta pra uma rota inexistente — o bug das Medalhas (corrigido antes)
era o único link "morto"/apontando pro lugar errado; o resto encontrado
foi inconsistência visual/de rótulo, registrada acima.

## [Unreleased] - 2026-08-18 (continuação 5)

### Adicionado
- **Tela própria de Medalhas** (`/medalhas`), pedida pelo usuário: "o
  botão que era pra levar pra tela própria [...] leva para a tela de
  perfil". O botão "Ver Todos" do card de Medalhas do Início
  (`CardConquistas`) apontava pra `/voce` — a aba Você inteira, não uma
  tela dedicada — porque essa tela nunca existiu. Criada
  `app/medalhas.tsx`: lista completa das 6 conquistas, cada uma com
  ícone, título, descrição completa (sem precisar tocar pra ver, ao
  contrário do card do Início) e barra de progresso. Agora "Ver Todos"
  (e o "Ver todas" dentro do modal de detalhe de uma medalha) levam
  pra lá. A aba Você (visualização mais detalhada em carrossel,
  mantida de propósito — é o pedido explícito do usuário) ganhou um
  link "Ver todas as medalhas →" abaixo do carrossel, e cada medalha
  individual do carrossel também ficou tocável, levando pra mesma tela.

### Corrigido
- **Ícones de medalha inconsistentes entre Início e Você**: o card do
  Início (`CardConquistas`) desenhava ícones via `MaterialIcons` com um
  mapeamento manual incompleto (só cobria 2 dos 6 ids de conquista,
  o resto caía num ícone genérico de troféu) — enquanto a aba Você
  sempre usou o emoji de verdade de cada conquista
  (`core/content/conquistas.ts`). Unificado: os dois agora renderizam
  o mesmo `c.icone`, com a mesma técnica de opacidade reduzida (0.4)
  pra "não conquistada ainda" usada em Você — elimina uma fonte real
  de inconsistência visual entre dois componentes que representam a
  mesma coisa.

## [Unreleased] - 2026-08-18 (continuação 4)

### Adicionado
- **Seleção por arraste na marcação em massa** (pedido do usuário: "implemente
  seleção por arraste com foco em ux avançada"): no modo de seleção múltipla
  da grade de capítulos, no web, pressionar e arrastar sobre vários
  capítulos estende a seleção pro intervalo inteiro, em vez de tocar um por
  um. Arrastar a partir de um capítulo já selecionado desmarca o intervalo
  em vez de marcar (mesmo padrão do app Fotos do iOS/Android — permite
  estender ou encolher a seleção com o mesmo gesto). Novo
  `core/util/useSelecaoArrasto.ts`, usando `pointerdown`/`pointermove`/
  `pointerup` + `elementFromPoint` (mesmo tipo de padrão já usado em
  `useArrastarParaRolar.ts`). Testado ao vivo com sequências reais de
  `PointerEvent`: arrastar de 3 a 9 selecionou exatamente 7 capítulos (3-9);
  arrastar de um capítulo já selecionado desmarcou só o intervalo do
  arraste, mantendo o resto da seleção anterior intacto.
- **Toast com botão de ação (Desfazer)** (pedido do usuário: "evoluir
  componente toast também"): `mostrarToast()` ganhou uma segunda forma
  opcional `{ acaoLabel, onAcao, duracaoMs }`, retrocompatível com todo
  chamador existente. Usado agora pela marcação em massa — desfazer uma
  marcação restaura o estado **individual** de cada capítulo (não inverte
  tudo em bloco), correto mesmo quando a seleção original misturava
  capítulos já lidos com não lidos. Testado ao vivo: marcar 4 capítulos,
  tocar "Desfazer" no toast reverte a contagem na hora, e o estado
  revertido sobrevive a um reload (persistiu de verdade, não só na memória).

## [Unreleased] - 2026-08-18 (continuação 3)

### Adicionado
- **Marcar vários capítulos como lidos de uma vez** (pedido do usuário):
  no acordeão de livros (`/biblia/escolher`), cada livro expandido ganhou
  um botão "Selecionar vários" que entra em modo de seleção múltipla na
  grade de capítulos — tocar um capítulo agora o seleciona (contorno
  destacado) em vez de navegar pra leitura. Barra de ações com
  "Selecionar todos" (marca o livro inteiro de uma vez), "Desmarcar" e
  "Marcar como lidos", com toast de confirmação ("N capítulos marcados
  como lidos") e contagem "X de Y" do livro atualizada na hora, sem
  precisar recarregar a tela.
  Novo `ProgressoRepository.definirVarios(ownerId, refs, lido)` —
  define o mesmo estado (lido/não lido) pra uma lista de capítulos numa
  chamada só: no SQLite nativo, roda em uma transação com
  `INSERT OR IGNORE`/`DELETE` (index único `(ownerId, livroSlug,
  capitulo)` já existente evita duplicata); no localStorage (web), uma
  passada só sobre a lista antes de salvar de volta — nos dois casos,
  muito mais rápido que chamar `alternar()` capítulo por capítulo (que
  também arriscaria "destoggle" acidental se algum já estivesse lido).
  Testado ao vivo: selecionar capítulos 1-3 de Deuteronômio, marcar como
  lidos, contagem vai de "0 de 34" pra "3 de 34" na hora, toast aparece,
  e o estado sobrevive a um reload da página (persistência confirmada).

## [Unreleased] - 2026-08-18 (continuação 2)

### Corrigido
Auditoria de UI componente por componente (ver `PLANO-UI-COMPONENTES.md`
pra lista completa e itens que ficaram em aberto), itens 🔴/🟡 já
implementados e testados ao vivo:
- **`CardVersiculoDia`**: sombra de texto excessiva (resquício de quando
  o fundo era foto variável, hoje é ruído sobre gradiente já escuro)
  reduzida a uma sombra sutil só no texto do versículo; gradiente com
  mais contraste de luminosidade (era quase cor sólida); botão "Envie-me
  Diariamente" (feature que não existe ainda) virou um chip pequeno
  alinhado à direita em vez de uma barra full-width competindo
  visualmente com as ações reais (Amém/Anotar/Enviar/Mais).
- **`CardConquistas`**: badge de progresso das medalhas não-conquistadas
  usava `bg-black/60` fixo (contraste garantido só por coincidência) —
  trocado por tokens do tema; anel dos círculos de medalha de `border-4`
  pra `border-2` (proporção mais fina pro tamanho de 80px); "Saiba mais"
  ganhou sublinhado pontilhado (mesma linguagem visual de referência
  tocável já usada em `TextoComReferencias`).
- **`MenuAcoes`**: bottom sheet de ações (usado por `CardVersiculoDia` e
  `CardAtividade`) ganhou ícone opcional (`MaterialIcons`) ao lado de
  cada label — "Copiar", "Ler", "Compartilhar" etc. agora têm ícone,
  facilitando o scan rápido.
- **`PopoverVersiculo`**: botão fechar "✕" (só texto solto no canto)
  virou um botão circular com fundo sutil, padronizado com o resto do
  app.

## [Unreleased] - 2026-08-18 (continuação)

### Corrigido
- **Botões "em breve" sem indicação visual de desabilitado**: o botão "Envie-me Diariamente" do card do Versículo do Dia e o sino de notificações do Início eram `disabled` mas continuavam com aparência 100% normal — nada indicava que não faziam nada ao tocar (heurística de Nielsen "visibilidade do estado do sistema"). Adicionado `opacity-40` aos dois, `accessibilityLabel` com "(em breve)" no sino (já existia) e no botão do card (não tinha), e o próprio texto do botão do card passou a dizer "(em breve)" explicitamente.

## [Unreleased] - 2026-08-18

### Corrigido
- **Nome do capítulo na leitura levava pra rota antiga abolida** (reportado várias vezes pelo usuário até ser corrigido de fato): a faixa `← Livro Capítulo →` da leitura bíblica linkava o nome do livro para `/biblia/escolher/${slug}`, uma rota que renderiza `escolher/[livro]/index.tsx` — tela modal de escolha de capítulo de um único livro que já deveria ter sido abolida numa correção anterior (só o link de dentro dela tinha sido trocado, não os dois links *para* ela). Corrigido: agora os dois links (na faixa de navegação e na tela de "capítulo não encontrado") vão para `/biblia/escolher?livro=${slug}` — a lista completa de livros (`escolher/index.tsx`), já com o livro atual expandido na grade de capítulos, exatamente como as demais entradas de "trocar de livro" do app. A tela antiga `escolher/[livro]/index.tsx` e seu registro no `Stack` foram removidos por não ter mais nenhum link apontando pra ela. Testado ao vivo: clicar em "Deuteronômio 3" durante a leitura leva a `/biblia/escolher?livro=05-deuteronomio`, mostrando a lista de livros com Deuteronômio já expandido na grade 1-34.

## [Unreleased] - 2026-08-12 (continuação 2)

### Corrigido
- **Carrosséis horizontais não arrastáveis com mouse** (reportado por usuário: "o Continue lendo parece um carrossel mas não desliza no PC"): as três `ScrollView horizontal` do app (Início, Você/Medalhas, barra de seleção da leitura) só rolavam via trackpad/touch, não com mouse comum. Novo `core/util/useArrastarParaRolar.ts` implementa arrastar-com-o-mouse (estilo Twitter/Instagram web), cursor `grab`/`grabbing`. Achado durante a implementação: a primeira versão com `useRef`+`useEffect` não funcionava porque as `ScrollView`s montam depois que os dados carregam de forma assíncrona — corrigido usando callback ref. Testado ao vivo simulando o arraste completo nas três telas.

## [Unreleased] - 2026-08-12 (continuação)

### Corrigido
- **Alvos de toque pequenos demais**: auditoria ao vivo (medindo `getBoundingClientRect()` no navegador) achou 4 botões abaixo do mínimo recomendado (44×44px) — "Cancelar seleção" (24px), cores de grifo e "Ver todas as cores" (32px), engrenagem de Configurações (36px) — e os 4 botões do card do Versículo do Dia com área clicável real de só 25-36px de largura apesar de parecerem uma faixa contínua. Tentativa inicial com `hitSlop` não funcionou — a prop não é implementada no `react-native-web`, só no nativo (confirmado lendo o código-fonte da lib). Corrigido com caixa clicável real maior (padding + margem negativa, ou `flex-1`), mantendo os elementos visuais do mesmo tamanho.

## [Unreleased] - 2026-08-12

### Adicionado
- **Feedback visual de toque em todos os botões** (pedido do usuário, citando as heurísticas de Nielsen): nenhum `Pressable` do app tinha qualquer resposta visual ao toque. Adicionado `active:opacity-*`/`active:bg-*` do NativeWind v4 em 84 dos 95 botões do app (os 11 restantes são backdrops de modal ou botões já desabilitados). Cobertura completa da leitura de capítulo (29 botões), componentes compartilhados (grade de capítulos, menu de ações, modal de nota, tooltip) e todas as telas principais. Confirmado ao vivo que a regra CSS `:active` foi gerada corretamente; não foi possível simular visualmente o estado pressionado via automação (limitação do ambiente headless, não do app).

## [Unreleased] - 2026-08-11 (continuação 4)

### Modificado
- **Erro amigável no card do Versículo do Dia**: em vez de somir da tela sem explicação quando a busca falha, agora mostra a mensagem de erro amigável com botão "Tentar novamente" — mesmo padrão já aplicado na leitura de capítulo. Lógica validada por testes automatizados; não confirmado ao vivo neste componente específico (limitação do ambiente de teste, ver FUNCIONALIDADES.md 3.2).

## [Unreleased] - 2026-08-11 (continuação 3)

### Adicionado
- **Mensagens de erro amigáveis** (pedido do usuário): novo `ErroBusca` classifica falhas de busca bíblica em `limite`/`rede`/`timeout`/`invalido`/`desconhecido`, e `core/util/erroAmigavel.ts` traduz cada um numa frase sem jargão técnico. Confirmado na prática que a bible-api.com bloqueia com HTTP 429 acima de ~13-15 requisições rápidas (bate com a estimativa do usuário). Mensagem específica pro limite: "Devagar aí! Muitos capítulos em pouco tempo — espera meio minuto e tenta de novo." `limite` e `invalido` não acionam retry automático (insistir não ajuda nesses casos). Aplicado na leitura de capítulo, cards de tema (Descubra) e popover de referências do resumo. Testado ao vivo simulando cada tipo de falha via `fetch` mockado; testes automatizados novos cobrem a classificação.

## [Unreleased] - 2026-08-11 (continuação 2)

### Adicionado
- **Tooltip de gênero literário**: selo colorido no resumo do livro (ex. "EVANGELHO") agora é tocável e abre uma explicação curta do gênero. Novo `components/Tooltip.tsx` (reutilizável) + `DESCRICAO_GENERO` em `core/content/genero.ts`.

### Modificado
- **Grade de capítulos responsiva**: novo `components/GradeCapitulos.tsx` reutilizado no acordeão de livros e na tela dedicada de capítulos — antes cada tela tinha sua própria versão, com células grandes e número de colunas fixo (~5-6) não importa a largura da tela. Agora o número de colunas varia por faixa de largura (6/8/10/12), sempre limitado ao total de capítulos do livro. Acordeão passou a destacar capítulos individualmente lidos (antes só mostrava a contagem no cabeçalho).

## [Unreleased] - 2026-08-11 (continuação)

### Corrigido
- **Causa raiz real dos bugs de leitura ("só Gênesis funciona", "erro ao carregar versículos")**: o acordeão de livros (`app/(tabs)/biblia/escolher/index.tsx`) enviava o toque num capítulo pra `/biblia/escolher/${slug}/${cap}` em vez de `/biblia/${slug}/${cap}` (a tela de leitura de verdade). O destino errado era uma tela de "escolher versículo" (`escolher/[livro]/[capitulo].tsx`) que o próprio FUNCIONALIDADES.md já dizia não existir — e que tinha um bug próprio, buscando o capítulo pelo *slug da URL* em vez do *nome do livro*, falhando sempre, pra qualquer livro. Corrigido o link e removida a tela órfã e quebrada. Testado ao vivo: Deuteronômio 2 e Apocalipse (último livro) carregam certo pela rota corrigida. As correções de resiliência anteriores (retry na bible-api.com, robustez do SQLite) continuam válidas, mas não eram a causa deste sintoma.

## [Unreleased] - 2026-08-11

### Corrigido
- **Imagem de fundo imprópria no card do Versículo do Dia** (reportado por usuário): o fundo usava `picsum.photos` (fotos de banco aleatório, sem curadoria) — podia mostrar qualquer imagem, e mostrou conteúdo impróprio pro público do app. Removida a dependência de imagem externa por completo; substituída por um gradiente sólido nas cores de marca (zero risco de recorrência, já que não há mais fonte de imagem não curada nenhuma).
- **Leitura bíblica falhando com "erro ao carregar versículos"** (reportado por usuário): a busca de capítulo na web (`bible-api.com`, API pública sem SLA) não tinha nenhuma tolerância a falha transitória. Adicionado retry automático (até 3 tentativas, timeout de 10s cada) em `core/biblia/BibliaAPI.ts`, com testes novos (`BibliaAPI.web.test.ts`) confirmando o comportamento com `fetch` mockado. Também adicionado botão "Tentar novamente" na tela de leitura, que antes só mostrava o texto de erro sem nenhuma ação possível.
- **Bug grave no app nativo: só Gênesis era legível** (reportado por usuário): `garantirBaseBiblia()` populava o SQLite um versículo por vez (60 mil+ operações sequenciais numa transação só) e considerava a base pronta bastando existir qualquer registro — se a população fosse interrompida no meio (fechamento do app, falta de memória), só Gênesis (primeiro livro do JSON) chegava a existir, e o app nunca detectava/corrigia isso. Corrigido: checagem de contagem contra o total real de versículos (repopula do zero se incompleta) e inserção em lotes de 150 linhas por `INSERT` + `INSERT INTO biblia_fts(biblia_fts) VALUES ('rebuild')` no final, em vez de 60 mil inserts individuais. Validado com `node:sqlite` rodando a mesma lógica contra o `assets/biblia.json` real (31.106 versículos, ~190ms, Gênesis e Mateus consultáveis) — não testado no dispositivo/simulador nativo de verdade (ambiente sem acesso a isso).
- **Botões decorativos sem função no card do Versículo do Dia e nas Medalhas da Início**: auditoria de UI encontrou controles que pareciam 100% interativos e não faziam nada — Amém/Anotar/Enviar/Mais (`CardVersiculoDia.tsx`, nem tinham `Pressable`, eram `View`s comuns) e "Saiba mais"/"Ver Todos" (`CardConquistas.tsx`, `Pressable`s sem `onPress`). Agora todos funcionam de verdade: Amém salva o versículo do dia, Anotar abre nota, Enviar compartilha, Mais abre menu (Copiar/Ver capítulo/Resumo do livro); "Saiba mais" mostra a descrição real da conquista, "Ver Todos" leva pro carrossel completo de medalhas em `/voce`. Novo `core/biblia/parseReferencia.ts` resolve a referência textual do versículo do dia ("Livro Cap:Vers") pro trio que os repositórios esperam. Achado à parte: `referenciaAleatoria()` em `versiculoDoDia.ts` não é chamada por nenhum componente — função órfã, provavelmente sobra de um botão de "sortear outro" removido num redesenho anterior sem atualizar a documentação.

## [Unreleased] - 2026-08-10 (continuação)

### Adicionado
- **Toast global**: `core/util/toast.ts` (pub-sub mínimo, sem Context) + `components/Toast.tsx`, montado uma vez em `app/_layout.tsx`. Fecha o item 5.1 do FUNCIONALIDADES.md — copiar versículo/link agora mostra "Copiado!" no web, tanto na leitura de capítulo quanto no `CardAtividade`/`compartilhador.ts`.
- **Áudio da leitura**: `core/leitura/audio.ts` narra o capítulo em voz alta, versículo por versículo (Web Speech API no web, `expo-speech` no nativo — nova dependência, sem custo/servidor). Botão de play/pause no cabeçalho da leitura, destaque visual e auto-scroll acompanhando o versículo sendo lido, parando sozinho ao trocar de capítulo ou sair da tela.
- **Offline de verdade no web**: `public/sw.js` (service worker, estratégia network-first pro HTML e cache-first pros assets com hash), registrado via `core/registrarServiceWorker.ts` em `app/_layout.tsx`. Confirmado com `npx expo export --platform web` que o Expo Router copia `public/**` pro build de produção.
- **Imagem de versículo pra compartilhar**: `core/util/gerarImagemVersiculo.ts` gera um cartão 1080×1080 via Canvas API (sem dependência nova), com as cores de marca do app. Botão "Imagem" na barra de seleção da leitura (só web, só com 1 versículo selecionado), modal de preview com "Baixar".

### Testado ao vivo (navegador real, não só typecheck/jest)
Service worker registrado e ativo; áudio inicia/pausa de verdade (`speechSynthesis`); toast "Copiado!" aparece; progresso "X de Y" por livro confirmado; versículo salvo aparece em `/salvo` com filtro e exclusão funcionando; todos os `accessibilityLabel` novos presentes na árvore de acessibilidade; plano de leitura marca dia e atualiza progresso; imagem de versículo gerada de verdade (1080×1080, pixels de texto confirmados, não em branco) e baixada. Achado durante o teste: o service worker recém-criado pode servir um bundle JS desatualizado *em modo dev* (URLs do Metro não têm hash de conteúdo, ao contrário do build de produção) — documentado em 7.3 do FUNCIONALIDADES.md como armadilha de teste local, não bug da estratégia.

## [Unreleased] - 2026-08-10

### Adicionado
- **Versículos salvos na atividade**: `versiculosSalvosRepository` agora entra no agregador de atividade (`core/estatisticas/atividade.ts`); a tela `/salvo` ganhou o filtro "Salvos" e o `CardAtividade` passou a excluir salvos, fechando um gap onde salvar um versículo não aparecia em nenhum lugar da UI.
- **Progresso por livro na lista de leitura**: cada card da lista de livros (`app/(tabs)/biblia/escolher/index.tsx`) mostra agora "X de Y" capítulos lidos, calculado com uma única leitura de `progressoRepository.listarTodos`.
- **Lembrete de plano de leitura parado**: novo `core/leitura/lembretePlanos.ts` e método `obterUltimaConclusao` no `PlanosRepository` (local + SQLite); a Início mostra um card discreto convidando a continuar um plano iniciado e parado há pelo menos 1 dia, sem tom de cobrança.
- **Atalho de teclado para tema**: na leitura de capítulo (web), a tecla `T` alterna entre claro/escuro, somado à navegação por seta já existente; ignora quando o foco está num campo de texto.
- **Link real ao compartilhar/copiar versículo**: `core/util/linkVersiculo.ts` monta um link (`origin + /biblia/[livro]/[capitulo]?versiculo=N`) usando `window.location.origin` — funciona em qualquer domínio, sem depender da decisão final de domínio do projeto. Aplicado na leitura do capítulo e no `CardAtividade`. Só funciona no web; o app nativo continua compartilhando só texto/referência.

### Modificado
- **Acessibilidade de botões só-de-ícone**: adicionado `accessibilityLabel` em vários controles da leitura de capítulo (voltar, ajustes, cancelar seleção, cores de grifo, expandir cores, A-/A+) que não tinham nome acessível nenhum; o sino de notificação (placeholder, ainda sem ação) da Início virou `disabled` com label "em breve" em vez de ficar focável sem fazer nada.

### Documentado
- `FUNCIONALIDADES.md` atualizado: itens 2.4b, 2.7, 4.1, 4.2, 4.3, 5.1, 7.2, 7.4 e 7.5 revisados para refletir o que foi implementado ou medido nesta sessão (alguns já estavam prontos e só a documentação estava desatualizada).

## [Unreleased] - 2026-08-08

### Adicionado
- **Modal de Ajustes de Leitura**: Um novo bottom sheet com controles elegantes para ajustar fonte (A-/A+), tipo de fonte (serifada/sem serifa) e alternância rápida do tema claro/escuro.
- **Acordeão de Livros**: O fluxo de seleção de capítulos agora ocorre na própria lista de livros. O livro da sua última leitura se abre automaticamente!
- **Tela de Seleção de Versículos**: Uma nova tela (`[livro]/[capitulo].tsx`) com grid para escolha exata do versículo de início, inspirada nos melhores apps de leitura bíblica.
- **Auto-scroll na leitura**: Ao escolher um versículo, o app realiza uma rolagem automática (usando cálculo `onLayout` dos componentes) até a posição exata da tela.
- **Modo de Foco Inteligente (Leitura)**: Durante a rolagem (scrolling) o TabBar principal e os cabeçalhos são ocultados e dão lugar a uma pequena barra minimalista mostrando apenas o nome do livro e capítulo atual.
- Dependência `expo-clipboard` instalada para permitir a cópia confiável e nativa dos versículos selecionados.

### Modificado
- **Design Premium da TabBar**: A barra de navegação principal foi repaginada para ficar muito mais leve e moderna (ícone em cima, texto pequeno). 
- A aba principal de pesquisa agora foi renomeada para "Descubra".
- **Tipografia e Contraste na Leitura**: Versículos reestilizados para atuar como "sobrescrito" (leves, tamanho menor e transparentes). No modo escuro, o texto branco forte foi substituído por uma cor off-white (#EAEAEA), que reduz a fadiga ocular.
- **Grifos de Texto**: A paleta de grifos foi reformulada. As bolinhas de seleção agora utilizam cores sólidas de alto contraste, enquanto o destaque aplicado ao texto bíblico utiliza tons pastéis translúcidos, preservando a leitura.
- Busca tolerante em toda a plataforma.
- Melhoria geral de estabilidade.

### Removido
- Telas intermediárias de seleção de capítulos isolados (`escolher/[livro]/index.tsx`) foram completamente deletadas, consolidando toda a experiência na tela principal de "Livros" em formato de acordeão expansível.
- Botão "Sair da Tela Cheia" flutuante removido; agora o foco e desfoco ocorrem de maneira totalmente orgânica e invisível durante o scroll.
