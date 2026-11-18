# Roteiro de publicação nativa (Google Play e App Store)

Criado em 2026-11-18. Guia para quem nunca publicou um app. Legenda:

- **[V]** verificado em arquivo do repositório ou em página oficial lida nesta data.
- **[I]** inferência ou conhecimento geral, a confirmar antes de agir.
- **[?]** não consegui verificar.

Regra do projeto (AGENTS.md): consultar a doc versionada do Expo SDK 57
(https://docs.expo.dev/versions/v57.0.0/) antes de mexer em configuração.

## 1. Onde o projeto está hoje

| Item | Estado | Fonte |
|---|---|---|
| Build assinado Android/iOS | Nunca feito | [V] ESTADO-DO-PROJETO.md ("sem build assinado") |
| `eas.json` | Perfis `development`, `preview` (APK, distribuição interna) e `production` (`autoIncrement`); `appVersionSource: local` | [V] eas.json |
| IDs | `com.cauangabriel.bibliaplataforma` (iOS e Android), versão 1.0.0, buildNumber/versionCode 1 | [V] app.json |
| Jornadas Maestro | 4 arquivos em `.maestro/` validados só estruturalmente (`npm run check:e2e`); nunca rodaram em aparelho | [V] |
| SQLite/FTS5 nativo | Implementado, sem validação em aparelho | [V] plano mestre |
| Login/conta, analytics, push | Não existem. Lembrete diário é local (`expo-notifications`) | [V] |
| Conteúdo | Só Almeida ACF | [V] |
| Direitos do texto ACF | Pendente: sem confirmação da SBTB | [V] docs/LICENCA-TEXTO-ACF.md (via plano mestre) |
| Revisão pastoral | Pendente para a landing; 3 planos publicados sem revisão humana independente | [V] |
| Rota `/privacidade` | Existe (`app/privacidade.tsx`), publicada na web | [V] |
| Ícone/splash | `icon.png`, `splash-icon.png`, 3 imagens adaptive, `favicon.png` existem | [V] listagem de `assets/` |
| Decisão de escopo | Nativo estava "deferido"; ESTADO de 2026-08-27 registra intenção real de publicar um dia | [V] |

Observações sobre o `app.json` [I]: `name` é `biblia-plataforma` (slug técnico). O nome exibido na loja/tela
inicial deveria ser um nome de produto escolhido pelo dono. `plugins` não inclui `expo-notifications`
nem `expo-image-picker` mesmo estando em dependências; verificar se o prebuild exige plugin
(ex.: ícone/cor de notificação Android, textos de permissão iOS). Rodar
`npx expo-doctor` e `npx expo config --type public` antes do primeiro build.

## 2. Bloqueios (resolver ANTES de enviar à loja)

1. **Direitos do texto ACF (bloqueio jurídico).** Hoje o projeto não afirma domínio público e não tem
   autorização registrada. Lojas pedem declaração de que você tem direito sobre o conteúdo; publicar
   texto sem direito pode levar a remoção e à suspensão da conta [I]. Ação: enviar a consulta à SBTB
   (minuta em docs/LICENCA-TEXTO-ACF.md), guardar a resposta por escrito. Alternativa [I]: trocar por
   texto comprovadamente de domínio público/licença aberta, o que exige novo conteúdo e novo SQLite.
2. **Revisão pastoral/editorial.** Planos e resumos publicados sem 2 revisões humanas independentes.
   Decidir: publicar na loja assim mesmo (decisão do dono, registrar) ou esperar a revisão.
   A landing evangelística pública também aguarda aprovação pastoral (não é conteúdo do app nativo,
   mas aparece no mesmo projeto).
3. **Decisão do dono sobre o escopo nativo.** Reabrir o "Ciclo 7" do plano mestre formalmente
   (data, responsável), pois hoje ele consta como deferido.
4. **Nome e identidade final**: nome do app, identificador (`com.cauangabriel...` é permanente na Play
   Store depois do primeiro envio [I]; escolher agora com cuidado), ícone final.

## 3. Contas e custos

| Conta | Custo | Prazo/requisitos | Verificação |
|---|---|---|---|
| Expo/EAS | Conta gratuita para começar; builds na nuvem têm cota gratuita e fila | Criar em expo.dev; `eas login` | [I] não confirmei limites do plano gratuito |
| Apple Developer Program | US$ 99 por ano; pode variar por região; isenção só para ONG/educação/governo elegíveis | Apple Account com 2FA, maior de idade, nome legal, endereço sem caixa postal. Conta de organização exige D-U-N-S, site do domínio e autoridade legal | [V] developer.apple.com/programs/enroll |
| Apple: prazo de aprovação da conta | Não informado pela Apple na página | | [?] |
| Google Play Console | Taxa única de registro (valor conhecido: US$ 25) | | [?] a página oficial lida não citou a taxa; confirmar ao criar a conta |
| Play: requisito de teste (contas pessoais novas) | Mínimo 12 testers em teste fechado, inscritos continuamente por 14 dias, antes de pedir acesso à produção | Aplica-se a contas pessoais novas; conta de organização pode ter regra diferente | [V] support.google.com/googleplay/android-developer/answer/14151465 (texto sobre contas pessoais novas inferido do contexto da regra, conferir ao abrir o Console) |
| Play: verificação de identidade/aparelho do desenvolvedor | Existe um artigo próprio ("Device verification requirements for new developer accounts") | | [?] não li o conteúdo |

Decisão prática [I]: o dono é pessoa física (sem CNPJ citado nos docs). Conta pessoal na Play implica
cumprir os 12 testers por 14 dias, o que precisa começar cedo (item 5.4). Na Apple, conta de pessoa física
exibe o nome legal do dono como vendedor.

Primeiro envio Android via EAS: a doc do Expo diz que `eas submit` num app novo cria a primeira versão na
faixa de teste interno; criar a primeira versão direto no Play Console é opção [V] docs.expo.dev/submit/introduction.
Conta de serviço Google (chave JSON) é necessária para o `eas submit` automatizado [I].

## 4. Etapas ordenadas

Comandos rodam na raiz do projeto. Substitua nada de segredo no repositório; credenciais ficam no EAS.

### Etapa 0 – Preparação (sem custo)
```
npm ci
npm run validate
npm install -g eas-cli      # exigido: cli >= 16.0.0 (eas.json)
eas login
eas init                    # vincula o projeto e grava o projectId no app.json
```
`eas init` edita o `app.json` (grava `extra.eas.projectId`); fazer num commit próprio.
Aceite: `validate` verde e `eas whoami` mostrando a conta.

### Etapa 1 – APK de preview (Android, sem Play Console)
```
eas build --platform android --profile preview
```
Perfil `preview` gera APK de distribuição interna [V]. O EAS cria e guarda o keystore na primeira
execução (aceitar a geração automática). Baixar o APK pelo link do build e instalar no aparelho.
Guardar uma cópia do keystore: `eas credentials` (perdê-lo impede atualizar o app na Play, salvo
recurso do Play App Signing [I]).
Aceite: build verde; app abre em aparelho real.

### Etapa 2 – Teste manual em aparelho
Instalar o APK e percorrer: onboarding, ler capítulo, marcar lido, buscar, plano guiado, favoritos/anotações,
backup (exportar/restaurar), áudio TTS, lembrete diário e permissão de notificação, modo escuro,
fonte grande. Anotar resultado em `docs/` (evidência real, não presumida). Testar também modo avião.

### Etapa 3 – SQLite nativo (FTS5)
No aparelho: abrir pela primeira vez (importação do banco), buscar termo (`amor`), referência direta
(`Joao 3:16`), filtros, paginação, matar o app e reabrir, atualizar versão com dados já gravados.
Medir tempo de primeira abertura. Aceite: resultados equivalentes aos da web, sem travar nem fechar.

### Etapa 4 – Maestro em aparelho/emulador
```
# instalar Maestro (https://docs.maestro.dev) e ter aparelho/emulador com o APK instalado
maestro test .maestro/01-onboarding.yaml
maestro test .maestro/
```
Pode precisar ajustar `appId` e textos dos arquivos YAML [I]. Aceite: 4 jornadas passam; registrar
a execução. Não precisa de conta de loja.

### Etapa 5 – Build de produção Android e teste fechado
```
eas build --platform android --profile production      # gera AAB (padrão de produção) [I]
eas submit --platform android --latest                 # envia ao Play Console
```
Antes: criar conta Play Console, criar o app, preencher a ficha (seção 6). Depois:
1. Faixa de teste interno (você e poucos e-mails) para validar a instalação via Play.
2. Teste fechado com 12+ pessoas por 14 dias seguidos (se conta pessoal nova) [V]. Recrutar
   cedo; é o maior prazo do caminho.
3. Pedir acesso à produção no Console; aguardar revisão (prazo variável) [?].
`autoIncrement: true` sobe o `versionCode` sozinho a cada build de produção [V eas.json]; com
`appVersionSource: local` o valor vem do app.json [V], conferir a doc de versionamento do EAS
antes do primeiro build de produção para não ter conflito.

### Etapa 6 – iOS (depois que Android estiver estável)
Requer Apple Developer Program ativo.
```
eas device:create                                      # só para build interno em iPhone
eas build --platform ios --profile preview             # distribuição interna (iPhone cadastrado)
eas build --platform ios --profile production
eas submit --platform ios --latest                     # envia ao App Store Connect/TestFlight
```
Passos: criar o app no App Store Connect com o bundle id acima, testar no TestFlight, preencher a ficha,
enviar para revisão. Não é preciso Mac para usar EAS Build/Submit [I]. Prazo de revisão da Apple: [?].
Risco de revisão iOS [I]: app muito parecido com site (guideline 4.2 de funcionalidade mínima).
Argumentos a favor: offline completo, SQLite, planos, notificações locais, backup.

### Etapa 7 – Produção e pós-publicação
Liberar em fases (percentual) na Play [I]. Monitorar avaliações e travamentos pelo Play Console/App Store
Connect (sem SDK de analytics, consistente com a ficha de privacidade). Cada atualização: nova versão
no `app.json`, `eas build` + `eas submit`.

## 5. Ficha de privacidade (coerente com o app)

Base [V]: sem conta, sem analytics, sem backend; dados (leituras, notas, favoritos, preferências)
ficam no aparelho; ID anônimo local; exportar/apagar tudo no app; nenhum envio de dados pessoais
(plano mestre, P3). Antes de preencher, **auditar o código** [I]: `grep` por `fetch(`, `http`, SDKs
de terceiros e permissões que o prebuild gera (`npx expo prebuild` em pasta descartável e ler o
AndroidManifest/Info.plist). A ficha só vale se refletir isso.

**Google Play – Data safety** (preenchimento esperado, a confirmar com a auditoria):
- Coleta de dados: **não coleta**. Compartilha com terceiros: **não**.
- Dados em trânsito: não há transmissão; criptografia em trânsito n/a.
- Exclusão: o usuário apaga tudo dentro do app (Configurações); não há conta a excluir. A Play exige
  declarar o caminho de exclusão de conta apenas se houver criação de conta [I].
- Faixa etária/conteúdo: questionário de classificação (conteúdo religioso, sem violência gratuita);
  o texto bíblico contém passagens violentas e sexuais, responder com honestidade ao questionário [I].
- Política de privacidade: URL pública obrigatória na ficha [I]. Usar a rota web
  `https://biblia-plataforma.vercel.app/privacidade` [V rota existe e responde 200], mas ver abaixo.

**Apple – App Privacy ("nutrition label")**:
- "Data Not Collected" (Dados não coletados), coerente com o item acima [I].
- URL de política de privacidade obrigatória [I]. Revisores costumam exigir tela de suporte/contato [I].
- Exportação de conformidade de criptografia: o app só usa HTTPS padrão/sem criptografia própria;
  em geral responde-se que usa só criptografia isenta; no Expo, definir
  `ios.config.usesNonExemptEncryption: false` no app.json [I, confirmar na doc do SDK 57].
- Textos de permissão iOS (`NSPhotoLibraryUsageDescription` etc.) só se algum recurso pedir; a
  presença de `expo-image-picker` e `expo-notifications` exige conferir quais permissões entram [I].

**Política de privacidade**: a rota `/privacidade` já existe [V]. Revisar o texto para ficar igual
à ficha: sem coleta, armazenamento local, como exportar/apagar, notificação local do lembrete, contato do
responsável (e-mail), data de vigência, e menção à hospedagem web (Vercel pode registrar logs de acesso
do site [I]; deixar claro que isso se aplica ao site, não ao app). Decisão pendente: qualquer analytics futuro
muda a ficha e a política.

## 6. Ativos exigidos

| Ativo | Exigência | Estado |
|---|---|---|
| Ícone do app 1024×1024 (iOS, sem transparência) | App Store | `assets/icon.png` existe [V]; conferir dimensões e transparência [?] |
| Ícone adaptive Android (foreground/background/monochrome) | Referenciados no app.json | Arquivos existem [V]; conferir zona segura |
| Ícone da Play Store 512×512 | Play Console | [I] precisa exportar |
| Feature graphic 1024×500 | Play Console | [I] não existe |
| Capturas de tela de celular (Play: mínimo 2; Apple: iPhone 6,9" ou o tamanho exigido no momento) | Ambas | [I] não existem; tamanhos mudam, conferir no Console/App Store Connect |
| Capturas de iPad | Se `supportsTablet: true` [V], a Apple exigirá capturas de iPad [I]; avaliar desligar `supportsTablet` para reduzir trabalho |
| Splash | `expo-splash-screen` + `splash-icon.png` | Existe [V]; testar fundo claro/escuro em aparelho |
| Descrição curta/longa, categoria (Livros e referência), e-mail de suporte, site | Ambas | [I] redigir |
| Notas para o revisor Apple (sem login, como testar) | Apple | [I] redigir |

## 7. Checklist final com critérios de aceite

Bloqueios
- [ ] Resposta escrita da SBTB arquivada (ou texto trocado), referenciada em docs/LICENCA-TEXTO-ACF.md.
- [ ] Decisão do dono registrada sobre conteúdo sem revisão humana independente.
- [ ] Ciclo 7 reaberto com responsável e data.

Técnico (cada item com evidência em `docs/`)
- [ ] `npm run validate` e CI verdes no commit enviado (CI pós-migração Ubuntu 26 confirmado).
- [ ] APK preview instala e abre; roteiro manual da Etapa 2 sem falha impeditiva.
- [ ] SQLite/FTS5 validado em aparelho (Etapa 3), incl. atualização sobre dados existentes.
- [ ] 4 jornadas Maestro passam em aparelho/emulador.
- [ ] Permissões do manifesto/Info.plist revisadas: só as necessárias.
- [ ] Versão e código de build coerentes (`app.json` x EAS).
- [ ] Keystore Android e credenciais iOS com backup seguro, fora do repositório.

Loja
- [ ] Ficha Data safety e App Privacy preenchidas como "sem coleta" e iguais à política.
- [ ] Política de privacidade revisada e acessível por URL pública.
- [ ] Ícones, capturas, textos, classificação etária, e-mail de suporte prontos.
- [ ] Play: 12 testers por 14 dias cumpridos (se aplicável) e produção solicitada.
- [ ] Apple: TestFlight testado e envio para revisão feito.

Aceite geral: build de produção instalado a partir da loja (não de APK) em aparelho real, com leitura offline,
busca, marcação de leitura e exportação funcionando.

## 8. Riscos

| Risco | Prob./impacto [I] | Mitigação |
|---|---|---|
| Direito do texto ACF negado ou sem resposta | Média / bloqueia | Alternativa de texto livre; não publicar sem resposta |
| Rejeição na Play ou na Apple por conteúdo/propriedade intelectual | Média / atraso | Ter a resposta da SBTB à mão; notas ao revisor |
| 12 testers por 14 dias demora (conta pessoal) | Alta / semanas | Começar o recrutamento junto com a Etapa 5; ou conta de organização |
| SQLite nativo falha em aparelhos reais (migração, tamanho do banco, FTS5) | Média / alto | Etapa 3 obrigatória antes da produção |
| Maestro exige ajustes (nunca rodou) | Alta / baixo | Etapa 4 antes do build de produção |
| Perda do keystore / identificador errado | Baixa / alto | Backup de credenciais; fixar o package antes do primeiro envio |
| Patches do Expo derrubam o CI de novo (histórico de 4 semanas vermelho) | Média / baixo | `npx expo install --fix`; run semanal agendado |
| Apple 4.2 (app "só um site") | Baixa-média | Destacar recursos nativos nas notas |
| Dívida: sem analytics/crash reporting, falhas só aparecem em avaliações | Média | Usar relatórios nativos das lojas; ponderar com a política de privacidade antes de qualquer SDK |
| Custo recorrente Apple (US$ 99/ano) e esforço de manutenção das duas lojas | Certa | Decidir se começar só por Android |
| Vulnerabilidades transitivas de dependências (12 em produção, ferramentas de build) | Baixa | Acompanhar sem `audit fix --force` |

## 9. Ordem recomendada (resumo)

1. Enviar a consulta à SBTB (não depende de nada técnico e é o maior bloqueio).
2. Etapas 0 a 4 (grátis, sem conta de loja).
3. Criar conta Play, iniciar teste fechado, preencher fichas.
4. Produção Android. Só então considerar Apple.

Fontes lidas em 2026-11-18: docs.expo.dev/submit/introduction, developer.apple.com/programs/enroll,
support.google.com/googleplay/android-developer/answer/14151465. Não li as páginas de EAS Build, versionamento
nem a doc v57 de configuração por limite de tempo; confirmá-las antes de executar.
