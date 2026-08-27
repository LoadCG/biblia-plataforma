# Estado do projeto e próximos passos (2026-08-24)

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
| Planos de leitura | YouVersion: 100 mil+ planos, de 3 dias a plurianuais, com devocionais e vídeo | 2 planos curados, estáticos, sem devocional/vídeo |
| Streak e gamificação | YouVersion reforçou "Community Plans" com streaks sociais em 2026; apps como Bible Streak têm pontuação/badges dedicados | Streak individual + 6 medalhas por marco do cânon — sólido, mas sem componente social |
| Comunidade | YouVersion: camada de Amigos, pedidos de oração, comentar/grifar junto com quem você conhece | Nenhuma — **decisão consciente** (sem conta = sem comunidade possível ainda) |
| Áudio | Bible Gateway destacado por qualidade de áudio pra "ouvir enquanto lê"; Dwell foca 100% em áudio com faixas de sono | TTS do sistema operacional (`Ouvir capítulo em voz alta`) — funcional, mas não é narração profissional |
| Offline | Citado como parte central de retenção em 2026 ("reduz fricção, ajuda a manter o streak") | Forte: Bíblia inteira embutida, leitura e busca funcionam 100% offline (web e nativo) — ver `FUNCIONALIDADES.md` 7.3 |
| Estudo aprofundado | Blue Letter Bible/Logos: léxico, interlinear, concordância, comentários | Fora de escopo — público-alvo declarado é "leitura", não estudo acadêmico de idioma original |
| Design/UX 2026 | Tipografia cuidada, modo escuro, Dynamic Type, tela inicial sem feed de comparação social | Modo escuro completo, fonte ajustável, identidade visual própria (não copiada) — ver auditorias de UI já feitas |
| Confiabilidade | Bible Streak citado por "pontuação clara e progresso de badge confiável" como diferencial | Bugs reais de confiabilidade corrigidos recentemente (Service Worker, layout do Modo Foco) — ver seção abaixo |
| SEO/descoberta | Apps estabelecidos têm anos de indexação; sites de conteúdo bíblico competem por tráfego orgânico de busca | App é uma SPA sem HTML por rota — **lacuna real**, item 7.1 do backlog, adiado por risco técnico (ver `TODO.md`) |
| Widgets/OS nativo | YouVersion tem widget de tela inicial, notificação diária | Nenhum widget nativo; nada publicado nas lojas ainda (decisão consciente) |

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
- Onboarding/primeiro uso inexistente — quem abre o app pela primeira
  vez cai direto na Início sem nenhuma introdução ao que o app oferece
  (Planos, Grifos, Medalhas). Apps do nicho geralmente têm 2-3 telas de
  boas-vindas ou um tour guiado.
- Nenhum widget de tela inicial (nativo) — mas publicar nativo em si já
  é decisão fechada por ora.
- Tela "Sobre o projeto" existe mas não linka pro portfólio/autor de
  forma proeminente (o app é peça de portfólio — vale considerar).

### Funcionalidades
- Só 2 planos de leitura, sem devocional (texto de reflexão por dia,
  não só a referência) — plano de leitura "cru" é bem mais raso que o
  que o nicho oferece.
- Sem lembrete/notificação nenhuma, nem local (decisão fechada, mas
  vale registrar que isso é o maior fator de retenção citado pelo
  nicho — "reduz fricção, ajuda a manter o streak").
- TTS do sistema em vez de narração dedicada — funcional, mas distante
  da experiência de audiolivro que apps de áudio (Dwell, Bible Gateway)
  oferecem.

### Confiabilidade
- Sem CI automatizado (`tsc`/`jest` rodam manualmente a cada sessão,
  não em pipeline) — funciona porque a disciplina de sempre rodar
  antes de commitar tem se mantido, mas é um ponto único de falha
  (depende de lembrar).
- Sem testes E2E de verdade (Maestro/Detox, item 5 do plano original,
  nunca retomado) — só testes unitários das regras de negócio.
- SEO estático adiado por risco real (rotas dinâmicas quebrando em
  produção sem ambiente de teste seguro) — continua sem solução, não
  só sem prioridade.

### Descoberta/crescimento
- Sem nenhuma estratégia de SEO ativa (SPA pura, sem HTML por rota) —
  o app não aparece em busca orgânica do Google pra "resumo de
  Gênesis" ou similar, ao contrário do site antigo (estático) que o
  projeto substituiu.
- Sem presença em loja de app — decisão fechada, mas significa que a
  única forma de descoberta é o link direto.

## Próximos passos priorizados (realista pro contexto do projeto)

Ordenados por impacto real vs. esforço, respeitando as decisões já
fechadas (sem conta, sem lojas, sem notificação, sem trocar tradução).
Nenhum item aqui reabre essas decisões.

1. **Onboarding leve na primeira abertura** — 2-3 telas ou um destaque
   guiado mostrando Planos/Grifos/Medalhas na primeira vez que o app
   abre. Maior lacuna de design encontrada no benchmark, e a mais
   barata de resolver (não depende de backend).
2. **Enriquecer os planos de leitura existentes com devocional curto**
   — um parágrafo de reflexão por dia, não só a referência bíblica.
   Eleva os 2 planos que já existem sem precisar de mais planos.
3. **CI básico** (GitHub Actions rodando `tsc`+`jest` em cada push) —
   barato de configurar, remove a dependência de lembrar de rodar
   manualmente, primeira rede de segurança real de confiabilidade.
4. **Retomar a decisão do SEO estático (item 7.1) com um ambiente de
   teste seguro** — usar preview deploy do Vercel (não produção direto)
   pra finalmente testar `generateStaticParams` sem risco. Maior
   lacuna de crescimento orgânico, tecnicamente resolúvel sem mudar
   nenhuma decisão de produto.
5. **Teste de leitor de tela real** (VoiceOver/NVDA) — único item de
   acessibilidade que segue bloqueado só por falta de dispositivo
   físico, não por decisão.
6. **Testes E2E da jornada principal** (Maestro) — item 5 do plano
   original nunca retomado; baixa prioridade real (os testes unitários
   + disciplina de teste manual ao vivo têm coberto bem até aqui), mas
   fica registrado como dívida técnica conhecida.

## Como manter este documento honesto

Atualizar aqui quando: uma decisão de escopo mudar de verdade (ex.:
usuário decide reabrir login), um item da lista acima for concluído
(mover pra `CHANGELOG.md`/`FUNCIONALIDADES.md`, riscar aqui), ou um
benchmark novo revelar uma lacuna que não estava mapeada. Não
atualizar a cada commit — isso é o que o `CHANGELOG.md` já faz bem.
