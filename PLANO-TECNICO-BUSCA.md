# Plano técnico — busca bíblica e descoberta

**Revisado em:** 7 de outubro de 2026
**Status após execução:** implementação, typecheck, suíte integral e inspeção manual web dos fluxos principais concluídos. Nesta continuação, busca editorial AND, frase entre aspas e prevenção de correspondência curta parcial foram cobertas por testes automatizados, ainda sem conferência interativa no navegador. As etapas 1–5 seguem parciais apenas nas validações que pedem SQLite/dispositivo nativo, leitor de tela real, benchmark reproduzível por ambiente e julgamento editorial top 5. Unificação (etapa 6) e SEO/export (etapa 7) ficam fora desta rodada.

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

**Cobertura visual pendente desta continuação:** conferir interativamente, na aba “Nos Resumos”, uma frase entre aspas, uma consulta AND e o termo curto `fé`. A regra correspondente está coberta por testes unitários; a inspeção pode ser feita em conjunto com o próximo ciclo de feedback de UX.

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

**Estado atualizado:** a amostra exploratória dos dez termos `esperança`, `sabedoria`, `oração`, `justiça`, `libertação`, `ansiedade`, `perdão`, `amor`, `fé` e `medo` revelou a ausência de resultados editoriais para “perdão”; foi adicionada expansão controlada via “misericórdia” e “reconciliação”, com teste que exige trecho de evidência. A revisão encontrou ainda falsos positivos em termos curtos dentro de palavras maiores (`fé` em `feitas`) e a busca não honrava a dica de termos combinados/frases. Títulos e conteúdo agora respeitam limites de palavras (prefixo para termos longos, igualdade para tokens de até dois caracteres); termos múltiplos usam AND no mesmo campo de texto e frases entre aspas exigem sequência contígua. Consultas reconhecidas como referências bíblicas continuam destinadas à aba Bíblia. Títulos, tokens e offsets dos trechos são pré-indexados uma vez sob demanda, mantendo os trechos originais. Não alterei pesos: falta avaliação humana de relevância top 5 em 30 consultas para justificar novo ranking.

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

**Medições preliminares (não são benchmark de release):** no Codex In-app Browser em localhost, dez buscas aquecidas do campo até o anúncio levaram 734–904 ms (p50 815 ms; p95 904 ms), incluindo debounce de 500 ms, renderização e espera. Busca bíblica em processo Node v26.7.0, asset `assets/biblia.json` de 4.024.657 bytes: primeira chamada (importação, construção do índice e busca) 270,85 ms; dez consultas aquecidas (`amor`, `oração`, `esperança`, `João`, `sabedoria`, sem correspondência, `perdão`, `salvação`, `luz`, `fé`) 88,74–107,62 ms (p50 92,25 ms; p95 107,62 ms). Para a busca editorial com o novo índice, medição exploratória no mesmo runtime: primeira consulta, já com módulo importado, 40,62 ms para indexar e buscar; em oito consultas com 20 repetições cada, medianas de 0,27–1,47 ms e máximos entre 0,34–2,21 ms. Inclui busca, coleta e ordenação dos resultados, não é comparável diretamente à busca bíblica nem a UI. As medições Node não representam navegador/dispositivo e não criam orçamento. Falta protocolo reproduzível no browser e medir em dispositivo nativo.

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
- **Conjunto editorial:** 30 consultas avaliadas por posição e justificativa antes de alterar ranking.
- **Precisão@5:** proporção de resultados relevantes entre os cinco primeiros quando houver pelo menos cinco candidatos; classificar relevância com critérios definidos.
- **Latência:** p50/p95, distinguindo primeira carga do índice e buscas subsequentes.
- **Estabilidade:** mesma consulta/filtros devem produzir a mesma sequência.
- **Privacidade:** busca continua local; sem registrar ou transmitir termos pessoais.

Não transformar métricas experimentais em gates de CI até estabilizar conjuntos, rótulos e ambiente de execução.

## 6. Fechamento desta rodada e próximos passos

1. **Concluído no código:** paginação incremental, invalidação de respostas antigas, sinalização de mais resultados, referências sem acento, equivalência semântica do fallback FTS, expansão editorial para “perdão”, busca editorial AND/frase com correspondência por limites de palavra e índice lazy de títulos/trechos.
2. **Concluído nas verificações disponíveis:** testes focados e suíte integral; contratos estáticos de acessibilidade/UI/Maestro; revisão de diff.
3. **Concluído nesta rodada em web:** consulta por “perdão”, referência sem acento, filtros por testamento, carregamento além de 50 itens e anúncio da quantidade carregada; foco web básico e árvore de acessibilidade inspecionados.
4. **Validação dependente de ambiente externo:** exercitar SQLite/FTS e fallback em app nativo; testar com leitor de tela; medir carga fria e p50/p95 num browser reproduzível e em dispositivo físico; avaliar manualmente top 5 em 30 consultas editoriais antes de alterar pesos.
5. **Futuro condicional:** prototipar busca unificada apenas se a pesquisa com pessoas usuárias identificar uma necessidade; SEO/export somente se novas rotas ou páginas forem aprovadas.

## 7. Condições de encerramento

A implementação local desta rodada está concluída. A iniciativa de validação só pode ser considerada encerrada após os bloqueadores 3–4 serem resolvidos ou aceitos como pendências pelo responsável pelo produto. As etapas 6–7 não bloqueiam a busca existente e permanecem condicionais.
