# Plano de melhorias de interface e design

## Propósito

Deixar a plataforma bíblica mais reconhecível, clara e acolhedora, ampliando o uso de ícones, símbolos, ilustrações, imagens e animações curtas. A identidade deve continuar serena e centrada na leitura, com comportamento coerente entre web e aplicativo, nos temas claro e escuro e em telas pequenas.

Este documento reúne o plano de execução e um registro incremental do que já foi feito. O trabalho deve avançar por entregas pequenas, com comparação visual antes/depois e critérios objetivos de aceite.

## Direção aprovada para o conceito visual

A referência visual criada nesta conversa foi aprovada como **alvo visual do resultado final**, incluindo a composição das quatro telas mostradas (Início, Descubra, Leitor e Planos): interface editorial acolhedora, fundo quente, acentos terrosos/dourados, cartões com respiro, ilustrações de cena, ícones lineares coerentes e microinterações discretas. O objetivo é aproximar o front-end real dessa composição e hierarquia a cada incremento, adaptando dimensões e navegação às plataformas e mantendo as funções e conteúdos do produto. Cada rodada deve registrar diferenças visíveis restantes e escolher a próxima correção que mais reduza a distância para a referência.

A imagem não é especificação pixel a pixel: textos renderizados nela podem conter imprecisões e não devem virar conteúdo do produto. As proporções e a composição servem de referência para o resultado; medidas finais são acertadas no app em cada breakpoint. O cartão do Versículo do Dia usa uma **ilustração de paisagem vetorial**, sem moldura de ícone; a cena muda com a saudação (amanhecer, tarde ou noite) sem abandonar o estilo aprovado. Imagens e ilustrações não substituem nem encobrem o conteúdo bíblico.

### Prioridade ajustada pelo usuário — desktop primeiro

A rodada atual concentra as melhorias na experiência web em largura ampla (mínimo de 1024 px): Início, Descubra, Leitor e Planos. A implementação mobile e a validação em aparelhos ficam adiadas para uma rodada posterior; não usar a pendência mobile como bloqueio para evoluir o desktop. A captura anexada nesta rodada é uma referência visual e de composição, não uma fonte de instruções de produto nem de copy bíblica. Usar no código somente conteúdo editorial já aprovado no acervo ou copy de interface escrita para a função real.

**Sequência da rodada:** (1) estabelecer largura e hierarquia editorial desktop; (2) enriquecer Descubra com cards ilustrados e descrições úteis; (3) tornar Planos uma vitrine editorial com progresso destacado; (4) reorganizar Início em composição ampla com destaque ilustrado e próximos passos; (5) revisar o Leitor preservando texto-primeiro e foco; (6) validar web desktop em claro/escuro e atualizar matriz. Componentes compartilhados podem permanecer responsivos, mas esta rodada não altera nem declara aprovada a experiência mobile.

## Leitura do estado atual

- Expo SDK 57, React Native 0.86, React 19, NativeWind 4, `react-native-svg`, `react-native-reanimated` 4.5.1 e `react-native-worklets` já fazem parte da base.
- MaterialIcons já é a família de ícones predominante. Existem ilustrações SVG lineares próprias para temas de busca e pequenos tratamentos visuais em cartões.
- Há animações pontuais em feedbacks, progresso, transições e no ícone de sequência. A linguagem de movimento ainda não está documentada como um sistema comum.
- Cores semânticas de interface, temas claro/escuro e cores de gêneros bíblicos já estão definidos em `tailwind.config.js`.
- O leitor recebeu melhorias de hierarquia, seleção de versículos e controles. O texto bíblico deve continuar sendo o elemento visual dominante; ornamentos não devem competir com sua leitura.
- A auditoria visual manual está em andamento: Home, Descubra, Leitor e Planos foram observados em combinações mobile e desktop; a matriz registra cada combinação, sem extrapolar o que ainda não foi conferido.
- O projeto já registrou preocupação com fontes de imagem não controladas. Não usar imagens aleatórias ou remotas sem curadoria, procedência, licença e comportamento offline definidos.

## Decisões de linguagem visual

### Ícones e símbolos

1. Manter MaterialIcons como família padrão de interface. Não misturar famílias de ícones sem uma lacuna concreta e revisão de consistência.
2. Criar uma pequena camada compartilhada para tamanhos, cores semânticas e apresentação de ícones, sem encapsular cada ocorrência mecanicamente.
3. Usar escala inicial de 16 px para apoio inline, 20 px para controles compactos e 24 px para ações primárias/navegação. Ajustar com base nas capturas reais.
4. Preservar rótulo textual em ações importantes. Ícone isolado só quando for convencional, tiver nome acessível claro e alvo de toque confortável (mínimo recomendado de 44×44 dp).
5. Símbolos de gênero ou tema devem complementar texto/rótulo. Cor nunca deve ser a única forma de indicar categoria, estado, seleção ou progresso.
6. Estender a linguagem SVG linear existente apenas para um conjunto coeso de temas, gêneros e estados vazios. Manter traço, cantos, proporções e paleta compatíveis com o design atual.
7. Evitar emojis como substitutos de ícones de produto e evitar decoração dentro dos parágrafos bíblicos.

### Imagens e ilustrações

1. Usar imagens em locais com função editorial ou de orientação: destaque do dia, capa de plano/resumo, onboarding e estados vazios que ganham clareza com uma metáfora visual.
2. Preferir ilustrações originais em SVG quando a imagem fotográfica não acrescentar contexto útil. Reservar fotografia para casos em que ela realmente melhore a experiência.
3. Cada ativo deve ter fonte/autoria, licença, descrição alternativa, dimensões e plano de substituição registrados.
4. Armazenar ativos selecionados no projeto, com tamanhos e formatos adequados. Definir proporção de exibição, placeholder e alternativa offline; nenhuma tela crítica deve depender de uma imagem remota aleatória.
5. Preservar o cartão de versículo do dia como opção tipográfica/gradiente. Imagem não deve reduzir contraste nem competir com o versículo.
6. Não introduzir biblioteca de imagens ou dependência de rede antes de demonstrar necessidade e impacto no bundle.

### Movimento e animações simples

1. Definir tokens documentados para duração e curva: feedback rápido de toque, mudança de estado curta e expansão/entrada moderada. Validar valores em dispositivo; evitar durações longas e movimento ornamental contínuo.
2. Priorizar `opacity` e `transform` para feedback. Reservar animação de layout para expansões pontuais, evitando recalcular listas extensas durante rolagem.
3. Usar a infraestrutura instalada (Animated, LayoutAnimation e Reanimated) conforme a necessidade da interação. Não adicionar outra biblioteca por conveniência.
4. Animar apenas quando o movimento tornar a ação ou mudança de estado mais compreensível: pressionar, selecionar/remover grifo, salvar, concluir item, revelar conteúdo ou atualizar progresso.
5. Evitar loops infinitos por padrão. Revisar o pulso existente do FogoStreak para oferecer apresentação estática quando animações reduzidas estiverem habilitadas.
6. Incluir estratégia de movimento reduzido para componentes animados: consultar preferência disponível por plataforma, reduzir/desativar movimentos não essenciais e manter o estado final compreensível.
7. Animação não pode ser o único sinal de sucesso, erro, seleção ou carregamento; manter feedback visual/textual acessível.

## Mapa por superfície

| Superfície | Melhoria proposta | Limite de design |
|---|---|---|
| Início | Uniformizar ícones de navegação/ações; diferenciar visualmente versículo do dia, plano em andamento e atividade; microfeedback ao concluir ou retomar. | Preservar leitura rápida e não aumentar a densidade de cards sem necessidade. |
| Descubra e Busca | Consolidar ícones de tema e filtros; completar família SVG para estados sem resultado quando isso ajudar a orientar o próximo passo; feedback curto ao selecionar filtro. | Resultados e texto continuam mais importantes que ilustração. |
| Seleção de livro/capítulo | Aplicar símbolos de gênero já previstos com rótulo e paleta consistente; refinar estado ativo, testamento e progresso de leitura. | Não depender só da cor ou obrigar interpretação de símbolo abstrato. |
| Leitor bíblico | Polir seleção/grifo, toolbar, progresso e transições entre capítulos; revisar ícones de ações e feedback de salvamento. | Não colocar imagem decorativa atrás do texto nem animar o corpo dos versículos. |
| Versículo do dia | Criar variações controladas de fundo/ilustração e garantir contraste em claro/escuro e na imagem exportada. | Manter alternativa tipográfica; usar somente ativos editoriais aprovados. |
| Resumos e Planos | Capas/símbolos por categoria, distinção clara entre tipo e estado, indicador de progresso com feedback discreto. | Evitar capas genéricas repetidas que não informam conteúdo. |
| Salvo e coleções | Padronizar ações salvar, remover, editar e seleção em lote; estado vazio com ação útil; feedback de desfazer sem movimento excessivo. | Rótulos continuam disponíveis para ações pouco óbvias e ações destrutivas. |
| Perfil, estatísticas e configurações | Unificar ícones funcionais, estados de controles e símbolos de conquistas; oferecer movimento apenas para progresso/conclusão significativa. | Evitar gamificação visual que pressione ou distraia o uso devocional. |
| Onboarding | Usar uma sequência curta de ilustrações originais para explicar valor e controles, com transição simples e possibilidade de pular. | Não atrasar acesso ao conteúdo nem exigir animação para entender as telas. |

## Etapas do plano

### A — Auditoria visual e inventário de linguagem (P0)

**Objetivo:** estabelecer baseline e identificar inconsistências antes de criar mais elementos.

**Tarefas:**

- **A.1** Registrar a referência aprovada como direção visual e separar elementos desejados dos elementos meramente ilustrativos do mockup.
- **A.2** Inventariar por rota o uso de MaterialIcons, SVG, emoji, imagens, gradientes, tokens de cor e animações; anotar componente responsável e exceções.
- **A.3** Conferir quais fontes, pesos, raios, sombras, espaçamentos e larguras de coluna já existem. Não trocar tipografia global sem evidência e decisão específica.
- **A.4** Definir uma amostra vertical de maior prioridade: Início, Leitor, Descubra e Planos; incluir Salvos/Resumos em segundo grupo.
- **A.5** Fazer captura de referência em 375×812 e 1440×900, tema claro/escuro, para as quatro telas principais; registrar dados e estado para repetir.
- **A.6** Expandir para os outros tamanhos da matriz somente onde o layout realmente muda. A matriz completa (5 viewports × 2 temas × múltiplas rotas/estados) é cobertura de saída, não gate para começar qualquer correção.
- **A.7** Abrir achados com rota, estado, viewport, passo de reprodução, evidência, severidade, impacto e critério de correção.
- **A.8** Fechar uma página curta de referência visual com decisões observadas e ainda abertas.

**Aceite:** baseline com capturas reais; inventário vinculando telas a elementos; P0/P1 separado de oportunidades cosméticas. As capturas finais das quatro telas devem ser comparadas com a referência aprovada em layout mobile; registrar diferenças intencionais por plataforma. Não declarar auditoria feita com base apenas na leitura de código.

**Bloqueio:** se app/navegador não puder ser aberto, concluir A.1–A.4 pela inspeção estática, mas manter baseline/validação visual explicitamente bloqueados; não inventar achados visuais.

### B — Sistema de ícones e símbolos (P0)

**Objetivo:** tornar as ações reconhecíveis e reduzir inconsistências.

**Tarefas:**

- **B.1** Mapear por ação os nomes acessíveis, o ícone atual e o estado selecionado; identificar ícones ambíguos ou inconsistentes.
- **B.2** Definir tamanhos ópticos e tokens semânticos com base em tela real. A escala de 16/20/24 px é hipótese inicial, não contrato inflexível.
- **B.3** Verificar contraste e affordance das variantes normal, pressionado, selecionado, desabilitado e foco; definir diferença de forma além de cor.
- **B.4** Confirmar rótulo/nome acessível, foco por teclado/web e alvo mínimo para cada controle iconográfico.
- **B.5** Harmonizar apenas os ícones repetidos de navegação e ações frequentes; manter exceções que tenham função ou padrão de plataforma válido.
- **B.6** Validar a primeira rodada em Início, Busca e Leitor em tela estreita e larga antes de propagar.

**Aceite:** não há família visual conflitante sem justificativa; ícones críticos têm nomes/ações compreensíveis; estados selecionados e desabilitados não dependem exclusivamente de cor; a inspeção em 320 px não revela sobreposição.

### C — Ilustrações editoriais e estados sem conteúdo (P1)

**Objetivo:** usar imagens vetoriais simples para explicar categorias e orientar estados vazios.

**Tarefas:**

- **C.1** Escolher um único piloto (preferência: vazio de Busca ou capa/símbolo de Plano) e validar a utilidade com a tela real.
- **C.2** Criar ficha do ativo: função, significado, proporção, paleta claro/escuro, descrição acessível/decorativa e tamanho de arquivo.
- **C.3** Reaproveitar traço/proporção dos SVG temáticos atuais; validar em Android, iOS e web quando aplicável.
- **C.4** Conferir que a ação recomendada no estado vazio é visível e funciona sem a ilustração.
- **C.5** Só expandir o catálogo após aprovação do piloto visual/editorial.

**Aceite:** cada ilustração tem função e descrição documentadas; permanece nítida em telas de densidades diferentes; estado e ação continuam compreensíveis sem a ilustração.

### D — Imagens e tratamento de cartões (P1)

**Objetivo:** enriquecer destaques específicos mantendo controle editorial, leitura e desempenho.

**Tarefas:**

- **D.1** Usar a ilustração local do cartão do dia como primeiro alvo conceitual; comparar imagem/ilustração com o tratamento tipográfico/gradiente atual.
- **D.2** Escolher um segundo piloto entre capa do Plano ou Resumo; não alterar ambos ao mesmo tempo.
- **D.3** Definir crop, proporção, overlay, texto alternativo, placeholder, modo escuro, offline e eventual exportação/compartilhamento.
- **D.4** Criar ativos próprios/curados somente após estabelecer autoria e direito de uso; não puxar imagens aleatórias da internet.
- **D.5** Medir tamanho total acrescentado e renderização em aparelho; manter substituto leve se imagem falhar.
- **D.6** Aprovar conteúdo/copy junto com a imagem e corrigir todos os textos do conceito para copy final em português natural.

**Aceite:** cada ativo está versionado e licenciado/documentado; não há dependência de serviço aleatório; texto legível em claro/escuro e offline; peso/performance medidos antes e depois.

### E — Sistema de microanimações e movimento reduzido (P1)

**Objetivo:** comunicar causa e resultado de interações com movimento curto, consistente e opcional quando decorativo.

**Tarefas:**

- **E.1** Inventariar animações existentes e testar se continuam úteis em loop/sem loop.
- **E.2** Especificar estado inicial/final, duração-alvo, easing, distância e fallback estático antes de escrever cada animação.
- **E.3** Implementar um piloto em ação de salvar e um em progresso/conclusão; evitar animar corpo de texto e listas durante scroll.
- **E.4** Escolher o mecanismo com base na animação real e na API suportada no Expo 57; Reanimated 4.5.1 e Worklets já estão instalados, portanto outra dependência não é pressuposto.
- **E.5** Confirmar como preferência de movimento reduzido será obtida em cada plataforma antes de fixar a solução. A doc do Reanimated cobre instalação/uso, mas não deve ser tratada como definição suficiente de política de acessibilidade.
- **E.6** Conferir interação rápida repetida, interrupção/desmontagem da tela, listas e estado final sem animação.
- **E.7** Só expandir para troca de capítulo e onboarding se o piloto trouxer ganho claro sem reduzir a sensação de leitura estável.

**Aceite:** cada animação explica uma transição, não bloqueia entrada, mantém desempenho percebido e tem comportamento documentado com movimento reduzido; nenhum loop decorativo fica obrigatório.

### F — Revisão de qualidade e consolidação (P0 para fechar o ciclo)

**Objetivo:** verificar a experiência integrada, não só componentes isolados.

**Tarefas:**

- **F.1** Repetir capturas pareadas com os mesmos dados, viewport, tema e estado do baseline.
- **F.2** Conferir rótulos/nomes, alvos, foco, contraste, zoom/fonte ampliada, VoiceOver/TalkBack/NVDA conforme plataforma disponível.
- **F.3** Verificar fallback offline e texto legível para cada imagem selecionada.
- **F.4** Confirmar que a versão sem movimento preserva estado e confirmação de ação.
- **F.5** Revisar foco visual do leitor em tela estreita e larga; recusar decoração que prejudique leitura.
- **F.6** Atualizar inventário e reportar explicitamente qualquer plataforma ou tecnologia assistiva não coberta.

**Aceite:** nenhum P0/P1 visual novo; telas prioritárias aprovadas nos viewports aplicáveis; pendências externas identificadas claramente em vez de marcadas como aprovadas.

## Priorização

### P0 — primeiro ciclo

- Baseline e inspeção visual real de telas prioritárias.
- Consistência de ícones existentes e legibilidade/nome acessível.
- Correções de contraste, alvos, foco e overflow encontrados na auditoria.
- Estratégia de movimento reduzido para animações existentes ou novas.

### P1 — enriquecimento controlado

- Expandir ilustrações SVG de tema/gênero/estados vazios com evidência de necessidade.
- Aprimorar cartões editoriais e adicionar ativos locais curados onde agreguem contexto.
- Microanimações de salvar, seleção e progresso.

### P2 — opcional após validação

- Mais variações artísticas por categoria, personalização visual e transições mais sofisticadas.
- Experimentos com fotografia ou motion mais expressivo, sujeitos a revisão editorial, acessibilidade e desempenho.

## Critérios globais de qualidade

- A leitura bíblica permanece confortável, rápida e visualmente dominante.
- Semântica e rótulos sobrevivem sem cor, imagem ou animação.
- Áreas de toque, foco visível, contraste e texto ampliado são verificados nas telas afetadas.
- Componentes e ativos funcionam em claro/escuro e não dependem de conexão permanente.
- SVG informativo possui descrição; arte decorativa não polui a árvore acessível.
- Imagens têm origem/direito documentados, alternativa textual e fallback.
- Animações são breves, funcionais e compatíveis com movimento reduzido.
- Não se instala uma nova dependência sem necessidade demonstrada e comparação com o que já está no projeto.
- Capturas de antes/depois usam a mesma rota, viewport, tema, dados e estado de interface.

## Dependências e bloqueios conhecidos

- A inspeção visual depende de navegador/dev-server e de dados reproduzíveis; já há inspeção parcial em navegador real, mas vários viewports, estados e superfícies seguem pendentes na matriz.
- Leitores de tela, comportamento de movimento reduzido e desempenho nativo precisam de dispositivo/build apropriado para aceite completo.
- A escolha de novas imagens depende de definição editorial e documentação de direitos; sem isso, os cartões permanecem com ilustração/tipografia local já controlada.
- O Expo SDK 57 e as versões presentes no `package.json` devem ser considerados ao selecionar APIs. A documentação oficial exata é `https://docs.expo.dev/versions/v57.0.0/`; não presumir que instruções de outra versão se apliquem.

## Revisão crítica do plano — riscos e decisões para não deixar implícitas

1. **Escopo visual amplo:** adicionar ícones, arte, fotos, tokens e movimento ao mesmo tempo pode tornar o resultado mais carregado e dificultar descobrir qual mudança ajudou. Mitigação: baseline primeiro, um piloto por categoria e comparação antes de ampliar.
2. **Mockup mais específico do que o sistema atual:** a referência aprovada define a direção visual final, mas algumas palavras/controles nela são ilustrativos. Mitigação: aproximar layout, composição e hierarquia do mockup, preservar funcionalidades existentes, substituir textos ilustrativos por conteúdo real e registrar diferenças que sejam exigidas pela plataforma.
3. **Alegação de cobertura impossível de cumprir:** cinco viewports, dois temas, muitas rotas e estados geram dezenas de combinações. Mitigação: grupo representativo como gate de cada incremento; cobertura completa por risco no fechamento, registrando casos bloqueados.
4. **Contraste e paleta ainda não quantificados:** as cores existentes por gênero não garantem por si só contraste de texto ou ícone em todos os fundos. Mitigação: medir combinações concretas e ajustar tokens/contorno, sem assumir que paleta decorativa é paleta de texto.
5. **Fonte da imagem não definida:** “curada” ainda não identifica autor, licença, estilo e processo de aprovação. Mitigação: começar por ilustração original local de baixo risco e manter o card tipográfico até houver ativo aprovado.
6. **Comportamento divergente entre web e native:** ícones, foco, hit target, movimento reduzido, crop e compartilhamento podem variar. Mitigação: critérios de aceite separados por plataforma; não afirmar paridade com captura web apenas.
7. **Acessibilidade de ícones:** definir ícone + nome não resolve sozinho ordem de leitura, estado de seleção ou ação customizada. Mitigação: escrever role/label/hint/state esperado na ficha de componentes e validar tecnologias assistivas.
8. **Tokens de animação prematuros:** durações e easing numéricos sem protótipo/dispositivo são falsa precisão. Mitigação: os valores são escolhidos depois do piloto, registrados com fallback reduzido e revisados em aparelho.
9. **Dependência potencial de assets/fontes e bundle:** imagens e fontes novas podem afetar desempenho e build web/nativo. Mitigação: não selecionar fonte nova por mockup; medir bytes e renderização dos ativos antes de aceitar.
10. **Conteúdo/copy no mockup:** qualquer texto gerado em imagem pode conter erro ou não refletir conteúdo oficial. Mitigação: imagens de prévia servem como referência visual; conteúdo bíblico final precisa vir do acervo aprovado, sem transcrever texto renderizado pelo mockup.
11. **Estado de partida alterado:** existem muitas modificações em andamento no checkout. Mitigação: manter esta revisão em documento próprio e, na implementação, inspecionar o diff e preservar todas as mudanças não relacionadas.

### Decisões já fixadas nesta revisão

- A referência aprovada é o alvo visual do resultado final, não somente uma inspiração; as telas reais devem se aproximar de sua composição e hierarquia em incrementos comparáveis, com adaptações justificadas por conteúdo, acessibilidade e plataforma.
- O leitor permanece texto-primeiro, sem fotografia/ilustração de fundo.
- Primeiro ciclo proposto: auditoria representativa; consistência dos ícones frequentes; um piloto ilustrativo; até dois cartões; duas microanimações com alternativa reduzida.
- Não adicionar dependência, família de ícones, fonte tipográfica ou imagens remotas como pressuposto.
- O usuário aprovou a execução visual; continuar em mudanças pequenas, anotar a evidência e não tratar a inspeção parcial como aceite final.

## Status de execução e fila revisada — 2026-09-28

| Etapa | Estado | Evidência / restante |
|---|---|---|
| A — Auditoria visual | Parcial | Home, Descubra, Leitor e Planos inspecionados em web desktop a 1280×900 nos temas claro e escuro; não houve overflow horizontal. Mobile adiado pelo usuário; seguem pendentes foco/teclado e fluxos específicos fora das telas prioritárias. |
| B — Ícones e símbolos | Parcial | MaterialIcons continuam como padrão de ações; recomendações e temas mantêm descrições textuais. Falta auditoria completa de foco/teclado, alvos e contraste. |
| C — Ilustrações | Parcial | SVG panorâmico do versículo por período e desenho original de livros/ramo em Planos; categorias seguem com line art, menos detalhado que a referência. Falta melhorar algumas cenas e validar amanhecer/tarde em capturas controladas. |
| D — Cartões e imagens | Parcial | Home com composição ampla e recomendações temáticas; Planos com destaque editorial e grid. Sem fotos remotas; SVG local controla licença e offline. Ainda há distância para as ilustrações mais ricas da referência. |
| E — Movimento | Em andamento | O fogo da sequência respeita movimento reduzido; o ícone de salvar do versículo do dia recebeu pulso curto de escala, também desativado quando a preferência está ativa. Inspeção web confirmou alternância de salvo, sem persistir o estado temporário. Falta piloto de progresso e validação nativa da preferência. |
| F — Qualidade | Parcial | Typecheck, 34 contratos de acessibilidade, 7 superfícies estruturais de UI, diff check e inspeções web foram executados. Sem validação em aparelho/leitor de tela e sem suítes de teste neste recorte. Avisos existentes de estilos de sombra RN Web e notificações web seguem para avaliação futura. |

**Próxima execução:** seguir a prioridade desktop-first acima e atualizar a matriz para separar claramente o que esta rodada cobre do mobile adiado. Revisão nativa e de tecnologias assistivas continua fora do aceite web.

## Registro do primeiro incremento — 2026-09-28

- Auditoria parcial real em 1280×720: Início em claro/escuro; Descubra, Leitor e Planos em claro. Ver achados e limites em `docs/matriz-auditoria-responsiva.md`.
- Início: saudação contextual e cena vetorial local de amanhecer sobre colinas no Versículo do Dia (sem moldura de ícone); altura fixa removida em favor de altura mínima.
- Leitor: reserva de espaço para a navegação fixa do capítulo, impedindo que a pílula cubra versículos; setas substituídas por chevrons MaterialIcons e alvos de 44 px.
- Planos: ícones que distinguem os planos de Evangelhos e Sabedoria; botão Voltar alinhado aos ícones e área mínima de toque.
- Incidente detectado durante captura: atributo decorativo foi inicialmente encaminhado de forma inválida ao DOM; corrigido com `aria-hidden` e sem repetição do aviso na captura seguinte.
- `npm run typecheck` passou após os recortes. Nenhuma suíte de testes foi executada.
- Pendente: viewports mobile/tablet, Busca com interação, estados de seleção/foco do leitor, leitores de tela e validação nativa. O primeiro incremento não fecha a auditoria completa nem autoriza expandir animações e imagens fotográficas.

**Próximo passo histórico:** configurar um viewport mobile isolado — concluído no incremento seguinte; veja abaixo a matriz atualizada. A arte do cartão do dia é uma ilustração SVG de paisagem (não ícone/fotografia), variável por período; não há ativos remotos ou dependência nova.

### Incremento seguinte — Home e alinhamento com a referência (2026-09-28)

- Atualizada a cena do Versículo do Dia para variar com a mesma faixa horária da saudação: manhã (5h–11h59), tarde (12h–17h59) e noite (18h–4h59). O estado se atualiza ao voltar ao app/aba e a cada minuto.
- Refinado o cartão “Estudo por Resumos” com rótulo de seção, hierarquia tipográfica, progresso mais legível, semântica de barra de progresso e símbolo menos dominante, preservando a paleta quente.
- Na inspeção da Home em 375×812, o layout da saudação, do versículo, do cartão de progresso e da navegação permaneceu legível; os emojis de medalhas foram identificados como desvio secundário e substituídos por MaterialIcons mapeados por tipo de conquista, compartilhados entre Home, Perfil e tela Medalhas.
- Verificação estática: `npm run typecheck` passou; inspeção visual confirma lua/estrelas no desktop noturno e Home mobile em 375×812, incluindo cartões e medalhas. Estados manhã/tarde e tema escuro mobile ainda precisam de captura dedicada.
- Próximo foco histórico: validar ícones e comparar Descubra, Leitor e Planos em mobile — avançado no incremento de auditoria e qualidade abaixo.

### Incremento — inspeção responsiva e qualidade de código (2026-09-28)

- Em 320×800, tema escuro, conferidos Home, Descubra, Leitor, lista e detalhe de Plano; em tema claro, Leitor, Perfil e Medalhas. Em 375×812, Home, Descubra, Leitor e Planos foram conferidos em claro/escuro; buscas por “esperança” exibiram 50 resultados após carregamento. A lista de Planos truncava descrições em duas linhas; ampliada para três e conferida no mesmo viewport.
- No Leitor, inspeção rolada encontrou `Animated.View` com fundo transparente no DOM web apesar das classes NativeWind. Fundo e borda explícitos por tema foram adicionados para impedir texto atrás dos controles.
- O pulso do FogoStreak passou a respeitar `AccessibilityInfo.isReduceMotionEnabled` e mudanças de preferência; inicia estático por segurança até a leitura da preferência e continua estático se a consulta falhar.
- A ação “Amém” recebeu um pulso de escala curto no ícone (100 ms de ida + 130 ms de retorno), sem animar o texto bíblico. O estado de movimento reduzido mantém o ícone estático. A interação web foi conferida e desfeita na origem isolada `localhost`.
- O placeholder de Busca foi encurtado para “Buscar na Bíblia e nos resumos”, evitando truncamento visual em mobile.
- Verificações finais desta rodada: `npm run typecheck` passou; `npm run check:a11y` conferiu 34 contratos críticos; `npm run check:ui` conferiu 7 superfícies; `git diff --check` passou sem erros de whitespace (o Git reportou apenas avisos de normalização LF/CRLF nas mudanças existentes).
- Pendências: viewports restantes, tema claro a 320 px em superfícies ainda não cobertas, estados de planos concluídos, validação nativa e leitores de tela. Perfil e Medalhas foram conferidos em ambos os temas nos registros da matriz.

### Incremento — microfeedback e fechamento de QA web (2026-09-28)

- A preferência de movimento reduzido foi extraída para `useMovimentoReduzido`, compartilhada entre o fogo da sequência e a ação de salvar. A consulta começa no estado estático e acompanha alterações da preferência do sistema.
- Verificação funcional em web: “Amém” alterna para salvo e retorna ao estado inicial após desfazer; tema claro foi restaurado ao final na origem isolada.
- Em seguida às mudanças finais, `npm run typecheck`, `npm run check:a11y` (34 contratos), `npm run check:ui` (7 superfícies) e `git diff --check` passaram. O diff check reportou somente avisos de normalização LF/CRLF do Git.
- QA do console: nenhum erro; permanecem avisos de compatibilidade para propriedades `shadow*`/`textShadow*` no React Native Web e aviso do módulo de notificações web sobre listener de token push sem suporte/efeito nessa plataforma. Não foram introduzidas novas dependências.
- O console também revelou o aviso de `useNativeDriver` não suportado no web ao executar o piloto; o piloto foi ajustado para usar o driver JS no web e o driver nativo em iOS/Android. O log do navegador é cumulativo e a interação deixou de responder após HMR, portanto o desaparecimento do aviso só pode ser considerado confirmado após recarga e nova interação.
- Limites: o piloto de animação não foi medido em aparelho; a preferência reduzida não foi alternada em ambiente nativo; leitor de tela e suíte Jest permanecem fora desta rodada.

## Incremento — aproximação desktop da referência (2026-09-28)

- Por nova orientação do usuário, a rodada de implementação passou a priorizar web desktop (≥1024 px); avaliação e refinamento mobile ficam adiados. A referência anexada é tratada como alvo de composição/linguagem visual, não como fonte de conteúdo bíblico ou instruções literais.
- Descubra: área central ampliada, título serifado editorial, busca com ícone, cards neutros de tema em quatro colunas e descrições curtas. Os atalhos indisponíveis deixam de ocupar o topo no desktop; Planos continua acessível pelo cabeçalho. O desenho dos cards e a hierarquia de texto em mobile ficam preservados nesta rodada.
- Início: composição desktop em duas colunas; a paisagem vetorial do cartão do dia ganha formato panorâmico e continua variando com manhã/tarde/noite; a coluna lateral reúne progresso e conquistas. Três temas existentes aparecem como recomendações (“Para o seu dia”) e direcionam à categoria e às passagens já curadas, sem criar conteúdo bíblico novo.
- Planos: destaque editorial ilustrado para a Semana da Sabedoria, cards de catálogo em duas colunas e arte SVG local de livros/ramo. A tela de detalhe reutiliza a arte e limita a largura da sequência de dias para manter leitura confortável.
- Leitor: título de capítulo serifado em desktop e números dos versículos em acento terroso; o texto mantém a preferência de fonte escolhida pela pessoa. Não foram acrescentados ornamentos sobre o corpo bíblico.
- Inspeção visual em 1280×900, temas claro e escuro: Home, Descubra, lista/detalhe de Planos e Leitor. Fluxo de tema “Esperança” foi conferido até as passagens bíblicas carregarem; nenhuma das telas inspecionadas apresentou overflow horizontal.
- Correção durante QA: props de acessibilidade de React Native que estavam sendo encaminhadas diretamente ao SVG foram removidas; as áreas que contêm arte decorativa a ocultam no contêiner. O erro registrado no console antecede a correção e o recarregamento subsequente renderizou o destaque de Plano sem overlay de erro.
- A revisão final também detectou uma referência de cor a uma variável ausente na seta da CTA de Planos; substituída por classes semânticas claro/escuro antes da última rodada de verificações.
- Verificações após os recortes: `npm run typecheck`, `npm run check:a11y` (34 contratos), `npm run check:ui` (7 superfícies) e `git diff --check` passaram. A revalidação visual do pulso ao salvar após recarga do bundle continua pendente.
- Fora do escopo deliberado desta rodada: telas mobile, validação nativa e conteúdo mobile em breakpoint estreito.

### Continuação — ilustrações de Descubra (2026-09-28)

- Atualizadas as oito artes dos temas de busca de pictogramas lineares para mini cenas vetoriais editoriais: paisagem, folhagem, luz, fogo e livros, compostas com formas locais e paleta terrosa.
- Inspeção em navegador encontrou a grade desktop confinada por engano ao `max-w-2xl` do fluxo estreito, embora o cabeçalho já usasse largura ampla. O container da grade agora acompanha `max-w-6xl` no desktop; as artes foram ampliadas e os cards ganharam altura para preservar o respiro do texto.
- A inspeção de contraste detectou “Sabedoria” a 2,42:1 no tema claro. O tom foi escurecido para `#806000` (5,76:1 sobre o fundo do card); os demais títulos claros ficam entre 5,22:1 e 7,13:1, e os títulos escuros entre 7,58:1 e 9,55:1 sobre o fundo atual.
- Mantidos os rótulos, descrições, rotas e conjuntos de referências curadas existentes. Não foram usados textos bíblicos da imagem de referência, assets remotos ou novas dependências.
- A ilustração continua sendo decorativa; o card preserva nome acessível e conteúdo textual como fonte de significado. O nome acessível agora anuncia também a descrição. O desenho usa viewBox panorâmico para se encaixar melhor nos cards de Descubra.
- Inspeção visual no navegador confirmou as oito cenas em tema claro e escuro e a nova largura da grade, sem corte de arte ou overflow horizontal aparente.
- Verificação: `npm run typecheck`, `npm run check:a11y` (34 contratos), `npm run check:ui` (7 superfícies) e `git diff --check` passaram. Mobile, aparelhos e leitores de tela continuam fora do aceite desta etapa.
- A cena editorial agora é selecionada apenas em Descubra desktop; o pictograma compacto anterior é mantido no layout estreito enquanto a etapa mobile segue adiada.
- Planos: o destaque passou a mostrar uma pilha de livros e ramo vetoriais locais. A primeira captura encontrou o ramo sobre as páginas; a ordem das camadas foi corrigida para manter a arte botânica ao fundo. Inspecionada em claro e escuro.
- Home: as três recomendações “Para o seu dia” trocaram os mini ícones em quadrados por cenas SVG maiores, sem alterar o layout mobile (a seção só aparece no desktop). A captura atual mostra a cena noturna correspondente a “Boa noite”.
- Home: o cartão “Estudo por Resumos” usava o marrom mais saturado da paleta no tema claro, destoando das superfícies creme da referência. A superfície clara agora usa `cor-destaque-fundo`, com tipografia escura, barra de progresso e ícone em tons terrosos; no tema escuro permanece o acento dourado com texto escuro.
- A prévia da paisagem agora pode ser controlada no Expo Web de desenvolvimento por `?previewPeriodo=manha|tarde|noite`. O parâmetro aceita somente esses três valores, não altera o relógio nem as builds de produção e permite revisar saudação e arte juntas.
- Paisagem panorâmica: adicionados raios solares e silhuetas de árvores em SVG local; amanhecer, tarde e noite continuam usando a mesma moldura, com posição do sol/lua e paleta próprias. A captura clara da manhã confirmou a composição e a nova hierarquia do cartão de jornada.
- Leitor: ao selecionar versículos no desktop, a barra antes ocupava toda a largura da tela. Ela agora se apresenta como painel flutuante compacto centralizado, com ações em ícones acessíveis; grifos, salvar, anotação, cópia, compartilhamento e imagem foram preservados. A captura em tema escuro confirmou o estado selecionado e seus nomes acessíveis.
- Leitor: a dica contextual de primeira visita empurrava o início do capítulo para baixo e competia com o texto. Ela permanece no fluxo estreito, mas não aparece no desktop; a captura confirmou os primeiros versículos logo abaixo do cabeçalho e manteve a largura confortável de leitura.
- A preferência de fonte do leitor continua sendo respeitada. A comparação com a referência em serifada foi feita sem substituir a escolha salva da pessoa; a preferência usada para inspeção foi restaurada.
- Próximo refinamento desktop: revisar a hierarquia editorial do cabeçalho do Leitor e estados de seleção/foco, preservando largura de leitura, controles existentes e preferência tipográfica. Mobile continua adiado.

## Referências do projeto e plataforma

- Roadmap atual: `PLANO-MESTRE-UX-ETAPAS-19-A-23.md`.
- Matriz de inspeção: `docs/matriz-auditoria-responsiva.md`.
- Inventário de estados: `docs/inventario-estados-ui.md`.
- Tokens: `tailwind.config.js`.
- Documentação Expo versionada exigida pelo projeto: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [Reanimated no SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/).
