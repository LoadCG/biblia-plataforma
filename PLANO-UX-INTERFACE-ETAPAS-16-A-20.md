# Plano de evolução de usabilidade e interface — etapas 16 a 20

Atualizado em 2026-09-10. Este ciclo consolida padrões transversais de
feedback, navegação e responsividade antes de novas features de produto.

**Status em 2026-10-02: ciclo histórico, implementação parcialmente concluída.**
Etapas 16–18 estão marcadas como concluídas; 19 e 20 permanecem parciais ou
abertas por falta de auditoria completa e baselines visuais. A execução vigente
está em [`PLANO-MESTRE-UX-ETAPAS-19-A-23.md`](./PLANO-MESTRE-UX-ETAPAS-19-A-23.md)
e [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md).

Escopo vigente revisado em 2026-10-01: priorizar web desktop e preservar a
responsividade nos breakpoints tocados. A auditoria mobile dedicada e o produto
nativo ficam deferidos; itens abaixo continuam pendentes, não implicitamente
aprovados.

## Etapa 16 — Estados vazios orientativos `✅`

- [x] Tornar o container do estado vazio identificável como resumo.
- [x] Expor o título como cabeçalho semântico.
- [x] Anunciar a orientação do estado vazio como região viva `polite`.
- [x] Manter a linguagem orientada à próxima ação, sem alterar conteúdo.

## Etapa 17 — Navegação com alvos de toque consistentes `✅`

- [x] Garantir altura mínima de 44 px nos gatilhos da barra mobile.
- [x] Preservar estados selecionado/inativo e contraste dos ícones.
- [x] Manter o layout desktop/sidebar sem alterar a árvore de rotas.
- [x] Cobrir o contrato de tamanho mínimo no gate de acessibilidade.

## Etapa 18 — Toast acessível e acionável `✅`

- [x] Expor mensagens como alerta polido para leitores de tela.
- [x] Incluir a ação disponível no nome acessível do Toast.
- [x] Adicionar hint para a ação de desfazer/confirmar.
- [x] Preservar duração diferenciada e comportamento de dismiss.

## Etapa 19 — Auditoria de responsividade `🔶`

- [x] Remover `min-width` rígido dos cards de Estatísticas, evitando overflow
  em viewport mobile estreito.
- [x] Adicionar limpeza rápida ao campo de busca da lista de Resumos.
- [x] Rotular o campo de busca e o título da lista de Resumos.
- [ ] Testar 320, 375, 414 e tablet em claro/escuro.
- [ ] Verificar clipping, overflow, densidade e ordem de foco.
- [ ] Validar navegação lateral no desktop e barra inferior no mobile.
- [ ] Registrar evidências por tela crítica.

## Etapa 20 — Regressão visual automatizada `⬜`

- [x] Criar um gate estrutural compatível com Expo SDK 57 para contratos de UI,
  responsividade preventiva e IDs estáveis.
- [ ] Selecionar ferramenta de screenshots compatível com Expo SDK 57 e o
  pipeline atual.
- [ ] Definir snapshots baseline para Início, Descubra, Salvo, Planos e Leitor.
- [ ] Fixar tolerância de diferença e política de atualização dos baselines.
- [ ] Integrar o job ao CI sem bloquear mudanças legítimas de conteúdo.

## Próximos gates

1. Seguir ciclos 1–4 do plano mestre atual; manter a inspeção mobile dedicada
   deferida e verificar regressões responsivas nos breakpoints tocados.
2. Não declarar regressão visual automatizada concluída até ferramenta,
   baselines, política de atualização e execução estável no CI existirem.
