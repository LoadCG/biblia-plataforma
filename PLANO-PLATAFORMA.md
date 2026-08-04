# Plano: evolução para plataforma (site + app), decisões de arquitetura

Este documento registra as decisões de arquitetura combinadas antes de
iniciar a reescrita do projeto como uma plataforma única (web + mobile).
O site atual, estático em `docs/`, continua no ar sem alterações até a
virada — este plano é para um **repositório novo e separado**.

## Contexto e motivação

O site atual (Markdown → HTML estático, zero dependências) já atende bem
ao que é hoje: conteúdo de leitura, sem custo de infraestrutura. A
motivação para reescrever não é "tecnologia mais nova" por si só, é a
necessidade real de: conta de usuário, sincronização de dados (grifos,
progresso, notas) entre dispositivos, e um app mobile com peso igual ao
do site na experiência do produto.

## Decisão 1 — Um código só: Expo Router (React Native + Web)

Em vez de dois códigos separados (Next.js + React Native) compartilhando
só uma biblioteca de lógica, a decisão foi por um **único código-fonte**
(Expo Router) rodando como app iOS, Android e site web a partir das
mesmas rotas e componentes.

- **Motivo:** o app tem peso igual ou maior que o site na visão do
  projeto — um código único maximiza velocidade de entregar a mesma
  função nos dois lugares.
- **Mitigação do risco de SEO:** as rotas de conteúdo (resumos, leitura
  bíblica) usam o modo de exportação estática do Expo Router para web,
  gerando HTML real e rastreável — precisa ser configurado
  explicitamente por rota, não é automático.
- **Estilização:** NativeWind (Tailwind aplicado a React Native e Web ao
  mesmo tempo) — mesma sintaxe de classes, roda nas três plataformas.
- **Monorepo (Turborepo etc.):** descartado por enquanto — só voltaria a
  fazer sentido se surgir um segundo app/serviço de verdade. Um projeto
  Expo com pastas organizadas (`app/`, `core/`, `components/`) resolve.
- **Hospedagem:** EAS Hosting como principal candidato (integrado ao
  fluxo do Expo), Vercel como alternativa viável (a saída web é HTML/JS
  padrão).

## Decisão 2 — Modelo de dados

Duas famílias de dados que não se misturam:

**Conteúdo** (fixo, igual para todos): livros, capítulos, resumos
históricos. Reaproveita a estrutura já validada em `scripts/gerar-site.js`
(`SECTION_META`, `ALIASES_LIVRO`, `CAPITULOS_POR_LIVRO`) — só troca
"gerar HTML" por "gerar dados tipados" consumidos pelos componentes.

**Dados do usuário** (por pessoa, precisa de dono): grifos, progresso,
notas. Decisão-chave: todo registro nasce com um `ownerId` desde o
primeiro commit, mesmo sem login — um UUID anônimo gerado no dispositivo.
Quando o login existir, esse UUID é trocado pelo ID da conta real e os
registros são re-associados, sem migração de schema.

```ts
type Grifo = {
  ownerId: string;
  livroSlug: string;
  capitulo: number;
  versiculo: number;
  criadoEm: string;
};
```

## Decisão 3 — Camada de repositório (interface fixa, implementação trocável)

```ts
interface GrifosRepository {
  listarPorCapitulo(ownerId: string, livroSlug: string, capitulo: number): Promise<Grifo[]>;
  estaGrifado(ownerId: string, ref: { livroSlug: string; capitulo: number; versiculo: number }): Promise<boolean>;
  alternar(ownerId: string, ref: { livroSlug: string; capitulo: number; versiculo: number }): Promise<boolean>;
}
```

Hoje: implementação local (AsyncStorage). Depois: implementação com banco
de dados (Supabase ou Firebase — decisão adiada até virar necessidade
real), mesma assinatura. As telas nunca sabem qual está por trás.
Repositórios equivalentes para `ProgressoRepository` e `NotasRepository`.

## Decisão 4 — Proxy/cache para o texto bíblico

O app não deve falar direto com a bible-api.com. Uma rota de API do
próprio Expo Router funciona como proxy com cache, reduzindo risco de
rate limit e criando um ponto único pra trocar a fonte do texto bíblico
no futuro (ex.: texto próprio num banco de dados) sem mexer no app.

## Decisão 5 — Estrutura de rotas

```
app/
  index.tsx                          → home
  resumos/[livro].tsx                → resumo histórico do livro
  biblia/index.tsx                   → escolher livro
  biblia/[livro]/index.tsx           → escolher capítulo
  biblia/[livro]/[capitulo].tsx      → leitura (grifar, marcar lido)
  api/versiculo/[ref]+api.ts         → proxy/cache da bible-api.com
```

## Decisão 6 — Tema visual

As variáveis CSS já existentes no site atual (`--cor-destaque`,
`--cor-grifo`, cores de gênero literário, tema claro/escuro) são
portadas diretamente para tokens de cor no `tailwind.config.js` do
NativeWind — baixo risco, é conversão direta de valores já validados.

## Checklist de paridade com o site atual

Nada abaixo pode ficar pra trás na reescrita:

- Busca por nome de livro e por conteúdo dos resumos
- Grifar versículo, marcar capítulo e livro como lido
- Navegação anterior/próximo cruzando livros
- Tema claro/escuro, tamanho de fonte ajustável
- Leitura offline — em aberto: no app nativo é o próprio app instalado;
  a versão *web* exportada ainda precisa de estratégia própria (service
  worker), a decidir na implementação

## Questões jurídicas a considerar

**Aviso:** isto não substitui consulta a um advogado — é um mapa do que
precisa de atenção, não uma análise jurídica. Vale revisão profissional
antes de lançar publicamente com contas de usuário reais.

### Direitos autorais do texto bíblico

A tradução Almeida usada hoje via bible-api.com retorna `"Public Domain"`
na resposta da API, mas existem várias revisões da Almeida com direitos
autorais diferentes (a tradução original de João Ferreira de Almeida,
1681/1753, é de domínio público; revisões modernas como ARA, ARC ou a
Nova Almeida Atualizada pertencem a instituições como a Sociedade Bíblica
do Brasil ou editoras). **Antes de armazenar o texto bíblico em banco de
dados próprio** (Decisão 4, fase futura), é preciso confirmar exatamente
qual edição é essa e se ela é mesmo de domínio público — copiar/redistribuir
uma revisão com direitos reservados, mesmo gratuitamente, é risco real.

### Termos de uso da bible-api.com

Antes de aumentar a dependência dela (ou de fazer proxy/cache em maior
escala), vale reler os termos de uso do serviço — APIs gratuitas às vezes
restringem uso comercial ou volume alto sem aviso prévio.

### LGPD (Lei Geral de Proteção de Dados)

Assim que existir conta de usuário e banco de dados guardando informação
pessoal (e-mail, grifos, notas, progresso de leitura), a LGPD se aplica:

- Política de privacidade e termos de uso publicados e acessíveis
- Base legal clara para tratar os dados (ex.: consentimento, execução de
  contrato)
- Mecanismo para o usuário acessar, exportar e excluir seus próprios
  dados (o modelo de `ownerId` da Decisão 2 já facilita isso)
- Definição de por quanto tempo os dados ficam guardados após o usuário
  parar de usar o app
- Se a base de usuários crescer, pode ser necessário designar um
  encarregado de dados (DPO)

### Público menor de idade

O projeto é voltado a "jovens e adolescentes" — se contas forem abertas
por menores diretamente (sem ser através de um responsável/igreja), tanto
a LGPD quanto políticas de app stores têm regras específicas sobre dados
de menores (ex.: consentimento parental). Vale decidir a política de
idade mínima antes de implementar cadastro.

### Políticas de loja de app (Apple App Store / Google Play)

Conteúdo religioso é normalmente aceito sem problema. Pontos que exigem
atenção na hora de publicar: rótulo de privacidade da Apple ("App
Privacy") e a seção "Data Safety" do Google — ambos exigem declarar
exatamente quais dados o app coleta; se no futuro houver funcionalidade
social/comunitária, entra também a exigência de moderação de conteúdo
gerado por usuário.

### Autoria do conteúdo dos resumos

Os 66 resumos históricos são conteúdo próprio, escrito para o projeto —
não há problema de direitos autorais aqui, mas vale manter esse
entendimento registrado caso o projeto cresça e outras pessoas passem a
contribuir com conteúdo (definir, se isso acontecer, como a autoria e a
licença desse conteúdo funcionam).

## Em aberto (decidir durante a implementação, não antes)

Banco de dados (Supabase vs. Firebase — só quando virar necessidade
real), nome definitivo e domínio, publicação em lojas de app vs. PWA
instalável no início, momento de introduzir login.
