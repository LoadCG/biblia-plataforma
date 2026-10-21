# Índice da documentação

Use este índice para encontrar a fonte certa sem manter filas de trabalho
duplicadas. A ordem das prioridades fica em um único lugar; planos especializados
guardam contratos, procedimentos e evidências da sua área.

## Como navegar

1. Consulte [Estado do projeto](./ESTADO-DO-PROJETO.md) para saber o que vem a
   seguir e quais gates continuam abertos.
2. Use o [Plano mestre Q4 2026](./docs/PLANO-MESTRE-Q4-2026.md) para a ordem
   canônica, prioridades e critérios de aceite.
3. Abra um plano especializado abaixo para executar ou verificar uma frente.
4. Consulte os documentos de evidência e, por último, os planos históricos.

`README.md` apresenta o produto e a stack. `CHANGELOG.md` registra entregas;
`FUNCIONALIDADES.md` é o checklist legado e deve ser confirmado contra código e
evidências. Nenhum desses documentos substitui o plano mestre.

## Fonte canônica

| Documento | Responsabilidade |
|---|---|
| [`README.md`](./README.md) | Apresentação do produto, stack e início de uso local. |
| [`ESTADO-DO-PROJETO.md`](./ESTADO-DO-PROJETO.md) | Resumo curto de situação, próxima prioridade e pendências que influenciam a execução. |
| [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md) | Única fila de prioridades do trimestre, critérios de saída e referências aos planos de apoio. |
| [`DOCUMENTACAO.md`](./DOCUMENTACAO.md) | Índice e hierarquia documental. |
| [`docs/FLUXO-GIT.md`](./docs/FLUXO-GIT.md) | Políticas observadas de branch, commit, CI e recuperação. |
| [`TODO.md`](./TODO.md) | Decisões de produto fechadas e limites que não devem ser reabertos por inferência. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Registro cronológico de mudanças; não define prioridade. |
| [`FUNCIONALIDADES.md`](./FUNCIONALIDADES.md) | Checklist legado; confirmar qualquer item contra o código e as evidências atuais. |

## Planos especializados em uso

Estes documentos detalham uma frente. Sua ordem e prioridade continuam
subordinadas ao plano mestre; não iniciar uma fila paralela a partir deles.

| Documento | Escopo e estado registrado |
|---|---|
| [`PLANO-MESTRE-UX-ETAPAS-19-A-23.md`](./PLANO-MESTRE-UX-ETAPAS-19-A-23.md) | Checklists operacionais de auditoria web, estados, acessibilidade, snapshots e release. Contexto datado de 2026-10-02 é histórico; confirmar prioridade/status no plano mestre e gates externos com evidência. |
| [`PLANO-TECNICO-BUSCA.md`](./PLANO-TECNICO-BUSCA.md) | Contratos, qualidade, desempenho e validação web/nativa da busca. Preservar a distinção entre busca bíblica e editorial. |
| [`docs/PLANO-AUDIO-VOZES.md`](./docs/PLANO-AUDIO-VOZES.md) | Máquina de estados do player, preferências de voz e velocidade; QA auditivo em plataformas reais pendente. |
| [`docs/PLANO-CONFIGURACOES.md`](./docs/PLANO-CONFIGURACOES.md) | Preferências locais, inicialização, sincronização de controles, lembretes e gestão de dados; QA visual/assistivo e nativo parcial. |
| [`docs/PLANO-RESTAURACAO-DADOS.md`](./docs/PLANO-RESTAURACAO-DADOS.md) | Contrato e implementação de restauração; validar seletor real, falhas, rollback, reexportação e SQLite nativo. |
| [`docs/PLANO-HOVER-INTERACOES.md`](./docs/PLANO-HOVER-INTERACOES.md) | Microinterações web para ponteiro hover/fino; cobertura efetiva por mouse, foco e movimento reduzido ainda parcial. |
| [`docs/PLANO-TEMAS-DESCOBERTA.md`](./docs/PLANO-TEMAS-DESCOBERTA.md) | Arquitetura e conteúdo de detalhes temáticos; propostas editoriais aguardam revisão humana independente. |
| [`docs/PLANO-TITULOS-LEITURA-BIBLICA.md`](./docs/PLANO-TITULOS-LEITURA-BIBLICA.md) | Metadados editoriais no leitor; piloto do Salmo 119 implementado, revisão humana e QA visual/assistivo pendentes. |
| [`PLANO-CONTEUDO-ETAPAS-24-A-28.md`](./PLANO-CONTEUDO-ETAPAS-24-A-28.md) | Modelo e governança para expansão editorial; a execução segue o Ciclo 5 do plano mestre e a fila editorial. |

## Evidências, decisões e conteúdo

| Documento | Uso |
|---|---|
| [`docs/matriz-auditoria-responsiva.md`](./docs/matriz-auditoria-responsiva.md) | Evidência visual por rota, viewport, tema e limite da inspeção. |
| [`docs/inventario-estados-ui.md`](./docs/inventario-estados-ui.md) | Inventário de carregamento, erro, vazio, feedback e recuperação. |
| [`docs/auditoria-ux-novato.md`](./docs/auditoria-ux-novato.md) | Achados de usabilidade para visitantes novos e status das correções. |
| [`app/privacidade.tsx`](./app/privacidade.tsx) | Explicação ao usuário sobre armazenamento; não substitui aconselhamento jurídico. |
| [`docs/LICENCA-TEXTO-ACF.md`](./docs/LICENCA-TEXTO-ACF.md) | Proveniência e confirmação pendente de direitos para redistribuir a base ACF integral. |
| [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md) | Fila editorial, revisores, status e propostas ainda fora do catálogo. |
| [`docs/planos-publicados/`](./docs/planos-publicados/) | Fontes dos planos publicados e decisões editoriais relacionadas. |
| [`docs/contrato-editorial.md`](./docs/contrato-editorial.md), [`docs/criterios-editoriais.md`](./docs/criterios-editoriais.md) e [`docs/cobertura-editorial.md`](./docs/cobertura-editorial.md) | Modelo, critérios e cobertura automatizada; não equivalem a aprovação humana. |
| [Workflow de CI](./.github/workflows/ci.yml) | Configuração. Consultar o run registrado no plano mestre para evidência de execução. |

## Planos históricos e registros de design

Os arquivos abaixo preservam decisões, especificações e evidências antigas. Não
são fila atual; antes de reutilizar um item, reconciliar com o plano mestre.

| Documento | Conteúdo preservado |
|---|---|
| [`PLANO-MELHORIAS-UI-DESIGN.md`](./PLANO-MELHORIAS-UI-DESIGN.md) | Direção visual e registro de incrementos anteriores; não mantém prioridade própria. |
| [`PLANO-UX-INTERFACE-ETAPAS-11-A-15.md`](./PLANO-UX-INTERFACE-ETAPAS-11-A-15.md) e [`PLANO-UX-INTERFACE-ETAPAS-16-A-20.md`](./PLANO-UX-INTERFACE-ETAPAS-16-A-20.md) | Ciclos anteriores de busca, Salvos, Planos, estados e responsividade. |
| [`PLANO-EXECUCAO-5-ETAPAS.md`](./PLANO-EXECUCAO-5-ETAPAS.md), [`PLANO-EXECUCAO-ETAPAS-6-A-10.md`](./PLANO-EXECUCAO-ETAPAS-6-A-10.md) e [`PLANO-EXECUCAO-COMPLETO-CONTEUDO-UX-RELEASE.md`](./PLANO-EXECUCAO-COMPLETO-CONTEUDO-UX-RELEASE.md) | Ciclos antigos de implementação, CI, conteúdo e release. |
| [`PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md`](./PLANO-PROXIMOS-PASSOS-CONTEUDO-UX.md) | Ondas de conteúdo/UX substituídas pelo plano mestre e índice editorial. |
| [`PLANO-NAVEGACAO.md`](./PLANO-NAVEGACAO.md), [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md), [`PLANO-UI-COMPONENTES.md`](./PLANO-UI-COMPONENTES.md) e [`ESTUDO-UX-LEITURA.md`](./ESTUDO-UX-LEITURA.md) | Decisões e estudos de concepção; decisões fechadas também constam em `TODO.md`. |
| [`backend-log.md`](./backend-log.md) e [`frontend-log.md`](./frontend-log.md) | Relatos históricos de execução; não substituem código, estado atual ou CI. |

## Manutenção

- Quando a prioridade mudar, atualizar o plano mestre e o resumo de estado no
  mesmo incremento.
- Atualizar um plano especializado apenas com evidência da sua frente; indicar
  limitações e plataforma testada.
- Marcar planos substituídos como históricos e mantê-los acessíveis enquanto
  houver links ou decisões úteis; não duplicar suas filas no índice ativo.
- Distinguir implementação, verificação estrutural, inspeção visual, revisão
  humana, validação nativa e publicação.
- Validar links locais depois de reorganizar referências. Não mover arquivos sem
  atualizar todos os consumidores.
