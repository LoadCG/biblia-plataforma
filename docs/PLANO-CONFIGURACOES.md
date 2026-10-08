# Melhorias de configurações e preferências locais

Plano focal para tornar preferências e gestão de dados claras, seguras e
consistentes entre as telas web responsivas e o app instalado. Não introduz
conta/sincronização, tradução adicional, importação de dados nem personalizações
sem uma necessidade validada. Este plano cobre a tela `/configuracoes` e os
serviços de preferências que ela controla. A busca bíblica fica fora do escopo.

## Progresso

| Etapa | Estado | Entrega |
|---|---|---|
| 0. Inventário e contrato | Concluída; matriz revisada abaixo | Preferências locais, dados de backup, estado real das notificações e diferenças web/nativo mapeados. Velocidade do áudio é portátil no backup; voz e integrações do SO continuam locais ao dispositivo. `TODO.md` continua a fonte da decisão de produto: lembrete local; push/web precisa de backend e fica fora deste plano. |
| 1. Orientação e disponibilidade | Implementada; QA visual parcial | Escopo local, prévia de fonte, tema, lembrete indisponível na web e leitura em voz alta estão descritos. Falta revisar a hierarquia completa e os estados de carregamento/erro em tamanhos e temas diferentes. |
| 2. Gestão e preservação de dados | Implementada; verificação runtime pendente | Exportação enumera os dados efetivamente incluídos; exclusão explica o alcance, cancela o lembrete deste app e restaura estados locais e tema padrão na interface. Falha ao cancelar o aviso do sistema recebe resultado específico. |
| 3. Isolamento do lembrete | Implementada; teste em dispositivo pendente | Cancelamento busca apenas notificações marcadas como lembrete bíblico e reconhece as antigas pelo título/corpo; outras notificações permanecem agendadas. A tela revalida permissão e agendamento ao voltar ao app e corrige preferências desatualizadas. |
| 4. Inicialização e sincronização | Implementada e validada na web | Tema é restaurado sob a splash nativa com limite de espera e fallback de erro; controles de tema ficam desabilitados até concluir, inclusive no primeiro carregamento web. Uma interação do usuário não é sobrescrita por leitura atrasada. Configurações, Bíblia e Resumos carregam preferências de fonte independentemente; backup sincroniza cada resultado sem acoplar as chaves. |
| 5. QA visual/assistivo/responsivo | Parcial; validação web básica concluída | Inspeção em 1280×720 e 375×812, com rolagem e sem overflow horizontal; tema e controles exercitados por mouse, Enter e Espaço. Velocidade anuncia seleção como radio e aceita setas. Ainda faltam leitor de tela e validação funcional nativa. |
| 6. Backup e expansões condicionais | Restauração web validada em perfil descartável | Backup sintético restaurou tema escuro, fonte 19 px/serifada e velocidade 1,1×; valores persistiram após recarga. Voz permaneceu padrão local ao dispositivo, conforme contrato. Falhas induzidas e equivalência da reexportação continuam pendentes. Horário configurável e ajustes de grifo dependem de evidência de necessidade. |

## Matriz de preferências e fontes de verdade

| Opção | Persistência/escopo | Inicialização e sincronização | Falha e diferenças de plataforma |
|---|---|---|---|
| Tema | AsyncStorage, chave `tema-preferido`; local ao dispositivo | `app/_layout.tsx` restaura antes de ocultar a splash nativa; na web, o controle fica bloqueado até a leitura. NativeWind distribui o estado às telas | Falha ao restaurar é avisada após a interface montar e usa fallback; timeout libera o app nativo. Alternância aplica imediatamente e salva em segundo plano, portanto falha de escrita deixa a sessão no tema escolhido, mas não garante a próxima abertura. |
| Tamanho e família da fonte | AsyncStorage, chaves `tamanho-fonte-leitura` e `fonte-serifada-leitura`; compartilhadas por Bíblia e resumos | Configurações lê as duas em paralelo, agora com resultados independentes e controles bloqueados até a leitura; leitor e resumos também carregam localmente | Valores malformados usam padrão; índice inválido não é mais gravado. A família usa Georgia no web/iOS e `serif` genérica no Android, então aparência pode variar. Leituras em telas consumidoras ainda precisam ter tratamento visual validado para erro/atraso. |
| Lembrete diário | AsyncStorage mais permissão e agendamento do sistema; local, 07:00, Android/iOS | Ao abrir/retornar ao app, preferência, permissão e notificação agendada são reconciliadas | Web informa indisponibilidade. Revogação ou falha de agendamento pode divergir do valor salvo; a tela tenta reparar ao ganhar foco. Horários e fluxos de permissão variam por SO. |
| Voz e velocidade | AsyncStorage por dispositivo; `voz-leitura-dispositivo` e `velocidade-leitura-dispositivo`; velocidade também é incluída em backup | Componente de áudio enumera vozes e resolve identificador contra as vozes atuais; prévia usa o player compartilhado | Vozes pt-BR e API dependem do browser/engine/idiomas instalados. Voz antiga cai para padrão; falha de leitura pode exibir defaults. Identificador não é portável; velocidade é validada pela lista suportada e restaurada entre dispositivos. |
| Dados não portáveis no backup | Dados locais e arquivo JSON | Lista permitida controla o que pode ser restaurado | Permissão/agendamento do SO não podem ser importados. Onboarding e estado do lembrete não devem fazer a restauração simular consentimento ou permissão. Voz depende do dispositivo; velocidade é validada e portátil. |

### Regras de interação e erro

- Cada controle deve refletir a preferência persistida ou o estado efetivo do SO;
  diferenciar explicitamente carregando, indisponível, salvo e falha quando o
  usuário puder agir com segurança diferente em cada estado.
- Uma falha ao ler uma preferência não deve bloquear as demais. Valores
  ausentes/malformados podem usar o padrão definido; erro de armazenamento deve
  continuar distinguível de ausência de valor.
- Salvar uma preferência só atualiza a interface depois da gravação quando a
  operação é crítica para consistência. Para atualização otimista, erro deve
  informar se a sessão continua usando a escolha sem persistência.
- Ações do SO (permissão, notificação e fala) precisam ser reconciliadas após
  retorno do sistema e canceladas apenas quando pertencem ao recurso do app.
- Backup deve apresentar escopo, preferências portáteis e itens que dependem do
  dispositivo; restaurar dados e sincronizar controles visíveis faz parte do
  mesmo fluxo de conclusão.

## Contrato observado

- Fonte e tema são preferências locais; tamanho/família tipográfica aplicam-se à
  leitura bíblica e aos resumos.
- O lembrete é local, nativo e fixo às 07:00. A web não o agenda. O estado
  depende da permissão do sistema operacional.
- Exportação JSON contém perfil, grifos, capítulos lidos, notas, livros lidos,
  pesquisas favoritas, versículos salvos, progresso/sessões de planos,
  preferências locais, coleções e associações.
- Exclusão remove os dados vinculados ao perfil local e preferências globais
  deste dispositivo; é irreversível e não apaga cache técnico regenerável.

## Plano revisado de execução

1. **Contrato de preferências (concluído):** velocidade é portátil no backup;
   voz, permissões e agendamentos permanecem ligados ao dispositivo.
2. **Inicialização e sincronização (implementadas e exercitadas na web):** splash nativa tem limite
   de espera/fallback; controles de tema não podem competir com a hidratação;
   restauração de fonte é independente e a conclusão do backup atualiza cada
   preferência disponível. Fazer validação funcional para confirmar o fluxo.
3. **Cobrir comportamento com testes:** validar tema ausente/válido/malformado e
   falha; fonte válida e inválida; gravação rejeitada sem alterar o controle;
   carregamento independente; e sincronização após backup. Usar mocks para
   permissão e agendamento e cobrir web como recurso indisponível. Não testar a
   lógica da busca bíblica neste plano.
4. **Validar assistividade e layouts (parcial):** revisão visual e interativa
   realizada em 1280×720 e 375×812; conferir também viewport intermediário,
   leitor de tela, foco com teclado e anúncio de falhas. Botões de tema, fonte,
   switches e opções de velocidade foram exercitados com Enter/Espaço; velocidade
   também aceita as setas do grupo de rádio.
5. **Validar ambientes reais:** em Android/iOS, conceder/negar/revogar permissão,
   retornar de Configurações do sistema, reiniciar o app e conferir o estado
   efetivo do lembrete. Testar vozes disponíveis/indisponíveis e troca de app.
   Em web, testar vozes tardias e `voiceschanged` em browsers suportados.
6. **Exercitar dados em perfil descartável (restauração parcial):** backup
   sintético restaurado e recarregado com preferências portáveis verificadas.
   O botão de exportação mostrou confirmação, mas o navegador desta sessão não
   disponibilizou o arquivo para leitura e comparação. Reexportar e comparar
   categorias; induzir falha em cada fase; apagar e verificar dados/lembrete sem
   cancelar notificações alheias permanecem pendentes.
7. Atualizar cada etapa apenas com evidência reproduzível e registrar plataforma,
   viewport, tema, build e resultado. Não declarar QA nativo a partir de checks
   estáticos.

**QA web inicial (2026-10-05):** no navegador local, a árvore acessível expôs
os cabeçalhos, nomes dos switches, ações de exportar/apagar e a explicação da
indisponibilidade do lembrete web. A tela foi inspecionada em 1280×720 no tema
claro; uma falha visual de alinhamento das descrições dentro dos cards foi
corrigida. Não foram acionadas operações de exportação/exclusão nem controles
que persistem preferências. A rolagem até o final confirmou que as seções Meus
dados e Sobre cabem e que as descrições extensas quebram linha sem cortar ações.
Naquele momento, viewports estreitos, tema escuro, percurso completo por teclado/
leitor de tela e execução nativa continuavam sem evidência.

**Verificações de código (2026-10-07):** validação estrita das preferências de
fonte e velocidade, hidratação do tema, carregamento independente em
Configurações/Bíblia/Resumos e portabilidade da velocidade foram implementados.
Controles de tema e fonte ativam com Espaço; velocidade expõe estado selecionado
e responde a Espaço/setas no navegador. Em backup sintético num perfil temporário,
tema escuro, fonte 19 px serifada e velocidade 1,1× permaneceram após recarga; a
voz permaneceu local ao dispositivo. Foram inspecionadas larguras de 1280×720 e
375×812, sem rolagem horizontal na estreita. Execução final: 24 suítes, 170
testes, `typecheck`, `check:a11y` (72 contratos), `check:ui` (12 superfícies),
`git diff --check` e `expo export --platform web` passaram.
Esses checks não substituem teste de fluxo real, leitor de tela ou validação em
Android/iOS.

## Riscos e limites

- A exclusão e o lembrete usam repositórios/armazenamento locais; não existe
  mecanismo de recuperação/sincronização após apagar.
- A escolha de horário não faz parte desta entrega; 07:00 deve ser descrito como
  fixo, sem sugerir uma configuração que não existe.
- Restauração de backup foi implementada; seguir as pendências de falha,
  equivalência e inspeção em `PLANO-RESTAURACAO-DADOS.md` antes de declarar o
  aceite completo.
- A revisão do app nativo dedicado continua fora da prioridade atual; QA nativo
  aqui limita-se a validar a função de notificação já existente quando o
  ambiente estiver disponível.
