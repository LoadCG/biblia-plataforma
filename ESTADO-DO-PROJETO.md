# Estado do projeto e próximos passos (revisado em 2026-10-02)

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
| Planos de leitura | YouVersion: 100 mil+ planos, de 3 dias a plurianuais, com devocionais e vídeo | 2 planos guiados e curados, com 21 devocionais, pergunta diária e retomada persistente |
| Streak e gamificação | YouVersion reforçou "Community Plans" com streaks sociais em 2026; apps como Bible Streak têm pontuação/badges dedicados | Streak individual + 6 medalhas por marco do cânon — sólido, mas sem componente social |
| Comunidade | YouVersion: camada de Amigos, pedidos de oração, comentar/grifar junto com quem você conhece | Nenhuma — **decisão consciente** (sem conta = sem comunidade possível ainda) |
| Áudio | Bible Gateway destacado por qualidade de áudio pra "ouvir enquanto lê"; Dwell foca 100% em áudio com faixas de sono | TTS do sistema operacional (`Ouvir capítulo em voz alta`) — funcional, mas não é narração profissional |
| Offline | Citado como parte central de retenção em 2026 ("reduz fricção, ajuda a manter o streak") | Forte: Bíblia inteira embutida, leitura e busca funcionam 100% offline (web e nativo) — ver `FUNCIONALIDADES.md` 7.3 |
| Estudo aprofundado | Blue Letter Bible/Logos: léxico, interlinear, concordância, comentários | Fora de escopo — público-alvo declarado é "leitura", não estudo acadêmico de idioma original |
| Design/UX 2026 | Tipografia cuidada, modo escuro, Dynamic Type, tela inicial sem feed de comparação social | Modo escuro completo, fonte ajustável, identidade visual própria (não copiada) — ver auditorias de UI já feitas |
| Confiabilidade | Bible Streak citado por "pontuação clara e progresso de badge confiável" como diferencial | CI versionado, suíte unitária, contratos de acessibilidade/SEO/Maestro e exports por plataforma; o primeiro run remoto e o E2E em dispositivo ainda são gates externos |
| SEO/descoberta | Apps estabelecidos têm anos de indexação; sites de conteúdo bíblico competem por tráfego orgânico de busca | 66 resumos e 2 planos possuem HTML/metadados por rota; export estático agora inclui uma página de shell para cada capítulo, para permitir entrada direta e atualização. A URL de produção reportada retornou 404 antes da correção; deploy e recarga pública ainda precisam ser confirmados. |
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
- O catálogo continua deliberadamente pequeno (2 planos), embora agora tenha
  21 devocionais, perguntas diárias e retomada persistente. A lacuna restante
  é amplitude editorial, não profundidade mecânica.
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
- O pipeline de CI e seus gates estão versionados; falta observar o primeiro
  run verde no GitHub após envio das alterações.
- Quatro jornadas Maestro estão definidas e validadas estruturalmente, mas
  ainda precisam rodar contra um binário instalado em dispositivo/emulador.
- A inspeção web de acessibilidade foi concluída; NVDA/VoiceOver/TalkBack em
  dispositivo físico continuam como gate humano.

### Descoberta/crescimento
- A estratégia híbrida de SEO está implementada localmente: páginas
  editoriais são pré-renderizadas e `/biblia/*` preserva a experiência
  interativa. Falta validar o comportamento no Preview Deployment antes da
  promoção para produção e acompanhar indexação após o deploy.
- Sem presença em loja de app — **não é mais "não por enquanto" sem
  prazo**: confirmado em 2026-08-27 que a intenção é publicar um dia,
  só que o app nativo ainda não está pronto pra isso e falta entender
  o processo de publicação em si (certificados, build assinado,
  revisão da loja). Fica registrado como intenção real, não decisão de
  nunca fazer — mas sem entrar na lista priorizada abaixo até o app
  nativo estar pronto o bastante pra essa conversa fazer sentido.

## Estado verificado e próximos passos — 2026-10-04

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
  passou ao inspecionar 114 fontes sem sinalizações. É uma checagem literal; a
  revisão semântica humana continua útil para conteúdo e estados complexos.

### Próxima ordem de execução

0. **Anotações multi-versículo — QA web funcional concluído, com gates nativos e
   visuais pendentes:** em `localhost:8082`, perfil descartável, foram conferidos
   criação contínua/descontínua, abertura pelo membro secundário, extensão sem
   alterar o texto, promoção de nota individual, conflito sem sobrescrita,
   persistência após recarga e exclusão. “Salvos” exibiu um item por grupo;
   busca/edição, atividade e o cartão do Versículo do Dia preservaram as
   referências. Os dados temporários foram removidos. Cinco testes focados e os
   checks registrados na matriz passaram. Ainda faltam runtime SQLite em
   dispositivo/emulador, estados de erro/ocupado/foco, tecnologia assistiva
   física e inspeção em viewport CSS medido. Evidências em
   [`PLANO-MELHORIAS-UI-DESIGN.md`](./PLANO-MELHORIAS-UI-DESIGN.md) e na matriz.
1. **Fechar fluxo de seleção:** conferir a11y de teclado/modal/foco, ações em
   lote, cópia/compartilhamento/imagem e grade; cobrir claro/escuro e breakpoints
   web tocados. Não inferir QA de dispositivo nem usar armazenamento pessoal para
   gravações. Critérios detalhados estão no plano focal.
2. **Home desktop — em andamento:** a coluna de apoio agora diferencia carga,
   erro recuperável e valores carregados; o estado zero só aparece após resposta
   bem-sucedida. `typecheck`, `check:ui` e `check:a11y` passaram; a origem local
   mostrou a carga e o perfil vazio carregado em claro/escuro. Faltam capturas
   integrais em 1280×900 e 1440×900, estados com histórico/lembrete, falha
   induzida e viewport CSS conhecido. A imagem CUA recorta a janela e não serve
   como evidência de clipping nem de proporção das colunas.
3. **Descubra e Planos — inspeção parcial feita:** Descubra/Esperança mostrou
   quatro referências e temas relacionados; Planos/Sabedoria ficou em 0/7 dias.
   O detalhe do plano foi revisto em claro/escuro no recorte 1280×720 sem alterar
   progresso, e o tema local foi restaurado ao claro. Conteúdo adicional continua
   condicionado às duas revisões humanas. Completar os estados e viewports
   registrados no plano mestre e seguir
   [`PLANO-TEMAS-DESCOBERTA.md`](./PLANO-TEMAS-DESCOBERTA.md) antes de publicar
   conteúdo novo.
4. **Estados web — em andamento:** Home tem carga/erro/retry explícitos; Toast
   agora cancela a animação anterior, evita que um temporizador antigo feche uma
   mensagem nova, respeita movimento reduzido e desliga native driver na web.
   Salvamento/remoção no Versículo do Dia foi observado localmente e revertido.
   Falta a revisão visual dos consumidores, tema escuro do Toast, erros induzidos
   e leitor de tela real.
5. **Hover web:** padrão centralizado aplicado a links, botões,
   abas, opções e switches por capacidade do ponteiro, com preferência de
   movimento reduzido; exportação e 17 rotas conferidas. Estado animado real de
   mouse, foco/teclado completo e coarse pointer continuam pendentes. Detalhes em
   [`docs/PLANO-HOVER-INTERACOES.md`](./docs/PLANO-HOVER-INTERACOES.md).
6. **CI e SEO:** workflow atualizado para `actions/checkout@v7` e
   `actions/setup-node@v7`, preservando Node 22 do projeto. O run
   [`37225958581`](https://github.com/LoadCG/biblia-plataforma/actions/runs/37225958581)
   passou para `42333ac` em 1m25s; checkout, setup-node, validação, export e
   metadados ficaram verdes. O runner mantém o aviso da migração agendada do
   Ubuntu 26; validar preview Vercel quando disponível.
7. **Conteúdo:** evoluir contrato/taxonomia e selecionar um pequeno lote apenas
   quando houver responsáveis por revisão humana independente.
8. **Mobile dedicado, validação nativa e lojas:** permanecem deferidos; não são
   pré-requisitos para avançar o escopo web autorizado.

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
