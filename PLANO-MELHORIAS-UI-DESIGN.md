# Plano de melhorias de interface e design

## Propósito

Deixar a plataforma bíblica mais reconhecível, clara e acolhedora, ampliando o uso de ícones, símbolos, ilustrações, imagens e animações curtas. A identidade deve continuar serena e centrada na leitura, com comportamento coerente entre web e aplicativo, nos temas claro e escuro e em telas pequenas.

Este documento reúne o plano de execução e um registro incremental do que já foi feito. O trabalho deve avançar por entregas pequenas, com comparação visual antes/depois e critérios objetivos de aceite.

## Direção aprovada para o conceito visual

A referência visual criada nesta conversa foi aprovada como **alvo visual do resultado final**, incluindo a composição das quatro telas mostradas (Início, Descubra, Leitor e Planos): interface editorial acolhedora, fundo quente, acentos terrosos/dourados, cartões com respiro, ilustrações de cena, ícones lineares coerentes e microinterações discretas. O objetivo é aproximar o front-end real dessa composição e hierarquia a cada incremento, adaptando dimensões e navegação às plataformas e mantendo as funções e conteúdos do produto. Cada rodada deve registrar diferenças visíveis restantes e escolher a próxima correção que mais reduza a distância para a referência.

A imagem não é especificação pixel a pixel: textos renderizados nela podem conter imprecisões e não devem virar conteúdo do produto. As proporções e a composição servem de referência para o resultado; medidas finais são acertadas no app em cada breakpoint. O cartão do Versículo do Dia usa uma **ilustração de paisagem vetorial**, sem moldura de ícone; a cena muda com a saudação (amanhecer, tarde ou noite) sem abandonar o estilo aprovado. Imagens e ilustrações não substituem nem encobrem o conteúdo bíblico.

### Prioridade ajustada pelo usuário — web responsiva, nativo depois

O produto em foco é a aplicação web, e ela deve funcionar bem em larguras estreitas e amplas. Toda mudança compartilhada de interface precisa considerar responsividade e ser verificada nos breakpoints afetados; mobile web não é uma etapa futura separada. A construção e o refinamento da aplicação como produto mobile nativo (iOS/Android), incluindo validação específica em aparelhos, ficam para depois. A captura anexada nesta rodada é uma referência visual e de composição, não uma fonte de instruções de produto nem de copy bíblica. Usar no código somente conteúdo editorial já aprovado no acervo ou copy de interface escrita para a função real.

**Sequência da rodada:** (1) estabelecer hierarquia editorial em tela ampla sem quebrar as telas estreitas; (2) enriquecer Descubra com cards ilustrados e descrições úteis; (3) tornar Planos uma vitrine editorial com progresso destacado; (4) reorganizar Início em composição ampla com destaque ilustrado e próximos passos; (5) revisar o Leitor preservando texto-primeiro e foco; (6) validar a aplicação web responsiva em claro/escuro e atualizar matriz. O aplicativo nativo fica fora desta sequência.

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

1. Usar Phosphor como família padrão da interface, com ícones vetoriais em uma linguagem editorial mais expressiva e pesos coerentes entre estados. O piloto técnico confirmou compatibilidade com a stack atual via `react-native-svg`.
2. Centralizar o mapeamento em `components/icone/IconeUI.tsx`, importar cada desenho pelo subcaminho específico e expor nomes/tipos de produto para que telas não dependam da biblioteca diretamente.
3. Usar escala inicial de 16 px para apoio inline, 20 px para controles compactos e 24 px para ações primárias/navegação. Ajustar com base nas capturas reais.
4. Preservar rótulo textual em ações importantes. Ícone isolado só quando for convencional, tiver nome acessível claro e alvo de toque confortável (mínimo recomendado de 44×44 dp).
5. Símbolos de gênero ou tema devem complementar texto/rótulo. Cor nunca deve ser a única forma de indicar categoria, estado, seleção ou progresso.
6. Estender a linguagem SVG linear existente apenas para um conjunto coeso de temas, gêneros e estados vazios. Manter traço, cantos, proporções e paleta compatíveis com o design atual.
7. Evitar emojis como substitutos de ícones de produto e evitar decoração dentro dos parágrafos bíblicos.

8. Usar peso regular como base; aplicar preenchimento apenas a estados selecionados/ativos e ícones cuja semântica pede ênfase. Manter os ícones decorativos fora da árvore acessível; botões e controles devem continuar fornecendo seus próprios nomes acessíveis.

9. `phosphor-react-native` é uma adaptação comunitária do Phosphor. A dependência é aceita nesta rodada após confirmação de suporte a React 19, React Native 0.86 e `react-native-svg` já presente; manter imports diretos e revalidar build/export sempre que o pacote ou o Metro mudar.

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

**Escopo desta etapa:** aplicação web responsiva, incluindo desktop e mobile web. Mudanças em componentes compartilhados precisam preservar os dois tamanhos; implementação de padrões nativos específicos de iOS/Android não faz parte desta etapa.

**Avaliação da biblioteca atual e candidatas:**

| Opção | Ganho visual esperado | Compatibilidade/risco neste projeto | Parecer |
|---|---|---|---|
| MaterialIcons atual (`@expo/vector-icons`) | Catálogo grande e conhecido; a forma sólida/Material é familiar, mas reforça a aparência genérica relatada e não se aproxima tão bem da linguagem editorial da referência. | Já integrada, mas o guia atual do Expo informa que `@expo/vector-icons` foi depreciado e recomenda migração para `@react-native-vector-icons`. Trocar apenas o pacote manteria a linguagem visual. | Não expandir o uso; avaliar substituição visual real, não migração cosmética de pacote. |
| Lucide (`lucide-react-native`) | Traço uniforme, limpo e leve visualmente; boa legibilidade em controles pequenos. | Integra com `react-native-svg`, que já está instalado, e declara compatibilidade com React 19/RN/SVG atuais. A família é amplamente reconhecível como outline contemporâneo, então pode continuar genérica para a identidade desejada. | Candidato técnico de baixo atrito e comparação obrigatória, mas não recomendação visual automática. |
| Phosphor (`phosphor-react-native`) | Seis pesos (Thin, Light, Regular, Bold, Fill e Duotone) dão mais amplitude para uma linguagem calorosa/editorial: outline contido em ações, preenchido para seleção e duotone reservado a poucos símbolos de categoria/estado. | O pacote RN disponível é uma integração comunitária com `react-native-svg`, não um pacote publicado pelo núcleo oficial Phosphor; verificar compatibilidade real com Expo 57, Metro, tree-shaking/exportação web, tipagem, acessibilidade, licença e peso do bundle antes de adotá-lo. | Candidato visual preferencial para um piloto, condicionado à aprovação técnica e à comparação lado a lado. |
| SVGs próprios para toda a interface | Controle máximo e possibilidade de identidade exclusiva. | Custo alto de desenho, manutenção, acessibilidade e consistência em estados/tamanhos; recriar um catálogo inteiro não se justifica antes de testar famílias prontas. | Não adotar como biblioteca completa. Reservar SVG próprio para poucos símbolos de marca quando o inventário provar lacuna. |

**Recomendação provisória:** não trocar a biblioteca inteira por decisão abstrata. Fazer um piloto comparativo real com o mesmo conjunto de 8–12 ações representativas em Material, Lucide e Phosphor (por exemplo, navegação, busca, livro/Bíblia, salvar, nota, compartilhar, perfil e estados voltar/fechar). Renderizar as amostras no contexto real do produto, com a tipografia serifada, paleta terrosa, tema claro/escuro e 320/375 px e desktop. A equipe avalia qual família de fato deixa a interface menos genérica; em paralelo, um spike técnico mede pacote/exportação, árvore final do bundle, erros/avisos, primeira renderização e API acessível. A recomendação visual favorece Phosphor Regular com uso parcimonioso de Fill/Duotone, mas a migração só começa se o piloto funcionar no Expo Web e não introduzir regressão de tamanho, tema, foco ou semântica. Se a integração Phosphor não passar, comparar Lucide com uma camada pequena de SVGs distintivos antes de decidir.

**Separar migração técnica da decisão de linguagem visual:** a documentação atual do Expo recomenda sair de `@expo/vector-icons`, mas `@react-native-vector-icons` mantém famílias e aparência de cada icon pack; cumprir a recomendação de pacote não escolhe uma estética. Registrar o impacto e estratégia de fonte/pacote com base na build do projeto, sem supor que pacote SVG seja automaticamente menor. O aplicativo nativo futuro deve poder compartilhar os mesmos símbolos sem forçar dependência de SF Symbols/Material Symbols neste redesenho da web.

**Plano de execução detalhado:**

1. **B.0 — Fechar o inventário de rotas e definir amostra.** Listar Início, Descubra/Busca, Leitor, Planos, Salvos, Resumos e Perfil; marcar controles repetidos, rotas ainda sem observação visual e breakpoints realmente usados. Registrar quais telas entram no piloto e quais ficam apenas no inventário. O objetivo não é editar toda a aplicação de uma vez.
2. **B.1 — Catalogar cada ocorrência de ícone/símbolo.** Para cada controle, registrar tela/rota, ação, família e nome do ícone, tamanho/estilo, cor por tema, papel (ação, estado, categoria ou decoração), texto visível, nome acessível, destino/resultado e variante web/mobile. Incluir MaterialIcons, SVG, símbolos Unicode e emojis; separar ilustrações editoriais da família de ícones de interface.
3. **B.2 — Auditar semântica e consistência.** Agrupar ocorrências pela intenção (voltar, fechar/cancelar, busca, salvar, compartilhar, áudio, progresso, navegação, categoria etc.). Marcar como achado somente casos com evidência: mesmo ícone para ações diferentes, ações iguais representadas de forma conflitante, símbolo de estado sem estado textual/semântico, ícone visualmente enganoso, família mista sem motivo ou affordance ausente. Identificar o componente de origem e a rota de reprodução.
4. **B.3 — Priorizar por impacto e risco.** Classificar P0 para ação primária inacessível/ambígua, nome ausente, estado essencial indistinguível ou alvo/foco que impeça uso; P1 para inconsistência repetida ou difícil de descobrir; P2 para preferência cosmética sem impacto demonstrado. Ordenar por alcance de componente compartilhado, frequência e severidade; não generalizar achado de uma tela para todas.
5. **B.4 — Definir contratos visuais e semânticos.** Só após o inventário, registrar regras para família predominante, tamanhos ópticos por contexto, alinhamento com texto, peso/traço, cores semânticas, espaçamento e comportamento em tema claro/escuro. Distinguir ícone decorativo (oculto da árvore acessível) de controle iconográfico (nome de ação, papel, estado, foco visível e área clicável). A escala inicial de 16/20/24 px e o alvo de 44×44 CSS px são hipóteses a confrontar com os componentes e a inspeção real, não motivos para mudanças indiscriminadas.
6. **B.5 — Comparar famílias com o mesmo vocabulário.** Montar a folha de comparação 8–12 glyphs com tamanho, posição, fundo, rótulo e estado idênticos. Avaliar leitura em 16/20/24 px, unidade de traço, personalidade, reconhecimento, alinhamento e compatibilidade com ilustrações já existentes; não escolher só pela página de catálogo.
7. **B.6 — Cobrir estados e entrada no piloto.** Para cada controle do piloto, inspecionar normal, hover, pressionado, foco por teclado, selecionado/ativado, desabilitado e carregando quando o estado existir. Confirmar que estado importante combina forma/semântica com cor, não depende só da cor; ícones desabilitados continuam compreensíveis. Verificar Tab/Shift+Tab, Enter/Espaço e ordem/foco após ativar, conforme o tipo de controle. Não criar estados artificiais onde o produto não os tem.
8. **B.7 — Fazer spike de integração e performance antes de migrar.** Confirmar import individual e tree-shaking, licença, suporte a Expo 57/RN 0.86/React 19/Metro/React Native Web, bundle/exportação estática e fallback de renderização. Usar `react-native-svg` já instalado quando aplicável. Comparar build e primeira renderização com o baseline, sem instalar duas famílias de produção por tempo indeterminado.
9. **B.8 — Decidir e documentar a família do piloto.** Comparar o painel visual e os resultados técnicos. Escolher a família que melhora de forma perceptível a identidade, ou manter uma solução mista documentada (família funcional consistente + raros símbolos SVG próprios). Registrar aliases para navegação/ação/estado e regra de peso, tema e uso de Duotone antes de propagação.
10. **B.9 — Implementar em incrementos pequenos.** Corrigir primeiro os problemas P0, depois P1 do piloto. Manter nomes de ação e estado alinhados com o comportamento real; evitar emoji como substituto de ícone funcional, ícone sozinho sem nome acessível, SVGs duplicados e troca apenas estética sem benefício verificável. Cada recorte deve preservar navegação, persistência e conteúdo existentes.
11. **B.10 — Validar responsividade e temas.** Repetir os mesmos estados em telas estreitas e amplas, no claro e escuro, nos breakpoints tocados; usar pelo menos 320/375 px para narrow web, 768/1024 px na transição e 1440 px em desktop quando a composição variar nesses pontos. Conferir corte, sobreposição, alvo real, alinhamento texto/ícone, overflow e foco. A cobertura exata depende da geometria do componente, mas mudança compartilhada não pode ser declarada desktop-only sem isolamento explícito.
12. **B.11 — Fechar evidência e fila residual.** Atualizar inventário e matriz com captura/rota/viewport/tema/estado, checks executados, itens corrigidos e limites da inspeção. Reabrir o plano para correções de foco/contraste achadas durante a validação; encaminhar polimento P2 para depois sem bloquear P0/P1.

**Entregáveis:** inventário de ocorrências; lista priorizada de achados reproduzíveis; folha de comparação de bibliotecas no contexto real; relatório do spike técnico; decisão curta do sistema visual/semântico; piloto implementado em componente reutilizável; evidências responsivas e lista explícita de pendências.

**Aceite:** controles iconográficos críticos têm ação e nome acessíveis corretos; estados que mudam o comportamento são perceptíveis sem depender exclusivamente de cor; foco por teclado é visível e não fica preso/oculto; alvos atendem ao critério definido para a web; família e escala têm consistência ou exceção documentada; a alteração não introduz corte, colisão ou overflow nos breakpoints afetados em claro/escuro.

**Riscos e respostas:** inventário grande demais (limitar implementação ao piloto); normalizar símbolos culturais/teológicos sem contexto (manter ícones de conteúdo/editoriais fora de decisões de ação); trocar ícones por gosto (exigir evidência e ganho); testes de contraste ignorarem fundos reais (medir cada par ícone/fundo/estado/tema); corrigir desktop e quebrar mobile web (validar o mesmo componente nos breakpoints afetados); confundir iconografia web e nativa (documentar a etapa nativa como futura, sem atrasar responsividade web).

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

## Foco único da próxima rodada — Leitor bíblico desktop (2026-10-01)

**Decisão de escopo:** concentrar a próxima rodada somente no Leitor bíblico web em viewport desktop (largura a partir de 1024 px), aproximando cabeçalho, texto e ações da tela 03 da referência aprovada. Não iniciar trabalho nas outras superfícies durante esta rodada. A experiência mobile/nativa permanece adiada por decisão do usuário.

### Resultado pretendido

Uma página de leitura editorial, confortável e texto-primeiro: capítulo fácil de identificar e trocar; coluna de leitura estável; versículos, números e estados com hierarquia clara; controles discretos e acessíveis; progresso e seleção sem encobrir o texto. O tema claro deve acompanhar a paleta creme/terrosa da referência, e o tema escuro deve conservar os tokens existentes com contraste legível.

### Plano em etapas

#### Etapa 1 — Baseline e inventário da rota

1.1 **Conferir o checkout:** anotar `git status` e diff dos três alvos permitidos para esta rodada (rota do Leitor e documentos); preservar alterações preexistentes fora deles e não reformatar arquivos sem relação com o foco.

1.2 **Mapear a implementação existente:** localizar estrutura do cabeçalho, altura/rolagem animada, renderização de capítulo e versículos, estado de preferência tipográfica, progresso, barra fixa inferior, toolbar de seleção e funções de persistência. Registrar dependências entre componentes sem propor refatoração ampla.

1.3 **Fixar amostra de conteúdo:** usar Gênesis 1 como leitura representativa e Salmos 119 como capítulo longo; escolher no acervo real o livro de nome visualmente mais extenso para checar o cabeçalho. Não introduzir título, subtítulo ou texto bíblico novo.

1.4 **Capturar baseline de layout:** registrar 1280×900 e 1440×900, nos temas claro e escuro, para as duas rotas principais. Conferir 1024×900 como limite de largura em pelo menos um estado de leitura e um estado selecionado. Guardar para cada evidência: URL, dimensão, tema, tamanho/família de fonte e estado da interface.

1.5 **Capturar baseline de estados:** observar sem seleção; seleção simples; seleção múltipla; preferências serifada/sem serifa; fonte menor/maior; rolagem suficiente para recolher o cabeçalho; final do capítulo; início e fim de livro. Estados repetidos podem ser agrupados em capturas se a evidência continuar legível.

1.6 **Medir e classificar:** verificar dimensões do documento/coluna, rolagem horizontal, colisão entre cabeçalho e versículos, oclusão pela navegação/toolbar, contraste, foco e nomes acessíveis. Registrar cada problema com rota, estado, viewport, reprodução, gravidade, evidência e condição de aceite.

1.7 **Proteger dados persistidos:** não alterar preferências reais, notas, progresso, grifos ou salvos. Preferir perfil/contexto local isolado; se for inevitável alternar tema ou fonte no contexto atual, anotar o valor inicial e restaurá-lo ao final, verificando a restauração. Ações que persistem só serão exercitadas se houver contexto local descartável e limpeza comprovável; caso contrário, registrar a limitação e validar a ligação pelo código/estado visual sem simular sucesso persistente.

**Saída/gate:** matriz de baseline reproduzível, mapa curto dos componentes e lista priorizada de achados. Não iniciar ajuste cosmético antes de classificar os desvios observados.

#### Etapa 2 — Cabeçalho e navegação do capítulo

2.1 **Definir hierarquia:** comparar o título do livro/capítulo e o conjunto de controles com a referência; decidir posição, alinhamento, escala, espaçamento e tratamento do título. Não se comprometer com um dropdown novo antes de confirmar que a navegação existente suporta essa interação.

2.2 **Inventariar controles:** revisar voltar, ver resumo, áudio, tema e ajustes. Para cada controle, registrar função, prioridade, rótulo acessível, ícone, estado normal/desabilitado/ativo e alvo; identificar duplicação ou competição visual.

2.3 **Ajustar composição:** corrigir apenas desvios observados de alinhamento, respiro, superfície, borda e tipografia. Manter as ações atuais e tokens claro/escuro; não misturar cor codificada direta se houver token semântico adequado.

2.4 **Revisar comportamento fixo:** conferir o cabeçalho no topo, após rolar, ao voltar ao topo e durante troca de capítulo. Confirmar fundo opaco, separador, altura medida, animação existente sem saltos e âncora do conteúdo abaixo do cabeçalho.

2.5 **Revisar teclado:** percorrer controles em ordem de tabulação; confirmar foco visível, ativação por teclado e que a rolagem/recolhimento do cabeçalho não rouba foco nem esconde o controle focado.

2.6 **Exercitar limites de conteúdo:** título de livro mais longo; capítulo 1; último capítulo de um livro; capítulo curto; passagem de anterior/próximo. Confirmar nomes legíveis e destinos corretos, sem overflow.

**Saída/gate:** cabeçalho aprovado nos dois temas e nas larguras de aceite; navegação continua funcional; nenhum foco/controlador fica oculto. Se a captura não demonstrar benefício visual, não acrescentar decoração.

#### Etapa 3 — Área editorial do texto

3.1 **Conferir largura e medida:** medir largura do texto em 1024, 1280 e 1440 px; manter uma linha confortável e coluna centrada. Ajustar `max-width`/margens só com evidência de linhas excessivamente longas ou coluna estreita.

3.2 **Conferir escala tipográfica:** comparar tamanho selecionado, família serifada e sem serifa, peso, entrelinha e escala dos números de versículo. A escolha salva e os controles A-/A+ prevalecem; a referência visual não autoriza trocar a preferência da pessoa.

3.3 **Conferir ritmo editorial:** revisar o intervalo vertical e horizontal entre versículos, recuo dos números, quebra de linhas, relação título/corpo e respiro do início/fim do capítulo. Evitar transformar cada versículo em card ou ornamento.

3.4 **Confirmar destaque dos estados:** inspecionar grifo, versículo alvo por URL, versículo selecionado, versículo falado e nota/salvo existentes. Cor não pode ser o único sinal; a cópia do texto e o número continuam discerníveis.

3.5 **Avaliar subtítulo com fonte de verdade:** verificar se os dados do produto contêm subtítulo de capítulo com procedência adequada. Só usar se existir e se for contextualmente correto; se não existir, manter sem subtítulo em vez de inferir o texto do mockup.

3.6 **Revalidar contraste:** comparar texto principal, número, controles inline e destaques nos fundos claro/escuro; medir combinações que mudarem. Preservar leitura em tema escuro sem sombra de texto como substituta de contraste suficiente.

**Saída/gate:** corpo confortável nos tamanhos/famílias suportados, conteúdo correto e todos os estados visuais legíveis; preferência persiste sem ser regravada pela inspeção.

#### Etapa 4 — Progresso, seleção e ações

4.1 **Progresso de leitura:** percorrer início, meio e final do capítulo; conferir que a barra acompanha a posição real, não salta ao recolher o cabeçalho e não transmite conclusão falsa. Avaliar rótulo/value acessível e cor em ambos os temas.

4.2 **Navegação fixa inferior:** verificar posição, área de clique, contraste e relação com o fim do texto e com a barra de seleção. As setas e seletor de capítulo devem continuar acessíveis sem cobrir a leitura ou outro controle.

4.3 **Painel de seleção simples:** conferir título/referência selecionada, botão fechar, grifos recentes, salvar, nota, cópia, compartilhar e imagem. Medir largura/altura e confirmar que o painel permanece próximo ao centro, não ultrapassa a viewport e não tapa controles essenciais.

4.4 **Painel de seleção múltipla:** verificar intervalo de versículos, ação cancelar, cores e ações em largura curta de desktop; conferir rolagem horizontal por mouse/trackpad e teclado, indicador de que há mais ações e retorno do foco após fechar.

4.5 **Ícones e acessibilidade:** para cada ação icon-only, conferir `accessibilityLabel`, papel, estado checked/disabled e foco visível. Alvos permanecem confortáveis; rótulos acessíveis não dependem do texto visual omitido no desktop.

4.6 **Ações com persistência:** somente em contexto descartável, testar salvar/desfazer, anotação/cancelar, grifo/remover e criação de imagem; restaurar o estado inicial e comprovar que a conta real não foi afetada. Compartilhamento pode ser validado até a abertura da folha de compartilhamento, sem escolher destino nem enviar. Sem ambiente descartável, marcar a integração mutável como não verificada e não clicar em produção/perfil real.

4.7 **Sem movimento / movimento reduzido:** respeitar o comportamento de movimento já existente. Não acrescentar animações nesta rodada; verificar que foco, seleção e confirmação não dependem de animação.

**Saída/gate:** ações simples e múltiplas claras, utilizáveis por mouse e teclado; nenhuma ação some ou se torna inacessível por compactação; estado de leitura e persistência não se corrompem.

#### Etapa 5 — Consolidação e aceite

5.1 **Implementar por achado:** corrigir primeiro P0/P1 e depois os ajustes P2 que comprovadamente aproximam a hierarquia da referência. Um grupo de mudanças por vez, diff pequeno, sem limpar alterações existentes de outros escopos.

5.2 **Repetir baseline pareado:** repetir rotas, 1024/1280/1440, temas, família/tamanho tipográfico e estados relevantes com dados equivalentes; alinhar antes/depois para detectar regressão em vez de confiar em memória visual.

5.3 **Revisar acessibilidade e layout:** repetir navegação por teclado, nomes/estados no accessibility tree, contraste dos elementos alterados, zoom/texto ampliado disponível no web e verificação de overflow/oclusão.

5.4 **Executar verificações do projeto:** typecheck, contratos de acessibilidade/UI e diff check existentes. Não adicionar dependência, suíte ou animação só para cumprir o plano; qualquer ambiente externo indisponível deve ficar registrado como limitação.

5.5 **Fazer revisão de código:** verificar hooks/estado, dependências de efeito, valores inline vs tokens, breakpoint desktop, semântica de botões, segurança de parâmetros, uso de armazenamento, mensagens de erro e impacto em Android/iOS causado por JSX compartilhado.

5.6 **Fechar evidências e backlog:** registrar na matriz cada achado corrigido, validado ou bloqueado; listar telas/plataformas não cobertas; atualizar status de execução; deixar o navegador em estado neutro, sem seleção ou preferência temporária alterada.

**Saída/gate:** critérios de conclusão abaixo atendidos para o Leitor web desktop. O plano geral de UI continua parcialmente aberto; concluir esta rodada não aprova mobile, nativo, leitor de tela ou outras superfícies.

### Critérios de conclusão

- Cabeçalho, título e coluna de texto têm hierarquia editorial consistente com a referência sem remover funções ou alterar conteúdo.
- Sem rolagem horizontal nem controles sobrepostos em 1024, 1280 e 1440 px, em claro e escuro.
- O texto segue sendo o foco dominante; tamanho e família tipográfica salvos continuam valendo.
- Barra de progresso, navegação de capítulo e painel de seleção permanecem utilizáveis em seus estados relevantes; ações por ícone têm nomes acessíveis e foco perceptível.
- Evidência visual pareada e verificações de código registradas; lacunas nativas, de leitor de tela e de mobile permanecem explicitamente fora do aceite desta rodada.

### Fora do escopo nesta rodada

Home, Descubra, Planos, Salvos, Resumos, Perfil, conteúdo, identidade global, novas imagens/ilustrações e implementação mobile/nativa. Não alterar a preferência de fonte, dados de leitura ou estado salvo do usuário para produzir capturas. Sem nova dependência e sem motion decorativo.

### Riscos e respostas

- **A referência mostra um leitor mobile:** adaptar apenas hierarquia e linguagem visual ao desktop; não copiar dimensões nem inferir que mobile está aprovado.
- **A toolbar compacta usa ícones:** manter alvos confortáveis, nomes acessíveis e rótulos textuais acessíveis; não reduzir affordance só para caber na composição.
- **A fonte serifada pode ser preferência pessoal:** preservar configuração salva e conferir ambas as opções.
- **O estado persistido pode contaminar capturas:** registrar estado inicial e não salvar alterações durante a inspeção.
- **O checkout contém mudanças anteriores:** limitar o diff desta rodada ao Leitor e documentos diretamente relacionados; preservar o restante.

## Status de execução e fila revisada — 2026-10-01

| Etapa | Estado | Evidência / restante |
|---|---|---|
| A — Auditoria visual | Parcial | Home, Descubra, Leitor e Planos têm inspeção web desktop em claro/escuro; paisagem e recomendações ganharam conferências recentes. A rodada focal do Leitor precisa repetir baseline em 1280/1440 e cobrir estados de foco/seleção. Mobile/nativo segue adiado. |
| B — Ícones e símbolos | Parcial | MaterialIcons seguem como padrão. O painel de seleção desktop tem rótulos acessíveis nas ações principais; falta varrer foco, alvos, contraste e affordance do Leitor em todos os estados. |
| C — Ilustrações | Parcial | Temas de Descubra, planos e paisagem do dia têm vetores locais; manhã/tarde/noite são controláveis no Expo Web de desenvolvimento. Permanecem oportunidades em estados vazios e ficha documental de cada ativo. |
| D — Cartões e imagens | Parcial | Home e Planos usam cenas SVG locais; sem fotografia ou fonte externa não curada. Não é foco da próxima rodada. |
| E — Movimento | Parcial | Fogo de sequência e feedback curto de salvar respeitam movimento reduzido no fluxo implementado. Falta piloto de progresso e validação da preferência em plataforma nativa; não é foco desta rodada do Leitor. |
| F — Qualidade | Parcial | Typecheck, 34 contratos de acessibilidade, 8 superfícies estruturais de UI, diff check e inspeções web passaram nos recortes realizados. Validação nativa/leitores de tela permanece pendente. |

**Foco da rodada concluída:** etapas 1–5 do foco único acima para o Leitor web desktop, com cobertura de navegador e QA estático registradas no incremento a seguir. As demais superfícies ficam fora desta rodada; mobile, nativo e tecnologias assistivas sem ambiente apropriado permanecem pendentes e não bloqueiam o aceite desktop.

### Incremento — hierarquia editorial do Leitor desktop (2026-10-01)

- Conferida a rota `/biblia/01-genesis/1` no Expo Web: conteúdo completo de Gênesis 1, controles de voltar/resumo/áudio/tema/ajustes e navegação anterior/próximo aparecem na árvore acessível.
- A inspeção visual encontrou oportunidade para aproximar a referência: o capítulo estava centralizado como título utilitário, sem alinhamento explícito com a coluna; o corpo permanecia em sans conforme a preferência salva e os números tinham contraste/hierarquia fracos.
- Ajustado apenas o Leitor: faixa superior limitada e centrada sobre a área de conteúdo; seletor central de livro/capítulo leva à tela existente de capítulos; resumo virou ação icon-only nomeada na área de controles; título serifado editorial maior e alinhado à mesma coluna do texto, sem mudança no fluxo mobile. O corpo mantém a largura máxima anterior, ganha entrelinha ligeiramente maior no desktop e os números usam tamanho/acento terroso mais legível. A fonte do corpo continua respeitando a preferência persistida.
- Corrigido um problema observado no painel de seleção desktop: antes ele encobria versículos e a navegação fixa em 1024 px. Quando a seleção abre, a área rolável agora reserva a altura medida do painel e o painel flutua acima da navegação. Em 1024 px, a região de leitura termina em y=672, o painel começa em y=673 e a navegação fica abaixo, sem interseção ou overflow horizontal.
- O teste de teclado/rolagem identificou que o cabeçalho podia se recolher enquanto um controle nele mantinha foco. O Leitor web agora o mantém visível enquanto o foco ativo está dentro do cabeçalho; ao mover o foco para o texto, o recolhimento por rolagem volta ao comportamento esperado.
- Não foi adicionado subtítulo ao capítulo: o acervo consultado não oferece fonte de verdade explícita para esse campo. Nenhuma decoração ou conteúdo bíblico foi inferido da referência.
- QA visual isolado: Gênesis 1 em claro a 1024/1280/1440 px; Gênesis 1 em escuro a 1280/1440; Salmos 119 (176 versículos) em claro e escuro a 1024/1280/1440. Em todas as larguras medidas, a largura documental igualou a viewport e os controles/título permaneceram dentro da tela. As capturas pareadas foram feitas em contexto de navegador descartável.
- Estados exercitados: seleção simples e múltipla sem gravar ações de salvar/grifar; nomes acessíveis do painel; alternância Resumo/Texto; abertura do seletor de capítulos; troca para Provérbios 1 ao avançar de Salmos 150; livro mais longo, 2 Tessalonicenses 3; rolagem de Salmos 119 até o fim (progresso 100%) e retorno, com cabeçalho revelado nas bordas; foco no seletor durante rolagem (cabeçalho permanece visível) e foco transferido ao versículo (cabeçalho pode recolher); A+/A− e fonte serifada testadas e restauradas no perfil descartável. O switch de tema também foi restaurado ao claro nesse perfil.
- Verificações: `npm run typecheck` aprovado; `npm run check:a11y` aprovou 34 contratos; `npm run check:ui` aprovou 8 superfícies; `git diff --check` limpo. A captura visual não registrou erros do app. Jest não foi executado.
- Revisão de código: nenhum pacote ou conteúdo novo; escopo de código limitado à rota do Leitor; preferências do usuário mantidas; dimensões da reserva do painel derivam de constante nomeada junto à área já reservada da navegação. Revisar depois em aparelho/nativo, leitores de tela reais, tema claro/escuro em todas as demais dimensões/estados, seleção persistente real e ajuste de fonte em perfil real; mobile continua adiado.
- Limite atual: o navegador web desktop e os checks estáticos cobrem o que pode ser confirmado neste checkout. Validação em iOS/Android, leitores de tela, dados persistentes de usuário e breakpoints mobile exigem ambiente/escopo posterior.
- Continuação desta revisão: leitura estática confirmou que Gênesis 1 não tem capítulo anterior e Apocalipse 22 não tem próximo; a lógica usa os limites do catálogo e atravessa livros adjacentes. Os repositórios de grifos, notas, salvos e progresso só persistem após ação explícita e apresentam feedback de falha; nenhuma ação persistente foi simulada nesta revisão. A aba Codex disponível mostrava “Não foi possível acessar o site” em `localhost:8081`, e a política de navegação bloqueou sua leitura; por isso, não se declara nova inspeção visual de Apocalipse 22 nem se tentou contornar o bloqueio. Sem defeito funcional reproduzido, não houve nova alteração de código nesta continuação.

### Incremento — sistema de ícones Phosphor (2026-10-01)

- A família MaterialIcons foi substituída pelo Phosphor no app compartilhado: navegação, leitura, Descubra, Início, Perfil, Planos, Salvos, resumos, onboarding, conquistas e menus de ação.
- Criado um adaptador único com imports por ícone, tipo semântico, suporte às classes NativeWind e pesos regular/preenchido. Estados ativos da navegação usam preenchimento; favoritos, notas, marcadores e concluído usam preenchimento nos estados ativos.
- Ícones continuam complementares aos rótulos; a camada os marca como decorativos. Nomes acessíveis continuam nos controles interativos que os contêm.
- Removido `@expo/vector-icons`; instalada a adaptação comunitária `phosphor-react-native` sobre `react-native-svg` já presente. O pacote não é a implementação oficial do projeto Phosphor e segue registrado como risco de manutenção.
- O desenvolvimento foi feito sobre Expo SDK 57 / React Native 0.86. A documentação versionada SDK 57 foi consultada antes da alteração. A documentação não cataloga essa dependência de terceiros como API Expo.
- Verificações: `npm run typecheck`, `npm run export:web` (94 rotas), `npm run check:a11y` (34 contratos), `npm run check:ui` (8 superfícies), `npm run check:e2e` (4 contratos de jornada) e Expo Doctor (21/21) passaram. A exportação mostrou apenas os avisos já conhecidos do suporte de notificações web e do ambiente Node `localStorage`.
- Revisão React/TypeScript: adaptador sem estado/hooks próprios, tipos explícitos para nomes/props, imports de ícone individuais e cores explícitas resolvidas das classes NativeWind antes de renderizar os caminhos SVG.
- O diff confirma substituição completa de `@expo/vector-icons` nos componentes executáveis. A inspeção visual desktop e nativa não será declarada sem executar no navegador/aparelho; o refinamento deliberado do aplicativo móvel nativo continua adiado.

### Correção — contraste dos ícones no tema escuro (2026-10-01)

- Feedback do usuário identificou ícones escuros e pouco visíveis no modo escuro. A revisão encontrou cores fixas herdadas da implementação anterior em ações de fechar/limpar, destaque de plano concluído e um símbolo da Home, além de fallback escuro no adaptador quando a classe de cor não fornece valor resolvido.
- O adaptador passou a usar fallback claro no tema escuro. As cores que precisavam de identidade específica passaram a usar valores explícitos por tema (incluindo filtro, fechar, conclusão de plano e ações destrutivas); tons de texto/tema escuro preservam os tokens definidos.
- Verificações após o ajuste: `npm run typecheck`, `npm run check:a11y` (34 contratos), `npm run check:ui` (8 superfícies), `npm run export:web` (94 rotas) e `git diff --check` passaram. O export mantém os avisos conhecidos de notificações web e `localStorage` no Node.
- A inspeção visual continua pendente e não é substituída pela compilação; não afirmamos uma conferência de cada superfície no navegador nesta correção.

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
