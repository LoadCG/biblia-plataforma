# Plano: navegação por abas e redesenho de UI (inspirado no app de Bíblia mais baixado)

Status: **planejamento** — nada deste documento está implementado ainda.

Este documento substitui a primeira versão do plano de navegação (4
abas genéricas: Início/Leitura Bíblica/Grifos e Notas/Configurações).
A estrutura abaixo é mais específica, desenhada em cima do app de
Bíblia mais baixado da Play Store como referência direta de UX, com
adaptações pro que já existe neste projeto.

## As 4 abas

1. **Início** — versículo do dia, entrada pros resumos, sequência de
   leitura (streak), conquistas.
2. **Bíblia** — leitura contínua, começa de onde parou.
3. **Pesquisa** — busca por palavra (na Bíblia e nos resumos) + temas
   pré-definidos.
4. **Você** — perfil, salvos (grifos/notas/pesquisas), atividade
   recente, entrada pra Configurações.

**Configurações não é uma aba própria** — é uma tela alcançada por um
card no fim da aba "Você". Reduz de 5 pra 4 seções de primeiro nível
(mais alinhado ao padrão de app de referência: poucas abas, cada uma
com propósito claro).

---

## Diretrizes de design (a aplicar em toda tela nova ou redesenhada)

O pedido é elevar o nível visual seguindo padrões estabelecidos
(Material Design do Google é a referência mais direta pra Android/web).
Traduzindo em regras concretas pra esse projeto:

- **Bordas mais arredondadas e consistentes.** Hoje o raio varia
  (`rounded-lg`, `rounded-xl`, `rounded-full` misturados sem critério).
  Padronizar: `rounded-2xl` (16px) pra cards de conteúdo, `rounded-full`
  só pra pills/botões de ação (como já é usado), `rounded-lg` (8px) só
  pra elementos pequenos dentro de um card (ex. badge de gênero).
- **Elevação em vez de só borda.** Cards hoje são delimitados só por
  `border`. Material usa sombra sutil pra indicar hierarquia/profundidade
  — trocar `border` por uma sombra leve (`shadow-sm`) nos cards
  principais (Início, Salvo, Conquistas), mantendo borda fina só onde
  fizer sentido separar visualmente (ex. divisórias de lista).
- **Contraste.** Auditar `cor-texto-suave`/`cor-texto-suave-dark` contra
  os fundos (`cor-fundo-elevado`) pra garantir mínimo WCAG AA (4.5:1)
  — hoje não foi medido formalmente. Fazer essa auditoria antes de
  finalizar qualquer novo componente com texto suave sobre card.
- **Ícones consistentes em vez de emoji solto.** Hoje o app mistura
  emoji como ícone (✎ grifar, 🗒 nota, 🎯 conquista). Expo já inclui
  `@expo/vector-icons` (não é uma dependência nova pra instalar, já vem
  no SDK) com o conjunto Material Icons — trocar os emoji-ícone por
  `MaterialIcons`/`MaterialCommunityIcons` dá consistência visual real
  sem custo de instalação. Emoji continuam onde são conteúdo mesmo
  (📝 antes do texto de uma nota, por exemplo), não como ícone de botão.
- **Minimalismo**: espaçamento generoso, uma ação primária óbvia por
  card, hierarquia tipográfica clara (título/corpo/legenda com pesos
  diferentes, não só tamanhos).

---

## Aba 1 — Início

Ordem de cima pra baixo:

### 1. Versículo do dia
Já existe (`CardVersiculoDia`). Adicionar botão **"Envie-me
diariamente"** — opt-in de notificação diária com o versículo do dia.

**Isto fica em segundo plano por enquanto** (conforme pedido) porque
depende de infraestrutura que ainda não existe:
- **Web:** Notification API + Service Worker (o projeto já tem um SW
  básico do PWA antigo que pode ser estendido) + um agendador do lado
  do servidor pra disparar no horário certo — não dá pra agendar
  "todo dia às 8h" só no cliente de forma confiável.
- **App:** `expo-notifications` (push nativo) + o mesmo agendador de
  servidor.
- Os dois casos convergem pra precisar de **conta de usuário + backend
  com agendamento** — que já está listado como "em aberto" no
  PLANO-PLATAFORMA.md. Fica registrado aqui como item de backlog
  (ver seção "Notificações" mais abaixo), não bloqueia o resto deste
  plano.

### 2. Card "Estude por resumos"
Card único, estilo destaque, com título "Estude por resumos" e
subtítulo "66 Livros bíblicos". Tocar leva pra tela de resumos (a
lista de 66 livros que hoje é o conteúdo principal da home passa a
viver atrás desse card, não solta na tela).

**Mudança de arquitetura:** a lista de livros com busca (hoje em
`app/index.tsx`) migra pra dentro do fluxo de resumos, alcançada a
partir deste card — a Início deixa de ser "a lista de livros" e passa
a ser "o painel de entrada".

### 3. Card de sequência (streak)
Design simples: número grande em cima (dias seguidos), abaixo um SVG
animado de fogo:
- **Cinza e estático** quando `sequencia === 0`.
- **Colorido e animado** quando `sequencia >= 1`, com mensagem
  motivacional variando por faixa (ex. "Você está pegando o ritmo" pra
  poucos dias, "Sequência forte!" pra mais).

A lógica de cálculo já existe (`core/estatisticas/streak.ts`,
`calcularSequenciaAtual`) — o que falta é o componente visual (SVG
animado) e a tabela de mensagens por faixa. SVG animado simples dá pra
fazer com `react-native-svg` (já é dependência do Expo Router, não
precisa instalar nada novo) usando uma animação de opacidade/escala em
loop nas "línguas" do fogo — não precisa de Lottie nem asset externo
pra essa primeira versão.

### 4. Card de conquistas (medalhas)
Mostra os selos já conquistados, com **botão de expandir** pra ver
todas as conquistas possíveis — cada uma com nome próprio, breve
descrição de como conseguir, e **barra de progresso**.

**Mudança de dados necessária** em `core/content/conquistas.ts`: o tipo
`Conquista` hoje só tem `{id, titulo, icone, conquistada}` (booleano).
Precisa virar:
```ts
type Conquista = {
  id: string;
  titulo: string;          // nome próprio, ex. "Fundamentos da Fé"
  descricao: string;       // "Leia os 5 livros do Pentateuco"
  icone: string;
  progressoAtual: number;  // ex. 3
  progressoTotal: number;  // ex. 5
  conquistada: boolean;    // progressoAtual >= progressoTotal
};
```
Isso também é o que a versão da conquista na aba "Você" (mais abaixo)
vai consumir — mesma fonte de dado, dois componentes visuais
diferentes.

---

## Aba 2 — Bíblia

Comportamento: **abre direto no último capítulo que a pessoa estava
lendo**, não numa tela de escolha.

**Dado novo necessário:** não existe hoje um registro de "última
leitura". Criar `core/leitura/ultimaLeitura.ts` (mesmo padrão de
`preferenciaFonte.ts`: `carregarUltimaLeitura()`/`salvarUltimaLeitura(livroSlug,
capitulo)`), gravado toda vez que a tela de capítulo monta. Se não
houver nada salvo (primeira vez), cair em Gênesis 1.

**Navegação fixa embaixo:** uma barra fixa no rodapé da tela de
leitura com `← Nome do Livro →`:
- As setas trocam de capítulo (já existe essa lógica em
  `[capitulo].tsx`, hoje como dois cards "Anterior/Próximo" no fim da
  página — passa a virar uma barra fixa sempre visível, não algo que só
  aparece ao rolar até o fim).
- Tocar no **nome do livro** (centro da barra) abre a tela de escolher
  livro → depois capítulo → depois versículo (o fluxo que já existe em
  `/biblia/index.tsx` → `/biblia/[livro]/index.tsx`), como um fluxo
  modal/empilhado por cima da leitura atual.

Isso substitui a barra de "Anterior/Próximo no fim da página" atual
por uma barra sempre acessível, sem precisar rolar — mais alinhado ao
padrão do app de referência.

---

## Aba 3 — Pesquisa

Duas funcionalidades distintas nesta aba, com complexidade bem
diferente — importante não misturar no planejamento:

### 3a. Busca por palavra-chave no texto bíblico inteiro
**Esta é a peça tecnicamente mais pesada de todo o plano.** Hoje o
texto bíblico só é buscado por referência (`Livro Capítulo:Versículo`)
via bible-api.com — não existe (e a API não oferece) busca por palavra
dentro do texto. Pra "pesquisar 'cordeiro' e ver sugestões de
versículos que citam a palavra", é necessário um **índice de texto
completo da Bíblia**, gerado previamente:

- Gerar uma vez (script novo, rodado localmente, não em toda build):
  buscar os 1.189 capítulos via bible-api.com (a mesma API já usada),
  montar um índice invertido (palavra normalizada → lista de
  referências de versículo) e salvar como JSON versionado no repositório
  (mesmo padrão de `core/content/dados/livros.json` — gerado por
  script, nunca editado à mão).
- Tamanho esperado do índice é uma incógnita real até gerar de
  verdade — a Bíblia inteira em português tem ~750 mil palavras;
  mesmo com um índice invertido compacto, isso pode passar de alguns
  MB. **Decisão a tomar durante a implementação, não antes:** se o
  índice inteiro for pesado demais pro bundle web, considerar carregar
  sob demanda (fetch do JSON só quando a aba Pesquisa abre, não no
  bundle inicial) em vez de importar estático.
- Rate limit da bible-api.com (~15 req/30s, documentado na Decisão 4 do
  PLANO-PLATAFORMA.md) significa que gerar esse índice localmente leva
  um tempo real (1.189 capítulos ÷ 15 a cada 30s ≈ 40 minutos) — rodar
  uma vez, versionar o resultado, não regenerar em toda build.

Por causa desse tamanho, **recomendo tratar a busca de texto bíblico
como uma sub-entrega própria**, com sua própria sessão de planejamento
técnico quando for a vez de implementar — este documento só deixa
registrada a abordagem (índice gerado por script, não busca ao vivo
via API).

### 3b. Cards de tema
Abaixo da barra de busca: cards coloridos, cada um com uma palavra-tema
("Amor", "Cura", "Ansiedade", "Raiva", "Alegria"...). Tocar num card
dispara uma busca pré-definida com termos relacionados ao tema.

Isso **não depende do índice de texto completo** — dá pra entregar
antes, de duas formas combináveis:
1. Termos relacionados buscados no conteúdo dos resumos (reaproveita
   `core/content/busca.ts`, já existe).
2. Uma lista curada de referências por tema (`core/biblia/temasBusca.ts`,
   novo — mapa tema → array de referências bíblicas conhecidas sobre o
   assunto, similar em espírito aos `REFERENCIAS_CURADAS` que já
   existem em `core/biblia/versiculoDoDia.ts`), buscadas via
   `buscarReferencia` (já existe) pra mostrar o texto de verdade.

Recomendação: **entregar 3b primeiro** (não depende do índice pesado),
deixar 3a pro backlog técnico com planejamento próprio.

---

## Aba 4 — Você

Ordem de cima pra baixo:

### 1. Cabeçalho de perfil
Foto (se logado), nome de usuário, @. **Depende de conta de usuário**
(seção 6 do FUNCIONALIDADES.md, ainda `⬜`) — fica com um estado
"visitante" enquanto não há login (mostrar algo como "Visitante" no
lugar do nome, sem quebrar o layout).

### 2. Card "Salvo" (prévia)
Prévia compacta dos grifos/notas mais recentes:
- Cada linha: **"Você grifou [Livro Capítulo:Versículo]"**, com data
  relativa curta (`3d`, `4sem`, `2mês`) — precisa de um helper novo,
  `core/util/tempoRelativo.ts`, formatando a partir do `criadoEm` que
  `Grifo`/`Nota` já gravam (não precisa mudar o schema pra isso).
- **Menu de três pontinhos** por item (aciona com clique no ícone no
  mobile, **e também com botão direito do mouse no desktop/web** —
  `onContextMenu` mapeado pro mesmo menu). Opções: **Ler** (abre o
  versículo), **Compartilhar**, **Resumo do livro**, **Copiar**,
  **Editar** (só faz sentido pra nota — abre `ModalNota` já existente),
  **Excluir**.
- Toca em "ver mais" (ou no card inteiro) → tela de Salvo completa.

### 3. Tela "Salvo" (completa, alcançada a partir do card acima)
Mesma lista, sem limite de itens, com **filtro por tipo**: Anotações /
Grifados / Pesquisas favoritas.

**"Pesquisas favoritas" é uma funcionalidade nova** que ainda não
existe em lugar nenhum do app — significa poder favoritar uma busca
feita na aba Pesquisa pra voltar a ela depois. Precisa de um
repositório novo seguindo o mesmo padrão dos outros
(`PesquisasFavoritasRepository`, local + trocável), guardando o termo
buscado e quando.

### 4. "Perseverança"
Mesmo streak da Início (mesmo dado, `calcularSequenciaAtual`), mesmo
SVG de fogo, mas em contexto de perfil — desenho mais compacto/list-item
em vez do card de destaque da Início.

### 5. "Compartilhamentos"
Contador de quantas vezes a pessoa compartilhou ou copiou qualquer
coisa do app (link, versículo, resumo). **Dado novo, não existe hoje**
— como a funcionalidade de compartilhar em si também não existe ainda
(seção 5 do FUNCIONALIDADES.md, `⬜`), este contador nasce junto com
ela: toda ação de compartilhar/copiar, onde quer que aconteça no app,
incrementa um contador simples e persistido
(`core/estatisticas/compartilhamentos.ts`, um `AsyncStorage` de
inteiro só, não precisa de repositório completo pra isso).

### 6. Card de conquistas (variante 2)
Mesmo dado de `calcularConquistas` (já estendido com
descrição/progresso, ver Início item 4), layout visual diferente —
dois componentes React consumindo a mesma função, não duas fontes de
verdade.

### 7. Seção "Atividade"
As **5 últimas** ações (grifo, nota ou pesquisa), mesmo menu de três
pontinhos do item "Salvo". Botão "Ver mais" leva pra tela de Salvo
completa (item 3 acima).

### 8. Card de Configurações
Botão simples no fim da aba, leva pra tela de Configurações (mantém o
que já estava planejado na primeira versão deste documento: tamanho de
fonte, fonte serifada, tema, com espaço reservado pras preferências
futuras — cores de grifo, contraste do modo escuro).

---

## Resumo do que precisa ser criado (novo, não existe hoje)

| Item | Onde | Complexidade |
|---|---|---|
| `core/leitura/ultimaLeitura.ts` | núcleo | baixa |
| `core/util/tempoRelativo.ts` | núcleo | baixa |
| `core/estatisticas/compartilhamentos.ts` | núcleo | baixa |
| `Conquista` com descrição + progresso | `core/content/conquistas.ts` | baixa (mudança de tipo + dados) |
| `core/biblia/temasBusca.ts` | núcleo | média (curadoria de conteúdo) |
| SVG de fogo animado (streak) | componente novo | média (animação) |
| `PesquisasFavoritasRepository` | repositório novo, padrão já estabelecido | média |
| Menu de 3 pontinhos com ações (ler/compartilhar/resumo/copiar/editar/excluir) + suporte a botão direito no web | componente novo | média |
| Funcionalidade de compartilhar de verdade (link/versículo/resumo) | ver seção 5 do FUNCIONALIDADES.md | média |
| Índice de busca por palavra no texto bíblico inteiro | script de geração + JSON versionado | **alta — sub-plano próprio** |
| Notificação diária (web push + app push) | precisa de backend/conta | **alta — depende de decisões em aberto do PLANO-PLATAFORMA.md, backlog explícito** |

---

## Revisão estratégica: pontos de UX avançada e riscos técnicos

Passagem crítica sobre o plano acima, antes de começar a implementar —
o que um app "profissional" de verdade precisa acertar e que ainda não
estava explícito nas seções anteriores.

### 1. Comportamento de navegação (pilha, modais, botão voltar)

O plano usa "abre por cima" em dois lugares (livro→capítulo→versículo
a partir da Bíblia, e Salvo/Configurações a partir de Você) sem
especificar **como**. Isso importa porque muda o comportamento do
botão voltar (físico no Android, gesto no iOS, botão do navegador no
web) — três casos distintos:
- **Push normal** (`router.push`): entra na pilha, voltar volta pra
  tela anterior, empilha infinitamente se a pessoa for e voltar várias
  vezes.
- **Modal** (`presentation: "modal"` no Expo Router): desliza de baixo
  pra cima, tem affordance visual de "isto é temporário", geralmente
  com um jeito óbvio de fechar (X ou puxar pra baixo).
- **Replace** (`router.replace`): não empilha, útil quando trocar de
  capítulo não deveria acumular histórico.

**Decisão a registrar antes de implementar:** o seletor de
livro→capítulo→versículo (Bíblia) deveria ser **modal** — é uma
ferramenta de navegação temporária, não uma tela de conteúdo, e um
usuário trocando de capítulo 5 vezes seguidas não deveria conseguir
apertar voltar 5 vezes pra sair. A tela de leitura de capítulo em si
(trocar de capítulo pelas setas `←/→`) deveria ser **replace**, pelo
mesmo motivo (ler 20 capítulos seguidos não pode virar uma pilha de 20
telas). Configurações e Salvo, alcançadas a partir de "Você", são
**push normal** (são destinos, não ferramentas temporárias).

### 2. Estados vazios, de carregamento e de erro — sistematicamente, não caso a caso

O plano menciona estado vazio pontualmente (Salvo, Atividade). Isso
precisa virar um **padrão único reaproveitado**, não um texto
diferente inventado em cada tela nova:
- Um componente `EstadoVazio` (título curto + descrição de uma linha +
  ação sugerida, ex. "Nada grifado ainda" → "Toque em ✎ durante a
  leitura"), usado em Salvo, Atividade, resultado de Pesquisa sem
  match, e no futuro Pesquisas Favoritas.
- Loading: hoje cada tela nova (`estatisticas.tsx`, `[capitulo].tsx`)
  trata o "ainda carregando" com um `ActivityIndicator` solto ou
  `null`. Com 4 abas carregando dado assíncrono (streak, conquistas,
  salvos, última leitura) ao mesmo tempo na Início, um `ActivityIndicator`
  por card é melhor que a tela inteira "pipocar" conforme cada
  `useEffect` resolve — usar **skeleton simples** (retângulo com
  opacidade pulsante do tamanho do card final) evita o layout pulando
  de tamanho quando o dado chega.
- Erro: a leitura de capítulo já trata falha da bible-api.com com
  mensagem amigável (padrão bom, replicar). Isso precisa se estender
  pro índice de busca (3a) e pras novas chamadas de rede — nenhuma
  tela nova deveria quebrar a UI inteira por uma falha de rede pontual.

### 3. Migração de dados já salvos no dispositivo (schema evolution)

Duas mudanças de schema estão implícitas no plano e **quebram dados já
salvos** se não forem tratadas com cuidado:
- `Grifo` ganha campo `cor` (9.8) — grifos já salvos no
  `AsyncStorage` de quem já usa o app não têm esse campo. O código que
  lê precisa tratar `cor` ausente como um valor padrão (ex.
  `"amarelo"`), nunca assumir que existe.
- `Conquista` muda de `{conquistada: boolean}` pra incluir
  `progressoAtual`/`progressoTotal` — como `Conquista` é **calculada em
  tempo real** (não persistida — `calcularConquistas` roda toda vez a
  partir dos livros lidos), isso na verdade não tem risco de migração:
  não há um "`Conquista` antigo" salvo em disco pra ficar incompatível.
  Vale confirmar essa distinção durante a implementação (dado
  persistido vs. dado derivado) porque o tratamento é bem diferente.

**Regra geral a adotar:** todo campo novo em um tipo que é persistido
(`Grifo`, `Nota`, e futuros `PesquisaFavorita`) precisa ser opcional na
leitura, com fallback explícito — nunca assumir presença.

### 4. Acessibilidade além do contraste

O plano já cobre contraste de cor. Falta:
- **Alvo de toque mínimo** de 44×44px (padrão iOS/Material) em todo
  ícone tocável novo — o menu de 3 pontinhos, os botões A-/A+/Aa
  atuais já seguem isso (`w-7 h-7` = 28px é **menor** que o
  recomendado, na verdade — vale corrigir pra `w-10 h-10` quando essas
  telas forem revisitadas).
- **`accessibilityLabel`** em todo ícone sem texto ao lado (o menu de 3
  pontinhos, o SVG de fogo) — hoje só `BotaoTema` tem isso, o padrão
  precisa se replicar pros componentes novos.
- **Ordem de foco / leitor de tela** na barra de navegação fixa da
  Bíblia — setas + nome do livro precisam ter uma ordem de leitura
  sensata (2.7 do FUNCIONALIDADES já lista "navegação só por
  teclado/leitor de tela" como pendente; este plano não resolve
  sozinho, mas não pode piorar).

### 5. Menu de contexto no web: não sequestrar o botão direito sem alternativa

O plano pede que o menu de 3 pontinhos "funcione também com botão
direito no desktop". Cuidado de UX real aqui: **substituir o menu de
contexto nativo do navegador remove funções que o usuário espera**
(ex. "Inspecionar elemento" pra quem depura, ou simplesmente abrir o
menu do sistema por engano). Recomendação: `onContextMenu` só deveria
interceptar o clique direito **quando o alvo é especificamente o card
de um item salvo/atividade** (não a página inteira), e mesmo assim
coisas como copiar texto selecionado continuam funcionando por cima —
testar explicitamente que isso não incomoda ao usar o app em desktop
de verdade, não só simular o clique.

### 6. Orçamento de performance (o app está crescendo rápido)

O bundle web já passa de 1MB (item 7.4 do FUNCIONALIDADES.md, ainda
não auditado). Este plano adiciona: `@expo/vector-icons` (ícones —
peso pequeno se importar só os ícones usados, não o pacote inteiro),
SVG animado (leve), e principalmente o **índice de busca de texto
completo** (3a), que pode ser a maior adição de peso do projeto até
agora. Antes de 3a entrar em implementação, rodar a auditoria de
performance (7.4) já vira **pré-requisito**, não só um item solto do
checklist — sem isso não dá pra saber se o índice deveria carregar sob
demanda ou não (o plano já levanta essa dúvida, aqui só formaliza que
7.4 precisa acontecer antes, não depois).

### 7. Consistência entre "streak" em dois lugares (Início e Você)

O plano pede dois componentes visuais diferentes pro mesmo dado
(streak) e pra conquistas. Risco real: divergir com o tempo (alguém
ajusta a mensagem motivacional num lugar e esquece do outro). Mitigar
extraindo a **lógica de mensagem/faixa** (não só o cálculo numérico)
pra uma função pura compartilhada (`core/estatisticas/mensagemStreak.ts`,
por exemplo) que os dois componentes chamam — os componentes diferem
só em layout, nunca em "qual mensagem mostrar pra qual faixa de dias".

### 8. Onboarding da primeira visita

Nenhuma tela nova do plano considera **a primeira vez que alguém abre
o app**: Início mostra streak zerado, conquistas todas bloqueadas,
Salvo vazio, Bíblia caindo em Gênesis 1 por padrão. Isso é aceitável
como comportamento de dado (nada quebra), mas do ponto de vista de
UX avançada, a primeira visita é o momento de maior risco de abandono.
Recomendação pra quando chegar a hora: **não é preciso um onboarding
com telas de apresentação** (custo alto, taxa de abandono alta em
apps de referência) — mas os estados vazios do item 2 acima já cobrem
90% disso se forem bem escritos (o "Nada grifado ainda → toque em ✎"
já é, na prática, o onboarding).

### 9. Testabilidade e rollout de um escopo grande

Esse plano é o maior de uma vez até agora no projeto. Ao implementar,
manter a disciplina já estabelecida (tsc limpo, export limpo, teste
manual real no navegador antes de marcar `✅`) **por fase**, não no
fim de tudo — cada fase da lista de implementação já sugerida deveria
fechar com commit próprio e checklist atualizado, exatamente como
todo o histórico recente do projeto já fez. Registrado aqui só pra
deixar explícito que um plano grande não muda essa disciplina, reforça
a necessidade dela.

---

## Checklist de implementação

**Como usar:** este é o rastreador oficial de progresso deste plano —
para uso por mim ou por qualquer outro agente que continue o trabalho.

- No início de qualquer sessão de trabalho neste plano, **leia primeiro
  o bloco "Status atual" abaixo**, não a lista inteira, pra saber
  exatamente onde parar de ler e onde continuar.
- Ao concluir um item, marque `[x]` e, se relevante, adicione uma nota
  curta entre parênteses (ex. commit, decisão tomada, desvio do
  plano original).
- **Depois de cada item concluído, atualize o bloco "Status atual"**
  (fase em andamento + próximo passo concreto) — não deixe pra
  atualizar só no fim da fase.
- Testar de ponta a ponta antes de marcar `[x]` (mesmo padrão do
  FUNCIONALIDADES.md: funcionalidade primeiro, depois UX/UI, nunca
  marcar por só compilar).
- Se um item revelar que o plano precisa mudar, **edite a seção
  correspondente acima primeiro**, depois ajuste o checklist — o
  checklist reflete o plano, não o contrário.

### Status atual

- **Fase em andamento:** Fase 3 concluída — próxima é a Fase 4
  (Pesquisa, parte 3b: temas).
- **Concluído:** Fase 1 completa exceto 1.9; Fase 2 completa; Fase 3
  completa (3.1–3.6).
- **Pendente/adiado:** 1.9 (barra lateral no desktop); ajuste fino do
  item 3.5 (modal não cobre a barra de abas no web, só no nativo —
  funcional, só não 100% visualmente).
- **Dependências novas instaladas nesta sessão** (nenhuma vinha
  incluída por padrão, ao contrário do que o plano original assumia):
  `@expo/vector-icons` (Fase 1) e `react-native-svg` (Fase 2, streak).
- **Próximo passo:** começar Fase 4 (Pesquisa, parte 3b), item 4.1.

---

### Fase 1 — Casca de navegação (risco baixo, sem funcionalidade nova)

- [x] 1.1 Criar `app/(tabs)/_layout.tsx` com as 4 abas (Início, Bíblia,
      Pesquisa, Você). Pesquisa e Você entraram como telas placeholder
      "Em breve" (conteúdo real nas Fases 4 e 5).
- [x] 1.2 Mover `app/index.tsx` pra dentro do group
      (`app/(tabs)/index.tsx`), `/` continua funcionando.
- [x] 1.3 Mover `app/biblia/index.tsx` e `app/biblia/[livro]/index.tsx`
      pra dentro do group. **Achado durante a implementação:** sem um
      `app/(tabs)/biblia/_layout.tsx` (Stack), o Expo Router expunha a
      rota aninhada `[livro]/index` como uma 5ª aba solta em vez de
      empilhar dentro da aba "Bíblia" — criado esse layout extra pra
      corrigir; confirmado no navegador que voltou a mostrar exatamente
      4 abas.
- [x] 1.4 Decisão de pilha de navegação registrada na seção "Revisão
      estratégica" item 1 (modal para o seletor, replace pra troca de
      capítulo). A implementação real desses modos de apresentação fica
      pra Fase 3 (item 3.5), quando a barra fixa for construída — por
      ora a navegação usa push padrão, que já funciona corretamente.
- [x] 1.5 `@expo/vector-icons` **não vinha incluso** por padrão neste
      projeto (a suposição original do plano estava errada) — instalado
      via `npx expo install @expo/vector-icons`. Usado por enquanto só
      nos ícones da barra de abas (`MaterialIcons`: home/menu-book/
      search/person). **Achado de performance:** importar do barrel
      (`import { MaterialIcons } from "@expo/vector-icons"`) inflou o
      bundle web de 1.5MB pra 2MB (empacotava as fontes de todas as
      famílias de ícone); trocado pra import direto do subcaminho
      (`@expo/vector-icons/MaterialIcons`), bundle final: 1.6MB — só
      +100KB pela fonte realmente usada. **Registrar como padrão
      obrigatório** pra qualquer uso futuro de `@expo/vector-icons`
      neste projeto. Troca de emoji-ícone por ícone nas telas de
      conteúdo (grifar, nota, etc.) **não foi feita ainda** — escopo
      reduzido só à barra de abas nesta fase; ver nota em 1.6 abaixo.
- [x] 1.6 Passe de bordas/sombra aplicado à tela de escolher livro
      (`app/(tabs)/biblia/index.tsx`, `CardLivro`: `rounded-2xl` +
      sombra sutil no lugar de `border`). **Escopo reduzido
      deliberadamente:** não varri todo o app nesta fase — o card de
      livros da Início antiga será reconstruído do zero na Fase 2 (vira
      o card "Estude por resumos"), então redesenhar o card atual ali
      seria trabalho descartado. O resto do app recebe o mesmo
      tratamento conforme cada tela for reconstruída nas próximas
      fases, não numa varredura solta agora.
- [x] 1.7 Criado `components/EstadoVazio.tsx`, já em uso no estado vazio
      da busca de livros (`app/(tabs)/biblia/index.tsx`).
- [x] 1.8 Botões A-/A+/Aa das duas telas de leitura (capítulo e resumo)
      aumentados de 28px (`w-7 h-7`) pra 40px (`w-10 h-10`) — perto do
      mínimo recomendado de 44px, mantendo o cabeçalho compacto; e
      `accessibilityLabel` adicionado nos três.
- [ ] 1.9 Adaptação desktop: barra lateral em vez de bottom tabs acima
      do breakpoint (~768px). **Adiado nesta sessão** — durante a
      implementação, ficou claro que o Expo Router/React Navigation
      instalado neste projeto não expõe um `@react-navigation/bottom-tabs`
      isolado (não encontrado em `node_modules`), então a rota mais
      segura pra um layout de barra lateral de verdade é um componente
      de navegação **customizado** (não uma opção pronta tipo
      `tabBarPosition`), trocado condicionalmente por `useWindowDimensions`
      no lugar do `<Tabs>` do Expo Router acima do breakpoint. Isso é
      trabalho arquitetural genuíno (não um ajuste de estilo), então foi
      separado como item próprio a retomar com atenção dedicada, em vez
      de arriscar uma implementação apressada e não testada de verdade
      em telas largas.
- [x] 1.10 `tsc --noEmit` limpo, `expo export --platform web` limpo
      (1.6MB), teste manual navegando pelas 4 abas no navegador em
      viewport mobile (confirmado: 4 abas exatas, sem a 5ª aba fantasma
      de antes de 1.3; tab bar aparece nas 4 telas principais e some
      corretamente nas telas de detalhe — leitura de capítulo e
      resumo; zero erros de console). **Teste em desktop não feito**
      (consequência direta de 1.9 estar adiado — nada pra testar de
      diferente ainda nesse viewport). Marcar 9.1 como `🔶` (não `✅`)
      no FUNCIONALIDADES.md — a descrição de 9.1 inclui a adaptação
      desktop, que ainda não existe.

### Fase 2 — Início

- [x] 2.1 Decidido: reaproveitar `/resumos` como lista (não uma rota
      nova) — criado `app/resumos/index.tsx` com a lista de livros +
      busca que antes vivia na Início; `app/resumos/[livro].tsx`
      (detalhe de um livro) continua igual. Card "Estude por resumos"
      na Início linka pra `/resumos`.
- [x] 2.2 Criado `core/estatisticas/mensagemStreak.ts`.
- [x] 2.3 Criado `components/FogoStreak.tsx` (`react-native-svg`
      instalado — **não vinha incluso**, mesma situação de
      `@expo/vector-icons` na Fase 1). **Bug real encontrado e
      corrigido:** animar o componente `Svg` diretamente via
      `Animated.createAnimatedComponent(Svg)` gera um erro de console
      no web ("non-boolean attribute `collapsable`") e quebra a
      renderização depois de um refresh de cache — corrigido animando
      um `Animated.View` por fora e deixando o `Svg` interno estático.
      **Registrar como padrão:** nunca envolver `Svg` diretamente em
      `Animated.createAnimatedComponent` neste projeto: animar um
      `Animated.View` wrapper.
- [x] 2.4 Criado `components/CardStreak.tsx`. Testado com dado real via
      injeção de `capitulos-lidos` no `localStorage`: sequência de 2
      dias mostrou "2" e a mensagem certa da faixa 2-4
      ("Você está pegando o ritmo").
- [x] 2.5 `Conquista` estendida com `descricao`/`progressoAtual`/
      `progressoTotal` em `core/content/conquistas.ts`; títulos também
      viraram nomes próprios (ex. "Fundamentos da Fé" no lugar de
      "Pentateuco completo").
- [x] 2.6 Criado `components/CardConquistas.tsx` (compacto por padrão,
      expande com botão "Ver todas" mostrando descrição + barra de
      progresso por conquista). **Removido `components/FaixaConquistas.tsx`**
      (versão antiga, sem progresso) — só era usado na Início, que foi
      reescrita; nenhum código morto deixado pra trás.
- [x] 2.7 Botão "🔔 Envie-me diariamente" adicionado a
      `CardVersiculoDia`, `disabled` com rótulo "em breve".
- [x] 2.8 `tsc --noEmit` limpo, `expo export --platform web` limpo
      (1.6MB). Teste manual completo: streak em 0 (mensagem/ícone cinza)
      e em 2 (colorido, mensagem certa); conquistas 0/6 e 2/6 (Primeiro
      Passo + Pentateuco, testado com 5 livros do Pentateuco marcados
      como lidos); expandir/ocultar conquistas funcionando; navegação
      Início → "Estude por resumos" → `/resumos` → `/resumos/01-genesis`
      confirmada; zero erros de console (depois do fix do 2.3); dado de
      teste limpo do `localStorage` ao final. Marcar 9.2 como `✅` no
      FUNCIONALIDADES.md.

### Fase 3 — Bíblia

- [x] 3.1 Criado `core/leitura/ultimaLeitura.ts`.
- [x] 3.2 Gravado no mount da tela de capítulo (`useEffect` dedicado).
- [x] 3.3 `app/(tabs)/biblia/index.tsx` virou uma tela de redirect: lê
      `ultimaLeitura` e faz `router.replace` pra rota de leitura de
      verdade (fora do group de abas). **Decisão que emergiu na
      implementação, não prevista em detalhe no plano original:** o
      picker de livro/capítulo (antes em `app/(tabs)/biblia/index.tsx`
      e `[livro]/index.tsx`) precisou se mudar pra
      `app/(tabs)/biblia/escolher/` — senão a rota-índice da aba
      ficaria disputada entre "mostrar a lista" e "redirecionar pra
      última leitura".
- [x] 3.4 Barra fixa `← {Livro} {Capítulo} →` no rodapé da leitura
      (substitui os cards de Anterior/Próximo do fim da página).
      Setas usam `router.replace` (não empilham histórico por
      capítulo, decisão 1.4); tocar no nome do livro abre
      `/biblia/escolher/[livro]`.
- [x] 3.5 Seletor configurado com `presentation: "modal"` no
      `app/(tabs)/biblia/_layout.tsx`. **Limitação encontrada e
      registrada, não escondida:** no web, a apresentação modal do
      React Navigation não cobre visualmente a barra de abas embaixo
      (ela continua visível atrás do seletor) — diferente do
      comportamento nativo (iOS/Android), onde modal cobre a tela
      inteira de verdade. Funcionalmente tudo funciona (navegação,
      seleção de capítulo, voltar), só o efeito visual "cobre tudo" não
      é 100% no web. Registrado como ajuste fino a revisitar, não
      bloqueia a Fase 3.
- [x] 3.6 `tsc --noEmit` limpo, `expo export --platform web` limpo
      (1.6MB). Teste manual completo no navegador: abrir `/biblia` cai
      em Gênesis 1 (primeira vez); "Próximo capítulo" via `replace`
      confirmado (URL muda pra Gênesis 2, sem crescer o histórico
      indevidamente); tocar no nome do livro abre o seletor de
      capítulos, escolher capítulo 6 navega certo; reabrir `/biblia`
      depois disso cai direto em Gênesis 6 (persistência confirmada);
      zero erros de console em todo o fluxo. Marcar 9.3 como `✅` no
      FUNCIONALIDADES.md.

### Fase 4 — Pesquisa (parte 3b: temas)

- [ ] 4.1 Criar `core/biblia/temasBusca.ts` com a lista curada de temas
      e referências.
- [ ] 4.2 Barra de busca em destaque no topo (reaproveita
      `core/content/busca.ts` pro resumo, e `buscarReferencia` pro
      texto de temas).
- [ ] 4.3 Cards coloridos de tema, grid ou lista horizontal.
- [ ] 4.4 Resultado da busca por tema mostra o texto de verdade dos
      versículos sugeridos (não só a referência).
- [ ] 4.5 `tsc`/`export` limpos, teste manual (buscar por palavra,
      tocar em card de tema, estado vazio sem resultado), commit +
      push, marcar 9.4 como `✅`.
- [ ] 4.6 **(Backlog, sub-plano próprio — não bloqueia o resto)**
      Planejar e gerar o índice de busca de texto completo (9.5) —
      só depois da auditoria de performance (7.4) ter rodado.

### Fase 5 — Você

- [ ] 5.1 Cabeçalho de perfil com estado "Visitante".
- [ ] 5.2 Criar `core/util/tempoRelativo.ts`.
- [ ] 5.3 Criar componente de menu de 3 pontinhos (ações: Ler,
      Compartilhar, Resumo do livro, Copiar, Editar, Excluir) com
      suporte a clique direito escopado ao card (seção "Revisão
      estratégica" item 5, não a página inteira).
- [ ] 5.4 Card "Salvo" (prévia) na aba Você, usando `EstadoVazio` (1.7)
      quando não houver nada.
- [ ] 5.5 Tela "Salvo" completa com filtro Anotações/Grifados/Pesquisas
      favoritas.
- [ ] 5.6 Criar `PesquisasFavoritasRepository` (interface + implementação
      local, mesmo padrão dos outros repositórios) — depende da
      funcionalidade de pesquisa (Fase 4) já existir pra fazer sentido
      favoritar uma busca.
- [ ] 5.7 Seção "Perseverança" (reaproveita streak + `mensagemStreak`
      de 2.2, layout compacto).
- [ ] 5.8 Criar `core/estatisticas/compartilhamentos.ts` (contador
      simples) — **depende de compartilhar de verdade existir**
      (seção 5 do FUNCIONALIDADES.md, ainda não planejada em detalhe;
      avaliar se entra nesta fase ou fica registrada como
      pré-requisito bloqueante antes de 5.8/5.9).
- [ ] 5.9 Card de conquistas variante 2 (mesmo dado de 2.5/2.6, layout
      diferente).
- [ ] 5.10 Seção "Atividade" (5 últimas ações + botão "ver mais" pra
      Salvo).
- [ ] 5.11 Card de Configurações (link pra Fase 6).
- [ ] 5.12 `tsc`/`export` limpos, teste manual completo (menu de 3
      pontinhos em todas as ações, filtros de Salvo, botão direito no
      desktop testado de verdade), commit + push, marcar 9.6 como `✅`.

### Fase 6 — Configurações

- [ ] 6.1 Tela de Configurações agrupada em seções (Leitura, Aparência,
      Dados), lendo/escrevendo `core/leitura/preferenciaFonte.ts` e o
      tema já existente (`core/theme.ts`) — sem duplicar lógica.
- [ ] 6.2 Placeholder "em breve" pras preferências futuras (cores de
      grifo, contraste).
- [ ] 6.3 `tsc`/`export` limpos, teste manual, commit + push, marcar
      9.7 como `✅`.

### Fase 7 — Backlog explícito (fora de escopo até serem retomados)

- [ ] 7.1 Busca de texto completo na Bíblia inteira (9.5) — sub-plano
      técnico próprio.
- [ ] 7.2 Notificação diária do versículo do dia (9.10) — depende de
      conta + backend com agendamento.
- [ ] 7.3 Grifar em várias cores (9.8).
- [ ] 7.4 Modo escuro mais contrastado (9.9).
- [ ] 7.5 Conta/login de verdade (seção 6 do FUNCIONALIDADES.md) —
      desbloqueia perfil real (5.1), compartilhamentos multi-dispositivo
      e notificações (7.2).
