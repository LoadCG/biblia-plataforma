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

## Fases de implementação sugeridas

1. **Casca de navegação**: 4 abas (Início/Bíblia/Pesquisa/Você) via
   `app/(tabs)/`, passe visual Material (bordas, elevação, ícones
   `@expo/vector-icons`) aplicado nos componentes que já existem, sem
   nenhuma funcionalidade nova ainda. Risco baixo, dá pra validar a
   navegação antes de construir conteúdo novo em cima.
2. **Início**: card de resumos, card de streak com SVG de fogo,
   conquistas com descrição/progresso. Botão "Envie-me diariamente"
   aparece desabilitado/como aviso de "em breve" (UI existe, ação não
   faz nada ainda — não implementar notificação de verdade nesta fase).
3. **Bíblia**: última leitura + barra fixa de navegação.
4. **Pesquisa (parte 3b)**: cards de tema com buscas pré-definidas.
   Parte 3a (índice de texto completo) fica pra depois, com
   planejamento técnico dedicado quando for a vez.
5. **Você**: perfil (com estado visitante), card Salvo + tela Salvo
   completa com filtros, menu de 3 pontinhos, Perseverança,
   Compartilhamentos (nasce junto com compartilhar de verdade),
   Atividade, card de Configurações.
6. **Configurações**: como já estava planejado antes.
7. **Backlog explícito** (fora de escopo até serem retomados): busca
   de texto completo (3a), notificações diárias, conta/login de
   verdade, cores de grifo, modo escuro mais contrastado.
