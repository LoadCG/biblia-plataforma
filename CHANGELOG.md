# Changelog

Todas as mudanças notáveis feitas no projeto serão documentadas neste arquivo.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased] - 2026-08-10 (continuação)

### Adicionado
- **Toast global**: `core/util/toast.ts` (pub-sub mínimo, sem Context) + `components/Toast.tsx`, montado uma vez em `app/_layout.tsx`. Fecha o item 5.1 do FUNCIONALIDADES.md — copiar versículo/link agora mostra "Copiado!" no web, tanto na leitura de capítulo quanto no `CardAtividade`/`compartilhador.ts`.
- **Áudio da leitura**: `core/leitura/audio.ts` narra o capítulo em voz alta, versículo por versículo (Web Speech API no web, `expo-speech` no nativo — nova dependência, sem custo/servidor). Botão de play/pause no cabeçalho da leitura, destaque visual e auto-scroll acompanhando o versículo sendo lido, parando sozinho ao trocar de capítulo ou sair da tela.

## [Unreleased] - 2026-08-10

### Adicionado
- **Versículos salvos na atividade**: `versiculosSalvosRepository` agora entra no agregador de atividade (`core/estatisticas/atividade.ts`); a tela `/salvo` ganhou o filtro "Salvos" e o `CardAtividade` passou a excluir salvos, fechando um gap onde salvar um versículo não aparecia em nenhum lugar da UI.
- **Progresso por livro na lista de leitura**: cada card da lista de livros (`app/(tabs)/biblia/escolher/index.tsx`) mostra agora "X de Y" capítulos lidos, calculado com uma única leitura de `progressoRepository.listarTodos`.
- **Lembrete de plano de leitura parado**: novo `core/leitura/lembretePlanos.ts` e método `obterUltimaConclusao` no `PlanosRepository` (local + SQLite); a Início mostra um card discreto convidando a continuar um plano iniciado e parado há pelo menos 1 dia, sem tom de cobrança.
- **Atalho de teclado para tema**: na leitura de capítulo (web), a tecla `T` alterna entre claro/escuro, somado à navegação por seta já existente; ignora quando o foco está num campo de texto.
- **Link real ao compartilhar/copiar versículo**: `core/util/linkVersiculo.ts` monta um link (`origin + /biblia/[livro]/[capitulo]?versiculo=N`) usando `window.location.origin` — funciona em qualquer domínio, sem depender da decisão final de domínio do projeto. Aplicado na leitura do capítulo e no `CardAtividade`. Só funciona no web; o app nativo continua compartilhando só texto/referência.

### Modificado
- **Acessibilidade de botões só-de-ícone**: adicionado `accessibilityLabel` em vários controles da leitura de capítulo (voltar, ajustes, cancelar seleção, cores de grifo, expandir cores, A-/A+) que não tinham nome acessível nenhum; o sino de notificação (placeholder, ainda sem ação) da Início virou `disabled` com label "em breve" em vez de ficar focável sem fazer nada.

### Documentado
- `FUNCIONALIDADES.md` atualizado: itens 2.4b, 2.7, 4.1, 4.2, 4.3, 5.1, 7.2, 7.4 e 7.5 revisados para refletir o que foi implementado ou medido nesta sessão (alguns já estavam prontos e só a documentação estava desatualizada).

## [Unreleased] - 2026-08-08

### Adicionado
- **Modal de Ajustes de Leitura**: Um novo bottom sheet com controles elegantes para ajustar fonte (A-/A+), tipo de fonte (serifada/sem serifa) e alternância rápida do tema claro/escuro.
- **Acordeão de Livros**: O fluxo de seleção de capítulos agora ocorre na própria lista de livros. O livro da sua última leitura se abre automaticamente!
- **Tela de Seleção de Versículos**: Uma nova tela (`[livro]/[capitulo].tsx`) com grid para escolha exata do versículo de início, inspirada nos melhores apps de leitura bíblica.
- **Auto-scroll na leitura**: Ao escolher um versículo, o app realiza uma rolagem automática (usando cálculo `onLayout` dos componentes) até a posição exata da tela.
- **Modo de Foco Inteligente (Leitura)**: Durante a rolagem (scrolling) o TabBar principal e os cabeçalhos são ocultados e dão lugar a uma pequena barra minimalista mostrando apenas o nome do livro e capítulo atual.
- Dependência `expo-clipboard` instalada para permitir a cópia confiável e nativa dos versículos selecionados.

### Modificado
- **Design Premium da TabBar**: A barra de navegação principal foi repaginada para ficar muito mais leve e moderna (ícone em cima, texto pequeno). 
- A aba principal de pesquisa agora foi renomeada para "Descubra".
- **Tipografia e Contraste na Leitura**: Versículos reestilizados para atuar como "sobrescrito" (leves, tamanho menor e transparentes). No modo escuro, o texto branco forte foi substituído por uma cor off-white (#EAEAEA), que reduz a fadiga ocular.
- **Grifos de Texto**: A paleta de grifos foi reformulada. As bolinhas de seleção agora utilizam cores sólidas de alto contraste, enquanto o destaque aplicado ao texto bíblico utiliza tons pastéis translúcidos, preservando a leitura.
- Busca tolerante em toda a plataforma.
- Melhoria geral de estabilidade.

### Removido
- Telas intermediárias de seleção de capítulos isolados (`escolher/[livro]/index.tsx`) foram completamente deletadas, consolidando toda a experiência na tela principal de "Livros" em formato de acordeão expansível.
- Botão "Sair da Tela Cheia" flutuante removido; agora o foco e desfoco ocorrem de maneira totalmente orgânica e invisível durante o scroll.
