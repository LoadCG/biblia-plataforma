# Inventário de estados de interface

Data: 2026-10-16
Escopo inicial: superfícies com operações assíncronas e componentes compartilhados.

Este inventário veio da leitura estática do código. Não representa inspeção visual nem teste em leitor de tela.

Em 2026-10-02, o retry compartilhado de `EstadoErro` recebeu altura mínima de
44 px (`min-h-11`) e alinhamento vertical centralizado, igualando o alvo de
toque ao padrão já usado por `EstadoVazio`. Mudança estrutural; ainda requer
inspeção visual em browser e dispositivo para aceite completo.

## Implementação iniciada

Os estados compartilhados foram adicionados em `components/EstadoCarregando.tsx`
e `components/EstadoErro.tsx` e aplicados em Busca, Salvo, Planos, Estatísticas,
seletor bíblico, cartões temáticos e popover. O retry de Busca repete os mesmos
parâmetros e leituras de referência descartam respostas depois da desmontagem
ou troca de referência. Esta migração ainda precisa de inspeção visual e
validação em tela real.

O rótulo de `EstadoCarregando` também é exibido junto ao spinner, mantendo o
nome no anúncio do progressbar e ocultando o texto repetido da árvore acessível.
Tokens de severidade foram aplicados às ações de escrita de Salvo, Leitor,
Configurações, `CardAtividade` e Versículo do Dia. Em 2026-10-01 as chamadas
restantes em Home, Busca, Resumos, Planos, seleção bíblica, perfil, medalhas,
onboarding, tema e dicas contextuais também passaram a declarar severidade.
Verificar futuramente as chamadas novas antes de considerar este inventário
exaustivo; revisão visual e assistiva ainda está pendente.

| Superfície | Carregando | Erro | Vazio | Ação/feedback | Observação |
|---|---|---|---|---|---|
| Início | `EstadoCarregando` para a coluna de apoio | `EstadoErro` inline com retry para falha de leituras/progresso | CTA “Escolha um livro para começar” somente após confirmar histórico vazio | abre `/biblia/escolher`; falha do lembrete opcional usa Toast de aviso | Dados antigos são limpos ao recarregar/trocar owner; não apresenta zero enquanto a leitura do repositório está pendente ou falha. Layout responsivo existente foi preservado. |
| Sequência diária | Exibida após confirmar progresso local | Herda erro/retry de Início e Perfil; Estatísticas mantém seu erro próprio | Zero dias com instrução objetiva e semana vazia | histórico semanal acessível; recorde e estado de hoje são informativos | Uma leitura por dia no calendário local; capítulos repetidos no mesmo dia são deduplicados. Início, Perfil e Estatísticas usam a mesma regra; as duas primeiras atualizam na virada do dia. Persistência deriva dos capítulos marcados, sem tabela independente. Falha de armazenamento e runtime nativo ainda não foram induzidos/testados. |
| Descubra / Busca | `EstadoCarregando` | `EstadoErro` com retry | `EstadoVazio` | Limpar busca ou trocar para Bíblia; Toast para ações | Erro e vazio são distintos; retry repete a mesma consulta; “Voltar aos temas” mantém alvo mínimo de 44 px. |
| Leitor bíblico | skeleton `progressbar` | painel com retry | parcial conforme conteúdo | Toast | Dados pessoais são carregados em conjunto por capítulo; respostas antigas são descartadas. |
| Seletor de versículos | `EstadoCarregando` | `EstadoErro` com retry | não aplicável | — | Respostas após desmontagem ou troca de referência são ignoradas. |
| Estatísticas | `EstadoCarregando` | `EstadoErro` com retry | não aplicável com cálculo zerado | — | Falhas não deixam spinner indefinido. |
| Planos (lista) | `EstadoCarregando` | `EstadoErro` com retry sem ocultar o catálogo | catálogo estático continua disponível | progresso conhecido por plano; falha parcial indica “Progresso indisponível” sem barra enganosa | Cada plano agora carrega progresso isoladamente; falha não bloqueia a navegação para o catálogo nem é apresentada como 0%. |
| Salvo | `EstadoCarregando` | `EstadoErro` com retry | `EstadoVazio` | Toast com undo em lote | Loading, erro e vazio distinguíveis. |
| Resumos | filtro síncrono | não aplicável na listagem | `EstadoVazio` | limpar busca quando há termo | Estado vazio acessível e orientativo; ação opcional no componente compartilhado. |
| Detalhe de resumo | `EstadoCarregando` para confirmar o progresso do livro | `EstadoErro` com retry; falha ao salvar mantém o valor confirmado e mostra Toast | não aplicável | marcar/desmarcar somente após leitura confirmada; ação bloqueada durante salvamento | O carregamento evita apresentar “não lido” provisório; gravação duplicada é bloqueada. |
| Seletor de livros | catálogo local | não aplicável | `EstadoVazio` | limpar busca quando há termo | A tela preserva o estado original sem ação quando o catálogo estiver vazio sem filtro. |
| Cards de versículo / popover | `EstadoCarregando` | `EstadoErro` com retry | não aplicável | ações específicas | O card do dia mantém painel próprio de erro em gradiente. |
| Dica contextual | dica só aparece após leitura da preferência | `EstadoErro` com retry; falha ao marcar como vista mantém a dica e avisa via Toast | dica não exibida após confirmação de que já foi vista | “Entendi” bloqueia novas ativações durante gravação | A dica permanece opcional; falha de armazenamento não interrompe a tela hospedeira. |
| Detalhe de plano | `EstadoCarregando` | `EstadoErro` com retry | estado concluído quando todos os dias finalizam | Toast nas ações | Progresso anuncia papel e valor; falhas não aparecem como conclusão ou zero; retorno, marcação, referências e ações por dia têm alvo mínimo de 44 px. |
| Medalhas e detalhe | `EstadoCarregando` ao entrar/retomar a rota | `EstadoErro` inline com retry | não aplicável: progresso vazio válido é dado disponível, não erro | navegação ao detalhe e a resumos pendentes | Atualiza no foco; resposta tardia descartada; barra anuncia valor. Inspeção visual das rotas e falha induzida seguem pendentes. |
| Toast global | — | — | — | alerta com ação opcional e severidade semântica | Varredura AST em 2026-10-02 encontrou 73 chamadas a `mostrarToast`, todas com severidade explícita e sem opção dinâmica. O contrato exige severidade; a animação evita corrida entre mensagens, limpa o temporizador no unmount e respeita movimento reduzido. Sucesso ao salvar o Versículo do Dia foi visto em tema escuro. A posição agora respeita o breakpoint comum da navegação e foi conferida na Home desktop clara/escura; Toast de sucesso ficou abaixo dos cartões. Faltam demais severidades/rotas, ação isolada, expiração e movimento reduzido observados. |

**Revisão estática em 2026-10-15:** o botão de ação do Toast global (“Desfazer” e
“Abrir configurações”) tinha altura compacta, abaixo do alvo mínimo de 44 px
usado nas demais ações principais. A classe responsiva agora define altura e
largura mínimas de 44 px; o contrato de acessibilidade protege esse tamanho.
QA visual continuado na Home desktop revelou que 90 px de recuo cobriam o cartão
seguinte, pois aquele valor reservava espaço para uma barra inferior ausente no
desktop. O Toast passou a usar o breakpoint compartilhado com a navegação: 24 px
no desktop e 90 px no celular. A posição foi vista no tema claro e o sucesso
permaneceu legível no escuro. Leitor de tela, movimento reduzido observado e
outras severidades seguem pendentes.

Na inspeção local de 2026-10-04, a Home mostrou estados de carregamento e dados
vazios confirmados, em vez de zeros provisórios; falha de armazenamento não foi
induzida. Toasts de sucesso apareceram ao salvar/remover o Versículo do Dia. A
remoção foi capturada em tema escuro com contraste legível, depois o estado
salvo foi revertido e a preferência restaurada ao claro.

O detalhe de Plano agora diferencia carga do progresso, erro com retry e dados;
falhas ao iniciar uma sessão ou alterar conclusão dão feedback via Toast. O
leitor agrupa a leitura de grifos/notas/salvos/progresso por capítulo, limpa
valores da rota anterior, ignora respostas tardias e avisa quando o repositório
local falha. Gravar/remover grifos, progresso, notas e avançar uma sessão guiada
também informa falhas; a nota permanece aberta quando a gravação não conclui.

**Revisão estática em 2026-10-15 — detalhe de Resumos:** o progresso “livro lido”
agora tem estados explícitos de carregamento, erro com retry e valor confirmado.
A ação fica indisponível antes da confirmação e enquanto grava, evita chamadas
duplicadas e informa falha sem alterar o valor local. Contratos estruturais e
TypeScript passaram; inspeção visual, erro induzido e leitor de tela real seguem
pendentes.

**Revisão estática em 2026-10-15 — dica contextual:** falha na leitura da
preferência agora oferece retry inline, sem bloquear a tela hospedeira. A ação
“Entendi” bloqueia ativações duplicadas e preserva a dica se a gravação falhar.
Contratos, TypeScript e copy passaram; falha induzida, aparência nos dois temas
e leitura assistiva seguem pendentes.

Salvo e `CardAtividade` também comunicam falhas em criação/renomeação/exclusão de
coleção, associação, exclusão/restauração de item e edição de nota. A seleção e
o modal são preservados quando a escrita falha. Como exclusões em lote não têm
transação entre repositórios, falha parcial dispara recarga da lista e aviso para
conferência; não é exibido um undo quando a exclusão inicial não termina.

Início, Configurações, perfil, onboarding, busca, seleção bíblica, medalhas e
Versículo do Dia agora também tratam rejeições nas leituras e ações locais.
Preferências de fonte e estado do lembrete retornam o
resultado real da persistência; o lembrete só aparece ativo depois que a permissão,
o agendamento e a gravação forem concluídos. Exportação, exclusão de dados, foto,
nota e edição do perfil exibem falha e preservam o diálogo quando possível.
Inspeção web parcial em 2026-10-01 está registrada em
`docs/matriz-auditoria-responsiva.md` (Início, Descubra e Planos a 1280×900;
Planos também em tema escuro). O feedback Toast por severidade, demais estados,
breakpoints estreitos e leitores de tela ainda precisam de revisão própria.

## Prioridade sugerida

1. Criar estados compartilhados com API mínima e sem substituir conteúdo existente:
   `EstadoCarregando` e `EstadoErro` com retry opcional.
2. Corrigir primeiro estados assíncronos críticos já conhecidos: Estatísticas,
   Salvo e progresso da lista de Planos (loading e erro explícitos).
3. Migrar Busca e seletor de versículos, mantendo cópia e fluxo atuais. **Concluído no recorte atual.**
4. Migrar loading e erro dos cartões/popover de referência bíblica. **Concluído;**
   o painel de erro em gradiente do card do dia foi preservado.
5. Consolidar os estados restantes do leitor e inspecionar semântica/dimensões
   quando UI visual web/nativa estiver disponível.

## Critério de saída

- Loading, erro, vazio e dados têm estados distinguíveis.
- Operação recuperável permite tentar novamente ou oferece instrução objetiva.
- Mensagens continuam acessíveis e o visual responde ao tema.
- Cada migração tem contrato estrutural e verificação TypeScript.
- Inspeção visual/a11y permanece pendente até execução em navegador/dispositivo.
