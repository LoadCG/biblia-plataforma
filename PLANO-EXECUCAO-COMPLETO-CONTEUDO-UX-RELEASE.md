# Plano de execução completo — conteúdo, UX, SEO e release

> **Status: plano anterior substituído em 2026-10-02.** Não usar como fila
> operacional paralela. A ordem atual está em
> [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md); a trilha
> editorial detalhada permanece em `PLANO-CONTEUDO-ETAPAS-24-A-28.md`.

Este plano detalha o próximo ciclo após a consolidação do contrato editorial e
dos gates automatizados. Ele transforma cinco frentes abertas em tarefas
executáveis, com dependências e critérios objetivos de saída.

## Regras de execução

- Toda alteração de conteúdo ocorre na fonte Markdown/JSON versionada; derivados
  são regenerados por script.
- Conteúdo editorial permanece `rascunho` ou `em-revisao` até duas leituras
  humanas independentes.
- Cada etapa termina com validação automatizada, revisão do diff e atualização
  documental no mesmo commit.
- Nenhum release é promovido sem preview, build reproduzível e rollback claro.

## Ordem de prioridade aprovada

| Prioridade | Frente | Motivo |
|---|---|---|
| P0 | Contrato, manifesto, relações e gates | Sem identidade e rastreabilidade não há publicação segura |
| P1 | Plano de 7 dias e revisão do piloto | Validar o fluxo ponta a ponta com escopo pequeno |
| P1 | Lotes C1/C2, busca e SEO | Melhorar valor de descoberta após o contrato |
| P2 | Plano de 14 e 30 dias | Escalar somente após validar a operação curta |
| P2 | Matriz UX, responsividade e leitores de tela | Consolidar qualidade antes do preview |
| P0 | Preview, build remoto e release | Gate final obrigatório para promoção |

### Execução iniciada

- [x] Tipar relações editoriais e validar IDs, duplicidades, destinos e motivos.
- [ ] Gerar manifesto completo para todos os conteúdos.
- [ ] Integrar relações aprovadas ao catálogo.

## Ordem macro e dependências

```text
Metadados e relações
        ├──> Planos 7/14/30 dias
        ├──> Resumos + busca/SEO
        └──> UX de descoberta e leitura
                    └──> Preview e release
```

| Fase | Frente | Dependência | Saída principal |
|---:|---|---|---|
| 1 | Metadados e relações editoriais | contrato v1 | manifesto editorial completo |
| 2 | Planos de leitura | manifesto + revisão | planos 7/14/30 especificados e validados |
| 3 | Resumos, busca e SEO | taxonomia | conteúdo revisado e descoberta rastreável |
| 4 | UX responsiva e acessibilidade | dados e telas | matriz de evidências por viewport/tecnologia assistiva |
| 5 | Preview, release e operação | fases 1–4 | publicação aprovada e reversível |

---

## Fase 1 — completar metadados e relações editoriais

### 1.1 Manifesto de conteúdo

- [ ] Definir o schema final de resumo, plano e devocional.
- [ ] Tornar obrigatórios `id`, `slug`, `versao`, `status`, `autor`, `revisor`,
  `dataAtualizacao` e `fontes` para novos itens.
- [ ] Definir formato de fonte: tipo, referência, URL, data de acesso e escopo.
- [ ] Definir regras de versionamento e correção sem apagar histórico.
- [ ] Criar exemplos válidos e inválidos no documento de contrato.
- [ ] Criar o manifesto com uma entrada por conteúdo publicável.

### 1.2 Taxonomia

- [ ] Fechar vocabulário de temas controlados.
- [ ] Fechar vocabulário de público: iniciante, regular, temático e contexto.
- [ ] Definir dificuldade e duração por faixa, sem usar apenas popularidade.
- [ ] Mapear gênero literário para os 66 livros.
- [ ] Definir sinônimos de busca e suas formas normalizadas.
- [ ] Impedir tags duplicadas, vazias ou fora do vocabulário.

### 1.3 Relações

- [ ] Criar relação plano → dia → referência.
- [ ] Criar relação resumo → livro → capítulo.
- [ ] Criar relação “leia também” com motivo editorial obrigatório.
- [ ] Criar relação tema → conteúdo com origem rastreável.
- [ ] Validar que relações apontam para IDs existentes.
- [ ] Detectar ciclos, duplicidades e recomendações redundantes.

### 1.4 QA e aceite

- [ ] Adicionar validação de schema e IDs ao CI.
- [ ] Gerar relatório de itens sem metadados.
- [ ] Atualizar `docs/contrato-editorial.md` e `DOCUMENTACAO.md`.
- [ ] Revisar o diff do manifesto com foco em compatibilidade.

**Aceite:** todo item novo tem identidade, status, versão, fonte e relações
válidas; o conteúdo legado possui estratégia de compatibilidade documentada.

---

## Fase 2 — criar e revisar planos de 7, 14 e 30 dias

### 2.1 Plano de 7 dias — entrada

- [ ] Definir público iniciante e objetivo de primeira experiência.
- [ ] Limitar carga diária e tempo estimado de leitura.
- [ ] Distribuir referências em progressão narrativa compreensível.
- [ ] Escrever título, descrição, reflexão, pergunta e próximo passo.
- [ ] Validar equilíbrio entre Antigo e Novo Testamento.
- [ ] Fazer duas revisões humanas independentes.
- [ ] Testar início, pausa, retomada e conclusão.

### 2.2 Plano de 14 dias — formação temática

- [ ] Escolher tema central e declarar a hipótese editorial.
- [ ] Definir arco em blocos, com começo, desenvolvimento e fechamento.
- [ ] Evitar referências isoladas sem contexto suficiente.
- [ ] Registrar relações cruzadas e justificativa de cada bloco.
- [ ] Conferir carga diária e repetição de livros.
- [ ] Fazer revisão bíblico-teológica e revisão de linguagem.
- [ ] Validar visualização do progresso e retomada.

### 2.3 Plano de 30 dias — recorrência

- [ ] Só iniciar após os planos de 7 e 14 dias passarem pelos gates.
- [ ] Definir calendário semanal e pontos de recuperação de atraso.
- [ ] Controlar variação de carga entre dias úteis e fins de semana.
- [ ] Evitar volume excessivo de capítulos por dia.
- [ ] Definir critérios de conclusão e reinício sem apagar histórico.
- [ ] Fazer amostragem editorial de todas as semanas.
- [ ] Testar performance, offline e persistência com 30 dias.

### 2.4 QA dos planos

- [ ] Validar IDs e duração.
- [ ] Validar sequência sem lacunas ou duplicidades.
- [ ] Validar livros, capítulos e versículos contra ACF local.
- [ ] Validar campos críticos não vazios.
- [ ] Validar status editorial antes da exposição no catálogo.
- [ ] Atualizar cobertura, changelog e documentação.

**Aceite:** cada plano tem objetivo, público, carga, referências válidas,
revisão independente e fluxo de retomada comprovado.

---

## Fase 3 — revisar resumos e melhorar busca/SEO

### 3.1 Priorização editorial

- [ ] Fechar Lote A: Gênesis, Salmos, Provérbios, Mateus, João e Romanos.
- [ ] Fechar Lote B: Êxodo, Isaías, Jeremias, Lucas, Atos e Apocalipse.
- [ ] Classificar os demais por gênero e inconsistência estrutural.
- [ ] Registrar risco, esforço e valor de descoberta por livro.

### 3.2 Template de resumo

- [ ] Padronizar contexto histórico e literário.
- [ ] Qualificar autoria e data quando houver debate.
- [ ] Separar narrativa, tradição interpretativa e aplicação.
- [ ] Conferir nomes, capítulos, versículos e relações internas.
- [ ] Definir tamanho proporcional ao gênero e à extensão do livro.
- [ ] Evitar transformar resumo em comentário exegético.
- [ ] Registrar fontes e questões abertas por lote.

### 3.3 Busca e descoberta

- [ ] Criar índice de termos por nome, abreviação, gênero, tema e sinônimo.
- [x] Criar vocabulário inicial de sinônimos temáticos controlados.
- [ ] Normalizar acentos, plural, hífen e variações ortográficas.
- [ ] Priorizar correspondência exata de livro antes de conteúdo amplo.
- [ ] Exibir trecho contextual sem duplicar o título.
- [ ] Testar consultas curtas, referências e termos temáticos.
- [ ] Adicionar filtros apenas quando houver dados confiáveis.
- [ ] Medir resultados vazios e consultas ambíguas sem coletar PII.

### 3.4 SEO e export

- [ ] Definir título, descrição e canonical por resumo e plano.
- [ ] Conferir headings, idioma, Open Graph e sitemap.
- [ ] Garantir conteúdo editorial útil no HTML estático.
- [ ] Preservar leitor interativo e deep links.
- [ ] Validar ausência de conteúdo duplicado entre rotas.
- [ ] Rodar export estático e auditoria de rotas.

**Aceite:** cada lote tem conteúdo revisado, busca reproduzível, metadados SEO
coerentes e páginas estáticas sem perda da experiência interativa.

---

## Fase 4 — validar UX, responsividade e leitores de tela

### 4.1 Matriz de dispositivos

- [ ] Testar 320×800, 375×812, 414×896, 768×1024 e desktop.
- [ ] Repetir nos temas claro e escuro.
- [ ] Repetir com fonte ampliada e movimento reduzido.
- [ ] Limpar storage entre cenários de onboarding e progresso.
- [ ] Registrar navegador, sistema, versão e densidade de pixels.

### 4.2 Jornadas prioritárias

- [ ] Primeiro acesso e escolha de plano.
- [ ] Busca por livro, sinônimo e termo temático.
- [ ] Abertura de resumo e navegação por referências.
- [ ] Início, pausa, retomada e conclusão de plano.
- [ ] Estado vazio, erro, carregamento e conteúdo indisponível.
- [ ] Uso offline após carregamento inicial.
- [ ] Deep link para resumo, plano e capítulo.

### 4.3 Acessibilidade

- [ ] Validar foco visível e ordem de tabulação.
- [ ] Validar nomes acessíveis de botões, cards, progresso e estados.
- [ ] Validar contraste e não dependência exclusiva de cor.
- [ ] Executar NVDA no Windows para web.
- [ ] Executar VoiceOver/TalkBack em dispositivo ou emulador quando disponível.
- [ ] Testar zoom/fonte ampliada sem clipping ou perda de ação.
- [ ] Registrar defeitos com rota, viewport, passos e severidade.

### 4.4 Aceite UX

- [ ] Corrigir todos os P0/P1.
- [ ] Reexecutar cenários afetados.
- [ ] Anexar matriz de evidências ao roadmap.
- [ ] Atualizar `FUNCIONALIDADES.md` com comportamento verificado.

**Aceite:** jornadas críticas são concluíveis em todos os viewports definidos,
sem overflow, ação inacessível ou perda de contexto.

---

## Fase 5 — preview, validação final e publicação

### 5.1 Pré-release local

- [ ] Confirmar working tree limpo e branch de release identificável.
- [ ] Rodar `npm run validate`.
- [ ] Rodar `npm run export:web`.
- [ ] Rodar `npm run check:static` sobre o export.
- [ ] Verificar rotas de resumos, planos, busca e Bíblia.
- [ ] Validar bundle sem erro de runtime no navegador.

### 5.2 Preview

- [ ] Publicar preview da branch de release.
- [ ] Verificar logs de build e runtime.
- [ ] Testar rotas diretamente e navegação interna.
- [ ] Validar SEO, sitemap, canonical e assets.
- [ ] Repetir jornadas de conteúdo e progresso.
- [ ] Registrar URL, commit, data e resultado do preview.

### 5.3 Gate de publicação

- [ ] Conteúdo aprovado por dois revisores.
- [ ] Nenhum item publicado com status inadequado.
- [ ] Build remoto verde.
- [ ] Preview aprovado visualmente.
- [ ] Changelog, cobertura e documentação atualizados.
- [ ] Plano de rollback definido pelo commit anterior.
- [ ] Merge para `master` autorizado.

### 5.4 Pós-publicação

- [ ] Verificar produção nas primeiras rotas críticas.
- [ ] Conferir logs e erros de runtime.
- [ ] Confirmar sitemap e páginas editoriais.
- [ ] Registrar resultado no estado do projeto.
- [ ] Abrir follow-ups somente para problemas reproduzíveis.

**Aceite:** release reproduzível, observável e reversível, com evidência
editorial, técnica e visual arquivada.

## Checklist final consolidado

- [ ] Metadados e relações editoriais completos.
- [ ] Planos de 7, 14 e 30 dias revisados e validados.
- [ ] Resumos dos lotes prioritários revisados.
- [ ] Busca, SEO e export estático verificados.
- [ ] UX testada nos cinco viewports e temas.
- [ ] Leitores de tela executados ou limitação registrada.
- [ ] Preview aprovado.
- [ ] Build remoto aprovado.
- [ ] Changelog e documentação atualizados.
- [ ] Merge e publicação executados.
