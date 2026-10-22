
## Retomada visual e atalho de navegação

**Data:** 2026-10-21. Após integrar `e478390`, a landing foi reaberta no servidor Expo Web isolado para evitar a prévia estática antiga em `4173`.

- A captura em viewport de `1000×720` mostrou a frase principal cortada na borda. A largura do bloco tipográfico foi limitada para quebrar a frase em linhas sem ultrapassar o quadro; a captura posterior mostrou “Tem alguém que” e “te ama.” centralizados.
- O atalho “Ir direto às opções” saiu do palco marcado como decorativo e entrou na árvore acessível como link separado. A condição de renderização continua permitindo o atalho quando o visitante usa movimento reduzido, sem exibi-lo no modo de leitura contínua.
- O leitor de acessibilidade identificou os controles de tema e leitura, a narrativa em headings, o atalho e os cinco links de referência.
- `npm run typecheck`, `npm run export:web`, `npm run check:static`, `npm run check:a11y` (111 contratos), `npm run check:ui` (38 contratos), `node --check public/sw.js` e `git diff --check` passaram.

A captura cobre o preview nesta sessão, não substitui validação em aparelhos reais. A preferência de movimento reduzido ainda precisa de teste visual dedicado.

## Checkpoint de sequência e encerramento — 2026-10-21

### Achados visuais

- A prévia antiga em `localhost:4173` mostrou que a chamada final podia começar
  atrás do cabeçalho em largura estreita e que o progresso fixo cobria parte das
  referências bíblicas no encerramento. Essa exportação não refletia as edições
  recentes, então foi mantida apenas como pista de QA.
- A sequência tinha um intervalo de rolagem adicional depois da última frase.
  O código agora usa um intervalo entre cada par de frases e mantém a última
  frase visível até o início da chamada final.
- A barra de progresso deixa de aparecer no décimo quadro, evitando que fique
  sobre as referências no encerramento. Em larguras estreitas, a chamada final
  começa abaixo do cabeçalho fixo.

### Implementação e validação

- Prévia Expo Web iniciada em `http://localhost:8083/` com o checkout atual.
- Árvore acessível confirmou a narrativa completa, o atalho para a continuação,
  as duas ações principais e as cinco referências bíblicas.
- A inspeção visual disponível foi feita em desktop. A captura do navegador não
  expõe o viewport CSS inteiro, então não foi usada para certificar alinhamento
  horizontal ou breakpoints específicos. A validação final em largura estreita,
  tema claro e movimento reduzido segue pendente.
- TypeScript e as verificações integradas de UI/acessibilidade ainda devem ser
  considerados gates do fechamento desta rodada.

## Checkpoint panfleto e narrativa — 2026-10-21

### Planejamento e achados

- A auditoria editorial observou que a copy anterior presumia invisibilidade ou
  sofrimento em frases como “Mesmo que ninguém perceba” e “Sua dor não precisa
  ser escondida”.
- A narrativa mencionava afastamento de Deus, mas não explicava em linguagem
  comum o que “pecado” e “fé” significam.
- O folheto tinha somente uma proposta de frente; como parte do público pode
  não ter acesso a celular, o evangelho essencial também precisa ser legível no
  papel.

### Alterações feitas

- Mantive “Tem alguém que te ama.” como primeira frase e retirei as suposições
  sobre a história pessoal de quem lê.
- Removi o rótulo visual “UMA MENSAGEM PARA VOCÊ” e a numeração acima do
  primeiro quadro, para que a frase do panfleto seja também o primeiro texto
  que o visitante vê. Reordenei o DOM para a transcrição começar antes dos
  controles na árvore acessível.
- Preservei cinco quadros de acolhimento/curiosidade antes da revelação no sexto
  quadro. A Bíblia é mencionada antes da revelação para tornar o suspense
  transparente; a identidade é revelada como Jesus Cristo.
- Após a revelação, a sequência agora explica pecado, cruz, ressurreição, graça
  e fé com formulações curtas. As opções finais continuam sem cadastro e sem
  pedido de contato.
- Acrescentei Marcos 10:46–52 e João 4:7–26 às referências finais, para que as
  frases sobre cuidado, escuta e as conversas de Jesus tenham caminhos de
  conferência nos Evangelhos.
- Criei `docs/RASCUNHO-PANFLETO-TEM-ALGUEM-QUE-TE-AMA.md` com a frente
  minimalista e uma proposta de verso que transmite o núcleo do evangelho sem
  depender do QR.
- Registrei auditorias especializadas em `docs/RELATORIO-REVISAO-NARRATIVA-LANDING.md`,
  `docs/RELATORIO-LANDING-UX-2026-10-21.md` e
  `docs/RELATORIO-JORNADA-QR-LEITURAS.md`.

### Verificações e gates

- `npm run typecheck`, `npm run check:a11y` (111), `npm run check:copy-ui`
  (134 fontes), `npm run check:ui` (38) e `git diff --check` passaram.
- A auditoria de jornada confirmou arquivos exportados para as rotas atuais;
  isso não prova domínio/QR público nem substitui teste de aparelho.
- **Pendente:** revisão pastoral humana da copy, confirmar domínio/HTTPS e QR,
  leitura visual em telas móveis e validação com leitor de tela. O verso é
  proposta para Photoshop, não arte final autorizada para impressão.
- **Capturas de preview (1280×720):** reabri `/` no Expo Web atualizado e
  conferi o primeiro quadro, o segundo, o sétimo e o encerramento/CTA. A
  primeira captura do quadro 7 mostrou a explicação longa ocupando quase toda
  a altura, com risco de corte no viewport; encurtei para “Pecado é afastar-se
  de Deus e praticar o mal.” e capturei novamente. A versão revisada coube com
  espaço visível ao redor. O CTA e as duas ações aparecem após a narrativa; as
  referências continuam roláveis abaixo. Isso é evidência desktop, não valida
  320–390 px ou navegador móvel.
- Após o ajuste de abertura, outra captura confirmou a frase sem rótulo acima;
  a árvore acessível mostrou a narrativa completa antes dos botões de tema e
  leitura.
- Validação integrada final após as alterações: `npm run validate` passou,
  incluindo 34 suítes/236 testes, 111 contratos de acessibilidade, 4 jornadas,
  38 contratos de UI e Expo Doctor 21/21. `npm run export:web` e
  `npm run check:static` passaram; o export inclui 123 rotas, 1.189 capítulos
  e verificação de 1.312 HTMLs.
