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
página.

### 1.2 Navegar entre livros `✅`
**Funcionalidade:** anterior/próximo a partir de qualquer resumo, sem
precisar voltar pra lista.
**UX/UI:** cartões de navegação com nome do livro, não só uma seta
genérica — a pessoa já vê pra onde vai antes de tocar.

### 1.3 Marcar livro como lido `✅`
**Funcionalidade:** alterna e persiste por dispositivo (`LivrosLidosRepository`), refletido na lista da home e na tela do livro.
**UX/UI:** selo verde visível no card da lista, sem precisar abrir o
livro pra saber se já foi lido.

### 1.4 Buscar livro por nome `✅`
**Funcionalidade:** filtro em tempo real na lista da home.
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

### 1.8 Modo foco `⬜`
**Funcionalidade:** esconder navegação/controles, deixando só o texto
visível durante a leitura.
**UX/UI:** saída óbvia e sempre acessível (botão flutuante ou gesto
claro) — nunca prender a pessoa numa tela sem rota de escape visível.

---

## 2. Leitura bíblica

### 2.1 Escolher livro → capítulo `✅`
**Funcionalidade:** dois passos reais de seleção (`app/biblia/index.tsx`
→ `app/biblia/[livro]/index.tsx`), com contagem de capítulos correta por
livro (tabela fixa). Não existe uma terceira tela de "escolher
versículo" — o foco num versículo específico só acontece via parâmetro
de URL (`?versiculo=N`) direto na tela de leitura (ver 2.2), nunca por
uma grade navegável de versículos.
**UX/UI:** grade de números clara, tocável com o polegar (alvo de toque
adequado), estado visual de "já lido" visível na grade de capítulos
antes de entrar num deles.

### 2.2 Ler o capítulo com foco no versículo escolhido `✅`
**Funcionalidade:** abre o capítulo inteiro, rola automaticamente até o
versículo pedido via `?versiculo=N` na URL.
**UX/UI:** borda lateral colorida no versículo em foco. Estudo de UX
([ESTUDO-UX-LEITURA.md](../ESTUDO-UX-LEITURA.md)) trouxe além disso:
cabeçalho fixo (sticky) com livro/capítulo sempre visível durante a
rolagem, barra fina de progresso de leitura no topo, e tipografia
revista (número de versículo pequeno/discreto, `lineHeight` maior) —
inspirado no padrão do YouVersion/Bible Gateway.

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
por exemplo), não uma extensão da tela de leitura.
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
("X de Y lidos" no topo de `app/biblia/[livro]/index.tsx`). A lista de
livros da leitura bíblica (`app/biblia/index.tsx`) **não** mostra essa
contagem hoje — só mostra o total de capítulos do livro, sem quantos já
foram lidos (ver 2.4b).
**UX/UI:** feedback imediato ao marcar (o botão já muda no mesmo toque,
sem esperar round-trip perceptível).

### 2.4b Progresso por livro na lista de leitura bíblica `⬜`
**Funcionalidade:** mostrar "X de Y capítulos lidos" em cada card da
lista de livros (`app/biblia/index.tsx`), do mesmo jeito que a lista de
resumos mostra o selo de "livro lido" — hoje essa lista só mostra o
total de capítulos, sem nenhum sinal de progresso.
**UX/UI:** mesmo padrão visual do selo de progresso já usado em outras
listas do app, pra manter consistência.

### 2.5 Navegar entre capítulos `✅`
**Funcionalidade:** anterior/próximo, cruzando de um livro pro outro nas
fronteiras (testado: Malaquias 4 → Mateus 1, Gênesis 1 sem anterior).
**UX/UI:** mesma qualidade visual dos cartões de navegação dos resumos
(1.2) — reaproveitar o componente, não recriar um diferente.

### 2.6 Buscar por palavra-chave no texto bíblico inteiro `⬜`
**Funcionalidade:** esta é a peça mais cara tecnicamente do sistema —
buscar a Bíblia inteira em tempo real pela API estouraria o rate limit em
segundos. Precisa de um índice de busca pré-gerado (todo o texto bíblico
buscado uma vez, em build ou num processo de servidor, não pelo
cliente a cada busca). Bloqueado até essa decisão de arquitetura ser
tomada (ver Decisão 4/11 do `PLANO-PLATAFORMA.md`).
**UX/UI:** resultado agrupado por livro, com o trecho em contexto, link
direto pro versículo (reaproveitando o `?versiculo=` já existente).

### 2.7 Favoritar/salvar versículo (distinto de grifar) `⬜`
**Funcionalidade:** grifar é uma marcação de leitura (qualquer versículo
lido pode ser grifado); favoritar é uma curadoria intencional ("quero
guardar este") — decidir se isso justifica ser uma funcionalidade
separada de grifar ou se é redundante. Se for separada: repositório
próprio, mesmo padrão dos outros (`ownerId` + referência de versículo).
**UX/UI:** ícone visualmente distinto do grifo (evitar confundir as duas
ações), tela "Meus favoritos" agrupada por livro.

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

### 2.10 Áudio da leitura `⬜`
**Funcionalidade:** via Web Speech API / síntese de voz nativa do
dispositivo (gratuito, sem servidor) — qualidade inferior a um áudio
gravado profissionalmente, mas viável sem custo de infraestrutura.
**UX/UI:** controles de reprodução padrão (play/pause), destaque visual
acompanhando o versículo sendo lido em voz alta.

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
do ar, o card simplesmente não aparece, sem quebrar a home.
**UX/UI:** card de destaque no topo da home, com botão de dado pra
sortear outro (nunca repete o mesmo que já estava na tela). Achado
durante o teste manual: o clique só falhou na primeira tentativa por
causa de coordenadas desatualizadas da própria ferramenta de teste, não
do app — confirmado clicando na posição visual real, funciona.

### 3.3 Conquistas de progresso `✅`
**Funcionalidade:** 6 marcos ligados à estrutura do cânon
(`core/content/conquistas.ts`): primeiro livro, Pentateuco completo, os
4 Evangelhos, Antigo Testamento completo, Novo Testamento completo, os
66 livros — calculados em cima de `livrosLidosRepository`, sem tabela
própria de progresso. Testado marcando o Pentateuco como lido: os selos
"Primeiro livro" e "Pentateuco completo" acendem, os outros 4 continuam
apagados.
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

### 4.1 Planos temáticos prontos `⬜`
**Funcionalidade:** conteúdo dos planos (ex.: "Bíblia em 90 dias",
"Novo Testamento em 30 dias") precisa ser definido e estruturado como
dado (lista de referências por dia) — decisão de conteúdo antes de
decisão técnica.
**UX/UI:** apresentação dos planos disponíveis, com descrição clara do
que cada um cobre e quanto tempo leva.

### 4.2 Progresso do plano `⬜`
**Funcionalidade:** separado do progresso geral de livros/capítulos —
"dia 12 de 90", marcando cada entrega do plano como concluída.
**UX/UI:** barra de progresso própria do plano, visível sem precisar
entrar em uma tela separada toda vez.

### 4.3 Lembrete de plano atrasado `⬜`
**Funcionalidade:** sem notificação push de verdade (exigiria conta +
backend), só um aviso visual na home quando a pessoa abrir o app.
**UX/UI:** tom de convite, não de cobrança — combina com o resto do tom
do projeto.

---

## 5. Compartilhamento

### 5.1 Compartilhar link de um livro/capítulo/versículo `⬜`
**Funcionalidade:** Web Share API nativa (já validada no site antigo)
com fallback pra copiar link.
**UX/UI:** mensagem de confirmação clara ("copiado!") quando cair no
fallback.

### 5.2 Gerar imagem de versículo pra compartilhar `⬜`
**Funcionalidade:** cartão de imagem gerado a partir do texto + referência
(via Canvas/renderização de imagem), sem depender de servidor.
**UX/UI:** o design do cartão precisa parecer feito de propósito pra
compartilhar (tipografia legível em miniatura de rede social), não só
uma captura de tela da interface.

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

### 7.2 Navegação só por teclado / leitor de tela `⬜`
**Funcionalidade:** testar de verdade com um leitor de tela (não só
assumir que os componentes nativos já resolvem isso), nomes acessíveis
em todos os botões de ícone (grifar, tema, marcar como lido).
**UX/UI:** foco visível consistente em qualquer elemento navegável via
teclado (o site antigo tinha isso resolvido — reaproveitar o padrão).

### 7.3 Leitura offline de verdade `🔶`
**Funcionalidade:** no app nativo instalado, o conteúdo dos resumos já
funciona offline (é dado embutido no app). A leitura bíblica depende da
API — precisa de estratégia de cache mais agressiva pra funcionar sem
rede (hoje só cacheia o que já foi visitado). Na versão *web*, ainda não
tem nenhuma estratégia de offline (o site antigo tinha um service worker
completo — perdido na migração, precisa ser refeito ou substituído por
divulgar a instalação do app).
**UX/UI:** aviso claro quando uma funcionalidade não está disponível
offline (ex.: "sem conexão — grifos serão sincronizados quando voltar",
não um erro genérico).

### 7.4 Auditoria de performance `⬜`
**Funcionalidade:** o bundle web já passou de 1MB no export atual — vale
medir antes de crescer mais (tempo de carregamento inicial é o que mais
afeta quem chega pela primeira vez via link/busca).
**UX/UI:** tela de carregamento/skeleton em vez de tela branca enquanto
o app inicializa, se o tempo de carga não puder cair o suficiente.

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

### 7.5 Atalhos de teclado (versão web) `⬜`
**Funcionalidade:** navegação entre capítulos/livros por seta, alternar
tema — já validado como boa ideia no site antigo.
**UX/UI:** dica discreita de que os atalhos existem, sem poluir a tela
principal.

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

### 9.1 Casca de navegação: 4 abas + passe visual Material `🔶`
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
varredura solta). **Falta:** adaptação de barra lateral no desktop
(adiada — precisa de layout de navegação customizado, não uma opção
pronta do Expo Router/React Navigation instalado neste projeto; ver
PLANO-NAVEGACAO.md item 1.9 pro raciocínio completo).

### 9.2 Início redesenhado `⬜`
**Funcionalidade:** card "Estude por resumos" (66 Livros bíblicos, leva
pra tela de resumos — a lista de livros sai da home e migra pra trás
desse card); card de sequência (streak) com SVG de fogo animado
(cinza/parado em 0, colorido/animado acima de 0, mensagem motivacional);
card de conquistas expansível, cada uma com nome, descrição e barra de
progresso (exige estender `Conquista` com `descricao`/`progressoAtual`/
`progressoTotal`, hoje só tem `conquistada` booleano).
**UX/UI:** botão "Envie-me diariamente" no card do versículo do dia
aparece como aviso "em breve" nesta fase — a ação real (notificação
diária) fica em backlog explícito, depende de conta + backend com
agendamento (ver seção de Notificações do plano).

### 9.3 Bíblia: última leitura + navegação fixa `⬜`
**Funcionalidade:** abre direto no último capítulo lido (dado novo,
`core/leitura/ultimaLeitura.ts`, não existe hoje); barra fixa no rodapé
`← Nome do Livro →` substitui os cards "Anterior/Próximo" do fim da
página atual — tocar no nome do livro abre o fluxo de
escolher-livro→capítulo→versículo por cima da leitura.
**UX/UI:** barra sempre visível, sem precisar rolar até o fim pra
trocar de capítulo.

### 9.4 Pesquisa: temas pré-definidos `⬜`
**Funcionalidade:** barra de busca em destaque + cards coloridos por
tema (Amor, Cura, Ansiedade, Raiva, Alegria...), cada um dispara uma
busca pré-definida (`core/biblia/temasBusca.ts`, novo — lista curada de
referências por tema, no espírito de `versiculoDoDia.ts`, combinada com
`core/content/busca.ts` já existente).
**UX/UI:** cards com cor própria por tema, resultado mostra sugestões
de versículos que citam o termo.

### 9.5 Pesquisa: busca por palavra na Bíblia inteira `⬜`
**Funcionalidade:** a peça mais pesada do plano — exige um índice de
texto completo gerado por script (buscar os 1.189 capítulos via
bible-api.com uma vez, montar índice invertido, versionar como JSON),
porque a API não oferece busca por palavra. Tratado como sub-entrega
própria com planejamento técnico dedicado quando for a vez — ver seção
3a do PLANO-NAVEGACAO.md pros detalhes de tamanho/rate-limit.
**UX/UI:** resultado mostra o versículo de verdade, não só a
referência, igual ao padrão já usado no popover de referências (1.9).

### 9.6 Você: perfil, Salvo e Atividade `⬜`
**Funcionalidade:** cabeçalho de perfil (estado "Visitante" até existir
login); card "Salvo" com prévia dos grifos/notas recentes (data
relativa curta — novo helper `core/util/tempoRelativo.ts` — e menu de
3 pontinhos com Ler/Compartilhar/Resumo do livro/Copiar/Editar/Excluir,
funcionando também com botão direito no web); tela "Salvo" completa com
filtro Anotações/Grifados/**Pesquisas favoritas** (repositório novo,
`PesquisasFavoritasRepository`); "Perseverança" (mesmo streak da
Início, layout compacto); "Compartilhamentos" (contador novo,
`core/estatisticas/compartilhamentos.ts`, nasce junto com a
funcionalidade de compartilhar de verdade — seção 5); conquistas
(mesmo dado de 9.2, layout diferente); "Atividade" com as 5 ações mais
recentes + botão "ver mais" pra tela de Salvo; card de Configurações no
fim.
**UX/UI:** menu de 3 pontinhos reaproveitado em Salvo e Atividade (uma
implementação só); estado vazio orienta o que fazer.

### 9.7 Tela "Configurações" `⬜`
**Funcionalidade:** tamanho de fonte, fonte serifada (já existem como
estado persistido em `core/leitura/preferenciaFonte.ts` — a tela lê/
escreve o mesmo módulo, não duplica lógica) e tema, centralizados numa
tela só, além dos controles rápidos que já existem inline nas telas de
leitura. Alcançada por um card no fim da aba Você, não é aba própria.
**UX/UI:** agrupado em seções com título (Leitura, Aparência, Dados),
não uma lista solta de toggles; espaço já previsto pras preferências
futuras abaixo.

### 9.8 Grifar em várias cores `⬜`
**Funcionalidade:** hoje `Grifo` é binário — vira um campo `cor` no
tipo (com default pra não quebrar grifos já salvos), paleta pequena e
fixa (4-6 cores com significado, não um color picker livre), seletor no
lugar do botão único "✎ Grifar" na barra de seleção do versículo (ver
2.3). Complementa 9.6 (filtro por cor em Salvo) e 9.7 (legenda da
paleta em Configurações).
**UX/UI:** cores com significado claro e documentado (ex. amarelo =
importante, verde = promessa, azul = estudo), não só decorativas.

### 9.9 Modo escuro mais contrastado `⬜`
**Funcionalidade:** segunda variante de tema escuro (preto mais puro,
texto com contraste mais alto que o `cor-fundo-dark` atual, pensado pra
baixa visão/uso em sol forte), selecionável em Configurações (9.7) —
não substitui o escuro atual, some como opção adicional.
**UX/UI:** troca de tema continua um toggle simples, só com uma terceira
opção em vez de duas.

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
