# Relatório de UX da landing “Tem alguém que te ama.”

**Data:** 2026-10-21
**Escopo:** chegada pelo panfleto/QR, narrativa por rolagem, leitura móvel, teclado, movimento reduzido e saídas para aprofundamento.
**Método:** inspeção do componente, CSS e plano editorial; execução das verificações estruturais automatizadas. Não houve nova sessão de inspeção visual neste checkpoint.

## Leitura da jornada

1. O título da página e o primeiro quadro retomam exatamente “Tem alguém que te ama.”, como previsto para o panfleto.
2. Os quadros 2 a 5 falam de valor, acolhimento e permanência antes de revelar Deus em Jesus Cristo no quadro 6.
3. Os quadros seguintes apresentam aproximação de Jesus, cruz, ressurreição e graça.
4. O encerramento oferece dois caminhos sem pedir cadastro: leituras introdutórias em `/conhecer` ou Bíblia online em `/leitura`; referências bíblicas aparecem ao final.

A narrativa preserva a curiosidade sem ocultar a identidade até o fim. O conteúdo permanece rascunho e ainda requer revisão pastoral e editorial, conforme o plano do projeto.

## Auditoria UX e acessibilidade

| Área | Estado observado no código | Próxima checagem |
|---|---|---|
| Rolagem | A página conduz a sequência sem capturar a rolagem. O progresso mapeia os dez quadros e deixa de cobrir o encerramento. | Testar gesto de toque, rolagem rápida/lenta e orientação paisagem em celular. |
| Movimento reduzido | `useReducedMotion` desliga a sequência guiada; CSS expõe os quadros como conteúdo vertical. | Alterar a preferência do sistema com a página aberta e confirmar a transição, além da carga inicial. |
| Leitura sem animações | Um botão alterna a narrativa para uma lista contínua, mantendo as opções finais disponíveis. | Testar com teclado, toque, zoom e preferência de movimento reduzido em navegador real. |
| Teclado | `main` aceita foco; controles são botões; opções e referências são links; o atalho leva foco ao título final. | Confirmar ordem de tabulação, foco visível, rolagem por espaço/setas e retorno do foco após navegar/voltar. |
| Tecnologia assistiva | Há transcrição semântica independente da camada visual decorativa, títulos, status e progresso com rótulos. | Validar VoiceOver/NVDA. A verificação automatizada só confirma presença estrutural, não o ritmo ou a utilidade dos anúncios. |
| Encaminhamento | “Conhecer Jesus e a Bíblia” e “Abrir a Bíblia online” são ações distintas, com referências verificáveis. | Exercitar links em viewport estreito e confirmar retorno da navegação do navegador. |
| Entrada por QR | O texto da mensagem não depende de imagem; tema e preferência guardada são locais. | Testar em navegador embutido de QR, rede lenta, armazenamento bloqueado e aparelho com barras dinâmicas. |

## Resultado das checagens

- `npm run check:a11y` passou: 111 contratos críticos.
- `npm run check:ui` passou: 38 superfícies/contratos estruturais.
- A leitura do código confirmou as duas saídas e as referências no encerramento.
- Esses resultados não substituem captura visual, inspeção de leitor de tela ou teste físico no celular.

## Decisão deste checkpoint

Não identifiquei uma correção segura que pudesse fazer sem mexer no componente/CSS atribuídos a outra frente nem sem evidência visual reproduzível. Mantive o escopo como auditoria e registrei os gates de validação manual. Antes de divulgar o QR, concluir a revisão pastoral do texto e testar o destino público do domínio e os dois caminhos principais.

## Complemento de captura visual e implementação — 2026-10-21

Depois da auditoria independente, a implementação da narrativa e da abertura
foi ajustada e conferida em uma prévia Expo Web de 1280×720:

- A captura do quadro 7 mostrou um texto longo próximo ao limite inferior. A
  frase foi encurtada para caber com espaço ao redor.
- A captura da abertura confirmou “Tem alguém que te ama.” como primeiro texto
  visível, sem o rótulo anterior acima da frase. A árvore acessível agora
  apresenta a narrativa completa antes dos controles.
- Também foram capturados o segundo quadro, o décimo e a chamada final. As
  duas ações e sete referências ficaram presentes; Marcos 10:46–52 e João
  4:7–26 foram incluídos para dar referências aos exemplos do cuidado de
  Jesus.
- A rota local da referência de Marcos atualizou a URL corretamente, mas a
  prévia de desenvolvimento permaneceu no indicador “Bundling…” durante essa
  tentativa. O export estático e `check:static` passaram; carregamento visual
  dessa rota em Preview Vercel/aparelho ainda precisa de validação.
- `npm run validate` passou após as alterações: 34 suítes/236 testes, 111
  contratos de acessibilidade, 4 jornadas, 38 contratos UI e Expo Doctor
  21/21. `npm run export:web`, `npm run check:static` e `npm run check:copy-ui`
  também passaram.

A captura desktop não cobre larguras de 320–390 px, orientação paisagem ou
navegador móvel. A aprovação pastoral da narrativa e do rascunho do panfleto
segue pendente.
