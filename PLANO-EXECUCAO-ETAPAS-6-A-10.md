# Plano de execução — etapas 6 a 10

Atualizado em 2026-09-10. Este documento registra o escopo executado, os
critérios de aceite e os gates que dependem de infraestrutura externa. Um item
só recebe `[x]` quando existe evidência local ou automatizada correspondente.

**Status em 2026-10-02: ciclo histórico com gates externos parcialmente abertos.**
Não confundir estrutura local de CI, cenários Maestro ou build configurável com
run remoto, execução em dispositivo ou distribuição. Os gates remanescentes
estão reindexados nos ciclos 6–7 de
[`docs/PLANO-MESTRE-Q4-2026.md`](./docs/PLANO-MESTRE-Q4-2026.md).

## Etapa 6 — Integração contínua e quality gates `✅`

**Objetivo:** tornar toda alteração verificável por um pipeline reproduzível,
eliminando a dependência de validações manuais antes do merge.

- [x] Criar workflow para `push` em `main`, pull requests e execução manual.
- [x] Fixar Node.js 22 e instalação determinística com `npm ci`.
- [x] Validar conteúdo derivado e impedir drift de `livros.json`.
- [x] Executar TypeScript, Jest, contratos de acessibilidade e Maestro.
- [x] Executar Expo Doctor no mesmo quality gate.
- [x] Gerar o bundle web estático e validar rotas/metadados.
- [x] Preservar o bundle como artefato de diagnóstico quando o job falhar.
- [ ] Confirmar o primeiro run verde no GitHub Actions após `push`/PR.

**Evidência:** `.github/workflows/ci.yml`, scripts `check:*` em `package.json` e
execução local de `npm run validate`, `npm run export:web` e
`npm run check:static`.

## Etapa 7 — SEO estático com navegação híbrida `✅`

**Objetivo:** entregar HTML indexável para superfícies editoriais sem inflar o
bundle com a pré-renderização dos 1.189 capítulos interativos.

- [x] Configurar `web.output` como `static` no Expo Router.
- [x] Gerar parâmetros estáticos para os 66 resumos bíblicos.
- [x] Gerar parâmetros estáticos para os dois planos guiados.
- [x] Definir `title` e `description` globais e específicos por rota.
- [x] Adicionar Open Graph básico e metadados de tema/locale.
- [x] Manter `/biblia/*` como rota interativa com fallback restrito no Vercel.
- [x] Automatizar a verificação de arquivos HTML e metadados críticos.
- [x] Validar clean URLs, conteúdo pré-renderizado e deep link do leitor.
- [x] Corrigir mismatch de hidratação no layout responsivo das abas.
- [x] Corrigir interceptação de deep links pelo onboarding no primeiro acesso.
- [ ] Validar a mesma matriz em um Preview Deployment do Vercel antes de
  promover para produção.

**Evidência:** export com 94 rotas, resumos de Gênesis/Apocalipse e plano
Semana da Sabedoria pré-renderizados; `/biblia/01-genesis/1` carregado via
fallback híbrido sem erros de console.

## Etapa 8 — Jornadas E2E determinísticas com Maestro `🔶`

**Objetivo:** cobrir os fluxos de maior risco funcional em Android/iOS com
cenários legíveis e estáveis.

- [x] Substituir o fluxo legado por uma suíte modular.
- [x] Cobrir onboarding e chegada à tela inicial.
- [x] Cobrir seleção de versículo e persistência em Salvo.
- [x] Cobrir busca global por “sabedoria”.
- [x] Cobrir abertura e início de um plano guiado.
- [x] Adicionar `testID` estável para capítulos e versículos.
- [x] Criar gate estático que valida estrutura, `appId` e asserts dos fluxos.
- [ ] Executar a suíte Maestro contra binário nativo instalado em emulador e
  dispositivo físico.

**Critério pendente:** os contratos estão implementados, mas a etapa permanece
parcial até haver uma execução real contra Android/iOS.

## Etapa 9 — Hardening de acessibilidade `🔶`

**Objetivo:** garantir semântica operacional nas jornadas críticas e instituir
uma proteção automatizada contra regressões básicas.

- [x] Marcar títulos de tela/seção como cabeçalhos semânticos.
- [x] Rotular campos de busca e edição com nome e instrução acessíveis.
- [x] Expor progresso do onboarding como `progressbar`.
- [x] Expor estado selecionado em filtros do tipo radio.
- [x] Anunciar contagens de resultado por live region `polite`.
- [x] Rotular ações de seleção no leitor e ações destrutivas de coleções.
- [x] Criar gate automatizado para os contratos críticos de acessibilidade.
- [x] Inspecionar a árvore de acessibilidade de Resumos, Busca e Leitor no web.
- [ ] Validar foco, ordem de leitura e anúncios com NVDA/VoiceOver/TalkBack em
  ambiente físico.

**Critério pendente:** validação assistiva real continua sendo um gate humano,
não substituível por inspeção de DOM/árvore de acessibilidade.

## Etapa 10 — Prontidão de build nativo e distribuição `🔶`

**Objetivo:** remover bloqueios de configuração para gerar artefatos nativos
reproduzíveis, sem publicar ou criar credenciais sem autorização explícita.

- [x] Definir `scheme`, `bundleIdentifier`, `package`, `buildNumber` e
  `versionCode`.
- [x] Criar perfis EAS `development`, `preview` e `production`.
- [x] Configurar APK interno para validação Android.
- [x] Validar a configuração pública resolvida do Expo SDK 57.
- [x] Exportar localmente os bundles Android e iOS com sucesso.
- [ ] Vincular o projeto a uma conta EAS e provisionar credenciais de assinatura.
- [ ] Gerar builds EAS assinados de preview para Android e iOS.
- [ ] Executar smoke test, performance e acessibilidade nos binários assinados.
- [ ] Preparar metadados e submissão às lojas quando a publicação for retomada.

**Critério pendente:** build assinado e publicação alteram estado externo e
dependem de conta, certificados e decisão explícita do responsável pelo produto.

## Comandos de verificação

```bash
npm ci
npm run check:content
npm run validate
npm run export:web
npm run check:static
npx expo export --platform android
npx expo export --platform ios
```

## Definição de pronto do ciclo

- [x] Implementações locais das cinco etapas concluídas.
- [x] Quality gates reproduzíveis documentados e integrados ao CI.
- [x] Riscos e regressões encontrados durante a execução registrados.
- [ ] Gates remotos/físicos executados com evidências anexadas.

