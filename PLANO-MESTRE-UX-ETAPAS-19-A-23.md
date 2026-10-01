# Plano mestre de execução — UX/UI etapas 19 a 23

Documento operacional para execução posterior. Cada tarefa possui um ID único,
pré-requisitos, procedimento, evidência e critério de aceite. Não marcar uma
caixa por inferência: a conclusão exige a evidência indicada.

## Estado de partida

- Branch de trabalho: `codex/ui-usabilidade-16-18`.
- Quality gates locais: TypeScript, Jest, acessibilidade, Maestro estrutural,
  `check:ui` e Expo Doctor aprovados.
- Export web estático: 94 rotas verificadas.
- Gate externo conhecido: quota da Vercel temporariamente indisponível.
- Gates físicos ainda não executados: dispositivo/emulador e leitores de tela.

## Matriz de prioridade

| ID | Entrega | Prioridade | Dependência | Tipo |
|---|---|---:|---|---|
| 19.x | Auditoria responsiva manual | P0 | navegador/dispositivo | validação |
| 20.x | Regressão visual automatizada | P1 | 19 concluída | infraestrutura de QA |
| 21.x | Sistema unificado de estados | P1 | inventário 21.1 | implementação |
| 22.x | Validação nativa e assistiva | P0 | build instalável | validação |
| 23.x | Preview, release e observabilidade | P1 | quota/credenciais | distribuição |

## Ordem de execução revisada

As etapas são trilhas paralelas com gates explícitos. O trabalho web local pode
começar sem EAS ou quota Vercel; validação em binário só começa quando houver
build instalável; publicação não é pré-requisito para corrigir UX.

1. **19 — validação web manual**: preparar dados/matriz, percorrer superfícies,
   registrar defeitos e corrigir bloqueadores.
2. **23.2 — CI remoto**: confirmar um workflow verde e registrar execução/commit.
   Isso pode avançar em paralelo à etapa 19; gerar um run deliberadamente falho
   não é necessário para provar o artefato diagnóstico.
3. **21 — sistema de estados**: inventariar primeiro, definir API mínima e
   migrar telas por grupos, com validação a cada grupo.
4. **20 — snapshots web**: iniciar após a auditoria manual e correção P0/P1,
   usando as telas/estados que já têm dados reproduzíveis.
5. **22 — nativo e assistivo**: obter build instalável; executar Maestro,
   VoiceOver/TalkBack e performance por plataforma, reportando separadamente
   qualquer plataforma sem ambiente disponível.
6. **23.1/23.3 — preview e distribuição**: validar preview quando a quota
   existir; builds assinados só depois de conta/credenciais estarem disponíveis.
7. **23.4 — observabilidade**: fechar versão/commit nos relatórios e rollback;
   sem telemetria remota antes de decisão de produto.

### Definição de pronto por etapa

- **19:** todas as superfícies prioritárias percorridas nas larguras/temas
  planejados; defeitos reproduzíveis com rota, viewport, passos e severidade;
  P0/P1 corrigidos e revalidados.
- **20:** snapshots estáveis em CI Linux, dados/locale/tamanho de tela fixos,
  política de atualização aprovada e falha de comparação legível.
- **21:** cada estado crítico tem feedback acessível; erro recuperável oferece
  retry ou instrução; migração não altera conteúdo/copy sem necessidade.
- **22:** cada jornada e tecnologia assistiva possui plataforma, build, passos,
  resultado e defeitos registrados; gate parcial claramente declarado.
- **23:** CI e preview comprovados por URL/commit; distribuição identifica
  artefato, assinatura e resultado de smoke test; rollback reproduzível.

---

## Etapa 19 — Auditoria visual responsiva

### 19.1 Preparar matriz de execução `⬜`

- [ ] Registrar navegador, versão, sistema operacional e densidade de pixels.
- [ ] Preparar viewports: 320×800, 375×812, 414×896, 768×1024 e desktop
  1440×900.
- [ ] Repetir cada viewport em tema claro e escuro.
- [ ] Limpar storage entre cenários que dependem de onboarding/progresso.
- [ ] Fixar dados determinísticos para Salvo, Planos e Estatísticas.

**Evidência:** planilha ou Markdown com viewport, tema, plataforma e data.
**Subetapas:** 19.1a registrar ambiente; 19.1b escolher viewports; 19.1c
estabelecer dados e estado inicial; 19.1d criar registro de execução. Não
reutilizar sessão com onboarding/progresso entre cenários sem anotar isso.

**Registro inicial:** `docs/matriz-auditoria-responsiva.md`. Os viewports e
casos foram especificados; inspeção visual permanece pendente até haver
navegador de automação disponível. A matriz não deve ser marcada como executada
com base apenas em contratos estruturais.

### 19.2 Início e navegação `⬜`

- [ ] Verificar que nenhum card invade a largura do viewport.
- [ ] Confirmar que a barra mobile não cobre conteúdo rolável.
- [ ] Confirmar sidebar desktop com largura estável e foco visível.
- [ ] Testar troca de aba após rolagem profunda.
- [ ] Validar que ícones e rótulos permanecem legíveis em 320 px.

**Aceite:** zero clipping/overflow horizontal e todos os destinos principais
alcançáveis por toque/teclado.

### 19.3 Descubra e Busca `⬜`

- [ ] **Entrada e intenção:** distinguir exploração guiada por tema da busca textual, mantendo claro o que cada interação vai mostrar.
- [ ] **Escolha de tema:** preservar título, descrição e ilustração como conteúdo complementar; tornar a área acionável inteira, com hover/foco/seleção perceptíveis e sem depender apenas da cor.
- [ ] **Detalhe do tema:** apresentar título e contexto antes das referências; permitir voltar à grade preservando posição de rolagem e filtros.
- [ ] **Continuidade de navegação:** alinhar seleção por card, recomendações da Home e links diretos; definir como query string e botão voltar do navegador refletem o tema aberto.
- [ ] **Passagens:** deixar explícito que cada item abre uma referência bíblica; fornecer loading, erro com retry e comportamento coerente se uma referência curada não estiver disponível.
- [ ] **Busca:** conferir digitação/debounce, limpeza sem cobrir o texto, abas Bíblia/Resumos, resultados, vazio e erro; trocar de tema para busca não pode deixar filtros antigos confusos.
- [ ] **Filtros de resultados:** validar filtros de testamento e livro, estado selecionado, combinação, limpeza e acessibilidade por teclado/leitor de tela.
- [ ] **Estados e tema:** revisar claro/escuro, foco, hover, loading, erro, vazio e tema inválido via URL em web desktop.
- [ ] **Responsividade preservada:** evitar regressão estrutural em larguras menores sem puxar o refinamento visual mobile para esta etapa.

**Aceite:** a pessoa entende onde está, o que cada tema oferece e como chegar à
passagem; consegue voltar sem perder contexto; nenhum estado depende apenas de
cor, fica sem feedback, ou apresenta overflow/controle inacessível. Confirmar em
claro/escuro, navegação por teclado e jornada completa no navegador.

### 19.4 Salvo e coleções `⬜`

- [ ] Testar combinação de busca, filtro, ordenação e coleção.
- [ ] Confirmar que “Limpar filtros” aparece somente quando necessário.
- [ ] Testar seleção em lote e undo em viewport estreito.
- [ ] Verificar modal/edição de coleção e confirmação destrutiva.
- [ ] Confirmar que textos longos quebram sem empurrar ações para fora.

### 19.5 Resumos e Planos `⬜`

- [ ] Testar limpeza da busca e lista vazia em Resumos.
- [ ] Conferir hierarquia de título, gênero, trecho e estado lido.
- [ ] Conferir barra de progresso dos Planos em claro/escuro.
- [ ] Testar títulos longos e valores máximos de progresso.
- [ ] Confirmar que cards inteiros continuam acionáveis.

### 19.6 Leitor bíblico `⬜`

- [ ] Testar header, abas Texto/Resumo e controles de leitura.
- [ ] Testar seleção de um e vários versículos.
- [ ] Verificar toolbar de ações em 320 px e com fonte ampliada.
- [ ] Testar navegação anterior/próximo no início e fim do cânon.
- [ ] Confirmar que o modo foco não altera a altura útil do conteúdo.

### 19.7 Configurações e Estatísticas `⬜`

- [ ] Testar controles de fonte e tema com foco visível.
- [ ] Confirmar que switches comunicam estado ligado/desligado.
- [ ] Testar exportação/apagamento com feedback de sucesso/erro.
- [ ] Confirmar que cards de Estatísticas quebram sem overflow.

### 19.8 Consolidar achados `⬜`

- [ ] Classificar cada achado como P0 bloqueante, P1 importante ou P2 cosmético.
- [ ] Abrir tarefa técnica com rota, viewport, passos e resultado esperado.
- [ ] Corrigir P0/P1 antes de iniciar snapshots.
- [ ] Atualizar `FUNCIONALIDADES.md` com evidência, não apenas intenção.

### 19.9 Relatório de saída `⬜`

- [ ] Publicar matriz com casos executados e não executados.
- [ ] Ligar cada defeito a rota, ambiente, reprodução, severidade e correção.
- [ ] Reexecutar casos afetados após correção e marcar resultado.
- [ ] Declarar limitações de acessibilidade que dependem de leitor de tela.

---

## Etapa 20 — Regressão visual automatizada

### 20.1 Selecionar ferramenta `⬜`

- [ ] Comparar Playwright screenshot, Maestro screenshots e solução compatível
  com Expo web/native.
- [ ] Avaliar suporte a tema, viewport, fontes, animações e CI Linux.
- [ ] Escolher uma ferramenta principal e registrar a decisão técnica.
- [ ] Não instalar dependência antes de validar impacto no bundle e no CI.

**Decisão sugerida:** começar por screenshots web determinísticos das rotas
estáticas e interativas críticas; adicionar nativo somente após 22.x.

### 20.2 Definir baselines `⬜`

- [ ] Capturar Início, Descubra, Salvo, Resumos, Planos e Leitor.
- [ ] Capturar estados vazio, carregando, erro, preenchido e seleção ativa.
- [ ] Fixar fontes, timezone, locale e dados locais.
- [ ] Desativar animações ou aguardar estado estável antes da captura.

### 20.3 Política de comparação `⬜`

- [ ] Definir threshold de diferença por pixel/perceptual diff.
- [ ] Separar mudanças de conteúdo editorial de mudanças visuais.
- [ ] Exigir revisão humana para atualizar baseline.
- [ ] Publicar screenshots de falha como artefato do CI.

### 20.4 Integrar ao CI `⬜`

- [ ] Criar script `check:visual` reproduzível localmente.
- [ ] Executar em pull request sem bloquear inicialmente por uma rodada piloto.
- [ ] Ativar bloqueio após calibrar falsos positivos.
- [ ] Documentar comando de atualização dos baselines.

### 20.5 Calibrar sem criar ruído `⬜`

- [ ] Rodar o job em pull requests sem bloquear durante uma rodada piloto.
- [ ] Classificar divergências entre conteúdo, fonte/renderização e regressão.
- [ ] Ajustar apenas flakiness comprovada; não elevar tolerância para ocultar defeito.
- [ ] Ativar bloqueio após revisão dos falsos positivos e baselines.

---

## Etapa 21 — Sistema unificado de estados

### 21.1 Inventário técnico `⬜`

- [ ] Catalogar cada `ActivityIndicator`, skeleton, `EstadoVazio`, Toast e Alert.
- [ ] Mapear ações assíncronas sem feedback ou com feedback inconsistente.
- [ ] Registrar copy atual, severidade, duração e ação de recuperação.
- [ ] Identificar duplicação antes de criar novos componentes.

**Inventário inicial:** `docs/inventario-estados-ui.md` (leitura estática,
2026-09-28). Descobertas: Estatísticas e Salvo não expõem falha de carga;
Planos pode exibir temporariamente progresso zero; Busca trata erro como estado
vazio e ainda não oferece retry explícito.

**Primeiro recorte implementado:** componentes compartilhados de carregamento
e erro aplicados a Busca, Salvo, Planos e Estatísticas; revisão visual desses
estados permanece pendente. `npm run validate` passa TypeScript, Jest, contratos
de acessibilidade, Maestro estrutural e UI; Expo Doctor reporta 20/21 por 14
dependências SDK 57 abaixo das versões atualmente esperadas. Registrar/planejar
alinhamento das dependências como trabalho separado; não foi feito upgrade
automático nesta etapa.

**Segundo recorte:** seletor de versículos, CardVersiculoTema e PopoverVersiculo
também usam estados comuns com retry e ignoram respostas antigas. O carregamento
do CardVersiculoDia usa `EstadoCarregando`; seu erro em gradiente foi preservado.
O retry da Busca agora repete os mesmos filtros sem incrementar a paginação.
Ver `docs/inventario-estados-ui.md`. Testes (9 suítes/32 casos), TypeScript,
contratos a11y, Maestro e UI passam; Expo Doctor permanece 20/21 pela mesma
divergência de 14 versões de dependências.

**Terceiro recorte:** detalhe de Plano distingue progresso carregando/erro/dados,
oferece retry e apresenta feedback em falhas de iniciar sessão ou atualizar
conclusão. Leitor passa a limpar e agrupar os dados pessoais por capítulo,
descartar respostas tardias e notificar falhas do repositório. A validação visual
segue pendente.

**Quarto recorte:** no leitor, erros ao persistir grifo, progresso, nota ou avanço
de sessão agora são comunicados. Falhas ao salvar/remover nota mantêm o modal
aberto para permitir nova tentativa; nenhum estado local é atualizado antes da
persistência correspondente.

**Quinto recorte:** Salvo e `CardAtividade` comunicam falhas de escrita em
coleções, associações, ações sobre itens e notas. Em exclusão em lote, que pode
falhar parcialmente por envolver vários repositórios, a tela recarrega os dados
e pede conferência sem oferecer um desfazer que talvez não restaure tudo.
TypeScript, contratos de acessibilidade/UI e `git diff --check` passaram.

**Sexto recorte:** Home, Configurações, perfil, onboarding, busca, seleção da
Bíblia, medalhas e Versículo do Dia tratam falhas assíncronas restantes. O
lembrete só é marcado como ativo após permissão, agendamento e persistência;
preferências de leitura aguardam confirmação de gravação. Modais de perfil e
nota mostram falha e permanecem disponíveis para nova tentativa. A inspeção
visual continua pendente. TypeScript, contratos de acessibilidade/UI, cobertura
editorial e `git diff --check` passaram; a suíte de testes não foi executada
neste recorte.

### 21.2 API visual compartilhada `🔶`

- [x] Criar `EstadoCarregando` com label e variante visual.
- [x] Criar `EstadoErro` com mensagem amigável e retry opcional.
- [x] Evoluir `EstadoVazio` com ação opcional sem quebrar consumidores atuais.
- [x] Definir tokens de severidade, espaçamento, borda e contraste.

**Incremento:** a ação é contextual e opcional; busca sem resultados pode ser
limpa e a busca em Resumos pode trocar para a Bíblia. Estados de Salvo/Perfil
continuam sem botão quando não há uma recuperação imediata apropriada. O botão
tem papel acessível e altura mínima de 44 px. Validar aparência em navegador e
tema escuro segue pendente.

**Incremento de feedback:** Toast ganhou severidade opcional (`neutra`, `sucesso`,
`aviso`, `erro`, `informacao`), tokens claros/escuros e símbolos Phosphor
semânticos. Chamadas antigas continuam neutras; migrá-las por grupo é parte da
etapa 21.3. O TypeScript passou; inspeção de contraste e composição no navegador
permanece pendente.

**Migração 21.3 — primeiro grupo:** Salvo, coleções e `CardAtividade` agora
classificam sucesso, erro e exclusão parcialmente interrompida. A ação de undo
preserva seu comportamento e anuncia também o resultado da tentativa. O restante
das superfícies segue em migração por grupo.

### 21.3 Migração incremental `⬜`

- [ ] Migrar Busca e Resumos.
- [ ] Migrar Salvo, Coleções e Planos.
- [ ] Migrar Leitor, Popover e seleção de versículo.
- [ ] Migrar Configurações e Estatísticas.
- [ ] Remover duplicações somente após todos os consumidores passarem.

### 21.4 Aceite e regressão `⬜`

- [ ] Cada estado deve ter nome acessível e feedback visual.
- [ ] Cada erro recuperável deve ter retry ou instrução objetiva.
- [ ] Cada ação destrutiva deve ter confirmação e resultado observável.
- [ ] Adicionar contratos e cenários Maestro para os estados críticos.

### 21.5 Plano de migração/compatibilidade `⬜`

- [ ] Definir API comum sem acoplar a plataforma a um componente nativo/web.
- [ ] Migrar um grupo de telas por vez e observar as mensagens atuais.
- [ ] Conferir acessibilidade, dark mode e layout estreito por estado.
- [ ] Remover padrões duplicados apenas quando não houver consumidor restante.

---

## Etapa 22 — Validação nativa e assistiva

### 22.1 Preparar binários `⬜`

- [ ] Gerar build EAS preview Android.
- [ ] Gerar build EAS preview iOS quando credenciais estiverem disponíveis.
- [ ] Registrar versão do app, commit e perfil de build.
- [ ] Instalar em emulador/dispositivo sem reutilizar estado corrompido.

### 22.2 Executar Maestro `⬜`

- [ ] Rodar onboarding.
- [ ] Rodar leitura e Salvo.
- [ ] Rodar busca global.
- [ ] Rodar plano guiado.
- [ ] Repetir em orientação/largura relevante quando aplicável.

### 22.3 Acessibilidade assistiva `⬜`

- [ ] VoiceOver: foco, ordem, labels, rotor e anúncios.
- [ ] TalkBack: foco, ações customizadas, estados e leitura contínua.
- [ ] NVDA: landmarks, headings, campos, tabs e regiões vivas no web.
- [ ] Dynamic Type/fonte ampliada sem clipping.
- [ ] Registrar cada defeito com severidade e reprodução.

### 22.4 Performance percebida `⬜`

- [ ] Medir primeira renderização da Home.
- [ ] Medir abertura do Leitor e troca de capítulo.
- [ ] Medir busca local e atualização dos filtros.
- [ ] Verificar jank durante rolagem e seleção múltipla.

### 22.5 Relatório de cobertura do ambiente `⬜`

- [ ] Registrar sistemas operacionais e versões efetivamente testadas.
- [ ] Separar falha do produto de indisponibilidade de build/dispositivo.
- [ ] Listar jornadas executadas e evidência de cada uma.
- [ ] Manter iOS pendente sem marcar a etapa como completa se não houver host.

---

## Etapa 23 — Preview, release e observabilidade

### 23.1 Vercel `⬜`

- [ ] Confirmar que a quota do workspace foi liberada.
- [ ] Criar Preview Deployment a partir da branch.
- [ ] Validar `/`, `/resumos/01-genesis`, `/planos/sabedoria-7` e
  `/biblia/01-genesis/1`.
- [ ] Conferir clean URLs, fallback e console sem erros.
- [ ] Guardar URL, commit e resultado como evidência.

### 23.2 GitHub Actions `⬜`

- [ ] Confirmar primeiro workflow remoto verde.
- [ ] Verificar artefato de diagnóstico em uma execução controlada.
- [ ] Confirmar que `check:content`, `check:ui` e export estático rodam no CI.
- [ ] Configurar proteção de branch somente após uma rodada estável.

### 23.3 EAS e distribuição `⬜`

- [ ] Vincular projeto à conta EAS.
- [ ] Provisionar credenciais de assinatura.
- [ ] Gerar builds preview assinados.
- [ ] Executar smoke test nos binários.
- [ ] Só então preparar publicação, metadados e revisão de loja.

### 23.4 Observabilidade mínima `⬜`

- [ ] Definir eventos locais de erro de navegação e falha de busca sem dados
  pessoais.
- [ ] Registrar versão/commit nos artefatos de teste.
- [ ] Documentar procedimento de rollback/redeploy.
- [ ] Não adicionar telemetria remota sem decisão de produto e privacidade.

### 23.5 Fechamento e rollback `⬜`

- [ ] Associar preview/build ao commit e perfil de distribuição.
- [ ] Registrar instrução de rollback/redeploy e responsável pela execução.
- [ ] Separar bloqueio externo (quota/credencial) de defeito de produto.
- [ ] Não considerar “deploy criado” como aceite: abrir e validar as rotas críticas.

---

## Definition of Done do plano

- [ ] Matriz visual executada e achados P0/P1 resolvidos.
- [ ] Baselines visuais revisados e CI integrado.
- [ ] Estados assíncronos unificados nas superfícies críticas.
- [ ] Maestro e leitores de tela executados em ambiente real.
- [ ] Preview Vercel validado após liberação de quota.
- [ ] Build EAS preview assinado validado.
- [ ] Documentação, changelog, commit e evidências atualizados na mesma entrega.
