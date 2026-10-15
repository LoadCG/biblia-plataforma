# Estado do projeto e próximos passos (revisado em 2026-10-13)

Este é o documento de referência pra responder duas perguntas: **em
que etapa estamos de verdade** (sem otimismo nem pessimismo) e **o que
faz sentido vir a seguir**, comparando com o que apps do mesmo nicho já
entregam. Os outros documentos continuam valendo pro que sempre
serviram — `FUNCIONALIDADES.md` é o checklist item a item,
`CHANGELOG.md` é o histórico cronológico, `TODO.md` ficou enxuto e
aponta pra cá. Este arquivo é atualizado sempre que a etapa muda de
verdade, não a cada commit.

## Em que etapa estamos

**Um app de leitura bíblica pessoal, offline-first, com identidade
visual própria, funcional e testado — sem conta de usuário, sem
comunidade, sem monetização.** Isso não é uma fase inicial "MVP
grosseiro": as funcionalidades que existem foram testadas ao vivo,
documentadas com causa raiz de cada bug real encontrado, e o app está
publicado e usável hoje em [biblia-plataforma.vercel.app](https://biblia-plataforma.vercel.app).
A comparação abaixo mostra onde isso se encaixa perto de apps
estabelecidos do nicho — não pra soar como "estamos atrás", mas pra
decidir com clareza o que vale perseguir e o que é, de propósito, fora
de escopo (login, monetização, comunidade — decisões já tomadas, ver
`TODO.md`).

## Benchmark: o que apps do nicho entregam hoje

Pesquisa feita em 2026-08-24 sobre o estado atual do YouVersion Bible
App, Bible Gateway, Blue Letter Bible, Olive Tree e Logos — as
referências mais citadas em comparativos de 2026.
[Fonte 1](https://blog.youversion.com/2026/07/top-bible-reading-plans-for-2026-in-the-bible-app-so-far/),
[Fonte 2](https://www.youversion.com/bible-app),
[Fonte 3](https://theleadpastor.com/tools/best-bible-apps/),
[Fonte 4](https://www.faithtime.ai/content/general/best-apps-for-consistent-bible-reading/).

| Área | O que o nicho entrega | Bíblia Plataforma hoje |
|---|---|---|
| Traduções | YouVersion: centenas de traduções, 1400+ Bíblias, 1200+ idiomas (Plataforma própria lançada em 2026) | Só Almeida ACF — **decisão consciente**, não lacuna técnica (ver `TODO.md`) |
| Planos de leitura | YouVersion: 100 mil+ planos, de 3 dias a plurianuais, com devocionais e vídeo | 5 planos guiados e curados, 72 sessões com reflexão e pergunta diária e retomada persistente; três foram publicados por exceção explícita ao gate de revisão humana |
| Streak e gamificação | YouVersion reforçou "Community Plans" com streaks sociais em 2026; apps como Bible Streak têm pontuação/badges dedicados | Streak individual + 10 medalhas por marcos do cânon — sólido, mas sem componente social |
| Comunidade | YouVersion: camada de Amigos, pedidos de oração, comentar/grifar junto com quem você conhece | Nenhuma — **decisão consciente** (sem conta = sem comunidade possível ainda) |
| Áudio | Bible Gateway destacado por qualidade de áudio pra "ouvir enquanto lê"; Dwell foca 100% em áudio com faixas de sono | TTS do sistema operacional (`Ouvir capítulo em voz alta`) — funcional, mas não é narração profissional |
| Offline | Citado como parte central de retenção em 2026 ("reduz fricção, ajuda a manter o streak") | Forte: Bíblia inteira embutida, leitura e busca funcionam 100% offline (web e nativo) — ver `FUNCIONALIDADES.md` 7.3 |
| Estudo aprofundado | Blue Letter Bible/Logos: léxico, interlinear, concordância, comentários | Fora de escopo — público-alvo declarado é "leitura", não estudo acadêmico de idioma original |
| Design/UX 2026 | Tipografia cuidada, modo escuro, Dynamic Type, tela inicial sem feed de comparação social | Modo escuro completo, fonte ajustável, identidade visual própria (não copiada) — ver auditorias de UI já feitas |
| Confiabilidade | Bible Streak citado por "pontuação clara e progresso de badge confiável" como diferencial | CI versionado com run verde em `master`; suíte unitária, contratos de acessibilidade/SEO/Maestro e exports por plataforma. E2E em dispositivo ainda é gate externo. |
| SEO/descoberta | Apps estabelecidos têm anos de indexação; sites de conteúdo bíblico competem por tráfego orgânico de busca | 66 resumos e 5 planos possuem HTML/metadados por rota; export estático inclui uma página de shell por capítulo. As três novas rotas de plano foram publicadas e responderam 200 em produção; 68 links de leitura também responderam 200. Isso confirma disponibilidade técnica, não indexação por buscadores nem revisão editorial independente. |
| Widgets/OS nativo | YouVersion tem widget de tela inicial, notificação diária | Configuração e bundles locais Android/iOS validados; sem widget, build assinado ou publicação em loja |

**Leitura honesta desse quadro:** nas áreas onde o projeto decidiu
competir (leitura offline confiável, identidade visual própria,
gamificação individual, privacidade sem conta), o app está à altura ou
melhor que apps grandes em pontos específicos (offline é mais completo
que muitos concorrentes gratuitos, por exemplo). Nas áreas que exigem
conta de usuário/backend pago (comunidade, sincronização, múltiplas
traduções licenciadas, notificações push), a distância é grande e
**intencional** — são decisões de escopo, não itens esquecidos.

## Onde o app é forte de verdade (não é modéstia falsa)

- **Offline real, nas duas direções**: leitura de qualquer capítulo e
  busca full-text funcionam sem rede, tanto no web (JSON embutido)
  quanto no nativo (SQLite FTS5) — testado com a rede desligada de
  propósito. Muitos apps "gratuitos" do nicho dependem de conexão pra
  buscar texto.
- **Privacidade como recurso, não como ausência**: sem conta
  obrigatória, dados isolados por ID anônimo de dispositivo, exportar/
  apagar tudo em um toque. Isso é raro mesmo em apps grandes (que
  empurram criação de conta cedo).
- **Disciplina de qualidade**: todo bug relatado nesta sessão foi
  investigado até a causa raiz (não só o sintoma) e documentado —
  exemplo real: o loop de reload em dev não era um "bug qualquer", era
  o Service Worker servindo bundle congelado; documentado pra nunca
  mais acontecer. Poucos projetos solo mantêm esse nível de rastro.
- **Identidade visual própria**: ilustrações, paleta e gamificação
  desenhadas do zero pro projeto, não copiadas de referência (regra
  seguida em toda reformulação visual, auditada).

## Lacunas reais, por categoria

### Design
- O onboarding versionado e as dicas contextuais já cobrem o primeiro uso;
  falta validar a ordem de foco e os anúncios em leitor de tela físico.
- Nenhum widget de tela inicial (nativo) — mas publicar nativo em si já
  é decisão fechada por ora.
- Tela "Sobre o projeto" existe mas não linka pro portfólio/autor de
  forma proeminente (o app é peça de portfólio — vale considerar).

### Funcionalidades
- O catálogo tem agora cinco planos, com 72 sessões, perguntas diárias e
  retomada persistente. Três planos foram publicados em caráter excepcional
  por decisão do responsável; revisões humanas independentes continuam
  recomendadas e ainda não estão registradas.
- Lembrete diário local existe e funciona **só no nativo** (ver
  `FUNCIONALIDADES.md` 9.7/9.10) — sem efeito real hoje porque o app
  nativo não está publicado em nenhuma loja ainda. No web (o único
  lugar com usuários reais) é impossível sem um servidor (Web Push
  exige backend), decisão consciente de não ter. Maior fator de
  retenção citado pelo nicho ("reduz fricção, ajuda a manter o
  streak") continua fora de alcance até o app nativo ser publicado.
- TTS do sistema em vez de narração dedicada — funcional, mas distante
  da experiência de audiolivro que apps de áudio (Dwell, Bible Gateway)
  oferecem.

### Confiabilidade
- O pipeline de CI e seus gates estão versionados; o run remoto
  [`37254924178`](https://github.com/LoadCG/biblia-plataforma/actions/runs/37254924178)
  passou para `b737c2c` em `master`. A implantação de produção correspondente
  ficou `Ready`; monitorar o aviso de migração futura do runner Ubuntu 26.
- Quatro jornadas Maestro estão definidas e validadas estruturalmente, mas
  ainda precisam rodar contra um binário instalado em dispositivo/emulador.
- A inspeção web de acessibilidade foi concluída; NVDA/VoiceOver/TalkBack em
  dispositivo físico continuam como gate humano.

### Descoberta/crescimento
- A estratégia híbrida de SEO está publicada: páginas editoriais são
  pré-renderizadas e `/biblia/*` preserva a experiência interativa. As três
  rotas de plano e as rotas bíblicas verificadas estão acessíveis em produção;
  indexação por buscadores continua sem medição neste ciclo.
- Sem presença em loja de app — **não é mais "não por enquanto" sem
  prazo**: confirmado em 2026-08-27 que a intenção é publicar um dia,
  só que o app nativo ainda não está pronto pra isso e falta entender
  o processo de publicação em si (certificados, build assinado,
  revisão da loja). Fica registrado como intenção real, não decisão de
  nunca fazer — mas sem entrar na lista priorizada abaixo até o app
  nativo estar pronto o bastante pra essa conversa fazer sentido.

## Estado verificado e próximos passos — 2026-10-15

O plano unificado do trimestre está em [`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md).
Ele separa implementação local, verificação estrutural, inspeção visual,
revisão humana, execução remota e distribuição.

### Concluído com evidência registrada

- Ciclos funcionais iniciais, tela de leitura, planos de leitura existentes,
  persistência local, busca offline, navegação e controles principais estão
  descritos no checklist e nos planos históricos. Esses registros não provam
  gates externos que dependam de emulador, tecnologia assistiva ou preview.
- Início desktop teve incrementos recentes de sequência de conteúdo, arte do
  Versículo do Dia e ilustração vetorial do card de jornada. Veja os registros
  de 2026-10-01 no plano de UI e na matriz.
- Navegação por tema, estados compartilhados e severidades de feedback têm
  implementação local e verificações estruturais registradas; aceite completo
  visual/assistivo segue parcial.
- `check:copy-ui` foi adicionado nesta revisão para bloquear padrões explícitos
  de raciocínio interno em fontes de interface e conteúdo integrado. O gate
  passou ao inspecionar 116 fontes sem sinalizações. É uma checagem literal; a
  revisão semântica humana continua útil para conteúdo e estados complexos.
- **Títulos da leitura bíblica (2026-10-08):** o leitor passou a mostrar as 22
  letras do acróstico do Salmo 119 antes de cada estrofe. O catálogo é metadado
  editorial separado da ACF e permanece offline nas duas plataformas. O
  verificador estrutural passou para 22 seções/176 versículos; typecheck e QA
  visual/assistivo ainda não foram executados neste ambiente, e a revisão humana
  da variante de transliteração permanece pendente. Plano detalhado em
  [`docs/PLANO-TITULOS-LEITURA-BIBLICA.md`](./docs/PLANO-TITULOS-LEITURA-BIBLICA.md).
- **Seleção de capítulos para marcar leitura (2026-10-14):** o gesto de arrastar
  no web agora ignora cliques não intencionais, acompanha o ponteiro principal,
  permite ampliar/reduzir o intervalo e limpa captura/estilos em cancelamento ou
  perda de foco. O clique simples continua selecionando um capítulo. Sete testes
  focados, typecheck e contratos da UI passaram. No navegador desktop, arrastei
  Salmos 3–9 e depois reduzi por 5–7; a grade mostrou 7 e depois 4 selecionados
  (3, 4, 8 e 9), sem navegar ao soltar. O progresso não foi gravado. QA tátil e
  nativo ainda deve ser feito.
- **Seletor móvel de capítulos (2026-10-14):** incluído modo de seleção de
  intervalo por dois toques (início e fim), disponível também na web touch e
  acessível por leitor de tela. A grade passa a usar 5 colunas abaixo de 360 px,
  6 até 479 px e breakpoints maiores depois; isso mantém a célula próxima ou
  acima de 44 px em larguras móveis comuns. Barra de ações usa alvos de 44 px.
  Testes de intervalo/breakpoints, typecheck, 191 testes, checks de acessibilidade
  e UI passaram. QA em aparelho/emulador continua pendente.
- **Direitos do texto ACF (2026-10-14):** README, decisão registrada e página
  Sobre agora deixam de afirmar domínio público. O app continua usando a base
  integral localmente, mas a autorização de redistribuição não está registrada;
  confirmar proveniência/termos com a SBTB antes de tratar esse ponto como
  resolvido. Evidências e próximos passos em
  [`docs/LICENCA-TEXTO-ACF.md`](./docs/LICENCA-TEXTO-ACF.md).
- Ajuda permanente e explicações de armazenamento local agora estão disponíveis
  nas rotas `/ajuda` e `/privacidade`, também acessíveis por Descubra e
  Configurações. Os links substituíram atalhos sem destino no Descubra. A tela
  `/privacidade` foi inspecionada no deploy em 1280×720 claro; tema escuro e
  viewport estreito permanecem sem inspeção visual.

### Próxima ordem de execução

1. **Concluído em 2026-10-15 — estabilização do trabalho local (P0):** diffs
   preexistentes de busca/editorial, Home, Planos e melhorias móveis foram
   preservados. Busca web confirmou referência direta, troca rápida, filtros e
   paginação. `npm run validate` passou (25 suítes/183 testes, 84 contratos de
   a11y, 26 de UI, Expo Doctor 21/21); `check:copy-ui`, `export:web` (1.189
   capítulos) e `git diff --check` também passaram. As versões de seis pacotes
   Expo foram alinhadas ao SDK 57. A vulnerabilidade crítica transitiva de
   `shell-quote` foi corrigida com override compatível; a auditoria caiu de 79
   para 78 achados (19 moderados, 59 altos, nenhum crítico; 53 em dependências
   de produção). A correção global foi evitada porque propunha downgrade do
   Expo e encontrou conflito de pares entre Reanimated e Worklets. Não foi
   declarado aceite de SQLite nativo.
2. **Fechar casos restantes de atualização ao voltar às telas (P1):** os fluxos
   Home → Bíblia → marcar capítulo → Home e Plano → leitor → avançar referência
   → retomar foram validados no navegador sem recarga; a troca rápida de abas
   também foi exercitada. O perfil de teste foi restaurado. Ainda falta conferir
   lembrete com histórico, progresso intermediário sem concluir dia, respostas de
   erro/retry e execução nativa.
3. **Concluir composição desktop da Home e Planos (P1):** Home passou a duas
   colunas a partir de 1024 px e foi inspecionada em 1024 e 1440, clara, e em
   1024 escura. Medições do DOM em 1024/1280/1440 ficaram dentro da largura; a
   captura em 1280 é limitada pela janela física. Listagem/detalhe de Planos
   foram inspecionados em desktop. Restam outros estados de perfil, verificação
   de foco e capturas controladas nos tamanhos planejados.
4. **Fechar a revisão funcional/assistiva da busca (P1):** referência direta,
   troca rápida, filtro por testamento/livro e paginação foram confirmados no
   navegador; a busca editorial e trechos têm testes e QA anteriores. Restam
   falha/retry induzidos, leitor de tela real e SQLite/dispositivo nativo.
   Preservar semânticas separadas e usar a triagem rotulada antes de alterar
   ranking ou vocabulário editorial.
5. **Continuar o Ciclo 3 de estados web (P2):** o inventário estático encontrou
   alvo de toque pequeno no botão de ação do Toast; corrigido para 44×44 px e
   coberto no verificador. `validate`, `check:copy-ui` e export passaram. Seguem
   pendentes revisão visual das severidades, falha/retry induzidos, movimento
   reduzido observado, foco e leitor de tela real. Reproduzir falhas apenas em
   armazenamento/origem descartável.
6. **Gates externos em fila separada:** SQLite/FTS5 e acessibilidade com leitor
   de tela físico, áudio em aparelhos, erros de armazenamento induzidos, leitores
   humanos independentes para conteúdo editorial e medição visual com viewport
   controlado. Cada gate precisa de ambiente/responsável; os verificadores
   estáticos não substituem essas evidências.
7. **Escopo explicitamente adiado:** redesign mobile dedicado, publicação em
   lojas, novas vozes de áudio, sincronização/contas e novos conteúdos editoriais.
   Não iniciar sem decisão/recursos correspondentes.

O benchmark externo registrado acima é uma fotografia datada, não uma medição
atualizada neste ciclo. Planos anteriores estão classificados em
[`DOCUMENTACAO.md`](./DOCUMENTACAO.md); use apenas o plano mestre atual como
ordem de trabalho.

## Como manter este documento honesto

Atualizar aqui quando: uma decisão de escopo mudar de verdade (ex.:
usuário decide reabrir login), um item da lista acima for concluído
(mover pra `CHANGELOG.md`/`FUNCIONALIDADES.md`, riscar aqui), ou um
benchmark novo revelar uma lacuna que não estava mapeada. Não
atualizar a cada commit — isso é o que o `CHANGELOG.md` já faz bem.
