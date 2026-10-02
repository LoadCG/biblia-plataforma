# Plano de próximos passos — conteúdo, UX e publicação

> **Status: ondas históricas substituídas em 2026-10-02.** Use
> [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md) para a ordem
> atual e `PLANO-CONTEUDO-ETAPAS-24-A-28.md` para os critérios editoriais.

Plano operacional posterior às etapas 24–28. O objetivo é converter os
rascunhos editoriais em incrementos aprováveis, melhorar a descoberta do
conteúdo e validar a experiência de leitura antes de ampliar o catálogo.

## Objetivos do ciclo

- Concluir a fundação editorial sem integrar material não aprovado.
- Validar um lote pequeno ponta a ponta, da fonte Markdown ao preview.
- Melhorar descoberta, contexto e retomada sem sobrecarregar a interface.
- Criar evidência reproduzível para cada decisão editorial e de UX.

## Ordem executiva

| Onda | Escopo | Dependências | Saída |
|---|---|---|---|
| 1 | Fechar contrato editorial e taxonomia | Inventário atual | schema versionável e matriz de tags |
| 2 | Revisar o piloto | Revisores humanos | primeiro lote aprovado ou devolvido |
| 3 | Integrar um plano de 7 dias | Onda 2 aprovada | plano publicado em preview, com retomada validada |
| 4 | Melhorar descoberta e leitura | Metadados do piloto | busca, filtros e relações verificadas |
| 5 | Escalar lotes editoriais | Gates 1–4 verdes | calendário de publicação e backlog priorizado |

## Onda 1 — contrato e taxonomia

### Checklist

- [ ] Definir `statusEditorial`: `rascunho`, `em-revisao`, `aprovado`, `publicado`, `arquivado`.
- [ ] Definir `versaoEditorial`, `autor`, `revisor`, `dataRevisao` e `fontes`.
- [ ] Definir tags controladas para tema, público, duração e dificuldade.
- [ ] Mapear relações entre livro, resumo, plano, dia e referência.
- [ ] Atualizar o schema TypeScript sem quebrar os dados vigentes.
- [ ] Validar IDs estáveis, slugs e migração do JSON derivado.
- [ ] Documentar exemplos válidos e inválidos.

### Critério de aceite

Um item editorial é localizável por ID, status, versão, fonte e relações sem
depender de parsing do texto renderizado. `npm run validate` permanece verde.

## Onda 2 — revisão do lote piloto

### Checklist

- [ ] Designar dois revisores independentes para `01-genesis.md`.
- [ ] Aplicar os oito eixos de `docs/criterios-editoriais.md`.
- [ ] Registrar divergências, incertezas e decisão por seção.
- [ ] Conferir nomes próprios, referências e afirmações históricas.
- [ ] Fazer revisão de clareza, tom, inclusão e legibilidade.
- [ ] Registrar decisão: aprovado, aprovado com ajustes ou devolvido.
- [ ] Atualizar o índice de revisão sem alterar o catálogo antes da aprovação.
- [x] Executar pré-validação estrutural e de referências-chave do piloto.

### Critério de aceite

O piloto possui duas leituras registradas, pendências resolvidas e decisão
explícita. Se aprovado, o arquivo fonte é a única origem da integração.

Pré-validação automatizada: `npm run check:piloto-editorial`. Ela não substitui
as duas leituras humanas nem altera o status do conteúdo.

## Onda 3 — primeiro plano de leitura

### Checklist

- [x] Selecionar o plano de 7 dias existente como piloto funcional (`sabedoria-7`).
- [ ] Conferir progressão, carga diária e equilíbrio entre testamentos.
- [ ] Validar cada referência contra a base ACF.
- [x] Definir público e duração no contrato editorial de compatibilidade.
- [ ] Integrar somente após aprovação editorial independente.
- [ ] Testar início, retomada, conclusão e estado vazio no web e nativo.
- [ ] Verificar acessibilidade, deep link e persistência offline.
- [ ] Validar preview e atualizar cobertura/changelog.

### Critério de aceite

Uma pessoa consegue iniciar, interromper e retomar o plano sem perder contexto;
nenhuma tela exibe conteúdo com status diferente de `aprovado`.

## Onda 4 — descoberta e experiência de leitura

### Checklist

- [ ] Implementar metadados editoriais no contrato aprovado.
- [ ] Exibir duração, público e tema de forma escaneável nos cards.
- [ ] Adicionar relações “leia também” somente para vínculos revisados.
- [ ] Melhorar busca com sinônimos controlados e termos de referência.
- [ ] Preservar estados de carregamento, erro, vazio e conteúdo indisponível.
- [ ] Testar teclado, leitor de tela, contraste e telas estreitas.
- [ ] Medir cliques até iniciar um plano e retomada do último ponto.
- [ ] Registrar evidências no inventário de UI e no relatório editorial.

### Critério de aceite

O usuário identifica objetivo, duração e próximo passo sem abrir múltiplas
telas; relações e termos de busca têm justificativa editorial rastreável.

## Onda 5 — escala e publicação

### Checklist

- [ ] Priorizar lotes C1 e C2 conforme uso, risco e esforço de revisão.
- [ ] Abrir uma fila por lote com responsável, revisor e prazo.
- [ ] Executar `npm run check:content`, `check:editorial` e
  `check:revisao-editorial` em cada mudança.
- [ ] Rodar `npm run validate` e export web antes do preview.
- [ ] Fazer leitura final em mobile e desktop.
- [ ] Atualizar `DOCUMENTACAO.md`, `CHANGELOG.md` e cobertura editorial.
- [ ] Publicar somente após aprovação do lote e verificação do preview.
- [ ] Arquivar decisões e manter histórico de correções.

### Critério de aceite

Cada release editorial tem diff revisável, validações verdes, revisão humana
registrada, preview conferido e rollback possível pelo histórico Git.

## Backlog posterior

Após o primeiro plano aprovado: plano temático de 14 dias, plano de 30 dias,
resumos C1/C2, recomendações relacionadas e eventual trilha de 90 dias. A
expansão só começa quando a operação do piloto estiver estável.

## Gates obrigatórios

1. Fonte Markdown versionada.
2. Schema e referências válidos.
3. Dupla revisão humana para conteúdo sensível.
4. `npm run validate` verde.
5. Preview web e fluxos offline verificados.
6. Changelog, cobertura e documentação atualizados.
