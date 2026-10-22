# Plano de evolução de conteúdo — etapas 24 a 28

Documento especializado de governança e modelo editorial, subordinado ao
plano mestre Q4. O objetivo é aumentar profundidade,
variedade e utilidade editorial sem sacrificar consistência teológica,
licenciamento, performance offline ou qualidade dos dados derivados.

**Status atualizado em 2026-10-15: referência especializada; fila antiga
reconciliada, expansão editorial ainda condicionada.** O catálogo contém 66
resumos e 5 planos; três
planos foram publicados por decisão explícita registrada, enquanto propostas
editoriais adicionais aguardam revisão humana independente. A prioridade e a
fila de execução do trimestre estão consolidadas no Ciclo 5 do
[`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md), e a fila de
rascunhos fica em [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md).
Este documento mantém critérios e modelo; não cria uma ordem paralela.
Atualização de 2026-10-14: a base ACF integral continua sendo a tradução
selecionada pelo produto, mas sua permissão de redistribuição está pendente de
confirmação documentada; consultar [`docs/LICENCA-TEXTO-ACF.md`](./docs/LICENCA-TEXTO-ACF.md).

## Princípios editoriais

- Preservar a decisão de produto de usar Almeida ACF como texto principal;
  não assumir domínio público nem redistribuição autorizada sem evidência
  registrada (ver `docs/LICENCA-TEXTO-ACF.md`).
- Separar claramente texto bíblico, resumo editorial, devocional e metadados.
- Não publicar conteúdo gerado sem revisão humana e rastreabilidade de fonte.
- Preferir lotes pequenos revisáveis a uma grande expansão sem controle.
- Manter conteúdo acessível offline e compatível com a busca existente.
- Evitar linguagem dogmática quando houver divergência interpretativa relevante.

## Matriz de prioridade

| ID | Entrega | Prioridade | Dependência | Resultado |
|---|---|---:|---|---|
| 24.x | Inventário, contrato e taxonomia | P0 | nenhuma | conteúdo atual mensurado e modelo versionável |
| 25.x | Primeiro lote de planos | P1 | 24.x; revisão humana | plano pequeno validado ponta a ponta |
| 26.x | Primeiro lote de resumos | P1 | 24.x; revisão humana | resumos prioritários com estrutura e fontes revisadas |
| 27.x | Devocionais e curadoria | P1 | 24.x; fluxo de revisão | conteúdo guiado rastreável e aprovado |
| 28.x | QA editorial contínuo | P0 | inicia em 24.x e acompanha cada lote | conteúdo confiável antes de cada publicação |

## Ordem de concepção original — substituída pelo plano mestre

Esta ordem foi escrita antes da consolidação do plano mestre Q4 e da publicação
excepcional de três planos. Ela registra a sequência originalmente planejada;
use o Ciclo 5 do plano mestre para prioridades atuais e o índice editorial para
materiais em revisão. Builds nativos e Preview Vercel são gates de distribuição,
não pré-requisitos para inventariar ou revisar conteúdo localmente.

1. **24.1 inventário** → publicar e manter `docs/cobertura-editorial.md`.
2. **24.2 contrato mínimo** → registrar campos obrigatórios e validações sem
   migrar todos os dados antes de validar o primeiro lote.
3. **28.1 QA automatizado** → validar estrutura e referências antes de renderizar.
4. **24.3 e 27.1–27.2 revisão editorial** → critérios, fontes, incertezas,
   responsável e versão para cada lote.
5. **26.1–26.3 lote piloto de resumos** e **25.1–25.3 plano piloto de 7 dias**
   → produzir pequenos lotes e obter revisão humana independente.
6. **28.2–28.3 preview e publicação** → publicar somente material aprovado;
   avaliar o ciclo antes de ampliar para planos de 14/30 dias e mais livros.

### Definição de pronto por etapa

- **24 — Fundação:** inventário reproduzível; contrato documentado; taxonomia
  compatível com o conteúdo vigente; itens sem dado inventado e com IDs/fontes.
- **25 — Planos:** carga diária medida; referências existentes no cânon; dias
  completos e sequenciais; retomada testada; revisão independente registrada.
- **26 — Resumos:** template aplicado por lote; afirmações contestáveis sinalizam
  incerteza; referências e links conferidos; renderização e busca verificadas.
- **27 — Devocionais:** reflexão, pergunta e próximo passo separados; fonte e
  status rastreáveis; revisão de clareza, tom e segurança concluída.
- **28 — QA/publicação:** schema e integridade automatizados; rubrica humana
  registrada; preview verificado; changelog e cobertura atualizados.

---

## Etapa 24 — Modelo editorial e taxonomia

### 24.1 Inventário do conteúdo atual `🔶`

- [x] Catalogar os 66 resumos por estrutura, testamento e cobertura básica.
- [x] Catalogar os 2 planos existentes, 21 dias e suas referências.
- [x] Identificar duplicidade de IDs/slugs e divergência entre fontes/derivados.
- [x] Gerar `docs/cobertura-editorial.md` como inventário reproduzível.
- [ ] Completar análise de profundidade, equilíbrio por gênero e cobertura temática.

**Evidência:** [`docs/cobertura-editorial.md`](./docs/cobertura-editorial.md),
gerado por `npm run relatorio:editorial`.
Fila de revisão humana: [`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md).
Gate de governança: `npm run check:revisao-editorial`.

### 24.2 Contrato de dados `🔶`

- [x] Validar schema estrutural derivado dos resumos: metadados, ficha e seis
  seções editoriais.
- [x] Validar schema atual de plano: ID, duração, dias, referências, reflexão
  e pergunta.
- [ ] Evoluir schema para público, objetivo, tags, versão editorial e status.
- [ ] Definir schema para devocional: reflexão, pergunta, CTA e revisão.
- [ ] Definir IDs estáveis, slug, versão editorial e status de publicação.
- [x] Adicionar validação automatizada sem acoplar conteúdo à UI.

### 24.3 Taxonomia e navegação `⬜`

- [ ] Definir tags de tema, dificuldade, duração e público.
- [ ] Definir taxonomia de gêneros e manter os nomes atuais compatíveis.
- [ ] Mapear relações entre plano, livro, capítulo, tema e resumo.
- [ ] Definir filtros futuros sem ampliar a interface antes da necessidade.

**Aceite:** qualquer item editorial consegue ser localizado por ID, fonte,
status e relações sem depender de parsing frágil do texto exibido.

---

## Etapa 25 — Novos planos de leitura

> **Reconciliado em 2026-10-15:** os três planos que apareciam como candidatos
> abaixo foram publicados em 2026-10-04 por decisão explícita, como exceção ao
> gate de duas revisões humanas. As caixas das etapas 25.1–25.4 preservam o
> planejamento original e não são uma fila ativa para redigir/publicar esses
> mesmos planos. Consulte o [plano mestre, Ciclo 5](./docs/PLANO-MESTRE-Q4-2026.md)
> para a prioridade editorial atual e o [índice de revisão](./docs/revisao-editorial/INDICE.md)
> para propostas ainda fora do catálogo. Nenhuma revisão independente é dada
> como concluída.

### Portfólio publicado e propostas futuras (decisão original de 2026-10-04)

O catálogo contém cinco itens. **Semana da Sabedoria** (7 dias) e **Os
Evangelhos em 14 Dias** formavam o catálogo inicial. **Primeiros passos: da
criação à esperança** (7 dias), **Justiça, cuidado e esperança** (14 dias) e
**Formação bíblica** (30 dias) foram publicados por exceção explícita. As fontes
vigentes dos três últimos estão em [`docs/planos-publicados/`](./docs/planos-publicados/).
As propostas não são tratadas como rascunhos fora do app; o registro da decisão e
da ausência de revisão humana independente permanece em
[`docs/revisao-editorial/INDICE.md`](./docs/revisao-editorial/INDICE.md).

| Ordem | Plano/candidato | Público e necessidade | Valor distinto | Decisão/estado |
|---:|---|---|---|---|
| 0 | Semana da Sabedoria — 7 dias | Leitor que quer começar por poesia e sabedoria | Jornada curta já publicada | Manter; usar como comparação de carga e retomada. |
| 0 | Os Evangelhos em 14 Dias | Leitor que busca uma leitura panorâmica de Jesus | Jornada narrativa já publicada | Manter; não criar outro plano genérico de Evangelhos. |
| 1 | Primeiros passos: da criação à esperança — 7 dias | Iniciante ou pessoa retomando a leitura | Um arco bíblico amplo, com trechos curtos e explicação de contexto | Publicado em 2026-10-04 por exceção explícita; sem revisão humana independente registrada. Fonte em `docs/planos-publicados/`. |
| 2 | Justiça, cuidado e esperança — 14 dias | Leitor temático interessado em dignidade, sofrimento, comunidade e esperança | Comparação de gêneros e passagens dos dois testamentos, preservando seus contextos | Publicado em 2026-10-04 por exceção explícita; sem revisão humana independente registrada. Fonte em `docs/planos-publicados/`. |
| 3 | Formação bíblica — 30 dias | Leitor regular após uma experiência curta | Progressão narrativa e temática de maior fôlego | Publicado em 2026-10-04 por exceção explícita; sem revisão humana independente registrada. Fonte em `docs/planos-publicados/`. |

**Decisão de portfólio:** não criar planos redundantes com os cinco itens atuais.
A proposta genérica “Evangelhos essenciais” foi removida porque duplicava
`evangelhos-14`. “Salmos para cada dia” sobrepõe a Semana da Sabedoria. Um plano
de 90 dias permanece adiado até haver evidência de necessidade; não se coletam
dados pessoais para essa avaliação.

### 25.1 Fechar hipótese e carga de cada candidato `⬜`

- [ ] Para o piloto de 7 dias, confirmar que o objetivo é introduzir a narrativa
  bíblica com trechos manejáveis, não resumir novamente os Evangelhos.
- [ ] Para o temático de 14 dias, definir perguntas de comparação sem tratar
  textos de épocas e gêneros distintos como se tivessem o mesmo contexto.
- [ ] Para o de 30 dias, escolher entre 30 sessões de leitura ou um calendário
  maior com dias opcionais. O modelo atual exige exatamente uma sessão para cada
  dia numerado; pausa sem referência não é suportada corretamente.
- [ ] Medir a carga usando palavras/versículos reais da ACF, e só então definir
  uma estimativa de tempo. Não prometer uma duração precisa sem medição.
- [ ] Registrar leituras repetidas entre planos com motivo editorial; repetir
  uma passagem pode ser válido, mas não deve ocorrer por conveniência do rascunho.
- [ ] Adiar filtros e categorias na interface enquanto a lista continuar curta;
  verificar apenas a clareza do título, descrição, duração e público.

### 25.2 Fechar contrato e integridade de dados `⬜`

- [ ] Tornar explícitos no conteúdo fonte o objetivo, público, tags, versão e
  status editorial de cada plano; preservar metadados dos dois planos existentes.
- [ ] Remover a publicação implícita baseada apenas em estar dentro do JSON do
  catálogo: somente itens aprovados entram em `core/content/dados/planos.json`.
- [ ] Expandir `verificar-planos-editoriais.js` para conferir início/fim de
  faixas contra a contagem de versículos de cada capítulo ACF. Hoje ele confirma
  livro e capítulo e início positivo, mas não detecta fim além do capítulo ou
  faixa invertida.
- [ ] Validar IDs e dias únicos, sequência completa, conteúdo obrigatório,
  referências não vazias, links navegáveis e duplicações não justificadas.
- [ ] Manter ID publicado e numeração dos dias imutáveis: o progresso local é
  armazenado por `planoId` e número do dia. Mudança estrutural em plano publicado
  exige versão/ID novo ou migração explícita, nunca renumeração silenciosa.
- [ ] Atualizar relações plano–livro em `core/content/relacoesCatalogo.ts` com
  justificativa editorial para as relações selecionadas.

### 25.3 Produzir por lotes e revisar independentemente `⬜`

- [ ] Trabalhar em arquivos fonte versionados na fila editorial; rascunhos não
  são importados pela interface nem pelo bundle offline publicado.
- [ ] Completar primeiro somente o piloto de 7 dias e submetê-lo a duas leituras
  humanas independentes: coerência bíblica, referências, clareza, carga e tom.
- [ ] Registrar decisão, revisores, versão e pendências resolvidas no item. Se
  houver divergência teológica relevante, contextualizar ou ajustar o escopo.
- [ ] Depois do piloto aprovado, revisar o plano temático de 14 dias. Atenção a
  luto, ansiedade, injustiça e abuso: perguntas não devem culpar a pessoa,
  substituir apoio profissional ou sugerir que fé elimina sofrimento.
- [ ] Só então completar o plano de 30 dias, usando um currículo distinto e uma
  regra de recuperação que o produto consiga representar sem corromper progresso.
- [ ] Promover para o catálogo apenas após aprovação humana explícita e gates
  técnicos; atualizar cobertura editorial e changelog no mesmo incremento.

### 25.4 Validar experiência e publicação de cada lote `⬜`

- [ ] Testar leitura inicial, avanço entre referências, fechamento/retorno ao
  detalhe, retomada da sessão, conclusão e desmarcação do dia.
- [ ] Confirmar que incluir planos novos não altera o progresso dos dois planos
  existentes e que IDs distintos não compartilham sessões.
- [ ] Conferir rota direta e refresh das páginas estáticas geradas a partir do
  catálogo, referências clicáveis, funcionamento offline e layouts web estreitos
  e largos em claro/escuro.
- [ ] Não declarar QA visual mobile nativo sem executar esse ambiente; manter a
  validação responsiva web, pois as telas são compartilhadas.
- [ ] Publicar lote pequeno, observar problemas de qualidade e só depois liberar
  o próximo. Não adicionar mecanismos de ranking, sequência punitiva ou metas
  obrigatórias.

**Aceite por plano:** objetivo e público distinguíveis dos itens publicados;
carga conferida; todas as referências dentro da ACF; conteúdo diário completo;
duas revisões humanas independentes registradas; status publicado explícito;
teste de retomada e progresso isolado; rota, exportação, offline e apresentação
responsiva verificados. Nenhum rascunho avança por passar apenas na validação
automática.

---

## Etapa 26 — Resumos bíblicos melhorados

### 26.1 Definir template editorial `⬜`

- [ ] Padronizar contexto histórico e literário.
- [ ] Padronizar autoria/data quando houver consenso ou sinalizar incerteza.
- [ ] Padronizar estrutura do livro e temas principais.
- [ ] Padronizar resumo por seção sem transformar o texto em comentário exegético.
- [ ] Padronizar referências internas clicáveis.

### 26.2 Classificar os 66 livros `⬜`

- [ ] Lote A: livros com maior uso e maior demanda de busca.
- [ ] Lote B: livros com estrutura inconsistente.
- [ ] Lote C: livros curtos que precisam de enriquecimento proporcional.
- [ ] Registrar tamanho alvo por gênero, não um número rígido universal.

### 26.3 Revisar por lote `⬜`

- [ ] Revisar conteúdo sem remover informação válida existente.
- [ ] Corrigir afirmações históricas excessivamente categóricas.
- [ ] Conferir nomes próprios, referências e coerência entre seções.
- [ ] Adicionar temas e conexões somente com justificativa editorial.
- [ ] Atualizar fonte Markdown, nunca o JSON derivado manualmente.

### 26.4 Melhorar descoberta `⬜`

- [ ] Criar metadados de resumo para busca e SEO.
- [ ] Definir sinônimos e termos de busca semânticos.
- [ ] Exibir “leia também” apenas quando a relação for editorialmente válida.
- [ ] Evitar recomendações repetitivas ou baseadas somente em popularidade.

**Aceite:** um lote só é concluído quando conteúdo, referências, busca e
renderização passam pelos gates automatizados e revisão humana.

---

## Etapa 27 — Devocionais e curadoria

### 27.1 Padrão de devocional `⬜`

- [ ] Definir limite de palavras e tempo de leitura.
- [ ] Separar reflexão, pergunta e próximo passo.
- [ ] Definir política para citações e atribuição de fontes.
- [ ] Evitar promessas de resultado, aconselhamento clínico ou linguagem de
  autoridade indevida.

### 27.2 Curadoria editorial `⬜`

- [ ] Criar status: rascunho, revisão, aprovado, publicado, arquivado.
- [ ] Registrar autor/revisor, data e versão editorial.
- [ ] Criar checklist de coerência bíblica, clareza e inclusão.
- [ ] Definir processo de correção sem apagar histórico.

### 27.3 Integração com UX `⬜`

- [ ] Exibir reflexão sem competir com o texto bíblico.
- [ ] Permitir retomar o dia sem perder o ponto de leitura.
- [ ] Expor pergunta e CTA com semântica acessível.
- [ ] Garantir estado vazio quando um dia ainda não tiver conteúdo aprovado.

---

## Etapa 28 — QA editorial e publicação

### 28.1 Validação automatizada `⬜`

- [ ] Validar schema dos arquivos fonte.
- [ ] Validar slugs e IDs únicos.
- [ ] Validar referências bíblicas existentes.
- [ ] Validar ausência de campos vazios críticos.
- [ ] Validar conteúdo derivado no CI.

### 28.2 Revisão humana `⬜`

- [ ] Revisar cada lote por pelo menos duas passagens independentes.
- [ ] Registrar decisões controversas ou incertezas históricas.
- [ ] Fazer leitura final em mobile e desktop.
- [ ] Confirmar contraste, quebras de linha e referências clicáveis.

### 28.3 Release editorial `⬜`

- [ ] Publicar primeiro em branch/preview.
- [ ] Validar páginas de resumo e planos no export estático.
- [ ] Confirmar busca, offline e deep links.
- [ ] Atualizar changelog e cobertura editorial.
- [ ] Promover para produção somente após aprovação do lote.

---

## Estratégia de portfólio editorial — registro anterior

O material abaixo foi escrito antes da decisão de publicação excepcional dos
três planos em 2026-10-04. Use-o como contexto de produto, não como status dos
planos. O status atual e a fila humana ficam no plano mestre Q4 e no índice de
revisão editorial.

### Personas prioritárias

| Persona | Necessidade | Formato principal | Risco a evitar |
|---|---|---|---|
| Iniciante | começar sem sobrecarga | plano de 7 dias e resumos curtos | linguagem técnica sem explicação |
| Leitor regular | manter consistência | planos de 14/30 dias | carga diária imprevisível |
| Leitor temático | estudar um assunto | trilhas por tema com referências | seleção arbitrária de versículos |
| Leitor de contexto | entender um livro | resumo estruturado e referências | afirmar consenso onde há debate |
| Usuário recorrente | retomar de onde parou | progresso, histórico e próximo passo | perder estado ou repetir conteúdo |

### Portfólio mínimo recomendado

Aplicar as decisões da seção **Portfólio publicado e propostas futuras** da
etapa 25 acima. “Evangelhos essenciais” duplicava um plano já publicado, e
“Salmos para cada dia” não tinha currículo próprio nem regra clara em relação à
Semana da Sabedoria. O plano de 90 dias permanece adiado.

Cada proposta precisa declarar objetivo, público, carga diária, livros cobertos,
critério de conclusão, distinção dos planos publicados e motivo editorial para
existir. Não criar um plano apenas para aumentar a contagem do catálogo.

## Backlog editorial priorizado

### Lote C0 — fundação `P0`

- [ ] Definir schema, manifesto editorial e vocabulário controlado.
- [x] Inventariar estruturalmente os 66 resumos e os planos existentes com script reproduzível.
- [ ] Criar checklist de revisão e política de fontes.
- [ ] Escolher dois revisores responsáveis pelo primeiro lote.

O inventário é produzido por `npm run relatorio:editorial` e validado no CI por
`npm run check:editorial`. Ele verifica cobertura estrutural; não substitui
revisão de conteúdo, validação de referências bíblicas ou aprovação teológica.

### Lote C1 — ganho rápido `P0`

**Registro histórico:** o plano de 7 dias preparado nesta etapa foi publicado
por exceção em 2026-10-04; a publicação não comprova revisão humana independente.
As propostas de resumos continuam na fila editorial indicada acima.

- [ ] Revisar Gênesis, Salmos, Provérbios, Mateus, João e Romanos.
- [ ] Corrigir inconsistências estruturais nos resumos desses livros.
- [ ] Criar o plano de 7 dias com conteúdo aprovado.
- [ ] Validar o fluxo completo em preview antes de ampliar o lote.

**Propostas em revisão (2026-09-28; status reconciliado):** a primeira revisão
editorial de Gênesis continua na fila humana. O plano piloto de 7 dias foi
publicado por exceção e sua fonte atual está em `docs/planos-publicados/`; não
registrar a publicação como revisão independente.

**Continuação do lote C1 (2026-09-28):** Salmos, Provérbios, Mateus, João e
Romanos receberam uma primeira revisão factual/editorial. As propostas e fontes
estão em `docs/revisao-editorial/lote-c1-primeiros-cinco-livros.md`. Os cinco
resumos foram regenerados em `core/content/dados/livros.json`; continuam como
rascunhos até revisão humana independente e conferência visual no aplicativo.

### Lote C2 — profundidade `P1`

**Registro histórico:** o plano temático de 14 dias foi publicado por exceção
em 2026-10-04; isso não equivale a duas revisões humanas independentes. Use o
índice editorial para propostas de resumo, busca e temas que ainda não entraram
no catálogo.

- [ ] Revisar Êxodo, Isaías, Jeremias, Lucas, Atos e Apocalipse.
- [ ] Criar um plano temático de 14 dias com referências cruzadas.
- [ ] Adicionar metadados de temas e termos de busca.
- [ ] Testar descoberta por Busca e páginas SEO.

**Propostas preparadas (2026-09-28; status reconciliado):** a primeira revisão
dos seis resumos permanece em `docs/revisao-editorial/`. O plano temático de 14
dias está publicado por exceção em `docs/planos-publicados/`; suas referências
foram validadas contra a base ACF local (28 trechos, 183 versículos, 8–19 por
dia), sem revisão humana independente registrada.
A taxonomia e os termos de busca associados também foram estruturados como
proposta em `docs/revisao-editorial/metadados-busca-proposta.md`; ainda não
foram integrados ao schema ou à busca do app.

### Lote C3 — escala controlada `P1`

**Registro histórico:** o plano de 30 dias também foi publicado por exceção em
2026-10-04 e está em `docs/planos-publicados/`. A publicação não encerrou as
pendências de carga, QA e revisão humana independente.

- [ ] Revisar os demais livros por gênero, não por volume uniforme.
- [ ] Criar o plano de 30 dias somente após o C1/C2 passarem nos gates.
- [ ] Avaliar recomendações relacionadas com curadoria explícita.
- [ ] Medir conclusão, abandono e retomada de forma agregada e sem PII.

## Templates editoriais

### Ficha de plano

```text
id:
titulo:
descricao_curta:
objetivo:
publico:
duracao_dias:
carga_diaria_minutos:
livros_cobertos:
tags:
versao_editorial:
status: rascunho | revisao | aprovado | publicado | arquivado
revisor:
```

Cada dia deve conter: título curto, referências válidas, reflexão opcional,
pergunta de aplicação e próximo passo. A carga deve ser verificável pela
quantidade de capítulos/versículos, não apenas declarada no texto.

### Ficha de resumo

```text
livro:
genero:
testamento:
contexto_historico:
contexto_literario:
estrutura:
temas_principais:
palavras_chave:
referencias_relacionadas:
incertezas_editoriais:
versao_editorial:
revisor:
```

O resumo deve responder: o que é o livro, como está organizado, quais temas
aparecem e como começar a leitura. Não deve substituir comentário exegético nem
apresentar interpretação particular como fato consensual.

### Ficha de devocional

```text
dia:
titulo:
reflexao: 80–180 palavras
pergunta: 1 pergunta aberta
proximo_passo: 1 ação concreta e não coercitiva
referencias:
fonte_ou_observacao:
status:
revisor:
```

Evitar promessas de cura, aconselhamento clínico, culpa, manipulação emocional
ou afirmações de autoridade espiritual não atribuídas.

## Rubrica de revisão editorial

Pontuar cada dimensão de 0 a 2: `0` falha, `1` precisa revisão, `2` aprovado.

| Dimensão | Pergunta de avaliação |
|---|---|
| Fidelidade | O texto respeita as referências e não inventa fatos? |
| Clareza | Uma pessoa fora do contexto entende a proposta? |
| Estrutura | Há começo, desenvolvimento e próximo passo identificáveis? |
| Linguagem | O tom é acolhedor, preciso e sem jargão desnecessário? |
| Inclusão | Evita generalizações, culpa e pressupostos sobre a pessoa? |
| Rastreabilidade | Fonte, revisor, versão e incertezas estão registrados? |
| Produto | O conteúdo cabe no tempo e no fluxo da tela? |

**Regra de aprovação:** nenhum item crítico pode receber 0; média mínima 1,7;
qualquer dimensão abaixo de 2 exige comentário do revisor.

## Pipeline editorial e versionamento

1. **Proposta:** registrar hipótese, público, objetivo e escopo.
2. **Rascunho:** produzir em arquivo fonte, sem alterar derivados.
3. **Revisão estrutural:** schema, referências, slugs e campos obrigatórios.
4. **Revisão editorial:** duas passagens independentes e rubrica preenchida.
5. **Preview:** gerar conteúdo derivado, exportar web e revisar UI.
6. **Aprovação:** registrar revisor, versão, data e decisão.
7. **Publicação:** promover lote inteiro; não misturar rascunhos com aprovados.
8. **Pós-publicação:** monitorar erros, feedback e necessidade de correção.

### Política de versões

- Alteração factual ou estrutural: incrementar versão maior do item.
- Correção textual sem mudança de sentido: incrementar versão menor.
- Correção de typo em fonte publicada: registrar no changelog editorial.
- Nunca apagar silenciosamente uma versão publicada; arquivar e substituir.
- O JSON derivado deve ser reproduzível a partir das fontes e do manifesto.

## Métricas de conteúdo

As métricas devem ser agregadas e opcionais, sem capturar texto pessoal nem
criar dependência de backend:

- cobertura: livros, planos, dias e devocionais aprovados;
- qualidade: média da rubrica e pendências por lote;
- descoberta: buscas que encontram resumo/plano relevante;
- ativação: início e conclusão do primeiro dia;
- retenção: retomada do próximo dia, sem tratar streak como obrigação;
- estabilidade: falhas de parsing, referências inválidas e erros de renderização.

Não usar conclusão, streak ou abandono como julgamento moral do leitor. Métricas
servem para melhorar clareza, carga e descoberta do conteúdo.

## Cadência de execução

- **Ciclo semanal:** um lote pequeno de conteúdo + revisão + preview.
- **Checkpoint quinzenal:** revisar métricas agregadas e priorização.
- **Release mensal:** publicar somente lotes aprovados e documentados.
- **Retrospectiva:** registrar o que gerou retrabalho e ajustar o template.

## Definition of Done do ciclo de conteúdo

- [ ] Schema e taxonomia aprovados.
- [ ] Pelo menos dois novos planos publicados em preview.
- [ ] Primeiro lote de resumos revisado e renderizado.
- [ ] Devocionais com revisão e versionamento editorial.
- [ ] Gates automatizados e revisão humana registrados.
- [ ] Documentação, changelog e cobertura atualizados no mesmo commit.
