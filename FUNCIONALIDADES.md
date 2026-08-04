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

### 1.5 Buscar por conteúdo do resumo (não só nome do livro) `⬜`
**Funcionalidade:** encontrar "cordeiro" e achar Êxodo/Apocalipse mesmo
sem a palavra estar no nome do livro (o site antigo tinha isso, via
índice de texto gerado em build — reaproveitar a mesma ideia aqui).
**UX/UI:** resultado indica *por que* apareceu (ex.: trecho onde o termo
foi encontrado), não só o nome do livro, senão a pessoa não entende a
relevância do resultado.

### 1.6 Tamanho de fonte ajustável na leitura `⬜`
**Funcionalidade:** aumentar/diminuir o tamanho do texto do resumo,
persistido por dispositivo.
**UX/UI:** controle discreto, não competindo visualmente com o conteúdo;
limite mínimo/máximo razoável (não deixar ilegível nem gigante demais).

### 1.7 Fonte serifada opcional `⬜`
**Funcionalidade:** alternar entre a fonte padrão e uma serifada para
leitura longa, persistido.
**UX/UI:** aplicado só ao texto corrido (não a títulos/botões), pra não
perder hierarquia visual.

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
**UX/UI:** o versículo em foco precisa se destacar visualmente (não só
estar na posição de rolagem) — hoje usa uma borda lateral colorida; vale
reavaliar se isso é notado rápido o suficiente num primeiro olhar.

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
**UX/UI:** cor de grifo com bom contraste nos dois temas; o botão de
grifar (ícone de lápis) é pequeno — validar se é fácil de acertar o toque
num celular de verdade, não só no simulador/navegador. A grade de
capítulos (2.1) não mostra hoje se um capítulo tem versículos grifados
dentro dele — só mostra "lido"/"não lido"; ver 2.2b para onde esse
indicador faria mais sentido.

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

### 2.8 Notas pessoais por versículo `⬜`
**Funcionalidade:** o repositório já existe (`NotasRepository`), falta
ligar a uma tela — campo de texto livre por versículo, editável,
removível.
**UX/UI:** indicador visual no versículo que já tem nota (diferente do
indicador de grifo); editor de texto que não atrapalha a leitura do
capítulo (modal ou painel deslizante, não um formulário que empurra o
texto bíblico pra fora da tela).

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

### 3.2 Versículo do dia `⬜`
**Funcionalidade:** lista curada de versículos conhecidos, escolha
determinística pelo dia do ano (mesmo versículo pra todo mundo no mesmo
dia, sem precisar de servidor) — já existia no site antigo, reaproveitar
a lista e a lógica.
**UX/UI:** card de destaque na home, com botão pra sortear outro (já
existia no site antigo).

### 3.3 Conquistas de progresso `⬜`
**Funcionalidade:** marcos ligados à estrutura do cânon (Pentateuco
completo, os 4 Evangelhos, Antigo/Novo Testamento completo, Bíblia
inteira) — o site antigo já validou essa abordagem em vez de metas de
contagem arbitrárias.
**UX/UI:** selos discretos, sem virar competição — reconhecimento
silencioso, não gamificação barulhenta.

### 3.4 Sequência de dias lendo ("streak") `⬜`
**Funcionalidade:** calculado a partir do histórico de capítulos/livros
marcados como lidos por data.
**UX/UI:** se implementado, cuidado explícito pra não criar ansiedade de
"quebrar a sequência" — está alinhado com o tom pastoral do projeto ou
não? Vale decidir antes de construir, não depois.

### 3.5 Estatísticas pessoais de leitura `⬜`
**Funcionalidade:** capítulos lidos, versículos grifados, tempo estimado
acumulado.
**UX/UI:** tela própria ("Minhas estatísticas"), não poluir a home com
números demais.

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

## Como usar este documento

Ao começar qualquer item: mover de `⬜` para `🔶` (em andamento). Ao
terminar: `✅`, só depois de testado de ponta a ponta de verdade (não só
compilar) — funcionalidade primeiro, UX/UI depois, nessa ordem, mesmo
dentro de um único item.
