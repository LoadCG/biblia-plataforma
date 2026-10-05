# Índice da documentação

Use esta página para localizar a fonte de verdade de cada assunto. O plano
trimestral consolida a ordem; documentos específicos detalham a execução sem
substituir os estados e critérios mais atuais.

## Fontes de verdade

| Necessidade | Documento | Regra |
|---|---|---|
| Entender produto, stack e execução local | [`README.md`](./README.md) | Visão introdutória; conferir `package.json` para versões exatas. |
| Saber o que está concluído e o que vem primeiro | [`ESTADO-DO-PROJETO.md`](./ESTADO-DO-PROJETO.md) | Atualizar quando um marco ou prioridade mudar; nunca inferir aceite. |
| Executar o plano do trimestre | [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md) | Ordem canônica das próximas frentes e critérios de saída. |
| Seguir branch, commit, CI e recuperação | [`docs/FLUXO-GIT.md`](./docs/FLUXO-GIT.md) | Descreve apenas políticas observadas/autorizadas e evidências reais. |
| Consultar dúvidas e lacunas de UX para visitantes novos | [`docs/auditoria-ux-novato.md`](./docs/auditoria-ux-novato.md) | Achados confirmados no fluxo e status das correções. |
| Entender armazenamento e controles dos dados no produto | [`app/privacidade.tsx`](./app/privacidade.tsx) | Resumo funcional; não substitui política jurídica. |
| Conferir implementação funcional | [`FUNCIONALIDADES.md`](./FUNCIONALIDADES.md) | Checklist legado amplo; confirmar código/evidência antes de marcar item. |
| Consultar decisões fechadas | [`TODO.md`](./TODO.md) | Não reabrir decisões do usuário sem pedido. |
| Consultar histórico | [`CHANGELOG.md`](./CHANGELOG.md) | Registro cronológico; não é roadmap. |

## Planos operacionais vigentes

| Documento | Escopo | Relação com o plano mestre |
|---|---|---|
| [`PLANO-MESTRE-UX-ETAPAS-19-A-23.md`](./PLANO-MESTRE-UX-ETAPAS-19-A-23.md) | Auditoria web, estados, QA visual, nativo e release | Detalha ciclos 1–4 e 6; suas caixas só fecham com evidência correspondente. |
| [`PLANO-MELHORIAS-UI-DESIGN.md`](./PLANO-MELHORIAS-UI-DESIGN.md) | Direção visual, componentes, histórico das inspeções e plano focal atual de seleção de versículo | Referência visual/casos já trabalhados; não mantém uma fila independente do plano mestre. |
| [`PLANO-TEMAS-DESCOBERTA.md`](./docs/PLANO-TEMAS-DESCOBERTA.md) | Expansão de conteúdo, UX e arquitetura dos detalhes de tema | Detalha a ampliação temática; conteúdo precisa de revisão humana antes de ser publicado. |
| [`PLANO-HOVER-INTERACOES.md`](./docs/PLANO-HOVER-INTERACOES.md) | Microinterações hover em todas as rotas e componentes acionáveis da web | Foco atual de UI; cobre apenas ponteiro hover-capable e preserva toque, teclado e movimento reduzido. |
| [`PLANO-CONFIGURACOES.md`](./docs/PLANO-CONFIGURACOES.md) | Melhorias UX/UI, contrato de preferências, dados locais e lembrete diário | Etapas iniciais implementadas; QA visual, assistivo e do lembrete em dispositivo pendentes. |
| [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md) | Fila de propostas editoriais pendentes | Lista rascunhos, próximas ações e o gate de duas revisões humanas. Fontes dos três planos já publicados estão em `docs/planos-publicados/`. |
| [`PLANO-TECNICO-BUSCA.md`](./PLANO-TECNICO-BUSCA.md) | Status e evolução técnica da busca e descoberta | Execução parcial; priorizar contrato, benchmark e integração dos escopos antes de adotar índice derivado. |

## Estado, qualidade e conteúdo

- [`docs/matriz-auditoria-responsiva.md`](./docs/matriz-auditoria-responsiva.md):
  evidência visual por rota, viewport, tema e limite da inspeção.
- [`docs/inventario-estados-ui.md`](./docs/inventario-estados-ui.md):
  loading, erro, vazio, feedback e recuperação por superfície.
- [`docs/contrato-editorial.md`](./docs/contrato-editorial.md),
  [`docs/criterios-editoriais.md`](./docs/criterios-editoriais.md) e
  [`docs/cobertura-editorial.md`](./docs/cobertura-editorial.md): modelo,
  critérios e cobertura automatizada; nenhum deles aprova revisão humana.
- [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md):
  propostas e fila de conteúdo ainda não aprovado. Fontes de planos publicados
  ficam em [`docs/planos-publicados/`](./docs/planos-publicados/) e registram
  explicitamente qualquer exceção ao gate editorial.
- `.github/workflows/ci.yml`: configuração do CI; o estado de cada execução deve
  ser consultado no link de run correspondente registrado no plano mestre.

## Gates locais de conteúdo e governança

Em 2026-10-05 passaram `npm run check:revisao-editorial` (5 rascunhos com
governança explícita), `npm run check:copy-ui` (116 fontes, sem padrões internos
sinalizados) e `npm run check:editorial` (66 resumos, 5 planos e 72 dias). Esses
gates verificam consistência automatizável e não aprovam o mérito editorial dos
rascunhos nem dispensam revisores humanos independentes.

## Histórico e referências

Os documentos abaixo preservam o contexto de ciclos anteriores. Não devem ser
lidos como planos ativos nem usados para reabrir uma prioridade sem reconciliá-la
com o plano mestre atual:

| Documento | Conteúdo preservado |
|---|---|
| [`PLANO-EXECUCAO-5-ETAPAS.md`](./PLANO-EXECUCAO-5-ETAPAS.md) | Primeiro ciclo funcional. |
| [`PLANO-EXECUCAO-ETAPAS-6-A-10.md`](./PLANO-EXECUCAO-ETAPAS-6-A-10.md) | CI, SEO, Maestro, acessibilidade e builds; gates externos ainda podem estar abertos. |
| [`PLANO-UX-INTERFACE-ETAPAS-11-A-15.md`](./PLANO-UX-INTERFACE-ETAPAS-11-A-15.md) | Ciclo de busca, Salvo, Planos e feedback. |
| [`PLANO-UX-INTERFACE-ETAPAS-16-A-20.md`](./PLANO-UX-INTERFACE-ETAPAS-16-A-20.md) | Estados vazios, navegação e gates de responsividade/snapshots. |
| [`PLANO-EXECUCAO-COMPLETO-CONTEUDO-UX-RELEASE.md`](./PLANO-EXECUCAO-COMPLETO-CONTEUDO-UX-RELEASE.md) | Especificação anterior de conteúdo e release, substituída pelo plano mestre atual e pela fila em `docs/revisao-editorial/INDICE.md`. |
| [`PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md`](./PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md) | Ondas históricas absorvidas pelo plano mestre e pela fila em `docs/revisao-editorial/INDICE.md`. |
| [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md) | Decisões de arquitetura e produto. |
| [`PLANO-NAVEGACAO.md`](./PLANO-NAVEGACAO.md), [`PLANO-UI-COMPONENTES.md`](./PLANO-UI-COMPONENTES.md) | Rascunhos de navegação e auditoria inicial de componentes. |
| [`ESTUDO-UX-LEITURA.md`](./ESTUDO-UX-LEITURA.md) | Fundamentos da experiência de leitura. |
| [`frontend-log.md`](./frontend-log.md), [`backend-log.md`](./backend-log.md) | Relatos históricos de implementação; não substituem código nem CI. |

## Diretório `docs/`

- `docs/revisao-editorial/`: fontes propostas e registros de revisão humana.
- `docs/*.md`: critérios, contratos, matrizes e planos correntes indicados
  acima. Evitar criar novos documentos de roadmap sem apontá-los neste índice.

## Manutenção documental

1. Ao mudar prioridade ou status de marco, atualizar `ESTADO-DO-PROJETO.md` e o
   plano mestre no mesmo incremento.
2. Ao concluir trabalho, registrar evidência no plano específico e no changelog;
   atualizar checklist funcional quando houver comportamento novo.
3. Manter planos antigos como históricos, com link para a fonte atual; não
   apagar decisões ou evidência só para simplificar o índice.
4. Distinguir implementação, verificação estrutural, inspeção visual, aceite
   humano e publicação.
5. Conteúdo editorial e copy de UI devem ser tratados como produto: fontes,
   critérios, revisão e status claros; sem anotações internas na interface.

## Verificações comuns

```bash
npm run typecheck
npm run check:copy-ui
npm run check:a11y
npm run check:ui
npm run check:editorial
npm run export:web
npm run check:static
git diff --check
```
