# Expansão dos temas de Descubra

Atualizado em 2026-10-02. Este plano detalha a expansão da página aberta ao
selecionar um tema em Descubra. Ele se subordina ao plano mestre Q4 e não aprova
conteúdo editorial por si só.

## Problema e objetivo

Hoje, cada tema apresenta uma descrição breve e quatro cartões de passagem. A
página oferece acesso às leituras, mas não ajuda a pessoa a entender por que
elas foram reunidas, como explorá-las nem como seguir depois da última.

Objetivo: transformar o detalhe do tema numa pequena jornada bíblica que
contextualiza a seleção, convida à reflexão e facilita a leitura, sem substituir
o texto bíblico nem prometer resultados pessoais.

## Hierarquia proposta

1. **Retorno e cabeçalho:** “Voltar aos temas”, título, descrição e cena SVG já
   associada ao tema. Manter posição, tipografia e paleta da linguagem atual.
2. **Abertura editorial:** um parágrafo breve que delimita o ângulo da seleção
   e orienta a leitura, sem tratar uma interpretação como consenso universal.
3. **Leituras principais:** quatro passagens existentes, apresentadas como
   links de leitura com referência e nota contextual curta. Um CTA explícito abre
   a passagem no leitor bíblico.
4. **Leituras complementares:** até quatro referências adicionais sob
   “Ver todas as leituras”. A expansão é acionável por teclado, tem estado
   acessível e não carrega passagens ocultas antes de abrir a seção.
5. **Para refletir:** duas perguntas abertas ligadas aos textos selecionados;
   sem resposta prescrita e sem exigir registro do usuário.
6. **Uma prática possível:** uma ação pequena e opcional que não prometa cura,
   reconciliação, sucesso ou mudança emocional garantida.
7. **Oração breve:** texto curto identificado como proposta devocional; nunca
   apresentado como fala divina ou garantia de desfecho.
8. **Continue explorando:** dois ou três temas relacionados, com título,
   descrição curta e ilustração local; preserva a navegação dentro de Descubra.

No layout desktop, a apresentação e as leituras formam a coluna principal; os
blocos “Para refletir” e “Uma prática possível” podem ocupar uma coluna lateral
apenas quando houver largura suficiente. Em telas estreitas, tudo permanece em
uma coluna e conserva a ordem de leitura. Isso é responsividade, não uma
reformulação mobile dedicada.

## Conteúdo a preparar para cada tema

Para Amor, Cura, Ansiedade, Raiva, Alegria, Perdão, Esperança e Sabedoria:

- uma abertura editorial de 50–90 palavras;
- quatro notas contextuais curtas para as leituras existentes;
- quatro referências complementares, cada uma com uma nota contextual;
- duas perguntas de reflexão;
- uma prática opcional;
- uma oração de até 45 palavras;
- dois ou três temas relacionados, escolhidos por relação de conteúdo e não só
  por semelhança de cor ou palavra.

As referências precisam existir na ACF local, incluindo capítulo e intervalo
de versículos. As notas distinguem contexto textual de aplicação devocional.
Não se publica o lote até haver primeira revisão humana, segunda revisão
independente e decisão registrada, conforme `docs/criterios-editoriais.md`.

## Modelo de dados e implementação

- Tipos do domínio bíblico ficam em `core/biblia`, sem dependência de
  componentes React.
- Uma passagem temática contém `referencia` e `contexto`; não se mantém texto da
  Bíblia duplicado no catálogo temático.
- Cada entrada editorial tem identificador estável, versão e estado (`rascunho`,
  `em-revisao`, `aprovado` ou `publicado`). A interface consome apenas conteúdo
  publicado.
- Relações entre temas referenciam IDs válidos; nenhum link é montado por
  concatenação de rótulos.
- O verificador estrutural valida temas únicos, cobertura mínima, referências e
  faixas de versículos contra a Bíblia local, campos editoriais e integridade
  das relações.
- Estados de leitura/erro permanecem localizados à passagem; erro numa
  referência não pode ocultar as demais. Chamadas seguem offline-first e não
  adicionam serviço ou dependência externa.

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Prova-texto fora do contexto | Notas editoriais curtas; ler a unidade da passagem e verificar a faixa na base local. |
| Promessas sobre saúde ou sofrimento | Cura e ansiedade não prometem resultado nem substituem cuidado profissional. |
| Pressão por perdão/reconciliação | Perdão não é usado para exigir contato ou permanência em situação insegura. |
| Amor confundido com tolerância a abuso | Linguagem não normaliza violência, coerção ou ausência de limites. |
| Página longa e cansativa | Quatro leituras principais; complementares em seção expansível; seções escaneáveis. |
| Erro remoto ou custo de carregamento | A Bíblia local continua fonte primária; não introduzir requisições por tema ou texto duplicado. |
| Conteúdo gerado exposto sem revisão | Estado não publicado é bloqueado na interface e validado em CI. |
| Divergência entre desktop e estreito | Mesmo modelo e componentes; layout reorganiza sem trocar arte ou conteúdo. |

## Ordem de execução e aceite

### Etapa A — fundação e contrato

- remover a dependência de tipo do catálogo bíblico para o componente de
  ilustração;
- criar verificação automática das referências hoje publicadas;
- definir o schema de detalhe e a regra de status editorial.

**Aceite:** domínio não importa componentes; referências existentes validam na
ACF local; conteúdo de rascunho não é renderizado.

### Etapa B — lote editorial em revisão

- preparar o lote dos oito temas com os campos definidos acima;
- conferir cada referência e registrar rubrica/pendências;
- obter duas revisões humanas independentes.

**Aceite:** pendências e decisões rastreáveis; nenhuma entrada promovida sem
revisão. Esta etapa não pode ser encerrada automaticamente pelo agente.

### Etapa C — página de tema

- implementar cabeçalho ilustrado, leituras principais, expansão complementar,
  reflexão, prática, oração e temas relacionados;
- expor apenas itens publicados e preservar os quatro links atuais;
- manter acessibilidade, tema escuro e adaptação por largura.

**Aceite:** hierarquia clara, leitura sem bloqueios, estado de erro isolado,
foco/teclado, contraste, ausência de overflow e comparação visual desktop.

### Etapa D — auditoria editorial e visual

- validar referências no verificador e caminhos até o leitor;
- inspecionar desktop em claro/escuro e ao menos um breakpoint intermediário;
- revisar ordenação, foco, expansão e relação entre temas;
- atualizar a matriz visual e o changelog; confirmar CI.

**Aceite final:** revisão editorial humana concluída, interface conferida nos
viewports registrados e CI verde. Inspeção mobile dedicada continua adiada.

## Ponto de revisão atual

Fundação concluída: `IdTema` pertence ao domínio bíblico e o verificador
`check:temas` valida a lista publicada e o lote rascunho contra a ACF local.
Também foi implementado o primeiro nível da página — cabeçalho ilustrado,
atalho para a primeira leitura, seção nomeada de passagens e links para temas
relacionados. A UI usa somente os quatro textos já publicados por tema.

O lote de oito temas contém 32 leituras complementares propostas, além das 32
referências atuais, com notas, perguntas, práticas e orações. Está em
[`revisao-editorial/temas-descubra-ampliacao.md`](./revisao-editorial/temas-descubra-ampliacao.md)
e permanece fora do app até revisão humana. A tela completa será implementada
após esse gate; inspeção visual desktop segue pendente.
