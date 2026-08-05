# Estudo de UX/UI — Telas de Leitura

Foco: tela de leitura de capítulo bíblico (`app/biblia/[livro]/[capitulo].tsx`) e
tela de leitura de resumo (`app/resumos/[livro].tsx`) — as duas telas onde o
usuário realmente **lê texto corrido por mais tempo**, então são as que mais
se beneficiam de tipografia e interação bem cuidadas.

## Referências observadas (apps/sites de Bíblia mais usados)

- **YouVersion (Bible App)** — o padrão de fato do mercado (100M+ downloads).
  Interação chave: o versículo **não tem ícone permanente ao lado**. O
  usuário toca no texto do versículo, ele fica selecionado (fundo sutil), e
  **só então** aparece uma barra de ações (grifar, anotar, compartilhar,
  copiar). Fora da seleção, a página é só texto — sem poluição visual.
  Número do versículo é pequeno e discreto (sobrescrito), nunca em negrito
  colorido competindo com o texto.
- **Bible Gateway / Bible Hub** — tipografia de leitura mais "impressa":
  fonte com serifa ou serifa opcional, `line-height` generoso (1.6–1.8),
  largura de coluna limitada (~65-75 caracteres), números de versículo
  minúsculos e discretos.
- **Olive Tree / Blue Letter Bible** — cabeçalho fixo (sticky) com
  livro/capítulo durante a rolagem, pra nunca perder o contexto de onde
  está lendo, mesmo em capítulos longos (ex.: Salmos 119).
- Todos os apps citados: ação de marcar progresso ("lido") fica separada da
  leitura em si (não compete com o texto), controle de tamanho de fonte é
  comum, e a paginação capítulo anterior/próximo é sempre visível no fim.

## Diagnóstico do que temos hoje

**Capítulo (`[capitulo].tsx`):**
- Cada versículo carrega **dois ícones permanentes** (✎ grifar, 🗒 nota) —
  isso multiplica ruído visual por N versículos, competindo com o texto
  bíblico em si (que devia ser o protagonista da tela).
- Número do versículo em negrito + cor de destaque — chama mais atenção que
  o próprio texto.
- `leading-6` (24px) é apertado pra leitura longa; falta uma coluna de
  largura controlada em telas largas (web).
- Não existe controle de tamanho de fonte.
- Cabeçalho (nome do livro + capítulo) rola junto com o texto — em
  capítulos longos, o usuário perde a referência de onde está.
- Nenhuma indicação de progresso de rolagem dentro do capítulo.

**Resumo (`[livro].tsx`):**
- Estruturalmente já é boa (cabeçalho, ficha rápida em cartão, seções
  claras) — o ganho aqui é mais sutil: tipografia (`leading-6` também
  apertado), hierarquia de título podia ser mais forte, e falta indicação
  de progresso de leitura (resumos têm ~500-700 palavras, rolagem
  perceptível em telas pequenas).

## Melhorias decididas (por ordem de impacto)

1. **Interação de versículo por seleção** (maior mudança, maior ganho):
   tocar no versículo seleciona (fundo sutil + borda lateral), aparece uma
   barrinha de ações compacta abaixo do próprio versículo (Grifar / Nota),
   em vez de ícones fixos em todo verso. Estado de grifo/nota já existente
   continua visível (fundo amarelo do grifo, indicador discreto de nota),
   só a *ação* de abrir vira sob demanda.
2. **Tipografia de leitura**: número de versículo pequeno e discreto
   (sobrescrito, cor suave, não mais em negrito colorido), `leading-7`,
   largura de coluna já limitada a `max-w-2xl` (mantida).
3. **Cabeçalho fixo (sticky) durante a rolagem** no capítulo, com
   livro/capítulo sempre visível — implementado com um header fora do
   `ScrollView` em vez de dentro dele.
4. **Barra de progresso de leitura** (linha fina no topo, preenche
   conforme rola) nas duas telas — feedback visual leve, sem números,
   sem pressão ("não é um contador de tempo, é só orientação espacial").
5. **Controle de tamanho de fonte** (A- / A+, 3 passos) no capítulo —
   estado local por enquanto (não persistido), documentado como próxima
   extensão se o uso mostrar necessidade real.
6. Pequenos ajustes de espaçamento/hierarquia no resumo (título, ficha
   rápida, seções) para reforçar a leitura confortável.

## Fora de escopo agora (registrado para o futuro)

- Fonte serifada opcional (alternância) — mencionada no checklist antigo,
  não implementada ainda.
- Modo foco (esconder header/nav durante leitura).
- Compartilhar/copiar versículo — depende da barra de ação nova (item 1),
  é uma extensão natural depois que a barra existir.
