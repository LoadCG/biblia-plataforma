# Plano de evolução de usabilidade e interface — etapas 11 a 15

Atualizado em 2026-09-10. Este plano continua o ciclo funcional anterior com
ênfase em redução de fricção, feedback de estado e coerência semântica.

**Status em 2026-10-02: registro histórico.** Itens de implementação estão
marcados individualmente; auditoria de dispositivo e aceite de estados que
continuaram parciais foram levados aos ciclos 1–3 de
[`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md). Não usar a
antiga fila abaixo como plano paralelo.

## Etapa 11 — Busca com controle de limpeza `✅`

- [x] Adicionar ação explícita para limpar o termo na tela Descubra.
- [x] Preservar foco visual, área de toque e label acessível.
- [x] Expor estado de carregamento da busca para tecnologias assistivas.
- [x] Validar o contrato no gate automatizado de acessibilidade.

## Etapa 12 — Salvo com recuperação de contexto `✅`

- [x] Adicionar limpeza rápida do campo de busca.
- [x] Adicionar comando único para limpar termo, filtros, ordenação e seleção.
- [x] Manter a ação contextual e discreta, visível somente quando necessário.
- [x] Preservar undo existente para exclusões em lote.

## Etapa 13 — Progresso de planos compreensível `✅`

- [x] Marcar título da tela como cabeçalho semântico.
- [x] Expor a barra de progresso com mínimo, máximo, valor atual e texto.
- [x] Comunicar no label se o plano está concluído ou pode ser continuado.
- [x] Adicionar hint de navegação para reduzir ambiguidade do card clicável.

## Etapa 14 — Auditoria visual em dispositivos `🔶`

- [ ] Validar larguras de 320, 375, 414 e tablet.
- [ ] Verificar truncamento, overflow horizontal, contraste e áreas de toque.
- [ ] Repetir a matriz em tema claro/escuro.
- [ ] Executar em Android/iOS e registrar evidências visuais.

## Etapa 15 — Sistema de feedback e estados transitórios `🔶`

- [x] Adicionar labels semânticos aos principais carregamentos de Leitor,
  seleção de versículo, referências, Bíblia inicial e Estatísticas.
- [x] Expor erros recuperáveis de referência e seleção como alertas acessíveis.
- [ ] Padronizar loading, erro recuperável, estado vazio e confirmação de ação.
- [ ] Auditar todos os fluxos assíncronos sem feedback perceptível.
- [ ] Definir tokens de duração, severidade e posição para Toast/Alert.
- [ ] Cobrir regressões com contratos de interface e jornada E2E.

## Próxima ordem de execução

1. Executar a matriz visual da etapa 14 em dispositivo/navegador real.
2. Inventariar estados assíncronos e implementar a etapa 15 por superfície.
3. Atualizar o benchmark de UX somente após evidência de uso e não por
   preferência estética isolada.
