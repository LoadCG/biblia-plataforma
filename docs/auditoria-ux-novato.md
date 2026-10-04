# Auditoria de UX como visitante novo

Revisada em 2026-10-04. A auditoria percorreu a experiência publicada como
visitante sem histórico: apresentação inicial, Início, Descubra e detalhe de
tema, escolha de livro, leitura, Você, Planos, Resumos e Configurações. As
observações foram conferidas no código antes de virar mudança.

## Plano executado

1. **Prioridade alta — explicar progresso e próximas ações.** Separar capítulos,
   resumos e dias de plano; usar verbos compatíveis com o estado inicial; deixar
   o campo de busca identificável por tecnologia assistiva. Implementado em
   Início, leitor/seleção de livros, detalhe de resumo e cartões de plano.
2. **Prioridade alta — oferecer orientação permanente.** Criar uma página de
   ajuda que responda dúvidas básicas e leve às áreas principais. Implementada
   em `/ajuda`, com entradas em Você, Configurações e Descubra. Os atalhos sem
   destino de Descubra agora abrem Salvos e Ajuda.
3. **Prioridade média — alinhar mensagens às decisões do produto.** Informar que
   o perfil é local e não sugerir previsão para opções que não estão disponíveis.
   Implementado em Você e Configurações.
4. **Próxima etapa — expandir conteúdo com revisão editorial.** Avaliar novos
   planos curados e ampliar os temas com contexto das passagens, perguntas de
   leitura e referências conferidas. Exige curadoria e revisão humana antes de
   publicação; não foi gerado conteúdo bíblico automaticamente nesta etapa.
5. **Prioridade média — tornar dados e privacidade mais visíveis.** Criada a
   página informativa `/privacidade`, com explicações conferidas no código e
   links de gerenciamento. Uma política jurídica completa continua fora do
   escopo até haver responsável e canal de contato definidos.

## Lacunas e estranhamentos encontrados

| Prioridade | Dúvida provável de quem chegou agora | Evidência e encaminhamento | Estado |
|---|---|---|---|
| P1 | “0 de 66 livros” significa que li capítulos ou resumos? | O cartão da Início mede livros marcados na área de Resumos. O texto agora nomeia os resumos e explica que capítulos são acompanhados separadamente. | Corrigido |
| P1 | “0 de 50” na lista de livros conta capítulos? | O seletor mostrava apenas os números. Agora informa “capítulos” e anuncia o mesmo significado no rótulo acessível. | Corrigido |
| P1 | Abrir um livro ou resumo já aumenta o progresso? | A marcação do livro acontece separadamente; o detalhe agora explica a consequência da ação. O progresso de capítulos permanece independente. | Corrigido |
| P1 | “Continuar plano” funciona se nunca comecei? | A lista mostrava esse rótulo mesmo com zero dias feitos. Agora o estado inicial comunica “Ainda não iniciado” e o cartão orienta “Conhecer plano”; quem já começou vê “Continuar”. | Corrigido |
| P1 | “Sem conta ainda” significa que preciso criar uma conta? | O produto não tem contas nem sincronização. O Perfil agora informa “Perfil local neste dispositivo”. | Corrigido |
| P1 | Onde encontro explicação permanente sobre as regras? | A apresentação inicial não cobria a diferença entre as três métricas de progresso. Criada a página Ajuda e como usar, também acessível em Você e Configurações. | Corrigido |
| P2 | O campo “Buscar livro” é identificado ao usar leitor de tela? | O `TextInput` não tinha rótulo acessível. Agora se chama “Buscar livro da Bíblia”. | Corrigido |
| P2 | “Em breve” quer dizer que o recurso está planejado para uma data próxima? | Configurações prometia cores de grifo e contraste sem prazo. O texto agora diz claramente que a personalização ainda não está disponível. | Corrigido |
| P2 | Os atalhos “Favoritos” e “Apoie” levam a algum lugar? | Ambos apareciam desabilitados em Descubra. Foram substituídos por Salvos (já filtrado para versículos salvos) e Ajuda, com destinos e rótulos acessíveis reais. | Corrigido |
| P2 | Quatro passagens por tema e dois planos bastam para escolher um caminho? | O catálogo é pequeno, porém curado, com introduções, referências e sequência própria. Aumentar volume sem contexto/revisão poderia reduzir qualidade; fica para expansão editorial. | Planejado |
| P2 | Como os resumos são produzidos e quais são os limites? | A página Sobre descreve metodologia e limitações; a Ajuda agora oferece um link direto para ela. | Corrigido |
| P2 | Onde descubro o que fica no dispositivo e como apagar? | Criada uma página informativa “Dados e privacidade”, ligada à Ajuda e à seção Meus dados. Ela descreve o comportamento implementado sem se apresentar como política jurídica. | Corrigido |
| P3 | Onde leio uma política jurídica completa? | Ainda não existe aviso legal com responsável e canal de contato. A nova página é um resumo funcional; formalizar política depende de definir essas informações. | Decisão pendente |

## Regras de progresso documentadas

- **Capítulos da Bíblia:** marcados na leitura ou na grade de capítulos; são a
  base da sequência diária.
- **Resumos:** cada livro marcado como lido aumenta o progresso de estudo por
  resumos e participa das medalhas de livros; não marca os capítulos.
- **Planos:** sessões e dias concluídos pertencem ao plano. Avançar nas leituras
  do dia atualiza a sessão e, ao terminar as referências, conclui o dia. A
  leitura de um capítulo também atualiza o progresso normal da Bíblia.
- **Dados pessoais:** o produto funciona sem conta. Informações de perfil,
  leituras, anotações e planos são locais neste dispositivo; não há sincronização
  entre aparelhos. Configurações oferece exportação e exclusão.

## Revisão do plano

O escopo implementado priorizou ambiguidades que poderiam mudar a expectativa
ou causar uma ação errada. O texto novo é informativo, sem inventar recursos,
datas de entrega ou interpretação editorial. A Ajuda é uma tela responsiva do
mesmo app Expo Router e usa componentes e tokens de tema existentes.

O trabalho de conteúdo continua em aberto onde requer revisão humana: novas
trilhas, ampliação de leituras temáticas e contexto por passagem. Conteúdo
institucional de privacidade também não deve virar política jurídica sem as
informações do responsável pelo produto.

### Continuação em 2026-10-04 — orientação, dados e atalhos

Os antigos atalhos desabilitados “Favoritos” e “Apoie” foram removidos. Eles
foram substituídos por links funcionais para **Salvos** (já com o filtro de
versículos salvos ativo) e **Ajuda**; **Planos** permanece como terceiro
destino. Isso dá utilidade à área de atalho sem sugerir uma função de apoio
financeiro que o produto não oferece. A checagem de acessibilidade agora cobre
o propósito anunciado dos dois links.

Também foi criada `/privacidade`, um resumo funcional sobre dados locais ligado
à Ajuda e às Configurações. A página não se apresenta como política jurídica.

`npm run typecheck`, `npm test` (17 suítes/58 testes), `npm run check:a11y`
(69 contratos), `npm run check:ui`, `npm run check:copy-ui` (116 fontes),
`npm run check:e2e`, `npm run check:temas`, `npm run export:web` e `npm run
check:static` passaram. O export contém 96 rotas e 1.189 capítulos; o verificador
conferiu 1.285 arquivos HTML.
Não foi feita nova inspeção visual de navegador nesta continuação.

## Validação e limites

- Inspeção de navegação publicada feita com perfil local sem histórico.
- Conferência de regras na implementação de progresso, sessões e perfil.
- `npm run typecheck`, `npm test` (17 suítes, 58 testes), `npm run check:a11y`
  (67 contratos), `npm run check:ui` (11 superfícies), `npm run check:copy-ui`
  (115 fontes), `npm run check:planos-editoriais`, `npm run check:e2e` e
  `npm run check:static` passaram.
- `npm run export:web` passou e incluiu `/ajuda` entre as 95 rotas exportadas;
  o verificador estático conferiu 1.284 arquivos HTML e 1.189 capítulos.
- A captura visual foi feita antes das alterações, na produção publicada. Não
  houve nova inspeção visual do código alterado no navegador neste ciclo.
- Não foi feita revisão teológica humana de novas passagens, porque nenhuma foi
  adicionada.
- A auditoria não valida conformidade jurídica nem sincronização entre aparelhos.
