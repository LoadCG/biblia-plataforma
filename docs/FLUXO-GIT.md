# Fluxo Git e validação

## Estado observado em 2026-10-02

- Branch de trabalho principal: `master`, sincronizada com `origin/master`.
- `origin/HEAD` aponta para `origin/master`.
- Existe uma branch remota histórica `codex/ui-usabilidade-16-18`.
- Não há proteção de branch ou política de pull request comprovada por este
  checkout; não assumir que esteja habilitada.
- O workflow de CI executa em `push` para `main` e `master`, além de pull request
  e execução manual. Run `37033595191`, commit `77163887d9fc9744c45e27ffaa2ce379a195b914`,
  passou em 1m36s em 2026-10-02; copy, validação, export e metadados passaram.
- O run anotou que `actions/checkout@v4` e `actions/setup-node@v4` ainda declaram
  Node 20; esse runtime foi removido dos runners GitHub-hosted em 2026-09-23 e o
  job foi forçado a Node 24. Atualizar para versões compatíveis após conferir
  [orientação oficial](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/).
- `ubuntu-latest` começa a migrar para Ubuntu 26 em 2026-10-19, com conclusão
  planejada em 2026-11-19 ([anúncio do runner](https://github.com/actions/runner-images/issues/14748)); conferir execução nessa transição.
- A configuração do projeto indica deploy Vercel ligado a `master`; validar
  preview/produção separadamente do resultado do CI.

## Fluxo de mudança

1. Conferir branch e árvore de trabalho com `git status --short --branch`.
2. Consultar `AGENTS.md`, o plano ativo e a documentação versionada da stack
   antes de tocar código sujeito a versão específica.
3. Manter cada incremento coeso; executar verificações relevantes ao escopo,
   `git diff --check` e revisar o diff completo.
4. Registrar comportamento/evidência em `FUNCIONALIDADES.md`, plano/matriz e
   `CHANGELOG.md` conforme o tipo e dimensão da mudança.
5. Criar commit com mensagem descritiva. O usuário autorizou envio direto a
   `master` após cada incremento concluído; isso não autoriza ignorar validação.
6. Fazer push para `origin master`, conferir o novo HEAD e árvore limpa e depois
   observar o CI remoto. Não afirmar “CI verde” antes de ler a execução.
7. Para uma mudança maior ou com risco de conflito, usar branch `codex/*` e
   revisão antes da integração; não inventar política de PR se ela não existir.

## Recuperação

- Inspecionar `git status`, `git log` e diffs antes de reset/rebase/force push.
- Não sobrescrever trabalho local de outra sessão sem identificar sua origem.
- Reverter por commit corretivo ou `git revert` quando o commit já foi enviado.
- Força de push e reescrita de histórico não fazem parte do fluxo normal.

## Comandos frequentes

```bash
git status --short --branch
npm run typecheck
npm run check:copy-ui
npm run check:ui
git diff --check
git diff --stat
git log -5 --oneline
```
