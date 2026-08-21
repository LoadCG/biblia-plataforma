# Checklist de funcionalidades e melhorias

Documento vivo. Cada item tem duas partes, sempre nesta ordem:

- **Funcionalidade** — o que precisa funcionar corretamente, sem erro,
  testado de ponta a ponta. Isso vem primeiro sempre.
- **UX/UI** — só depois de a funcionalidade estar sólida, o polimento
  visual e de interação no mesmo nível de qualidade.

`✅` concluído · `🔶` parcialmente feito · `⬜` não iniciado

---

## 1. Resumos históricos

### 1.1 Ler o resumo de um livro `✅`
**Funcionalidade:** ficha rápida (autor, data, período, gênero, local,
conexão com o livro anterior) + 6 seções de conteúdo, para os 66 livros,
gerado a partir do Markdown fonte.
**UX/UI:** ficha rápida com hierarquia visual clara, selo de gênero
literário colorido, tempo estimado de leitura visível antes de rolar a
página. Selo agora é tocável (ícone ⓘ) e abre um `Tooltip`
(`components/Tooltip.tsx`, novo) com explicação curta do gênero (ex.:
"Evangelho — Conta a vida, os ensinamentos, a morte e a ressurreição
de Jesus..."), num tom simples pro público jovem do app — texto vem de
`DESCRICAO_GENERO` em `core/content/genero.ts`. No web também usa o
`title` nativo do navegador (tooltip de hover) de graça, sem duplicar
lógica. Mesmo componente reutilizável pra qualquer "explicação sob
demanda" futura no app. Testado ao vivo: toque no selo "EVANGELHO" do
resumo de Mateus abre o modal com o texto certo.

### 1.2 Navegar entre livros `✅`
**Funcionalidade:** anterior/próximo a partir de qualquer resumo, sem
precisar voltar pra lista.
**UX/UI:** cartões de navegação com nome do livro, não só uma seta
genérica — a pessoa já vê pra onde vai antes de tocar.

### 1.3 Marcar livro como lido `✅`
**Funcionalidade:** alterna e persiste por dispositivo (`LivrosLidosRepository`), refletido na lista de resumos (`/resumos`) e na tela do livro.
**UX/UI:** selo verde visível no card da lista, sem precisar abrir o
livro pra saber se já foi lido.

### 1.4 Buscar livro por nome `✅`
**Funcionalidade:** filtro em tempo real na lista de resumos (`/resumos`,
migrada da Início na Fase 2 do plano de navegação — ver PLANO-NAVEGACAO.md).
**UX/UI:** campo de busca com placeholder claro, mensagem de "nenhum
resultado" quando a busca não bate com nada.

### 1.5 Buscar por conteúdo do resumo (não só nome do livro) `✅`
**Funcionalidade:** busca (`core/content/busca.ts`) primeiro tenta nome
do livro; se não achar, varre ficha rápida + todas as seções do resumo
e retorna os livros cujo conteúdo contém o termo. Sem acento/case
sensível (normaliza via NFD). Diferente do site antigo, não usa índice
gerado em build — os 66 resumos completos já vivem inteiros em memória
nesta arquitetura, então a varredura direta é instantânea e não precisa
de um passo de build separado. Testado: buscar "cordeiro" retorna Êxodo
e Apocalipse mesmo a palavra não estando no nome de nenhum dos dois.
**UX/UI:** resultado por conteúdo mostra o trecho onde o termo apareceu
(recorte de ~80 caracteres ao redor, com reticências), então a pessoa
entende *por que* aquele livro apareceu — resultados por nome do livro
não mostram trecho (seria redundante).

### 1.6 Tamanho de fonte ajustável na leitura `✅`
**Funcionalidade:** controle A-/A+ no cabeçalho do resumo, 3 passos
(15/17/19px), aplicado às seções de texto corrido. Persistido por
dispositivo e compartilhado com a leitura de capítulo — ver 2.2c.
**UX/UI:** controle discreto, não competindo visualmente com o conteúdo;
desabilita visualmente ao chegar no limite mínimo/máximo.

### 1.7 Fonte serifada opcional `✅`
**Funcionalidade:** botão "Aa" ao lado do controle de tamanho, nas duas
telas de leitura (resumo e capítulo). Usa fontes de sistema (Georgia no
web/iOS, "serif" genérica no Android) em vez de baixar uma fonte
customizada via expo-font — evita a complexidade de carregamento
assíncrono e de rebuild nativo por ora, já que só o web está publicado
hoje; documentado como extensão futura natural se um dia isso não
bastar. Persistido junto com o tamanho de fonte
(`core/leitura/preferenciaFonte.ts`).
**UX/UI:** aplicado só ao texto corrido (parágrafos, ficha rápida,
versículos) — títulos, botões e labels continuam na fonte padrão, pra
não perder hierarquia visual. Botão fica destacado (fundo/borda de
cor-destaque) quando ativo.

### 1.9 Referências bíblicas clicáveis no texto do resumo `✅`
**Funcionalidade:** referências citadas soltas no texto ("Sl 22", "Rm
1:16-17", "1 Coríntios 15:3-8") viram trechos tocáveis que buscam o
versículo de verdade na bible-api.com e mostram num popover — sem sair
da tela do resumo. Detecção via tabela própria de apelidos
(`core/biblia/aliasesLivro.ts`) + regex (`core/biblia/detectarReferencias.ts`),
não depende do parser fuzzy da API (testado antes com chamadas reais:
a API não reconhece abreviações como "Sl"/"Rm"/"Gn"). Duas abreviações
comuns (`Os` = Oséias, `Na` = Naum) foram deixadas de fora de propósito
por colidirem com palavras comuns do português ("os 150 salmos", "na
tribo de...") — confirmado rodando a detecção contra o conteúdo real
dos 66 livros antes de decidir. Aplicado tanto nos parágrafos/listas
das seções quanto nos valores da Ficha Rápida.
**UX/UI:** referência sublinhada pontilhada, cor de destaque (mesmo
padrão visual de link do resto do app); popover mostra o texto do
versículo pedido e, quando a referência era só um trecho, um botão "Ver
capítulo inteiro" busca o capítulo completo sem fechar o popover; erro
de rede mostra mensagem amigável sem quebrar a leitura do resumo em
volta (é um extra, não uma dependência crítica da tela); popover fecha
tocando fora ou no ✕.

### 1.8 Modo foco `✅`
**Funcionalidade:** implementado em `app/(tabs)/biblia/[livro]/[capitulo].tsx`
via `focoAtivo` — ativa automaticamente ao rolar pra baixo (esconde a
barra de topo com abas Texto/Resumo e ajustes, mostrando só uma faixa
fina com "Livro Capítulo"), desativa ao rolar pra cima ou voltar perto
do topo.
**UX/UI:** saída é automática (rolar pra cima), não depende de um botão
escondido — a barra flutuante de navegação de capítulo (pill) e a tab
bar continuam sempre visíveis mesmo em foco ativo, então a pessoa nunca
fica presa sem controles de navegação.

---

## 2. Leitura bíblica

### 2.1 Escolher livro → capítulo `✅`
**Funcionalidade:** uma tela só, `app/(tabs)/biblia/escolher/index.tsx`
— lista de livros em acordeão, cada um expandindo a grade de capítulos
inline (a tela separada `escolher/[livro]/index.tsx`, que mostrava um
único livro já expandido, foi **removida em 2026-08-18** por ter ficado
redundante e ser a "rota antiga" que os links de troca de livro durante
a leitura ainda apontavam por engano — ver bug abaixo). O acordeão
abre com o último livro lido já expandido, ou com o livro passado via
`?livro=slug` na URL, usado por quem chega vindo da tela de leitura
(ver 9.3). Contagem de capítulos correta por livro (tabela fixa). Não
existe uma terceira tela de
"escolher versículo" — o foco num versículo específico só acontece via
parâmetro de URL (`?versiculo=N`) direto na tela de leitura (ver 2.2),
nunca por uma grade navegável de versículos.
**UX/UI:** grade de números clara, tocável com o polegar (alvo de toque
adequado), estado visual de "já lido" visível na grade de capítulos
antes de entrar num deles. Novo `components/GradeCapitulos.tsx`
(2026-08-11) reúne a grade num só componente reutilizado nas duas
telas (acordeão expandido e a tela dedicada de capítulos) — antes cada
uma tinha sua própria versão, com tamanhos diferentes entre si e
células grandes demais em telas largas (a do acordeão usava `w-[18%]`
fixo, sempre ~5-6 colunas não importa a largura da tela; a dedicada
usava `w-14 h-14` fixo em pixels). Agora o número de colunas é
calculado por faixa de largura (`useWindowDimensions`) — 6 colunas
abaixo de 400px, 8 abaixo de 640px, 10 abaixo de 900px, 12 acima disso
— sempre limitado ao total de capítulos do livro (um livro de 1
capítulo não abre 12 colunas quase vazias). A largura da célula usa
`style` inline com porcentagem calculada, não uma classe Tailwind
interpolada dinamicamente — o NativeWind só reconhece classes escritas
como texto literal no código (mesma pegadinha da Decisão 10 do
PLANO-PLATAFORMA.md), então uma largura dinâmica via className não
funcionaria. Testado ao vivo: 6 colunas em 375px, 12 colunas em
1280px (carregamento fresco — redimensionar a janela com o app já
aberto não foi possível confirmar no ambiente de teste, limitação da
ferramenta de automação, não bug conhecido do app), 1 coluna pra
Obadias (1 capítulo, sem grade vazia), grade de 150 capítulos de
Salmos renderiza e navega bem, destaque verde de "lido" preservado.
O acordeão agora também destaca capítulos individualmente lidos (antes
só mostrava a contagem "X de Y" no cabeçalho do livro, a grade em si
não tinha nenhum destaque por capítulo).

**Bug grave real, reportado por usuário em produção (2026-08-11):**
"a rota certa é `/biblia/05-deuteronomio/2`, mas ao escolher leva para
`/biblia/escolher/05-deuteronomio/2`" — o toque num capítulo, dentro
do acordeão de livros (`app/(tabs)/biblia/escolher/index.tsx`), estava
navegando pra `/biblia/escolher/${slug}/${cap}` em vez de
`/biblia/${slug}/${cap}` (a tela de leitura de verdade). Esse destino
errado era a tela `escolher/[livro]/[capitulo].tsx` — uma "grade de
escolher versículo" que **este próprio documento já dizia não
existir** (contradição encontrada só agora), sobra de uma versão
anterior do fluxo de navegação. Além de ser o destino errado, essa
tela tinha um bug próprio que a deixava sempre quebrada: chamava
`buscarReferencia(\`${livroSlug} ${capitulo}\`)` usando o **slug da
URL** (`"05-deuteronomio"`) em vez do **nome do livro**
(`"Deuteronômio"`) — a bible-api.com (web) e o parser de nomes (SQLite
nativo) não reconhecem o slug, então a busca falhava sempre, pra
qualquer livro, com "Erro ao carregar versículos". **Esta é a causa
raiz real** dos dois bugs de leitura reportados antes ("só Gênesis
funciona", "leitura bíblica não funcionando") — a pessoa só via
Gênesis funcionar porque a Início/`Continue lendo` usa a rota de
leitura direta (correta), e qualquer outro livro acessado pelo
acordeão caía nessa tela quebrada. As correções de resiliência feitas
antes (retry na `bible-api.com`, robustez da população do SQLite) são
melhorias legítimas por si só, mas não eram a causa deste sintoma
específico.
**Corrigido:** o toque no capítulo agora navega direto pra
`/biblia/${slug}/${cap}` (rota de leitura real). A tela
`escolher/[livro]/[capitulo].tsx` foi **removida** — sem nenhuma outra
rota apontando pra ela, ficaria como código morto e quebrado.
Confirmado ao vivo no navegador: acordeão → Deuteronômio → capítulo 2
→ URL certa (`/biblia/05-deuteronomio/2`) → conteúdo carrega; repetido
com Apocalipse (último livro) pra garantir que não era coincidência de
um livro específico.

### 2.2 Ler o capítulo com foco no versículo escolhido `✅`
**Funcionalidade:** abre o capítulo inteiro, rola automaticamente até o
versículo pedido via `?versiculo=N` na URL.
**UX/UI:** borda lateral colorida no versículo em foco. Estudo de UX
([ESTUDO-UX-LEITURA.md](../ESTUDO-UX-LEITURA.md)) trouxe além disso:
barra fina de progresso de leitura no topo, e tipografia revista
(número de versículo pequeno/discreto, `lineHeight` maior) — inspirado
no padrão do YouVersion/Bible Gateway.

**Bug real, reportado por usuário (2026-08-18): "na leitura bíblica
não aparece os títulos atualmente"** — o título "Livro Capítulo" só
existia dentro do cabeçalho do Modo Foco (ver 1.8), que começa
**desativado** por padrão; no modo normal de leitura (a maioria do
tempo), não havia nenhum texto no cabeçalho dizendo qual livro/capítulo
estava sendo lido — só a barra de abas Texto/Resumo e os ícones de
áudio/ajustes, sem título nenhum, contradizendo o que este próprio
documento já dizia existir ("cabeçalho fixo com livro/capítulo sempre
visível" — never existia fora do Modo Foco). Corrigido: título "Livro
Capítulo" adicionado também no cabeçalho do modo normal, só na aba
Texto Bíblico (a aba Resumo já tem seu próprio título grande). Testado
ao vivo: "Deuteronômio 3" aparece no topo antes de "Marcar capítulo
como lido"; trocar de aba não duplica o título.

**Bug real reportado por usuário (2026-08-11):** "erro ao carregar
versículos, leitura bíblica não funcionando". Investigado: a
`bible-api.com` (usada na versão *web*, ver 2.6/Decisão 11) é uma API
pública gratuita, sem SLA — uma falha isolada (timeout, 5xx) hoje
derrubava a leitura direto pro estado de erro, sem nenhuma segunda
chance. Corrigido em `core/biblia/BibliaAPI.ts`: até 3 tentativas com
timeout de 10s cada (via `AbortController`) e um pequeno intervalo
entre elas, antes de desistir — cobre exatamente esse tipo de falha
transitória. Testado com `fetch` mockado (`BibliaAPI.web.test.ts`,
novo): confirma que uma falha isolada não impede o sucesso na
tentativa seguinte, e que falhas persistentes ainda propagam o erro
depois de esgotar as tentativas. Também adicionado um botão "Tentar
novamente" na tela de leitura (antes só existia o texto de erro, sem
nenhuma ação — a pessoa precisava sair e voltar pra tentar de novo).
**Não foi possível reproduzir a falha original** (a API respondeu
normalmente em todos os testes feitos); a causa mais provável é
instabilidade pontual do lado da `bible-api.com`, que esta correção
absorve automaticamente na maioria dos casos daqui pra frente — mas
fica registrado que o app depende de uma API de terceiros sem SLA pra
essa funcionalidade central, e o proxy/cache de servidor planejado
(Decisão 4 do `PLANO-PLATAFORMA.md`) resolveria isso de vez.

**Mensagens de erro amigáveis (2026-08-11, pedido do usuário):** a
causa exata da instabilidade acima ficou clara depois — a
`bible-api.com` bloqueia com HTTP 429 acima de ~13-15 requisições em
poucos segundos (confirmado na prática: 20 requisições em sequência
via `curl` retornaram 200 até a 13ª, 429 dali em diante — bate com a
estimativa do usuário de "15 a cada 30 segundos"). Novo `ErroBusca`
(`core/biblia/BibliaAPI.ts`) classifica todo erro de busca em 5 tipos
— `limite` (429), `rede` (falha de conexão), `timeout` (nossos
próprios 10s esgotados), `invalido` (referência/livro não encontrado)
e `desconhecido` — e `core/util/erroAmigavel.ts` (novo) traduz cada
um pra uma frase em tom de conversa, sem jargão técnico:
- **Limite:** "Devagar aí! Muitos capítulos em pouco tempo — espera
  meio minuto e tenta de novo." (pedido específico do usuário)
- **Rede:** "Sem conexão com a internet agora. Verifique sua rede e
  tente de novo."
- **Timeout:** "A conexão está lenta no momento. Tente de novo em
  instantes."
- **Referência inválida:** "Não encontramos esse texto bíblico. Tente
  novamente ou volte e escolha outro capítulo."
- **Desconhecido:** "Algo deu errado ao carregar. Tente de novo em
  instantes."

Importante: só `rede`/`timeout`/`desconhecido` acionam o retry
automático de 3 tentativas (ver acima) — `limite` e `invalido` **não**
são tentados de novo automaticamente, porque insistir não ajuda
(bater de novo durante um bloqueio de rate limit só piora, e uma
referência inválida vai continuar inválida). Aplicado nas três telas
que buscam texto bíblico e mostram erro pro usuário: leitura de
capítulo, `CardVersiculoTema.tsx` (cards de tema no Descubra — o ponto
de maior risco de rate limit, já que abre vários versículos de uma
vez) e `PopoverVersiculo.tsx` (referências clicáveis no resumo).
Testado ao vivo simulando cada tipo de falha via `fetch` mockado no
navegador: as 4 mensagens (limite, rede, timeout, recuperação normal)
apareceram corretas na tela de leitura. Testes automatizados novos
(`BibliaAPI.web.test.ts`, `erroAmigavel.test.ts`) cobrem a
classificação e a ausência de retry em `limite`/`invalido`.

### 2.2c Tamanho de fonte na leitura do capítulo `✅`
**Funcionalidade:** controle A-/A+ no cabeçalho da leitura, 3 passos
(15/17/19px), aplicado ao texto do capítulo inteiro. Persistido por
dispositivo (`core/leitura/preferenciaFonte.ts`) e **compartilhado com
a leitura de resumo** (1.6) — é a mesma preferência de conforto de
leitura nas duas telas, não faz sentido configurar duas vezes. Testado:
ajustar em uma tela, recarregar, abrir a outra tela e confirmar que o
tamanho e o estado dos botões (desabilitado no limite) persistiram.
**UX/UI:** botões pequenos e discretos ao lado do botão de tema, sem
competir com o texto; desabilita visualmente ao chegar no limite
mínimo/máximo.

### 2.2d Realce temporário do versículo em foco `✅`
**Funcionalidade:** ao chegar num versículo via `?versiculo=N`, além da
borda lateral (que fica permanente como referência), um fundo de
destaque aparece por 2,5s e desaparece sozinho — chama atenção no
primeiro instante sem virar poluição visual permanente na tela.
**UX/UI:** o fade acontece só uma vez por navegação (não repete se o
usuário rolar de volta até o versículo depois).

### 2.2b Tela dedicada de escolher versículo `⬜`
**Funcionalidade:** hoje não existe — cogitada durante o planejamento
original mas nunca construída; o app só chega num versículo específico
recebendo `?versiculo=N` por link direto. Se fizer sentido ter uma grade
de versículos navegável (como a de capítulos), é uma tela nova
(`app/biblia/[livro]/[capitulo]/index.tsx` reorganizando a rota atual,
por exemplo), não uma extensão da tela de leitura. **Achado
(2026-08-11):** existia de fato uma versão dessa tela
(`escolher/[livro]/[capitulo].tsx`), contradizendo esta nota — mas
estava com um bug que a deixava sempre quebrada (buscava o versículo
pelo slug da URL em vez do nome do livro) e era o destino de um link
com a rota errada no acordeão de livros. Removida — ver 2.1 pro relato
completo. Se essa funcionalidade for retomada no futuro, construir do
zero seguindo esta nota, não reaproveitar a implementação antiga.
**UX/UI:** mesma grade de números da seleção de capítulo (2.1), com
indicador de "já grifado" por versículo, já que ali sim faz sentido
granularidade de versículo.

### 2.3 Grifar versículo `✅`
**Funcionalidade:** alterna e persiste por referência exata
(livro:capítulo:versículo), na tela de leitura.
**UX/UI:** revisado no estudo de UX — em vez de ícones fixos por
versículo (pequenos, difíceis de acertar, poluindo a leitura), o padrão
agora é **tocar no versículo pra selecionar** (área de toque é a linha
inteira) e uma barrinha de ações (Grifar / Anotar) aparece só para o
versículo selecionado, como no YouVersion. Cor de grifo com bom
contraste nos dois temas. A grade de capítulos (2.1) não mostra hoje se
um capítulo tem versículos grifados dentro dele — só mostra
"lido"/"não lido"; ver 2.2b para onde esse indicador faria mais sentido.

### 2.4 Marcar capítulo como lido `✅`
**Funcionalidade:** separado de propósito de "livro lido" (que é sobre o
resumo). Marcação individual acontece na própria tela de leitura
(`app/(tabs)/biblia/[livro]/[capitulo].tsx`), um capítulo por vez. Ver
2.4c pra marcação de vários capítulos de uma vez.
**UX/UI:** feedback imediato ao marcar (o botão já muda no mesmo toque,
sem esperar round-trip perceptível).

### 2.4b Progresso por livro na lista de leitura bíblica `✅`
**Funcionalidade:** cada card da lista de livros
(`app/(tabs)/biblia/escolher/index.tsx`) agora mostra "X de Y" capítulos
lidos, calculado com uma única chamada a `progressoRepository.listarTodos`
(agrupada por `livroSlug` em memória, sem N chamadas por livro).
**UX/UI:** contagem discreta ao lado do nome do livro, mesmo texto
suave usado em outros indicadores de progresso do app.

### 2.4c Marcar vários capítulos como lidos de uma vez `✅`
**Funcionalidade:** pedido do usuário — "preciso marcar vários como
lidos" (ex.: já leu esses capítulos em papel/outro app antes de
começar a usar este, ou quer corrigir o histórico de leitura de uma
vez). No acordeão de livros (`app/(tabs)/biblia/escolher/index.tsx`),
cada livro expandido ganha um botão "Selecionar vários" que muda a
`GradeCapitulos` pra modo de seleção múltipla — tocar um capítulo o
seleciona (contorno destacado na cor de destaque do app, distinto do
verde de "já lido") em vez de abrir a leitura. Barra de ações com:
- **Selecionar todos**: marca todos os capítulos do livro pra seleção
  de uma vez (cobre o caso "marcar o livro inteiro como lido").
- **Desmarcar**: remove a marcação de leitura dos capítulos
  selecionados (corrige marcações em massa por engano).
- **Marcar como lidos**: aplica a leitura aos selecionados.
Toast de confirmação ("N capítulos marcados como lidos") e a contagem
"X de Y" do livro na lista atualiza na hora — sem esperar navegação ou
reload.
**Técnico:** novo `ProgressoRepository.definirVarios(ownerId, refs,
lido)` — define o mesmo estado pra uma lista de capítulos numa
chamada só, em vez de repetir `alternar()` (que é *toggle*, arriscando
"destoggle" acidental num capítulo que já estava lido). No SQLite
nativo roda em `withTransactionAsync` com `INSERT OR IGNORE` (a
`UNIQUE(ownerId, livroSlug, capitulo)` da tabela evita duplicata) ou
`DELETE`; no localStorage (web), uma passada só sobre a lista antes de
salvar de volta.
**Testado ao vivo:** selecionar capítulos 1-3 de Deuteronômio → "Marcar
como lidos" → contagem "0 de 34" vira "3 de 34" na hora, toast aparece,
`aria-label` do capítulo 1 confirma "Capítulo 1, lido", estado
sobrevive a um reload da página.

**Ideias implementadas depois, a pedido do usuário:** ver 2.4d (seleção
por arraste) e 5.3 (Toast com ação/Desfazer) abaixo.

**Outras ideias de marcação em massa, registradas mas ainda não
implementadas** (avaliar depois se fizer sentido):
- **"Marcar até aqui"**: dado um capítulo, marcar como lido tudo de 1
  até ele — um atalho pro caso mais comum (leu um livro inteiro até um
  certo ponto). Parcialmente coberto hoje pela seleção por arraste
  (2.4d): arrastar do capítulo 1 até o alvo faz a mesma coisa em um
  gesto, mas um atalho de um toque só (sem precisar arrastar por um
  livro de 150 capítulos, ex. Salmos) ainda seria mais rápido nesse
  caso extremo.
- **Marcar leitura em lote a partir de um plano de leitura**: já existe
  `PlanosRepository` no código — quando planos de leitura ganharem UI,
  faria sentido marcar todos os capítulos de um dia/semana do plano
  como lidos numa ação só, reaproveitando `definirVarios`.
- **Resumo/estatística de quantos capítulos foram marcados em massa
  vs. lidos "de verdade" um a um** — dado interessante pra futuras
  conquistas/gamificação, mas exigiria um novo campo no modelo
  (`CapituloLido`) pra distinguir a origem da marcação.

### 2.4d Seleção por arraste na marcação em massa `✅`
**Funcionalidade:** pedido do usuário — "implemente seleção por
arraste com foco em ux avançada". No modo de seleção múltipla (2.4c),
no web, pressionar um capítulo e arrastar o ponteiro sobre outros
estende a seleção pro intervalo inteiro entre o capítulo onde o
arraste começou e o capítulo atual sob o ponteiro — sem precisar
tocar um por um. Mesmo padrão do app Fotos do iOS/Android: se o
arraste **começa** num capítulo já selecionado, o gesto inteiro
desmarca em vez de marcar (permite tanto estender quanto encolher uma
seleção com o mesmo gesto). Um toque simples sem arrastar continua
funcionando normalmente (seleciona só aquele capítulo).
**Técnico:** novo `core/util/useSelecaoArrasto.ts` — hook só-web
(`Platform.OS !== "web"` sai cedo) que escuta `pointerdown` no
container da grade e `pointermove`/`pointerup` na window, usando
`document.elementFromPoint(x, y)` + um atributo `data-capitulo` (via
`dataSet`, extensão do react-native-web pra atributos `data-*`) em
cada célula pra saber qual capítulo está sob o ponteiro a cada
movimento — evita ter que medir manualmente o layout de cada célula.
Escolhido em vez de `PanResponder` (a API de gestos nativa do React
Native) porque a interação em pauta é fundamentalmente de mouse/
trackpad num navegador, e a combinação `elementFromPoint` + Pointer
Events já é um padrão testado neste projeto (mesmo tipo de abordagem
de `useArrastarParaRolar.ts`, ver 7.9) — evita depender de medir
layout de cada célula manualmente, que teria mais superfície pra bug.
No app nativo (iOS/Android), o toque direto em cada capítulo (já
existia antes, ver 2.4c) continua funcionando sem o arraste — não
testável neste ambiente sem dispositivo real, registrado como escopo
da v1.
**UX/UI:** dica de texto "arraste pra selecionar um intervalo" aparece
enquanto nada está selecionado, pra descoberta do gesto (arrastar não
é óbvio sem indicação, diferente de tocar).
**Testado ao vivo, com sequências de `PointerEvent` simuladas de
verdade** (pointerdown → pointermove × N → pointerup): arrastar do
capítulo 3 ao 9 selecionou exatamente 3-9 (7 capítulos, confirmado via
`aria-label` de cada célula, com 2 e 10 confirmadamente fora);
arrastar de um capítulo já selecionado (5) até 7 desmarcou só 5-7,
mantendo 3, 4, 8 e 9 selecionados — confirma o comportamento "estilo
Fotos" de estender ou encolher com o mesmo gesto.

### 2.5 Navegar entre capítulos `✅`
**Funcionalidade:** anterior/próximo, cruzando de um livro pro outro nas
fronteiras (testado: Malaquias 4 → Mateus 1, Gênesis 1 sem anterior).
Migrado na Fase 3 do plano de navegação: era um par de cartões no fim
da página, agora é uma **barra fixa no rodapé** (`← Livro Capítulo →`)
sempre visível, sem precisar rolar — as setas usam navegação `replace`
(não empilham uma tela por capítulo lido em sequência).
**UX/UI:** nome do livro no centro da barra é tocável e abre o seletor
de capítulo (ver 9.3).

### 2.6 Buscar por palavra-chave no texto bíblico inteiro `✅`
**Funcionalidade:** resolvido com a migração pra `expo-sqlite` (ver
`backend-log.md`): a Bíblia inteira (31.106 versículos, Almeida ACF)
foi embutida em `assets/biblia.json` e injetada numa tabela virtual
FTS5 do SQLite na primeira execução (`garantirBaseBiblia()`). A busca
roda 100% local via `buscarGlobal(termo)` em
`core/biblia/BibliaAPI.ts` — nada de rate limit de API externa.
No nativo (iOS/Android) via FTS5; no web via `core/biblia/
buscaGlobalWeb.ts` (ver bug abaixo, corrigido em 2026-08-19).
**UX/UI:** aba "Na Bíblia" dentro da tela Descubra
(`app/(tabs)/pesquisa.tsx`), com debounce de 500ms; cada resultado
mostra a referência e o trecho, link direto pro versículo
(`?versiculo=`). Falha de busca agora usa a mesma mensagem de erro
amigável (`mensagemErroAmigavel`) das outras telas — antes só logava
no console e mostrava "Nenhum versículo encontrado", indistinguível de
uma busca que genuinamente não achou nada.

**Bug grave real, reportado por usuário (2026-08-11): "só dá pra ler
Gênesis"** — no app nativo, `garantirBaseBiblia()` (`core/db/
database.ts`) inseria os ~31 mil versículos um por um (2 `INSERT`s
`await`ados por versículo, mais de 60 mil idas e vindas sequenciais ao
SQLite, tudo numa única transação) e considerava a base "já populada"
bastando existir **qualquer** registro. Gênesis é o primeiro livro do
JSON — se o app fechasse, travasse ou ficasse sem memória no meio
dessa população longa (bem provável dado o volume), só Gênesis
existia, e a checagem seguinte não detectava a população incompleta:
o app ficava travado nesse estado pra sempre, sem nunca tentar
repopular. Corrigido: (1) a checagem agora compara a contagem contra o
total real de versículos do JSON, não só "> 0" — população incompleta
é apagada e refeita do zero; (2) inserção em lotes de 150 linhas por
`INSERT` (750 parâmetros, dentro do limite conservador de 999 do
SQLite) em vez de um por um, com o índice FTS5 sincronizado de uma vez
ao final via `INSERT INTO biblia_fts(biblia_fts) VALUES ('rebuild')`
(padrão recomendado pra tabelas FTS5 de "external content"). Validado
fora do app com `node:sqlite` (Node 22+) rodando a mesma lógica contra
o `assets/biblia.json` real: 31.106 versículos inseridos corretamente
em ~190ms (era impossível medir o método antigo sem rodar no
dispositivo de verdade, mas a diferença de mais de 300x menos idas ao
banco é esperada ser decisiva); Gênesis e Mateus (livro do meio do
JSON) consultáveis, busca FTS funcionando. **Não testado no
dispositivo/simulador nativo de verdade** — este ambiente só tem
acesso ao navegador, não a um simulador iOS/Android; a validação via
`node:sqlite` cobre a lógica SQL, não o comportamento do `expo-sqlite`
em produção.

**Bug grave real, achado durante auditoria de "leitura offline"
(2026-08-19, item C do plano em `TODO.md`): a busca "Na Bíblia" nunca
funcionava no web.** `buscarGlobal` tinha `if (isWeb) return [];` — um
"fallback simples pra evitar crashes no SQLite WASM" que, na prática,
fazia a aba "Na Bíblia" da busca devolver **zero resultados sempre**,
pra qualquer termo, silenciosamente (sem erro, só "Nenhum versículo
encontrado" — indistinguível de uma busca que genuinamente não achou
nada). Isso valia pro app publicado no Vercel (web é a plataforma
principal de acesso hoje) — a funcionalidade só existia de verdade no
build nativo, nunca testado num dispositivo real (ver parágrafo
acima). O README e este documento chamavam a busca de "100% local" sem
deixar claro que isso não valia pro web.
**Corrigido:** novo `core/biblia/buscaGlobalWeb.ts` — em vez de lidar
com SQLite/WASM no navegador, faz busca em memória sobre o mesmo
`assets/biblia.json` já embutido no app (carregado sob demanda via
`import()` dinâmico só quando alguém busca de verdade, cacheado no
módulo depois da primeira busca; normalização de acento igual à já
usada em `core/content/busca.ts`). `buscarGlobal` agora chama isso no
web em vez de retornar `[]`.
**Testado ao vivo:** buscar "amor" retorna "Na Bíblia (50)" com
resultados reais de Gênesis/Êxodo/Levítico/Números, cada um com link
correto pro versículo (`/biblia/01-genesis/12?versiculo=13`
confirmado); buscar "coracao" (sem acento) encontra "coração" (Gênesis
6:5) — normalização de acento funcionando; sem erros no console.
**Limitação conhecida:** é busca por substring simples (contém o
termo), não busca por palavra/radical como o FTS5 nativo — não é
idêntica funcionalmente, mas resolve o problema real (zero resultados
sempre) com uma solução muito mais simples que integrar SQLite/WASM.

### 2.7 Favoritar/salvar versículo (distinto de grifar) `✅`
**Funcionalidade:** distinto de grifo e nota, `VersiculoSalvo`/
`versiculosSalvosRepository` (mesmo padrão `ownerId` + referência de
versículo dos outros repositórios). Acionado pela barra de seleção
múltipla na leitura do capítulo. `core/estatisticas/atividade.ts` agora
inclui um 4º tipo em `ItemAtividade` (`"salvo"`), com filtro
correspondente em `app/salvo.tsx` ("Salvos") e ação de excluir no
`CardAtividade`.
**UX/UI:** ícone de marcador (🔖/`bookmark`) distinto do grifo (cor) e
da nota (📝); tela `/salvo` e o botão "Salvos" da aba Você agora
mostram os versículos salvos de verdade.

### 2.8 Notas pessoais por versículo `✅`
**Funcionalidade:** campo de texto livre por versículo, editável e
removível (`components/ModalNota.tsx` + `NotasRepository`, com o método
`listarPorCapitulo` adicionado pra carregar todas as notas do capítulo
de uma vez, mesmo padrão de `GrifosRepository`). Testado: criar nota,
persistência confirmada no armazenamento, reabrir pra editar (mostra o
texto salvo e o botão "Remover"), remover.
**UX/UI:** ação de anotar acessada pela barra de seleção do versículo
(ver 2.3), não por um ícone fixo; nota editada em modal (não atrapalha a
leitura do capítulo em volta); prévia do texto da nota aparece embaixo
do versículo com um 📝, então não precisa abrir o modal só pra lembrar o
que escreveu.

### 2.9 Trocar tradução do texto bíblico `⬜`
**Funcionalidade:** bible-api.com tem outras traduções além da Almeida —
avaliar quais estão disponíveis e se são de domínio público (ver seção
jurídica do `PLANO-PLATAFORMA.md` antes de expandir isso).
**UX/UI:** seletor de tradução visível mas não intrusivo; persistir a
escolha por dispositivo.

### 2.10 Áudio da leitura `✅`
**Funcionalidade:** `core/leitura/audio.ts` — Web Speech API
(`SpeechSynthesisUtterance`) no web, `expo-speech` (novo, embrulha
`AVSpeechSynthesizer`/`TextToSpeech` nativos) no app nativo. Fala um
versículo por vez, não o capítulo inteiro numa string só — permite
saber exatamente qual versículo está sendo lido em cada instante (sem
isso, sincronizar destaque com fala exigiria estimar tempo por
caractere, impreciso). Áudio para automaticamente ao trocar de
capítulo/sair da tela (`useEffect` de cleanup), senão continuaria
falando em segundo plano um capítulo que a pessoa não vê mais.
**UX/UI:** botão de play/pause (`volume-up`/`pause-circle-outline`) no
cabeçalho da leitura, ao lado do botão de ajustes — só aparece se
`suportaAudio()` (evita mostrar num navegador sem Web Speech API) e só
na aba "Texto Bíblico" (não faz sentido narrar o resumo aqui, isso é
outra tela). O versículo sendo lido ganha o mesmo destaque visual do
auto-scroll (`bg-cor-destaque-fundo`) e a tela rola até ele
automaticamente, reaproveitando as posições já medidas via `onLayout`.

---

## 3. Progresso, engajamento e descoberta

### 3.1 Contador de progresso geral `✅`
**Funcionalidade:** "X de 66 livros lidos" na home.
**UX/UI:** hoje é só texto — considerar uma barra de progresso visual
(o site antigo tinha isso), mais fácil de captar num relance.

### 3.2 Versículo do dia `✅`
**Funcionalidade:** lista curada de 40 versículos (`core/biblia/versiculoDoDia.ts`),
escolha determinística pelo dia do ano, busca o texto real via
`BibliaAPI` (reaproveitando o cache já existente). Se a busca falhar, o
card agora mostra a mensagem de erro amigável (ver 2.2 —
`mensagemErroAmigavel`) com botão "Tentar novamente", em vez de somir
da tela sem explicação (comportamento anterior). **Não testado ao vivo
no navegador** — o tab navigator do Expo Router mantém a Início
montada em segundo plano ao trocar de aba, então simular a falha via
`fetch` mockado e trocar de aba pra forçar remontagem não funcionou
neste ambiente de teste (o componente não desmonta). A lógica
compartilhada (`buscarReferencia` + `mensagemErroAmigavel`) já foi
validada por testes automatizados e ao vivo na tela de leitura
(mesmo pipeline, idêntico) — confiança alta, mas fica registrado que
este componente específico não foi confirmado visualmente. As 4 ações
do rodapé do card (Amém/Anotar/Enviar/Mais), que antes eram só
decoração sem `onPress` nenhum (achado numa auditoria de UI —
pareciam totalmente funcionais e não faziam nada), agora são reais:
Amém alterna salvo (`versiculosSalvosRepository`), Anotar abre o mesmo
`ModalNota` da leitura de capítulo, Enviar chama `compartilhar()`
(mesmo padrão de toast "Copiado!"), Mais abre um `MenuAcoes` com
Copiar/Ver capítulo inteiro/Resumo do livro. A referência (formato
"Livro Capítulo:Versículo") é resolvida pro trio `livroSlug`/
`capitulo`/`versiculo` via novo `core/biblia/parseReferencia.ts`.
Testado ao vivo: salvar reflete em `/salvo`, nota persiste entre
navegações, ícones de coração/balão preenchem quando salvo/anotado.
**Achado à parte, não corrigido nesta rodada:** `referenciaAleatoria()`
existe em `versiculoDoDia.ts` mas não é chamada por nenhum componente
— o botão de "sortear outro versículo" mencionado numa versão anterior
deste documento não existe na UI atual (removido num redesenho do
card sem atualizar a documentação, aparentemente). Função órfã, sem
consumidor.
**UX/UI:** card de destaque no topo da home; ações do rodapé com
ícone preenchido/cor de destaque quando o estado é verdadeiro (salvo,
tem nota) — mesmo padrão visual já usado na leitura de capítulo.

**Problema de segurança de conteúdo corrigido (reportado por usuário,
2026-08-11):** o fundo do card usava `picsum.photos/seed/…`, que serve
fotos de banco aleatório (Unsplash Source por trás) indexadas por um
hash da referência do dia — sem curadoria nenhuma, podendo mostrar
qualquer imagem, incluindo conteúdo impróprio pro público jovem do
app (relatado: uma foto de casal com pouca roupa apareceu no card).
Removida a dependência de imagem externa por completo — sem fonte não
curada, zero risco de recorrência. Substituída por um gradiente sólido
nas cores de marca do app, sem nenhuma chamada de rede pra imagem. Se
no futuro quiser voltar a ter uma imagem de fundo, precisa ser um
conjunto pequeno e curado de paisagens específicas (bundladas no app
ou de uma fonte com controle editorial de verdade), nunca uma API de
foto aleatória.

**Correção de tema (2026-08-19):** o gradiente (e o texto/ícones em
cima dele) era fixo na paleta escura sempre, mesmo no modo claro —
reportado pelo usuário como parte de "muitos elementos [...] não
mudam pro modo claro junto com os outros" (ver 9.6). Corrigido:
`CardVersiculoDia` agora usa `useColorScheme()` pra escolher entre a
paleta escura original (`#40331f → #241d16 → #141210`) e uma nova
paleta clara em tom creme (`#f3e6d3 → #fdf9f2 → #faf8f4`, a partir do
token `cor-destaque-fundo`), com texto/ícones trocando entre branco
(escuro) e `cor-texto` (claro) — os únicos elementos do app que
realmente precisam ser cor fixa em hex são o array de cores do
`LinearGradient` e o `color` do `MaterialIcons`, nenhum dos dois aceita
`dark:`; todo o resto do card usa classes `dark:` normais, iguais ao
resto do app.

### 3.3 Conquistas de progresso `✅`
**Funcionalidade:** 6 marcos ligados à estrutura do cânon
(`core/content/conquistas.ts`): primeiro livro, Pentateuco completo, os
4 Evangelhos, Antigo Testamento completo, Novo Testamento completo, os
66 livros — calculados em cima de `livrosLidosRepository`, sem tabela
própria de progresso. Testado marcando o Pentateuco como lido: os selos
"Primeiro livro" e "Pentateuco completo" acendem, os outros 4 continuam
apagados.
No card resumido da Início (`CardConquistas.tsx`), "Saiba mais" (por
medalha) abre um modal com a descrição real da conquista
(`conquista.descricao`) e o progresso atual.
**UX/UI:** selos discretos (círculos pequenos, opacos quando bloqueados,
cheios quando conquistados) na home, sem número nem pontuação — só
reconhecimento silencioso.

**Bug real, reportado por usuário (2026-08-18):** "o botão que era pra
levar pra tela própria [de medalhas] [...] leva para a tela de perfil
[Você]" — "Ver Todos" (e "Ver todas" dentro do modal de detalhe)
levavam pra `/voce`, a aba inteira, não uma tela dedicada às medalhas —
porque essa tela nunca existiu (ver 9.6b). Corrigido criando
`app/medalhas.tsx` e apontando os dois pra lá.
**Inconsistência real, achada na mesma auditoria:** os ícones de
medalha do card do Início eram desenhados via `MaterialIcons` com um
mapeamento manual que só cobria 2 dos 6 ids de conquista (o resto caía
num ícone genérico de troféu, `emoji-events`) — enquanto a aba Você
sempre usou o emoji de verdade de cada conquista (`conquista.icone`).
Unificado: os dois agora renderizam o mesmo emoji do modelo de dados,
com a mesma técnica de opacidade reduzida (0.4) pra "não conquistada
ainda" já usada em Você — uma fonte de verdade só pro ícone de cada
medalha, em vez de duas.

### 3.4 Sequência de dias lendo ("streak") `✅`
**Funcionalidade:** calculado a partir das datas em que algum capítulo da
leitura bíblica foi marcado como lido (`core/estatisticas/streak.ts`),
não do "livro lido" dos resumos. Adicionado `listarTodos` ao
`ProgressoRepository` (antes só listava por livro) pra dar a base de
dados de todos os capítulos lidos, de qualquer livro, necessária pro
cálculo. Testado: 3 dias seguidos mostra a mensagem; um histórico com
intervalo (sem leitura há 5 dias) não mostra nada, sem aviso de sequência
quebrada.
**UX/UI:** decisão de tom tomada — nada de emoji de fogo, número em
destaque ou aviso de "não quebre". Só aparece a partir de 2 dias
seguidos (não pressiona ninguém no primeiro dia) e simplesmente some,
sem alarde, quando a sequência para. Texto simples, mesma cor de
destaque usada em outros lugares do app, não uma cor de alerta.

### 3.5 Estatísticas pessoais de leitura `✅`
**Funcionalidade:** tela própria (`app/estatisticas.tsx`) com livros
lidos, capítulos lidos, versículos grifados, notas escritas, sequência
atual (só se ≥ 2) e tempo estimado de leitura (estimativa por contagem
de capítulos, ~3,5 min cada, não cronometrado — deixado explícito na
tela). Precisou adicionar `listarTodos`/`listarTodas` a
`GrifosRepository` e `NotasRepository` (antes só listavam por capítulo),
mesmo padrão já usado em `ProgressoRepository`. Testado com dados
variados nas quatro fontes — todos os números bateram.
**UX/UI:** link discreto "Minhas estatísticas" na home (não polui a tela
principal com números), cartões simples numa grade, sem gráfico nem
comparação com outras pessoas.

---

## 4. Planos de leitura

### 4.1 Planos temáticos prontos `✅`
**Funcionalidade:** planos definidos em `core/content/dados/planos.json`
(lista de referências por dia), expostos via `core/content/planos.ts`
(`planosLeitura`, `obterPlano`). Tela de listagem em `app/planos/index.tsx`.
**UX/UI:** cada card mostra título, descrição e progresso; tela de
detalhe (`app/planos/[id].tsx`) lista os dias com as referências
tocáveis, linkando direto pro capítulo.

### 4.2 Progresso do plano `✅`
**Funcionalidade:** separado do progresso geral de livros/capítulos —
`PlanosRepository.alternarDiaConcluido`/`listarDiasConcluidos`
(`progresso_planos` no SQLite), independente de `ProgressoRepository`.
**UX/UI:** barra de progresso própria em cada card da listagem e no
topo da tela de detalhe do plano ("X de Y dias"), sem precisar entrar
numa tela separada pra ver o número.

### 4.3 Lembrete de plano atrasado `✅`
**Funcionalidade:** sem notificação push de verdade (exigiria conta +
backend) — aviso visual na Início (`core/leitura/lembretePlanos.ts`,
`obterLembretePlano`), calculado a partir da conclusão mais recente
registrada por plano (`PlanosRepository.obterUltimaConclusao`, novo
método). Só considera planos já iniciados (≥1 dia concluído), não
terminados, e parados há pelo menos 1 dia; escolhe o mais parado entre
vários candidatos. Um plano nunca iniciado não gera lembrete — fica só
na descoberta da tela de Planos.
**UX/UI:** card discreto na Início, tom de convite ("Que tal continuar
o [...]? sem pressa, retome quando quiser"), não de cobrança — sem
número de atraso nem alarme visual.

---

## 5. Compartilhamento

### 5.1 Compartilhar link de um livro/capítulo/versículo `✅`
**Funcionalidade:** `core/util/linkVersiculo.ts` monta o link
(`origin + /biblia/[livro]/[capitulo]?versiculo=N`) usando
`window.location.origin` — funciona em qualquer domínio, não depende
da decisão final de domínio (`PLANO-PLATAFORMA.md`). Só funciona na
versão *web*: o app nativo não tem esquema de URL customizado
configurado, então lá o compartilhamento continua sendo só texto/
referência, sem link (registrado como limitação conhecida, não
bloqueante). Aplicado em `compartilharVersiculos`/`copiarVersiculos`
na leitura do capítulo e na ação "Compartilhar" do `CardAtividade`
(grifo/nota/salvo). Usa `Share.share` do React Native no nativo
(sheet do sistema) e a Clipboard API no web (`core/estatisticas/
compartilhador.ts`), já existentes.
**UX/UI:** confirmação visual "Copiado!" no fallback web via um toast
global mínimo (`core/util/toast.ts` + `components/Toast.tsx`, montado
uma vez em `app/_layout.tsx`, pub-sub simples sem Context — qualquer
lugar do app chama `mostrarToast(mensagem)`, mesmo fora da árvore de
componentes). No nativo o próprio sheet do sistema (`Share.share`) já
serve de confirmação, sem precisar do toast.

### 5.3 Toast com botão de ação (Desfazer) `✅`
**Funcionalidade:** pedido do usuário — "evoluir componente toast
também", no contexto da marcação em massa (2.4c/2.4d): marcar ou
desmarcar vários capítulos de uma vez é fácil de fazer sem querer
(ex. "Selecionar todos" num livro errado). `mostrarToast()` ganhou uma
segunda forma, com opções (`{ acaoLabel, onAcao, duracaoMs }`) —
retrocompatível: todo chamador existente (`"Copiado!"`,
`"Imagem baixada!"`) continua funcionando sem mudança, só passando a
string. Quando há `acaoLabel`, o toast mostra um botão de ação ao lado
da mensagem (ex. "Desfazer") e fica visível o dobro do tempo (4s em
vez de 2s — dá tempo de ler e decidir antes de sumir sozinho); tocar
no botão cancela o timer de fechar automaticamente, roda `onAcao` e
fecha o toast na hora.
Usado hoje pela marcação em massa: desfazer restaura o estado
**individual** de cada capítulo antes da mudança (não só inverte tudo
em bloco) — importante porque uma seleção pode misturar capítulos já
lidos com não lidos; desfazer um "Desmarcar" aplicado a essa seleção
mista não pode marcar como lido quem nunca tinha sido lido antes.
**Testado ao vivo:** marcar 4 capítulos → toast "4 capítulos marcados
como lidos" com botão "Desfazer" → tocar reverte a contagem "4 de 34"
de volta pra "0 de 34" na hora, e o estado revertido também sobrevive
a um reload da página (persistiu no banco de verdade, não só na
memória).

### 5.2 Gerar imagem de versículo pra compartilhar `✅`
**Funcionalidade:** duas implementações que convergem no mesmo modal
de preview em `app/(tabs)/biblia/[livro]/[capitulo].tsx`:
- **Web** (`core/util/gerarImagemVersiculo.ts`): cartão 1080x1080
  desenhado direto via Canvas API (sem dependência nova, sem
  servidor), fundo em gradiente com as cores de marca do app (mesmos
  tons de `cor-fundo-dark`/`cor-destaque-dark`), quebra de linha
  manual (`measureText`) e tamanho de fonte que diminui
  automaticamente pra versículos longos não estourarem o cartão.
- **Nativo** (2026-08-20, `components/CartaoVersiculoImagem.tsx`):
  como não dá pra desenhar em Canvas no nativo, o mesmo cartão é uma
  `View` de verdade (gradiente via `expo-linear-gradient`, já era
  dependência do projeto) renderizada fora da tela
  (`top: -9999, left: -9999`) e capturada com `react-native-view-shot`
  (`captureRef`) assim que monta com o texto certo (`useEffect` que
  observa o estado `cartaoNativoParaCapturar`). O PNG resultante
  (`file://...`) alimenta o mesmo `<Image>` de preview que o web usa
  pro `data:` URI. Instalado `expo-sharing` pra compartilhar o
  arquivo — o botão "Baixar" do modal vira "Compartilhar" no nativo
  e chama `Sharing.shareAsync` em vez do link de download do DOM.
  **Limitação registrada:** não dá pra validar 100% sem um
  dispositivo/simulador nativo à mão neste ambiente (só navegador
  disponível) — o caminho web foi reverificado ao vivo depois da
  mudança (canvas 1080×1080 decodificado, PNG baixado via link
  temporário, segue funcionando igual); o caminho nativo (captura da
  View + `Sharing.shareAsync`) ficou sem teste ao vivo em dispositivo
  real, só revisão de código e `tsc`/`jest` limpos.
**UX/UI:** botão "Imagem" na barra de seleção da leitura (ao lado de
Compartilhar), agora visível em toda plataforma (antes só aparecia no
web via `suportaImagemVersiculo()`, removido). Abre um modal de
preview com "Baixar"/"Fechar" no web ou "Compartilhar"/"Fechar" no
nativo. Fonte serifada (Georgia) e cores herdadas da identidade visual
do app, não uma captura de tela crua da interface.

---

## 6. Conta de usuário e sincronização

### 6.1 Criar conta / login `⬜`
**Funcionalidade:** depende da decisão de banco de dados (Supabase ou
Firebase, ver `PLANO-PLATAFORMA.md`), e da política de idade mínima (ver
seção jurídica) antes de implementar. A camada de dados já foi desenhada
pra isso (`ownerId` trocável, ver Decisão 2).
**UX/UI:** fluxo de cadastro/login o mais simples possível (menos campos
possível), sem forçar conta pra usar o essencial do app — login deve ser
valor agregado (sincronizar), nunca uma barreira de entrada.

### 6.2 Migrar dados locais pra conta na hora do primeiro login `⬜`
**Funcionalidade:** ler tudo que já existe no `ownerId` anônimo do
dispositivo e associar à conta recém-criada, sem perder nada que a
pessoa já tinha marcado/grifado.
**UX/UI:** transparente — a pessoa não deveria nem perceber que uma
migração aconteceu, só ver seus dados intactos depois de logar.

### 6.3 Sincronizar entre dispositivos `⬜`
**Funcionalidade:** trocar a implementação dos repositórios locais por
uma que fala com o banco de dados (o ponto de troca já existe:
`core/repositories/index.ts`).
**UX/UI:** indicador discreto de sincronização (sem travar a interface
esperando rede) — grifar/marcar como lido precisa continuar instantâneo
mesmo offline, sincronizando em segundo plano.

### 6.4 Exportar/apagar meus dados `✅`
**Funcionalidade:** implementado 2026-08-19, antes de existir qualquer
sistema de conta — o direito de exportar/apagar já faz sentido hoje,
já que todo dado do app é isolado por um `ownerId` anônimo por
dispositivo desde o início (nenhuma dependência de login). Nova seção
"Meus dados" em `app/configuracoes.tsx`, usando
`core/util/dadosPessoais.ts`:
- **Exportar**: `coletarDadosPessoais(ownerId)` agrega, em paralelo,
  tudo dos 7 repositórios (grifos, capítulos lidos, notas, livros
  lidos, pesquisas favoritas, versículos salvos, e dias concluídos de
  cada plano de leitura) num único JSON com timestamp. No web, baixa
  um arquivo `meus-dados-AAAA-MM-DD.json` via Blob; no nativo, abre o
  share sheet do sistema (`Share.share`) com o JSON — mesmo padrão já
  usado pra compartilhar versículos, sem dependência nova.
- **Apagar**: `apagarDadosPessoais` reaproveita os métodos de
  alternar/remover que cada repositório já tinha (todos idempotentes:
  chamar em cima de um item existente sempre remove) em vez de criar
  um `apagarTudo` novo em cada repositório — menos superfície de
  código pra uma ação que roda raras vezes. Atrás de um modal de
  confirmação (mesmo padrão visual dos outros modais do app), com
  texto explícito de que não pode ser desfeito.
**UX/UI:** nova seção "Meus dados" dentro de Configurações, ação
destrutiva com texto vermelho e confirmação obrigatória antes de
apagar; toast de confirmação depois de cada ação.
**Testado ao vivo:** marquei Gênesis 1 como lido, exportei (toast
"Dados exportados!"), confirmei que o registro estava em
`localStorage`, apaguei tudo pelo fluxo real da UI (botão → modal →
"Apagar tudo"), e confirmei que `capitulos-lidos` no `localStorage`
esvaziou (`[]`) — não só que a UI relatou sucesso, mas que o dado
realmente sumiu da persistência.

---

## 7. Qualidade, acessibilidade e performance

### 7.1 Pré-renderização estática por rota (SEO) `⬜`
**Funcionalidade:** hoje o app exporta um único `index.html` (ver Decisão
12 do `PLANO-PLATAFORMA.md`) — sem conteúdo pré-renderizado por livro,
pior pra SEO que o site antigo. Configurar o Expo Router pra gerar HTML
por rota de conteúdo.
**UX/UI:** não é uma funcionalidade visível, mas afeta diretamente quantas
pessoas novas chegam pelo Google — priorizar antes de investir em
divulgação.

### 7.2 Navegação só por teclado / leitor de tela `🔶`
**Funcionalidade:** varredura de todos os `Pressable` com ícone e sem
texto visível ao lado (screen reader não tem o que ler) — corrigido em
`app/(tabs)/biblia/[livro]/[capitulo].tsx` (voltar, abrir ajustes de
leitura, cancelar seleção, cada bolinha de cor de grifo, expandir mais
cores, A-/A+) e no sino de notificação da Início (também estava
focável sem rótulo e sem ação — marcado `disabled` com label "em
breve", mesmo padrão já usado no botão de notificação diária do card
de versículo do dia). Os demais ícones do app já tinham texto visível
ao lado (ex.: "Salvos", "Configurações") ou eram só decorativos dentro
de blocos não interativos — não precisavam de label. **Faltou:** teste
de verdade com leitor de tela (VoiceOver/NVDA), não só a varredura de
código; e foco visível consistente em navegação por teclado (Tab) —
nenhum dos dois foi verificado ainda.
**UX/UI:** foco visível consistente em qualquer elemento navegável via
teclado (o site antigo tinha isso resolvido — reaproveitar o padrão) —
ainda pendente.

**Continuação (2026-08-19): estado não era anunciado em nenhum
toggle.** Auditoria (agente de busca dedicado) achou que vários
controles do tipo liga/desliga tinham `accessibilityLabel` mas nenhum
`accessibilityState` — um leitor de tela lê o rótulo, mas nunca diz se
o tema está claro/escuro, se o capítulo já foi marcado como lido, se a
cor de grifo já está aplicada, etc. Adicionado `accessibilityRole`
(`switch`/`tab`/`checkbox`, conforme o caso) + `accessibilityState` em:
tema (`BotaoTema`), abas "Texto Bíblico"/"Resumo" e "Marcar capítulo
como lido" na leitura, cada bolinha de cor de grifo, o toggle "Salvar"
da barra de seleção múltipla, o "Amém" do card do Versículo do Dia,
os chips de filtro em `/salvo`, e as células de `GradeCapitulos`
(estado "lido" fora do modo de seleção, "selecionado" dentro dele).
**Achado técnico real no processo:** a versão do `react-native-web`
usada no projeto (0.21.2) **não traduz** a prop moderna
`accessibilityState={{ checked/selected }}` do React Native pra
`aria-checked`/`aria-selected` no DOM — confirmado lendo o código-fonte
da lib (`accessibilityState` não está na lista de props repassadas de
`View`/`Pressable` pro elemento real). Ela só reconhece as props
achatadas antigas `accessibilityChecked`/`accessibilitySelected`
(de antes do RN unificar tudo em `accessibilityState`). Sem isso,
os atributos ARIA simplesmente não apareciam no DOM, apesar do código
"parecer certo" e passar no nativo. Corrigido mantendo os dois em
paralelo: `accessibilityState` (nativo) + a prop achatada equivalente
(web) — igual ao precedente já registrado com `dataSet` em
`GradeCapitulos.tsx`. Testado ao vivo lendo `aria-checked`/
`aria-selected` do DOM antes/depois de cada interação (ex.: alternar
tema: `aria-checked` vai de `"true"` pra `"false"` no clique).

**Tentativa real, não concluída (2026-08-19): foco visível em
navegação por teclado.** Tentei adicionar uma regra CSS global
(`global.css`) pra mostrar um contorno visível em qualquer elemento
focado via Tab (hoje nenhum elemento do app mostra indicação nenhuma
de foco de teclado). **Achado técnico real:** o pipeline de CSS do
NativeWind/Metro desta versão do projeto **descarta silenciosamente**
qualquer seletor baseado em pseudo-classe de foco (`:focus`,
`:focus-visible`, com ou sem `*` na frente) — confirmado lendo
`document.styleSheets` depois do build: a regra simplesmente não
aparece no CSS final, mesmo sem erro nenhum reportado. Pior: combinar
com `html.dark` como ancestral (`html.dark :focus-visible {...}`) **trava
o app inteiro** (tela em branco, sem nenhum erro no console) —
reproduzido de forma isolada (revertendo só essa regra o app volta a
funcionar). Seletores baseados em tag/classe simples (`html, body
{...}`, já existentes no arquivo) funcionam normalmente — o problema é
especificamente com pseudo-classes de foco soltas no CSS global.
**Não resolvido ainda:** provável próximo caminho é aplicar foco via
className por componente (`focus:` do NativeWind, se suportado pela
mesma versão — não testado) em vez de uma regra CSS global, o que
exigiria tocar em cada `Pressable`/`TextInput` interativo (~90+
elementos) — escopo bem maior que uma regra CSS única, avaliar depois
se vale o esforço nesse formato.

**Continuação (2026-08-20): auditoria completa de todo `Pressable` das
telas principais e componentes compartilhados.** Varredura manual de
todos os `app/**/*.tsx` e `components/**/*.tsx` listados no plano
(item B do `TODO.md`) — mais de 100 ocorrências de `Pressable` em 24
arquivos. **Achado:** boa parte já tinha `accessibilityLabel` de uma
auditoria anterior, mas faltava `accessibilityRole="button"` (ou
`"link"`/`"tab"`/`"checkbox"`/`"switch"` conforme o caso) na maioria —
sem role, um leitor de tela não anuncia o elemento como algo
interativo/acionável, só lê o texto solto. Corrigido em ~70 elementos
espalhados por `voce.tsx`, `configuracoes.tsx`, `pesquisa.tsx`,
`index.tsx`, `planos/[id].tsx`, `planos/index.tsx`,
`biblia/escolher/index.tsx`, `biblia/[livro]/[capitulo].tsx` (mais
~18 que já tinham label mas não role), `resumos/index.tsx`,
`resumos/[livro].tsx`, `_layout.tsx` (abas viraram `role="tab"` com
`accessibilityState`/`accessibilitySelected` em paralelo — mesmo
achado técnico do RNW 0.21.2 documentado acima), e nos componentes
`CardAtividade`, `CardConquistas`, `CardVersiculoTema`, `MenuAcoes`,
`ModalNota`, `ModalPerfil`, `PopoverVersiculo`, `Toast`, `Tooltip`,
`CardVersiculoDia`. Também viraram toggle de verdade (role
`switch`/`checkbox` + `accessibilityState` + prop achatada em
paralelo) três controles que pareciam decorativos mas eram
liga/desliga sem anúncio de estado: "Fonte serifada" e "Lembrete
diário" em `configuracoes.tsx`/`resumos/[livro].tsx`, "Favoritar
busca" em `pesquisa.tsx`, e "Marcar livro como lido" em
`resumos/[livro].tsx`. Backdrops de modal (o `Pressable` que só fecha
ao tocar fora) foram deixados sem role — não são um controle
navegável por si, são a área de fundo do próprio modal. Testado ao
vivo: `aria-checked`/`aria-selected` aparecem e alternam corretamente
no DOM pros toggles de tema/fonte serifada (`configuracoes`) e pras
abas de filtro em `/salvo`. **Faltou (mesma lacuna já registrada
acima):** teste de verdade com leitor de tela (VoiceOver/NVDA) — só
varredura de código + inspeção de DOM via script, não uso real de
leitor de tela; e o foco visível por teclado continua pendente.

### 7.3 Leitura offline de verdade `✅`
**Funcionalidade:** no app nativo instalado, o conteúdo dos resumos já
funciona offline (é dado embutido no app), e a Bíblia inteira também
(ver 2.6, `assets/biblia.json` + SQLite FTS5).

**Correção real (2026-08-19): esta seção dizia "a leitura bíblica não
depende mais de rede em nenhuma plataforma desde a migração pro
SQLite" — falso pro web.** A migração pro SQLite só cobria o nativo; a
leitura de capítulo no web sempre bateu na `bible-api.com` a cada
capítulo aberto (só um cache LRU de 200 capítulos via AsyncStorage,
não a Bíblia inteira offline), e a busca "Na Bíblia" no web sempre
retornava vazio (ver bug em 2.6). Corrigido: `buscarReferencia` agora
tenta `core/biblia/leituraLocalWeb.ts` primeiro no web (lê
`assets/biblia.json` direto, mesmo carregador cacheado que a busca
usa, extraído pra `core/biblia/bibliaLocalWeb.ts`), caindo pra
`bible-api.com` só como rede de segurança se a busca local falhar por
algum motivo. **Testado ao vivo:** abrir `/biblia/19-salmos/23` e
buscar "amor"/"coracao" na aba Descubra não geram **nenhuma**
requisição de rede pra `bible-api.com` (conferido na aba de rede do
navegador); Metro faz code-splitting de verdade dos módulos novos —
carregados em chunks `lazy=true` separados
(`leituraLocalWeb.bundle`, `buscaGlobalWeb.bundle`,
`assets/biblia.bundle`), só sob demanda, não inflam o bundle inicial.

Na versão *web*, a app em si (bundle JS/CSS/HTML) também tem
estratégia de offline: `public/sw.js`, um service worker registrado
via `core/registrarServiceWorker.ts` (chamado em `app/_layout.tsx`,
só no web). Estratégia deliberadamente conservadora — navegação
(HTML) é *network-first* (nunca prende a pessoa numa versão antiga do
app enquanto online), assets com hash no nome (JS/CSS do build) são
*cache-first* (seguro porque o conteúdo nunca muda sob o mesmo nome de
arquivo). Confirmado com `npx expo export --platform web` que o Expo
Router copia `public/**` pro `dist/` de verdade (não documentado
explicitamente, testado na prática); o `vercel.json` já prioriza
arquivos estáticos reais sobre o rewrite catch-all pro SPA, então
`/sw.js` chega ao navegador como script, não como `index.html`
reescrito — mesmo comportamento que já garante que o bundle JS
carrega hoje. **Testado ao vivo:** confirmado que o service worker registra
(`scope: /`, `active: true`) rodando o app de verdade no navegador.
**Achado durante o teste, não previsto:** em modo dev (`expo start
--web`, Metro), as URLs do bundle JS não têm hash de conteúdo (ao
contrário do build de produção, que usa nomes com hash — ver Decisão
12 do `PLANO-PLATAFORMA.md`) — então o cache-first do service worker
pode servir uma versão desatualizada do app *só em dev*, entre uma
sessão de teste e outra, mascarando mudanças de código novas. Não é um
bug da estratégia (que é sã e testada em produção via nomes com hash),
é uma armadilha de testar localmente com o SW ativo: sempre que o
código mudar durante o desenvolvimento, rodar
`navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()))`
+ limpar `caches` no console antes de testar de novo (ou usar aba
anônima). **Ainda falta**: testar em deploy real de produção (DevTools
"Offline"), onde esse problema específico de dev não se aplica.
**UX/UI:** aviso claro quando uma funcionalidade não está disponível
offline (ex.: "sem conexão — grifos serão sincronizados quando voltar",
não um erro genérico) — ainda não avaliado, hoje o app já funciona
offline de fato tanto no nativo quanto (depois da primeira visita) no
web, então esse aviso importa menos do que antes.

### 7.4 Auditoria de performance `🔶`
**Funcionalidade:** medido com `npx expo export --platform web`
(2026-08-10): bundle JS único de 1.8MB (~470KB gzip), CSS 19KB. Acima do
alvo comum de referência (~200KB gzip pra "bom" segundo o Lighthouse),
mas ainda numa faixa razoável pra um app com todo o texto da Bíblia
embutido (`assets/biblia.json`, ver 2.6) — a maior parte do peso
provavelmente é dado, não código. **Faltou:** medir separadamente
quanto do bundle é `assets/biblia.json` vs. código de verdade.
**UX/UI:** tela de carregamento/skeleton em vez de tela branca enquanto
o app inicializa, se o tempo de carga não puder cair o suficiente —
ainda não avaliado.

**Continuação (2026-08-19) — a dúvida acima já tem resposta, de graça:**
a correção da leitura/busca offline (ver 2.6/7.3) já isolou
`assets/biblia.json` num chunk `lazy=true` separado
(`core/biblia/bibliaLocalWeb.ts`, `import()` dinâmico), então a medição
de bundle agora já responde a pergunta antiga sem precisar de
ferramenta extra:
- `entry-*.js` (bundle principal, carregado em toda página): **1.85MB
  bruto / ~483KB gzip** — código de verdade, sem o texto da Bíblia.
- `biblia-*.js` (o JSON da Bíblia inteira): **4.2MB bruto / ~1.2MB
  gzip** — carregado só sob demanda (abrir um capítulo ou buscar), não
  faz parte do carregamento inicial.
- CSS: 21.6KB bruto / ~4.5KB gzip.

Ou seja: o bundle inicial de verdade (o que trava o primeiro
carregamento) é ~483KB gzip — ainda acima do alvo "bom" do Lighthouse
(~200KB), mas o texto bíblico (a maior parte do peso total do projeto)
**não** faz parte disso mais. Reduzir os ~483KB exigiria code
splitting por rota (cada tela carregar seu próprio chunk, não tudo
junto) — que é literalmente o `output: "static"` do Expo Router
avaliado no item 7.1/E do `TODO.md`, hoje não ativado por risco de
quebrar rotas dinâmicas em produção sem um jeito de testar num preview
deploy antes. Ou seja, os itens 7.1 e 7.4 convergem pra mesma mudança:
não vale otimizar performance de carregamento sem resolver primeiro o
roteamento estático.
**Sobre re-renders desnecessários:** revisado o código das duas listas
grandes do app — a lista de 66 livros (`/biblia/escolher`) já usa
`FlatList` (virtualizada, só renderiza o que está visível). A grade de
capítulos (`GradeCapitulos.tsx`) usa `.map()` direto (não virtualizada)
— até 176 células pro maior livro (Salmos). Não achei evidência de
problema real (176 `View`s simples não é pesado pra um navegador
moderno), então não mudei nada especulativamente — fica registrado
como algo a reconsiderar só se algum dia virar um problema medido de
verdade, não antes.

### 7.6 Fundo consistente no "bounce" de rolagem mobile `✅`
**Funcionalidade:** `html`/`body` não tinham `background-color` definido
(ficavam transparentes), então no tema escuro, ao rolar além do fim do
conteúdo em Safari/Chrome mobile (o "bounce" de rolagem do iOS/Android),
aparecia uma faixa branca do fundo padrão do navegador — reportado pelo
usuário testando no celular. Corrigido em `global.css` com regra direta
pra `html`/`html.dark` (não dá pra usar a variável Tailwind ali, os
valores hex repetem `cor-fundo`/`cor-fundo-dark` do `tailwind.config.js`).
**UX/UI:** sem isso, qualquer tela mais alta que o viewport quebrava a
imersão do tema escuro no primeiro/último scroll — agora o fundo é
contínuo em qualquer ponto da rolagem, nos dois temas.

### 7.5 Atalhos de teclado (versão web) `✅`
**Funcionalidade:** na tela de leitura de capítulo
(`app/(tabs)/biblia/[livro]/[capitulo].tsx`), seta esquerda/direita
navega pro capítulo anterior/próximo (já existia) e `T` alterna o tema
(`core/theme.ts`, `alternarTema`, novo). Ignora as teclas quando o foco
está num `INPUT`/`TEXTAREA` (ex.: campo de nota ou busca), pra não
capturar digitação normal.
**UX/UI:** dica discreta via `title` (tooltip nativo do navegador, só
aparece web) na barra fixa de navegação de capítulo — não polui a tela
principal com texto visível.

### 7.7 Feedback visual de toque em todos os botões `✅`
**Funcionalidade:** achado real (pedido do usuário, citando as
heurísticas de Nielsen — "visibilidade do status do sistema"):
nenhum `Pressable` do app inteiro tinha qualquer feedback visual de
toque — nem `active:` do NativeWind, nem a função de estilo
`({ pressed }) => ...`. Em mobile isso significa tocar um botão e não
ter nenhuma confirmação visual de que o toque registrou até a ação em
si terminar (navegação, mudança de estado) — sensação de app travado
ou sem resposta, mesmo funcionando por baixo. Adicionado `active:` do
NativeWind v4 (`active:opacity-XX` na maioria dos casos; `active:bg-*`
nas linhas de lista de largura total, onde escurecer o fundo lê melhor
que apagar o botão inteiro) em 84 dos 95 `Pressable`s do app — os 11
restantes são backdrops de modal (tocar fora pra fechar, não é um
"botão" no sentido da heurística) ou botões já `disabled` (sino de
notificação, "Envie-me Diariamente", ambos aguardando backend).
Cobertura completa: leitura de capítulo (a tela mais usada do app —
29 botões), grade de capítulos, menu de ações, modal de nota, tooltip
de gênero, e todas as telas principais (Início, Descubra, Você,
Planos, Resumos, Configurações, Salvo, navegação de abas).
Confirmado ao vivo no navegador: a classe `active:opacity-70`
aparece corretamente no DOM de cada botão editado, e a regra CSS
gerada (`.active\:opacity-70:active { opacity: 0.7; }`) usa o
pseudo-seletor `:active` nativo do CSS — o mecanismo padrão do
NativeWind pra isso, funciona em toque/clique real tanto no web
quanto (via `onPressIn`/`onPressOut`) no nativo. **Não foi possível
simular visualmente o toque pressionado via automação** (eventos
sintéticos de mouse não disparam o estado `:active` do navegador de
forma confiável em ambiente headless) — a corretude foi confirmada
inspecionando a classe aplicada e a regra CSS gerada, não por um
screenshot do estado pressionado.
**UX/UI:** intensidade da opacidade varia por tipo de elemento —
`opacity-60` pra ícones pequenos (mais sutil, alvo de toque menor),
`opacity-70` pra botões de texto/pílulas, `opacity-80`/`opacity-90`
pra cards grandes e botões de destaque com cor sólida (mudança mais
sutil pra não "piscar" numa área grande).

### 7.8 Alvos de toque pequenos demais `✅`
**Funcionalidade:** auditoria feita medindo `getBoundingClientRect()`
de todo botão com `accessibilityLabel` ao vivo no navegador (não só
inspeção de código) — achou 4 casos reais abaixo do mínimo
recomendado (44×44 iOS / 48×48 Material): "Cancelar seleção" na barra
de seleção múltipla da leitura (24×24px), as bolinhas de cor de grifo
e "Ver todas as cores" (32×32px cada), e o botão de engrenagem de
Configurações em `/voce` (36×36px). Também achado nos mesmos 4 botões
de ação do card do Versículo do Dia (Amém/Anotar/Enviar/Mais): a área
clicável real era só 25-36px de largura porque cada `Pressable` só
media o próprio conteúdo (ícone+rótulo), mesmo distribuído numa linha
larga com `justify-between` — o espaço *entre* eles não era clicável,
apesar de parecer uma faixa contínua.
**Tentativa inicial que não funcionou, registrada pra não repetir o
erro:** primeiro tentei resolver só com a prop `hitSlop` do React
Native — mas `hitSlop` **não é implementado no `react-native-web`**
(confirmado lendo o código-fonte de `node_modules/react-native-web`,
nenhuma menção à prop). Funciona só no app nativo; no build web
(o alvo principal hoje, ver PLANO-PLATAFORMA.md) não tinha efeito
nenhum — só descobri isso medindo de novo depois de aplicar e ver que
o tamanho real não mudou.
**Correção que funciona de verdade:** aumento real da caixa clicável
via `padding`/tamanho maior + margem negativa pra compensar (não muda
o espaço ocupado no layout), mantendo o elemento visual (círculo,
ícone) do mesmo tamanho por dentro, numa `View` aninhada quando
necessário. Cores de grifo e "Ver todas": caixa cresceu de 32px pra
44px, círculo visual continua 32px (confirmado medindo o elemento
interno separadamente). "Cancelar seleção": 24px → 40px via
`padding` + margem negativa. Configurações: 36px → 44px (aumentado
direto, sem vizinhos apertados por perto). Card do Versículo do Dia:
os 4 botões agora usam `flex-1` pra reivindicar toda a fatia da linha
como área de toque (72×52px medido, contra 25-36px antes).
**UX/UI:** nenhuma mudança visual perceptível nos elementos pequenos
(cores de grifo, "Ver todas", "Cancelar") — só a área de toque
invisível cresceu. Configurações e os botões do Versículo do Dia
tiveram um crescimento visual sutil, aceitável dado o ganho de
usabilidade.

### 7.9 Carrosséis horizontais não arrastáveis com mouse `✅`
**Funcionalidade:** reportado por usuário: "o Continue lendo da
página inicial parece um carrossel mas não é" — esclarecido por ele
mesmo como "não desliza no PC". Causa real: as três `ScrollView
horizontal` do app (Início "Continue lendo", Você "Medalhas", barra
de seleção múltipla da leitura) tinham `showsHorizontalScrollIndicator=
{false}` (escondendo a única forma nativa de um mouse comum rolar
horizontalmente no navegador) e nenhum suporte a arrastar-com-o-mouse
— só funcionavam via trackpad, touch, ou scroll+shift, nenhum dos
quais um desktop com mouse simples tem. Confirmado ao vivo antes da
correção: `scrollLeft` mudava só via manipulação programática, não
por gesto de mouse nenhum.
Novo `core/util/useArrastarParaRolar.ts` — hook reutilizável que, só
no web, prende `mousedown`/`mousemove`/`mouseup` no nó real de scroll
(via `getScrollableNode()` do `react-native-web`) e move `scrollLeft`
proporcionalmente ao arraste, com cursor `grab`/`grabbing` (mesmo
padrão visual do Twitter/Instagram web). Depois de um arraste de
verdade, suprime o `click` seguinte — sem isso, soltar o mouse em
cima de um card dispararia a navegação dele junto com o fim do
arraste, mesmo quando a intenção da pessoa era só rolar.
**Armadilha real encontrada durante a implementação:** a primeira
versão usava `useRef` + `useEffect` de montagem única — não
funcionava, porque nas três telas a `ScrollView` só monta depois que
os dados carregam de forma assíncrona (`recentes.length > 0` etc.), e
o efeito de montagem única do componente roda *antes* desse elemento
existir, então nunca prendia o listener em nada (`ref.current` vinha
`null`). Só descobri isso instrumentando o próprio hook com um
atributo de depuração e vendo que ele nunca aparecia no DOM, apesar
de um log anterior sugerir (enganosamente) que tinha funcionado.
Corrigido trocando pra **callback ref** (`useCallback` retornando a
função em vez de `useRef`) — React chama isso exatamente quando o nó
real monta ou desmonta, não importa quando isso aconteça, resolvendo
o problema de tempo de vez.
**Testado ao vivo, ponta a ponta:** simulei `mousedown` → `mousemove`
→ `mouseup` de verdade nas três telas — `scrollLeft` mudou de 0 pra
77 (máximo, batendo com `scrollWidth - clientWidth`) durante o
arraste, cursor virou `grabbing`, e ficou na posição depois de soltar.
Confirmado nas três: Início, Você, e a barra de seleção da leitura.

### 7.10 Botões "em breve" sem indicação visual de desabilitado `✅`
**Funcionalidade:** auditoria componente por componente (Início →
`components/CardVersiculoDia.tsx`) achou dois `Pressable disabled` com
aparência idêntica a um botão normal e ativo: o sino de notificações do
cabeçalho e "Envie-me Diariamente" no card do Versículo do Dia. Nenhum
dos dois tinha pista visual (heurística de Nielsen "visibilidade do
estado do sistema") — só o `accessibilityLabel` do sino mencionava "em
breve", e nem isso existia no botão do card. Corrigido: `opacity-40`
nos dois, `accessibilityLabel` no botão do card, e o próprio texto
visível passou a dizer "(em breve)" explicitamente. Confirmado ao vivo
via `getComputedStyle` (`opacity: 0.4`) e leitura do texto renderizado.
**UX/UI:** cursor `grab` (mão aberta) ao passar o mouse sobre a área
rolável, `grabbing` (mão fechada) durante o arraste — mesma
convenção visual já esperada de qualquer carrossel/galeria horizontal
na web.

---

## 8. Infraestrutura de plataforma

### 8.1 Publicar nas lojas de app `⬜`
**Funcionalidade:** taxa de desenvolvedor (Apple/Google), processo de
build via EAS, rótulos de privacidade obrigatórios (ver seção jurídica
do plano).
**UX/UI:** ícone e tela de splash com identidade visual própria, não os
padrões do template do Expo.

### 8.2 Notificações push `⬜`
**Funcionalidade:** exige conta + backend (não faz sentido sem login,
pra saber pra quem notificar) — depende da Decisão de banco de dados.
**UX/UI:** opt-in claro, nunca ativado por padrão sem pedir permissão
explicitamente, com controle fácil de desativar depois.

### 8.3 Página "Sobre o projeto" `✅`
**Funcionalidade:** implementada 2026-08-19 em `app/sobre.tsx`,
alcançada por um link em Configurações → Sobre. Seções: o que é o
projeto (independente, sem vínculo institucional), fonte do texto
bíblico (Almeida Corrigida Fiel, domínio público, embutido no app —
por isso a leitura funciona offline), origem dos resumos (conteúdo
autoral, posição tradicional/conservadora nas questões de debate
acadêmico real, citando visão alternativa quando relevante),
limitações (não é uma edição acadêmica/crítica), privacidade (sem
conta, dado isolado por dispositivo, link direto pra "Meus dados" em
Configurações — ver 6.4) e um link pro repositório no GitHub (o
projeto é open source).
**UX/UI:** tom transparente e honesto sobre debates acadêmicos,
alinhado com a diretriz de conteúdo do projeto.

---

## 9. Navegação e organização do app

Planejado em detalhe em [PLANO-NAVEGACAO.md](PLANO-NAVEGACAO.md) — só
planejamento por enquanto, nada implementado ainda. Estrutura definida
(v2, substitui uma primeira versão mais genérica do plano): 4 abas —
**Início, Bíblia, Pesquisa, Você** — inspiradas na estrutura do app de
Bíblia mais baixado da Play Store. Configurações não é aba própria, é
uma tela alcançada por um card no fim de "Você".

### 9.1 Casca de navegação: 4 abas + passe visual Material `✅`
**Funcionalidade:** Início, Bíblia, Pesquisa, Você via route group
`app/(tabs)/` do Expo Router, com o conteúdo que já existe hoje (sem
funcionalidade nova ainda). URLs de telas de detalhe não mudam. Feito:
as 4 abas existem e funcionam (testado no navegador, mobile), incluindo
um `_layout.tsx` extra dentro de `biblia/` que precisou ser criado pra
evitar que a rota aninhada `[livro]/index` vazasse como uma 5ª aba.
Pesquisa e Você ainda são placeholders "Em breve" (conteúdo real nas
seções 9.4/9.5 e 9.6). `@expo/vector-icons` **precisou ser instalado**
(não vinha incluso, ao contrário do que este item dizia originalmente)
— usar sempre `import X from "@expo/vector-icons/NomeDoIcone"` (nunca
o barrel `{ X } from "@expo/vector-icons"`), senão o bundle web infla
~500KB à toa.
**UX/UI:** bordas arredondadas + sombra aplicadas por enquanto só à
tela de escolher livro (o resto do app recebe o mesmo tratamento
conforme cada tela for reconstruída nas próximas fases, não numa
varredura solta). Adaptação de barra lateral no desktop implementada
(`app/(tabs)/_layout.tsx`, primitivos headless `expo-router/ui` —
`Tabs`/`TabList`/`TabTrigger`/`TabSlot` — trocando bottom tabs por
sidebar de 224px acima de 768px de largura; ver PLANO-NAVEGACAO.md
item 1.9 pro raciocínio completo, incluindo duas pegadinhas da API
headless documentadas lá).

### 9.2 Início redesenhado `✅`
**Funcionalidade:** card "Estude por resumos" leva pra `/resumos`
(lista de livros + busca, que saiu da Início e ganhou rota própria);
card de sequência (streak) com SVG de fogo animado (cinza/parado em 0,
colorido/animado acima de 0, mensagem motivacional, lógica de mensagem
extraída pra `core/estatisticas/mensagemStreak.ts` — compartilhável com
a futura aba Você); card de conquistas expansível, cada uma com nome
próprio, descrição e barra de progresso (`Conquista` estendida com
`descricao`/`progressoAtual`/`progressoTotal`). `react-native-svg`
precisou ser instalado (não vinha incluso). Testado com dado real
injetado: streak de 2 dias mostrando mensagem certa, 2/6 conquistas
calculadas corretamente (Primeiro Passo + Pentateuco completo).
**UX/UI:** botão "🔔 Envie-me diariamente" no card do versículo do dia
aparece desabilitado, com aviso "em breve" — a ação real (notificação
diária) fica em backlog explícito (9.10), depende de conta + backend
com agendamento. **Bug corrigido durante a implementação:** animar o
componente `Svg` diretamente (em vez de um `Animated.View` por fora)
gerava erro de console no web e quebrava a renderização — corrigido,
registrado como padrão a seguir em `PLANO-NAVEGACAO.md`.

### 9.3 Bíblia: última leitura + navegação fixa `✅`
**Funcionalidade:** aba Bíblia abre direto no último capítulo lido
(`core/leitura/ultimaLeitura.ts`), ou Gênesis 1 na primeira vez. Barra
fixa no rodapé `← Livro Capítulo →` substitui os cards
"Anterior/Próximo" do fim da página antiga — setas usam `router.replace`
(decisão de não empilhar histórico por capítulo, ver PLANO-NAVEGACAO.md
item 1.4); tocar no nome do livro abre `/biblia/escolher?livro=slug`
como modal — a lista completa de livros, já com o livro atual expandido
na grade de capítulos (ver 2.1). Testado com dado real: navegar até
Gênesis 6 e reabrir a aba Bíblia depois confirma que volta direto pra
Gênesis 6.
**UX/UI:** barra sempre visível, sem precisar rolar até o fim pra
trocar de capítulo. **Limitação conhecida:** a apresentação modal do
seletor não cobre visualmente a barra de abas no web (cobre no
nativo/iOS/Android) — funcional nos dois casos, só o efeito visual não
é idêntico entre plataformas; registrado como ajuste fino pendente.

**Bug real, reportado várias vezes por usuário até ser corrigido
(2026-08-18):** tocar no nome do livro na barra `← Livro Capítulo →`
levava para `/biblia/escolher/[slug]` — rota que renderiza
`escolher/[livro]/index.tsx`, uma tela modal de um único livro que já
deveria ter sido removida numa correção anterior (só o link *de dentro*
dela — "← Trocar de livro" — tinha sido corrigido antes, não os dois
links que apontavam *para* ela a partir da tela de leitura). Corrigido:
os dois links (barra de navegação e tela de "capítulo não encontrado")
agora vão para `/biblia/escolher?livro=slug`, e `escolher/index.tsx`
passou a ler esse parâmetro pra decidir qual livro expandir (antes só
expandia o último lido, via `carregarUltimaLeitura()` — o que é
diferente do livro que o usuário está lendo no momento, se ele navegou
por capítulos antigos). A tela `escolher/[livro]/index.tsx` e seu
registro no `Stack` (`app/(tabs)/biblia/_layout.tsx`) foram removidos
por não ter mais nenhum link apontando pra ela. Testado ao vivo: em
Deuteronômio 3, tocar no nome do livro leva a
`/biblia/escolher?livro=05-deuteronomio`, mostrando a lista completa de
livros com Deuteronômio já expandido na grade 1-34.

### 9.4 Pesquisa: temas pré-definidos `✅`
**Funcionalidade:** barra de busca reaproveitando `buscarLivros` de
`core/content/busca.ts` (busca por conteúdo do resumo, mesma de
`/resumos`) + 8 cards coloridos por tema (Amor, Cura, Ansiedade, Raiva,
Alegria, Perdão, Esperança, Sabedoria — `core/biblia/temasBusca.ts`,
32 referências curadas, todas verificadas por chamada real à
bible-api.com). Tocar num tema busca e mostra o texto de verdade de
cada versículo (`components/CardVersiculoTema.tsx`), carregando cada
um independentemente.
**UX/UI:** cards com cor própria por tema (paleta reaproveitada de
`genero.ts`/`cor-grifo-*`, escolhida em JS via `useColorScheme` porque
vem de dado dinâmico, não dá pra usar `dark:` do NativeWind ali); texto
deixa claro que a busca hoje é só nos resumos, não no texto bíblico
inteiro (ver 9.5) — evita expectativa errada.

### 9.5 Pesquisa: busca por palavra na Bíblia inteira `✅`
**Funcionalidade:** resolvido junto com a migração pro SQLite (ver
2.6) — índice de texto completo virou uma tabela virtual FTS5 do
SQLite (`biblia_fts`), populada a partir de `assets/biblia.json` (todo
o texto da Almeida ACF embutido no app, sem depender de rate-limit de
API externa). `buscarGlobal(termo)` em `core/biblia/BibliaAPI.ts` varre
em milissegundos.
**UX/UI:** aba "Na Bíblia" na tela Descubra (`app/(tabs)/pesquisa.tsx`),
ao lado de "Nos Resumos"; resultado mostra o versículo de verdade, não
só a referência, igual ao padrão já usado no popover de referências
(1.9).

### 9.6 Você: perfil, Salvo e Atividade `✅`
**Funcionalidade:** cabeçalho de perfil (nome editável, foto editável
— ver 9.6c, tag de localização placeholder); card "Salvo" com prévia dos
grifos/notas recentes (`core/util/tempoRelativo.ts`) e menu de 3
pontinhos com Ler/Compartilhar/Resumo do livro/Copiar/Editar/Excluir,
funcionando também com botão direito no web; tela `/salvo` completa
com filtro Todos/Anotações/Grifados/Pesquisas favoritas
(`PesquisasFavoritasRepository`); dois botões de atalho "Salvos"/
"Notas" (redesenho de gamificação); "Perseverança"/streak num card
escuro com número grande; "Compartilhamentos" (contador,
`core/estatisticas/compartilhamentos.ts`, via a ação mínima de
copiar/compartilhar — não espera a funcionalidade completa da seção 5);
Medalhas num carrossel horizontal com barra de progresso por conquista
(redesenho de gamificação); "Atividade" com as 5 ações mais recentes +
"ver mais"; ícone de engrenagem no topo e card de Configurações no fim,
ambos levando pra `/configuracoes`.
**UX/UI:** cards de streak/medalhas antes usavam um fundo
escuro/metalizado fixo, sempre igual independente do tema (padrão
comum em dashboards de gamificação) — **corrigido em 2026-08-19** (ver
bug abaixo) pra seguir o tema claro/escuro do resto do app, a pedido
do usuário.

**Bug real, reportado pelo usuário (2026-08-19): "muitos elementos
estão disponíveis apenas no modo escuro e não mudam para o modo claro
junto com os outros".** Os cards "Salvos"/"Notas", "Sequência Diária" e
"Medalhas" (com o carrossel `MedalhaCarrossel`) usavam uma constante
`COR_GAMIFICACAO` com cores fixas em hex, aplicadas via `style={{
backgroundColor/color }}` — diferente do resto do app, que usa classes
`dark:` do Tailwind/NativeWind pra alternar de cor automaticamente. Ao
trocar de tema, esses cards simplesmente não reagiam, enquanto os
cards vizinhos (Compartilhamentos, Configurações) mudavam
normalmente — dando a impressão de estarem "presos" no modo escuro.
Corrigido: os fundos agora usam `bg-cor-fundo-elevado dark:bg-cor-
fundo-elevado-dark` (mesmo token dos outros cards da tela), e uma nova
tabela `CORES_TEMA` cobre os valores que ainda precisam ser hex de
verdade (cor do `MaterialIcons`, que não aceita `dark:`). O mesmo tipo
de cor fixa foi achado e corrigido também no card "Versículo do Dia"
(`CardVersiculoDia.tsx`, ver 3.2) e em vários ícones soltos pela
Início/Descubra/Planos que não seguiam o texto ao lado (que já
trocava de cor corretamente) — lista completa no CHANGELOG.
Testado ao vivo alternando o tema várias vezes, lendo
`backgroundColor`/`color` computados antes e depois de cada troca.

**Bug real, achado numa auditoria de navegação (2026-08-18):** os
botões "Salvos" e "Notas" levavam os dois pra `/salvo` sem nenhum
parâmetro — apesar de serem visualmente dois botões distintos
prometendo destinos diferentes, os dois abriam a mesma lista completa
sem filtro nenhum aplicado. Corrigido: `app/salvo.tsx` passou a ler um
parâmetro `?filtro=` (via `useLocalSearchParams`, com validação — um
valor desconhecido cai em "Todos"), e os dois botões agora passam o
filtro certo (`salvo`/`nota`). Testado ao vivo: "Notas" abre
`/salvo?filtro=nota` com o chip "Anotações" pré-selecionado.

### 9.6b Tela própria de Medalhas `✅`
**Funcionalidade:** pedido do usuário — "a função de marcar
[Medalhas], que não tem tela própria [...] o botão que era pra levar
pra tela própria [...] leva para a tela de perfil [Você]". Nova
`app/medalhas.tsx`: lista completa das 6 conquistas, uma por linha,
cada uma com ícone, título, **descrição completa sempre visível** (ao
contrário do card resumido do Início, que exige tocar "Saiba mais"
pra ver a descrição) e barra de progresso — pensada como a versão
"canônica" de referência, nem tão resumida quanto o card do Início nem
com a pele visual especial (fundo escuro/metalizado) exclusiva do
carrossel de Você, que continua existindo do jeito que está, por
pedido explícito do usuário ("tenha outro tipo de visualização mais
detalhada" — mantido de propósito).
Três pontos de entrada levam pra lá agora: "Ver Todos" no card do
Início, "Ver todas" dentro do modal de detalhe de uma medalha (também
no Início), e "Ver todas as medalhas →" abaixo do carrossel em Você —
além de cada medalha individual do carrossel de Você também ter virado
tocável, levando pra mesma tela.
**Testado ao vivo:** os três pontos de entrada + o toque numa medalha
individual do carrossel de Você levam corretamente pra
`/medalhas`, que lista as 6 conquistas com título, descrição e barra
de progresso.

### 9.6c Editar nome e foto do perfil (sem conta) `✅`
**Funcionalidade:** pedido do usuário, decidindo não implementar login
por enquanto (ver 6.1 em `TODO.md`) — "sem conta real ainda, vamos usar
algum tipo de localstorage ou sqlite por enquanto para poder trocar
nome e foto". Novo `PerfilRepository` (`obter`/`salvar`, um registro
por `ownerId`), com implementação local (AsyncStorage, web) e SQLite
(nova tabela `perfil`, nativo) — mesmo padrão dos outros repositórios
do app. Tocar no cabeçalho de perfil em `/voce` (nome ou foto) abre
`components/ModalPerfil.tsx`: campo de nome (até 40 caracteres) e
seletor de foto via `expo-image-picker` (novo — instalado com `npx
expo install` pra garantir versão compatível com o SDK do projeto),
recorte quadrado, comprimida (`quality: 0.5`) e guardada como *data
URI* base64 — simples de exibir em qualquer plataforma sem gerenciar
caminho de arquivo. Perfil incluído em "Exportar/apagar meus dados"
(ver 6.4): apagar tudo volta o perfil pro padrão ("Visitante", sem
foto).
**UX/UI:** nome e avatar têm um retorno visual claro de que são
tocáveis ("Editar perfil ✎" abaixo do nome); modal com o mesmo padrão
visual dos outros modais do app (`ModalNota`, confirmação de apagar
dados).
**Testado ao vivo:** tocar no cabeçalho abre o modal; trocar o nome
pra "Cauan" e salvar atualiza a tela na hora; reload da página mantém
"Cauan" (persistência confirmada, não só estado em memória).

### 9.7 Tela "Configurações" `✅`
**Funcionalidade:** tamanho de fonte, fonte serifada (lê/escreve
`core/leitura/preferenciaFonte.ts`, mesmo módulo das telas de leitura,
sem duplicar lógica) e tema, centralizados em `app/configuracoes.tsx`,
agrupados em 3 seções (Leitura, Aparência, Dados). Alcançada por um
ícone de engrenagem no topo e um card no fim da aba Você — não é aba
própria.
**UX/UI:** seção "Dados" tem placeholders "Em breve" pras preferências
futuras (cores de grifo, contraste).

### 9.8 Grifar em várias cores `✅`
**Funcionalidade:** `Grifo` (`core/types/leitura.ts`) ganhou um campo
`cor: string`; `GrifosRepository.alternar(ownerId, ref, cor)` recoloriza
sem duplicar registro quando o versículo já está grifado com outra cor.
Seletor de cor substitui o botão único "✎ Grifar" na barra de seleção
múltipla da leitura do capítulo (ver 2.3), com "cores recentes" +
paleta completa expansível — inspirado no app de Bíblia mais baixado da
Play Store (referência trazida pelo usuário, ver PLANO-NAVEGACAO.md
Fase 8).
**UX/UI:** cor do destaque do versículo lido dinamicamente do grifo
salvo, não mais uma cor Tailwind fixa.

### 9.9 Modo escuro mais contrastado `🔶`
**Funcionalidade:** auditoria de contraste feita (não implementação
nova): calculado manualmente o contraste WCAG entre
`cor-texto-suave-dark` (`#b3a894`) e os dois fundos escuros usados
atrás dele — 6.87:1 contra `cor-fundo-elevado-dark` e 7.59:1 contra
`cor-fundo-dark`. Ambos já passam WCAG AA (mínimo 4.5:1) com folga, e
quase alcançam AAA (7:1). **Nenhuma mudança de cor foi feita** — não há
falha objetiva de contraste nos tokens atuais pra corrigir. Se o pedido
for uma segunda variante de tema (preto mais puro, estilo AMOLED, por
preferência visual e não por falha de acessibilidade), isso ainda não
foi construído e precisa de direção de design mais específica antes.
**UX/UI:** sem mudança visual ainda — ver acima.

### 9.10 Notificação diária do versículo do dia `⬜`
**Funcionalidade:** backlog explícito, mencionado pelo usuário mas
deliberadamente adiado. Precisa de: Web Push + Service Worker (site) ou
`expo-notifications` (app), nos dois casos com um agendador do lado do
servidor — depende de conta de usuário + backend, ainda "em aberto" no
PLANO-PLATAFORMA.md.
**UX/UI:** botão "Envie-me diariamente" já aparece na Início (9.2) como
aviso de "em breve", pra comunicar que a intenção existe sem prometer o
que ainda não funciona.

---

## Como usar este documento

Ao começar qualquer item: mover de `⬜` para `🔶` (em andamento). Ao
terminar: `✅`, só depois de testado de ponta a ponta de verdade (não só
compilar) — funcionalidade primeiro, UX/UI depois, nessa ordem, mesmo
dentro de um único item.
