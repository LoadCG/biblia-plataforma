# Plano: evolução para plataforma (site + app), decisões de arquitetura

Este documento registra as decisões de arquitetura combinadas antes de
iniciar a reescrita do projeto como uma plataforma única (web + mobile).
O site atual, estático em `docs/`, continua no ar sem alterações até a
virada — este plano é para um **repositório novo e separado**.

## Contexto e motivação

O site atual (Markdown → HTML estático, zero dependências) já atende bem
ao que é hoje: conteúdo de leitura, sem custo de infraestrutura. A
motivação para reescrever não é "tecnologia mais nova" por si só, é a
necessidade real de: conta de usuário, sincronização de dados (grifos,
progresso, notas) entre dispositivos, e um app mobile com peso igual ao
do site na experiência do produto.

## Decisão 1 — Um código só: Expo Router (React Native + Web)

Em vez de dois códigos separados (Next.js + React Native) compartilhando
só uma biblioteca de lógica, a decisão foi por um **único código-fonte**
(Expo Router) rodando como app iOS, Android e site web a partir das
mesmas rotas e componentes.

- **Motivo:** o app tem peso igual ou maior que o site na visão do
  projeto — um código único maximiza velocidade de entregar a mesma
  função nos dois lugares.
- **Mitigação do risco de SEO:** as rotas de conteúdo (resumos, leitura
  bíblica) usam o modo de exportação estática do Expo Router para web,
  gerando HTML real e rastreável — precisa ser configurado
  explicitamente por rota, não é automático.
- **Estilização:** NativeWind (Tailwind aplicado a React Native e Web ao
  mesmo tempo) — mesma sintaxe de classes, roda nas três plataformas.
- **Monorepo (Turborepo etc.):** descartado por enquanto — só voltaria a
  fazer sentido se surgir um segundo app/serviço de verdade. Um projeto
  Expo com pastas organizadas (`app/`, `core/`, `components/`) resolve.
- **Hospedagem:** EAS Hosting era o candidato inicial (integrado ao fluxo
  do Expo), mas a implementação real (Decisão 12) usou **Vercel** — mais
  imediato pra colocar no ar com o que já se sabia configurar, sem
  esperar avaliar o EAS Hosting a fundo. Não é uma decisão definitiva
  contra o EAS Hosting, só a que foi tomada na prática; reavaliar se
  algum recurso específico do EAS (ex.: rotas de servidor nativas do
  Expo Router) virar necessidade.

## Decisão 2 — Modelo de dados

Duas famílias de dados que não se misturam:

**Conteúdo** (fixo, igual para todos): livros, capítulos, resumos
históricos. Reaproveita a estrutura já validada em `scripts/gerar-site.js`
(`SECTION_META`, `ALIASES_LIVRO`, `CAPITULOS_POR_LIVRO`) — só troca
"gerar HTML" por "gerar dados tipados" consumidos pelos componentes.

**Dados do usuário** (por pessoa, precisa de dono): grifos, progresso,
notas. Decisão-chave: todo registro nasce com um `ownerId` desde o
primeiro commit, mesmo sem login — um UUID anônimo gerado no dispositivo.
Quando o login existir, esse UUID é trocado pelo ID da conta real e os
registros são re-associados, sem migração de schema.

```ts
type Grifo = {
  ownerId: string;
  livroSlug: string;
  capitulo: number;
  versiculo: number;
  criadoEm: string;
};
```

## Decisão 3 — Camada de repositório (interface fixa, implementação trocável)

```ts
interface GrifosRepository {
  listarPorCapitulo(ownerId: string, livroSlug: string, capitulo: number): Promise<Grifo[]>;
  estaGrifado(ownerId: string, ref: { livroSlug: string; capitulo: number; versiculo: number }): Promise<boolean>;
  alternar(ownerId: string, ref: { livroSlug: string; capitulo: number; versiculo: number }): Promise<boolean>;
}
```

Hoje: implementação local — SQLite no nativo, AsyncStorage no web
(migrado de AsyncStorage puro pro SQLite no nativo em 2026-08, ver
`FUNCIONALIDADES.md`). Depois: implementação com banco de dados
(Supabase ou Firebase — decisão adiada até virar necessidade real),
mesma assinatura. As telas nunca sabem qual está por trás.
Repositórios equivalentes para `ProgressoRepository` (capítulo lido) e
`NotasRepository`. Um quarto, `LivrosLidosRepository`, foi adicionado
depois — mesmo padrão, mas separado de propósito de `ProgressoRepository`:
é sobre ter lido o *resumo histórico* de um livro, não um capítulo da
leitura bíblica (dois progressos diferentes, não confundir).

## Decisão 4 — Proxy/cache para o texto bíblico

O app não deve falar direto com a bible-api.com. Uma rota de API do
próprio Expo Router funciona como proxy com cache, reduzindo risco de
rate limit e criando um ponto único pra trocar a fonte do texto bíblico
no futuro (ex.: texto próprio num banco de dados) sem mexer no app.

## Decisão 5 — Estrutura de rotas

```
app/
  index.tsx                          → home
  resumos/[livro].tsx                → resumo histórico do livro
  biblia/index.tsx                   → escolher livro
  biblia/[livro]/index.tsx           → escolher capítulo
  biblia/[livro]/[capitulo].tsx      → leitura (grifar, marcar lido)
  api/versiculo/[ref]+api.ts         → proxy/cache da bible-api.com
```

## Decisão 6 — Tema visual

As variáveis CSS já existentes no site atual (`--cor-destaque`,
`--cor-grifo`, cores de gênero literário, tema claro/escuro) são
portadas diretamente para tokens de cor no `tailwind.config.js` do
NativeWind — baixo risco, é conversão direta de valores já validados.

## Checklist de paridade com o site atual

Nada abaixo pode ficar pra trás na reescrita:

- Busca por nome de livro e por conteúdo dos resumos
- Grifar versículo, marcar capítulo e livro como lido
- Navegação anterior/próximo cruzando livros
- Tema claro/escuro, tamanho de fonte ajustável
- Leitura offline — em aberto: no app nativo é o próprio app instalado;
  a versão *web* exportada ainda precisa de estratégia própria (service
  worker), a decidir na implementação

## Questões jurídicas a considerar

**Aviso:** isto não substitui consulta a um advogado — é um mapa do que
precisa de atenção, não uma análise jurídica. Vale revisão profissional
antes de lançar publicamente com contas de usuário reais.

### Direitos autorais do texto bíblico

A tradução Almeida usada hoje via bible-api.com retorna `"Public Domain"`
na resposta da API, mas existem várias revisões da Almeida com direitos
autorais diferentes (a tradução original de João Ferreira de Almeida,
1681/1753, é de domínio público; revisões modernas como ARA, ARC ou a
Nova Almeida Atualizada pertencem a instituições como a Sociedade Bíblica
do Brasil ou editoras). **Antes de armazenar o texto bíblico em banco de
dados próprio** (Decisão 4, fase futura), é preciso confirmar exatamente
qual edição é essa e se ela é mesmo de domínio público — copiar/redistribuir
uma revisão com direitos reservados, mesmo gratuitamente, é risco real.

### Termos de uso da bible-api.com

Antes de aumentar a dependência dela (ou de fazer proxy/cache em maior
escala), vale reler os termos de uso do serviço — APIs gratuitas às vezes
restringem uso comercial ou volume alto sem aviso prévio.

### LGPD (Lei Geral de Proteção de Dados)

Assim que existir conta de usuário e banco de dados guardando informação
pessoal (e-mail, grifos, notas, progresso de leitura), a LGPD se aplica:

- Política de privacidade e termos de uso publicados e acessíveis
- Base legal clara para tratar os dados (ex.: consentimento, execução de
  contrato)
- Mecanismo para o usuário acessar, exportar e excluir seus próprios
  dados (o modelo de `ownerId` da Decisão 2 já facilita isso)
- Definição de por quanto tempo os dados ficam guardados após o usuário
  parar de usar o app
- Se a base de usuários crescer, pode ser necessário designar um
  encarregado de dados (DPO)

### Público menor de idade

O projeto é voltado a "jovens e adolescentes" — se contas forem abertas
por menores diretamente (sem ser através de um responsável/igreja), tanto
a LGPD quanto políticas de app stores têm regras específicas sobre dados
de menores (ex.: consentimento parental). Vale decidir a política de
idade mínima antes de implementar cadastro.

### Políticas de loja de app (Apple App Store / Google Play)

Conteúdo religioso é normalmente aceito sem problema. Pontos que exigem
atenção na hora de publicar: rótulo de privacidade da Apple ("App
Privacy") e a seção "Data Safety" do Google — ambos exigem declarar
exatamente quais dados o app coleta; se no futuro houver funcionalidade
social/comunitária, entra também a exigência de moderação de conteúdo
gerado por usuário.

### Autoria do conteúdo dos resumos

Os 66 resumos históricos são conteúdo próprio, escrito para o projeto —
não há problema de direitos autorais aqui, mas vale manter esse
entendimento registrado caso o projeto cresça e outras pessoas passem a
contribuir com conteúdo (definir, se isso acontecer, como a autoria e a
licença desse conteúdo funcionam).

## Decisões tomadas durante a implementação

As decisões abaixo não estavam fechadas no plano original — foram
resolvidas na prática, ao construir cada parte, e ficam registradas aqui
pelo mesmo motivo das outras: para não precisar redescobrir o raciocínio
depois.

### Decisão 7 — Concorrência de escrita no armazenamento local

Toda escrita nos repositórios locais (grifar, marcar como lido, salvar
nota) segue o padrão ler-tudo → alterar em memória → salvar-tudo. Sem
proteção, duas chamadas concorrentes (ex.: usuário tocando rápido em dois
versículos) podem ler o mesmo estado antes de qualquer uma escrever, e a
segunda escrita apaga a primeira. Resolvido com uma fila por chave de
armazenamento (`core/repositories/local/fila.ts`, função `comFila`), que
serializa as operações na mesma chave. O mesmo problema existia na
geração do `ownerId` anônimo (duas telas montando ao mesmo tempo geravam
dois UUIDs) — resolvido com deduplicação de chamada em andamento em
`core/owner.ts`.

Lição: qualquer repositório novo que leia-altere-salve precisa passar
pela fila. Esquecer isso é o tipo de bug que só aparece sob uso real
(cliques rápidos), não em teste manual cuidadoso.

### Decisão 8 — Tema claro/escuro

Implementado com a API nativa do NativeWind (`colorScheme` de
`"nativewind"`, que aplica/remove a classe `dark` na raiz do documento),
com persistência própria por cima (`core/theme.ts`, guardada no
AsyncStorage) — sem isso a escolha se perderia a cada abertura do app.
`tailwind.config.js` usa `darkMode: "class"` e cada cor tem um par
`cor-x` / `cor-x-dark` explícito (não uma variável CSS trocada em tempo
de execução), portado 1:1 dos valores que já existiam no site antigo.

### Decisão 9 — Pipeline de conteúdo (Markdown → dados tipados)

`scripts/gerar-conteudo.js` (Node puro, sem dependência) lê
`resumos-biblicos/**/*.md`, faz o parsing (mesma lógica de
`Resumo-dos-66-Livros-da-Biblia/scripts/gerar-site.js`, adaptada pra
gerar dados em vez de HTML) e escreve `core/content/dados/livros.json`.
`core/content/livros.ts` importa esse `.json` (o TypeScript já suporta
`resolveJsonModule` por padrão no template do Expo) e expõe uma API
tipada (`livros`, `obterLivro`, `obterResumo`). Regra fixa: o `.json`
nunca é editado à mão, é sempre gerado — quem edita conteúdo edita o
Markdown e roda `npm run gerar-conteudo`.

### Decisão 10 — Cores por gênero literário exigem um mapa estático

O NativeWind (como o Tailwind) só inclui no CSS final as classes que
consegue enxergar como texto literal no código-fonte — uma classe
interpolada dinamicamente (`` `bg-genero-${slug}` ``) não é detectada e
simplesmente não funciona (não dá erro, só não aplica estilo nenhum).
Por isso `core/content/genero.ts` é um objeto de mapeamento
string-fixa → string-fixa (`Histórico` → `"bg-genero-historico-bg"`),
não uma função que monta a classe dinamicamente. Qualquer cor nova
condicional por dado (não por variante `dark:`, que o NativeWind entende
nativamente) precisa seguir esse mesmo padrão.

**Consequência que essa decisão por si só não evitou** (achado numa
revisão posterior, confirmado gerando o build de produção e checando o
CSS final): ter as classes como texto literal só resolve metade do
problema — o Tailwind também só enxerga esse texto se o arquivo onde ele
mora estiver incluído em `content` no `tailwind.config.js`. O glob
original só cobria `app/**` e `components/**`, sem `core/**` — exatamente
onde `genero.ts` vive. Resultado: nenhuma cor de gênero literário
aparecia no CSS gerado, silenciosamente, apesar do padrão estar
tecnicamente correto. Corrigido adicionando `./core/**/*.{js,jsx,ts,tsx}`
ao `content`. Lição: ao criar uma pasta nova sob `core/` que gera classes
do Tailwind (não só lógica), conferir se ela está coberta pelo glob —
não assume automaticamente.

### Decisão 11 — Leitura bíblica: busca, cache e rolagem até o versículo

`core/biblia/BibliaAPI.ts` busca o texto local primeiro (JSON embutido
no web, SQLite FTS5 no nativo — ver 7.3 do `FUNCIONALIDADES.md`,
migração feita em 2026-08-19) e só cai pra bible-api.com como
fallback se a busca local falhar por algum motivo inesperado — não é
mais o caminho principal como era na decisão original. Cache local por
referência (capado em 200 entradas) continua existindo pro caminho de
fallback. O proxy de servidor (Decisão 4) segue não implementado, mas
ficou menos urgente já que o app não depende mais da API externa no
dia a dia.

Bug real encontrado e corrigido durante o teste manual: a rolagem
automática até o versículo pedido (`?versiculo=N`) não funcionava,
porque o efeito que disparava o scroll rodava antes da posição do
versículo ser medida na tela (a medição de layout do React Native é
assíncrona, via `onLayout`). Corrigido disparando a rolagem de dentro do
próprio callback de `onLayout`, não de um `useEffect` separado — garante
que a posição já existe no momento em que a rolagem é solicitada.

### Decisão 12 — Deploy: Vercel com exportação estática (SPA)

`npx expo export --platform web` gera um único `index.html` (não uma
página por rota, diferente do site antigo) — Vercel configurada via
`vercel.json` com rewrite de qualquer caminho para `index.html`, senão
acessar `/resumos/19-salmos` direto (ou dar F5) resultaria em 404.

**Lacuna conhecida e aceita por enquanto:** como não há HTML por rota,
não há conteúdo pré-renderizado por livro — pior para SEO que o site
antigo (que gerava uma página estática de verdade por livro). O Expo
Router tem suporte a pré-renderização estática por rota, mas precisa ser
configurado explicitamente; fica como item pendente para quando o SEO da
parte de resumos importar de verdade (ver checklist de funcionalidades).

### Decisão 13 — Repositório GitHub

Repositório próprio (`LoadCG/biblia-plataforma`), autoria de todos os
commits como `LoadCG <cauangabrielresende@gmail.com>` (autor e
committer), sem nenhum outro colaborador. Arquivos de configuração de
ferramenta que vieram do template do Expo (`.claude/`, `CLAUDE.md`) foram
removidos antes do primeiro push. **Atualização:** ficou público a
partir de 2026-08-20 (auditoria de segredos feita antes — ver
`TODO.md` — nenhum segredo foi commitado em nenhum momento do
histórico).

### Decisão 14 — Referências bíblicas clicáveis no resumo (retomando plano do repositório antigo)

O repositório antigo (antes da migração de arquitetura) tinha um plano
registrado (`soft-crunching-dove.md`, criado em modo de planejamento)
para linkar referências bíblicas citadas nos resumos ("Sl 22", "Rm
1:16-17") a um popover com o texto de verdade, buscado na
bible-api.com. O plano original pensava em termos de HTML estático
gerado em build (`scripts/gerar-site.js` + `docs/assets/referencias.js`)
porque aquele era o modelo do site antigo. Nesta arquitetura (Expo
Router, conteúdo renderizado como componentes React, não HTML
estático), a mesma ideia foi portada assim:

- **Detecção continua fora do componente de tela**, mas agora acontece
  na hora de renderizar (`core/biblia/detectarReferencias.ts`), não em
  build — porque aqui o texto já chega como string JS pro React, um
  split de string resolve sem precisar gerar HTML à parte nem rodar
  parser de DOM.
- **Tabela de apelidos própria** (`core/biblia/aliasesLivro.ts`),
  reaproveitando a mesma lição do plano original: a bible-api.com não
  reconhece abreviações ("Sl", "Rm", "Gn" davam erro em testes reais),
  então a resolução do nome do livro é feita aqui e só o nome canônico
  completo (confirmado por chamadas reais que funciona, inclusive
  acentuado — "Gênesis", "Provérbios", "Isaías", "Jó") é mandado pra
  API.
- **Busca e cache reaproveitados**: `core/biblia/BibliaAPI.ts` já
  existia (criado pra leitura de capítulo) e já resolve exatamente o
  formato de referência precisado aqui (`Livro N`, `Livro N:V`, `Livro
  N:V-V`) — não foi necessário nenhum código novo de fetch/cache, só
  reusar `buscarReferencia`.
- **Achado durante a implementação, não previsto no plano original**:
  rodar a detecção contra o conteúdo real dos 66 livros (não só contra
  exemplos) revelou que duas abreviações abertamente usadas em
  português — "Os" (Oséias) e "Na" (Naum) — colidem com palavras comuns
  ("os 150 salmos", "na tribo de..."). Removidas da tabela de
  abreviações; os nomes por extenso continuam funcionando.
- Popover como `Modal` nativo (não HTML/CSS customizado como seria no
  site antigo), com botão "Ver capítulo inteiro" que troca a referência
  buscada sem fechar o popover — mesma ideia do plano original.

## Em aberto (decidir durante a implementação, não antes)

Banco de dados (Supabase vs. Firebase — só quando virar necessidade
real), nome definitivo e domínio, publicação em lojas de app vs. PWA
instalável no início, momento de introduzir login, pré-renderização
estática por rota (Decisão 12) quando o SEO da parte de resumos
importar, proxy de servidor para o texto bíblico (Decisão 4/11) quando o
uso justificar.
