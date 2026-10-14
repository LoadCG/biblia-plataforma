# Plano — títulos e divisões na leitura bíblica

## Objetivo

Exibir no leitor os títulos editoriais e divisões de seção associados a
passagens bíblicas, preservando o texto ACF, sua numeração, a busca offline e as
ações por versículo. Exemplo prioritário: as 22 estrofes alfabéticas do Salmo
119 (Aleph, Beth, Gimel etc.), cada uma identificada antes de seu primeiro
versículo.

## Diagnóstico confirmado

- `assets/biblia.json` contém livros, capítulos e arrays de texto de versículos;
  não contém títulos ou divisões.
- `core/biblia/tipos.ts` representa cada versículo apenas por número e texto.
- `core/biblia/leituraLocalWeb.ts`, `core/db/database.ts` e
  `core/biblia/BibliaAPI.ts` constroem a mesma forma simples para web, SQLite e
  fallback de rede. A leitura nativa popula SQLite a partir do JSON embutido;
  web lê o mesmo JSON local e usa a API externa só como fallback.
- O leitor principal em `app/(tabs)/biblia/[livro]/[capitulo].tsx` renderiza um
  bloco por versículo. O seletor de capítulos e componentes de prévia também
  consomem `CapituloTexto`, mas os cabeçalhos desta proposta pertencem somente
  à leitura principal.

## Princípios e limites

1. Títulos são metadados editoriais, nunca texto de versículo. Não alterar nem
   inserir conteúdo em `assets/biblia.json` para simular títulos.
2. Cada título deve ter fonte, edição/revisão de referência, proveniência,
   licença/termos de uso e status de revisão registrados antes de entrar no
   app. Títulos variam entre edições mesmo quando o texto bíblico é o mesmo;
   a situação dos direitos do texto ACF e a de subtítulos editoriais são
   questões separadas. A licença da base integral usada pelo projeto está em
   confirmação ([nota de status](./LICENCA-TEXTO-ACF.md)).
3. Distinguir títulos presentes na edição-fonte de divisões descritivas
   preparadas pelo projeto. Não atribuir autoria bíblica aos títulos editoriais.
4. Cobertura parcial é válida e explícita: capítulos sem metadados continuam
   sendo exibidos normalmente, sem cabeçalhos inventados nem marcadores vazios.
5. Preservar a semântica atual de versículos para seleção, grifos, notas,
   favoritos, compartilhamento, áudio, deep links e busca.

## Modelo proposto

Adicionar um catálogo versionado de metadados de seção, independente da Bíblia
embutida. Cada entrada identifica livro e capítulo, versão do conjunto e uma
lista ordenada de títulos. Cada título contém pelo menos:

- `id` estável;
- `inicioVersiculo` (e, se a revisão exigir, `fimVersiculo`);
- `titulo`;
- `tipo` (`titulo-da-edicao` ou `divisao-editorial`);
- `fonteId` e status editorial;
- para divisões editoriais próprias, nota de que são organização editorial do
  app, sem se apresentarem como parte do texto bíblico.

Manter um arquivo-fonte tipado e versionado, por exemplo
`core/biblia/dados/titulosSecao.json`, importado pelo bundle Expo. A resolução
recebe `livroSlug` e capítulo e retorna metadados ordenados; não requer tabela
SQLite, chamadas por versículo nem rede. Evitar duplicar o conteúdo ACF ou
criar outro índice de busca.

O leitor principal resolve os metadados pelo `livroSlug` e capítulo, sem
alterar `CapituloTexto` nem as rotas de consulta. Os títulos são apresentados
somente na tela de leitura completa; cards, popovers, seletor, busca e cache
permanecem com seu contrato atual. Se futuramente títulos forem necessários em
trechos, adicionar uma projeção explícita ao contrato antes de implementá-los.

## Etapas de execução

### 0. Fechar a fonte e os direitos — concluída para o piloto próprio

- O piloto usa uma divisão descritiva do acróstico hebraico, não títulos
  transcritos de uma edição ACF ou de outra Bíblia publicada. A estrutura de 22
  estrofes de oito linhas é descrita pelo [Enter the Bible, Luther Seminary](https://enterthebible.org/courses/psalms/lessons/introductory-issues/).
- A grafia dos nomes segue uma variante acadêmica registrada no catálogo; uma
  referência de nomes/transliteração está no [material educacional arquivado pelo ERIC](https://files.eric.ed.gov/fulltext/ED437293.pdf).
- A fonte, URL, função da referência e nota editorial acompanham o JSON. Essas
  referências sustentam os fatos estruturais e a grafia; não concedem licença
  para copiar cabeçalhos de edições comerciais.
- A [política de direitos da SBTB](https://www.biblias.com.br/direitos-autorais)
  identifica a ACF como protegida e condiciona citações extensas. Este piloto
  não reproduz títulos editoriais da ACF; a política de direitos do texto ACF
  já embutido no produto é uma questão separada e não é reavaliada aqui.

### 1. Definir esquema e regras de validação — implementada localmente

- Criar tipos e catálogo versionado de metadados separado de `biblia.json`.
- Validar referência do livro/capítulo, limites dos versículos, ordem, IDs
  únicos, títulos não vazios, duplicatas e fonte/status obrigatório.
- Permitir múltiplas seções no capítulo; não assumir divisões uniformes por
  livro.
- Adicionar validador em `scripts/` e script npm dedicado; integrá-lo ao
  `npm run validate` e ao CI. Conferir os limites contra `assets/biblia.json`
  sem gerar nem modificar o arquivo bíblico.

### 2. Preparar o conjunto piloto — implementado; revisão humana pendente

- Começar pelo Salmo 119, cobrindo suas 22 estrofes e inícios nos versículos
  1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 121, 129,
  137, 145, 153 e 161.
- Conferir que o capítulo contém os 176 versículos e que cada seção cobre oito
  versículos, sem alterar o texto nem sua numeração.
- O catálogo usa uma transliteração consistente (`Aleph`, `Beth`, `Gimel`,
  `Daleth`, `He`, `Waw`, `Zayin`, `Heth`, `Teth`, `Yod`, `Kaph`, `Lamed`,
  `Mem`, `Nun`, `Samekh`, `Ayin`, `Pe`, `Tsade`, `Qoph`, `Resh`, `Shin`,
  `Taw`) e associa cada nome ao glifo hebraico. A revisão editorial humana da
  variante e da apresentação permanece pendente.
- Somente depois do aceite do piloto, inventariar outros cabeçalhos realmente
  presentes na fonte licenciada e expandir em lotes revisáveis.

### 3. Integrar ao leitor — implementada localmente

- Resolver todos os cabeçalhos uma vez por capítulo na camada de domínio e
  associá-los por número de versículo; não fazer lookup de catálogo a cada
  renderização nem alterar os repositórios de dados pessoais.
- Renderizar cabeçalho imediatamente antes do bloco de versículo cujo número
  corresponde a `inicioVersiculo`, na mesma lista que desenha os versículos; a
  chave e o alvo de medição de cada versículo permanecem seus números atuais.
- Renderizar título como cabeçalho editorial separado dos controles de
  versículo. O título não pode ser selecionável como versículo, receber grifo,
  nota ou marcador salvo, nem entrar em copiar/compartilhar texto bíblico.
- Manter `onLayout` e auto-scroll calculados para os versículos, verificando que
  a introdução dos cabeçalhos não desalinhe deep links e rolagem para o
  versículo-alvo.
- Na leitura de trecho, só exibir um cabeçalho se o seu versículo de início
  estiver dentro do trecho apresentado; não simular título no meio de um trecho
  cujo início antecede o começo da seção.
- Expor cabeçalhos à tecnologia assistiva como títulos, sem duplicar o anúncio
  do texto; conferir navegação por teclado e foco na web.
- O mesmo bundle resolve os metadados na web e no nativo. O fallback de rede
  continua oferecendo texto; títulos dependem exclusivamente do catálogo local
  e ausência de metadado não bloqueia leitura.
- Não alterar esquema ou migração SQLite: os títulos não são texto bíblico
  pesquisável, progresso ou dado pessoal.

### 4. Validar comportamento e conteúdo — estrutural implementada; QA pendente

- O verificador `npm run check:titulos-secao` confere fonte referenciada,
  capítulo/livro existente, IDs, títulos, limites e cobertura dos 22 blocos do
  Salmo 119. A validação automatizada não substitui revisão humana.
- Verificar que busca, contagem e referências não incluem os títulos.
- Inspecionar Salmo 119 em web desktop e largura estreita, em tema claro/escuro,
  com foco e leitor de tela disponíveis; fazer smoke test nativo SQLite quando
  houver runtime de dispositivo/emulador.
- Conferir outros capítulos do lote e registrar fontes e limitações. Checks
  estruturais não substituem revisão editorial humana.

### 5. Publicar cobertura por incrementos

- Atualizar documentação de funcionalidade, matriz de acessibilidade/responsivo,
  changelog e estado do projeto com a cobertura realmente revisada.
- Exibir somente entradas aprovadas; ausência de título permanece um estado
  normal e não sinaliza erro ao leitor.
- Expandir para novos livros por lotes com fonte e revisão registradas, sem
  alegar cobertura integral antes de inventário verificável.

## Critérios de aceite do piloto

- Salmo 119 apresenta as 22 seções nos versículos corretos, com nomes e
  transliteração revisados e fonte/licença documentadas.
- O texto ACF, a numeração e as referências permanecem idênticos antes e depois
  da inclusão dos metadados.
- Os cabeçalhos não recebem ações de versículo e não alteram busca, seleção,
  áudio, notas, grifos, compartilhamento ou deep links.
- Web e nativo resolvem o mesmo conjunto localmente; capítulos sem metadado
  continuam legíveis sem erro.
- O fallback de rede e caches anteriores não quebram quando o campo de títulos
  estiver ausente; nenhum título é indexado como versículo no FTS5 ou na busca
  web.
- Verificações automatizadas, inspeções visuais/assistivas realizadas e limites
  de QA nativo ficam registrados separadamente.

## Estado

Implementação local do piloto concluída: catálogo versionado, lookup no leitor
principal e validação estrutural. Pendentes: rodar os gates aplicáveis, inspeção
visual/assistiva web e revisão humana da transliteração/apresentação. Nenhum
outro capítulo tem cobertura declarada.
