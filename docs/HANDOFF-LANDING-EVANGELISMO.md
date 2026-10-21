# Handoff — Landing de evangelismo

**Atualizado em:** 2026-10-21  
**Repositório:** `biblia-plataforma`  
**Branch:** `codex/landing-evangelismo-mvp`  
**Base remota antes deste handoff:** `28866f9` (`feat: refine editorial interface and scroll-driven motion`)

## Estado do trabalho

A implementação da landing e seus refinamentos de navegação estão nesta branch. Nesta sessão foi corrigido o encaminhamento inicial da aba `/leitura`: sem histórico salvo ou quando a recuperação falha, o app troca para a rota canônica `/leitura/escolher`.

A landing inclui um atalho no primeiro quadro para a continuação, foco do título no destino, sequência disponível na árvore acessível, rolagem principal focável por teclado, progresso semântico, tema persistido localmente, safe areas no layout e fontes do sistema na rota inicial.

## Validação feita

- Expo Web confirmou `/leitura` → `/leitura/escolher` e exibiu a lista de livros.
- O atalho foi exercitado em `390×844` e `320×640`; chegou às opções e moveu o foco para o título.
- O CTA “Abrir a Bíblia online” funcionou em `320×640`; o seletor carregou e Voltar retornou à seção de opções.
- Foram medidos nove viewports: `320×640`, `360×800`, `375×812`, `390×844`, `414×896`, `768×1024`, `1024×768`, `1280×800` e `1440×900`. Em todos, o CTA do primeiro quadro estava no viewport, não houve overflow horizontal e os elementos da seção final ficaram dentro da largura disponível.
- `tsc --noEmit`, `scripts/verificar-maestro.js`, `scripts/verificar-copy-interface.js` e `git diff --check` passaram nesta sequência de trabalho.
- O browser de preview reportou `prefers-reduced-motion: reduce`; portanto, a animação ligada e a alternância manual para leitura contínua não foram testadas nestas medições. O viewport foi restaurado ao padrão.

## Pendências conhecidas

1. Completar CP5a com movimento normal, alternância manual, toque real, quebra de texto e repetição dos nove tamanhos após esse modo.
2. Executar em aparelhos: Safari iOS, Chrome Android e navegador embutido de QR; conferir safe areas e barras dinâmicas.
3. Executar CP5b com teclado, VoiceOver e NVDA; conferir ordem de títulos, progressbar, foco e preferência de movimento reduzido.
4. Executar CP5c com rede lenta/cache limpo e verificar fontes externas em `/conhecer`.
5. Resolver os contratos preexistentes que fazem `scripts/verificar-acessibilidade.js` e `scripts/verificar-ui-responsiva.js` falharem em outras telas (seletor antigo e capítulo bíblico).
6. A suíte Jest anteriormente ficou em 27/28 suites (200/201 testes); a falha preexistente está em `core/leitura/__tests__/navegacaoMedalhas.test.ts` (espera `/`, recebe `/biblia`).
7. CP0–CP3 e CP6–CP7 continuam com gates editoriais, direitos, conteúdo, domínio, privacidade e impressão. A narrativa segue rascunho até aprovação pastoral; não publicar nem divulgar QR com base apenas neste trabalho.

## Arquivos de trabalho

- `app/(tabs)/leitura/index.tsx` — fallback de entrada para o seletor canônico.
- `components/LandingEvangelismo.web.tsx` — preferência de tema, semântica e navegação da landing.
- `global.css` — responsividade, safe areas, foco, tipografia e comportamento de leitura.
- `docs/PLANEJAMENTO-LANDING-EVANGELISMO.md` — roadmap, achados e evidências CP4/CP5.

## Próxima sessão

Retomar pelo CP5: configurar o browser sem `prefers-reduced-motion`, repetir o atalho e a auditoria dos nove viewports nos modos animado e contínuo, registrar capturas/resultados e corrigir apenas falhas reproduzíveis. Depois concluir testes em dispositivos e leitores de tela. Consultar a [documentação versionada do Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) antes de alterar código que dependa do Expo.
