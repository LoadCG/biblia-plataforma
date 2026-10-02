# Estado do projeto e próximos passos (revisado em 2026-10-01)

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
| SEO/descoberta | Apps estabelecidos têm anos de indexação; sites de conteúdo bíblico competem por tráfego orgânico de busca | 66 resumos e 2 planos possuem HTML/metadados por rota; leitor permanece interativo por fallback híbrido restrito |
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

## Próximos passos priorizados (realista pro contexto do projeto)

> Atualização de 2026-09-10: além das cinco etapas funcionais anteriores, foram
> implementados CI, SEO híbrido, cenários Maestro, hardening de acessibilidade,
> prontidão de build nativo e dois ciclos de usabilidade para Busca, Salvo,
> Planos, estados vazios, navegação e Toast. Evidências em
> `PLANO-EXECUCAO-ETAPAS-6-A-10.md`, `PLANO-UX-INTERFACE-ETAPAS-11-A-15.md` e
> `PLANO-UX-INTERFACE-ETAPAS-16-A-20.md`.

Ordenados por impacto e pela instrução vigente: aproximar a aplicação web da
referência, preservando os breakpoints tocados; refinamento mobile dedicado e
produto nativo ficam para depois. Esta prioridade não reabre decisões de conta,
tradução ou backend.

1. **Concluir o sistema de estados web** — fechar severidades, registrar
   contratos pendentes e revisar loading/erro/feedback em desktop e nos
   breakpoints afetados. Estado: migração principal implementada; QA visual e
   algumas checagens de aceite continuam pendentes.
2. **Continuar a aproximação da referência** — após os estados, percorrer
   Descubra, Planos e Início com evidência visual desktop e regressão responsiva
   dirigida. O Leitor desktop já tem uma rodada registrada; isso não aprova as
   demais superfícies.
3. **Confirmar CI remoto e SEO** — observar workflow verde e validar rotas
   estáticas em preview quando a quota da Vercel permitir.
4. **Avançar o piloto editorial** — concluir schema mínimo e revisão humana
   independente dos próximos conteúdos antes de ampliar o catálogo.
5. **Retomar QA mobile/nativo e acessibilidade física** — Maestro, NVDA,
   VoiceOver e TalkBack dependem da decisão de retomar essa frente e de um
   navegador/aparelho/binário apropriado.
6. **Gerar builds EAS assinados** — somente quando conta e credenciais estiverem
   disponíveis e o desenvolvimento nativo for retomado.
7. **Avaliar vulnerabilidades de dependências** sem upgrade forçado, conforme
   explorabilidade e compatibilidade com Expo 57.

### Execução revisada por marcos

Para evitar manter duas listas concorrentes, a execução detalhada fica nos
roadmaps operacionais. A ordem recomendada é:

1. **Marco web ativo:** terminar sistema de estados e avançar a comparação
   desktop com a referência; manter registro de responsividade nos breakpoints
   tocados e explicitar cobertura não feita.
2. **Marco web de qualidade:** confirmar CI remoto e validar SEO em preview
   quando a quota estiver disponível; iniciar snapshots visuais após a auditoria
   desktop e correção dos defeitos prioritários.
3. **Marco editorial piloto — em paralelo:** fechar schema/taxonomia mínimos e
   produzir apenas um lote curto com revisão independente; QA estrutural e
   revisão humana são gates daquele lote, não uma etapa tardia após expansão.
4. **Marco nativo — deferido até retomada:** gerar build instalável e então
   executar Maestro, leitores de tela, performance e smoke test. Credenciais e
   publicação em loja continuam dependências futuras, não bloqueiam o web.

Os critérios e a decomposição ficam em `PLANO-MESTRE-UX-ETAPAS-19-A-23.md` e
`PLANO-CONTEUDO-ETAPAS-24-A-28.md`. Datas anteriores desses documentos são
marcos de registro, não prova de que um gate externo foi concluído.

Plano operacional expandido: `PLANO-MESTRE-UX-ETAPAS-19-A-23.md`.

Próximo ciclo editorial: `PLANO-CONTEUDO-ETAPAS-24-A-28.md`.

## Como manter este documento honesto

Atualizar aqui quando: uma decisão de escopo mudar de verdade (ex.:
usuário decide reabrir login), um item da lista acima for concluído
(mover pra `CHANGELOG.md`/`FUNCIONALIDADES.md`, riscar aqui), ou um
benchmark novo revelar uma lacuna que não estava mapeada. Não
atualizar a cada commit — isso é o que o `CHANGELOG.md` já faz bem.
