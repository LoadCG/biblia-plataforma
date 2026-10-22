# Relatório de qualidade dos estados compartilhados

Data: 2026-10-21
Checkpoint: CP3, auditoria estática e verificações direcionadas

## Escopo

Revisados `components/Toast.tsx`, `components/EstadoCarregando.tsx`,
`components/EstadoErro.tsx`, `components/EstadoVazio.tsx` e
`docs/inventario-estados-ui.md`. O checkout já continha mudanças staged e
unstaged de outras frentes. Em `Toast.tsx`, a única diferença local identificada
é o posicionamento responsivo no desktop, usando `BREAKPOINT_DESKTOP`; não foi
alterada nesta auditoria.

## Achados

- Não foi comprovado defeito nos quatro componentes que justificasse uma
  correção pequena e segura nesta etapa.
- Os estados compartilhados se distinguem por papel e conteúdo: carregamento
  com indicador nomeado, erro com retry opcional e estado vazio com ação
  opcional.
- `EstadoErro` e `EstadoVazio` mantêm alvo mínimo de 44 px para ações.
- O Toast mantém severidade tipada, ação opcional com alvo mínimo, temporizador
  limpo no unmount e tratamento de movimento reduzido. O inventário registra
  que a posição desktop foi ajustada para 24 px e a posição móvel permanece em
  90 px.
- O inventário de estados já descreve cobertura por superfície e deixa explícito
  que a leitura é estática, com validação visual e assistiva ainda parcial.

## Verificações

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Passou, sem erros TypeScript. |
| `npm run check:a11y` | Passou: 111 contratos críticos. |
| `npm run check:ui` | Passou: 38 superfícies e contratos estruturais. |
| `npm run check:copy-ui` | Passou: 134 fontes verificadas, nenhum padrão interno sinalizado. |

## Limites e próximo checkpoint

Esta etapa não incluiu inspeção visual de cada severidade do Toast, estado
induzido de erro/retry, leitor de tela real, nem validação em dispositivo nativo.
Os contratos estruturais não confirmam apresentação visual ou anúncio assistivo
em runtime. Esses itens permanecem pendentes no inventário de
`docs/inventario-estados-ui.md`.

Checkpoint CP3 concluído para auditoria estática e verificações direcionadas.
Para fechar a validação de runtime, conferir no navegador os temas claro/escuro,
Toast com e sem ação, expiração, movimento reduzido, retry e estado vazio; depois
repetir as jornadas essenciais em dispositivo nativo com tecnologia assistiva.
