# Bíblia Plataforma

Uma plataforma bíblica completa, rápida e imersiva (Web + App), construída com Expo Router (React Native + Web) e NativeWind. 

Este projeto unifica a experiência de leitura bíblica, resumos teológicos, acompanhamento de progresso diário e medalhas num único código-fonte escalável, substituindo projetos fragmentados anteriores. O plano arquitetural original que guiou essa unificação está em [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md). 

Para visualizar o que já implementamos e o roadmap técnico (próximos passos estruturais), consulte o [`TODO.md`](./TODO.md), o checklist detalhado em [`FUNCIONALIDADES.md`](./FUNCIONALIDADES.md) e o nosso [`CHANGELOG.md`](./CHANGELOG.md).

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
  (tabs)/              Navegação principal (Início, Bíblia, Descubra, Você)
    index.tsx            Home imersiva: Versículo do dia, Resumos, Streak e Medalhas
    resumos/             Sessão de estudos teológicos
    biblia/              Leitura bíblica
      escolher/          Fluxo estilo YouVersion (Lista de Livros + Acordeão de capítulos)
      [livro]/[capitulo] Tela de leitura avançada (Auto-scroll, foco, grifos, notas, salvos)
    pesquisa.tsx          Busca por temas + busca full-text na Bíblia inteira (SQLite FTS5)
    voce.tsx              Perfil, atividade, gamificação e atalho de configurações
  planos/               Planos de leitura diária (listagem + progresso por dia)
  salvo.tsx             Grifos, notas, salvos e pesquisas favoritas, num só lugar
  estatisticas.tsx       Estatísticas pessoais de leitura
  configuracoes.tsx      Fonte, tema e outras preferências

core/                 Lógica de Negócios e Dados (Desacoplada da UI)
  types/                Interfaces globais de domínio (Grifos, Salvos, Notas, Planos)
  repositories/         Camada de Repositórios (implementação SQLite; interface trocável)
  content/              Motor de resumos, livros e planos de leitura (JSON parseado)
  biblia/               Motor de fetch/cache da bible-api.com + busca full-text local (FTS5)
  leitura/              Hooks e lógicas de preferência (Fonte A+/A-, Serifada, Tema, lembretes)
  estatisticas/         Streak, conquistas, atividade agregada e compartilhamentos

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

Registro completo (com o raciocínio por trás de cada escolha) em [`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md). Resumo:

- **Padrão de Repositório**: Nenhuma tela se comunica direto com o banco de dados. Tudo passa por `core/repositories` (hoje implementado com `expo-sqlite`, offline). Isso garante que uma eventual migração pra Cloud Sync seja invisível para o frontend.
- **Identidade Inicial (OwnerID)**: Toda interação no app (progresso, grifos, notas, salvos, planos) já é vinculada a um UUID de dispositivo. Isso evita dor de cabeça em migrações futuras para usuários logados.
- **Experiência Imersiva**: O app oculta ativamente distrações durante a rolagem do texto bíblico, trocando cabeçalhos grandes por rodapés minimalistas. Suporta auto-scroll inteligente (pulando direto para um versículo escolhido) avaliando a árvore do DOM via `onLayout` do React Native.
- **Bíblia offline e busca full-text**: o texto bíblico completo (Almeida ACF, ~31 mil versículos) é embutido no app e indexado numa tabela virtual FTS5 do SQLite na primeira execução — a busca por palavra roda 100% local, sem depender de rede.

## Funcionalidades Atuais

Checklist completo e detalhado (funcionalidade + UX/UI, item por item) em [`FUNCIONALIDADES.md`](./FUNCIONALIDADES.md). Resumo:

- **Acessibilidade de leitura**: controle de tamanho da fonte, fonte serifada opcional e tema dark/light fluído, compartilhados entre leitura de resumo e de capítulo.
- **Modo Foco e Wayfinding**: barras de navegação que somem no scroll durante a leitura, barra fixa de navegação entre capítulos.
- **Grifos em várias cores, notas e versículos salvos**: sistema completo com persistência local, reunidos numa única tela (`/salvo`).
- **Busca**: por nome/conteúdo dos resumos e por palavra em toda a Bíblia (full-text local), tolerante a acentos.
- **Planos de leitura diária**: trilhas com progresso por dia e lembrete discreto na Início quando um plano fica parado.
- **Progresso, streak e conquistas**: sequência de dias lendo, medalhas por marcos do cânon, estatísticas pessoais de leitura.
