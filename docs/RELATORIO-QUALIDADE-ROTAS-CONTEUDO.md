# Relatório de qualidade de rotas e conteúdo navegável

**Data:** 2026-10-21
**Escopo:** rotas e links internos de `Descubra`/leituras introdutórias, temas, planos e resumos.
**Estado:** auditoria estática concluída; sem defeito de link acionável confirmado.

## Resumo

Inspecionei os destinos de navegação em `/conhecer`, `/conhecer/temas/:tema`, `/planos`, `/planos/:id`, `/resumos` e `/resumos/:livro`, incluindo os links de referência bíblica apresentados pelos estudos. Os destinos observados correspondem às rotas do Expo Router ou a rotas dinâmicas alimentadas pelo catálogo local. Não encontrei um link comprovadamente quebrado que justificasse alteração segura nesta rodada.

Não editei componentes de navegação ou conteúdo. `app/conhecer/index.tsx`, `app/conhecer/temas/[tema].tsx`, `app/planos/index.tsx`, `app/resumos/index.tsx` e `core/content/temasEvangelisticos.ts` já estavam modificados no worktree compartilhado e outras frentes paralelas estavam trabalhando em áreas relacionadas. Preservar esses arquivos evitou sobrepor mudanças concorrentes.

## Checkpoints executados

1. **Mapeamento das rotas:** confirmei que as rotas de índice/detalhe existem para estudos introdutórios, temas, planos e resumos.
2. **Links dinâmicos:** os cartões de estudos apontam para três rotas introdutórias existentes; cartões de tema constroem URL a partir de `TEMAS_EVANGELISTICOS`; cartões de plano usam o identificador do próprio plano; resumos usam o slug de cada livro.
3. **Referências bíblicas:** os estudos de tema usam `/leitura/:livro/:capitulo`, com `versiculo` opcional. A rota do leitor declara e consome esses parâmetros. `npm run check:temas` conferiu 8 temas publicados e 8 rascunhos, com 32 referências em cada conjunto, contra a ACF local.
4. **Retorno e fallback:** os estudos oferecem saída para o hub `/conhecer` e para `/leitura`; o tema desconhecido mostra uma página de fallback com caminhos alternativos. Planos e resumos mantêm suas rotas de índice como retorno/listagem.
5. **Verificações focadas:** passaram `npm run check:temas`, `npm run check:planos-editoriais` (5 planos; 3 fontes publicadas sincronizadas; intervalos conferidos contra a ACF) e `npm run check:a11y` (111 contratos críticos).

## Achados e limites

- Nenhum link estático quebrado foi comprovado por inspeção e pelos verificadores executados.
- As verificações de catálogo validam destinos e referências contra os dados locais; não validam interpretação editorial, contexto exegético, tradução/licença ou disponibilidade da implantação.
- A inspeção não percorreu cada rota em navegador nem exercitou atualizar, voltar/avançar, teclado e leitor de tela real. `npm run typecheck` passou após o trabalho paralelo estabilizar; ele valida tipos, não a navegação em runtime.
- A rota de detalhe de plano pode ser aberta diretamente por URL; um identificador inexistente depende do fallback implementado no detalhe, aspecto a manter coberto em QA de navegação.
- O cartão destacado de planos navega para `sabedoria-7`, ID que deve continuar presente no catálogo enquanto o destaque permanecer fixo.

## Próximos gates

1. Percorrer em navegador o hub, todos os temas, todos os planos e amostras de resumos, incluindo entrada direta, recarga e retorno.
2. Confirmar foco visível, ordem de teclado e anúncio dos títulos de navegação com leitor de tela real.
3. Incluir uma verificação estrutural que compare automaticamente os slugs de temas, IDs de plano e slugs de livros usados em links com as rotas/catálogos correspondentes, caso a suíte passe a detectar regressões não cobertas pelos verificadores editoriais atuais.
4. Conferir Preview Vercel para respostas HTTP e comportamento de URL direta; os checks locais não demonstram regras de hospedagem.

## Instrução de plataforma

Antes da auditoria, li `AGENTS.md` e a documentação oficial versionada [Expo SDK 57.0.0](https://docs.expo.dev/versions/v57.0.0/), conforme a exigência do repositório. Nenhum código Expo foi alterado nesta frente.
