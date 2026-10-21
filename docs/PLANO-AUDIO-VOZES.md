# Vozes da leitura bíblica — plano de melhoria

## Objetivo e limites

Melhorar a naturalidade percebida sem cobrança por chamada. O texto bíblico permanece intacto, a voz escolhida nunca é requisito para iniciar a leitura, e o player mantém uma única sessão ativa. A qualidade de cada voz depende do navegador, sistema e pacote de idioma instalado.

## Etapas

1. **Inventário concluído:** o player usa Web Speech API no navegador e `expo-speech` no nativo, sem escolha de voz ou velocidade. O SDK 57 permite descobrir vozes e passar identificador e velocidade ao `speak`.
2. **Implementada localmente:** listar somente vozes pt-BR disponíveis no dispositivo (incluindo variantes do locale), sem duplicar identificadores e em ordem alfabética; incluir sempre a voz padrão; oferecer escolha, três velocidades moderadas e uma frase de prévia que não se apresenta como texto bíblico. Salvar por dispositivo, impedir gravações concorrentes da preferência, usar o mesmo player na prévia e voltar à voz padrão quando o identificador salvo não existir ou a engine rejeitar a voz selecionada. No navegador, atualizar a lista ao receber `voiceschanged` ou sob demanda; identificar quando a voz web informa que usa serviço online.
3. **Checks estáticos passaram em 2026-10-07:** typecheck, acessibilidade estrutural, UI responsiva, copy e revisão do diff. A preferência é apagada com os dados locais e não é restaurada em outro dispositivo, pois os identificadores de voz não são portáteis.
4. **QA funcional pendente:** ouvir amostras e capítulos longos em Chrome, Edge, Safari, Android e iOS; testar vozes carregadas tardiamente, voz removida, pausa/retomada, troca de capítulo, modo escuro e leitor de tela. Registrar qualidade percebida, latência e falhas. Não afirmar que uma voz é neural somente pelo nome.
5. **Decisão futura:** considerar síntese neural local opcional apenas se a comparação auditiva mostrar ganho relevante. Medir download, memória, latência e licença do motor e do modelo. Um modelo Piper pt-BR médio pesa cerca de 63 MB; não incluir no carregamento inicial do site sem protótipo aprovado.

**Revisão de consistência em 2026-10-15:** pausa e retomada agora exigem a
origem da tela, assim como a limpeza já fazia. Isso evita que um controle antigo
do Versículo do Dia pause/retome a sessão do leitor (ou vice-versa) após uma
troca rápida de rota. Teste unitário cobre no-op para origem antiga e execução
para a origem ativa. A reprodução real, callbacks tardios e comportamento de
interrupção nativa continuam dependentes de QA de engine em navegador/aparelho.

**Checkpoint CP6 em 2026-10-21:** auditoria encontrou dois callbacks no player
compacto do Versículo do Dia que passavam o evento de toque como origem. Como o
serviço valida a identidade da origem da sessão, pausar ou retomar por esses
controles era ignorado. Os callbacks agora encaminham a origem do cartão. Busca
estática dos consumidores confirmou que os demais comandos de pausa e retomada
encaminham sua origem explicitamente. A cobertura unitária existente verifica
que comandos de origem antiga são ignorados e os da origem ativa são executados.

**Qualidade de código:** problema isolado corrigido em `CardVersiculoDia.tsx`;
nenhuma mudança na API do player. Verificação direcionada: teste unitário do
serviço de áudio e typecheck. **QA auditivo pendente:** ouvir em navegador e em
Android/iOS, incluindo pausa, retomada, troca de tela/capítulo, callbacks tardios
e leitor de tela. Os mocks e a inspeção de código não validam a qualidade nem o
comportamento da engine de voz real.

## Critérios de aceite

- A leitura usa a voz selecionada quando ela está disponível e segue funcionando com a voz padrão quando não está.
- Navegadores sem suporte mostram uma explicação e não oferecem controles de voz que não funcionarão.
- Prévia e leitura nunca falam ao mesmo tempo; sair de Configurações encerra somente a prévia da tela.
- Preferências e controles têm nomes acessíveis, funcionam por teclado/toque e permanecem legíveis nos dois temas.
- A qualidade auditiva só é considerada validada após escuta real nas plataformas alvo.

## Fontes técnicas

- [Expo Speech SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/speech/)
- [Web Speech API e escolha de voz](https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis)
- [Evento `voiceschanged`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event)
- [Vozes Piper pt-BR](https://huggingface.co/rhasspy/piper-voices/tree/main/pt/pt_BR)
