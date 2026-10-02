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

## Estado comprovado na revisão

| Frente | Estado | Evidência / lacuna |
|---|---|---|
| Home desktop | Parcialmente refinada | Jornada reorganizada; paisagem horária e ilustração da jornada implementadas. Inspeções registradas em 1280×900; lateral ainda precisa de captura integral em janela ampla e comparação de hierarquia/ritmo. |
| Descubra | Parcialmente implementada | Navegação por tema sincronizada com URL/histórico e cenas vetoriais compartilhadas; auditoria completa de foco, filtros, erros e breakpoints segue pendente. |
| Planos | Implementado com QA parcial | Arte e sessões existem; inspeção visual registrada em desktop claro/escuro. Fluxos de erro, conclusão e evidência integral de viewport permanecem incompletos. |
| Sistema de estados | Migração principal feita | Inventário/API/migrações e severidades existem; inspeção visual/assistiva de cada estado, duplicações e alguns contratos continuam pendentes. |
| Copy da interface | Sem vazamento identificado na busca atual | Varredura literal de app, componentes e fontes editoriais não encontrou padrões de pensamento interno ou autoidentificação. Novo gate automatizado limita regressões futuras. |
| CI remoto | Não comprovado | Não há execuções retornadas pelo GitHub Actions nesta revisão. Workflow passa a observar `master` e `main`; confirmar run remoto após push. |
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
2. Corrigir falhas do CI sem reduzir cobertura nem elevar tolerâncias para
   mascarar defeito.
3. Quando quota de preview estiver disponível, validar Home, resumo, plano e
   leitor em preview; conferir clean URLs, console e metadados.
4. Só promover após validação explícita de preview e instrução de rollback.
5. Não iniciar build assinado sem conta/credenciais e retomada do escopo nativo.

**Aceite:** evidência do workflow e preview vinculada ao commit, smoke test e
rollback conhecidos. Sem esses sinais, registrar como bloqueio externo.

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
