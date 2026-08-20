# Planejamento e Tarefas (TODO)

## Feito / Completed ✅
- [x] **Visibilidade do Status do Sistema (Wayfinding & Navegação)**: Implementação de breadcrumbs claros na navegação.
- [x] **Feedback de Carregamento**: Implementação de skeleton loading nas trocas de capítulos.
- [x] **Prevenção de Erros e Busca Tolerante**: Barra de pesquisa otimizada para lidar com buscas sem acentuação e tolerância a erros.
- [x] **Modo Foco / Imersivo**:
  - [x] Ocultar navbar principal via `NavbarContext` dinâmico durante a rolagem.
  - [x] Adição de uma barra minimalista no rodapé indicando o livro/capítulo atual.
- [x] **Acessibilidade de Leitura (Liberdade do Usuário)**:
  - [x] Controles de aumento/diminuição de fonte (A- / A+) e troca de serifada integrados em um Modal "Bottom Sheet" elegante.
  - [x] Tipografia subliminar para números dos versículos (tamanho menor, opacity 50%, sobrescrito).
  - [x] Ajuste da cor principal de texto no modo escuro para off-white (#EAEAEA) reduzindo cansaço visual.
- [x] **Refatoração da Navegação Bíblica (Acordeão YouVersion-style)**:
  - [x] Remoção da tela antiga de escolha de capítulos (`escolher/[livro]/index.tsx`).
  - [x] Implementação de lista em acordeão na tela de Livros.
  - [x] Criação de tela dedicada para escolha de versículos em grade de 5 colunas (`escolher/[livro]/[capitulo].tsx`).
  - [x] Auto-scroll inteligente ao entrar no versículo alvo, lendo query params e utilizando as posições (Y) medidas dinamicamente via `onLayout`.
- [x] **Refatoração de Estado Global Local (NavbarContext)**: Criado um context provider leve no layout principal (`app/(tabs)/_layout.tsx`) para que qualquer tela filha possa ocultar a tab bar.

## Próximos Passos (Next Steps) 🚀

Abaixo, um detalhamento técnico e arquitetural de como implementaremos as próximas evoluções da plataforma, garantindo escalabilidade e robustez.

### 1. [x] **Persistência de Dados (SQLite / Zustand + MMKV)**
- **O Desafio:** Atualmente, os grifos, notas e itens salvos podem se perder ao fechar o app, pois estão apenas em estado de sessão ou dependem de abstrações em memória.
- **Como Fazer:**
  - Migrar os repósitórios locais (`LocalGrifosRepository`, etc.) para o `expo-sqlite` caso tenhamos dados relacionais complexos, OU usar uma store global com `zustand` integrada ao `react-native-mmkv` para persistência super rápida e síncrona de chave-valor.
  - Implementar um adapter que espelha as operações de memória (`Map` / `Set`) em JSONs persistidos.
  - **Benefício:** Experiência consistente; o usuário não perde o histórico e o banco de dados fica pronto para uma futura sincronização em nuvem.

### 2. [x] **Modo Offline & Cache Persistente Inteligente**
- **O Desafio:** A leitura da Bíblia precisa ser instantânea e não pode depender de conexão ativa constante.
- **Como Fazer:**
  - Implementar um Service Worker (em web) ou usar `expo-file-system` + `SQLite` (nativo) para baixar a base da Bíblia inteira (~5MB de texto JSON).
  - Modificar a `BibliaAPI.ts` para checar primeiro o cache persistente. Se o livro existir, não bater na rede.
  - Criar um botão "Baixar Bíblia para acesso Offline" nas configurações.
  - **Benefício:** A leitura de qualquer capítulo ficará na ordem de < 10ms, eliminando os loaders e quebras por falta de rede.

### 3. [x] **Histórico de Leitura (Continue Lendo / Recentemente Lidos)**
- **O Desafio:** Facilitar o retorno do usuário para capítulos que ele estava estudando ontem, quebrando a fricção de sempre ter que caçar o livro na tela de seleção.
- **Como Fazer:**
  - Criar um estado persistido `historicoLeituras: Array<{livro, capitulo, timestamp, versiculoProgresso}>`.
  - Toda vez que a tela de leitura for desmontada ou no evento de background do app, salvar o último livro/capítulo acessado na primeira posição da fila (LRU cache com limite de 10 itens).
  - Na tela Início, renderizar um `<ScrollView horizontal>` com cards minimalistas apontando direto pra leitura (`router.push`).

### 4. [x] **Planos de Leitura Diária e Devocionais**
- **O Desafio:** Manter o engajamento diário de leitura.
- **Como Fazer:**
  - Modelar em JSON a estrutura de Planos (ex: "Bíblia em 1 ano" -> Array de 365 dias, contendo refs bíblicas).
  - Usar o `expo-notifications` para criar agendamentos locais (Local Notifications) sempre às 7h da manhã com um versículo ou lembrete, sem precisar de servidor push backend.
  - Acompanhar progresso via barra de progresso preenchida com a quantidade de dias completados no AsyncStorage.

### 5. [x] **Testes E2E e Unitários com Jest**
- **O Desafio:** As lógicas complexas (como cálculo de layout de rolagem e indexação de versículos) quebram facilmente em refatorações maiores.
- **Como Fazer:**
  - Instalar `jest`, `@testing-library/react-native`.
  - Escrever unit testes para as core business rules (`BibliaAPI`, `calcularSequenciaAtual`).
  - Escrever testes E2E com Maestro ou Detox testando a jornada principal: `Abrir App -> Escolher Livro -> Escolher Versículo -> Grifar Texto`.

### 6. [x] **Busca Global na Bíblia Completa**
- **O Desafio:** A pesquisa atual busca apenas os resumos históricos dos livros. O usuário precisa conseguir pesquisar qualquer palavra-chave e encontrá-la em toda a Bíblia, recebendo os versículos na hora.
- **Como Fazer:**
  - Integrar um motor de busca local rápido após baixar a base offline. Se o aplicativo migrar para SQLite, utilizaremos índices **FTS5 (Full-Text Search)** nativos.
  - Se mantivermos arquivos JSON estáticos, construiremos um "Inverted Index" reduzido e otimizado em WebWorker/Thread paralela.
  - Na tela de pesquisa, os resultados serão divididos em abas visuais: "Resultados em Resumos" e "Resultados na Bíblia".

### 7. [x] **Reformulação Visual da Aba Pesquisa (Descubra)**
- **O Desafio:** A interface de pesquisa atual tem temas em formato de cards simples com emojis. O usuário forneceu prints de um app líder de mercado como inspiração ("ideias boas"), focando na estrutura de descoberta e atalhos.
- **Diretriz de Design:** **Não copiar explicitamente.** As referências servem apenas para inspirar a estrutura de UX. A identidade visual, ícones e paletas de cores devem ser originais e alinhados com o nosso app.
- **Como Fazer (Adaptação das Ideias):**
  - Alterar o título de "Pesquisa" para "Descubra" (ou sinônimo adequado).
  - Adicionar uma linha de botões de atalhos funcionais para recursos do nosso app abaixo da barra de pesquisa.
  - Refatorar os cards de `TEMAS_BUSCA` para um grid estruturado.
  - O estilo de cada card de tema deve ter:
    - Fundo com cor sólida pastel/vibrante da nossa própria paleta.
    - O título do tema alinhado de forma clara e legível.
    - Uma ilustração ou imagem gerada dinamicamente (com estilo próprio do nosso app) flutuando no card para gerar interesse visual.

### 8. [x] **Reformulação Visual da Aba Perfil (Você)**
- **O Desafio:** A página de perfil atual não explora o potencial de pertencimento e gamificação. O usuário forneceu referências de estrutura de perfil premium (focada em métricas de leitura e comunidade) apenas como inspiração.
- **Diretriz de Design:** **Criar de forma autêntica.** Usaremos as boas ideias de gamificação (como cards de métricas e display de medalhas), mas os desenhos das medalhas, o estilo dos cards e as métricas específicas serão 100% autorais e focadas no nosso ecossistema de conteúdo.
- **Como Fazer (Adaptação das Ideias):**
  - Criar um cabeçalho superior bem estruturado com configurações e atalhos rápidos do usuário.
  - Reformular a exibição do perfil com layout claro (Nome em destaque, tag de progresso, localização e foto harmonizadas).
  - Criar uma área de botões rápidos para ações chave (ex: Salvos, Notas, etc).
  - Desenvolver **Cards de Gamificação Próprios**, incluindo:
    - Card de Streak (Perseverança) evoluindo nosso "Foguinho" atual.
    - Card de Estatísticas de Leitura original.
    - Card Imersivo de Medalhas: Um container elegante exibindo nossas medalhas originais de leitura (Pentateuco, Evangelhos, etc.) em destaque com barras de progresso próprias.

---

## Plano detalhado do que falta (2026-08-19)

Feito recentemente, fora da lista acima (ver `CHANGELOG.md` e
`FUNCIONALIDADES.md` pra detalhe completo de cada um): tela própria de
Medalhas, seleção em massa/por arraste de capítulos lidos, Toast com
ação (Desfazer), correção de elementos presos no modo escuro, exportar/
apagar meus dados, página "Sobre o projeto".

Itens abaixo vêm de `FUNCIONALIDADES.md` marcados `⬜`/`🔶` (não
iniciado/parcial), quebrados em microtarefas. **Legenda:**
🟢 posso começar sem aprovação (só código, sem decisão de produto/conta
paga) · 🔴 precisa de uma decisão do usuário antes de começar (conta,
serviço pago, política).

### 🟢 Sem bloqueio — posso atacar em qualquer ordem

**A. Gerar imagem de versículo no nativo** (`FUNCIONALIDADES.md` 5.2,
hoje só funciona no web)
1. Instalar `react-native-view-shot` e `expo-sharing`.
2. Capturar a `View` do cartão de versículo já existente (o desenho já
   está pronto pro web via Canvas — no nativo, capturar a View
   renderizada em vez de redesenhar em Canvas).
3. Compartilhar o arquivo capturado via `expo-sharing`.
4. Testar em pelo menos um preview/simulador antes de considerar feito
   (não dá pra validar 100% sem dispositivo/simulador nativo à mão,
   registrar essa limitação se for o caso).

**B. Navegação só por teclado / leitor de tela** (7.2, hoje parcial)
1. Levantar lista de todo `Pressable` sem `accessibilityRole="button"`
   nas telas principais (Início, Bíblia, Descubra, Você) — auditoria,
   sem código ainda.
2. Adicionar `accessibilityRole`/`accessibilityState` onde faltar
   (ex.: toggles como grifo/salvo precisam de `accessibilityState={{
   selected }}`).
3. Testar navegação por Tab no web (já existem atalhos de teclado em
   parte da leitura — conferir se cobrem todas as telas ou só a
   leitura de capítulo).
4. Testar com um leitor de tela real (VoiceOver/NVDA) pelo menos na
   jornada principal (escolher livro → ler capítulo → grifar).

**C. Leitura offline de verdade** (7.3) — ✅ feito (2026-08-19)
1. ~~Levantar o que ainda depende de rede na leitura~~ — achado que a
   leitura de capítulo no web sempre dependia da `bible-api.com`
   (`buscarReferencia` só usava a base local pro nativo; no web só
   tinha um cache LRU de 200 capítulos já visitados, via AsyncStorage —
   não era a Bíblia inteira offline). A busca "Na Bíblia" no web
   também sempre retornava vazio.
2. ~~Portar a leitura de capítulo do web pro mesmo padrão~~ — feito:
   novo `core/biblia/leituraLocalWeb.ts` lê `assets/biblia.json`
   direto (mesmo carregador cacheado de `buscaGlobalWeb.ts`, extraído
   pra `core/biblia/bibliaLocalWeb.ts`); `buscarReferencia` tenta local
   primeiro, cai pra `bible-api.com` só se a busca local falhar
   (rede de segurança, não caminho principal).
3. ~~Testar a jornada principal com a rede desligada de propósito~~ —
   verificado que a leitura de capítulo (`/biblia/19-salmos/23`, entre
   outros) e a busca "Na Bíblia" não geram **nenhuma** requisição pra
   `bible-api.com` (conferido na aba de rede do navegador); Metro
   inclusive faz code-splitting de verdade dos módulos novos em chunks
   `lazy=true` separados (`leituraLocalWeb.bundle`,
   `buscaGlobalWeb.bundle`, `assets/biblia.bundle`), carregados só sob
   demanda — não inflam o bundle inicial.
   **Ainda depende de rede:** só o carregamento inicial do app (os
   próprios bundles JS) e, se a busca local falhar por algum motivo
   inesperado, o fallback pra API externa.

**D. Auditoria de performance** (7.4, hoje parcial)
1. Medir tempo de carregamento inicial (web) e tamanho do bundle.
2. Verificar se há re-renders desnecessários nas telas com listas
   grandes (grade de capítulos de Salmos, lista de 66 livros).
3. Registrar achados em `FUNCIONALIDADES.md` mesmo que a conclusão
   seja "sem problema real encontrado" (como já aconteceu com 9.9).

**E. Pré-renderização estática por rota (SEO)** (7.1) — investigado
(2026-08-19), **não ativado ainda** por risco de quebrar a navegação
em produção sem conseguir testar o suficiente neste ambiente.
1. ~~Levantar a configuração atual~~ — confirmado: sem `web.output` no
   `app.json`, o Expo Router usa o padrão `"single"` (um `index.html`
   só, SPA pura).
2. ~~Avaliar `output: "static"`~~ — testado de verdade
   (`npx expo export --platform web` com `"output": "static"`
   temporariamente no `app.json`). Precisou instalar
   `@expo/metro-runtime` (faltava, erro de bundling sem ele — já
   adicionado ao `package.json`, é inofensivo mesmo sem `static`
   ativo). Gera 23 rotas com HTML próprio — todas as telas "hub"
   (Início, Bíblia, Descubra, Você, Salvo, Sobre, Medalhas,
   Estatísticas, Configurações, índice de Planos, índice de Resumos)
   ganham SEO de verdade.
3. **Achado real, por que não ativar ainda sem mais cuidado:** as
   rotas dinâmicas (`/resumos/[livro]`, `/biblia/[livro]/[capitulo]`,
   `/planos/[id]`) geram um arquivo `[livro].html`/`[capitulo].html`
   **literal** (nome de arquivo com colchetes) — confirmado inspecionando
   o HTML gerado: é uma casca vazia (sem conteúdo do livro, porque
   nenhum `slug` real foi passado em build). Pra virar conteúdo de
   verdade indexável (o objetivo real deste item — cada capítulo/resumo
   sendo achado pelo Google), precisaria de `generateStaticParams`
   enumerando cada um dos 66 livros × até ~176 capítulos (mais de 1200
   páginas) — build bem maior, ainda não avaliado se vale a pena vs. o
   ganho de SEO real.
4. **Bloqueio prático:** hospedagem estática "pura" (Vercel incluso)
   não sabe rotear `/resumos/genesis` pro arquivo `[livro].html`
   sozinha — isso depende de regra de rewrite específica, e o
   `vercel.json` atual manda **tudo** pro `index.html`
   (`"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`),
   o que anularia o ganho das 23 rotas estáticas se ativado sem
   ajustar isso também. Testei localmente com `serve -s` (SPA
   fallback), que não é 100% idêntico ao comportamento de rewrite do
   Vercel — não tenho confiança suficiente pra mudar `vercel.json` e
   fazer push sem um jeito de testar num preview deploy de verdade
   antes (mudar isso errado quebraria a navegação de todo o app em
   produção). **Revertido** o `app.json` de volta pro padrão por
   segurança; `@expo/metro-runtime` ficou instalado (não atrapalha,
   já é o primeiro passo pra quando isso for retomado).
5. Próximo passo, se/quando retomar: decidir se vale o build maior com
   `generateStaticParams`, e testar a mudança de `vercel.json` num
   preview deploy do Vercel (não direto em produção) antes de mesclar
   pra `master`.

### Decisões do usuário (2026-08-19)

- **F. Trocar tradução do texto bíblico** (2.9) — **decidido: não por
  enquanto.** Continua só Almeida ACF (domínio público), sem pagar por
  licença de outra tradução. Item fechado, fora do radar até o usuário
  pedir de novo.
- **G. Criar conta / login** (6.1-6.3) — **decidido: sem conta de
  verdade por enquanto.** Em vez disso, perfil local (nome + foto)
  editável, guardado por `ownerId` anônimo (AsyncStorage no web,
  SQLite no nativo) — ver `core/repositories/PerfilRepository.ts`,
  feito em 2026-08-19. Pronto pra virar perfil de conta de verdade
  depois, sem mudar quem consome isso.
- **H. Notificação diária do versículo do dia** (9.10) e
  **notificações push** (8.2) — **decidido: sem notificação real por
  enquanto.** Fechado, sem versão simplificada via lembrete local
  também (o usuário optou por não fazer nem essa por ora).
- **I. Publicar nas lojas de app** (8.1) — **decidido: não publicar
  por enquanto.**

### 🟢 Preparar o repositório pra ficar público (2026-08-19)

O usuário vai tornar o repositório GitHub público (hoje privado) —
pediu pra preparar tudo da melhor forma possível antes disso.
1. ~~Auditoria de segredos~~ — feito: nenhum arquivo de segredo/chave
   foi commitado em nenhum momento do histórico do git (`git log --all
   --diff-filter=A`), e não há chaves/tokens hardcoded no código atual
   (só falsos positivos em `assets/biblia.json`/`livros.json`, texto
   bíblico normal contendo a palavra "token" por coincidência).
2. Atualizar `LICENSE` — hoje ainda é o padrão MIT do template do
   Expo (copyright "650 Industries, Inc."), não reflete a autoria real
   do projeto.
3. Melhorar o `README.md` com uma screenshot/GIF do app e o link do
   deploy no Vercel — quem avalia portfólio raramente clona e roda
   localmente.

### Como isso deve ser lido

Ao começar qualquer item da lista 🟢: mover a marcação em
`FUNCIONALIDADES.md` de `⬜`/`🔶` pra `🔶`/em andamento, documentar o que
foi feito e testado (mesmo padrão já seguido em todo o resto do
documento), e atualizar este arquivo riscando a microtarefa concluída.
Itens 🔴 ficam registrados aqui pra não se perderem, mas não devem ser
iniciados sem a decisão correspondente do usuário.
