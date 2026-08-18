# Plano de melhorias de UI — componente por componente

> **Status (2026-08-18):** todos os itens 🔴 e todos os 🟡 de baixo
> risco já foram implementados, testados ao vivo e commitados — ver
> marcação `[feito]` em cada item. Os 🟡 restantes (contador de
> caracteres sem limite definido, componente órfão `CardStreak`) e
> todos os ⚪ seguem em aberto, aguardando decisão sua (ver seção
> final).

Auditoria de todos os 15 componentes de `components/`, com base em
práticas atuais de UI/UX para produtos Tailwind (hierarquia visual,
profundidade sutil via sombra/borda, motion com propósito, densidade
de toque, dark mode consistente). Cada item abaixo é independente —
posso implementar um de cada vez, na ordem que preferir, sem tocar nos
outros. Prioridade: 🔴 alto impacto / baixo risco, 🟡 médio, ⚪ polimento.

---

## 1. `CardVersiculoDia.tsx` — card principal do Início

- 🔴 `[feito]` **Sombra de texto excessiva.** Três `textShadow` diferentes (raio
  3–8px, opacidade até 0.9) em cima de um fundo já escuro o bastante
  pra garantir contraste (WCAG já passa sem elas). Isso é um resquício
  de quando havia foto de fundo variável (removida). Hoje é ruído
  visual — o texto bíblico principal em especial fica com uma auréola
  pesada. Reduzir a 1 sombra sutil (`0 1px 2px rgba(0,0,0,.4)`) só no
  texto do versículo, remover das demais.
- 🟡 `[feito]` **Gradiente estático.** `LinearGradient` com 3 stops muito
  próximos em tom (`#332920`→`#241d16`→`#1b1712`) mal se distingue de
  uma cor sólida. Um gradiente com mais contraste de luminosidade
  (ex. de `#3d3226` no topo pra `#161310` embaixo) daria profundidade
  de verdade ao card, hoje ele é "chapado".
- 🟡 `[feito]` **Botão "Envie-me Diariamente" ocupa uma faixa inteira** por uma
  feature que não existe ainda. Em produtos atuais, um placeholder de
  feature futura tende a ser menor/mais discreto (chip, não uma barra
  full-width do tamanho de uma CTA real) pra não competir visualmente
  com as ações que funcionam de verdade (Amém/Anotar/Enviar/Mais logo
  acima). Sugestão: substituir por um chip pequeno alinhado à direita,
  ou remover até a feature existir.
- ⚪ **Área de toque dos 4 ícones de ação já é boa** (`flex-1`,
  corrigido antes) — sem pendência aqui.
- ⚪ **Cantos muito arredondados + `overflow-hidden` já corretos** para
  o padrão de card "hero" do app.

## 2. `CardConquistas.tsx` — resumo de medalhas no Início

- 🔴 `[feito]` **Badge de progresso (`c.progressoAtual`) ilegível em fundo claro
  no modo claro.** `bg-black/60` fixo funciona bem no fundo cinza claro
  do círculo não-conquistado, mas é uma cor "hardcoded" fora do
  sistema de tema — se o fundo do círculo mudar de tom no futuro
  (ou em dark mode, onde já é escuro por padrão), o contraste do badge
  não é garantido por design, só por coincidência. Trocar por um token
  do tema (`bg-cor-fundo dark:bg-cor-fundo-dark` com opacidade) deixa
  isso à prova de mudança de paleta.
- 🟡 `[feito]` **`border-4` nos círculos de medalha é grosso demais** pro
  tamanho do elemento (80×80px) — proporção comum em sistemas atuais
  seria `border-2` ou `border-[3px]`, resultando em um anel mais fino
  e elegante em vez de "pesado".
- 🟡 `[feito]` **"Saiba mais" por baixo do título da medalha, mas sem nenhum
  ícone/seta indicando que é tocável** — parece um subtítulo estático.
  Um `ⓘ` de 10px ao lado, ou trocar o texto por algo com affordance
  mais clara (ex. sublinhado pontilhado, como já é usado em
  `TextoComReferencias`), reduziria ambiguidade.
- ⚪ **Modal de detalhe da conquista é consistente com o resto do app**
  (mesmo padrão de `Tooltip`/`ModalNota`) — sem pendência.

## 3. `CardStreak.tsx` — sequência diária (hoje não usado em nenhuma tela)

- 🟡 **Componente órfão.** Não há nenhum `import` dele em `app/`. Ou é
  código morto pra remover, ou é uma peça planejada que ainest não foi
  encaixada em nenhuma tela — vale confirmar com você qual dos dois
  antes de mexer, não vou adivinhar.
- ⚪ Se for mantido: mesma observação de `border-2 border-cor-destaque/30`
  do círculo de número — hoje já é sutil e correto, sem mudança
  necessária.

## 4. `CardAtividade.tsx` — item de Salvo/Atividade

- 🟡 **Menu de "⋮" só é descoberto por tentativa.** Não há nenhuma
  pista visual de que o card também responde a clique direito no web
  (`onContextMenu`) — é um bônus escondido. Não crítico (o ícone "⋮" já
  cobre a ação), mas dá pra considerar sombra bem sutil só quando em
  `hover` no web (`hover:shadow-md` via classe web-only) pra sinalizar
  interatividade do card inteiro, hoje ele parece só informativo.
- ⚪ **Timestamp (`tempoRelativo`) em `text-[10px]`** é o menor texto do
  app inteiro — no limite do legível em telas de alta densidade, mas
  aceitável por ser metadado secundário. Não mudaria sem mais contexto
  de uso real (analytics de zoom/acessibilidade).
- ⚪ Sombra/raio/espaçamento já seguem o padrão dos outros cards do
  Você — consistente.

## 5. `GradeCapitulos.tsx` — grade de capítulos

- 🟡 **Estado "lido" (verde sólido) tem só uma variação** — capítulo
  lido fica idêntico visualmente estando "em progresso" (algumas
  leituras/parcial) ou "totalmente relido várias vezes". Não há dado
  pra isso hoje no modelo, mas fica registrado como possível evolução
  futura (não é uma ação de UI imediata, é um gap de dado).
- ⚪ **Grade responsiva (6/8/10/12 colunas) e capada pelo total de
  capítulos já é sólida** — não mudaria a lógica.
- ⚪ Considerar `active:scale-95` além do `active:opacity-60` atual —
  micro-feedback de escala é comum em grades densas tipo esta
  (referência: seletores de data/calendário de apps atuais), mas é
  puramente cosmético e de baixo impacto — marcar como opcional.

## 6. `MenuAcoes.tsx` — bottom sheet de ações

- 🟡 `[feito]` **Sem ícones ao lado de cada ação.** Hoje é só texto ("Ler",
  "Compartilhar", "Copiar", "Excluir"...). Bottom sheets de ação em
  apps atuais quase sempre pareiam um ícone à esquerda de cada label —
  ajuda no scan rápido e é consistente com o resto do app, que já usa
  `MaterialIcons` em todo lugar (menos aqui). Mudança pontual: um mapa
  label→ícone opcional na prop `AcaoMenu`.
- ⚪ **Handle de arrastar (barrinha cinza no topo) e cantos
  arredondados só em cima já seguem o padrão nativo de bottom sheet** —
  correto, sem mudança.
- ⚪ Ação destrutiva já usa `text-red-600` — correto e consistente com
  `ModalNota`.

## 7. `ModalNota.tsx` — modal de nota

- 🟡 **Contador de caracteres ausente.** `TextInput multiline` sem
  limite visível nem contador. Verifiquei `core/repositories` — não
  existe nenhum limite de tamanho pra nota no banco hoje. Sem um
  limite real pra mostrar, um contador `X/500` seria um limite
  inventado, não documentado em lugar nenhum — deixei em aberto até
  você confirmar se quer um teto de verdade (e qual).
- ⚪ **Botões Cancelar/Salvar em `px-4 py-2`** (~34px de altura) —
  levemente abaixo do alvo de toque ideal (44px), mas por serem
  secundários dentro de um modal (não a ação primária da tela), é uma
  exceção aceitável em várias guidelines (Material permite botões de
  diálogo menores que os de tela). Não mudaria sem mais evidência de
  problema real de uso.

## 8. `PopoverVersiculo.tsx` — popover de referência bíblica

- 🟡 `[feito]` **Botão fechar "✕" é só texto, sem plano de fundo/toque
  circular** — funciona, mas destoa do resto do app, que usa botões
  circulares com fundo sutil pra "fechar" (ver `EscolherLivro`,
  `voce.tsx`). Padronizar como círculo `w-8 h-8` com leve
  `bg-cor-borda` daria mais peso de "botão" em vez de "caractere solto
  no canto".
- ⚪ **`max-h-[70%]` com `ScrollView` interno já resolve overflow em
  telas pequenas** — correto.
- ⚪ Título e "Ver capítulo inteiro" já com hierarquia clara — sem
  pendência.

## 9. `EstadoVazio.tsx` — estado vazio genérico

- ⚪ **Sem ícone/ilustração**, só texto (título + descrição). Estados
  vazios modernos geralmente têm algum elemento visual leve (ícone
  outline grande, 32-40px, em `text-cor-texto-suave`) acima do título —
  ajuda a diferenciar visualmente de um erro de carregamento (que
  também é só texto centralizado hoje, via `mensagemErroAmigavel`).
  Baixo risco, mudança pequena e reutilizada em todo o app de uma vez
  só (um componente, muitas telas).

## 10. `Toast.tsx` — toast de feedback

- ⚪ **Duração fixa de 2000ms pra qualquer mensagem**, incluindo
  mensagens mais longas de erro. Toasts atuais costumam escalar a
  duração pelo tamanho do texto (ex. mínimo 2s + 50ms por caractere
  acima de um limiar). Baixo impacto hoje porque a maioria das
  mensagens é curta, mas vale considerar se mensagens de erro mais
  longas passarem a usar o Toast no futuro.
- ⚪ Posição, cor, raio e sombra já seguem convenção esperada
  (flutuante, contraste invertido do tema) — sem pendência.

## 11. `Tooltip.tsx` — explicação sob demanda

- ⚪ **Modal cheio pra uma explicação curta** é mais pesado do que o
  necessário em telas grandes (web/tablet) — um popover ancorado perto
  do elemento tocado seria mais direto nessas telas, mas isso
  contradiz a decisão de design já registrada no próprio arquivo
  (preferir modal centralizado por ser mais simples de acertar em
  qualquer tamanho). Não mudaria sem revisar essa decisão com você
  primeiro — é uma troca de abordagem, não um ajuste incremental.

## 12. `BotaoTema.tsx` — alternar claro/escuro

- ⚪ **Ícone de sol/lua só como emoji (`☀`/`☾`) misturado com texto**
  ("☀ Claro"), enquanto todo o resto do app usa `MaterialIcons`.
  Padronizar pra `MaterialIcons name="light-mode"/"dark-mode"` deixaria
  visualmente consistente com o resto da UI (hoje é o único emoji de
  ícone de ação do app, os outros emojis restantes são conteúdo/decoração,
  não ícone funcional).

## 13. `FogoStreak.tsx` — chama animada da sequência

- ⚪ **Já é enxuto e correto** (SVG + Animated, sem dependência
  externa). Única observação: a animação de "respiração" roda
  indefinidamente mesmo se o card não estiver visível na tela (scroll
  longo) — consumo de CPU desprezível neste caso (é só 1 instância por
  vez), não vale a complexidade de pausar por `IntersectionObserver`.

## 14. `TextoComReferencias.tsx` — referências clicáveis no texto

- ⚪ **Sublinhado pontilhado já é uma boa affordance** (usado também
  como sugestão em `CardConquistas` acima, pra unificar linguagem
  visual de "isto é tocável dentro de um texto corrido"). Sem mudança
  necessária aqui — é a referência a seguir pros outros itens.

## 15. `GradeCapitulos.tsx`
*(já coberto no item 5 acima — mantido por ordem alfabética dos
arquivos, sem duplicar conteúdo.)*

---

## Como pretendo prosseguir

Meu plano é atacar os itens 🔴 primeiro (baixo risco, alto impacto
visual — sombra de texto do card do Início e badge de progresso das
medalhas), depois os 🟡 em ordem de tela mais visitada (Início → Você →
leitura), documentando e testando cada um ao vivo antes de passar pro
próximo, como venho fazendo. Os ⚪ eu só mexo se você confirmar que
valem a pena — são polimento, não correção de problema real.

Aguardando sua confirmação pra começar (ou me diga se quer que eu pule
direto pros 🔴/🟡 sem esperar aprovação item por item).
