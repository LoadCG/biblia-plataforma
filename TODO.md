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
- [ ] **Persistência de Dados**: Migrar o armazenamento de Grifos, Salvos e Notas para o AsyncStorage ou SQLite local, garantindo que não se percam após fechar o app.
- [ ] **Modo Offline & Cache Persistente**: Salvar o texto bíblico baixado no aparelho para leitura sem internet, substituindo a chamada remota constante à Bible API.
- [ ] **Histórico de Leitura (Recentemente Lidos)**: Adicionar uma lista horizontal rolável de "Continuar de onde parou" na tela Início.
- [ ] **Planos de Leitura Diária**: Implementar um cronograma de acompanhamento e devocionais diários, integrando com as notificações do celular.
- [ ] **Testes E2E e Unitários**: Adicionar testes com Jest e React Native Testing Library para garantir a estabilidade das navegações e lógicas de interação pesadas da tela de leitura (scroll, layouts assíncronos, highlighting).
