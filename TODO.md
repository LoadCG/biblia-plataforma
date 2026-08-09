# Planejamento e Tarefas (TODO)

## Feito / Completed ✅
- [x] **Visibilidade do Status do Sistema (Wayfinding & Navegação)**: Implementação de breadcrumbs claros na navegação.
- [x] **Feedback de Carregamento**: Implementação de skeleton loading nas trocas de capítulos.
- [x] **Prevenção de Erros e Busca Tolerante**: Barra de pesquisa otimizada para lidar com buscas sem acentuação e tolerância a erros.
- [x] **Modo Foco / Imersivo**:
  - [x] Ocultar navbar principal via `NavbarContext` dinâmico durante a rolagem.
  - [x] Adição de uma barra minimalista no rodapé indicando o livro/capítulo atual.
- [x] **Acessibilidade de Leitura (Liberdade do Usuário)**:
  - [x] Controles de aumento/diminuição de fonte (A- / A+) e troca de serifada integrados em um Modal "Bottom Sheet" elegante.
  - [x] Tipografia subliminar para números dos versículos (tamanho menor, opacity 50%, sobrescrito).
  - [x] Ajuste da cor principal de texto no modo escuro para off-white (#EAEAEA) reduzindo cansaço visual.
- [x] **Refatoração da Navegação Bíblica (Acordeão YouVersion-style)**:
  - [x] Remoção da tela antiga de escolha de capítulos (`escolher/[livro]/index.tsx`).
  - [x] Implementação de lista em acordeão na tela de Livros.
  - [x] Criação de tela dedicada para escolha de versículos em grade de 5 colunas (`escolher/[livro]/[capitulo].tsx`).
  - [x] Auto-scroll inteligente ao entrar no versículo alvo, lendo query params e utilizando as posições (Y) medidas dinamicamente via `onLayout`.
- [x] **Refatoração de Estado Global Local (NavbarContext)**: Criado um context provider leve no layout principal (`app/(tabs)/_layout.tsx`) para que qualquer tela filha possa ocultar a tab bar.

## Próximos Passos (Next Steps) 🚀

Abaixo, um detalhamento técnico e arquitetural de como implementaremos as próximas evoluções da plataforma, garantindo escalabilidade e robustez.

### 1. [x] **Persistência de Dados (SQLite / Zustand + MMKV)**
- **O Desafio:** Atualmente, os grifos, notas e itens salvos podem se perder ao fechar o app, pois estão apenas em estado de sessão ou dependem de abstrações em memória.
- **Como Fazer:**
  - Migrar os repósitórios locais (`LocalGrifosRepository`, etc.) para o `expo-sqlite` caso tenhamos dados relacionais complexos, OU usar uma store global com `zustand` integrada ao `react-native-mmkv` para persistência super rápida e síncrona de chave-valor.
  - Implementar um adapter que espelha as operações de memória (`Map` / `Set`) em JSONs persistidos.
  - **Benefício:** Experiência consistente; o usuário não perde o histórico e o banco de dados fica pronto para uma futura sincronização em nuvem.

### 2. [x] **Modo Offline & Cache Persistente Inteligente**
- **O Desafio:** A leitura da Bíblia precisa ser instantânea e não pode depender de conexão ativa constante.
- **Como Fazer:**
  - Implementar um Service Worker (em web) ou usar `expo-file-system` + `SQLite` (nativo) para baixar a base da Bíblia inteira (~5MB de texto JSON).
  - Modificar a `BibliaAPI.ts` para checar primeiro o cache persistente. Se o livro existir, não bater na rede.
  - Criar um botão "Baixar Bíblia para acesso Offline" nas configurações.
  - **Benefício:** A leitura de qualquer capítulo ficará na ordem de < 10ms, eliminando os loaders e quebras por falta de rede.

### 3. [x] **Histórico de Leitura (Continue Lendo / Recentemente Lidos)**
- **O Desafio:** Facilitar o retorno do usuário para capítulos que ele estava estudando ontem, quebrando a fricção de sempre ter que caçar o livro na tela de seleção.
- **Como Fazer:**
  - Criar um estado persistido `historicoLeituras: Array<{livro, capitulo, timestamp, versiculoProgresso}>`.
  - Toda vez que a tela de leitura for desmontada ou no evento de background do app, salvar o último livro/capítulo acessado na primeira posição da fila (LRU cache com limite de 10 itens).
  - Na tela Início, renderizar um `<ScrollView horizontal>` com cards minimalistas apontando direto pra leitura (`router.push`).

### 4. [x] **Planos de Leitura Diária e Devocionais**
- **O Desafio:** Manter o engajamento diário de leitura.
- **Como Fazer:**
  - Modelar em JSON a estrutura de Planos (ex: "Bíblia em 1 ano" -> Array de 365 dias, contendo refs bíblicas).
  - Usar o `expo-notifications` para criar agendamentos locais (Local Notifications) sempre às 7h da manhã com um versículo ou lembrete, sem precisar de servidor push backend.
  - Acompanhar progresso via barra de progresso preenchida com a quantidade de dias completados no AsyncStorage.

### 5. [x] **Testes E2E e Unitários com Jest**
- **O Desafio:** As lógicas complexas (como cálculo de layout de rolagem e indexação de versículos) quebram facilmente em refatorações maiores.
- **Como Fazer:**
  - Instalar `jest`, `@testing-library/react-native`.
  - Escrever unit testes para as core business rules (`BibliaAPI`, `calcularSequenciaAtual`).
  - Escrever testes E2E com Maestro ou Detox testando a jornada principal: `Abrir App -> Escolher Livro -> Escolher Versículo -> Grifar Texto`.

### 6. [x] **Busca Global na Bíblia Completa**
- **O Desafio:** A pesquisa atual busca apenas os resumos históricos dos livros. O usuário precisa conseguir pesquisar qualquer palavra-chave e encontrá-la em toda a Bíblia, recebendo os versículos na hora.
- **Como Fazer:**
  - Integrar um motor de busca local rápido após baixar a base offline. Se o aplicativo migrar para SQLite, utilizaremos índices **FTS5 (Full-Text Search)** nativos.
  - Se mantivermos arquivos JSON estáticos, construiremos um "Inverted Index" reduzido e otimizado em WebWorker/Thread paralela.
  - Na tela de pesquisa, os resultados serão divididos em abas visuais: "Resultados em Resumos" e "Resultados na Bíblia".

### 7. [x] **Reformulação Visual da Aba Pesquisa (Descubra)**
- **O Desafio:** A interface de pesquisa atual tem temas em formato de cards simples com emojis. O usuário forneceu prints de um app líder de mercado como inspiração ("ideias boas"), focando na estrutura de descoberta e atalhos.
- **Diretriz de Design:** **Não copiar explicitamente.** As referências servem apenas para inspirar a estrutura de UX. A identidade visual, ícones e paletas de cores devem ser originais e alinhados com o nosso app.
- **Como Fazer (Adaptação das Ideias):**
  - Alterar o título de "Pesquisa" para "Descubra" (ou sinônimo adequado).
  - Adicionar uma linha de botões de atalhos funcionais para recursos do nosso app abaixo da barra de pesquisa.
  - Refatorar os cards de `TEMAS_BUSCA` para um grid estruturado.
  - O estilo de cada card de tema deve ter:
    - Fundo com cor sólida pastel/vibrante da nossa própria paleta.
    - O título do tema alinhado de forma clara e legível.
    - Uma ilustração ou imagem gerada dinamicamente (com estilo próprio do nosso app) flutuando no card para gerar interesse visual.

### 8. [x] **Reformulação Visual da Aba Perfil (Você)**
- **O Desafio:** A página de perfil atual não explora o potencial de pertencimento e gamificação. O usuário forneceu referências de estrutura de perfil premium (focada em métricas de leitura e comunidade) apenas como inspiração.
- **Diretriz de Design:** **Criar de forma autêntica.** Usaremos as boas ideias de gamificação (como cards de métricas e display de medalhas), mas os desenhos das medalhas, o estilo dos cards e as métricas específicas serão 100% autorais e focadas no nosso ecossistema de conteúdo.
- **Como Fazer (Adaptação das Ideias):**
  - Criar um cabeçalho superior bem estruturado com configurações e atalhos rápidos do usuário.
  - Reformular a exibição do perfil com layout claro (Nome em destaque, tag de progresso, localização e foto harmonizadas).
  - Criar uma área de botões rápidos para ações chave (ex: Salvos, Notas, etc).
  - Desenvolver **Cards de Gamificação Próprios**, incluindo:
    - Card de Streak (Perseverança) evoluindo nosso "Foguinho" atual.
    - Card de Estatísticas de Leitura original.
    - Card Imersivo de Medalhas: Um container elegante exibindo nossas medalhas originais de leitura (Pentateuco, Evangelhos, etc.) em destaque com barras de progresso próprias.
