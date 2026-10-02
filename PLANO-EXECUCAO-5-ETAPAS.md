# Execução das cinco etapas funcionais

**Status em 2026-10-02: ciclo histórico de implementação.** Os itens funcionais
marcados `[x]` foram executados; gates de dispositivo, hardware limitado e
revisão humana que ainda aparecem desmarcados não foram encerrados. Eles não são
fila ativa e só devem voltar mediante priorização no plano mestre Q4.

Data: 2026-09-08

Este documento registra a execução verificável do ciclo de hardening,
planos guiados, onboarding, busca e organização de conteúdo salvo. Um
item só está marcado quando possui implementação ou evidência reproduzível.

## Etapa 1 — Hardening funcional e consistência de dados

- [x] Documentação versionada do Expo SDK 57 consultada.
- [x] Dependências alinhadas com `npx expo install --fix`.
- [x] `expo-font` e o peer `@react-native/jest-preset` instalados.
- [x] Expo Doctor aprovado em 21/21 verificações.
- [x] Jest estabilizado com exit code 0.
- [x] Parser bíblico compartilhado para capítulo, versículo e intervalo.
- [x] `Salmos 119:1-32` gera deep link com foco no versículo 1.
- [x] Capítulos inválidos e livros inexistentes são rejeitados.
- [x] Progresso web de planos isolado por `ownerId`.
- [x] Migração retrocompatível de progresso legado sem `ownerId`.
- [x] Respostas obsoletas da busca não atualizam estado, erro ou loading.
- [x] Preferências, última leitura, notificação e métricas locais incluídas
      na exportação e na exclusão de dados.
- [x] Cache bíblico preservado como estado técnico regenerável.
- [x] Testes unitários de parsing e persistência adicionados.

## Etapa 2 — Planos como sessões guiadas

- [x] `DiaPlano` evoluído de forma retrocompatível.
- [x] Título, reflexão e pergunta adicionados aos 21 dias existentes.
- [x] Sessão persistida por owner, plano e dia no web e SQLite.
- [x] Ponto de retomada e referências concluídas persistidos.
- [x] CTA do próximo dia pendente implementado.
- [x] Fluxos “Começar sessão”, “Continuar sessão” e “Revisar leituras”.
- [x] Navegação sequencial integrada ao leitor por contexto de rota.
- [x] Conclusão explícita antes de avançar.
- [x] Última leitura conclui o dia e retorna ao plano.
- [x] Capítulo global marcado como lido durante a conclusão da sessão.
- [x] Sessões incluídas na exportação e exclusão de dados.
- [x] Fluxo web validado de Provérbios 1 para Provérbios 2.
- [x] Testes do próximo dia, conteúdo e sessão adicionados.
- [ ] Revisão editorial humana final dos 21 devocionais.

## Etapa 3 — Onboarding contextual

- [x] Onboarding versionado em três passos.
- [x] Benefícios offline, anotações, planos, progresso e privacidade comunicados.
- [x] CTAs “Começar a ler” e “Explorar planos”.
- [x] Opção de pular.
- [x] Reabertura pelas Configurações.
- [x] Deep links não são interceptados; redirecionamento ocorre somente em `/`.
- [x] Dicas descartáveis no leitor, planos e tela Você.
- [x] Estado incluído na política de exclusão de dados.
- [x] Fluxo web dos três passos validado via navegador.
- [x] Testes de versão, reabertura e dicas contextuais.
- [ ] Validação física com VoiceOver, TalkBack e NVDA.

## Etapa 4 — Busca bíblica de segunda geração

- [x] Contrato comum de opções criado para web e nativo.
- [x] Normalização compartilhada de caixa, acentos e espaços.
- [x] Scoring determinístico de relevância.
- [x] Termos múltiplos e frases entre aspas suportados.
- [x] Filtro por testamento.
- [x] Filtro horizontal por livro.
- [x] Paginação incremental de 50 resultados.
- [x] Destaque visual dos tokens encontrados.
- [x] Pesquisas favoritas expostas na descoberta.
- [x] Cancelamento lógico por identificador monotônico de requisição.
- [x] Busca e filtro de Novo Testamento validados no navegador.
- [x] Testes de normalização e relevância adicionados.
- [ ] Benchmark instrumentado de memória em dispositivo nativo de baixo desempenho.

## Etapa 5 — Organização avançada de Salvo

- [x] Contrato `ColecoesRepository` desacoplado.
- [x] Implementações equivalentes em AsyncStorage e SQLite.
- [x] Coleções e associações isoladas por `ownerId`.
- [x] Criação, renomeação e exclusão com preservação dos itens.
- [x] Confirmação explícita antes da exclusão de coleção.
- [x] Busca textual em notas, livros, referências e pesquisas.
- [x] Filtros combináveis por tipo e coleção.
- [x] Ordenação cronológica e canônica.
- [x] Agrupamento por livro na ordenação canônica.
- [x] Edição direta de notas preservada.
- [x] Seleção múltipla e exclusão em lote.
- [x] Undo de exclusão em lote, inclusive associações de coleção.
- [x] Contadores por coleção.
- [x] Coleções incluídas na exportação e exclusão de dados.
- [x] Fluxos criar, associar e filtrar validados no navegador.
- [x] Testes de isolamento e integridade das associações.
- [ ] Teste de interação com 1.000 itens em dispositivo físico.

## Evidências de validação

- `npm run typecheck`: aprovado.
- `npm test`: 9 suítes e 32 testes aprovados antes da validação final.
- `npx expo-doctor`: 21/21 checks aprovados.
- `npx expo export --platform web`: bundle gerado com sucesso.
- Navegador local: onboarding, deep link `Salmos 119:1-32`, sessão guiada,
  ranking, filtro por testamento, criação e associação de coleção validados.

## Riscos residuais

- Os fluxos nativos possuem implementação e checagem estática, mas ainda
  requerem smoke test em Android/iOS físico ou emulador.
- O conteúdo devocional precisa de revisão editorial humana antes de uma
  publicação tratada como conteúdo definitivo.
- Busca e lista Salvo precisam de benchmark em hardware limitado com volume
  elevado de dados reais.
