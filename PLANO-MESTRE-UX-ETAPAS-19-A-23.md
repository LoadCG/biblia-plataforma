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

### 19.2 Início e navegação `⬜`

- [ ] Verificar que nenhum card invade a largura do viewport.
- [ ] Confirmar que a barra mobile não cobre conteúdo rolável.
- [ ] Confirmar sidebar desktop com largura estável e foco visível.
- [ ] Testar troca de aba após rolagem profunda.
- [ ] Validar que ícones e rótulos permanecem legíveis em 320 px.

**Aceite:** zero clipping/overflow horizontal e todos os destinos principais
alcançáveis por toque/teclado.

### 19.3 Descubra e Busca `⬜`

- [ ] Testar digitação, debounce, loading, erro e estado vazio.
- [ ] Verificar botão de limpar sem cobrir o texto do campo.
- [ ] Verificar tabs Bíblia/Resumos em 320 px.
- [ ] Testar filtros de testamento e livro com rolagem horizontal.
- [ ] Confirmar leitura dos resultados por leitor de tela.

**Aceite:** nenhum controle fica inacessível, truncado ou sem feedback.

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

---

## Etapa 21 — Sistema unificado de estados

### 21.1 Inventário técnico `⬜`

- [ ] Catalogar cada `ActivityIndicator`, skeleton, `EstadoVazio`, Toast e Alert.
- [ ] Mapear ações assíncronas sem feedback ou com feedback inconsistente.
- [ ] Registrar copy atual, severidade, duração e ação de recuperação.
- [ ] Identificar duplicação antes de criar novos componentes.

### 21.2 API visual compartilhada `⬜`

- [ ] Criar `EstadoCarregando` com label e variante visual.
- [ ] Criar `EstadoErro` com mensagem amigável e retry opcional.
- [ ] Evoluir `EstadoVazio` com ação opcional sem quebrar consumidores atuais.
- [ ] Definir tokens de severidade, espaçamento, borda e contraste.

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

---

## Definition of Done do plano

- [ ] Matriz visual executada e achados P0/P1 resolvidos.
- [ ] Baselines visuais revisados e CI integrado.
- [ ] Estados assíncronos unificados nas superfícies críticas.
- [ ] Maestro e leitores de tela executados em ambiente real.
- [ ] Preview Vercel validado após liberação de quota.
- [ ] Build EAS preview assinado validado.
- [ ] Documentação, changelog, commit e evidências atualizados na mesma entrega.

