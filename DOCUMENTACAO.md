# Índice da documentação

Este é o ponto de entrada da documentação do repositório. Os arquivos permanecem
na raiz para preservar links históricos, mas estão classificados por finalidade.

## Comece aqui

| Documento | Uso | Status |
|---|---|---|
| [`README.md`](./README.md) | Visão geral, execução local e arquitetura resumida | atual |
| [`ESTADO-DO-PROJETO.md`](./ESTADO-DO-PROJETO.md) | Situação real, benchmark e prioridades | fonte viva |
| [`TODO.md`](./TODO.md) | Decisões fechadas e ponte para o roadmap | fonte viva enxuta |
| [`CHANGELOG.md`](./CHANGELOG.md) | Histórico cronológico de mudanças | histórico |
| [`FUNCIONALIDADES.md`](./FUNCIONALIDADES.md) | Checklist funcional e UX/UI detalhado | checklist |

## Roadmaps ativos

| Documento | Escopo | Status |
|---|---|---|
| [`PLANO-MESTRE-UX-ETAPAS-19-A-23.md`](./PLANO-MESTRE-UX-ETAPAS-19-A-23.md) | Auditoria visual, estados, validação nativa e release | próximo ciclo |
| [`PLANO-CONTEUDO-ETAPAS-24-A-28.md`](./PLANO-CONTEUDO-ETAPAS-24-A-28.md) | Planos de leitura, resumos, curadoria e qualidade editorial | próximo ciclo de conteúdo |
| [`PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md`](./PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md) | Execução por ondas, aprovação editorial e publicação | plano ativo |
| [`PLANO-UX-INTERFACE-ETAPAS-16-A-20.md`](./PLANO-UX-INTERFACE-ETAPAS-16-A-20.md) | Alvos de toque, Toast, responsividade e gate estrutural | ciclo anterior |
| [`PLANO-UX-INTERFACE-ETAPAS-11-A-15.md`](./PLANO-UX-INTERFACE-ETAPAS-11-A-15.md) | Busca, Salvo, Planos e estados transitórios iniciais | histórico recente |
| [`PLANO-EXECUCAO-ETAPAS-6-A-10.md`](./PLANO-EXECUCAO-ETAPAS-6-A-10.md) | CI, SEO, Maestro, acessibilidade e EAS | histórico recente |
| [`PLANO-EXECUCAO-5-ETAPAS.md`](./PLANO-EXECUCAO-5-ETAPAS.md) | Primeiro ciclo funcional de evolução | histórico |

## Arquitetura e produto

| Documento | Escopo | Status |
|---|---|---|
| [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md) | Decisões arquiteturais e evolução web/mobile | referência arquitetural |
| [`PLANO-NAVEGACAO.md`](./PLANO-NAVEGACAO.md) | Raciocínio histórico da navegação e UI | histórico |
| [`PLANO-UI-COMPONENTES.md`](./PLANO-UI-COMPONENTES.md) | Auditoria inicial componente a componente | histórico |
| [`ESTUDO-UX-LEITURA.md`](./ESTUDO-UX-LEITURA.md) | Racional de UX para leitura bíblica e resumos | referência de design |

## Logs históricos

| Documento | Escopo |
|---|---|
| [`frontend-log.md`](./frontend-log.md) | Handoffs e sessões de front-end |
| [`backend-log.md`](./backend-log.md) | Integração inicial de persistência e banco |

## Conteúdo editorial

- [`resumos-biblicos/`](./resumos-biblicos/) contém as fontes Markdown dos 66
  resumos.
- `core/content/dados/livros.json` é derivado por `npm run gerar-conteudo` e não
  deve ser editado manualmente.
- [`docs/cobertura-editorial.md`](./docs/cobertura-editorial.md) registra o
  inventário estrutural gerado por `npm run relatorio:editorial`.
- [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md)
  organiza a fila de rascunhos aguardando revisão humana independente.
- [`docs/contrato-editorial.md`](./docs/contrato-editorial.md) define IDs,
  versões, status e taxonomia controlada do conteúdo.

## Qualidade e operação

- `npm run validate`: TypeScript, Jest, acessibilidade, Maestro, UI estrutural
  e Expo Doctor.
- `npm run relatorio:editorial`: gera inventário estrutural dos resumos e planos
  em `docs/cobertura-editorial.md`; não substitui revisão humana.
- `npm run check:content`: verifica conteúdo derivado sem drift.
- `npm run check:editorial`: valida fontes, derivados, seções e planos e atualiza
  o inventário de cobertura.
- `npm run check:revisao-editorial`: verifica a governança mínima dos rascunhos
  sem aprová-los ou integrá-los ao catálogo.
- `npm run check:piloto-editorial`: pré-valida estrutura, referências-chave e
  marcadores de incerteza do piloto de Gênesis.
- `npm run check:planos-editoriais`: valida duração, sequência e capítulos das
  referências dos planos contra o cânon local.
- `npm run export:web`: gera o export web estático.
- `npm run check:static`: valida rotas e metadados SEO exportados.
- `npm run check:ui`: protege contratos estruturais de responsividade.
- `.github/workflows/ci.yml`: pipeline executado em push/PR.
- `.maestro/`: jornadas E2E declarativas.

## Regra de manutenção

1. Estado real e decisões: atualizar `ESTADO-DO-PROJETO.md`.
2. Funcionalidade ou comportamento de UI: atualizar `FUNCIONALIDADES.md`.
3. Histórico de implementação: atualizar `CHANGELOG.md`.
4. Próximas tarefas: atualizar o roadmap ativo e este índice.
5. Não duplicar roadmap em `TODO.md`; manter apenas decisões fechadas e ponte.
