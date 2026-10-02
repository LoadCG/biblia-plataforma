# Inventário de estados de interface

Data: 2026-09-28  
Escopo inicial: superfícies com operações assíncronas e componentes compartilhados.

Este inventário veio da leitura estática do código. Não representa inspeção visual nem teste em leitor de tela.

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
Configurações, `CardAtividade` e Versículo do Dia; o restante das chamadas Toast
continua em migração gradual.

| Superfície | Carregando | Erro | Vazio | Ação/feedback | Observação |
|---|---|---|---|---|---|
| Descubra / Busca | `EstadoCarregando` | `EstadoErro` com retry | `EstadoVazio` | Limpar busca ou trocar para Bíblia; Toast para ações | Erro e vazio são distintos; retry repete a mesma consulta. |
| Leitor bíblico | skeleton `progressbar` | painel com retry | parcial conforme conteúdo | Toast | Dados pessoais são carregados em conjunto por capítulo; respostas antigas são descartadas. |
| Seletor de versículos | `EstadoCarregando` | `EstadoErro` com retry | não aplicável | — | Respostas após desmontagem ou troca de referência são ignoradas. |
| Estatísticas | `EstadoCarregando` | `EstadoErro` com retry | não aplicável com cálculo zerado | — | Falhas não deixam spinner indefinido. |
| Planos (lista) | `EstadoCarregando` | `EstadoErro` com retry | não aplicável (catálogo estático) | progresso | Não apresenta progresso zero antes de carregar. |
| Salvo | `EstadoCarregando` | `EstadoErro` com retry | `EstadoVazio` | Toast com undo em lote | Loading, erro e vazio distinguíveis. |
| Resumos | filtro síncrono | não aplicável na listagem | `EstadoVazio` | limpar busca quando há termo | Estado vazio acessível e orientativo; ação opcional no componente compartilhado. |
| Seletor de livros | catálogo local | não aplicável | `EstadoVazio` | limpar busca quando há termo | A tela preserva o estado original sem ação quando o catálogo estiver vazio sem filtro. |
| Cards de versículo / popover | `EstadoCarregando` | `EstadoErro` com retry | não aplicável | ações específicas | O card do dia mantém painel próprio de erro em gradiente. |
| Detalhe de plano | `EstadoCarregando` | `EstadoErro` com retry | estado concluído quando todos os dias finalizam | Toast nas ações | Falhas de progresso não aparecem como conclusão ou progresso zero. |
| Toast global | — | — | — | alerta com ação opcional e severidade semântica | `neutra` continua padrão; Salvo, Leitor, Configurações, `CardAtividade` e Versículo do Dia declaram severidade. Demais chamadas e inspeção visual ainda pendentes. |

O detalhe de Plano agora diferencia carga do progresso, erro com retry e dados;
falhas ao iniciar uma sessão ou alterar conclusão dão feedback via Toast. O
leitor agrupa a leitura de grifos/notas/salvos/progresso por capítulo, limpa
valores da rota anterior, ignora respostas tardias e avisa quando o repositório
local falha. Gravar/remover grifos, progresso, notas e avançar uma sessão guiada
também informa falhas; a nota permanece aberta quando a gravação não conclui.

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
Inspeção visual no navegador/dispositivo segue pendente.

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
