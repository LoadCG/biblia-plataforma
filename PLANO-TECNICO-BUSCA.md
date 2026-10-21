# Plano técnico — busca bíblica e descoberta

**Revisado em:** 17 de outubro de 2026
**Status:** fluxo web e busca editorial implementados e cobertos pela suíte local; jornadas principais da busca bíblica também foram exercitadas manualmente no navegador. Nove resumos receberam ajustes editoriais apoiados em passagens; uma regressão recente garante que trechos de consultas AND com termos distantes continuem curtos e exibam ambas as evidências. O ranking ainda precisa de uma avaliação rotulada antes de qualquer mudança de pontuação. Permanecem validações de erro/retry por falha real, SQLite/dispositivo nativo, leitor de tela real e benchmark reproduzível por ambiente. Busca unificada e SEO/export seguem condicionais e fora do foco imediato.

**Continuação em 16 de outubro — precisão do destaque nos resultados:** revisão
estática encontrou que a UI usava substring para destacar termos, marcando falsos
positivos como “amor” dentro de “clamor”. O destaque agora reutiliza tokens e
limites de palavra da semântica bíblica; frases entre aspas destacam apenas a
sequência contígua exata. Intervalos preservam os offsets do texto com acentos.
Testes de regressão cobrem falso positivo lexical, frase, acentos e recorte do
texto original. Os cinco conjuntos direcionados da busca passaram (98 testes);
o `typecheck` global está bloqueado por incompatibilidade em arquivos alheios à
busca (`core/estatisticas/streak.ts`, `app/(tabs)/voce.tsx` e
`components/CardStreak.tsx`). Os contratos de acessibilidade (94), UI (34), copy
(119 fontes) e `git diff --check` passaram. Ranking e matching não foram
alterados.

**Continuação em 17 de outubro — ação de busca favorita:** a revisão da tela
identificou que acionamentos repetidos podiam executar toggles concorrentes e
que uma resposta atrasada podia atualizar o marcador de uma consulta diferente.
O controle agora mostra estado busy/disabled, tem alvo mínimo de 44 px e ignora
respostas de uma consulta já substituída. A checagem global de TypeScript passou
nesta rodada. Os seis conjuntos focados passaram (104 testes), assim como os
contratos de acessibilidade (98), UI (36), copy (120 fontes) e `git diff
--check`. A recuperação com erro real de armazenamento e o leitor de tela real
continuam pendentes.

**Estados da lista de favoritas — 17 de outubro:** ao abrir Descubra sem uma
consulta, favoritos agora distinguem carregamento, erro recuperável e lista
confirmada. Falha de leitura oferece retry junto às sugestões por tema; a
disponibilidade da busca não depende desse repositório. TypeScript, 104 testes
focados e os contratos estruturais passaram.

**Referências de UX consultadas — 17 de outubro:** o tutorial oficial do
[BibleGateway](https://www.biblegateway.com/help/tutorial/) descreve sugestões
de palavras/frases, busca por todos os termos, qualquer termo ou frase exata e
filtros por testamento/livro; a [ajuda do YouVersion para busca no Android](https://help.youversion.com/l/en/article/o1c2uvgi2n-bible-search-on-android)
documenta referências/temas, filtros por versão/testamento/livro e a exibição
apenas de filtros com correspondências; o [Blue Letter Bible](https://www.blueletter.bible/) separa seleção de intervalo/livros em opções
avançadas. Aplicação ao projeto: preservar o conjunto de filtros atuais (não há
facetas por livro disponíveis sem varrer todos os resultados paginados), não
adicionar modo “qualquer termo” antes de avaliação do matching, e priorizar
estados locais previsíveis e recuperação de favoritas. Próxima oportunidade a
avaliar é sugestão de referência/passagem durante a digitação, mantendo a busca
textual como fluxo principal.

Este plano trata as jornadas atualmente reunidas em `Descubra`, sem assumir que devam virar um único mecanismo de busca. Busca bíblica, busca editorial dos resumos e navegação por temas têm fontes, resultados e ações diferentes. A arquitetura deve continuar separada até que exista uma necessidade comprovada de busca unificada.

## 1. Escopo e decisões

### Incluído

- Busca textual de versículos, com filtros por testamento/livro, ordenação e paginação.
- Busca textual nos resumos bíblicos dos livros.
- Estados da tela, acessibilidade, navegação e consistência entre web e nativo.
- Testes e medições proporcionais às implementações locais existentes.

### Fora do escopo desta rodada

- Alterar configurações ou preferências da pessoa usuária.
- Unificar resultados de versículos, resumos, temas e planos.
- Criar indexação de conteúdo editorial, fuzzy matching, telemetria ou busca remota.
- Alterar conteúdo/curadoria dos temas ou dos planos.
- SEO e export estático, salvo se uma mudança de rota tornar isso necessário.

### Decisões técnicas

1. Manter dados e consultas locais; nenhuma consulta deve ser enviada a serviço remoto.
2. Preservar os fluxos separados de Bíblia, resumos e temas. A tela pode coordená-los visualmente sem compartilhar um contrato genérico prematuro.
3. Manter ordenação por relevância e desempate bíblico determinístico, salvo se pesquisa com pessoas usuárias justificar outra ordem.
4. Continuar usando SQLite FTS5 no nativo e busca em memória no web. Primeiro verificar equivalência; só substituir mecanismos mediante medição e caso de uso reproduzível.
5. Não alterar pontuação, sinônimos ou tolerância a erros antes de estabelecer consultas esperadas e comparar resultados.

## 2. Mapa confirmado

| Jornada | Tela | Serviço/dados | Repositório | Resultado/ação |
|---|---|---|---|---|
| Busca de versículos | `app/(tabs)/pesquisa.tsx`, aba “Na Bíblia” | `buscarGlobal` em `core/biblia/BibliaAPI.ts`; nativo: FTS5; web: `core/biblia/buscaGlobalWeb.ts` sobre `assets/biblia.json` via `bibliaLocalWeb.ts` | Não usa repositório para resultados; favoritos consultam `pesquisasFavoritasRepository` | Abre capítulo com versículo selecionado |
| Busca de resumos | Mesma tela, aba “Nos Resumos” | `buscarLivros` em `core/content/busca.ts`, catálogo de `core/content/livros.ts` | Nenhum para os resultados | Abre resumo do livro |
| Temas | Mesma tela, grade e detalhe | `TEMAS_BUSCA` em `core/biblia/temasBusca.ts`; passagens carregadas por `CardVersiculoTema` | Ações de salvar/anotar seguem componentes/repositórios de leitura | Abre detalhe do tema ou referência |
| Favoritas | Mesma tela e Biblioteca/Salvos | Estado consultado ao digitar/marcar | `pesquisasFavoritasRepository`, com implementação local web e SQLite nativa | Recupera uma consulta salva |

**Observação sobre a camada de persistência:** favoritas não são critério de busca nem preferência de interface. A implementação desta funcionalidade não deve alterar opções da pessoa usuária nem o contrato das configurações.

## 3. Diagnóstico por evidência

### Confirmado no código

- A busca bíblica tem filtros por testamento e livro e ordena por relevância, depois pela ordem canônica, capítulo e versículo.
- A implementação web pagina após montar e ordenar os resultados correspondentes em memória; a nativa filtra e ordena candidatos do FTS antes do `slice`.
- A tela debounceia a primeira página em 500 ms, mas “Carregar mais” não espera o debounce.
- Antes da correção local atual, o limite acumulado era enviado novamente com offset zero: o botão podia sugerir mais páginas apenas porque a lista alcançava o limite e a lista era substituída, não anexada.
- Antes da correção, novos termos/filtros podiam deixar resultados anteriores visíveis durante a espera.
- O parser de referências já existia para navegação, mas a busca global não o usava; consultas como `João 3:16` eram enviadas para matching de palavras.
- `buscarLivros` e `buscarGlobal` têm contratos e semânticas diferentes; não há fachada unificada.
- A busca editorial cobre nome, aliases, conteúdo e um conjunto pequeno de expansões temáticas. Os testes atuais cobrem muitas abreviações, mas poucos casos de qualidade de ranking/conteúdo.
- Já existem componentes para carregamento, vazio e erro, verificadores estruturais de acessibilidade/UI e cenário Maestro da busca.

### Implementado localmente nesta rodada, ainda sem commit

- Paginação por páginas de 50 com lookahead de 1 item para saber se existe próxima página.
- Resolução de referências completas (livro/capítulo/versículo/intervalo) pela busca global, usando o parser existente e respeitando os filtros e limites.
- Ciclos assíncronos separados para busca e favorita; resultados de busca não dependem mais da inicialização do identificador pessoal.
- Tokenização da consulta nativa antes de montar a expressão FTS, com retorno vazio para entradas sem tokens.
- Seleção do trecho editorial e do termo correspondente em uma única busca por candidato, preservando a ordem de expansão e o ranking existentes.
- Expansão temática controlada para “perdão”, usando evidências de misericórdia e reconciliação nos resumos; incluído teste da origem do trecho.
- Testes editoriais que conferem se o trecho de resultado sustenta o campo declarado como correspondente.
- Anexação das páginas seguintes e estado de carregamento/retry para falha ao buscar página adicional.
- Limpeza dos resultados/erro quando termo ou filtros mudam e mensagem de vazio mais orientadora.
- Normalização de offset/limite para inteiros não negativos nos serviços web e nativo.
- Testes unitários novos da busca web cobrindo offset, limite, filtros, consulta vazia e valores negativos.
- Invalidação síncrona de resultados assíncronos ao mudar termo/filtros, antes de iniciar a próxima consulta.
- Indicação `+` na contagem da aba bíblica quando há páginas adicionais, com anúncio acessível de itens carregados e disponibilidade de mais resultados.
- Canonicalização do nome da referência pelo catálogo antes da busca; variantes sem acento, como `Joao 3:16`, passam a usar a forma canônica em SQLite.
- Fallback nativo do FTS agora filtra o conjunto local pela regra compartilhada de busca, preservando acentos, prefixos, AND e frases contíguas.
- Regressões para aspas incompletas, consulta longa, fallback FTS e referência sem acento.

Verificações desta rodada: typecheck passou; suíte integral (24 suítes/170 testes) e testes focados (82) passaram; verificadores de acessibilidade (72 contratos), UI responsiva (12 superfícies), Maestro (4 contratos) e `git diff --check` passaram. Uma primeira sessão web usou bundle desatualizado e falhou em `BotaoTema`; a nova sessão em outra porta carregou os arquivos atuais e a busca foi validada sem crash. As alterações locais fora da busca foram preservadas.

### Hipóteses a validar, sem tratar como bugs confirmados

- Equivalência da semântica de múltiplos termos, frases entre aspas, acentos e pontuação entre FTS5 e busca web.
- Comportamento do filtro de livro ao alternar testamento e eventual descoberta do chip ativo em listas longas.
- Leitura correta dos estados e da contagem por tecnologias assistivas.
- Custo percebido da primeira consulta e de consultas com muitos resultados; ainda não existe medição comparável de p50/p95.
- Se “Mais relevantes” é a melhor ordenação padrão para quem procura passagens.

## 4. Plano de execução revisado

### Etapa 0 — preservar contexto e estabilizar a correção já feita

**Objetivo:** garantir que a paginação atual seja correta sem absorver alterações alheias.

**Ações**
- Manter o diff restrito aos arquivos de busca e ao novo teste.
- Revisar request obsoleto, troca rápida de filtros, retry da primeira página e retry de página adicional.
- Confirmar que resultado anterior nunca é apresentado como pertencente à consulta nova.
- Verificar `offset` e `limite` em ambas as implementações, incluindo zero, negativo, decimal e valores omitidos.

**Aceite**
- Páginas consecutivas não repetem nem pulam resultados na mesma consulta/filtro.
- Ao trocar termo/filtro, não há mistura de resultados nem retry da consulta anterior.
- Falha na primeira página mostra erro recuperável; falha em página posterior mantém a lista e oferece retry no mesmo offset.
- Testes de busca, typecheck e `git diff --check` passam.

**Estado atualizado:** concluída para web e código compartilhado. Busca e favorita têm ciclos assíncronos próprios; busca local não aguarda `ownerId`; termo/filtro invalida callbacks anteriores imediatamente e reinicia offset. Testes cobrem paginação, retry por contrato, referência direta, filtros e consulta sem tokens. Typecheck e inspeção web passaram; permanece a validação em app nativo/SQLite real.

### Etapa 1 — caracterizar contratos e paridade web/nativo

**Objetivo:** decidir comportamento por evidência antes de mudar matching ou ranking.

**Casos de avaliação**
- Acentos e caixa: `oração`, `ORACAO`.
- Uma palavra e prefixos: `esperanç`, `amor`.
- Duas palavras em ordens diferentes e termos em versículos distintos.
- Frase entre aspas, pontuação isolada e aspas incompletas.
- Referência: `Salmos 119:1-32`, `João 3:16`, abreviações aceitas.
- Consulta vazia, só espaços, consulta sem resultados e entrada longa.
- Filtros: todo o cânon, AT, NT, um livro com muitos resultados e combinação livro/testamento válida e sem resultados.
- Ordenação estável e fronteira entre páginas.

**Ações**
- Registrar, para cada caso, resultado esperado e diferença atual entre FTS5 e web.
- Decidir explicitamente a semântica desejada por busca bíblica; não forçar a busca editorial a adotar o mesmo contrato.
- Expandir testes de serviço web e nativo. Criar helper comum somente se a semântica puder realmente ser compartilhada sem degradar FTS.

**Diferenças atuais observadas**
- Web verifica explicitamente que todos os tokens tenham prefixo correspondente em alguma palavra do mesmo versículo; nativo expressa essa regra com tokens prefixados e `AND` no FTS5.
- Frases entre aspas são comparadas por sequência contígua nas rotas principais.
- Acentos e pontuação são normalizados para tokens no matching principal; o fallback nativo também reaplica o matching compartilhado, ao custo de ler a tabela bíblica inteira somente após erro do FTS.
- Referências reconhecidas pelo parser são resolvidas como passagem antes da busca textual nas duas plataformas; filtros de livro/testamento e paginação se aplicam à passagem.

**Aceite**
- Cada diferença entre web e nativo está coberta por teste e ou resolvida ou documentada como limitação deliberada.
- Referências, prefixos, AND entre termos, frases e consulta sem tokens têm comportamento definido e coberto.
- Filtros são aplicados antes de paginar em ambas as plataformas.

**Estado atualizado:** contratos cobertos por testes em ambas as implementações: prefixos/AND, frase, aspas incompletas, consulta longa, acentos, pontuação sem tokens, filtros, ordenação/página e referência direta com/sem acento. Fallback FTS coberto por mock. Falta validar equivalência e consultas inválidas contra SQLite real em app/dispositivo.

### Etapa 2 — validar fluxos de tela e estados de busca bíblica

**Objetivo:** cobrir o que a pessoa vê e consegue recuperar.

**Ações**
- Verificar digitação contínua, limpar consulta, favoritar/desfavoritar, alternar aba, trocar filtros e tocar rapidamente em “Carregar mais”.
- Conferir contagem anunciada, estados carregando/vazio/erro e acessibilidade do retry.
- Revisar em viewport estreita e larga: filtros ativos, chips roláveis, botão de próxima página e teclado.
- Atualizar teste Maestro existente apenas para contratos estáveis, evitando assertions frágeis de layout.

**Aceite**
- Não há resultados obsoletos nem tela vazia enganosa durante transições.
- A quantidade anunciada corresponde aos itens visíveis; carregamento adicional é comunicado.
- Fluxos principais podem ser concluídos por teclado e controles têm nomes/estados compreensíveis.
- Falhas simuláveis têm caminho de recuperação evidente.

**Limite de validação:** inspeção física/nativa requer ambiente/dispositivo disponível; se não houver, registrar claramente o que ficou sem validação manual.

**Progresso manual web:** em desktop e viewport 390×844 foram vistos referência direta, vazio, filtro, busca rápida e foco básico por teclado. Na sessão atual, “perdão” mostrou 6 resultados bíblicos e 10 resumos com trechos; `Joao 3:16` gerou uma referência direta; `Deus` mostrou `50+` e anúncio acessível de continuidade; Novo Testamento aplicou-se e carregar mais acumulou 100 resultados, sinalizando `100+`. Erro e retry foram cobertos por contrato/código, não por falha de rede simulada. Leitor de tela real e teste nativo continuam pendentes.

**Continuação manual em 2026-10-15:** no navegador local com perfil sem dados de teste, `Joao 3:16` abriu o resultado canônico João 3:16. A troca imediata de `De` para `Deus` terminou com resultados da consulta atual e sem resultados antigos visíveis. Novo Testamento limitou os resultados às referências desse testamento; “Carregar mais” acumulou 50 para 100, manteve o filtro e anunciou a quantidade. Selecionar João e então Antigo Testamento limpou o livro incompatível e exibiu somente resultados do AT. A busca temporária foi apagada ao final; nenhuma favorita ou dado pessoal foi gravado. A tela não foi induzida a erro de rede. O retry continua coberto por testes/contrato e inspeção de código, não por acionamento visual.

**Continuação — retorno do leitor à busca, 2026-10-15:** links de resultado
carregam origem, consulta e filtros de testamento/livro; o leitor retorna a
Descubra sem depender do histórico. A jornada no navegador confirmou que
`Joao 3:16` permanece no campo e o resultado João 3:16 reaparece ao voltar.
Durante essa inspeção, foi reproduzido um spinner infinito quando a URL restaurava
os filtros padrão (`testamento=todos`, livro vazio): o efeito limpava os
resultados mesmo sem mudança efetiva dos filtros e, por isso, não iniciava nova
busca. A sincronização agora compara os filtros já normalizados e só reinicia
quando há mudança. Um teste cobre o caso de filtros equivalentes; a jornada foi
repetida depois da correção e carregou o resultado esperado. Parâmetros recebidos
continuam validados antes de aplicar filtros.
`typecheck`, seis testes focados de navegação, `check:a11y` (87 contratos),
`check:ui` (28 superfícies/contratos), `check:copy-ui` (119 fontes) e
`git diff --check` passaram. Falha/retry induzidos, leitor de tela real e
SQLite/dispositivo nativo continuam pendentes.

**Feedback de nova tentativa — 2026-10-15:** ao selecionar “Tentar novamente”,
a tela agora limpa a mensagem de falha e apresenta imediatamente o carregamento,
sem aguardar o debounce de 500 ms. A suíte de 208 testes, TypeScript e os checks
estruturais de acessibilidade/UI/copy passaram; não foi induzida falha real de
armazenamento nesta rodada. A recuperação visual após falha real segue pendente.

**Cobertura visual concluída nesta continuação:** a aba “Nos Resumos” mostrou Gênesis com os dois termos em `criação descanso`, encontrou a frase exata `"criação e o descanso"` e exibiu trechos contendo `fé`, sem o falso positivo `feitas` em Gênesis. Após o novo desempate, `Jesus` mostrou Mateus, João, Marcos e Lucas nas quatro primeiras posições. A árvore de acessibilidade do navegador mostrou `1 resultado encontrado` para a consulta com um único resumo; falta conferir o anúncio com leitor de tela real.

**Fallback nativo FTS:** quando FTS falha, a consulta agora percorre a tabela bíblica local e reaplica a função de correspondência compartilhada com o web. Isso mantém normalização de acentos, AND por prefixo de palavra e frase citada contígua. O custo de ler a tabela inteira só ocorre após erro do FTS; testes de regressão cobrem acentos/prefixos e frases. Ainda falta validar essa situação em SQLite real no dispositivo, porque a suíte atual usa mock do banco.

### Etapa 3 — qualidade da busca editorial dos resumos

**Objetivo:** melhorar precisão sem degradar descobertas já úteis.

**Ações**
- Expandir o conjunto dourado: nomes/aliases, termo no conteúdo, expansões temáticas, termos ambíguos, acentos e consultas sem correspondência.
- Medir top 5 manualmente com justificativa editorial antes de alterar pesos.
- Refatorar seleção do trecho para retornar candidato e evidência numa única passagem, se perfil/testes confirmarem a redundância atual.
- Separar busca por título, alias, tema e conteúdo apenas se a interface conseguir comunicar a origem sem ruído.

**Aceite**
- Resultados dourados aparecem nos lugares esperados ou desvios têm justificativa registrada.
- Trecho corresponde ao motivo de inclusão do resultado.
- Empates continuam determinísticos e o custo não piora de forma mensurável.

**Estado atualizado:** a amostra exploratória dos dez termos `esperança`, `sabedoria`, `oração`, `justiça`, `libertação`, `ansiedade`, `perdão`, `amor`, `fé` e `medo` revelou a ausência de resultados editoriais para “perdão”; foi adicionada expansão controlada via “misericórdia” e “reconciliação”, com teste que exige trecho de evidência. A revisão encontrou ainda falsos positivos em termos curtos dentro de palavras maiores (`fé` em `feitas`) e a busca não honrava a dica de termos combinados/frases. Títulos e conteúdo agora respeitam limites de palavras (prefixo para termos longos, igualdade para tokens de até dois caracteres); termos múltiplos usam AND no mesmo campo de texto e frases entre aspas exigem sequência contígua. Consultas reconhecidas como referências bíblicas continuam destinadas à aba Bíblia. Títulos, tokens e offsets dos trechos são indexados uma vez sob demanda, mantendo os trechos originais. A [triagem de 30 consultas](docs/AVALIACAO-BUSCA-EDITORIAL.md) mostrou que o empate apenas por ordem canônica ocultava os evangelhos na busca por `Jesus`; uma quantidade limitada de evidências por resumo agora desempata resultados da mesma faixa de prioridade. Restam lacunas de vocabulário nos resumos e validação das intenções com leitores antes de introduzir pesos editoriais mais específicos.

**Continuação de 12 de outubro:** os resumos fonte de Atos, Provérbios, Marcos e Lucas foram revisados com referências textuais específicas; o catálogo JSON e o relatório de cobertura foram regenerados. A busca por `Espírito Santo` agora prioriza Atos, `dinheiro` inclui Provérbios e `reino de Deus` inclui os três evangelhos sinóticos entre os cinco primeiros. A cronologia das parábolas no resumo de Lucas também foi corrigida. `docs/AVALIACAO-BUSCA-EDITORIAL.md` registra os resultados e as lacunas que permanecem.

**Próxima etapa editorial — consultas amplas (`paz`, `ansiedade`, `pobreza`, `louvor`):**

1. Registrar, para cada termo, o resultado atual, o livro ausente e a passagem primária que justifica sua inclusão. Uma menção contextual ou apenas morfológica não basta; o resumo deve explicar a passagem e sua localização.
2. Atualizar somente os resumos em que a passagem desenvolve o assunto: paz em João 14:27; preocupação com necessidades diárias em Mateus 6:25–34; tratamento dado aos pobres em Tiago 2:1–6; louvor em Hebreus 13:15 e nas cenas do trono de Apocalipse 4:8–11. Evitar promessas de ausência de sofrimento ou uma leitura que culpe quem vive ansiedade ou pobreza.
3. Regenerar o catálogo derivado e o relatório de cobertura. Acrescentar testes de integração que exigem livro e trecho correspondente nos resultados; preservar a prioridade por evidência literal e a semântica das consultas com aspas.
4. Repetir a triagem dos quatro termos e registrar as posições reais, incluindo qualquer resultado ainda pouco pertinente. Rodar testes, typecheck e verificações editoriais; manter validação em dispositivo e com leitores como pendências distintas.

**Critério de conclusão:** os quatro termos encontram pelo menos um novo livro sustentado por texto-fonte, sem alterar pesos/sinônimos nem apresentar expansão sem evidência no trecho exibido.

**Execução concluída em 12 de outubro:** João, Mateus, Tiago, Hebreus e Apocalipse foram revisados; catálogo e relatório de cobertura regenerados. Os cinco pares consulta/livro têm regressão com trecho literal visível. A triagem atualizada está em `docs/AVALIACAO-BUSCA-EDITORIAL.md`. Testes, typecheck e verificação editorial passaram. A posição de Habacuque para `ansiedade` permanece como observação de qualidade, sem alteração prematura dos pesos.

**Revisão de qualidade do código:** consultas com termos distantes no mesmo parágrafo produziam trechos longos, cortados pelo cartão de duas linhas. O recorte agora reúne fragmentos curtos na ordem do texto e evita cortar palavras nas bordas; uma regressão cobre `amor oração` em 1 Timóteo. A ordenação e os critérios de correspondência não mudaram.

### Etapa 4 — acessibilidade e inspeção assistida

**Objetivo:** assegurar uso compreensível sem depender apenas de verificadores estáticos.

**Ações**
- Testar leitor de tela em resultados, tabs, filtros, estado vazio, erro, retry e paginação.
- Testar teclado/foco no web e escala de texto.
- Conferir contraste nos temas claro/escuro e feedback de seleção de filtros.

**Aceite**
- Título, escopo, filtros selecionados, contagem e estados têm anúncios compreensíveis.
- Foco visível e ordem de navegação previsível; nenhum controle essencial depende só da cor.
- Problemas fora da busca são anotados sem ampliar o escopo automaticamente.

**Estado atualizado:** parcial. Verificadores estruturais cobrem 72 contratos; inspeção de árvore web confirma rótulos, filtros, estado vazio, resultados, carregamento, contagem e botão de continuação. Foco básico por teclado foi inspecionado. Leitor de tela real, contraste detalhado, escala de texto e implementação nativa continuam sem validação.

### Etapa 5 — medir desempenho e decidir otimizações

**Objetivo:** estabelecer linha de base antes de adotar índice ou mudar debounce.

**Ações**
- Medir separadamente preparação/carga do índice web, matching, ordenação e resposta da UI.
- Executar casos curtos e frequentes e consultas amplas; registrar device/browser, versão e aquecimento.
- Medir p50/p95 em web e ao menos um dispositivo nativo.
- Definir orçamento de interação com base em medições, sem assumir 100 ms como requisito prévio.

**Aceite**
- Benchmark repetível e instruções para executar documentados.
- Decisão explícita: manter busca atual ou introduzir índice/otimização, com benefício e custo apresentados.
- Nenhuma otimização introduz complexidade sem melhoria observável.

**Medições preliminares (não são benchmark de release):** no Codex In-app Browser em localhost, dez buscas aquecidas do campo até o anúncio levaram 734–904 ms (p50 815 ms; p95 904 ms), incluindo debounce de 500 ms, renderização e espera. Busca bíblica em processo Node v26.7.0, asset `assets/biblia.json` de 4.024.657 bytes: primeira chamada (importação, construção do índice e busca) 270,85 ms; dez consultas aquecidas (`amor`, `oração`, `esperança`, `João`, `sabedoria`, sem correspondência, `perdão`, `salvação`, `luz`, `fé`) 88,74–107,62 ms (p50 92,25 ms; p95 107,62 ms). Para a busca editorial com índice, a medição anterior registrou primeira consulta de 40,62 ms e medianas de 0,27–1,47 ms em oito consultas aquecidas. Após o desempate por evidências, outra medição exploratória registrou primeira consulta `Jesus` de 32,41 ms e medianas de 0,37–0,76 ms em cinco consultas aquecidas, com 30 repetições cada. São amostras de processos Node diferentes; incluem busca e ordenação, mas não representam navegador/dispositivo nem justificam um orçamento de release. Falta protocolo reproduzível no browser e medir em dispositivo nativo.

### Etapa 6 — decisão de produto sobre unificação, temas e planos

**Objetivo:** só ampliar o escopo quando houver demanda e conteúdo elegível.

**Ações**
- Perguntar quais tarefas de descoberta não são resolvidas pelas três jornadas atuais.
- Avaliar protótipo de resultados mistos e filtros por tipo antes de mudar contratos.
- Inventariar status editorial e rotas válidas de planos/temas; bloquear rascunhos.
- Prevenir duplicação entre resultados bíblicos e editoriais e definir navegação específica por tipo.

**Aceite**
- Decisão de manter separado ou unificar registrada com evidência de UX.
- Se aprovada a unificação, contrato tipado, publicação filtrada, ordenação, estados, navegação e testes especificados antes da implementação.

**Dependência:** esta etapa não bloqueia correções e qualidade das buscas existentes.

**Decisão desta rodada:** manter as abas Bíblia e Resumos e a jornada de temas separadas, conforme o comportamento atual e o escopo aprovado. Não há evidência nem solicitação nesta iniciativa para substituir esses fluxos por uma lista mista. Nova decisão de unificação fica para uma etapa de produto, após ouvir tarefas não atendidas e validar protótipo.

### Etapa 7 — SEO/export e liberação, somente se aplicável

- Inspecionar canonical, sitemap, metadados e rotas públicas se novas páginas ou URLs forem criadas.
- Rodar export estático se a implementação alterar roteamento ou conteúdo pré-renderizado.
- Revisar regressões no conjunto dourado e nos contratos acessíveis antes de liberar.

**Aceite:** rotas públicas válidas, consultas arbitrárias não viram páginas indexáveis, export e verificações de release passam.

**Estado:** não aplicável nesta rodada; nenhuma rota ou conteúdo público novo foi criado.

## 5. Métricas e artefatos de qualidade

- **Conjunto de regressão da busca bíblica:** entradas, filtros, itens esperados e justificativa; começar com 20–30 consultas diversas.
- **Conjunto editorial:** triagem de 30 consultas e posições em `docs/AVALIACAO-BUSCA-EDITORIAL.md`; validar intenções e relevância com leitores antes de ajustar pesos específicos.
- **Precisão@5:** proporção de resultados relevantes entre os cinco primeiros quando houver pelo menos cinco candidatos; classificar relevância com critérios definidos.
- **Latência:** p50/p95, distinguindo primeira carga do índice e buscas subsequentes.
- **Estabilidade:** mesma consulta/filtros devem produzir a mesma sequência.
- **Privacidade:** busca continua local; sem registrar ou transmitir termos pessoais.

Não transformar métricas experimentais em gates de CI até estabilizar conjuntos, rótulos e ambiente de execução.

## 6. Próximas etapas priorizadas — revisão de 13 de outubro

### Etapa A — transformar a triagem editorial em avaliação reproduzível

**Objetivo:** separar correspondências literais frequentes de resultados realmente úteis para a intenção de busca, sem presumir que frequência equivale a relevância.

**Ações**
1. Fixar um conjunto dourado versionado com as 30 consultas da triagem; incluir consulta, intenção provável, resultados relevantes esperados e justificativa editorial. Marcar explicitamente consultas ambíguas em vez de inventar uma intenção única.
2. Julgar até os cinco primeiros resultados por consulta em quatro classes: central, relevante, apenas contextual e irrelevante. Distinguir resultados com nome exato do livro dos encontrados no conteúdo.
3. Registrar precisão@5, cobertura dos livros centrais esperados e casos de falso positivo, junto com os resultados atuais. Não usar métricas como gate de CI enquanto os rótulos não tiverem revisão independente.
4. Examinar primeiro `ansiedade` (Habacuque antes de Mateus e Filipenses), `paz`, `graça`, `salvação` e `medo`; não editar conteúdo correto só para alterar posições.

**Aceite:** consultas e rótulos têm justificativa verificável; resultados atuais são reproduzíveis; desacordos e ambiguidades ficam registrados; nenhuma mudança de ranking ocorre nesta etapa.

### Etapa B — decidir se o ranking precisa de ajuste

**Dependência:** Etapa A concluída.

**Ações**
1. Comparar o ranking atual com uma alternativa simples que não use contagem de evidências, além de no máximo uma alternativa explicitamente motivada pelos erros rotulados.
2. Verificar separadamente títulos exatos, conteúdo literal e expansões temáticas; nenhum resultado temático pode parecer evidência literal.
3. Conferir que um ajuste não prejudique termos curtos, AND, frases citadas, sinônimos, empates canônicos ou snippets que provam a correspondência.
4. Só implementar a alternativa se melhorar os erros-alvo sem reduzir a qualidade agregada nem introduzir pesos difíceis de explicar. Caso contrário, manter a regra atual e registrar a decisão.

**Aceite:** decisão baseada no conjunto dourado, regressões dos comportamentos existentes, ordenação determinística e comparação documentada antes/depois.

### Etapa C — estabelecer benchmark repetível antes de otimizar

**Dependência:** conjunto de consultas da Etapa A estabilizado. Pode ocorrer em paralelo com a Etapa B, sem alterar matching.

**Ações**
1. Documentar comando, versão do runtime, dispositivo/browser, estado frio/aquecido e consultas utilizadas.
2. Medir construção do índice, matching, ordenação e tempo percebido da UI separadamente; reportar p50/p95 e tamanho dos dados.
3. Repetir em web e SQLite nativo real quando um dispositivo/emulador estiver disponível; não usar mocks como evidência de desempenho do banco.
4. Manter a implementação atual se não houver gargalo reproduzível; só então avaliar reduzir alocações por token ou adicionar índice.

**Aceite:** qualquer pessoa da equipe consegue repetir o procedimento; resultados frios e aquecidos não são misturados; otimização só avança quando há gargalo observável.

### Etapa D — fechar a validação de acessibilidade e plataforma

**Dependência:** acesso a leitor de tela e app/dispositivo nativo. Não bloqueia a avaliação editorial web.

**Ações**
1. No web, verificar leitor de tela, foco, zoom/escala e contraste para abas, filtros, resultados, vazio, erro, retry e paginação.
2. No nativo, exercitar FTS5 e fallback real, referências, filtros e paginação; comparar os casos dourados com o web.
3. Registrar dispositivo, sistema, tecnologia assistiva, resultado e limitações. Se o ambiente não estiver disponível, deixar a validação manual pendente sem simular aprovação.

**Aceite:** nenhum caminho principal depende apenas de cor ou toque visual; busca nativa e web têm comportamento equivalente ou diferença documentada; erros recuperáveis têm saída anunciada.

### Etapa E — consolidar e decidir encerramento

**Dependência:** A–D concluídas ou cada limitação explicitamente aceita pelo responsável do produto.

**Ações**
1. Atualizar este plano, a triagem editorial e o README/documentação da busca sem duplicar listas de tarefas antigas.
2. Reexecutar verificações relevantes e rever o diff completo, preservando alterações locais que não pertençam à busca.
3. Manter etapas de unificação e SEO/export fora da sequência até haver necessidade de produto ou mudança de rota.

**Aceite:** evidências, riscos residuais, testes e pendências de ambiente ficam explícitos; nenhuma etapa aparece como concluída sem validação observável.

**Progresso em 13 de outubro:** a primeira execução local das Etapas A–E foi concluída até os limites deste ambiente. A avaliação e o benchmark agora são repetíveis por comandos do projeto; a revisão humana independente, leitores de tela e dispositivo SQLite real continuam pendentes e estão documentados em `docs/AVALIACAO-BUSCA-EDITORIAL.md`.

- **A — executada como primeira leitura:** conjunto v1 estruturado com 30 intenções prováveis e rótulos centrais/relevantes/contextuais. Todos os top 5 atuais foram comparados com esses rótulos. Revisão humana independente ainda não foi feita; portanto, os números são exploratórios.
- **B — decisão provisória:** a regra atual recupera 81/84 centrais e 39/40 relevantes no top 5, contra 54/84 e 32/40 na referência sem contagem de evidências. Manter o ranking atual até a revisão independente; não ajustar pesos nesta execução.
- **C — executada para busca editorial em Node:** adicionado `npm run medir:busca-editorial`; em duas execuções no host atual, primeira busca ficou em 43,281–45,989 ms e buscas aquecidas em p50 0,828–0,904 ms/p95 1,804–1,958 ms. Não representa browser ou SQLite nativo.
- **D — parcial:** `npm run validate` passou e verificou os contratos automatizados; leitor de tela real e validação no dispositivo não estavam disponíveis nesta execução.
- **E — executada para a documentação existente:** README, plano técnico e triagem receberam comandos, critérios, comparação, benchmark e pendências. A revisão de release e aceitação das limitações continuam aguardando a validação externa.

**Próxima ação dependente de terceiros/ambiente:** obter segunda leitura dos rótulos e intenções do conjunto v1; em paralelo, repetir testes de acessibilidade com leitor de tela e executar os casos dourados em um dispositivo/emulador que inicialize SQLite FTS5.

### Próxima rodada — atalho para referências digitadas

**Objetivo:** reduzir etapas quando a pessoa já sabe a referência que deseja ler, sem transformar uma referência inválida ou escondida por filtros em um caminho aparentemente válido.

**Concluído nesta rodada:**

1. Adicionado um atalho para abrir diretamente no leitor a primeira passagem de uma referência explícita, como `João 3:16` ou `Provérbios 3:5-6`.
2. O atalho só aparece depois da busca atual terminar e confirmar o primeiro versículo nos resultados visíveis; respeita filtros de livro e testamento sem consulta paralela.
3. O destino reaproveita a navegação já existente, preservando consulta, origem e filtros para retornar à busca.
4. A ação tem nome e instrução acessíveis, e aparece como opção compacta antes dos resultados. Busca por palavra, referência de capítulo sem versículo e busca na aba de resumos mantêm o fluxo atual.
5. Cobertos por testes unitários: referência válida, referência sem acento, intervalo, versículo ausente dos resultados filtrados, capítulo sem versículo e consulta textual.
6. A inspeção no navegador detectou que `João 3:99` acabava em falha de busca e chamava o fallback remoto. A busca agora trata referências reconhecidas porém inexistentes como zero resultados; a leitura local não aciona fallback externo para erro classificado como referência inválida. As suítes web e nativa cobrem esse contrato.

**Próximas etapas em ordem estratégica:**

1. Concluídos nesta rodada: testes direcionados, TypeScript, contratos de acessibilidade/UI/copy e revisão de whitespace/diff; a inspeção web mostrou a ação e o leitor de tela exibe um link com nome e dica explícitos.
2. Fazer inspeção visual do atalho em tema escuro e testar foco por teclado/leitor de tela real; o estado inspecionado foi o navegador web em tema claro.
3. Validar intervalo longo e filtros que excluem a referência em web e em SQLite nativo real. A invalidez explícita foi exercitada no navegador; SQLite real continua condicionado a dispositivo/emulador disponível.
4. Como próxima melhoria de produto, avaliar sugestões durante a digitação para nomes de livros e referências incompletas. Só avançar depois de definir critérios de correspondência e teclado/seleção; manter a ação direta atual como melhoria independente.
5. Continuar o encerramento de qualidade já aberto: segunda revisão humana do benchmark editorial, leitor de tela real e medição de busca em browser e dispositivo nativo.

**Verificações desta rodada:** 5 suítes direcionadas passaram (36 testes), `typecheck`, `check:a11y` (100 contratos), `check:ui` (38 superfícies/contratos), `check:copy-ui` (120 fontes) e `git diff --check`. A inspeção web em temas claro e escuro confirmou o atalho de João 3:16 e o destino; “João 3:99” não ofereceu o atalho e ficou sem resultados depois da correção. SQLite nativo real e leitor de tela real permanecem pendentes.

## 7. Fechamento desta rodada e histórico

1. **Concluído no código:** paginação incremental, invalidação de respostas antigas, sinalização de mais resultados, referências sem acento, equivalência semântica do fallback FTS, expansão editorial para “perdão”, busca editorial AND/frase com correspondência por limites de palavra, índice lazy de títulos/trechos, desempate por evidências e anúncio singular de um resultado.
2. **Concluído nas verificações disponíveis:** testes focados e suíte integral; contratos estáticos de acessibilidade/UI/Maestro; revisão de diff.
3. **Concluído nesta rodada em web:** consulta por “perdão”, referência sem acento, filtros por testamento, carregamento além de 50 itens e anúncio da quantidade carregada; foco web básico e árvore de acessibilidade inspecionados.
4. **Validação dependente de ambiente externo ou curadoria:** exercitar SQLite/FTS e fallback em app nativo; testar com leitor de tela; medir carga fria e p50/p95 num browser reproduzível e em dispositivo físico; revisar o vocabulário ausente e confirmar a intenção das 30 consultas editoriais com leitores antes de novos pesos.
5. **Futuro condicional:** prototipar busca unificada apenas se a pesquisa com pessoas usuárias identificar uma necessidade; SEO/export somente se novas rotas ou páginas forem aprovadas.

6. **Executado em 13 de outubro:** criado o conjunto exploratório [`docs/avaliacao-busca-editorial-v1.json`](docs/avaliacao-busca-editorial-v1.json) e o comparador `npm run avaliar:busca-editorial`. Rótulos atuais: 81/84 livros centrais e 39/40 relevantes recuperados no top 5; referência sem contagem de evidências: 54/84 e 32/40. Criado `npm run medir:busca-editorial`: duas execuções no Node v26.7.0/Windows x64, catálogo 287 KiB, 900 buscas aquecidas por execução, p50 0,828–0,904 ms/p95 1,804–1,958 ms; primeiras chamadas 43,281–45,989 ms. O comparador e as medições são exploratórios, não gates de CI.
7. **Validação desta execução:** `npm run validate` passou (typecheck, 181 testes, acessibilidade, Maestro, UI responsiva, cobertura/revisão editorial, planos, temas e Expo Doctor: 21/21). `npm run check:content` compara o JSON gerado ao `HEAD` e, por isso, detecta as alterações editoriais locais ainda não commitadas; a determinância do gerador será conferida separadamente sem descartar a diferença legítima.

## 8. Condições de encerramento

A implementação local desta rodada está concluída. A iniciativa de validação só pode ser considerada encerrada após revisão humana dos rótulos e bloqueadores de dispositivo/tecnologia assistiva serem resolvidos ou aceitos explicitamente como pendências pelo responsável do produto. O ranking permanece sem alteração nesta avaliação. As etapas 6–7 não bloqueiam a busca existente e permanecem condicionais.
