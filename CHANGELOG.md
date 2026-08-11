# Changelog

Todas as mudanças notáveis feitas no projeto serão documentadas neste arquivo.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

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
