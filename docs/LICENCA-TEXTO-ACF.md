# Situação de direitos do texto ACF

## Estado

**Confirmação pendente.** O app inclui uma cópia integral da Almeida Corrigida
Fiel (ACF) em `assets/biblia.json`; a permissão aplicável a essa redistribuição
neste app/site não está registrada no repositório.

## Evidências verificadas em 2026-10-14

- `scripts/baixar-biblia.py` aponta para uma cópia de terceiros em
  `thiagobodruk/bible`, mas não registra licença ou autorização do titular para
  incorporar a tradução completa no produto.
- A [página de direitos da Sociedade Bíblica Trinitariana do Brasil](https://www.biblias.com.br/direitos-autorais)
  identifica o material publicado pela SBTB como protegido e informa um limite
  para citações da ACF que não formem um livro completo nem metade da publicação
  que as contém. A página também informa que usos acima do limite requerem
  autorização prévia por escrito.
- A [página Sobre do app](../app/sobre.tsx) foi atualizada para descrever o
  armazenamento local/offline e informar que a autorização para distribuir o
  texto integral está sendo confirmada. Isso não conclui a análise jurídica.

## Escopo do projeto

A decisão do produto de usar somente ACF e não adicionar outra tradução continua
registrada. Essa decisão não comprova domínio público nem permissão de
redistribuição. Os cabeçalhos do piloto do Salmo 119 são metadados estruturais
próprios e não foram copiados de subtítulos de uma edição ACF; isso é separado
da situação dos 31 mil versículos já embutidos.

## Próximos passos

1. Identificar a edição exata que originou `assets/biblia.json` e registrar
   proveniência, revisão e licença do arquivo-fonte.
2. Consultar a SBTB por escrito sobre distribuição do texto completo no app,
   site, bundle offline e busca; guardar resposta e eventuais condições no
   repositório.
3. Se a permissão não cobrir o uso atual, definir com o responsável do produto
   uma tradução cujo texto possa ser redistribuído ou obter autorização antes
   de continuar a distribuição integral. Não substituir a base por um texto
   diferente sem conferir referências, ortografia, busca e conteúdo derivado.
4. Atualizar README, checklist funcional, página Sobre e esta nota conforme a
   resposta documentada. Até lá, não descrever a ACF como domínio público nem
   afirmar que a permissão já foi concedida.

## Minuta para consulta ao titular

**Assunto:** Pedido de confirmação de direitos para uso integral da ACF em app

> Olá. O projeto Bíblia Plataforma (https://github.com/LoadCG/biblia-plataforma)
> disponibiliza a Almeida Corrigida Fiel em um aplicativo web e Expo para
> Android/iOS. O texto completo (cerca de 31.106 versículos) está incluído no
> bundle para leitura offline e busca local. Gostaria de confirmar se esse uso
> é permitido sob os termos atuais publicados pela SBTB ou se é necessária uma
> autorização específica. O pedido inclui reprodução integral, armazenamento
> local no dispositivo, distribuição do bundle do app e disponibilização no
> site do projeto. Se houver autorização, poderiam informar as condições de
> atribuição, limitações territoriais/comerciais e o procedimento aplicável?
> Também posso enviar a identificação e o checksum do arquivo de texto usado.
