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
| 24.x | Modelo editorial e taxonomia | P0 | nenhuma | contrato de conteúdo |
| 25.x | Novos planos de leitura | P1 | 24.x | catálogo ampliado |
| 26.x | Resumos melhorados | P0 | 24.x | profundidade por livro |
| 27.x | Devocionais e curadoria | P1 | 24–26.x | experiência guiada |
| 28.x | QA editorial e publicação | P0 | 25–27.x | conteúdo confiável |

---

## Etapa 24 — Modelo editorial e taxonomia

### 24.1 Inventário do conteúdo atual `⬜`

- [ ] Catalogar os 66 resumos por tamanho, estrutura e cobertura temática.
- [ ] Catalogar os 2 planos existentes, dias, referências e devocionais.
- [ ] Identificar campos ausentes, inconsistências de nomenclatura e duplicatas.
- [ ] Registrar quais conteúdos são fonte, derivados ou somente apresentação.

**Evidência:** relatório de cobertura versionado em `docs/` ou no próprio plano.

### 24.2 Contrato de dados `⬜`

- [ ] Definir schema para resumo: contexto, estrutura, temas e referências.
- [ ] Definir schema para plano: público, duração, objetivo, dias e tags.
- [ ] Definir schema para devocional: reflexão, pergunta, CTA e revisão.
- [ ] Definir IDs estáveis, slug, versão editorial e status de publicação.
- [ ] Adicionar validação automatizada sem acoplar conteúdo à UI.

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

## Definition of Done do ciclo de conteúdo

- [ ] Schema e taxonomia aprovados.
- [ ] Pelo menos dois novos planos publicados em preview.
- [ ] Primeiro lote de resumos revisado e renderizado.
- [ ] Devocionais com revisão e versionamento editorial.
- [ ] Gates automatizados e revisão humana registrados.
- [ ] Documentação, changelog e cobertura atualizados no mesmo commit.

