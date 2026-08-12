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
**Funcionalidade:** dois passos reais de seleção, hoje em
`app/(tabs)/biblia/escolher/index.tsx` → `escolher/[livro]/index.tsx`
(movidos da raiz da aba Bíblia na Fase 3 do plano de navegação — a aba
em si abre direto na última leitura, o seletor é alcançado tocando no
nome do livro durante a leitura, ver 9.3), com contagem de capítulos
correta por livro (tabela fixa). Não existe uma terceira tela de
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
cabeçalho fixo (sticky) com livro/capítulo sempre visível durante a
rolagem, barra fina de progresso de leitura no topo, e tipografia
revista (número de versículo pequeno/discreto, `lineHeight` maior) —
inspirado no padrão do YouVersion/Bible Gateway.

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
resumo). Progresso visível dentro da grade de capítulos daquele livro
("X de Y lidos" no topo de `app/(tabs)/biblia/escolher/[livro]/index.tsx`).
A lista de livros (`app/(tabs)/biblia/escolher/index.tsx`) **não** mostra
essa contagem hoje — só mostra o total de capítulos do livro, sem
quantos já foram lidos (ver 2.4b).
**UX/UI:** feedback imediato ao marcar (o botão já muda no mesmo toque,
sem esperar round-trip perceptível).

### 2.4b Progresso por livro na lista de leitura bíblica `✅`
**Funcionalidade:** cada card da lista de livros
(`app/(tabs)/biblia/escolher/index.tsx`) agora mostra "X de Y" capítulos
lidos, calculado com uma única chamada a `progressoRepository.listarTodos`
(agrupada por `livroSlug` em memória, sem N chamadas por livro).
**UX/UI:** contagem discreta ao lado do nome do livro, mesmo texto
suave usado em outros indicadores de progresso do app.

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
Só nativo (iOS/Android); no web `buscarGlobal` retorna vazio de
propósito (ver 7.3) pra evitar instabilidade do SQLite WASM.
**UX/UI:** aba "Na Bíblia" dentro da tela Descubra
(`app/(tabs)/pesquisa.tsx`), com debounce de 500ms; cada resultado
mostra a referência e o trecho, link direto pro versículo
(`?versiculo=`).

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
`BibliaAPI` (reaproveitando o cache já existente). Se a API estiver fora
do ar, o card simplesmente não aparece, sem quebrar a home. As 4 ações
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
nas cores de marca do app (`#332920 → #241d16 → #1b1712`, a mesma
paleta "metalizada" já usada nos cards de gamificação em `/voce`), sem
nenhuma chamada de rede pra imagem. Se no futuro quiser voltar a ter
uma imagem de fundo, precisa ser um conjunto pequeno e curado de
paisagens específicas (bundladas no app ou de uma fonte com controle
editorial de verdade), nunca uma API de foto aleatória.

### 3.3 Conquistas de progresso `✅`
**Funcionalidade:** 6 marcos ligados à estrutura do cânon
(`core/content/conquistas.ts`): primeiro livro, Pentateuco completo, os
4 Evangelhos, Antigo Testamento completo, Novo Testamento completo, os
66 livros — calculados em cima de `livrosLidosRepository`, sem tabela
própria de progresso. Testado marcando o Pentateuco como lido: os selos
"Primeiro livro" e "Pentateuco completo" acendem, os outros 4 continuam
apagados. No card resumido da Início (`CardConquistas.tsx`), "Saiba
mais" (por medalha) e "Ver Todos" eram `Pressable`s sem `onPress`
nenhum (achado na mesma auditoria de UI do item 3.2) — agora "Saiba
mais" abre um modal com a descrição real da conquista
(`conquista.descricao`, já existia no tipo, só não era mostrada em
lugar nenhum) e o progresso atual; "Ver Todos" leva pra `/voce`, que
já tem o carrossel completo das 6 medalhas com barra de progresso.
Testado ao vivo: modal mostra "Leia os 5 livros do Pentateuco... 0 de
5" corretamente; "Ver Todos" navega e mostra as 6 medalhas.
**UX/UI:** selos discretos (círculos pequenos, opacos quando bloqueados,
cheios quando conquistados) na home, sem número nem pontuação — só
reconhecimento silencioso.

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

### 5.2 Gerar imagem de versículo pra compartilhar `🔶`
**Funcionalidade:** `core/util/gerarImagemVersiculo.ts` — cartão
1080x1080 desenhado direto via Canvas API (sem dependência nova, sem
servidor), fundo em gradiente com as cores de marca do app (mesmos
tons de `cor-fundo-dark`/`cor-destaque-dark`), quebra de linha manual
(`measureText`) e tamanho de fonte que diminui automaticamente pra
versículos longos não estourarem o cartão. Só web por enquanto — no
nativo exigiria capturar uma View de verdade (`react-native-view-shot`)
e compartilhar o arquivo (`expo-sharing`), duas dependências novas que
não dava pra validar sem dispositivo/simulador nativo à mão; fica pro
próximo passo natural quando isso puder ser testado de verdade.
Testado ao vivo no navegador: canvas gerado 1080×1080 de verdade (não
em branco — confirmado decodificando os pixels), baixado como PNG via
link temporário. Botão só aparece com exatamente 1 versículo
selecionado (`versiculosSelecionados.size === 1`, testado com 1 e com
2 selecionados).
**UX/UI:** botão "Imagem" na barra de seleção da leitura (ao lado de
Compartilhar), abre um modal de preview com "Baixar"/"Fechar". Fonte
serifada (Georgia) e cores herdadas da identidade visual do app, não
uma captura de tela crua da interface.

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

### 6.4 Exportar/apagar meus dados `⬜`
**Funcionalidade:** exigência da LGPD assim que houver conta — exportar
(JSON) e apagar todos os dados associados ao `ownerId`/conta.
**UX/UI:** localizável nas configurações sem precisar procurar muito
(é um direito do usuário, não deveria estar escondido).

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

### 7.3 Leitura offline de verdade `🔶`
**Funcionalidade:** no app nativo instalado, o conteúdo dos resumos já
funciona offline (é dado embutido no app), e a Bíblia inteira também
(ver 2.6, `assets/biblia.json` + SQLite FTS5) — a leitura bíblica não
depende mais de rede em nenhuma plataforma desde a migração pro
SQLite. Na versão *web*, a app em si (bundle JS/CSS/HTML) agora tem
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
quanto do bundle é `assets/biblia.json` vs. código de verdade (ex.:
`source-map-explorer` ou `expo export` com `--dump-sourcemap`) antes de
decidir se otimizar (code splitting por rota, lazy load do índice
FTS5) vale o esforço — item de otimização em si continua não
iniciado, isto é só a medição pedida no funcionalidade original.
**UX/UI:** tela de carregamento/skeleton em vez de tela branca enquanto
o app inicializa, se o tempo de carga não puder cair o suficiente —
ainda não avaliado.

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

### 8.3 Página "Sobre o projeto" `⬜`
**Funcionalidade:** metodologia, fontes, escopo e limitações históricas
do conteúdo (o site antigo tinha isso planejado, nunca implementado).
**UX/UI:** tom transparente e honesto sobre debates acadêmicos — alinhado
com a diretriz de conteúdo do projeto (posição tradicional, citando
visões alternativas quando relevante).

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
item 1.4); tocar no nome do livro abre `/biblia/escolher/[livro]` como
modal. Testado com dado real: navegar até Gênesis 6 e reabrir a aba
Bíblia depois confirma que volta direto pra Gênesis 6.
**UX/UI:** barra sempre visível, sem precisar rolar até o fim pra
trocar de capítulo. **Limitação conhecida:** a apresentação modal do
seletor não cobre visualmente a barra de abas no web (cobre no
nativo/iOS/Android) — funcional nos dois casos, só o efeito visual não
é idêntico entre plataformas; registrado como ajuste fino pendente.

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
**Funcionalidade:** cabeçalho de perfil (nome, `@visitante`, tag de
localização placeholder, avatar); card "Salvo" com prévia dos
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
**UX/UI:** cards de streak/medalhas usam um fundo escuro/metalizado
fixo, deliberadamente fora do tema claro/escuro do resto do app (padrão
comum em dashboards de gamificação). **Gap conhecido:** o botão
"Salvos" leva pra `/salvo`, mas a tela ainda não lista versículos
salvos de verdade — ver 2.7.

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
