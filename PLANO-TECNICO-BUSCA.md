# Plano técnico rigoroso — sistema de busca

## 1. Diagnóstico do estado atual

### Implementado

- Busca local em memória sobre os 66 resumos.
- Normalização Unicode, acentos, caixa e espaços.
- Aliases de livros e abreviações.
- Busca por nome e conteúdo editorial.
- Trecho contextual para resultados encontrados no conteúdo.
- Sinônimos temáticos controlados.
- Cobertura por testes unitários e execução offline.

### Riscos atuais

- A busca retorna apenas livros; não há resultado por plano, tema ou referência
  como entidades de primeira classe.
- A ordem de resultados de conteúdo depende da ordem do catálogo, não de um
  score explícito por campo, proximidade ou cobertura de tokens.
- `encontrarTrecho` varre o documento repetidamente para cada termo.
- Aliases e sinônimos estão no código, sem manifesto versionado e sem relatório
  de cobertura lexical.
- Não há contrato formal para consulta inválida, stopwords, pluralização,
  tolerância a erro de digitação ou múltiplos termos.
- Não existe telemetria agregada de consultas vazias; decisões de expansão ficam
  sem evidência de uso.
- A acessibilidade da lista é coberta estruturalmente, mas não há teste manual
  com leitor de tela nem anúncio explícito de quantidade e ordenação dos
  resultados.

## 2. Objetivos e não objetivos

### Objetivos

1. Entregar resultados relevantes e determinísticos offline.
2. Preservar busca por nome, abreviação, tema e texto editorial.
3. Explicar por que cada resultado apareceu com campo de origem e trecho.
4. Manter latência interativa em web e nativo sem backend obrigatório.
5. Garantir comportamento acessível, testável e reproduzível.

### Não objetivos

- Busca semântica baseada em modelo remoto.
- Coleta de texto bruto de consultas ou dados pessoais.
- Ranking opaco impossível de explicar ao usuário.
- Indexação de conteúdo não aprovado editorialmente.

## 3. Arquitetura-alvo

```text
Fontes aprovadas
  ├── resumos Markdown
  ├── planos e manifesto editorial
  └── vocabulário controlado
          ↓ build
Índice de busca versionado
  ├── documento
  ├── campos normalizados
  ├── tokens e aliases
  ├── peso por campo
  └── status publicado
          ↓ runtime offline
Consulta → normalização → expansão controlada → ranking → trecho → UI
```

O índice deve ser derivado, nunca editado manualmente. Conteúdo com status
`rascunho`, `em-revisao` ou `arquivado` não entra no índice público.

## 4. Contratos técnicos

### Consulta

```ts
type ConsultaBusca = {
  texto: string;
  escopo?: "todos" | "resumos" | "planos" | "referencias";
  filtro?: { testamento?: string; genero?: string; tema?: string };
  limite?: number;
};
```

Regras:

- Limitar consulta a 120 caracteres.
- Normalizar Unicode NFD, caixa, espaços e pontuação periférica.
- Preservar números de capítulo/versículo.
- Remover stopwords apenas no ranking, nunca do texto exibido.
- Retornar estado distinto para vazio, inválido e sem resultados.

### Resultado

```ts
type ResultadoBusca = {
  id: string;
  tipo: "resumo" | "plano" | "referencia";
  titulo: string;
  subtitulo?: string;
  trecho?: string;
  camposCoincidentes: Array<"titulo" | "alias" | "tema" | "conteudo" | "referencia">;
  score: number;
};
```

O `score` serve para ordenar internamente e testar regressões; a UI não deve
exibir um número sem uma explicação útil.

## 5. Ranking determinístico

Pontuação inicial proposta:

| Sinal | Peso |
|---|---:|
| título exato | 1000 |
| alias/abreviação exato | 850 |
| frase inteira no título | 700 |
| tema controlado | 500 |
| referência exata | 500 |
| frase inteira no conteúdo | 300 |
| token no conteúdo | 100 por token |
| trecho mais curto/proximal | bônus até 50 |

Desempates obrigatórios: score decrescente, tipo na ordem resumo → plano →
referência, número canônico crescente e ID lexicográfico. O resultado nunca pode
depender da ordem incidental de iteração de um objeto.

## 6. Fases de implementação

### Fase A — contrato e observabilidade local

- [ ] Extrair `ConsultaBusca` e `ResultadoBusca` para módulo próprio.
- [ ] Versionar aliases, sinônimos, stopwords e pesos em manifesto.
- [x] Criar códigos de motivo: `titulo`, `alias`, `tema`, `conteudo`.
- [ ] Definir limites de entrada e mensagens de estado.
- [ ] Criar fixtures determinísticas para consultas críticas.

### Fase B — índice derivado

- [ ] Criar `scripts/gerar-indice-busca.js`.
- [ ] Indexar somente itens publicados do manifesto.
- [ ] Normalizar campos uma vez no build.
- [ ] Persistir versão do índice e hash das fontes.
- [ ] Validar IDs, tokens, campos vazios e tamanho do índice.
- [ ] Integrar geração ao `check:content`/CI sem editar o JSON de conteúdo.

### Fase C — ranking e consulta

- [x] Implementar ranking inicial ponderado e desempates estáveis para resumos.
- [ ] Suportar consulta de múltiplos tokens.
- [ ] Suportar aliases e sinônimos sem duplicar resultados.
- [ ] Adicionar busca por referência `Livro capítulo:versículo`.
- [ ] Definir tolerância a erro de digitação somente após benchmark.
- [ ] Garantir limite de resultados e custo O(tokens × documentos).

### Fase D — trechos e interface

- [ ] Gerar trecho a partir do campo vencedor.
- [ ] Destacar tokens sem alterar o texto semântico para leitor de tela.
- [ ] Anunciar quantidade e escopo dos resultados.
- [ ] Adicionar filtros apenas quando houver dados suficientes.
- [ ] Implementar debounce somente se medição justificar.
- [ ] Preservar busca offline e estado de erro recuperável.

### Fase E — SEO e páginas editoriais

- [ ] Mapear consultas prioritárias para títulos e descrições SEO.
- [ ] Garantir que páginas estáticas tenham conteúdo indexável.
- [ ] Evitar canonical duplicado e páginas sem resultado indexáveis.
- [ ] Validar sitemap e rotas de resumo/plano após cada mudança.

### Fase F — benchmark e regressão

- [ ] Criar conjunto dourado de pelo menos 30 consultas.
- [ ] Definir resultado esperado e justificativa para cada consulta.
- [ ] Medir precisão@5, recall@10 e taxa de consultas vazias.
- [ ] Medir latência p50/p95 no web e nativo.
- [ ] Bloquear regressão de relevância no CI.

## 7. Casos de teste obrigatórios

- `Gênesis`, `gn`, `genezis`.
- `esperança`, `oracao`, `justiça`, `sabedoria`.
- `Salmos 119:1-32`.
- Consulta com acentos, caixa alta e espaços repetidos.
- Consulta com vários tokens parcialmente encontrados.
- Consulta vazia, somente pontuação e acima do limite.
- Nenhum resultado e recuperação após limpar o campo.
- Conteúdo com múltiplos resultados e desempate estável.
- Conteúdo em rascunho não indexado.
- Navegação por teclado e leitor de tela.

## 8. Critérios de aceite

- [ ] 100% das consultas do conjunto dourado retornam o resultado esperado no
  top 5.
- [ ] Nenhum item não publicado aparece em resultado público.
- [ ] Ranking é determinístico em execuções repetidas.
- [ ] P95 local permanece abaixo de 100 ms para o catálogo atual.
- [ ] Consulta inválida não quebra a tela nem gera exceção.
- [ ] Trecho e motivo são coerentes com o campo encontrado.
- [ ] Busca funciona sem rede.
- [ ] Leitor de tela anuncia campo, quantidade, título e estado vazio.
- [ ] Export estático e SEO permanecem verdes.

## 9. Ordem recomendada de execução

1. Fechar contrato e conjunto dourado.
2. Extrair manifesto de aliases/sinônimos/pesos.
3. Gerar índice derivado.
4. Implementar ranking determinístico.
5. Adicionar referências e escopos.
6. Atualizar UI, trechos e acessibilidade.
7. Rodar benchmark, export e preview.
8. Publicar somente após revisão de relevância e UX.
