# Planejamento e Tarefas (TODO)

**Roadmap vivo e comparação com apps do nicho: [`ESTADO-DO-PROJETO.md`](./ESTADO-DO-PROJETO.md).**
Este arquivo virou um registro histórico enxuto — todo o plano
original abaixo já foi concluído (ver `CHANGELOG.md` pro detalhe
cronológico completo e `FUNCIONALIDADES.md` pro checklist item a
item). Mantido só pelas **decisões fechadas** (não reabrir sem o
usuário pedir) e pra não perder o rastro do que já foi decidido e por
quê.

## Plano original — concluído

Os 8 itens do plano inicial de evolução da plataforma (persistência de
dados, modo offline, histórico de leitura, planos de leitura, testes,
busca global, reformulação visual de Descubra e de Você) estão todos
`[x]` concluídos. Detalhe completo de cada um em `CHANGELOG.md`
(histórico cronológico) — não duplicado aqui.

## Decisões do usuário (não reabrir sem pedir de novo)

- **Trocar tradução do texto bíblico** (2.9) — não por enquanto. Só
  Almeida ACF (domínio público), sem pagar licença de outra tradução.
- **Criar conta / login** (6.1-6.3) — não por enquanto. Perfil local
  (nome + foto) editável, guardado por `ownerId` anônimo — ver
  `core/repositories/PerfilRepository.ts`. Pronto pra virar perfil de
  conta de verdade depois, sem mudar quem consome isso.
- **Publicar nas lojas de app** (8.1) — não por enquanto. O app nativo
  ainda não está pronto pra isso (usuário não sabe ainda como funciona
  o processo de publicação) — vai acontecer um dia, sem previsão.
- **Notificações/lembrete diário** (8.2, 9.10) — **resolvido em
  2026-08-27**, depois de perguntar por que ainda não funciona de
  verdade. O lembrete local nativo (`core/notifications/`) é real e
  **fica como está** — só falta o app nativo ser publicado (ver item
  acima) pra alguém de fato usar. No **web**, onde não dá pra fazer
  isso sem um servidor (Web Push exige backend, que o projeto não tem
  por decisão), os pontos de entrada relacionados (sino da Início,
  botão do card de Versículo do Dia) **somem completamente** em vez de
  mostrar "em breve" sem previsão real — distinção feita por
  `Platform.OS`, e no nativo esses mesmos pontos agora levam pro
  toggle de verdade em Configurações. Ver `FUNCIONALIDADES.md` 9.2/9.10.
- **SEO estático (pré-renderização por rota)** (7.1) — investigado a
  fundo, não ativado por risco de quebrar rotas dinâmicas em produção
  sem um ambiente de teste seguro. Ver `ESTADO-DO-PROJETO.md` pro
  próximo passo realista (testar num preview deploy do Vercel antes).
- **Modo escuro AMOLED** (9.9) — fechado. Não é bug de acessibilidade
  (contraste atual já passa WCAG AA), é só uma ideia de tema sem
  direção de design definida.

## Próximos passos

Ver [`ESTADO-DO-PROJETO.md`](./ESTADO-DO-PROJETO.md) — lista
priorizada, comparada com o que apps do nicho (YouVersion, Bible
Gateway, Blue Letter Bible, Olive Tree, Logos) entregam hoje, mantida
atualizada conforme a etapa do projeto muda de verdade.

## Como isso deve ser lido

Ao começar qualquer item novo: documentar o que foi feito e testado em
`FUNCIONALIDADES.md` (mesmo padrão de sempre — funcionalidade + UX/UI
+ qualquer bug real encontrado com causa raiz), `CHANGELOG.md` no
mesmo commit, e marcar como concluído em `ESTADO-DO-PROJETO.md`. Itens
de decisão fechada acima ficam registrados pra não se perderem, mas
não devem ser reabertos sem o usuário pedir explicitamente.
