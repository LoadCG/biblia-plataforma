# Plano de evolução de conteúdo — etapas 24 a 28

Roadmap posterior ao ciclo de UX/UI. O objetivo é aumentar profundidade,
variedade e utilidade editorial sem sacrificar consistência teológica,
licenciamento, performance offline ou qualidade dos dados derivados.

## Princípios editoriais

- Preservar Almeida ACF como texto bíblico principal e domínio público.
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

## Ordem de execução revisada

As trilhas de UX/confiabilidade (etapas 19–23) e conteúdo (24–28) podem
avançar em paralelo após a fundação. A publicação de conteúdo depende do gate
editorial da etapa 28, enquanto as telas e os planos existentes continuam
disponíveis. Builds nativos e Preview Vercel são gates de distribuição, não
pré-requisitos para inventariar ou revisar conteúdo localmente.

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

### 25.1 Definir portfólio `⬜`

- [ ] Planejar um plano curto de 7 dias para primeira experiência.
- [ ] Planejar um plano de 14 dias para temas de formação espiritual.
- [ ] Planejar um plano de 30 dias com progressão equilibrada.
- [ ] Avaliar um plano canônico de 90 dias somente após validar a operação.
- [ ] Evitar criar planos apenas por volume; cada um precisa de objetivo claro.

### 25.2 Especificar cada plano `⬜`

- [ ] Definir título, descrição, objetivo e público.
- [ ] Definir duração, carga diária e referências.
- [ ] Definir reflexão e pergunta por dia quando aplicável.
- [ ] Definir critérios de conclusão e retomada.
- [ ] Revisar distribuição entre Antigo e Novo Testamento.

### 25.3 Produzir e revisar `⬜`

- [ ] Criar conteúdo em arquivo fonte versionado.
- [ ] Validar todas as referências contra a base ACF.
- [ ] Fazer revisão teológica/editorial independente.
- [ ] Fazer revisão de linguagem, clareza e adequação do tom.
- [ ] Gerar dados derivados somente pelo script oficial.

**Aceite:** cada plano passa por schema, referências, revisão editorial e teste
de retomada antes de aparecer no catálogo.

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

## Estratégia de portfólio editorial

### Personas prioritárias

| Persona | Necessidade | Formato principal | Risco a evitar |
|---|---|---|---|
| Iniciante | começar sem sobrecarga | plano de 7 dias e resumos curtos | linguagem técnica sem explicação |
| Leitor regular | manter consistência | planos de 14/30 dias | carga diária imprevisível |
| Leitor temático | estudar um assunto | trilhas por tema com referências | seleção arbitrária de versículos |
| Leitor de contexto | entender um livro | resumo estruturado e referências | afirmar consenso onde há debate |
| Usuário recorrente | retomar de onde parou | progresso, histórico e próximo passo | perder estado ou repetir conteúdo |

### Portfólio mínimo recomendado

O catálogo deve crescer em camadas, com uma hipótese explícita por item:

1. **Entrada:** “Primeiros passos” (7 dias), carga baixa e referências curtas.
2. **Formação:** “Evangelhos essenciais” (14 dias), narrativa contínua.
3. **Prática:** “Salmos para cada dia” (30 dias), recorrência e reflexão.
4. **Panorama:** “Bíblia em 90 dias” (90 dias), somente após validar o modelo.

Cada proposta precisa declarar objetivo, público, carga diária, livros cobertos,
critério de conclusão e motivo editorial para existir. Não criar um plano apenas
para aumentar a contagem do catálogo.

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

- [ ] Revisar Gênesis, Salmos, Provérbios, Mateus, João e Romanos.
- [ ] Corrigir inconsistências estruturais nos resumos desses livros.
- [ ] Criar o plano de 7 dias com conteúdo aprovado.
- [ ] Validar o fluxo completo em preview antes de ampliar o lote.

**Propostas em revisão (2026-09-28):** primeira revisão editorial de Gênesis e
um plano piloto de 7 dias estão preparados em `docs/revisao-editorial/`.
Continuam fora do status aprovado/publicado até leitura humana independente;
somente o resumo revisado foi regenerado no JSON derivado nesta proposta.

**Continuação do lote C1 (2026-09-28):** Salmos, Provérbios, Mateus, João e
Romanos receberam uma primeira revisão factual/editorial. As propostas e fontes
estão em `docs/revisao-editorial/lote-c1-primeiros-cinco-livros.md`. Os cinco
resumos foram regenerados em `core/content/dados/livros.json`; continuam como
rascunhos até revisão humana independente e conferência visual no aplicativo.

### Lote C2 — profundidade `P1`

- [ ] Revisar Êxodo, Isaías, Jeremias, Lucas, Atos e Apocalipse.
- [ ] Criar um plano temático de 14 dias com referências cruzadas.
- [ ] Adicionar metadados de temas e termos de busca.
- [ ] Testar descoberta por Busca e páginas SEO.

**Propostas preparadas (2026-09-28):** a primeira revisão dos seis resumos e
um plano temático de 14 dias estão registrados em `docs/revisao-editorial/`.
As referências do plano foram validadas contra a base ACF local (28 trechos,
183 versículos, 8–19 por dia). Os conteúdos seguem em rascunho; pendem revisão
humana independente e inspeção visual antes de qualquer integração/publicação.
A taxonomia e os termos de busca associados também foram estruturados como
proposta em `docs/revisao-editorial/metadados-busca-proposta.md`; ainda não
foram integrados ao schema ou à busca do app.

### Lote C3 — escala controlada `P1`

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
