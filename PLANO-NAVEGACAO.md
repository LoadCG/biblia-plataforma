# Plano: navegação por abas (mobile-first, adaptado pra desktop)

Status: **planejamento** — nada deste documento está implementado ainda.
Serve pra alinhar a estrutura antes de mexer nas rotas, seguindo o mesmo
princípio do resto do projeto (ver PLANO-PLATAFORMA.md): planejar bem
reduz retrabalho depois.

## Por que mudar

Hoje a navegação é toda por links soltos dentro de cada tela (`← Todos
os livros`, `← Trocar de capítulo` etc.) — funciona, mas não escala:
não existe um lugar fixo pra "tudo que eu já grifei", nem um lugar único
de configurações (hoje o tamanho de fonte é um controle inline repetido
em duas telas). Um app de leitura de referência (YouVersion, Bible
Gateway, Bible.com) tem uma barra de navegação fixa com poucas seções
de primeiro nível — é isso que este plano propõe.

## As 4 telas do MVP

1. **Início** (rota atual `/`) — resumo dos livros + versículo do dia +
   conquistas + estatísticas. É a tela que já existe hoje, sem mudança
   de conteúdo, só passa a viver dentro da barra de navegação.
2. **Leitura Bíblica** (rotas atuais `/biblia/*`) — escolher livro →
   capítulo → ler. Também já existe, também sem mudança de conteúdo.
3. **Grifos e Notas** (tela nova) — visão organizada de tudo que já foi
   grifado e anotado, cruzando livros. Detalhada abaixo.
4. **Configurações** (tela nova, última aba) — tamanho de fonte, fonte
   serifada, tema, e o lugar onde as preferências futuras (cor de
   grifo, contraste do modo escuro) vão morar. Detalhada abaixo.

### Por que só essas 4 agora

Cada aba adicional divide a atenção e a área de toque da barra. Planos
de leitura (seção 4 do FUNCIONALIDADES.md) e conta/sincronização (seção
6) ainda não existem de verdade — quando existirem, avaliar se merecem
aba própria ou se cabem dentro de "Início"/"Configurações" primeiro.

## Tela nova: Grifos e Notas

**Funcionalidade:**
- Duas fontes de dado já existem prontas: `grifosRepository.listarTodos(ownerId)`
  e `notasRepository.listarTodas(ownerId)` (ambos criados pra tela de
  Estatísticas, reaproveitados aqui).
- Lista agrupada por livro (ordem canônica), cada item mostra a
  referência (ex. "Mateus 5:14"), e para notas também um trecho do
  texto da nota.
- Filtro por tipo: Todos / Grifos / Notas (chips no topo, como o
  filtro de gênero seria — não existe hoje, mas o padrão visual já
  existe em `FaixaConquistas`).
- Busca por texto dentro das notas (reaproveita o padrão de
  normalização de `core/content/busca.ts`).
- Tocar num item leva direto pro versículo (`/biblia/[livro]/[capitulo]?versiculo=N`),
  reaproveitando o realce temporário que já existe nessa rota.

**UX/UI:**
- Estado vazio tem que orientar, não só dizer "nada aqui" — algo como
  "Toque em ✎ Grifar ou 🗒 Anotar durante a leitura pra ver aqui".
- Agrupar por livro evita uma lista longa sem estrutura se a pessoa
  grifar muito — cabeçalho de grupo com o nome do livro, colapsável se
  a lista crescer demais (não crítico pro MVP, mas dá pra prever o
  espaço no layout desde já).

## Tela nova: Configurações

**Funcionalidade (o que entra já no MVP):**
- Tamanho de fonte (A-/A+) e fonte serifada — já existem como estado
  persistido em `core/leitura/preferenciaFonte.ts`; a tela de
  Configurações passa a ser **mais uma leitora/escritora** desse mesmo
  módulo, não uma fonte de verdade nova. Os controles inline que já
  existem nas telas de leitura continuam (atalho rápido durante a
  leitura); a tela de Configurações é o lugar central pra quem prefere
  ajustar uma vez só.
- Tema (claro/escuro) — hoje é um botão por tela (`BotaoTema`); centralizar
  aqui não impede o botão rápido continuar existindo também.
- Um placeholder claramente marcado "em breve" pras preferências futuras
  abaixo, pra a tela já comunicar que mais opções vêm — evita a
  sensação de tela vazia/incompleta no MVP.

**UX/UI:**
- Agrupado em seções com título (ex. "Leitura", "Aparência", "Dados"),
  não uma lista solta de toggles.
- Cada controle mostra o estado atual de forma óbvia (não só um switch
  sem contexto) — segue o padrão que os botões A-/A+/Aa já usam
  (destacado quando ativo).

## Preferências futuras já avisadas pelo usuário (entram no planejamento, não no MVP)

Registradas aqui pra Configurações já prever o espaço, mesmo sem
implementar agora:

1. **Grifar em várias cores.** Hoje `Grifo` é binário (grifado ou não).
   Precisa: (a) migrar o tipo `Grifo` pra incluir uma `cor` (nova
   propriedade, com default pra não quebrar grifos existentes já
   salvos), (b) um seletor de cor no lugar do botão único "✎ Grifar" na
   barra de seleção do versículo, (c) uma paleta pequena e fixa (4-6
   cores, não um color picker livre) pra manter consistência visual e
   significado (ex. amarelo = importante, verde = promessa, azul =
   estudo) — a tela de Configurações seria o lugar de ver a legenda
   dessa paleta.
2. **Modo escuro mais contrastado.** Hoje o tema escuro usa
   `cor-fundo-dark: #1b1712` (marrom bem escuro, não preto puro) — bom
   pra reduzir fadiga visual mas pode não ser suficiente contraste pra
   quem precisa de mais (baixa visão, uso em sol forte). Proposta: uma
   segunda variante de tema escuro (preto mais puro, texto com contraste
   mais alto), selecionável em Configurações — não substituir o escuro
   atual, oferecer como opção.
3. **Melhorias no sistema de conquistas e badges.** Hoje são 6 badges
   fixas (`core/content/conquistas.ts`). Direções possíveis: mais
   marcos intermediários (não só "todo o AT"/"toda a Bíblia", que
   demoram muito pra desbloquear), indicador de progresso dentro de
   cada badge (não só bloqueada/desbloqueada), e possivelmente ligar
   isso à aba de Início em vez de Configurações (são conquistas, não
   uma preferência) — mencionado aqui só porque impacta a mesma
   varredura de dados que Grifos e Notas.

## Estrutura de rotas (Expo Router)

Proposta: agrupar as 4 telas de primeiro nível num route group
`app/(tabs)/`, que organiza os arquivos sem aparecer na URL:

```
app/
├── (tabs)/
│   ├── _layout.tsx       (define a barra de navegação)
│   ├── index.tsx         (Início — hoje é app/index.tsx)
│   ├── biblia/
│   │   ├── index.tsx     (hoje é app/biblia/index.tsx)
│   │   └── [livro]/index.tsx
│   ├── grifos.tsx        (novo)
│   └── configuracoes.tsx (novo)
├── resumos/[livro].tsx           (fora do group — tela de detalhe)
├── biblia/[livro]/[capitulo].tsx (fora do group — tela de detalhe)
└── estatisticas.tsx              (fora do group — tela de detalhe)
```

Telas de detalhe (resumo de um livro, leitura de um capítulo,
estatísticas) ficam **fora** do group de abas — no Expo Router, uma
rota fora do `(tabs)` empilha por cima e esconde a barra de navegação
automaticamente, que é o comportamento certo aqui (ler um capítulo
inteiro não deveria competir por espaço de tela com a barra de abas).
URLs existentes (`/resumos/19-salmos`, `/biblia/40-mateus/5`) não
mudam — só `/` (Início) e a árvore de `/biblia` passam a ficar
fisicamente dentro da pasta `(tabs)/`, sem efeito na URL final.

## Adaptação mobile-first → desktop

- **Mobile (padrão):** barra de abas fixa embaixo (`tabBarPosition:
  "bottom"`, o padrão do Expo Router `Tabs`), 4 ícones + rótulo curto.
- **Desktop/web largo:** trocar pra uma barra lateral fixa à esquerda
  (mesmas 4 opções, ícone + rótulo por extenso, mais espaço não é
  problema). Detecção via `useWindowDimensions` (React Native) com um
  breakpoint (ex. ≥768px) decidindo qual componente de navegação
  renderizar — mesmo padrão "mobile-first com adaptação", não duas
  implementações divergentes, só dois *layouts* pro mesmo conjunto de
  rotas.
- Ambos os casos continuam sendo o mesmo `(tabs)` group do Expo Router
  por baixo — a diferença é puramente visual/de layout, não de rotas.

## Ordem de implementação sugerida

1. Criar o `(tabs)/_layout.tsx` e mover `app/index.tsx` e `app/biblia/*`
   pra dentro do group, mantendo URLs idênticas — risco baixo, dá pra
   testar que nada quebrou antes de seguir.
2. Construir a tela de Grifos e Notas (dados já existem via
   `listarTodos`/`listarTodas`).
3. Construir a tela de Configurações, migrando os controles de fonte
   existentes pra também aparecerem lá (sem duplicar lógica — só mais
   um lugar que lê/escreve `core/leitura/preferenciaFonte.ts`).
4. Adaptação desktop (barra lateral) — só depois das 4 telas existirem
   e a navegação mobile estar validada.
5. Preferências futuras (cores de grifo, contraste, conquistas) — como
   itens separados do checklist, não bloqueiam a navegação em si.
