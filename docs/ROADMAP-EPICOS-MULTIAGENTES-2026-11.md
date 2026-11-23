# Roadmap por épicos com agentes especializados

Atualizado em 2026-11-23. Este documento transforma as lacunas registradas no
plano mestre em frentes independentes, com responsáveis, dependências, checkpoints
e evidências de aceite. O escopo é o site raiz evangelístico e o app bíblico
publicado no mesmo projeto.

## Objetivo e regras de coordenação

Entregar melhorias sem misturar aprovação editorial, qualidade da interface,
busca, confiabilidade de plataforma e gates nativos. Cada agente recebe um épico
com limites de arquivos e critérios próprios. O agente coordenador mantém a
linha de base, revisa as integrações e só declara um checkpoint concluído com
evidência observável.

- Análise pode ocorrer em paralelo. Alterações de código usam branches ou
  worktrees separados, com prefixo `codex/epic-...`.
- Um agente não integra nem publica o próprio trabalho. A integração exige
  revisão do coordenador, CI verde e atualização da documentação do épico.
- Se duas frentes precisarem editar a mesma superfície, a primeira entrega é
  integrada antes de a segunda começar a editar aquela superfície.
- Não criar dependências, serviços, telemetria, conta ou conteúdo editorial sem
  necessidade e decisão registradas.
- Evidência visual inclui rota, estado, tema, tamanho do viewport e captura.
  Evidência de acessibilidade diferencia auditoria estática, teclado e leitor
  de tela real.

## Linha de base confirmada

- Branch `master`, commit `9dbf765` (`fix: melhorar contraste dos campos de
  busca`), sincronizada com `origin/master` na consulta de 2026-11-23.
- A melhoria recente de placeholders está em produção. A captura em `/pesquisa`
  mostrou “Carregando buscas favoritas”, mas uma captura isolada não demonstra
  carregamento travado. O código encerra o estado no `finally`; a equipe de
  busca deve confirmar que o indicador desaparece depois da estabilização.
- O workflow executou no runner Ubuntu 26. Esse gate está confirmado.
- O último CI da `master`, [run 45230128577](https://github.com/LoadCG/biblia-plataforma/actions/runs/45230128577),
  falhou no Expo Doctor, 20 de 21 verificações aprovadas. Os passos anteriores
  de validação passaram; exportação e verificação do HTML foram puladas devido
  à falha. Divergências informadas pelo Doctor:
  `@expo/metro-runtime` 57.0.18, esperado `~57.0.19`;
  `expo-constants` 57.0.24, esperado `~57.0.25`;
  `expo-image-picker` 57.0.21, esperado `~57.0.22`;
  `expo-notifications` 57.0.25, esperado `~57.0.26`;
  `expo-router` 57.0.31, esperado `~57.0.32`.
- Validação inicial após uma instalação limpa (`npm ci`) em 2026-11-23 apontou
  oito pacotes incompatíveis, incluindo também `expo-sharing`, `expo-splash-screen`
  e `expo-sqlite`. `npx expo install --fix` alinhou os oito ao SDK 57. Depois da
  correção, a primeira execução de `npm run validate` passou com 237 testes e Expo Doctor 21/21;
  `npm run export:web` gerou 1.189 capítulos e `npm run check:static` verificou
  23 rotas críticas, 1.312 HTML e a leitura estática. **Estado: validação local
  e CI remoto confirmados no run 45259312383 para o commit `9a5878f`, associado
  ao PR #2.** O preview Vercel também concluiu a publicação.
- Landing e panfleto seguem como rascunho. A aprovação pastoral e a resposta da
  SBTB sobre a distribuição da ACF permanecem gates humanos. A rota raiz contém
  links para o leitor local ACF.
- O benchmark de vulnerabilidades e os números de `npm audit` registrados em
  18 de novembro foram reavaliados. `npm audit` reportou 14 alertas no total,
  6 moderados e 8 altos; `npm audit --omit=dev` ainda reportou 12, sendo 4
  moderados e 8 altos. `npm audit fix --dry-run` mostrou caminhos que poderiam
  atualizar o Expo para 58, e há precedente de `npm audit fix` quebrar a
  exportação estática. Nenhuma correção automática foi aplicada. As correções
  compatíveis com SDK 57 precisam de triagem separada por advisory antes de
  alterar dependências transitivas.

## Equipe e limites dos épicos

| Papel | Épico | Limite de trabalho |
|---|---|---|
| Coordenador de release | E0, CI e dependências Expo | `package.json`, lockfile, `.github/workflows/ci.yml`; revisar docs SDK 57 antes de alterar dependências |
| Especialista em busca e navegação | E1, busca web | busca em `pesquisa`, provedores em `core/biblia` e `core/content`; não altera pesos editoriais sem baseline/revisão |
| Especialista em interface responsiva | E2, UI e acessibilidade web | Home, Planos, Toast e matriz de QA; alterações na superfície de Descubra coordenadas com E1 |
| Especialista em publicação e conteúdo | E3, landing e divulgação | raiz, metadados e jornada do QR; não declara aprovação pastoral, licença ou domínio final |
| Especialista em runtime | E4, backup, áudio e offline | QA de runtime e contratos já existentes; sem iniciar publicação em lojas |

Os agentes podem inspecionar frentes alheias para identificar dependências, mas
não alteram os arquivos de outro épico sem transferência explícita de escopo.

## E0. Recuperar o gate de CI

**Prioridade:** P0. **Bloqueia:** integração de novos épicos à `master` até o
CI remoto ficar verde. Correção e validações locais concluídas.

### Etapas e checkpoints

1. **E0.1, conferir compatibilidade:** consultar a documentação oficial versionada
   do Expo SDK 57 exigida por `AGENTS.md`; confirmar o conjunto de versões
   esperado e usar o instalador compatível do Expo para alinhar os cinco pacotes.
2. **E0.2, validar localmente:** executar `npm run validate`, `npm run export:web`
   e `git diff --check`. Registrar versões instaladas, resultados e rotas
   exportadas.
3. **E0.3, validar no remoto:** enviar a correção, aguardar CI verde e conferir
   que exportação web e verificação de HTML por rota voltaram a executar.
4. **E0.4, atualizar o plano:** registrar que Ubuntu 26 foi verificado e que a
   causa do CI foi a deriva de patches do SDK, substituindo o alerta antigo de
   migração futura.

**Aceite:** Expo Doctor passa 21/21, workflow completo verde, exportação e
verificação HTML concluídas, nenhuma atualização incompatível ou major upgrade.

**Risco de qualidade:** atualizar somente versões exigidas pelo SDK 57. Não usar
`audit fix --force`, não fazer downgrade e não misturar mudanças de dependências
com refatorações de produto. `npm audit --dry-run` e a análise atual não
autorizam uma atualização ampla; a triagem de advisories permanece em E4.5.

## E1. Busca web e navegação

**Prioridade:** P1. **Independente de:** aprovação pastoral e domínio da landing.

### Fases

1. **E1.1, confirmar estados assíncronos:** na tela Descubra, aguardar o
   carregamento de buscas favoritas; repetir após recarga. Só abrir defeito se o
   indicador persistir. Registrar perfil, condições de rede, logs e resultado.
2. **E1.2, concluir a jornada web:** exercitar busca bíblica e editorial, entrada
   por tema, filtros, paginação, vazio, erro, retry e limpeza. Abrir resultados,
   voltar, recarregar e usar histórico do navegador.
3. **E1.3, fechar acessibilidade da busca:** percorrer por teclado e verificar
   foco, rótulos, anúncio de contagem/estados e os temas claro e escuro em
   larguras web representativas.
4. **E1.4, manter relevância isolada:** usar o conjunto dourado de
   `docs/AVALIACAO-BUSCA-EDITORIAL.md`. Mudança de ranking, pesos ou sinônimos
   exige justificativa e revisão editorial. Busca bíblica, temas, resumos e
   Salvos mantêm seus objetivos próprios.
5. **E1.5, gates nativos:** em dispositivo ou emulador, verificar FTS5 e fallback
   SQLite; com leitor de tela real, conferir anúncios e recuperação de erro.

**Aceite web:** consulta e filtros são preservados ao voltar; nenhum resultado
antigo é exibido após nova consulta/filtro; estados carregando, vazio e erro
terminam em uma saída utilizável; fontes/categorias são reconhecíveis; teclado
consegue completar o fluxo.

**Aceite nativo:** diferenças em relação à web são justificadas e documentadas;
runtime SQLite e leitor de tela foram observados no dispositivo, não inferidos
de mocks ou checagens estáticas.

**Execução 2026-11-23, QA e correção:** no servidor local, a tela Descubra deixou
de mostrar “Carregando buscas favoritas” após estabilizar. A consulta `Joao
3:16` retornou um resultado. A inspeção inicial perdeu a referência da aba antes
de testar clique e retorno. Uma repetição posterior confirmou que Voltar levava
a `/voce`; a correção e o percurso de retorno estão registrados no estado final
dos épicos abaixo. O spinner não foi reproduzido como persistente.

**Revisão de código:** reproduzir primeiro estados assíncronos e corridas. Avaliar
separação do componente `app/(tabs)/pesquisa.tsx` somente se a complexidade
impedir correções verificáveis; não refatorar apenas por tamanho.

## E2. UI, responsividade e acessibilidade web

**Prioridade:** P1/P2 conforme achados. **Escopo:** regressão dirigida, sem
reabrir o redesign mobile dedicado.

### Fases

1. **E2.1, capturas desktop:** Home em 1280×900 e 1440×900, claro e escuro,
   com perfil vazio e com histórico; estados de carga, sucesso e erro. Descubra
   com grade, tema, resultado, vazio e rota direta. Planos com progresso 0,
   intermediário, concluído, retomada e falha/retry.
2. **E2.2, regressão responsiva:** nos componentes que forem tocados, verificar
   320, 375, 414 e 768 px, ambos os temas, barra inferior, texto ampliado, alvos
   de toque, recorte e overflow.
3. **E2.3, navegação e estados:** percorrer Home, Descubra e Planos por teclado;
   conferir foco, ordem, mensagens de Toast, expiração e saídas após falhas.
4. **E2.4, movimento e anúncios:** confirmar preferência por movimento reduzido
   e observar feedback por leitor de tela em rotas representativas. Leitor físico
   e app nativo são gates separados.
5. **E2.5, registrar matriz:** atualizar `docs/matriz-auditoria-responsiva.md`
   com rota, viewport, tema, estado, resultado, screenshot e limites.

**Aceite:** capturas identificáveis, sem clipping/overflow, tarefas principais
completáveis por teclado e feedback não dependente apenas de cor. Gates de leitor
real permanecem marcados como pendentes até haver execução real.

**Execução 2026-11-23, QA parcial:** Home `/biblia` foi vista em viewport
aproximado de 720×740 nos temas claro e escuro. Planos `/planos` foi visto em
emulação iPhone SE 375×667 no tema claro. Não houve corte evidente; a árvore
acessível expôs navegação, progresso e ações. Toast ativo, Planos no escuro,
viewport desktop controlado, teclado completo e leitor de tela real não foram
verificados. Avisos web de `useNativeDriver` e de propriedades `shadow*`
depreciadas foram observados, sem correção nesta rodada por não haver relação
confirmada com falha funcional. Um aviso de atualização de estado após
desmontagem foi visto durante navegação e continua sem causa confirmada.

**Rechecagem 2026-11-23:** duas tentativas reproduzíveis no navegador, saindo
rapidamente de João 3:16 e usando o fluxo normal com capítulo seguinte, não
mostraram o aviso React nem produziram novo log relacionado no servidor. Os
timers de destaque do versículo continuam apenas hipótese, sem stack que os
relacione ao aviso. No preview Vercel, Planos foi inspecionado em tema escuro
em 1280×720; contraste e conteúdo estavam legíveis, sem corte evidente na área
capturada. O link de retorno do detalhe do plano recebeu foco por Tab e foi
ativado por Enter. Isso confirma somente esse caminho de teclado, não uma revisão
completa de teclado ou leitor de tela.

**Risco de sobreposição:** Descubra compartilha superfície com E1. E2 pode
encontrar e documentar problemas durante E1, mas deixa alterações de busca para
o responsável de E1 até integração desse épico.

## E3. Landing, panfleto e publicação

**Prioridade:** P0 para divulgação; preparação técnica parcial pode ocorrer em
paralelo, sem expor conteúdo não aprovado.

### Fases e gates

1. **E3.1, governança humana:** nomear responsável e revisor pastoral; decidir
   domínio final e titularidade; obter resposta escrita da SBTB sobre a ACF e
   identificar edição/proveniência usada.
2. **E3.2, revisão de conteúdo:** revisão pastoral da narrativa e referências;
   leitura de compreensão com pessoas não familiarizadas com igreja. Revisar o
   panfleto impresso de forma autônoma, pois parte do público não terá celular.
3. **E3.3, destino das referências:** decidir o que a página oferece enquanto
   direitos do texto ACF não estiverem confirmados. A autorização afeta também
   links da landing para o leitor local.
4. **E3.4, metadados e indexação:** definir domínio canônico, título, descrição
   e prévia social por superfície. Só publicar sitemap e robots depois de
   determinar quais páginas aprovadas podem ser indexadas.
5. **E3.5, percurso QR até leitura:** testar navegador embutido, rede lenta,
   rotas diretas, cache/service worker, mobile, temas, teclado, movimento
   reduzido e acessibilidade. Ler QR impresso em escala real com mais de um
   aparelho depois de gerar o artefato final.
6. **E3.6, operação:** configurar domínio/HTTPS/DNS somente depois das decisões;
   registrar renovação, responsável operacional e procedimento de rollback.

**Aceite:** aprovação pastoral e direitos documentados; URL definitiva e QR
testados em tamanho real; conteúdo impresso comunica a mensagem sem depender do
telefone; prévia e canonical usam domínio final; páginas indexáveis foram
deliberadas; preview e recuperação de versão foram verificados.

**Bloqueios humanos:** agentes podem preparar pacote de revisão e checklist, mas
não aprovar a copy, afirmar licença, registrar domínio, encomendar impressão,
distribuir panfletos ou contatar terceiros sem autorização específica.

## E4. Runtime, backup, áudio e offline

**Prioridade:** gates de confiabilidade após E0; execução depende de perfis de
teste, navegador ou dispositivo compatível.

1. **E4.1, backup web:** usar dados sintéticos em armazenamento descartável;
   cobrir arquivo inválido, limites de 10 MiB/100 mil registros, prévia,
   confirmação, substituição, exportação posterior, interrupção e rollback.
   Aceite: cancelamento/arquivo inválido não alteram dados; falhas recuperam o
   snapshot ou bloqueiam gravações até recuperação explícita.
2. **E4.2, SQLite real:** em emulador/aparelho, conferir transação, relações,
   notas multi-versículo, progresso, integridade após falha e preservação do
   texto bíblico/FTS5. Mocks não fecham este gate.
3. **E4.3, service worker/offline:** verificar visita com rede, navegação offline
   somente por conteúdo em cache e atualização depois de nova publicação; olhar
   compatibilidade entre HTML e assets com hash e possível acúmulo de cache.
4. **E4.4, áudio:** ouvir prévia e capítulos longos nos navegadores/plataformas
   disponíveis; cobrir voz tardia/removida, fallback, pausa, retomada, troca de
   capítulo, saída da tela e callback atrasado. Confirmar uma fala ativa e
   estado do player coerente.
5. **E4.5, segurança de dependências:** atualizar a auditoria npm, separar
   vulnerabilidades transitivas de produção e ferramentas, verificar correções
   compatíveis com SDK 57 e registrar risco residual. Não atualizar às cegas.

**Triagem 2026-11-23:** `npm audit` encontrou 14 alertas, 6 moderados e 8 altos;
`npm audit --omit=dev` encontrou 12, sendo 4 moderados e 8 altos. A simulação de
correção automática propôs dependências de Expo 58; uma tentativa anterior de
`npm audit fix` quebrou a exportação estática. Nenhuma correção de segurança foi
aplicada nesta rodada. Próxima ação: avaliar advisory por advisory e atualizar
somente dependências comprovadamente compatíveis com SDK 57, revalidando o
export após cada grupo pequeno.

**Aceite:** evidência inclui plataforma e condição de execução; backups não usam
dados pessoais reais; áudio só recebe aceite depois de escuta real; nenhuma
alegação de offline, rollback ou acessibilidade nativa baseada apenas em mocks.

## Sequência de execução e paralelismo

1. **Primeiro E0:** corrigir CI e restaurar os gates completos da branch principal.
2. **Depois, abrir E1 e E2 em paralelo**, em branches/worktrees diferentes. E2
   sinaliza problemas de busca, mas não altera o escopo de E1.
3. **E3 começa com preparação e coleta de decisões humanas em paralelo.**
   Alterações de indexação, canonical ou domínio aguardam seus gates editoriais e
   de propriedade.
4. **E4 inicia auditorias de código depois de E0.** Runtime nativo, leitor de
   tela e QA auditivo aguardam ambiente real. Nenhum desses gates impede E1/E2.
5. **Integração:** após cada épico, revisar diffs, executar verificações do
   escopo, CI, exportação web e smoke test das rotas tocadas. Corrigir conflitos
   e regressões antes de iniciar outro épico sobre os mesmos arquivos.

## Estado após a execução e revisão local

- E0: oito pacotes alinhados ao SDK 57; `npm run validate` passou com 241 testes
  e Expo Doctor 21/21. Exportação de 1.189 capítulos e verificação estática
  passaram localmente; CI do PR #2 passou no run 45259312383 para `9a5878f`, e o
  preview Vercel concluiu a publicação.
- E1: busca por `João 3:16` encontrou um resultado. Corrigido bug reproduzido
  no leitor: o botão Voltar ignorava `origem=pesquisa` e usava o histórico
  genérico, que levou a `/voce`. O leitor agora retorna à consulta e filtros
  codificados na URL. O navegador confirmou a rota `/pesquisa`, campo preenchido,
  filtro Novo Testamento selecionado e resultado presente. A consulta e os
  filtros também permanecem nos controles e atalhos entre capítulos.
- E2: QA parcial, sem bug P0/P1 confirmado e sem alterações. Planos escuro em
  desktop e o caminho de teclado Tab/Enter para retornar do detalhe foram
  verificados; permanecem pendentes teclado completo, Toast ativo controlado,
  viewport mobile nesta revisão e leitor de tela real. O aviso React visto antes
  não foi reproduzido nas duas tentativas documentadas; aguardar stack se voltar
  a ocorrer, em vez de tratar a hipótese dos timers como causa confirmada.
- E3: preparado no plano, mas gates de revisão pastoral, direitos ACF, domínio
  e QR continuam humanos.
- E4: triagem de segurança concluída, sem atualizações automáticas; QA de backup,
  SQLite, offline e áudio depende de ambiente real.

As frentes E1 e E2 podem avançar com bugs concretos quando reproduzidos. Não
abrir correção apenas por warning transitório ou captura única de carregamento.

## Formato obrigatório do relatório de cada agente

1. Épico, responsável, branch/commit e escopo entregue.
2. Lacuna reproduzida ou decisão pendente, com arquivo/rota e evidência.
3. Arquivos alterados e resumo de causa/solução; informar explicitamente se não
   houve alteração de código.
4. Comandos/verificações executados e resultados reais, sem extrapolar o que
   comprovam.
5. Capturas com rota, viewport, tema e estado quando houver QA visual.
6. Gates ainda pendentes, dependências externas, risco residual e próxima ação.
7. Auto-revisão de regressões, acessibilidade, copy e segurança relevantes ao
   épico.

## Fora do plano atual

Contas e sincronização em nuvem, novo backend, telemetria, nova tradução bíblica,
redesign mobile dedicado, publicação nas lojas, nova geração editorial sem revisão
independente e síntese neural pesada. Qualquer item desses exige decisão de
escopo e plano próprio.
