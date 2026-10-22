# Relatório da jornada do QR às leituras bíblicas

**Data:** 2026-10-21
**Escopo:** página inicial “Tem alguém que te ama” → `/conhecer` → leituras introdutórias → referências em `/leitura`.
**Estado:** checkpoints estáticos concluídos; validação em aparelho e domínio público permanece pendente.

## Resultado

A exportação web atual contém as rotas da jornada e os links inspecionados apontam para arquivos HTML existentes. O HTML exportado tem metadados de título e descrição para a página inicial, o hub `/conhecer` e as três leituras introdutórias. As referências dessas leituras usam caminhos estáticos de capítulo e parâmetros `versiculo` quando aplicável. Não encontrei falha técnica acionável que justificasse alterar o fluxo nesta auditoria.

## Checkpoints e evidências

1. **Entrada do impresso:** `dist/index.html` apresenta o título “Tem alguém que te ama.” e uma descrição sobre o amor de Deus revelado em Jesus Cristo. A página inclui o caminho para `/conhecer` e links diretos para referências bíblicas.
2. **Hub de leituras:** `dist/conhecer/index.html` tem título e descrição próprios. Seus links para `/conhecer/jesus`, `/conhecer/biblia`, `/conhecer/salvacao` e `/leitura` resolvem para documentos exportados.
3. **Leituras introdutórias:** os HTML de Jesus, Bíblia e salvação incluem título e descrição próprios, link de retorno ao hub e links de referências bíblicas.
4. **Referências:** percorri os `href` locais das páginas principais e confirmei que cada caminho `/conhecer` ou `/leitura` aponta para arquivo `.html` ou `index.html` existente em `dist`. Os parâmetros de versículo permanecem na URL, enquanto o caminho corresponde ao arquivo de capítulo exportado. `npm run check:temas` confirmou 32 referências publicadas de temas na ACF local; as referências das leituras introdutórias foram inspecionadas nas páginas exportadas.
5. **Acessibilidade estrutural:** os títulos principais e de seção usam `accessibilityRole="header"`; links de navegação têm papel de link e setas decorativas são ocultadas da árvore acessível. `npm run check:a11y` aprovou 111 contratos críticos.
6. **Tipo e exportação:** `npm run typecheck` passou. `npm run check:static` passou: SEO e favicon verificados em 23 rotas críticas e 1.312 arquivos HTML; 1.189 capítulos estáticos presentes.

## Limites e próximos checkpoints

- Ainda não validei o QR impresso apontando para o domínio final nem a resolução de URL direta, recarga e retorno em produção. Antes de imprimir em quantidade, escanear a arte final com iOS e Android e confirmar domínio, HTTPS e destino `/`.
- A confirmação de que a hospedagem Vercel serve corretamente arquivos e URLs com query string exige Preview/produção; a presença dos arquivos na exportação local não prova o comportamento do CDN.
- A auditoria de estrutura não substitui teste de leitura com teclado e leitor de tela real, nem inspeção visual em telas pequenas.
- Confirmar a experiência ponta a ponta no aparelho: escanear QR → ler a narrativa → abrir `/conhecer` → escolher cada leitura introdutória → tocar em referências com e sem versículo → voltar ao hub e à página inicial.
- A revisão pastoral e editorial do conteúdo e a verificação de direitos da tradução devem ocorrer antes da divulgação pública.

## Instrução de plataforma

Li `AGENTS.md` e a documentação oficial versionada do Expo SDK 57.0.0 antes da auditoria, conforme a instrução do repositório. Não foi necessário alterar código nesta frente.
