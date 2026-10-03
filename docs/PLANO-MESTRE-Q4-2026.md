# Plano mestre de evolução — outubro a dezembro de 2026

Atualizado em 2026-10-02. Este documento define a ordem das próximas entregas
e aponta para a decomposição técnica/editorial existente. O estado real deve ser
comprovado por diff, verificações e evidências; itens instalados não equivalem a
aceite visual, assistivo, nativo ou de publicação.

## Direção do ciclo

- Aproximar a experiência web desktop da referência aprovada, preservando a
  responsividade nos breakpoints tocados.
- Manter a versão mobile dedicada e a distribuição nativa deferidas até nova
  decisão; não inferir que isso elimina regressões responsivas web.
- Não exibir anotações internas, instruções de produção ou raciocínio de sistema
  como copy do produto. Conteúdo editorial segue revisão humana independente.
- Não adicionar dependências, serviços, telemetry, traduções ou conteúdo sem
  necessidade validada e decisão de produto.

## Foco atual de interface

O próximo incremento de UI é planejar e implementar microinterações hover sutis
em todas as rotas, conforme [`PLANO-HOVER-INTERACOES.md`](./PLANO-HOVER-INTERACOES.md).
Esse foco não substitui nem fecha os ciclos abaixo; é a prioridade de execução
imediata, com cobertura rastreável de cada tela e componente compartilhado.

## Estado comprovado na revisão

**Incidente de rota direta (2026-10-02):** a URL pública de 1 Coríntios 13
retornou `404 NOT_FOUND` ao atualizar. O export Expo não materializava os
segmentos `[livro]/[capitulo]`, enquanto `vercel.json` reescrevia genericamente
`/biblia/*` para `/index.html`. A correção remove a reescrita e cria páginas
estáticas de shell para os 1.189 capítulos a partir do HTML exportado; o
servidor local retornou 200 para capítulos válidos e 404 para capítulo
inexistente. A validação da URL pública fica pendente até o deploy do commit.

| Frente | Estado | Evidência / lacuna |
|---|---|---|
| Home desktop | Parcialmente refinada | Jornada reorganizada; paisagem horária e ilustração da jornada implementadas. Nova inspeção no viewport desktop disponível, claro/escuro e perfil local sem histórico; composição e lateral legíveis. A captura em 1280×900 e 1440×900 continua pendente: a API do navegador não expõe dimensão CSS nem permite fixar o viewport nesta sessão. |
| Descubra | Parcialmente implementada | No viewport desktop disponível, grade de oito temas, detalhe “Esperança”, links, entrada direta, recarga e busca (50 resultados/estado vazio) foram conferidos. Retorno que selecionava Início foi corrigido; tema inválido agora normaliza para `/pesquisa`. Ordem inicial de foco, indicador visível e abrir/voltar tema com Enter foram verificados; auditoria completa e viewports planejados seguem pendentes. |
| Planos | Implementado com QA parcial | Lista e detalhe em claro/escuro; estado 0/7, sete sessões e ações acessíveis conferidos sem alterar progresso. Erro, conclusão, sessão retomada e viewports planejados permanecem incompletos. |
| Sistema de estados | Migração principal feita | Inventário/API/migrações existem. Varredura AST encontrou 73 chamadas a `mostrarToast`, todas classificadas; o contrato TypeScript agora exige severidade. Inspeção visual/assistiva dos consumidores continua pendente. |
| Copy da interface | Gate estático passou | 114 fontes de app/componentes/conteúdo verificadas localmente e no CI, sem padrões sinalizados; a heurística não substitui revisão semântica. |
| CI remoto | Primeiro run passou | `37033595191` para o commit `7716388`; gates de conteúdo, copy, validação, export e metadados passaram. Revisar avisos de runtime do Actions/runner; preview não foi comprovado. |
| Conteúdo editorial | Catálogo funcional; expansão não aprovada | Há 66 resumos e 2 planos. Schema editorial completo, segunda revisão humana e publicação dos novos rascunhos são gates separados. |
| Mobile/nativo | Deferido | Não fazer redesenho nem declarar aceite sem retomada explícita; validar regressões responsivas web em componentes compartilhados. |

## Ordem de execução

### Ciclo 0 — documentação, governança e gate de copy (concluído em 2026-10-02)

1. Definir este arquivo como plano unificado do trimestre e `ESTADO-DO-PROJETO.md`
   como relato curto de situação e prioridade.
2. Atualizar o índice documental e rotular planos substituídos como históricos,
   preservando conteúdo e links existentes.
3. Revisar README, stack, passos locais, branch operacional e gatilhos de CI.
4. Adicionar `npm run check:copy-ui` para procurar padrões explícitos de
   raciocínio interno nos fontes executáveis e conteúdo integrado.
5. Rodar verificações diretamente relevantes, rever o diff e registrar gates
   externos como pendentes quando não houver evidência.

**Aceite:** links internos válidos; apenas um índice para encontrar planos
ativos; o check de copy passa e é executado no CI; pipeline inclui `master`;
nenhum aceite humano/nativo/de preview é inferido.

### Ciclo 1 — concluir a composição da Home desktop (P0)

1. Capturar Home com janela integral em 1440×900 e 1280×900, claro/escuro;
   documentar largura do documento, scroll, foco e estado de progresso utilizado.
2. Avaliar proporção entre coluna de leitura e coluna de apoio, alinhamento do
   card de progresso, ritmo vertical de sequência/medalhas e hierarquia visual.
3. Comparar cenas e superfícies com a referência; alterar somente diferenças
   reproduzíveis e preservar dados/ações existentes.
4. Inspecionar Home sem histórico, com histórico, com lembrete de plano e com
   dados vazios/carregando/erro quando disponíveis sem adulterar perfil real.
5. Repetir claro/escuro e checagens responsivas dirigidas nos breakpoints
   afetados; auditoria mobile dedicada permanece adiada.

**Aceite:** captura integral sem recorte/clipping; ordem de leitura clara;
contraste e foco visíveis; largura sem overflow; evidências e limites anotados.

### Ciclo 2 — comparação desktop de Descubra e Planos (P1)

O detalhe temático será expandido conforme [`PLANO-TEMAS-DESCOBERTA.md`](../PLANO-TEMAS-DESCOBERTA.md): conteúdo adicional permanece em revisão editorial e só aparece após publicação aprovada.

1. Descubra: revisar cabeçalho, busca, categoria, cenas, temas e lista de
   resultados em viewport amplo e intermediário.
2. Confirmar URL/histórico ao abrir tema, voltar à grade, recarregar e abrir link
   direto; confirmar origem da navegação e posição/filtro quando aplicável.
3. Inspecionar busca vazia, resultado, sem resultados, erro/retry e tema inválido;
   verificar nomes acessíveis e foco por teclado.
4. Planos: comparar listagem e detalhe com a linguagem da referência; conferir
   progresso zero/intermediário/concluído, sessão pausada/retomada e feedback de
   falha sem alterar dados pessoais.
5. Corrigir achados P0/P1, conferir claro/escuro e breakpoints compartilhados,
   atualizar a matriz e registrar o que não foi exercitado.

**Aceite:** journeys desktop reproduzíveis, contexto e ações compreensíveis,
sem clipping/overflow; erros recuperáveis oferecem saída; estados não dependem
exclusivamente de cor.

**Progresso parcial em 2026-10-02:** no viewport desktop disponível, a seleção de
“Esperança” preservou a aba Descubra e carregou quatro referências acessíveis.
“Voltar aos temas” retorna à grade; entrada direta e recarga preservam o detalhe;
busca com 50 resultados, estado sem resultados e normalização de tema inválido
foram conferidos. O estado sem resultados oferece nova consulta e limpeza. O
foco percorre a navegação e controles iniciais, fica visível e abre/retorna de
um tema por Enter; os demais caminhos de teclado e estados de erro seguem sem
revisão. Busca com resultados resumidos e inspeção em 1280×900/1440×900 ainda
não foram cobertos. Em Planos, a lista e o detalhe em 0/7 foram vistos nos dois
temas, sem alterar progresso pessoal. Os estados intermediário, concluído e erro
seguem pendentes. A API do navegador não expõe dimensão CSS nem oferece override.

### Ciclo 3 — fechar sistema de estados web (P1)

1. Comparar cada consumidor de `EstadoCarregando`, `EstadoErro`, `EstadoVazio` e
   Toast com `docs/inventario-estados-ui.md`.
2. Rastrear chamadas Toast neutras restantes; classificar apenas quando o
   resultado tiver semântica clara e eliminar duplicações comprovadas.
3. Rever confirmação e feedback de ações destrutivas, retry, respostas tardias,
   loading e estados vazios por superfície.
4. Validar nomes, papéis, estado, foco, contraste e movimento reduzido nas
   superfícies afetadas; adaptar contratos existentes se a UI mudar.
5. Executar contratos estruturais e checagem de copy; não declarar acessibilidade
   de leitor de tela real sem executar tecnologia assistiva disponível.

**Aceite:** inventário reflete o código; cada falha recuperável tem retry ou
orientação; ações destrutivas têm confirmação e resultado; regressões são
registradas por rota/tema/viewport.

**Progresso parcial em 2026-10-02:** a comparação estática da API Toast encontrou
73 chamadas diretas, todas com severidade explícita e sem configuração dinâmica.
O contrato TypeScript passou a exigir a severidade; `neutra` só pode ser
escolhida explicitamente, sem fallback silencioso. Isso não comprova
cor/contraste na tela nem cobre tecnologia assistiva, comportamento temporal ou
equivalência de mensagens por ação.

### Ciclo 4 — regressão visual automatizada (P2 após Ciclos 1 e 2)

1. Comparar a ferramenta disponível com o dev server/Expo SDK 57 e CI Linux;
   preferir infraestrutura já instalada se estável.
2. Fixar viewport, fonte, tema, timezone e dados sintéticos sem persistência
   pessoal; registrar dependências de navegador.
3. Criar baselines para Home, Descubra, Planos e Leitor depois da inspeção
   humana, cobrindo apenas estados estáveis úteis.
4. Definir comparação perceptual e fluxo explícito de revisão/atualização;
   publicar falhas como artefato e iniciar sem bloqueio até calibrar ruído.
5. Ativar gate bloqueante somente após estabilidade demonstrada em execuções
   repetidas e aprovação do diff visual.

**Aceite:** execução reproduzível local/CI, diagnóstico legível e nenhuma
atualização de baseline sem revisão humana.

### Ciclo 5 — piloto editorial controlado (paralelo, P1)

1. Separar estrutura atual de fonte editorial e propor o schema mínimo de ID,
   versão, status, referências, autor/revisor e relações temáticas.
2. Definir taxonomia pequena e checklist de fonte, consistência bíblica,
   incertezas históricas, linguagem, acessibilidade e busca.
3. Escolher um único lote pequeno após definir responsáveis pela revisão
   independente; rascunhos existentes não entram automaticamente no catálogo.
4. Validar referências contra a base ACF, gerar somente pelos scripts oficiais,
   revisar renderização offline e busca e testar um preview antes de publicar.
5. Publicar apenas conteúdo com revisão humana registrada e status aprovado.

**Aceite:** revisão independente registrada, validações estruturais/editoriais
verdes, rotas/busca/offline revisadas e nenhum conteúdo pendente exposto.

### Ciclo 6 — CI, SEO e release web (P1, dependência externa)

1. Após o workflow atualizado chegar ao GitHub, confirmar um run verde em
   `master`; registrar run ID, commit e eventuais falhas reais.
2. Revisar avisos de runtime do GitHub Actions: o primeiro run foi aprovado,
   mas anotou que `actions/checkout@v4` e `actions/setup-node@v4` ainda declaram
   Node 20; esse runtime foi removido dos runners GitHub-hosted em 2026-09-23 e
   o job foi forçado a Node 24. Identificar versões atuais compatíveis e
   atualizar com base no [aviso oficial](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/).
   O runner `ubuntu-latest` inicia migração para Ubuntu 26 em 2026-10-19, com
   término planejado para 2026-11-19 ([anúncio](https://github.com/actions/runner-images/issues/14748)); confirmar o workflow após a mudança.
3. Corrigir falhas futuras do CI sem reduzir cobertura nem elevar tolerâncias
   para mascarar defeito.
4. Quando quota de preview estiver disponível, validar Home, resumo, plano e
   leitor em preview; conferir clean URLs, console e metadados.
5. Só promover após validação explícita de preview e instrução de rollback.
6. Não iniciar build assinado sem conta/credenciais e retomada do escopo nativo.

**Aceite:** evidência do workflow e preview vinculada ao commit, smoke test e
rollback conhecidos. Sem esses sinais, registrar como bloqueio externo.

**Execução CI em 2026-10-02:** run
[`37033595191`](https://github.com/LoadCG/biblia-plataforma/actions/runs/37033595191)
aprovado em 1m36s para `77163887d9fc9744c45e27ffaa2ce379a195b914`; os gates de
conteúdo, copy, validação, export e metadados passaram. O preview Vercel continua
sem evidência nesta rodada.

### Ciclo 7 — retomada mobile/nativa (deferido, fora da fila atual)

Reabrir após decisão explícita. Então detalhar build Android/iOS, regressão
responsiva em aparelhos, jornadas Maestro, Dynamic Type, VoiceOver/TalkBack,
performance e processo de distribuição. Nenhum item deste ciclo é pré-requisito
para continuar melhorias web desktop.

## Regras de atualização

- Uma entrega concluída requer diff, validação adequada e evidência documentada.
- “Implementado”, “verificado estruturalmente”, “inspecionado visualmente”,
  “aprovado por humano” e “publicado” são estados diferentes.
- Mover etapas concluídas para histórico sem apagar suas decisões e evidências.
- Não misturar mudança editorial ampla e mudança visual no mesmo incremento sem
  motivo explícito.
- Atualizar `ESTADO-DO-PROJETO.md`, `DOCUMENTACAO.md` e `CHANGELOG.md` quando o
  marco ou prioridade mudar, não a cada ajuste cosmético.
