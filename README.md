# Bíblia Plataforma

Uma plataforma bíblica completa, rápida e imersiva (Web + App), construída com Expo Router (React Native + Web) e NativeWind. 

Este projeto unifica a experiência de leitura bíblica, resumos teológicos, acompanhamento de progresso diário e medalhas num único código-fonte escalável, substituindo projetos fragmentados anteriores. O plano arquitetural original que guiou essa unificação está em [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md). 

Para visualizar o que já implementamos e o roadmap técnico (próximos passos estruturais), consulte o [`TODO.md`](./TODO.md) e o nosso [`CHANGELOG.md`](./CHANGELOG.md).

## Rodando localmente

Certifique-se de ter o Node.js e as ferramentas do Expo instaladas.

```bash
npm install
npm run web      # Roda no navegador
npm run android  # Roda no emulador/dispositivo Android
npm run ios      # Roda no simulador iOS (exclusivo para macOS)
```

> **Atenção (Dependências):** O `tailwindcss` está fixado na versão `^3.4` de propósito. A versão atual do NativeWind no projeto suporta apenas o Tailwind v3. Não atualize para Tailwind v4 para evitar quebras no build cross-platform.

## Estrutura de Diretórios Atual

```text
app/                  Rotas (Expo Router — cada arquivo é uma tela baseada em arquivos)
  _layout.tsx          Layout raiz (Contextos globais como NavbarContext, temas, css)
  (tabs)/              Navegação principal (Tabs na base)
    index.tsx            Home imersiva: Versículo do dia, Resumos, Streak e Medalhas
    resumos/             Sessão de estudos teológicos
    biblia/              Leitura bíblica
      escolher/          Fluxo estilo YouVersion (Lista de Livros + Acordeão de capítulos)
      [livro]/[capitulo] Tela de leitura avançada (Auto-scroll, foco, grifos)

core/                 Lógica de Negócios e Dados (Desacoplada da UI)
  types/                Interfaces globais de domínio (Grifos, Salvos, Notas)
  repositories/         Camada de Repositórios (Abstração do DB local via AsyncStorage)
  content/              Motor de resumos e livros estáticos (JSON parseado)
  biblia/               Motor de fetch e cache da Bible API
  leitura/              Hooks e lógicas de preferência (Fonte A+/A-, Serifada, Tema)

components/           Componentes de UI Reutilizáveis (Cards, Botões, Modais)

resumos-biblicos/     (Arquivos Markdown fonte com o texto teológico original)

scripts/
  gerar-conteudo.js    Gera o JSON consolidado lendo a pasta resumos-biblicos/
```

## Atualizando o conteúdo estático

O conteúdo original dos resumos teológicos mora em `resumos-biblicos/**/*.md`. Se você alterar algum arquivo lá, execute o construtor:

```bash
npm run gerar-conteudo
```

Isso compilará os arquivos para `core/content/dados/livros.json`. O app carrega instantaneamente esse arquivo. Nunca edite esse `.json` manualmente.

## Decisões Arquiteturais e de UX

- **Padrão de Repositório**: Nenhuma tela se comunica direto com o banco de dados (AsyncStorage). Tudo passa por `core/repositories`. Isso garante que uma eventual migração para SQLite, Zustand persistido, ou Cloud Sync seja invisível para o frontend.
- **Identidade Inicial (OwnerID)**: Toda interação no app (progresso, grifos) já é vinculada a um UUID de dispositivo. Isso evita dor de cabeça em migrações futuras para usuários logados.
- **Experiência Imersiva**: O app oculta ativamente distrações durante a rolagem do texto bíblico, trocando cabeçalhos grandes por rodapés minimalistas. Suporta auto-scroll inteligente (pulando direto para um versículo escolhido) avaliando a árvore do DOM via `onLayout` do React Native.
- **Performance e Cache**: Requisições à `bible-api.com` são cacheadas agressivamente localmente para reduzir latência a quase zero em leituras subsequentes.

## Funcionalidades Atuais

- **Acessibilidade A+**: Modal dinâmico para controle de tamanho da fonte (5 níveis), toggle de fonte serifada e tema dark/light fluído.
- **Modo Foco e Wayfinding**: Barras de navegação inteligentes que somem no scroll e breadcrumbs visuais guiando o usuário.
- **Grifos e Marcações**: Marque os textos de cor sólida no menu sem perder a fluidez translúcida sobre o texto bíblico na leitura. Sistema completo com persistência.
- **Skeletons & Tolerância a Erros**: Buscas avançadas que ignoram acentos. Loading skeletons elegantes que substituem os "spinners" pesados na navegação de capítulos.
- **Navegação em Acordeão**: Escolha livros, abra os capítulos sem mudar de tela e escolha o versículo em grade.
