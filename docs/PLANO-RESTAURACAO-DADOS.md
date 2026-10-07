# Plano: restauração de dados exportados

## Objetivo

Permitir que a pessoa restaure um arquivo JSON exportado pelo próprio app,
inclusive ao trocar de dispositivo, sem associar os registros ao `ownerId` do
dispositivo de origem, aceitar dados malformados ou deixar o armazenamento
parcialmente substituído após uma falha.

## Escopo recomendado para a primeira versão

- Importar/restaurar o formato JSON produzido por Configurações, na web e no app
  instalado.
- Mostrar uma prévia antes de qualquer gravação: data da exportação, categorias
  e quantidades detectadas, tamanho do arquivo e preferências que serão
  restauradas.
- Restaurar por **substituição integral** dos dados pessoais deste dispositivo,
  com confirmação explícita e explicação do que será substituído.
- Regravar itens sob o `ownerId` atual. Nunca confiar nem importar o `ownerId` do
  arquivo ou IDs técnicos de linhas SQLite.
- Validar tudo antes de alterar estado persistente. Arquivo inválido ou
  incompatível deve falhar sem efeitos colaterais.
- Não incluir mesclagem na primeira versão: conflitos de notas multi-versículo,
  IDs de coleções/associações e progresso têm semânticas diferentes; uma
  política simples de união poderia duplicar ou perder relações.

## Inventário e restrições atuais

`core/util/dadosPessoais.ts` produz o JSON sem versão explícita de esquema. O
arquivo inclui perfil, grifos, capítulos e livros lidos, notas (incluindo grupos
multi-versículo), pesquisas favoritas, versículos salvos, progresso e sessões
de planos, coleções e associações, além de preferências locais.

Os repositórios têm implementações distintas: AsyncStorage na web e SQLite no
nativo. Alguns métodos são `alternar` (toggle), inadequados para importar porque
um registro já existente seria removido. Os IDs numéricos de banco também não
devem ser tratados como identificadores portáveis. As associações de coleções,
por outro lado, dependem dos IDs lógicos da coleção e precisam continuar
apontando para ela após a restauração.

As preferências exportadas incluem estados de dispositivo e de onboarding. A
restauração deve usar uma lista permitida, não gravar todas as chaves recebidas:

- Restaurar tema, tamanho e família da fonte e última leitura, após validar os
  valores.
- Preservar a permissão nativa de notificações e o agendamento vigente; nunca
  importar `lembrete-diario-ativo` como se a permissão do sistema pudesse ser
  transferida.
- Não restaurar contador de compartilhamentos, versão do onboarding nem dicas já
  vistas. Eles não são conteúdo pessoal de leitura e podem produzir resultados
  estranhos ao migrar de dispositivo.
- Ignorar qualquer chave desconhecida de preferências sem repassá-la ao
  AsyncStorage.

## Jornada proposta

1. Em Configurações → Meus dados, adicionar **Restaurar dados** próximo da
   exportação.
2. Selecionar arquivo JSON. Na web, usar seletor de arquivo com leitura local;
   no nativo, avaliar `expo-document-picker` compatível com SDK 57 e o fluxo de
   leitura de URI adequado. Não enviar o arquivo para rede.
3. Analisar formato, tamanho e conteúdo. Exibir prévia e erros acionáveis sem
   gravar nada.
4. Se a validação passar, mostrar confirmação destrutiva com quantidade de
   dados atuais que será substituída, itens do backup e a lista de preferências
   que não serão transferidas. Recomendar exportar os dados atuais antes da
   substituição.
5. Durante a restauração, bloquear ações concorrentes, expor progresso/estado
   acessível e não permitir fechar acidentalmente a confirmação em meio à
   gravação.
6. Em sucesso, sincronizar tema/fonte/perfil na interface, manter a autorização
   do SO intacta e mostrar resumo do que foi restaurado. Em falha, informar se o
   estado anterior foi recuperado; oferecer nova tentativa sem recarregar um
   arquivo já rejeitado.

## Plano de execução por etapas

### Etapa 0 — contrato de backup versionado

- Adicionar `versaoFormato` numérico e metadados de origem ao envelope exportado,
  mantendo explícito que o arquivo é um backup local e portátil sem IDs de conta.
- Definir parser que reconheça o formato atual sem versão como versão legada
  conhecida, além da nova versão; rejeitar versões futuras e estruturas
  desconhecidas incompatíveis.
- Manter `coletarDadosPessoais` como fonte da exportação e evitar incluir cache
  regenerável, dados bíblicos embutidos, permissões do SO ou segredos.
- Documentar quais campos são restauráveis, transformados, ignorados ou
  derivados.

### Etapa 1 — validação sem escrita

- Implementar parser runtime com validação estrutural de todos os campos, datas,
  tipos, limites numéricos, strings e arrays; não usar cast de `JSON.parse` como
  validação.
- Definir limites de tamanho de arquivo e de contagem de registros para evitar
  travamento por backup excessivo ou JSON hostil. O valor inicial deve ser
  escolhido com base em exportações reais e configurado num único lugar.
- Validar referências bíblicas (livro/capítulo/versículo), IDs de planos e dias
  contra os catálogos locais; conferir relações grupo-nota e coleção-associação.
- Detectar duplicatas, relações sem pai, progresso inconsistente e valores fora
  das enumerações aceitas. Apresentar erros com caminho/categoria compreensível,
  sem expor stack trace.
- Produzir um objeto normalizado separado do objeto bruto: retirar `ownerId` e
  IDs numéricos externos; normalizar relações e valores permitidos de
  preferências.

### Etapa 2 — gravação segura e adaptadores de persistência

- Acrescentar operações explícitas de substituição/importação aos contratos de
  repositório; não compor a importação com métodos `alternar`.
- Implementar transação única SQLite no nativo para remover e inserir o
  conjunto de dados do usuário, preservando integridade referencial. Antes de
  codificar, consultar as APIs exatas do Expo SDK 57 e o wrapper SQLite usado
  pelo projeto.
- Na web, criar uma estratégia recuperável para AsyncStorage: gravar snapshot
  anterior e marcador de operação antes da troca, aplicar lotes por chave,
  finalizar apenas após validação de leitura e remover o marcador no sucesso.
  Se a operação for interrompida, recuperar o snapshot antes de abrir telas que
  leem esses repositórios.
- Em falha na escrita ou verificação posterior, reverter ao snapshot anterior;
  se a reversão também falhar, manter o snapshot/marcador e bloquear novas
  gravações até recuperação explícita, sem declarar sucesso.
- Reatribuir registros ao `ownerId` local. Gerar novos IDs técnicos; preservar
  IDs lógicos de coleção e `grupoId` válidos, com remapeamento determinístico se
  necessário para impedir colisão.
- Recalcular progresso derivado, sem importar caches, estatísticas deriváveis ou
  estado de notificação.

### Etapa 3 — interface de seleção, prévia e confirmação

- Adicionar ação acessível de restaurar em Configurações, estados de arquivo
  selecionado, leitura, inválido, incompatível, pronto, importando, sucesso e
  falha recuperável.
- Permitir cancelar antes da confirmação sem alteração de dados.
- Apresentar resumo por categoria e explicar com linguagem direta a substituição
  integral, o escopo local e as preferências que ficam no dispositivo atual.
- Na confirmação, tornar inequívoco que os dados pessoais atuais serão
  substituídos e que a cópia do arquivo veio do dispositivo de origem.
- Preservar claro/escuro, layout responsivo, teclado/foco web e rótulos/estados
  para tecnologia assistiva.
- Após sucesso, recarregar somente caches/estado em memória afetados; não forçar
  logout, não reiniciar onboarding nem alterar permissão nativa.

### Etapa 4 — verificação e aceite

- Criar testes unitários para envelope legado/atual/futuro, validação completa,
  dados malformados, limites, referências inválidas e normalização de owner/IDs.
- Exercitar restauração em armazenamento web descartável com backup vazio,
  completo, importação repetida, operação cancelada, falha no meio da gravação,
  reversão e recuperação após reinício.
- Exercitar banco SQLite com dados e grupos multi-versículo, progresso/sessões,
  coleções/associações, conflito de IDs numéricos e rollback transacional.
- Inspecionar fluxo visual/assistivo em claro/escuro e larguras responsivas; em
  runtime nativo, confirmar seletor de arquivo e restauração em aparelho ou
  emulador.
- Reexportar após restauração e comparar conteúdo semântico, desconsiderando
  data de exportação, ownerId e IDs numéricos; verificar navegação, progresso,
  tema/fonte e notificações preservadas.
- Atualizar `FUNCIONALIDADES.md`, `CHANGELOG.md`, plano de Configurações e estado
  do projeto apenas com as evidências realmente obtidas.

## Critérios de aceite

- Arquivo válido do formato atual e do legado suportado pode ser restaurado na
  web e no nativo; versão futura é recusada com explicação.
- Nenhum dado persistente muda até a validação e a confirmação explícita.
- Arquivo inválido, cancelamento, duplicatas inválidas ou referências/catálogos
  incompatíveis não alteram dados existentes.
- Falha/interrupção durante gravação resulta em estado anterior recuperado ou
  em fluxo de recuperação explícito antes de continuar usando os dados.
- A cópia restaurada fica vinculada ao `ownerId` atual, com anotações de
  múltiplos versículos e relações de coleções preservadas.
- Permissões e agendamentos do sistema, dados de outras funções, cache bíblico e
  onboarding não são substituídos.
- Reexportação confirma equivalência semântica do que é portátil; interface
  apresenta sucesso/falha e resumo corretos.

## Fora do escopo inicial

- Mesclar dois perfis/backups ou resolver conflitos registro a registro.
- Sincronização em nuvem, conta, envio do arquivo a servidor ou backup
  automático.
- Restaurar autorização de notificações, onboarding, telemetria ou cache
  regenerável.
- Importar formatos arbitrários de planilha/CSV ou backups manuais editados sem
  compatibilidade declarada.

## Riscos e decisões técnicas abertas para a execução

1. Confirmar APIs atuais de seletor/URI e transações na documentação versionada
   do Expo SDK 57 antes de implementar.
2. Escolher limite inicial do arquivo com amostras reais de exportação,
   especialmente anotações e coleções grandes.
3. Mapear todas as chaves/repositórios que representam dados do usuário e todas
   as telas com cache em memória que precisam ser invalidadas após sucesso.
4. Verificar como o bootstrap web/native consegue recuperar um snapshot de
   importação interrompida antes de qualquer leitura dos repositórios.
5. Decidir a política de recuperação se o armazenamento não tiver espaço para
   snapshot e novo conjunto simultaneamente; nesse caso, cancelar antes de
   remover os dados existentes.

## Progresso da implementação — 2026-10-06

| Etapa | Estado | Evidência / pendência |
|---|---|---|
| 0. Contrato versionado | Implementada | Exportação identifica formato 1; validador aceita o legado sem versão como formato 0 e recusa versões futuras. Datas de conclusão de dias de plano agora são exportadas. |
| 1. Validação | Implementada; revisão de runtime pendente | Parser valida estrutura, limites, referências bíblicas, catálogos de planos, duplicatas, agrupamento de notas, associações e preferências permitidas antes da escrita. Limite atual: 10 MiB e 100 mil registros. |
| 2. Persistência e recuperação | Implementada; cenários de falha pendentes | Nativo usa transação exclusiva SQLite; web mantém registros de outros owners e faz gravação por lote. Snapshot local versionado é validado antes de recuperação no próximo acesso; divergência por categoria aciona rollback. A API transacional e tipos passam em análise estática; interrupção/falha e SQLite real ainda não foram exercitados. |
| 3. Interface | Implementada; inspeção visual/assistiva pendente | Configurações oferece seleção, prévia de contagens, confirmação explícita, estados de erro/sucesso e escopo local. Cancelamento do seletor não grava. |
| 4. Verificação | Parcial | `npm run typecheck` passou em 2026-10-06. `git diff --check` deve ser repetido após as últimas edições. Sem teste de restauração em runtime, navegador, emulador ou aparelho; equivalência dos valores e datas precisa de QA ponta a ponta. |

**Decisões aplicadas:** restauração substitui integralmente os dados do perfil local; não há envio para servidor. Preferências portáteis têm allowlist, avatar do arquivo é ignorado e as preferências de notificação/onboarding permanecem no dispositivo atual. IDs técnicos e owner de origem não são reutilizados; IDs de coleção são remapeados e suas associações preservadas.

**Limites conhecidos a validar no QA:** `livrosLidos` não carrega data no formato exportado, portanto a gravação recebe `exportadoEm`; o significado permanece “livro marcado como lido”, mas o timestamp original não pode ser preservado. Reexportação comparativa por valores, falhas induzidas na gravação/rollback, cópia real do DocumentPicker no SDK 57 e apresentação em claro/escuro continuam pendentes. Não declarar aceite integral até essas verificações.
