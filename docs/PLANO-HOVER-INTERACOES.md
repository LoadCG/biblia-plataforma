# Plano de microinterações hover da interface web

Atualizado em 2026-10-02. Este plano cobre estados de hover sutis em todas as
rotas e componentes interativos do produto. É uma melhoria web desktop; não é
um redesenho mobile nem uma animação contínua.

## Objetivo e limites

Dar resposta visual imediata quando uma pessoa aponta para ações e superfícies
clicáveis, sem alterar navegação, conteúdo, hierarquia, dimensões ou comportamento
de toque. O plano trata hover como um sinal adicional: teclado, toque e tecnologia
assistiva continuam tendo sinais próprios e completos.

Aplicar somente em navegadores com dispositivo apontador que ofereça hover.
Manter o feedback de pressionamento atual em telas táteis e plataformas nativas.
Respeitar `prefers-reduced-motion` e o mecanismo existente
`useMovimentoReduzido`; a preferência reduz movimento, sem ocultar estado,
contraste, foco ou confirmação.

## Contrato visual e técnico

- Movimentos pequenos: elevação máxima de 1–2 px em cards; sem zoom chamativo,
  balanço, parallax ou animação de texto bíblico.
- Duração curta, em geral 120–180 ms, com easing simples e sem atraso.
- Usar prioritariamente cor de fundo/borda, sombra discreta e transformação que
  não altere o fluxo do documento. Nenhum conteúdo deve deslocar os vizinhos.
- Ação e foco visível não dependem de hover. `:focus-visible` tem contraste
  próprio; hover nunca remove outline nem muda a ordem de foco.
- Hover de card e links deve manter o nome acessível, papel, estado e alvo atual.
  Evitar controles interativos aninhados dentro de links animados.
- Não animar áreas de seleção de texto bíblico como se fossem cards clicáveis.
  Quando a passagem tiver ação, indicar hover somente na superfície já acionável.
- Não introduzir dependência antes de provar que CSS web e NativeWind/React
  Native Web atendem ao contrato. Preferir uma pequena camada CSS declarativa
  compartilhada, limitada ao web, se compatível com o pipeline atual.
- Revisar cada família de componente uma vez e confirmar as rotas consumidoras
  com uma matriz rastreável; correções globais exigem regressão em todas elas.

## Inventário completo de superfícies

| Grupo / rota | Elementos a cobrir | Tratamento previsto | Exceções e estados |
|---|---|---|---|
| Shell global e abas — `app/_layout.tsx`, `app/(tabs)/_layout.tsx` | abas, links de navegação, alternância de tema e atalhos do cabeçalho | cor/superfície e ícone; sem elevar a barra inteira | estado selecionado permanece distinto de hover; foco visível separado |
| Apresentação — `/onboarding` | avançar, começar, explorar planos, pular | botão primário/secundário com variação breve de superfície | manter passo atual; não animar transição de conteúdo neste plano |
| Início — `/` | card do dia, links de continuar leitura, atalhos de oração/compartilhar, jornada, recomendações de tema, sequência e medalhas | links e cards ganham elevação leve; ações compactas recebem mudança de cor | ilustração horária e texto do versículo permanecem estáticos; preservar salvar/nota/compartilhar |
| Bíblia — `/biblia` | grade/lista de livros e seletores | item selecionável realça borda/fundo | marca de seleção não pode depender da cor hover |
| Capítulos — `/biblia/escolher` e `/biblia/escolher/[livro]/[capitulo]` | cartões de capítulo, voltar, avançar e ações de seleção | capítulo pode receber borda/superfície; navegação recebe cor | número e estado selecionado permanecem legíveis; não animar cada célula em cascata |
| Leitor — `/biblia/[livro]/[capitulo]` | voltar, seletor de capítulo, fonte, tema, ações, versos acionáveis, seleção e painel flutuante | toolbar e ações recebem cor; item de verso recebe apenas realce discreto quando houver ação real | não mover parágrafos nem interferir com seleção/cópia, leitura em voz alta ou scroll |
| Descubra — `/pesquisa` | campo de busca/limpar, categorias, temas, resultados, cartões de passagem, relações e retorno | cartões acionáveis elevam no máximo 1–2 px; controles inline recebem borda/cor | estados de busca carregando, vazio e erro são estáticos; preservar navegação via Enter |
| Planos — `/planos` e `/planos/[id]` | cartões de plano, CTA, sessões, links bíblicos, marcar/revisar e retorno | card e botões conforme papel; progresso não anima por hover | progresso e conclusão são estados persistentes, sem confusão com pré-visualização hover |
| Salvos — `/salvo` | filtros, ordenação, tabs, coleção, edição, seleção em lote, excluir e itens salvos | controles selecionáveis mostram superfície/borda; links/cards elevam suavemente | seleção checked não é simulada; ações destrutivas não recebem destaque promocional |
| Perfil — `/voce` | preferências, editar perfil, cartões, links para medalhas/estatísticas/salvos | links e cartões recebem realce coerente | carrossel horizontal não desloca ao passar o ponteiro |
| Estatísticas — `/estatisticas` | links de período/navegação, se existentes; cards informativos | somente controles navegáveis recebem hover; cards puramente informativos ficam estáticos | números e gráficos não se movem nem mudam de escala |
| Medalhas — `/medalhas` | cards interativos e retorno | item clicável realça borda/fundo | medalhas decorativas/inativas permanecem sem cursor ou elevação enganosa |
| Resumos — `/resumos` e `/resumos/[livro]` | busca, cartões de livros, referências acionáveis, próximo/anterior e retorno | cartões/links elevam discretamente; campos mudam borda/fundo | corpo do resumo permanece estático, preservando leitura e seleção |
| Configurações — `/configuracoes` | links, controles de fonte/tema/notificações, salvar, limpar dados e diálogos | hover de linha de preferência muda superfície; botões mudam cor | manter switch acessível; aviso/destruição não anima; modal não reage como card |
| Sobre — `/sobre` | links de navegação e fontes externas | cor/sublinhado/foco visível | blocos de texto e informações legais ficam estáticos |
| Camadas globais — toast, menu de ações, popover de versículo, tooltip, modal de nota/perfil, estados vazios/erro/carregamento | fechar, retry, salvar, remover, ações do menu, links e CTA de vazio | aplicar apenas aos controles dentro da camada, sem elevar backdrop ou painel inteiro | loader, toast e entrada/saída não entram no escopo de hover; movimento segue regra de redução |

Rotas cobertas (17): `/`, `/onboarding`, `/biblia`, `/biblia/escolher`,
`/biblia/escolher/[livro]/[capitulo]`, `/biblia/[livro]/[capitulo]`,
`/pesquisa`, `/planos`, `/planos/[id]`, `/salvo`, `/voce`, `/estatisticas`,
`/medalhas`, `/resumos`, `/resumos/[livro]`, `/configuracoes` e `/sobre`.
Rotas de erro/loading/vazio pertencem à respectiva rota e também entram na
verificação quando acionáveis. A matriz responsiva existente continuará sendo a
fonte para registrar viewport e tema efetivamente inspecionados.

## Execução por etapas

### 1. Inventário e linha de base

- Confirmar todos os alvos desta matriz no código, incluindo variações de erro,
  vazio, carregando, ativo, selecionado, desabilitado e diálogos.
- Agrupar por famílias: navegação, card-link, botão, seletor/filtro, campo,
  controles dentro de overlay e item de leitura.
- Registrar quantos casos há por rota/família e decidir explicitamente
  `hover`, `hover por cor sem movimento` ou `não se aplica` com justificativa.
- Capturar antes/depois de amostras representativas em web desktop claro/escuro;
  anotar o viewport real usado, sem presumir dimensões da janela.

**Saída:** matriz com cada rota marcada pendente, aprovada, corrigida ou N/A e
linha de base reproduzível.

### 2. Prova técnica e contrato de movimento

- Confirmar no Expo SDK 57, React Native Web e NativeWind da versão instalada o
  suporte a hover CSS e foco visível; não presumir suporte idêntico no nativo.
- Escolher uma implementação pequena sem nova dependência: tokens de classe/CSS
  compartilhados ou componente específico se CSS não cobrir `Pressable`/`Link`.
- Provar `hover` com mouse, navegação/foco com teclado e pressão em emulação
  touch; comprovar que nenhum estilo hover fica preso após toque.
- Provar tema escuro e movimento reduzido em hover e foco; manter estado ativo e
  seleção discerníveis quando animação/transição for removida.
- Definir os valores finais de duração, easing, elevação, sombra e cor com base
  na prova, não em valores soltos por tela.

**Saída:** decisão técnica anotada, regra reutilizável e amostra aceita antes da
propagação pelo produto.

### 3. Implementação da linguagem compartilhada

- Criar estilo/tokens compartilhados por papel: link/card, botão, seletor e
  controle inline. Não criar uma animação genérica para todos os `Pressable`.
- Restringir regras de hover a `@media (hover: hover) and (pointer: fine)` ou
  equivalente comprovado, apenas na web.
- Usar `prefers-reduced-motion: reduce` para tirar transformação e transição;
  cor/contorno de estado permanece disponível.
- Preservar estilo de pressionamento, disabled, selecionado, checked e foco.
- Documentar uso/limites no mesmo lugar do estilo compartilhado.

**Saída:** implementação única e tipada, sem duplicação de tempos/easing e sem
mudança de comportamento em plataformas nativas.

### 4. Aplicação por ondas com cobertura por tela

1. **Navegação e entradas:** shell/tabs, onboarding, retornos e controles de
   cabeçalho.
2. **Descoberta de leitura:** Início, Descubra, links bíblicos, detalhes temáticos.
3. **Leitura e jornada:** seleção de livro/capítulo, leitor, resumo e planos.
4. **Organização pessoal:** Salvos, perfil, estatísticas e medalhas.
5. **Preferências e informação:** configurações, Sobre e suas ações externas.
6. **Camadas e estados:** overlays, retry, vazios acionáveis, toasts e menus.

Ao fechar cada onda, cruzar o diff de componentes compartilhados com a tabela de
rotas consumidoras. Nenhuma rota fica concluída só porque o componente comum foi
alterado: abrir a rota, localizar uma instância real da família e conferir seu
estado hover, foco, pressão e tema.

### 5. Revisão visual, acessibilidade e qualidade

- Percorrer as 16 rotas e as camadas compartilhadas uma a uma, marcando cada
  combinação como vista ou pendente; para padrões repetidos, cobrir cada variante
  e cada consumidor de componente compartilhado.
- Em mouse: entrar/sair rapidamente do hover, clicar, navegar e recarregar; a
  posição do conteúdo não pode saltar nem oscilar.
- Em teclado: Tab/Shift+Tab, Enter e Space conforme o papel; foco sempre visível
  mesmo quando hover não está presente.
- Em touch/coarse pointer: nenhuma elevação hover presa; feedback de pressão e
  alvo de toque mantidos. Esta verificação é regressão responsiva, não aceite de
  app mobile dedicado.
- Repetir claro/escuro nas famílias visuais, com contraste em repouso, hover,
  foco, selecionado e desabilitado.
- Em movimento reduzido: não deslocar nem pulsar; transições decorativas somem,
  porém resposta funcional continua perceptível por cor/foco/estado.
- Conferir console, overflow, alteração de layout, hit area, clipping de sombra,
  navegação e que texto bíblico continua selecionável.

**Aceite final:** nenhuma rota/família aplicável sem resultado registrado;
N/A tem justificativa; hover é exclusivo de ponteiro apropriado; foco, toque,
contraste, seleção e movimento reduzido passam; `typecheck`, contratos de UI e
acessibilidade e `git diff --check` passam; evidências e limitações entram na
matriz de auditoria. Não se declara auditoria nativa/mobile dedicada.

## Riscos e resposta

| Risco | Resposta do plano |
|---|---|
| Hover aplicado também ao toque e ficar preso | CSS sob capacidade de hover/fine pointer; confirmar em coarse pointer |
| Divergência visual claro/escuro | Usar tokens semânticos existentes e inspecionar os dois temas |
| Foco de teclado mascarado pelo hover | Regras separadas e foco explícito com contraste próprio |
| Cards sobem e mudam layout | Transform visual, sem mudar dimensões ou fluxo; verificar saltos |
| Muitos estilos duplicados | Poucas variantes por papel, centralizadas e documentadas |
| Texto ou conteúdo importante anima | Excluir leitura, métricas, arte principal e feedback persistente |
| Movimento reduzido remove a única resposta | Manter cor, outline e estado sem transição |
| Controles não interativos parecem clicáveis | Marcar informativos/decoração como N/A e não aplicar cursor/elevação |
| Regressão em componente reutilizado | Registrar consumidores e reinspecionar todas as rotas consumidoras |

## Estado inicial

- Planejamento concluído; implementação ainda não iniciada.
- A documentação foi baseada nas rotas atuais e no inventário de componentes
  encontrados em `app/` e `components/`; a primeira etapa reconcilia a matriz com
  a árvore de acessibilidade e casos condicionais reais.
- Próximo passo de desenvolvimento: etapa 1 e prova técnica da etapa 2. Só então
  implementar a primeira onda e registrar o padrão visual aprovado.
