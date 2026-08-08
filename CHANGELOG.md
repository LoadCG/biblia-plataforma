# Changelog

Todas as mudanças notáveis feitas no projeto serão documentadas neste arquivo.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

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
