# Plano técnico — busca e descoberta

## Estado atual (5 de outubro de 2026)

**Status geral: parcialmente executado.** A busca existente funciona offline
para resumos de livros e já cobre nome, abreviações, texto editorial e alguns
sinônimos temáticos. A evolução para uma busca unificada por referências,
planos e temas ainda não começou.

Este documento diferencia o comportamento confirmado no código de propostas
que precisam de implementação. Não considera uma etapa concluída só por estar
descrita em outro plano.

### Já implementado

- Busca editorial em memória sobre os 66 resumos carregados pelo catálogo.
- Normalização de caixa e acentos.
- Alias de livros e abreviações.
- Correspondência por nome e por conteúdo editorial.
- Trecho contextual em resultados encontrados no conteúdo.
- Expansões temáticas controladas para esperança, oração, justiça, sabedoria e
  libertação.
- Pontuação ponderada para título exato, título parcial, termo literal e
  expansão temática; desempate por número do livro e slug.
- Testes unitários básicos de alias, sinônimo e repetibilidade.
- UI de Descubra que combina resultados bíblicos e resumos em áreas distintas.

Referências: `core/content/busca.ts`,
`core/content/__tests__/busca.test.ts`, `app/(tabs)/pesquisa.tsx` e
`core/biblia/BibliaAPI.ts`.

### Limites confirmados

- `buscarLivros` pesquisa somente resumos; não pesquisa planos nem referências
  como entidades tipadas.
- A busca bíblica global já possui implementação independente. Ainda não há
  contrato unificado entre ela e a busca editorial.
- A consulta é um termo normalizado, sem contrato de tamanho, estado inválido,
  múltiplos tokens ou stopwords.
- Aliases e sinônimos estão codificados em `busca.ts`, sem manifesto próprio,
  versão ou relatório de cobertura lexical.
- O trecho é encontrado procurando novamente os termos no resumo; não é
  selecionado por um ranking explícito de campos.
- Os testes da busca editorial são pequenos e não constituem conjunto dourado
  de relevância.
- Os documentos de auditoria registram verificações parciais de UI responsiva;
  quantidade, escopo e motivo dos resultados ainda precisam de revisão
  assistiva manual.
- Não há benchmark reproduzível de relevância ou latência web/nativa.

## Direção técnica

Manter busca local e determinística. Antes de construir um índice derivado,
medir a implementação existente e definir o escopo real de busca. O catálogo
atual de 66 resumos cabe em memória e o próprio `busca.ts` registra essa
decisão; um índice de build só deve ser adotado se medições ou a inclusão de
mais tipos de documento demonstrarem benefício claro.

Se necessário, o índice deverá ser derivado de fontes editoriais aprovadas,
nunca editado manualmente. Itens `rascunho`, `em-revisao` ou `arquivado` não
podem aparecer em resultados públicos. Nenhuma consulta pessoal deve ser
enviada a um serviço remoto.

### Objetivos

1. Tornar os resultados offline, reproduzíveis e explicáveis.
2. Preservar busca por nome, abreviação, tema e texto editorial.
3. Definir a integração entre busca bíblica, resumos, planos e temas sem
   misturar indevidamente entidades ou apresentar rascunhos.
4. Manter resposta interativa em web e nativo, com acessibilidade e testes.

### Fora do escopo

- Busca semântica remota ou envio de texto de consulta para telemetria.
- Fuzzy matching antes de existir conjunto de avaliação.
- Expor valores numéricos de score na interface.
- Indexar conteúdo sem status publicável.

## Contrato proposto

```ts
type ConsultaBusca = {
  texto: string;
  escopo?: "todos" | "biblia" | "resumos" | "planos" | "temas";
  limite?: number;
};

type ResultadoBusca = {
  id: string;
  tipo: "referencia" | "resumo" | "plano" | "tema";
  titulo: string;
  subtitulo?: string;
  trecho?: string;
  camposCoincidentes: Array<"titulo" | "alias" | "tema" | "conteudo" | "referencia">;
  score: number;
};
```

O contrato acima é uma proposta para discussão técnica; não descreve a API
atual. Regras a fechar antes de adotá-lo:

- Limite de caracteres e limite máximo de resultados.
- Estados distintos para consulta vazia, inválida e sem resultados.
- Normalização Unicode, caixa, espaços e pontuação, preservando números de
  capítulos e versículos.
- Semântica AND/OR para múltiplos termos e remoção de stopwords somente no
  cálculo de relevância.
- Filtros somente quando houver metadados e conteúdo suficientes.
- Compatibilidade com `buscarGlobal` e comportamento das telas existentes.

## Ranking e previsibilidade

A implementação atual já possui pontuação simples e desempate estável na
busca editorial. Os pesos abaixo são hipóteses para benchmark, não valores
aprovados:

| Sinal | Peso proposto |
|---|---:|
| Título exato | 1000 |
| Alias exato | 850 |
| Frase no título | 700 |
| Tema controlado | 500 |
| Referência exata | 500 |
| Frase no conteúdo | 300 |
| Token no conteúdo | 100 por token |

Antes de alterar pesos, criar consultas avaliadas e comparar resultados.
Desempates devem usar critérios explícitos e estáveis, sem depender da ordem
de enumeração de objetos.

## Fases e situação

### Fase A — contrato e vocabulário

- [x] Confirmar busca editorial e busca bíblica existentes como sistemas
  locais independentes.
- [x] Adicionar expansões temáticas iniciais no código.
- [ ] Definir contrato de consulta e resultado unificado ou registrar decisão
  explícita de manter os sistemas separados.
- [ ] Definir limites, estados de entrada e semântica de múltiplos termos.
- [ ] Migrar aliases e sinônimos para vocabulário versionado se isso facilitar
  revisão e cobertura; validar custo antes de criar estrutura nova.
- [ ] Criar conjunto dourado de consultas críticas.

### Fase B — qualidade da busca editorial

- [x] Dar pontuações diferentes para correspondência em título e conteúdo.
- [x] Usar desempates determinísticos na lista editorial.
- [ ] Evitar buscas repetidas no resumo ao selecionar o trecho vencedor.
- [ ] Cobrir entradas acentuadas, aliases, expansões e empates com testes.
- [ ] Tratar vazio, pontuação isolada, consultas extensas e resultados vazios.
- [ ] Avaliar consulta multi-token sem introduzir fuzzy matching por suposição.

### Fase C — unificação e descoberta

- [ ] Inventariar os contratos de `buscarLivros` e `buscarGlobal` e a UI em
  `/pesquisa`.
- [ ] Decidir quais tipos entram em cada escopo: referências, resumos, planos
  e temas publicados.
- [ ] Incluir somente conteúdo editorial publicado.
- [ ] Evitar duplicar resultados equivalentes entre busca bíblica e editorial.
- [ ] Ajustar trechos, rótulos e navegação para cada tipo de resultado.

### Fase D — acessibilidade e comportamento visual

- [ ] Anunciar quantidade e escopo com tecnologia assistiva.
- [ ] Revisar rótulo, título, motivo e ordem de resultados com leitor de tela.
- [ ] Confirmar teclado, carregamento, vazio, erro/retry e limpeza de consulta.
- [x] Há auditorias estruturais e visuais parciais registradas para Descubra.
- [ ] Concluir revisão manual em web e ao menos um ambiente nativo.

### Fase E — SEO e conteúdo estático

- [ ] Mapear páginas editoriais públicas e consultas prioritárias para título e
  descrição, sem transformar cada consulta arbitrária em rota indexável.
- [ ] Verificar canonical, sitemap e páginas sem conteúdo público.
- [ ] Exportar e validar rotas estáticas de resumo e plano.

### Fase F — benchmark e liberação

- [ ] Avaliar pelo menos 30 consultas com resultado esperado e justificativa.
- [ ] Medir precisão@5 e recall@10 no conjunto, documentando a metodologia.
- [ ] Medir p50/p95 em web e nativo antes de decidir por índice/debounce.
- [ ] Definir um limite de latência adequado ao catálogo; 100 ms é hipótese
  inicial, a confirmar por medição.
- [ ] Executar export estático, verificações SEO e revisão de UX.
- [ ] Bloquear regressões relevantes no CI quando o conjunto estiver estável.

## Consultas mínimas a avaliar

- `Gênesis`, `gn`, `genezis`.
- `esperança`, `oração`, `justiça`, `sabedoria`, `libertação`.
- `Salmos 119:1-32`.
- Caixa alta, acentos e espaços repetidos.
- Dois ou mais termos com correspondências separadas e parciais.
- Vazio, pontuação isolada e texto acima do limite definido.
- Consulta válida sem resultados e limpeza para recuperar a lista.
- Empates de conteúdo e repetição determinística.
- Verificação de que rascunhos não aparecem nos tipos elegíveis.
- Navegação por teclado e leitor de tela.

## Critérios de aceite

- Consultas do conjunto dourado retornam o alvo esperado no top 5, ou a
  divergência fica explicitamente justificada e aprovada.
- Resultado determinístico em execuções repetidas.
- Nenhum conteúdo não publicado aparece.
- Entrada inválida não lança exceção e mostra estado compreensível.
- Trecho, tipo e motivo correspondem ao campo vencedor.
- Busca disponível sem rede.
- Quantidade, título, escopo e estado vazio são compreensíveis com leitor de
  tela.
- Relevância e latência medidas; decisão de índice baseada nesses dados.
- Export estático e SEO das páginas públicas permanecem válidos.

## Próxima sequência de trabalho

1. Escrever o inventário dos contratos atuais e desenhar casos de integração
   entre busca bíblica e editorial.
2. Fechar consulta e resultado: unificar sob uma fachada ou preservar escopos
   independentes com apresentação coordenada.
3. Criar o conjunto dourado e testes de regressão antes de mudar ranking.
4. Corrigir consultas vazias/limites e reduzir trabalho repetido ao montar
   trechos.
5. Validar anúncio acessível e navegação por tipo de resultado.
6. Medir relevância/latência e só então decidir sobre manifesto, índice,
   debounce ou tolerância a erros.
7. Validar export e publicar após revisão dos resultados.
