# Matriz de auditoria responsiva

## Execução

- Data: 2026-09-28
- Branch/commit: `codex/ui-usabilidade-16-18` / `113a6b6`
- Ambiente: Codex In-app Browser, Expo Web em `http://localhost:8081`; observados 1280×900 nesta rodada, além dos viewports históricos 1280×720, 375×812 e 320×800.
- Isolamento: inspeção feita em `localhost`, origem distinta da aba que estava em `127.0.0.1`; onboarding e alternância de tema ocorreram apenas na origem de inspeção. O estado existente em `127.0.0.1` não foi alterado.
- Dados: conteúdo bíblico/plano renderizado para inspeção; nenhum conteúdo pessoal foi editado.
- Método: inspeção estática mais árvore de acessibilidade e capturas da tela real. O CLI `agent-browser` não estava disponível; a interface do navegador Codex foi usada para navegação/capturas. Viewports temporários foram restaurados ao padrão e o tema foi devolvido ao claro ao encerrar.
- Checagens após os recortes: `npm run typecheck`, `npm run check:a11y`, `npm run check:ui` e `git diff --check` (resultados detalhados registrados após execução). Suítes Jest não foram executadas.

## Matriz planejada

| Viewport | Tema claro | Tema escuro | Plataforma | Status |
|---|---|---|---|---|
| 320×800 | Parcial: Leitor, Perfil e Medalhas | Parcial: Home, Descubra, Leitor e Planos | Web mobile | Escuro cobre quatro superfícies principais e detalhe de plano; claro cobre leitor, perfil e medalhas |
| 375×812 | Inspecionado | Inspecionado | Web mobile | Home, Descubra, Leitor e Planos conferidos nos dois temas |
| 414×896 | Home inspecionada | Home inspecionada | Web mobile | Parcial: Home nos dois temas |
| 768×1024 | Home inspecionada | Pendente | Web tablet | Parcial: Home em claro |
| 1024×900 | Home inspecionada | Pendente | Web desktop | Home clara revisada no breakpoint desktop; documento de 1024 px sem overflow horizontal |
| 1280×720 | Inspecionado | Home inspecionada | Web desktop | Parcial: Home, Descubra, Leitor e Planos; não substitui a matriz planejada |
| 1280×900 | Inspecionado | Inspecionado | Web desktop | Home, Descubra, Leitor, lista e detalhe de Planos revistos nos dois temas; sem overflow horizontal |
| 1440×900 | Home inspecionada | Pendente | Web desktop | Parcial: Home clara; DOM sem overflow horizontal |

## Telas cobertas por inspeção

| Tela | Rota | Casos | Resultado |
|---|---|---|---|
| Início e navegação | `/` | composição, versículo do dia, cartões, medalhas e navegação | Claro/escuro em 1280×900; Home usa duas colunas, cena panorâmica e três temas que direcionam às passagens curadas. Claro em 1280×720 e 375×812; escuro em 320×800. |
| Descubra e busca | `/pesquisa` | categorias, atalhos, placeholder, filtros e resultados | Claro/escuro em 1280×900 com busca editorial, cards ilustrados e descrições; claro/escuro em 375×812; escuro em 320×800. Tema “Esperança” foi aberto até os quatro resultados de referência carregarem. |
| Salvo e coleções | `/salvo` | busca, filtros combinados, lote e undo | Estrutura e estado vazio conferidos em claro 375×812; filtros, lote e undo não percorridos. |
| Resumos | `/resumos` | busca, lista vazia, títulos longos | Lista inicial e hierarquia conferidas em claro 375×812; busca não percorrida. |
| Planos | `/planos`, `/planos/sabedoria-7` | lista, descrições, progresso, detalhe e sessão | Lista e detalhe em claro/escuro a 1280×900; destaque com SVG local e sessões limitadas a 896 px. Histórico mobile em claro 375×812 e escuro 320×800; conclusão não percorrida. |
| Leitor | `/biblia/01-genesis/1` | toolbar, texto, rolagem e espaço da navegação | Claro/escuro a 1280×900; título serifado, números de versículo em acento terroso, conteúdo preservado como texto-primeiro e sem overflow. Preferência de fonte mantém escolha da pessoa. Histórico mobile: texto/toolbar em claro 375×812 e rolagem em escuro 320×800; seleção/fonte/foco seguem pendentes. |
| Configurações | `/configuracoes` | fonte, tema, switches, dados | Hierarquia e controles conferidos em claro 375×812; switches não alterados nesta auditoria. |
| Estatísticas | `/estatisticas` | cards e quebra em largura estreita | Cards conferidos em claro 375×812; último card sozinho na terceira linha, sem overflow. |
| Perfil e medalhas | `/voce`, `/medalhas` | carrossel de conquistas, ícones, descrições e cards | Conferidos em claro e escuro em 320×800 e 375×812; medalhas do Perfil aparecem em carrossel horizontal e a página completa mantém descrições/progresso legíveis. |

## Achados

### Achados e correções deste recorte

| ID | Achado reproduzível | Severidade | Ação | Situação |
|---|---|---|---|---|
| VIS-UI-01 | A pílula fixa de capítulo ficava sobre linhas bíblicas no viewport, embora houvesse espaço inferior no final do conteúdo. | P1 | Reservar 80 px no layout rolável de Texto e Resumo; converter setas de texto em chevrons MaterialIcons com alvos de 44 px. | Corrigido e revisto visualmente em 1280×720; mobile ainda pendente. |
| VIS-UI-02 | Os cartões da lista de Planos não tinham símbolo que ajudasse a distinguir Evangelhos de Sabedoria. | P2 | Adicionar símbolos MaterialIcons em blocos suaves, preservando título, descrição e barra de progresso. | Implementado e revisto visualmente em 1280×720 claro. |
| VIS-UI-03 | O cartão do Versículo do Dia tinha altura fixa e o primeiro recorte usou um símbolo de amanhecer dentro de bloco quadrado, diferente da cena da referência aprovada. | P2 | Remover a altura fixa e usar uma ilustração SVG horizontal de paisagem, sem moldura de ícone, com cena ligada ao horário da saudação. | Corrigido; noite conferida em 1280×720 e mobile 375×812. Manhã/tarde ainda sem captura. |
| VIS-UI-04 | A captura inicial do cartão revelou aviso de atributo ARIA inválido no DOM por marcação decorativa inadequada. | P1 | Remover props incompatíveis e ocultar a arte por `aria-hidden`. | Corrigido; aviso não reapareceu na captura seguinte. |
| VIS-UI-05 | A screenshot aprovada é mais específica que o plano anterior, que a tratava somente como inspiração geral; o primeiro resultado do cartão aproximava a linguagem, mas não a cena. | P1 | Tratar a composição das quatro telas como alvo visual final responsivo; usar cena ilustrada no cartão do dia, e não ícone. | Plano revisado; implementar e comparar telas mobile em etapas. |
| VIS-UI-06 | A Home mobile mantém o layout e a navegação legíveis, mas as medalhas usam emojis, destoando da família MaterialIcons e da linguagem mais editorial da referência. | P2 | Trocar emojis de medalhas por MaterialIcons mapeados por tipo de conquista e compartilhar o mesmo componente na Home, no Perfil e na tela Medalhas. | Implementado; Home verificada visualmente em 375×812 e `npm run typecheck` passou. Perfil e tela Medalhas ainda precisam de captura própria. |
| VIS-UI-07 | No Leitor web, o cabeçalho animado não recebia cor de fundo CSS via suas classes NativeWind; o conteúdo rolado aparecia por trás dos controles. | P1 | Definir cor de fundo e borda do `Animated.View` explicitamente conforme o tema, mantendo o cabeçalho fora do fluxo do leitor. | Corrigido; DOM confirmou fundos opacos claro/escuro e capturas em 320×800 e 375×812 confirmaram o texto abaixo do cabeçalho. |
| VIS-UI-08 | Em 320×800, descrições da lista de Planos eram limitadas a duas linhas e terminavam truncadas. | P2 | Permitir três linhas para a descrição sem alterar o conteúdo editorial. | Corrigido e conferido em tema escuro 320×800; as duas descrições aparecem completas. |
| VIS-UI-09 | O placeholder longo de Descubra podia ser truncado em largura estreita, embora o rótulo acessível já fosse sucinto. | P2 | Usar “Buscar na Bíblia e nos resumos” como placeholder coerente com o rótulo acessível. | Corrigido; captura 320×800 mostra a frase completa. |
| VIS-UI-10 | Em desktop, a grade de temas de Descubra permanecia em `max-w-2xl`, apesar de cabeçalho e busca ocuparem largura ampla, deixando espaço lateral vazio. | P2 | Usar o mesmo container `max-w-6xl` na grade desktop e ampliar as cenas sem alterar o pictograma compacto do layout estreito. | Corrigido e conferido em claro/escuro; oito cards preenchem a largura sem overflow aparente. |
| VIS-UI-11 | O rótulo “Sabedoria” tinha contraste de 2,42:1 no cartão claro. | P1 | Escurecer o token para `#806000` e medir o contraste sobre o fundo editorial do card. | Corrigido para 5,76:1; demais rótulos coloridos claros ≥5,22:1 e escuros ≥7,58:1. |
| VIS-UI-12 | O cartão de jornada “Estudo por Resumos” usava o acento marrom saturado no tema claro e destoava das superfícies creme da referência. | P2 | Aplicar fundo creme, texto escuro e progresso terroso no claro; preservar o cartão dourado escuro no tema escuro. | Corrigido; captura desktop clara confirma hierarquia e contraste visual, e estilo escuro preserva o tratamento anterior. |
| VIS-UI-13 | A paisagem do Versículo do Dia tinha colinas abstratas, sem os raios e silhuetas presentes na linguagem da referência. | P2 | Acrescentar raios solares e árvores vetoriais locais sem cobrir o conteúdo nem substituir a cena por ícone. | Corrigido; manhã conferida visualmente em tema claro. A prévia de horário controlada permite repetir a conferência das três variantes. |
| VIS-UI-14 | A barra de ações após selecionar versículos ocupava toda a largura do painel desktop e os rótulos repetidos pesavam visualmente. | P2 | Usar painel flutuante centralizado com ações em ícones nomeados e manter todas as opções atuais; deixar o breakpoint mobile inalterado. | Corrigido e conferido no estado de versículo selecionado em tema escuro; árvore acessível anuncia salvar, anotação, cópia, compartilhamento e criação de imagem. |
| VIS-UI-15 | A dica de primeira leitura ocupava uma faixa alta antes do texto bíblico no desktop, distanciando o capítulo da hierarquia sem distração da referência. | P2 | Manter a dica no fluxo estreito e omiti-la apenas no breakpoint desktop. | Corrigido; captura desktop mostra o texto logo após o cabeçalho. O estado estreito continua usando `DicaContextual`. |

## Fechamento do incremento de microfeedback

- `Amém` alternou para salvo na Home em localhost e foi desfeito; o tema foi restaurado ao claro. A observação confirma estado/integração web, não mede o tempo visual do pulso nem substitui validação nativa.
- O feedback usa escala no ícone MaterialIcons, sem animar o texto bíblico, e fica estático com movimento reduzido ativo.
- `npm run typecheck`, `npm run check:a11y` (34 contratos), `npm run check:ui` (7 superfícies) e `git diff --check` passaram após as mudanças.
- Console sem erros observados; permanecem avisos do React Native Web para `shadow*`/`textShadow*` e de notificações web para listener de token push não suportado/sem efeito.

## Rodada desktop-first — 2026-09-28

- Prioridade atual: telas web a partir de 1024 px. O usuário adiou a versão mobile; os dados móveis acima são registros anteriores, não aceite desta rodada.
- Capturas de Home, Descubra, Planos e Leitor foram revisadas em 1280×900 em claro e escuro. O DOM confirmou largura de documento de 1280 px nas capturas de plano e leitor, sem rolagem horizontal. A Home também foi revisada em 1024×900 no tema claro, com documento de 1024 px.
- Home adicionou três cards (“Ansiedade”, “Esperança”, “Sabedoria”) vinculados a `pesquisa?tema=...`; o tema de Esperança abriu as passagens bíblicas curadas. A paisagem panorâmica mantém as três paletas horárias no SVG e foi conferida no período noturno disponível durante esta sessão.
- Planos (lista e detalhe) usa cartão ilustrado local de livros/ramo; a sequência detalhada permanece em coluna única e largura máxima de 896 px para preservar leitura em desktop.
- Na continuação, Descubra teve a grade desktop ampliada, oito cenas vetoriais conferidas em claro/escuro e contraste do rótulo de Sabedoria corrigido. A lista de Planos recebeu arte mais detalhada de livros empilhados e ramo; arte conferida nos dois temas. Home usa cenas maiores nas recomendações desktop; a captura noturna estava coerente com “Boa noite”. A divergência antiga de arte entre larguras foi corrigida em 2026-10-01: os mesmos SVGs editoriais agora aparecem em toda largura, com escala responsiva; veja o registro “consistência das ilustrações de tema”.
- A paisagem de Home passou a aceitar `?previewPeriodo=manha|tarde|noite` apenas em Expo Web de desenvolvimento. Capturas controladas anteriores confirmaram as três saudações e posições de astro; após incluir raios/árvores, a manhã foi conferida em tema claro. O cartão de jornada foi alinhado às superfícies creme da referência; a captura clara confirma o resultado.
- A barra de seleção do Leitor foi compactada em painel flutuante apenas no breakpoint desktop. Com um versículo selecionado, os ícones preservam `accessibilityLabel`; todas as opções continuam na árvore acessível. O layout estreito mantém as classes e rótulos anteriores.
- A dica contextual inicial deixou de aparecer no Leitor desktop para aproximar a página do padrão “texto primeiro”; permanece no fluxo estreito e não altera o armazenamento de dicas.
- No Leitor, a fonte do corpo continua controlada pela preferência salva; os títulos e números receberam apenas o tratamento editorial compatível com o breakpoint desktop.
- Não foi gravado progresso, salvo, nota ou plano durante esta revisão. O tema foi alternado somente em `localhost` e será restaurado ao claro ao terminar.

As capturas e a árvore acessível comprovam somente o viewport/superfícies anotados.
Os contratos estruturais não substituem interação real em viewports mobile nem
tecnologias assistivas. Continuar a matriz gradualmente e registrar cada caso
como aprovado, defeito reproduzível ou bloqueado.

## Inspeção desktop do incremento de estados — 2026-10-01

- Ambiente: Codex In-app Browser, Expo Web em `http://localhost:8081`, viewport
  1280×900, branch `master`; leitura da interface real e árvore acessível.
- Home `/`: tema claro, conteúdo do dia, jornada, sequência e medalhas visíveis;
  checkbox de “Amém” foi alternado em armazenamento isolado de `localhost` e
  restaurado. Nenhum dado da origem publicada ou perfil real foi alterado.
- Descubra `/pesquisa`: tema claro; busca, oito cards ilustrados e nomes/descrições
  acessíveis presentes, sem clipping observado no viewport.
- Planos `/planos`: tema claro e escuro; banner, livros ilustrados, dois cards e
  progresso legíveis; os símbolos permaneceram visíveis em ambos os temas.
- Limite: não houve acionamento de Toast por severidade nesta inspeção; as novas
  cores semânticas ainda precisam de captura em claro/escuro. Também não foram
  inspecionadas aqui outras larguras, fluxos de erro ou leitores de tela.
- Resultado: nenhum defeito visual reproduzível neste recorte. A matriz global
  permanece parcial; não marcar etapa 19 ou 21.4 como concluída.

## Inspeção da paisagem do Versículo do Dia — 2026-10-01

- Ambiente: Codex In-app Browser, `localhost:8081`, viewport 1280×900; Home
  web desktop. A largura declarada pelo documento foi 1280 px.
- Variações conferidas: manhã em claro e escuro; tarde em escuro; noite em
  claro. A saudação e o astro corresponderam ao período selecionado; a arte
  permaneceu legível nos quatro pares inspecionados.
- O primeiro ajuste adicionou picos triangulares desalinhados com a referência;
  eles foram removidos durante a revisão. A cena final usa colinas curvas em
  camadas e ciprestes unidos, sem corte ou overflow aparente no cartão.
- A preferência de tema foi restaurada para claro; não foram alterados dados de
  progresso, salvos, notas ou planos. Refinamento mobile dedicado continua
  adiado; esta captura não é aceite dos breakpoints estreitos.
