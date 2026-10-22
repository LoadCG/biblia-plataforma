# Relatório de qualidade dos estudos introdutórios

**Data:** 2026-10-21
**Escopo:** estudos “Quem é Jesus?”, “O que é a Bíblia?” e “A história da salvação”, mais o componente compartilhado que os apresenta.
**Estado:** rascunhos adequados para protótipo e revisão; não aprovados para publicação pastoral.

## Resumo

Foram lidas 11 seções editoriais, três descrições de abertura e 22 links para o leitor bíblico. Os 22 destinos apontam para livros e capítulos existentes na ACF local; os versículos de início informados também existem. Não encontrei link quebrado nem referência inválida. A validação de destino não confirma, por si só, exegese, interpretação doutrinária, licença de distribuição da tradução ou correção de qualquer material bíblico além da passagem conferida.

O conteúdo identifica a perspectiva cristã/protestante em vez de disfarçá-la, define termos como pecado, graça e fé, convida a leitura em ritmo próprio e não condiciona o acesso a formulário, cadastro, contato ou compromisso. Não encontrei pressão emocional, ameaça ou promessa de prosperidade. O componente oferece links diretos para conferir os textos, voltar a `/conhecer`, abrir `/leitura` ou explorar outra leitura.

Não foram necessárias correções objetivas nesta rodada. As mudanças locais já existentes em `components/EstudoEvangelistico.tsx`, que permitem configurar rótulo e nota de abertura, foram preservadas; não as alterei.

## Método e checkpoints

1. **Inventário:** conferir os três estudos, títulos, descrições, seções, referências e CTAs.
2. **Clareza para iniciantes:** procurar termos cristãos não explicados, frases muito abstratas e pressupostos de familiaridade com a Bíblia ou igreja.
3. **Referências e coerência aparente:** verificar sintaxe, livro, capítulo, versículo inicial no arquivo ACF e se a passagem combina com a afirmação próxima.
4. **Tom e liberdade:** procurar pressão, culpa, ameaça, promessa de resultado, exigência de contato ou compromisso.
5. **Navegação:** verificar os destinos internos do componente e links editoriais para o leitor.
6. **Gate editorial:** registrar o que ainda depende de revisão pastoral, confirmação doutrinária, decisão sobre tradução/direitos e validação humana com leitores iniciantes.

Os checkpoints 1 a 5 foram concluídos por leitura do código e validação local dos destinos. Não executei build, exportação nem testes, conforme o escopo desta rodada. A conferência foi feita contra a tradução ACF presente no repositório e deve ser repetida se a tradução ou os caminhos do leitor mudarem.

## Qualidade por estudo

| Estudo | Qualidade observada | Gates pastorais/editoriais |
|---|---|---|
| **Quem é Jesus?** | O estudo apresenta os relatos dos Evangelhos, acolhimento e ensino, cruz, ressurreição e um convite voluntário. “Para a fé cristã” e “os cristãos entendem” identificam a perspectiva. Romanos 5:6–8 e 1 Pedro 2:24 acompanham a explicação da cruz; 1 Coríntios 15:3–8 e João 20 acompanham a ressurreição; João 3 e Marcos 1 levam ao convite e aos relatos de Jesus. | A expressão “o custo e a profundidade do amor” é uma síntese teológica e deve ser aprovada por liderança pastoral. Revisar a linguagem de “pecado” e “reconciliar” para que fique acessível a quem não conhece esses termos, sem alongar nem transformar o estudo em definição doutrinária que o projeto ainda não aprovou. |
| **O que é a Bíblia?** | Explica a Bíblia como coleção de livros, menciona gêneros e as duas grandes partes; apresenta um caminho simples de leitura e pergunta orientadora. Lucas 1:1–4 e 2 Timóteo 3:14–17 acompanham a introdução; Gênesis 1 e Lucas 24:25–27 acompanham a síntese da narrativa; Marcos 1 e João 20:30–31 apoiam o começo pelos Evangelhos. A descrição declara explicitamente o enquadramento protestante. | “A fé cristã lê a Bíblia como uma história” é uma síntese canônica, não uma afirmação demonstrada por duas referências isoladas. A equipe pastoral deve confirmar que essa forma de resumir a unidade bíblica representa a tradição desejada e como tratar diferenças de cânon entre tradições cristãs se o tema for ampliado. |
| **A história da salvação** | Define salvação e explica pecado, graça e fé em linguagem simples. Gênesis 1:26–31 e Salmo 8 sustentam a abertura sobre criação e dignidade; Romanos 3:23 e 6:23 acompanham a seção sobre pecado; Efésios 2:1–10 e 1 Coríntios 15:3–4 acompanham graça, fé, morte e ressurreição; Apocalipse 21:1–5 e Romanos 8:18–25 acompanham esperança futura. O texto evita prometer vida sem sofrimento e diz que esperança não substitui ajuda prática. | “Pecado é a ruptura com Deus” é uma definição teológica breve e acessível, mas requer confirmação pastoral para a ênfase pretendida. “Restaurada” e “restauração final de todas as coisas” também são sínteses doutrinárias que precisam de aprovação. Rever se “fé — confiança em Jesus” comunica adequadamente o conceito protestante de salvação pela graça, recebida pela fé, sem sugerir que boas obras sejam a causa da salvação. |

## Auditoria do componente compartilhado

- O cabeçalho e os títulos das seções usam papéis semânticos de cabeçalho.
- Cada referência aparece como link com rótulo textual e leva a um capítulo ou passagem no leitor.
- A nota de abertura explica que os links servem para conferir o contexto.
- No final, a página diz que suas explicações são um começo e incentiva perguntas e leitura direta. A pessoa pode abrir a Bíblia online ou voltar às demais leituras.
- Nenhuma ação exige cadastro, contato, coleta de relato ou manifestação de compromisso.
- A ordem de leitura acompanha a ordem do conteúdo, sem condicionar a exibição à interação.

Limite desta revisão: nesta atualização foi feita inspeção estática dos componentes e contratos existentes, sem inspeção visual, navegação assistiva com leitor de tela ou validação em aparelhos. Esses itens ficam para o checkpoint de acessibilidade/UX antes de lançamento.

## Critérios para aprovação pública

- Uma liderança pastoral identificada revisa o sentido, contexto e ênfase dos três estudos.
- Uma pessoa que não conhece a Bíblia lê os textos e consegue explicar, com suas palavras, quem é Jesus, o que é a Bíblia e o que o estudo chama de salvação. Essa leitura verifica clareza, não conversão nem aprovação doutrinária.
- As referências continuam corretas e os destinos abrem a passagem desejada após qualquer mudança no leitor.
- A organização escolhe a tradução bíblica e confirma os direitos aplicáveis antes de inserir transcrições ou distribuir o conteúdo. Este material utiliza referências, sem incluir citações bíblicas extensas.
- A iniciativa identifica quem responde editorialmente pelo conteúdo antes de publicação pública.
- A chamada para leitura segue opcional e não sugere atendimento, retorno ou formulário ativo.

## Pendências e limites

- A validação comprova existência de 22 caminhos e dos versículos de início na ACF local. Não certifica interpretação exegética, completude teológica ou direitos autorais.
- Algumas seções resumem doutrina cristã em frases curtas. São apropriadas para protótipo, mas precisam da revisão pastoral indicada por estudo.
- Não foi avaliada a acurácia integral do corpus ACF, o serviço de leitura, o desempenho das fontes externas, a privacidade da hospedagem nem o deploy.
- Nenhum formulário, canal de aconselhamento ou coleta de dados é oferecido por estes estudos. Não se deve inferir que o site responde pedidos de ajuda.

## Verificação integrada

- Após as frentes paralelas, `npm run export:web` passou com 123 rotas estáticas e 1.189 capítulos.
- `npm run check:static` passou, verificando 23 rotas críticas e 1.312 arquivos HTML.
- `npm run typecheck` passou sem erros após uma frente independente corrigir as chamadas da sequência e do áudio em telas do app.
- A exportação não substitui as decisões editoriais, pastorais e de direitos descritas neste relatório.

## Checkpoint técnico da interface · 2026-10-21

- **Escopo inspecionado:** `app/conhecer/index.tsx`, `components/EstudoEvangelistico.tsx` e rotas `/conhecer/jesus`, `/conhecer/biblia` e `/conhecer/salvacao`.
- **Navegação:** os cartões usam links Expo Router para as três rotas existentes; cada estudo compartilha retornos para `/conhecer`, `/leitura` e demais leituras. Os links de referências têm nomes textuais próprios.
- **Semântica e teclado:** títulos e títulos de seção declaram papel de cabeçalho; ações são links em `Pressable`; o CSS compartilhado aplica `:focus-visible` aos links e estabelece alvos de pelo menos 44 px para os controles examinados.
- **Estado de rota:** o componente recebe seções e referências por props. Não foi observado estado assíncrono nem um caso de tela vazia nessas três rotas.
- **Alteração de tela existente:** o aviso de disponibilidade dos temas está antes da lista de escolhas no diff local; foi preservado. A posição informa a pessoa antes de abrir uma leitura por tema.
- **Achados técnicos:** nenhum link quebrado ou defeito comprovado de acessibilidade/navegação foi encontrado nesta inspeção estática; por isso, nenhum código de tela foi alterado neste checkpoint.
- **Validação executável:** `npm run typecheck`, `npm run check:a11y` (111 contratos) e `npm run check:ui` (38 superfícies) passaram em 2026-10-21. Nenhum resultado de build ou inspeção visual deve ser inferido destas verificações.
- **Pendência:** validar visualmente em larguras pequenas e desktop, e operar as rotas com teclado e tecnologia assistiva antes da publicação.
