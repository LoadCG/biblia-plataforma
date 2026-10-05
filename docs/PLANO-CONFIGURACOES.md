# Melhorias de Configurações

Plano focal para tornar preferências e gestão de dados claras, seguras e
consistentes entre as telas web responsivas e o app instalado. Não introduz
conta/sincronização, tradução adicional, importação de dados nem personalizações
sem uma necessidade validada.

## Progresso

| Etapa | Estado | Entrega |
|---|---|---|
| 0. Inventário e contrato | Concluída | Confirmados escopo local das preferências, lembrete nativo às 7h, indisponibilidade web, conteúdo real do arquivo de exportação e dados removidos. `TODO.md` é a decisão vigente: manter lembrete local; push/web requer backend e permanece fora de escopo. |
| 1. Orientação e disponibilidade | Implementada; inspeção visual parcial | Introdução explica armazenamento local; prévia de fonte foi adicionada; tema explica escopo; web apresenta lembrete como informação indisponível em vez de switch inoperante. Inspecionada em claro a 1280×720; o documento não excedeu a largura do viewport e a hierarquia inicial ficou clara. Tema escuro e largura estreita continuam pendentes. |
| 2. Gestão e preservação de dados | Implementada; verificação runtime pendente | Exportação enumera os dados efetivamente incluídos; exclusão explica o alcance, cancela o lembrete deste app e restaura estados locais e tema padrão na interface. Falha ao cancelar o aviso do sistema recebe resultado específico. |
| 3. Isolamento do lembrete | Implementada; teste em dispositivo pendente | Cancelamento busca apenas notificações marcadas como lembrete bíblico e reconhece as antigas pelo título/corpo; outras notificações permanecem agendadas. |
| 4. QA visual/assistivo/responsivo | Pendente | Conferir estados, foco, contraste, leitores de tela e larguras; em app instalado, validar permissão e agenda local em aparelho/emulador. |
| 5. Expansões condicionais | Não iniciada | Avaliar escolha de horário, restauração manual de preferências ou ajustes de grifo somente com evidência de necessidade. |

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

## Próximos passos

1. Inspecionar Settings em claro/escuro e em larguras web estreita, intermediária
   e ampla; verificar hierarquia, quebra de texto e rolagem.
2. Percorrer por teclado e conferir nomes/estados anunciados, foco visível e
   diálogos; conferir a prévia em todos os tamanhos/famílias.
3. Em aparelho/emulador compatível, confirmar permissão concedida/negada,
   ativar/desativar lembrete, reiniciar app e confirmar que outras notificações
   agendadas não são canceladas.
4. Exercitar exportação e exclusão com perfil descartável. Conferir conteúdo JSON,
   estado zerado após exclusão e recuperação de falha sem tocar nos dados reais.
5. Atualizar os estados deste plano apenas com evidência correspondente.

**QA web parcial (2026-10-05):** no navegador local, a árvore acessível expôs
os cabeçalhos, nomes dos switches, ações de exportar/apagar e a explicação da
indisponibilidade do lembrete web. A tela foi inspecionada em 1280×720 no tema
claro; uma falha visual de alinhamento das descrições dentro dos cards foi
corrigida. Não foram acionadas operações de exportação/exclusão nem controles
que persistem preferências. Viewports estreitos, tema escuro, percurso completo
por teclado/leitor de tela e execução nativa continuam sem evidência.

## Riscos e limites

- A exclusão e o lembrete usam repositórios/armazenamento locais; não existe
  mecanismo de recuperação/sincronização após apagar.
- A escolha de horário não faz parte desta entrega; 07:00 deve ser descrito como
  fixo, sem sugerir uma configuração que não existe.
- A revisão do app nativo dedicado continua fora da prioridade atual; QA nativo
  aqui limita-se a validar a função de notificação já existente quando o
  ambiente estiver disponível.
