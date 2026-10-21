# Planejamento — “Tem alguém que me ama?”

**Estado:** primeiro incremento de desenvolvimento em andamento; conteúdo e publicação ainda dependem de revisão e decisões operacionais.
**Atualizado em:** 2026-10-20

Este documento reúne a ideia compartilhada até agora e identifica decisões ainda abertas. Ele não substitui revisão bíblica e pastoral, nem autoriza alterar as rotas de produção.

## 1. Ideia e experiência pretendida

Um panfleto simples inicia a conversa na rua: papel branco, texto preto centralizado — “Tem alguém que te ama.” — e, abaixo, QR code e endereço `temalguemquemeama.com.br`. A landing também começa literalmente com “Tem alguém que te ama.”; em seguida, continua a conversa e desenvolve a curiosidade sobre quem é esse alguém.

A página conduz a pessoa por frases breves sobre amor, cuidado e a experiência humana. Não identifica Cristo logo na abertura: a identidade de quem ama é revelada mais adiante. A revelação deve ser clara e honesta, sem transformar a curiosidade em pegadinha. Depois dela, a página explica o evangelho protestante em linguagem simples e aponta referências bíblicas para conferência.

O objetivo não é exigir uma resposta, cadastro, contato ou compromisso. O visitante pode terminar a leitura e decidir livremente se quer conhecer mais.

## 2. Premissas já compartilhadas

- A landing ocupa a raiz do site: `/`.
- A página inicial do app atual passa para `/biblia`.
- A entrada do leitor bíblico passa para `/leitura`.
- O panfleto começa com a frase central, QR code e o endereço pretendido, mas também precisa comunicar o núcleo da mensagem sem depender de celular, internet ou leitura do QR. Extensão e ponto da revelação no impresso ainda precisam ser definidos.
- A primeira versão da landing é mobile-first, rápida e composta por texto.
- O visual trabalha com dois temas: fundo preto e texto branco, ou fundo branco e texto preto.
- A leitura apresenta mensagens curtas em sequência, dedica várias delas a aspectos bons do amor antes de revelar Jesus um pouco depois da metade e continua contando a história de Jesus depois da revelação.
- Depois da narrativa curta, `/conhecer` oferece a escolha de um tema. Ao selecionar, a pessoa abre um formulário opcional para compartilhar um relato ou pedido de oração; pode pular o preenchimento e ir à leitura relacionada.
- Não incluir imagens ou vídeos na primeira versão. A experiência usa frases curtas em sequência e transições animadas durante a rolagem. O formulário está no escopo planejado, mas o envio só será ativado depois de definir responsável, prazo de resposta, privacidade e segurança; a Bíblia online continua sujeita à decisão de destino e direitos.
- O domínio pretendido é `temalguemquemeama.com.br`; disponibilidade e registro devem ser confirmados diretamente no Registro.br.
- A organização responsável, a tradução bíblica, o conteúdo impresso e a operação do próximo passo continuam sem decisão.

## 3. Jornada proposta para o visitante

Esta é uma estrutura para orientar a redação, não o texto final:

1. **Acolher com a mesma frase do panfleto.** Abrir a landing com “Tem alguém que te ama.”, como afirmação com ponto final. Em seguida, acolher a curiosidade sobre quem é esse alguém.
2. **Criar identificação sem presumir a história da pessoa.** Falar de dúvidas, cansaço ou sensação de não ser visto sem afirmar que todo visitante vive a mesma situação.
3. **Apresentar a ideia de um amor que não precisa ser comprado ou merecido.** Evitar prometer que sofrimento, solidão ou problemas serão resolvidos nesta vida.
4. **Fazer a transição para a Bíblia.** Explicar que a resposta a essa pergunta vem da fé cristã e nomear Deus como fonte desse amor, sem prolongar o suspense de forma enganosa.
5. **Revelar Jesus Cristo.** Dizer diretamente que, segundo a Bíblia, Deus demonstrou seu amor em Jesus.
6. **Explicar o evangelho.** Apresentar, com frases simples, o propósito de Deus, o pecado como ruptura com Deus e o mal praticado por seres humanos, a morte e ressurreição de Jesus e a salvação pela graça recebida pela fé. Explicar “graça”, “pecado” e “salvação” na primeira ocorrência.
7. **Oferecer continuação opcional.** Depois de conhecer Jesus, a pessoa pode abrir `/conhecer` para leituras mais extensas, estudos simples e escolha de tema, ou abrir a Bíblia online em `/leitura`. Na página de cada tema, pode enviar voluntariamente um relato/pedido de oração ou pular o formulário e ler o conteúdo relacionado.

Cada quadro de frases deve funcionar por si e também formar uma progressão quando rolado. Não esconder a natureza cristã da página depois da revelação: dali em diante, a mensagem deve ser explicitamente bíblica.

## 4. Direção de conteúdo e revisão

- Usar português cotidiano, frases curtas e parágrafos pequenos.
- Manter tom respeitoso; não pressionar por decisão imediata, usar medo ou culpa como técnica, prometer prosperidade, cura ou solução de problemas, nem inventar testemunhos, números, igrejas ou credenciais.
- Distinguir afirmações da página de referências que permitem conferi-las no texto bíblico.
- Na primeira versão, preferir referências (livro, capítulo e versículos) a transcrições longas. A autorização para redistribuir a cópia integral ACF já usada pelo app não está confirmada; a tradução e seus direitos para a landing ainda precisam de decisão.
- Preparar o texto para revisão pastoral antes de publicação. Registrar quem revisou e quais mudanças foram aceitas quando a organização responsável estiver definida.
- Não usar material de revisão interna como texto visível ao visitante.

## 5. Navegação proposta

| Caminho público | Destino proposto | Situação atual / observação |
|---|---|---|
| `/` | Landing evangelística | Hoje é a Home do app. A raiz web e a entrada nativa podem precisar de comportamentos diferentes. |
| `/biblia` | Início do app atual | Hoje abre a aba/leitor bíblico. Passaria a ser a Home do app. |
| `/biblia/...` | Áreas do app | Proposta para agrupar busca, perfil, planos, resumos, salvos, configurações e páginas auxiliares sob o prefixo do app. O inventário completo de caminhos e links internos precisa preceder a mudança. |
| `/leitura` | Entrada do leitor | Hoje a seleção de livro está em `/biblia/escolher`; decidir se `/leitura` abre a seleção, retoma a última leitura ou apresenta uma escolha explícita. |
| `/leitura/:livro/:capitulo` | Capítulo bíblico | Hoje os capítulos são publicados em `/biblia/:livro/:capitulo`, com HTML estático gerado no build. |
| `/conhecer` | Hub de aprofundamento | Proposta nova: leituras mais extensas e estudos introdutórios sobre Jesus, a Bíblia e a história da salvação. |
| `/conhecer/jesus`, `/conhecer/biblia`, `/conhecer/salvacao`, `/conhecer/estudos-iniciantes` | Páginas/estudos para quem quer continuar | Caminhos editoriais propostos; decidir se serão quatro páginas independentes ou se os estudos para iniciantes serão uma série dentro do hub. |
| `/conhecer/temas/:tema` | Página de um tema selecionado | Apresenta primeiro a opção de compartilhar/pedir oração e o formulário opcional; oferece também caminho claro para pular o formulário e ler o estudo do tema. Publicar quando a operação do formulário estiver definida. |
| `/conhecer/temas/:tema/leitura` | Estudo bíblico relacionado ao tema | Destino de quem escolhe não preencher o formulário; publicar após redação e revisão. |

### Compatibilidade de links existentes

As URLs de capítulos já publicadas podem estar em panfletos antigos, favoritos, resultados de busca ou mensagens. O plano deve definir redirecionamento permanente para o novo padrão `/leitura/:livro/:capitulo`, preservando livro e capítulo. A antiga `/biblia` não pode ser redirecionada para o leitor, pois passa a ser a entrada do app.

Também é necessário decidir o destino dos caminhos antigos de seleção (`/biblia/escolher...`), planos, resumos e demais páginas. Se as páginas do app forem agrupadas sob `/biblia`, mapear redirecionamentos de `/planos`, `/resumos`, `/pesquisa`, `/voce`, `/salvo` e outras rotas existentes para os novos caminhos. Confirmar as regras de exportação estática e Vercel antes de implementar: o projeto gera páginas HTML de capítulos e conteúdo editorial por rota.

Para a versão nativa, definir explicitamente se a abertura do app vai direto para `/biblia`; a landing web em `/` não deve substituir acidentalmente a experiência inicial nativa.

## 6. Direção visual e acessibilidade

- Página rápida, sem dependências externas ou recursos pesados desnecessários.
- Layout mobile-first, com uma frase ou pequeno conjunto de frases centralizado em cada quadro de leitura, boa tipografia e espaço suficiente entre etapas.
- Dois temas monocromáticos com controle fácil de encontrar e operar. Tema inicial e persistência da preferência ainda precisam de decisão; recomendação inicial: abrir em tema escuro, como no conceito, e oferecer alternância acessível.
- Garantir contraste legível, foco de teclado visível, rótulos acessíveis no seletor de tema, leitura por tecnologia assistiva e respeito à preferência de contraste/tema disponível no dispositivo.
- Usar transições discretas de saída/entrada conforme a rolagem para acompanhar a progressão do texto, sem assumir o controle da rolagem. Respeitar `prefers-reduced-motion` e manter todo o conteúdo acessível na ordem do documento.
- Verificar a página em celulares estreitos e em desktop, além de zoom e tamanho de texto ampliados.

## 7. Fases de trabalho sugeridas

1. **Fechar o brief:** organização responsável, público, voz da página, grau de suspense e próximo passo.
2. **Rascunhar o conteúdo:** escrever a sequência completa, selecionar referências e marcar termos que precisam de explicação.
3. **Revisar o conteúdo:** revisão bíblica/pastoral e decisão sobre tradução, citações e direitos antes de publicar qualquer trecho bíblico.
4. **Fechar arquitetura:** inventariar rotas atuais, escolher novos caminhos, mapear links internos e externos, especificar redirecionamentos e comportamento web/nativo.
5. **Implementar em etapa própria:** consultar a documentação versionada do Expo SDK 57 exigida por `AGENTS.md` antes de alterar código; preservar as alterações locais que já existem no repositório.
6. **Verificar:** testar URLs diretas e redirecionamentos, exportação estática, navegação web/nativa, QR em aparelho, responsividade, contraste, teclado e tecnologia assistiva.
7. **Publicar quando aprovado:** confirmar domínio no Registro.br, definir titular/responsável, apontar DNS e validar o deploy de produção antes de divulgar o QR impresso.

## 8. Decisões em aberto

| Decisão | Ponto de partida para discutir |
|---|---|
| Quem responde pelo projeto? | Definir pessoa, igreja ou organização antes de apresentar autoria, contato ou afiliação pública. Não inventar um nome provisório no site. |
| Qual tradução bíblica será usada? | Começar apenas com referências; só inserir texto bíblico após confirmar tradução, licença e forma permitida de citação. |
| Quais próximos passos? | Abrir `/conhecer` e `/leitura`. Após escolher tema, a pessoa pode enviar relato/pedido de oração com contato opcional ou pular direto para leitura. Definir responsáveis, operação e tratamento de dados antes de ativar o envio. |
| Até onde vai o suspense? | A primeira versão usa cinco quadros de acolhimento e revela Deus em Jesus no sexto de dez; depois conta o cuidado de Jesus, a cruz, a ressurreição e a graça. É um rascunho para testar com leitores, não texto aprovado. |
| Qual o comportamento de `/leitura`? | Decidir entre seletor de livro, continuar última leitura ou página introdutória que oferece essas opções. |
| Como tratar a raiz no app nativo? | Definir que a experiência nativa abra o app em `/biblia`, mesmo que `/` na web seja a landing. |
| O que acontece com URLs antigas? | Preservar capítulos por redirecionamento e mapear todas as rotas públicas atuais antes de reorganizar o prefixo. |
| Qual tema abre por padrão? | Conceito sugere escuro; confirmar se a preferência do sistema ou uma escolha salva deve prevalecer depois da primeira visita. |
| Quem revisa e aprova antes de publicar? | Nomear a liderança/revisor e combinar como registrar a aprovação editorial. |
| Domínio e distribuição | Confirmar disponibilidade no Registro.br, titular, renovação e relação com o atual domínio Vercel antes de imprimir o QR. |

## 9. Critérios para considerar a primeira versão pronta para revisão

- A landing e o panfleto começam exatamente com “Tem alguém que te ama.”; a página identifica Jesus Cristo claramente antes de encerrar.
- A explicação cobre os elementos do evangelho listados neste plano sem jargão inexplicado, pressão ou promessas não sustentadas.
- As referências acompanham as afirmações bíblicas relevantes; nenhum texto longo é publicado sem decisão de tradução e direitos.
- A pessoa consegue ler a página completa sem fornecer dados e encontra o próximo passo aprovado. Se houver formulário, ele é opcional, tem operação e aviso de privacidade verificados e não é apresentado como canal de emergência.
- Os dois temas são legíveis, navegáveis por teclado e por leitor de tela, e a página funciona em celular.
- A URL `/` é a landing web; `/biblia` é a entrada do app; `/leitura` leva ao fluxo de leitura acordado; links antigos e conteúdo estático continuam funcionando conforme o mapa aprovado.
- O texto recebe revisão pastoral e a organização responsável está identificada antes da publicação pública.

## 10. Lacunas identificadas nesta revisão

Estes pontos não mudam a ideia central. Eles precisam ser considerados para a página funcionar bem no contexto real do panfleto e para a mudança de rotas não surpreender quem já usa o app.

### Experiência de quem chega pelo panfleto

- **Leitura em navegador embutido:** muitos celulares abrem QR codes dentro do navegador do próprio aplicativo de câmera ou de mensagens. Conferir se a página funciona sem exigir abertura no Safari/Chrome, login, instalação do app ou permissões.
- **Peso real da primeira tela:** “página simples e rápida” não é garantido só por ter pouco texto. O app atual inclui lógica e dados bíblicos locais; verificar se a rota `/` carrega os mesmos pacotes JavaScript pesados. Se a landing depender do bundle inteiro do app, estudar uma saída de build independente e leve antes de adotar a arquitetura.
  - **Evidência atualizada após CP4:** o export com divisão assíncrona web cria chunks por rota. O HTML da landing deixou de carregar o pacote de dados bíblicos (4,2 MB raw) e os scripts iniciais somam aproximadamente 498 KB em gzip local. Ainda falta medir transferência real e execução em aparelho/rede móvel antes de fechar a arquitetura.
- **Animação sem esconder conteúdo:** a rolagem pode animar a troca das frases, mas não deve bloquear a rolagem, exigir espera nem deixar texto inacessível a leitor de tela, seleção de texto, busca ou movimento reduzido. O conteúdo deve continuar disponível na ordem normal do documento.
- **Expectativa criada pela frase:** evitar sugerir que uma pessoa específica está observando ou procurando o visitante. O texto deve esclarecer que apresenta uma afirmação da fé cristã sobre o amor de Deus, sem se apropriar da história pessoal de quem chegou.
- **Próximo passo sem surpresa de produto:** ao sair da landing para o app, informar que a pessoa está entrando em uma experiência de leitura bíblica. Se o formulário entrar no escopo, explicar separadamente que dados serão coletados, por quem e com qual finalidade; a comunicação deve distinguir essa coleta da navegação pelo conteúdo e do armazenamento local de preferências/progresso no app.

### Panfleto, domínio e operação

- **URL legível e estável:** imprimir o endereço em texto além do QR code, usar HTTPS e confirmar domínio, DNS e redirecionamento entre versões com/sem `www` antes da tiragem. Não imprimir material enquanto o destino final e a titularidade do domínio estiverem indefinidos.
- **Teste físico do QR:** validar o arquivo final impresso no tamanho planejado, em papel e iluminação comuns, com mais de um aparelho e mais de um leitor. O QR deve apontar para uma URL canônica duradoura, sem parâmetros de rastreamento; se houver mudança futura de página, manter redirecionamento do endereço impresso.
- **Responsável por manter o destino:** definir quem renova o domínio, acompanha o deploy e consegue atualizar ou retirar a página caso o conteúdo precise de correção. O domínio deve continuar levando a uma página coerente enquanto ainda houver panfletos em circulação.
- **Plano de publicação/retorno:** como `/` hoje é o app em produção, testar a landing e a migração em preview. Definir como voltar à versão anterior se uma publicação quebrar o site; um deploy da landing também pode afetar as rotas do app no mesmo projeto.

### Identidade, privacidade e confiança

- **Nome público versus nome técnico:** decidir se “Tem alguém que me ama?” é o nome da iniciativa, da página ou do projeto inteiro. O app pode continuar com identidade própria. Evitar renomear pacote, slug ou app nativo apenas para resolver o título da landing.
- **Responsabilidade editorial visível:** a pessoa precisa entender quem apresenta a mensagem. Definir organização/autoria e uma forma adequada de identificação antes da publicação. Não adicionar igreja, contato ou credencial presumidos.
- **Afirmações de privacidade:** ausência de formulário não prova, por si só, que nenhum dado técnico é processado. Antes de afirmar “não coletamos dados”, revisar hospedagem, logs, scripts, fontes, service worker e qualquer ferramenta externa. A primeira versão pode evitar analytics, pixels, fontes remotas e cookies não essenciais.
- **Cache offline e atualização:** o domínio já registra um service worker que guarda páginas navegadas e usa `/` como fallback offline. Testar pessoas que já visitaram a versão antiga, a troca de `/` para landing e o funcionamento offline de `/biblia` depois do deploy. Evitar mostrar uma Home antiga do app ou uma landing como fallback inesperado para uma rota que falhou.
- **Metadados e compartilhamento:** título, descrição, nome do site, imagem de prévia social, URL canônica e idioma ainda usam a identidade “Bíblia Plataforma” em partes globais. Definir metadados específicos para a landing e para o app. Rever também sitemap/robots e indexação; não encontrei esses arquivos em `public/` na inspeção atual.

### Conteúdo, revisão e direitos

- **Compreensão por quem não conhece a igreja:** testar o rascunho com algumas pessoas que não frequentam igreja e pedir que expliquem, com suas palavras, o que entenderam e quem a página diz que ama. Isso verifica clareza, não mede conversão nem substitui revisão pastoral.
- **Limite do suspense:** combinar um critério editorial: a pessoa pode descobrir que a página é cristã antes da frase de revelação final? Minha sugestão é não rotular o primeiro bloco como um anúncio religioso, mas nomear a Bíblia e Jesus claramente antes da explicação do evangelho; a página inteira continua transparente sobre sua intenção.
- **Referências que podem ser abertas:** referências sem transcrição evitam reproduzir texto protegido, mas a pessoa ainda precisa de um meio para consultar a passagem. Definir se haverá link para o leitor do app, orientação para consultar uma Bíblia própria ou ambos. O link para o leitor depende de resolver a situação de redistribuição da ACF já registrada em `docs/LICENCA-TEXTO-ACF.md`.
- **Conteúdo sensível:** se o texto final falar diretamente de desespero, abuso, luto ou vontade de morrer, rever essa linguagem com cuidado e decidir se precisa de encaminhamento confiável. Não usar sofrimento como recurso para aumentar a decisão religiosa.
- **Controle de versões do texto:** manter o texto da landing como fonte única, marcar versão/data de aprovação e separar revisão editorial de ajustes técnicos. Isso reduz o risco de publicar uma edição não revisada ao atualizar a página.

### SEO, rotas e qualidade técnica

- **Desempenho medido em celular:** definir um limite simples para tamanho inicial e tempo de renderização em rede móvel comum. A página deve continuar útil com conexão lenta e sem recursos de terceiros.
- **Rotas antigas além dos capítulos:** `resumos` e `planos` também são pré-renderizados e têm tráfego/links próprios. Mapear cada URL pública e decidir se permanece onde está ou muda para `/biblia/...`; não assumir que todas podem ser movidas em lote sem impacto de SEO.
- **Redirecionamentos e parâmetros:** testar acesso direto, atualização da página e query strings nos novos caminhos e nos antigos. Garantir que redirecionar capítulo antigo preserve livro, capítulo e eventual referência ao versículo quando existir.
- **Identidade por superfície:** a landing web na raiz, a Home do app em `/biblia` e a abertura nativa são contextos diferentes. Revisar título de documento, tema de navegador, ícone e retorno de navegação em cada um; não mudar a identidade do app nativo por acidente.
- **Métricas de comportamento:** analytics não estão decididos. Recomenda-se começar sem rastreamento comportamental; usar revisão pastoral, teste de aparelho e compreensão qualitativa como evidência do piloto. Se houver métricas de acesso agregadas depois, documentar finalidade e privacidade. Não tratar formulário ou clique como medida de fé.

### Prioridade sugerida para fechar as lacunas

1. **Antes de redigir a versão final:** identificar responsável/identidade, limite do suspense, referência bíblica e próximo passo; consultar a situação de direitos antes de oferecer leitura do texto ACF.
2. **Antes de escolher a solução técnica:** fazer uma prova curta de tamanho da página raiz, coexistência com o bundle do app e caminhos de exportação/redirecionamento. A exigência do repositório é consultar a documentação exata do Expo SDK 57 antes de qualquer alteração de código.
3. **Antes de imprimir:** confirmar domínio e HTTPS, aprovar conteúdo, testar QR físico e registrar responsável por renovação, publicação e correção.
4. **Antes de divulgar:** testar navegador embutido, teclado/leitor de tela, rede lenta, cache atualizado e rotas antigas; conferir que a descrição de privacidade corresponde ao comportamento real do host e do app.

## 11. Opções para entregar a landing e o app

O projeto já usa Expo Router em exportação web estática e hospeda o resultado no Vercel. “Estática” aqui quer dizer que o build produz arquivos HTML por rota antes da visita. Isso ajuda em disponibilidade e indexação; não significa que o app inteiro seja HTML sem JavaScript.

| Opção | Como funcionaria | Vantagem | Custo ou risco |
|---|---|---|---|
| **A. Landing como rota Expo Router** | Criar a landing em `/` e colocar as rotas do app sob `/biblia`, com o leitor em `/leitura`. Manter exportação estática atual. | Uma navegação e uma publicação; links internos podem usar a mesma estrutura do Expo Router. | Implementada no primeiro corte. A divisão por rota foi ativada somente para web conforme suportado no SDK 57; scripts iniciais da landing somam ~498 KB gzip local. A rota raiz foi separada da árvore de abas para pré-renderizar conteúdo. Ainda falta confirmar o carregamento real em dispositivos e decidir se o peso precisa cair mais.
| **B. Landing HTML independente no build atual** | Gerar ou copiar um documento HTML pequeno para ocupar `dist/index.html` depois da exportação do app. Manter as rotas Expo em `/biblia/...` e `/leitura/...`. O seletor preto/branco usaria CSS e um pequeno script local, sem hidratar a aplicação completa. | Controla o peso e o primeiro render da página do panfleto; mantém um único repositório e, potencialmente, um deploy/domínio. | A raiz deixa de ser uma tela gerida pelo Expo Router na web. O script de build, metadados, teste local, fallback do service worker e a entrada nativa precisam tratar a landing e o app como superfícies diferentes. Substituir o HTML raiz precisa ser testado no export e preview.
| **C. Landing e app em projetos de hospedagem diferentes** | Publicar a landing e o app separadamente e encaminhar `/` e `/biblia/...` pelo mesmo domínio. | Isola builds e permite publicar cada superfície separadamente. | Acrescenta configuração de roteamento/proxy, diagnóstico e rollback. É a opção com mais operação para uma primeira página sem backend.

### Recomendação provisória

Investigar primeiro a **Opção B**: manter o mesmo repositório e a exportação do app, mas publicar a landing como HTML muito pequeno na raiz. A página não precisa de componentes do app nem de dados bíblicos carregados por JavaScript; um documento simples atende ao escopo e reduz o risco de fazer a pessoa que veio do QR baixar a aplicação inteira antes de ler.

Isso ainda não é uma decisão técnica final. Antes de implementar, fazer uma prova isolada em exportação/preview que responda a estas perguntas:

1. É possível substituir o HTML raiz sem afetar `dist/biblia/index.html`, capítulos em `/leitura/...`, planos e resumos?
2. Qual é o tamanho transferido da landing em rede móvel, inclusive CSS/JavaScript e primeiro render? Comparar com uma rota Expo que use carregamento assíncrono do SDK 57.
3. Como serão definidos metadados e título da landing sem alterar os do app e das páginas editoriais?
4. A abertura nativa continua em `/biblia`, enquanto a web abre a landing em `/`?
5. Após atualizar o service worker, um visitante recorrente recebe a landing nova e ainda consegue abrir o app offline?
6. URLs públicas antigas e links internos levam aos novos caminhos, preservando o capítulo e sem transformar a raiz em fallback para rotas inválidas?

As docs versionadas do Expo Router SDK 57 listam carregamento assíncrono de rotas web e regras de redirecionamento/reescrita; o projeto também contém um gerador próprio para HTML de capítulos. O Vercel documenta rewrites internos e recomenda conferi-los em Preview Deployments. Essas capacidades tornam a integração possível, mas não eliminam os testes de precedência e exportação exigidos pela combinação específica do projeto.

## 12. Referências técnicas consultadas

- [Expo Router — referência do SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/router/) — configuração de `asyncRoutes`, `redirects`, `rewrites` e sitemap.
- [Rewrites no Vercel](https://vercel.com/docs/routing/rewrites) — roteamento interno mantendo a URL e teste por Preview Deployment.
- [Configuração estática `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json) — exemplos de rewrite para arquivo HTML e observações sobre precedência da filesystem.
- Evidência local do repositório: `app.json`, `app/_layout.tsx`, `app/+html.tsx`, `public/sw.js`, `scripts/gerar-rotas-leitura.js`, `scripts/verificar-export-estatico.js` e artefatos existentes em `dist/`.

## 13. Checkpoints e roadmap

O roadmap não usa datas estimadas porque ainda não há responsáveis, disponibilidade de revisão pastoral, confirmação de domínio nem escolha de arquitetura. Cada checkpoint termina com uma evidência revisável e uma decisão clara de seguir, ajustar ou parar. Conteúdo e descoberta técnica podem avançar em paralelo depois do checkpoint inicial.

### Visão geral

| Marco | Fase | Estado agora | Saída principal |
|---|---|---|---|
| CP0 | Brief, escopo e responsáveis | **Em andamento** — ideia, domínio pretendido e intenção de rotas registrados; responsável e decisões de produto ainda abertos. | Brief aprovado e papéis atribuídos. |
| CP1 | Roteiro e primeira redação | **Não iniciado** | Manuscrito completo com referências e notas editoriais. |
| CP2 | Revisão de conteúdo | **Não iniciado** | Texto revisado e versão editorial aprovada para implementação. |
| CP3 | Descoberta técnica e mapa de URLs | **Parcial** — rotas principais e artefatos atuais foram inspecionados; falta inventário total e medição em exportação/preview limpo. | Arquitetura escolhida e matriz de rotas/redirecionamentos aprovada. |
| CP4 | Implementação em ambiente controlado | **Concluído nesta branch** — landing e refinamentos de navegação estão disponíveis no Expo Web; nenhuma publicação de domínio foi feita. | Landing e app navegáveis em preview, sem publicação no domínio final. |
| CP5 | Verificação funcional, visual e editorial | **Parcial** — teste responsivo em nove viewports e smoke test da navegação; falta animação normal, aparelhos, leitores de tela e aprovação editorial. | Evidências de QA e lista de pendências aceita. |
| CP6 | Aprovação para produção e domínio | **Não iniciado** | Deploy público aprovado, HTTPS e rotas validados. |
| CP7 | Prova impressa e distribuição | **Não iniciado** | QR testado em exemplar físico e tiragem autorizada pelo responsável. |
| CP8 | Manutenção | **Não iniciado** | Responsável, processo de correção e renovação do domínio registrados. |

### CP0 — Brief, escopo e responsáveis

**Objetivo:** transformar a ideia em limites claros para conteúdo, app, site e operação.

**Decisões a registrar:**

- confirmar como escopo-base: landing web em `/`, Home do app em `/biblia` e fluxo do leitor iniciado em `/leitura`;
- dizer se “Tem alguém que me ama?” nomeia a página, a iniciativa ou todo o produto;
- identificar a pessoa ou organização responsável pelo conteúdo, domínio e publicação;
- manter V1 sem imagens ou vídeos; usar apenas a animação de texto definida para a narrativa; decidir se o pedido de ajuda entra nesta fase ou só depois de haver equipe de atendimento e regras de privacidade;
- decidir o que o panfleto comunica por si só para que a mensagem central alcance quem não tem celular, internet ou familiaridade com QR;
- definir quem pode aprovar texto, arquitetura, domínio e impressão.

**Entregável:** brief de uma página com objetivo, público, escopo, não objetivos, responsáveis e decisões pendentes.

**Checkpoint de saída:** há uma pessoa responsável identificada e não existem contradições entre a promessa do panfleto, a página e a ação final. A disponibilidade do domínio não precisa bloquear a redação, mas bloqueia impressão com o endereço definitivo.

### CP1 — Roteiro e primeira redação

**Dependência:** CP0 concluído o bastante para definir voz, autoria provisória e limite do suspense.

**Entregáveis:**

- sequência completa de mensagens, da pergunta até a revelação de Jesus;
- explicação curta de criação/propósito, pecado, morte e ressurreição, graça e fé;
- referências bíblicas associadas a cada afirmação principal;
- proposta de próximo passo, com o destino em `/leitura` descrito sem prometer conteúdo ainda não aprovado;
- chamada após a revelação para aprofundar em `/conhecer`, com leituras sobre Jesus, a Bíblia e a história da salvação, além de estudos simples para iniciantes;
- mapa editorial dos doze temas adotados como base a partir da lista pública do 30 Semanas, com rótulo para o visitante, escopo e referência bíblica inicial para cada tema;
- decisão de quais páginas temáticas estarão completas e revisadas no primeiro lançamento; os demais temas não aparecem como links ativos até terem conteúdo;
- texto impresso autossuficiente em nível acordado e sua relação com a sequência de suspense do site;
- fluxo e especificação do formulário opcional: campos mínimos, pedido de oração sem retorno versus pedido de contato, aviso de privacidade, responsável, prazo e encaminhamentos para situações fora do atendimento;
- lista de termos teológicos e explicação simples de cada um;
- registro explícito do que não será dito (promessas de cura/prosperidade, testemunhos ou credenciais inventadas, pressão e medo).

**Checkpoint de saída:** o texto pode ser lido do início ao fim sem depender de layout; a revelação é clara e o suspense não atrasa a identificação cristã para além da explicação do evangelho. As referências foram conferidas, sem transcrição longa não licenciada. Os doze temas têm rótulos compreensíveis e não patologizantes, e cada destino ativo tem conteúdo revisável próprio.

O impresso e o site podem ter ritmos diferentes: o panfleto pode resumir o evangelho para ficar completo sem internet, enquanto a landing desenvolve a conversa e guarda a revelação para o ponto aprovado. Essa diferença deve ser intencional, não uma dependência do visitante possuir smartphone.

### CP2 — Revisão de conteúdo

**Dependência:** manuscrito CP1.

**Revisões:**

1. liderança/revisor pastoral avalia fidelidade bíblica, clareza doutrinária e tom;
2. leitores não familiarizados com igreja leem a página e explicam o que entenderam; isso mede compreensão, não conversão;
3. revisão de direitos decide se a tradução será apenas referenciada, citada dentro de limites confirmados ou vinculada em fonte autorizada.

**Entregáveis:** versão aprovada, nome/função de quem revisou, data da aprovação, referências conferidas e pendências de direitos registradas.

**Checkpoint de saída:** aprovação pastoral registrada; nenhuma frase depende de medo, promessa ou história inventada; texto de Bíblia reproduzido apenas após autorização adequada. Se houver pendência de tradução, a versão segue só com referências e não promete acesso a uma cópia cujo direito ainda não esteja resolvido.

### CP3 — Descoberta técnica, baseline e mapa de URLs

**Dependências:** decisões CP0 sobre domínio pretendido e rotas; pode avançar em paralelo com CP1/CP2.

**Trabalho técnico:**

1. registrar o baseline das rotas públicas atuais, incluindo Home, capítulos, seleção de livros, planos, resumos, busca, salvos, perfil, configurações, ajuda, privacidade e páginas auxiliares;
2. descobrir links internos, links externos indexados, parâmetros de capítulo/versículo e HTMLs estáticos gerados;
3. medir o build atual em preview limpo: HTML raiz, JavaScript carregado inicialmente, chunks baixados depois, bytes comprimidos e tempo em rede móvel;
4. comparar a página como rota Expo Router com a opção HTML independente no mesmo build; verificar a possibilidade de carregamento assíncrono antes de supor que ele resolve o peso inicial;
5. especificar rotas finais, redirecionamentos permanentes, URLs que permanecem, comportamento para capítulo inválido e fallback offline;
6. planejar entrada nativa em `/biblia` e comportamento web em `/` sem trocar identidade ou onboarding do app nativo.

**Entregáveis:** baseline revisável, mapa antigo → novo, resultado da comparação de peso, decisão de arquitetura e plano de migração/rollback.

**Checkpoint de saída:** cada rota pública tem destino definido; não há colisão entre `/biblia` (Home do app) e `/leitura` (leitor); comportamento de preview, exportação, service worker e links antigos foi explicado. Nenhum código de rota deve ser alterado antes deste aceite.

### CP4 — Implementação em ambiente controlado

**Dependências:** CP2 para inserir o texto aprovado; CP3 para rotas e arquitetura; instrução de consultar docs versionadas do SDK 57 antes de escrever código Expo.

**Entregáveis:**

- landing funcional em exportação de preview;
- hub `/conhecer` e páginas de aprofundamento incluídos conforme a matriz de conteúdo aprovada;
- tema claro/escuro e preferência conforme decisão CP0;
- sequência de frases com transições acionadas pela rolagem, sem travar o controle do visitante e com alternativa para movimento reduzido;
- acesso direto à continuação a partir do primeiro quadro, rolagem navegável por teclado e texto dos quadros disponível integralmente na árvore acessível mesmo durante a animação;
- indicador de progresso semântico, legível e atualizado por quadro (sem anúncio contínuo por pixel), CTAs com descrição do conteúdo de destino, preferência de tema persistida localmente e layout respeitando áreas seguras do celular;
- fallback de fontes locais do sistema na landing, sem requisição a Google Fonts nessa rota; confirmar a tipografia e a rede da página `/conhecer` em QA;
- app acessível na raiz definida para ele e leitor em `/leitura`;
- rotas antigas redirecionadas segundo a matriz aprovada;
- metadados específicos para landing, app e conteúdo editorial;
- atualização de scripts de exportação, service worker e verificadores que dependam das rotas atuais;
- QR de teste apontando para preview, identificado claramente como não definitivo.

**Proteção do repositório:** antes de editar, registrar os diffs locais existentes e combinar como o trabalho novo será integrado sem sobrescrever as alterações atuais. Não limpar, resetar ou descartar arquivos existentes para abrir espaço à implementação.

**Checkpoint de saída:** landing, app e leitor podem ser acessados diretamente no preview; o build de preview é reproduzível; as áreas públicas mapeadas continuam funcionando. O primeiro quadro oferece um atalho acessível até as opções; o texto completo continua disponível sem depender do quadro visual ativo; o visitante consegue rolar por teclado. Nenhuma mudança de DNS ou divulgação do domínio final nesta fase.

### CP5 — Verificação em preview

**Entregáveis de evidência:**

- acesso direto, atualização e navegação por todas as rotas principais;
- navegação da chamada pós-revelação para leituras mais longas e estudos, com retorno claro para a narrativa curta ou o leitor bíblico;
- amostra representativa de capítulos, planos e resumos, além da verificação estrutural de todos os capítulos gerados;
- redirects antigos testados, inclusive preservação de livro/capítulo e parâmetros relevantes;
- web na raiz mostrando a landing e app nativo abrindo na Home do app;
- teste em celular, navegador embutido de QR, conexão lenta, zoom, teclado e leitor de tela;
- contraste dos dois temas, preferência escolhida, transições durante a rolagem e comportamento com movimento reduzido;
- confirmar em mobile estreito (320–390 px) que “Ir direto às opções” cabe no primeiro quadro e leva ao destino sem exigir atravessar a narrativa; medir quantas telas/gestos separam a entrada da opção principal;
- teclado: focar a área principal e percorrer a narrativa com Page Down/Space/setas; conferir contorno de foco, sequência de títulos e continuidade do foco depois de seguir o atalho;
- leitor de tela: verificar que os dez quadros são apresentados uma vez, na ordem, tanto com animação quanto em leitura contínua; conferir nome e valor do progressbar sem repetição excessiva;
- comparar a altura/rolagem do palco e do conteúdo em Safari iOS e webview de QR quando barras do navegador entram/saem; validar safe areas superior e inferior;
- com cache limpo e rede lenta/bloqueio de terceiros, medir LCP/primeiro conteúdo útil e confirmar que a landing não solicita fontes externas; validar se a tipografia de fallback mantém legibilidade;
- após alterar tema e reabrir a página, confirmar que a preferência local é mantida; conferir o fallback se localStorage estiver bloqueado;
- service worker atualizado: primeiro acesso, visita antiga, atualização online, abertura de `/biblia` offline e rota inválida;
- inspeção de pedidos de rede para confirmar ausência de analytics, fontes remotas, pixels e chamadas não planejadas;
- confirmação de título, descrição, favicon/ícone, metadados sociais, sitemap e status de indexação;
- leitura pastoral final do que está realmente no preview.
- prova de leitura do panfleto em papel por pessoas com perfis diversos, incluindo alguém sem smartphone ou que não usa QR; confirmar que a mensagem essencial continua compreensível;
- se o formulário foi aprovado para esta fase, simular envio, recebimento, acesso restrito, resposta e exclusão de dados; confirmar que não há expectativa de atendimento imediato ou de emergência.

**Checkpoint de saída:** sem bloqueadores de navegação, direitos, conteúdo, acessibilidade ou privacidade; pendências menores têm responsável e plano. O preview não é produção e não autoriza a tiragem do panfleto.

### CP6 — Aprovação de produção e domínio

**Dependências:** CP5 aprovado; responsável e titular do domínio definidos; Registro.br consultado diretamente; DNS e HTTPS configurados.

**Gate de produção:** o responsável revisa a versão final no domínio conectado e decide publicar. Confirmar redirecionamentos, rotas antigas, política de rollback, identidade pública e canal para correções. Manter a URL técnica Vercel funcional ou redirecionada conforme o mapa aprovado.

**Checkpoint de saída:** domínio principal responde por HTTPS, raiz é a landing, `/biblia` abre o app, `/leitura` abre o fluxo aprovado e os links antigos prioritários chegam ao destino esperado. Guardar data, commit/build e evidência do deploy.

### CP7 — Prova impressa e distribuição

**Dependências:** CP6 aprovado e domínio estável.

**Entregáveis:** arte final simples do panfleto, conteúdo essencial legível sem o QR, endereço escrito além do QR, arquivo QR de alta qualidade, prova física e registro da validação em vários celulares/leitores. Fazer primeiro uma tiragem piloto pequena.

**Checkpoint de saída:** a mensagem do papel faz sentido sem acesso digital; o QR funciona no papel real, em iluminação comum, abre o domínio canônico e continua legível; o conteúdo impresso conversa com a primeira mensagem da página. Só então autorizar tiragem maior.

### CP8 — Manutenção e correção

**Entregáveis:** responsável por domínio/DNS, renovação, deploy, revisão pastoral de mudanças e correções urgentes; instrução de como substituir conteúdo desatualizado sem quebrar QR já distribuído; lembrete para revalidar links enquanto houver material em circulação.

**Checkpoint de saída:** o domínio não depende de uma conta pessoal sem sucessor, há acesso de recuperação, processo de publicação e procedimento para corrigir rapidamente erro doutrinário, técnico ou de direitos.

### Dependências e gates resumidos

```text
CP0 ─┬─> CP1 ─> CP2 ───────────┐
     └─> CP3 ──────────────────┼─> CP4 ─> CP5 ─> CP6 ─> CP7 ─> CP8
                               ┘
```

- **Não iniciar migração de rotas** antes de CP3.
- **Não publicar o texto final** antes de CP2.
- **Não apontar o domínio principal nem divulgar QR definitivo** antes de CP6.
- **Não imprimir em quantidade** antes de CP7.
- O registro do domínio pode ser feito antes se o responsável decidir, mas não deve ser tratado como sinal de que conteúdo, produto ou publicação já foram aprovados.

### Próximo checkpoint recomendado

Concluir CP0 com quatro decisões em uma conversa curta: quem será responsável pela iniciativa, se “Tem alguém que me ama?” é nome da página ou do projeto, o que a pessoa deve encontrar ao abrir `/leitura`, e quem fará a revisão pastoral. Em paralelo, CP3 pode completar o inventário técnico sem alterar código.

## 14. Perguntas para descobrir a página

As perguntas abaixo servem para entender a intenção antes de transformar a ideia em copy. Não são requisitos já decididos. As primeiras seis mudam mais diretamente a narrativa; as demais podem ser respondidas depois. É válido responder só algumas, em palavras soltas ou exemplos.

### A. Pessoa e contexto de chegada

1. Ao receber o panfleto, o que você imagina que a pessoa esteja pensando ou sentindo naquele momento? Curiosidade, solidão, busca espiritual, ceticismo, outro contexto?
2. O panfleto será entregue em que situação: abordagem individual, praça, evento ou deixado em local público? Isso muda o quanto a página deve explicar de onde veio a frase.
3. **Decidido:** a frase é uma afirmação direta, com ponto final: “Tem alguém que te ama.” Deve abrir tanto o panfleto quanto a landing.
4. Há grupos ou experiências que a página deve tratar com cuidado especial, para não soar como se presumisse a história de todos?

### B. Suspense e revelação

5. O que você quer que o visitante sinta antes de saber que a página fala de Jesus: curiosidade, acolhimento, identificação, esperança ou outra coisa?
6. Até onde quer levar o suspense: revelar Jesus no meio da página, no último terço ou apenas perto do encerramento?
7. Antes de revelar Jesus, a página pode mencionar que está apresentando uma resposta da Bíblia, ou a referência cristã só aparece junto da revelação?
8. **Decidido:** o visitante rola uma sequência de frases curtas; a frase atual sai com uma transição e a próxima aparece. O efeito não deve exigir toque nem travar a rolagem. O estilo e a duração do movimento ainda podem ser escolhidos depois.

### C. Tom e forma da mensagem

9. A voz deve ser mais próxima e conversada (“você”), contemplativa e poética, ou explicativa e direta?
10. As frases devem parecer uma voz falando com o visitante ou afirmações curtas que ele lê em silêncio?
11. Qual tamanho parece ideal: uma leitura de cerca de um minuto, dois a três minutos, ou uma explicação mais completa?
12. **Decidido:** o fluxo será de frases curtas em sequência, avançando com a rolagem; não será uma página longa de parágrafos. Pode haver conjuntos de frases por quadro para evitar excesso de telas.
13. A página deve falar em nome de uma comunidade (“nós”) ou evitar uma voz institucional e deixar a mensagem bíblica falar por si?

### D. Conteúdo do evangelho

14. Quais ideias são indispensáveis para você além da morte e ressurreição de Jesus e da salvação pela graça recebida pela fé?
15. Como prefere explicar “pecado” para alguém sem vocabulário cristão: como afastamento de Deus, quebra de relação, escolhas que ferem a Deus e ao próximo, ou uma combinação?
16. Que lugar a resposta pessoal deve ter? A página deve explicar a fé e deixar a pessoa pensar, convidar a confiar em Jesus, ou incluir uma oração opcional? Não incluir oração é uma escolha válida.
17. Há alguma ênfase denominacional ou tradição protestante específica que a revisão pastoral deve representar? Se não, quais pontos você quer manter comuns e centrais?
18. Você já tem referências bíblicas que gostaria de usar? Se não, elas podem ser propostas depois do rascunho e verificadas com o revisor.

### E. Encerramento e próximo passo

19. Depois de conhecer a história curta, o que seria um próximo passo realmente útil e sem pressão: conhecer mais em `/conhecer`, abrir a Bíblia online em `/leitura`, continuar para a Home do app em `/biblia`, ou simplesmente encerrar sem botão?
20. Se houver botão para abrir o app, qual texto deixa claro o destino e a diferença entre a landing e a experiência de leitura?
21. Você quer oferecer uma forma de contato ou identificação da organização responsável no rodapé? Quem seria responsável por responder? Se ainda não houver organização, o rodapé pode ficar limitado a autoria e referências aprovadas.

### G. Impresso, acesso e pedido de ajuda

26. O papel precisa conter o evangelho completo em poucas linhas, ou deve funcionar como um resumo substancial que convide a pessoa a ler mais no site? Como algumas pessoas podem não ter celular, o conteúdo essencial não deve ficar condicionado ao QR.
27. O impresso também deve revelar que a mensagem é sobre Jesus, ou você quer preservar o suspense no papel e no site? Se o impresso contar mais, a landing ainda pode guardar a revelação para mais adiante.
28. Decisão registrada: o formulário é voluntário para relatar uma situação ou pedir oração; a preferência inicial é permitir contato sobre o pedido, e a caixa “NÃO desejo receber contato” bloqueia qualquer resposta individual. Se marcada, o contato não será necessário; a pessoa pode enviar o pedido apenas para oração, sujeito à aprovação do fluxo de privacidade e operação.
29. Quem lerá e responderá aos pedidos, em quanto tempo, por qual canal e como será coberta a ausência dessa pessoa? Sem uma equipe e prazo definidos, o formulário pode criar uma expectativa que ninguém consegue atender.
30. A página deve receber pedidos de menores de idade ou relatos de abuso, violência e risco imediato? Definir limites e encaminhamentos antes de coletar qualquer relato. O formulário deve pedir o mínimo de dados, explicar quem os verá e por quanto tempo serão guardados.
31. Ao clicar em “Abrir a Bíblia online”, a pessoa deve ir ao leitor deste app em `/leitura` ou a uma fonte externa? A escolha depende do texto/licença disponíveis e de deixar claro que haverá navegação para outro ambiente.

### F. Tema, leitura e apresentação

22. O tema escuro deve ser o padrão sempre, seguir o tema do aparelho ou usar a escolha salva pelo visitante?
23. A alternância de tema deve ficar visível desde a abertura ou pode estar num controle discreto no topo/rodapé?
24. A frase inicial deve ocupar quase toda a primeira tela, ou prefere que a pessoa veja a frase e também um pequeno convite para rolar?
25. No fim da página, quer repetir a frase do panfleto com novo sentido ou encerrar com uma referência bíblica/convite curto?

### Respostas que destravam o primeiro rascunho

Para começar a escrever sem antecipar decisões técnicas, bastam: (a) contexto de entrega do panfleto e pessoa imaginada; (b) sensação desejada antes da revelação e posição aproximada da revelação; (c) tom e duração; (d) conteúdo que considera indispensável; (e) quanto do evangelho deve estar impresso e se o impresso também revela Jesus; (f) destino da Bíblia online. O formulário de ajuda pode ficar fora do primeiro rascunho até haver responsável, prazo de resposta e política de dados definidos.

## 15. Contexto local e implicações para o impresso

### O que os dados públicos dizem

- **Caçapava:** o Censo 2022 registrou 96.202 moradores e 40.075 domicílios; a média municipal foi de 2,86 moradores por domicílio. São dados do município inteiro, não um retrato de cada rua ou bairro. [Prefeitura de Caçapava — dados do Censo 2022](https://cacapava.sp.gov.br/noticias/geral/ibge-divulga-os-dados-do-censo-2022-em-cacapava).
- **São José dos Campos:** a Prefeitura informa 697.054 moradores no Censo 2022 e uma distribuição municipal por idade de 18% entre 0–14 anos, 21% entre 15–29, 49% entre 30–64 e 12% com 65 anos ou mais. Para a região leste, publica 181.463 moradores. A tabela territorial diferencia o setor mais amplo de Eugênio de Melo (20.613 pessoas) dos subsetores: “Eugênio de Melo” (2.073) e “Galo Branco” (14.043). Esses nomes e limites seguem a divisão censitária da própria página; não devem ser tratados como uma descrição de personalidade ou condição social dos moradores. [Prefeitura de São José dos Campos — população](https://sjc.sp.gov.br/servicos/governanca/populacao/).
- **Celular e internet:** a PNAD Contínua TIC 2024 mede acesso à internet e posse pessoal de celular com detalhamento para Brasil, grandes regiões e unidades da Federação — não para esses bairros. O dado nacional de que 88,9% das pessoas com 10 anos ou mais tinham celular não autoriza concluir que todos os destinatários locais tenham aparelho, dados móveis, bateria, familiaridade com QR ou desejo de usá-lo. [IBGE — PNAD Contínua TIC 2024](https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html).

Essas fontes não permitem caracterizar religião, renda, familiaridade com igreja, estado emocional ou opiniões dos moradores dos bairros citados. Evitar escrever como se conhecêssemos a vida de quem recebe o papel; tratar a diversidade como requisito de comunicação.

### Decisões de conteúdo para papel e tela

1. **O panfleto deve entregar valor sem QR.** Planejar uma versão impressa que comunique ao menos a ideia cristã central em texto breve e legível, junto do endereço escrito. O QR aprofunda a conversa; não é a única porta para compreender a mensagem.
2. **Separar o ritmo dos meios.** A página pode construir a curiosidade e revelar Jesus mais adiante. O impresso pode ser mais explícito ou resumido para continuar útil sem celular. Escolher conscientemente se o papel também nomeia Jesus e quanta explicação do evangelho cabe nele.
3. **Não confundir acesso com posse de aparelho.** Mesmo alguém com smartphone pode estar sem internet, dados, bateria, tempo ou conforto para escanear um código. O endereço legível e a mensagem autossuficiente atendem também esses casos.
4. **Testar compreensão, não supor perfil.** Pedir a leitores com familiaridades diferentes com a Bíblia que leiam o papel e expliquem o que entenderam; incluir uma pessoa que não use QR. Ajustar corpo de letra, contraste, comprimento e termos cristãos conforme a leitura real.

### Formulário de ajuda e Bíblia online: escopo novo a validar

A proposta de um formulário altera a premissa anterior de uma landing sem coleta de dados. Antes de publicar essa oferta, definir que tipos de ajuda serão aceitos, pessoa/equipe que lê as mensagens, canal e prazo de resposta, retenção e exclusão, aviso de privacidade, campos realmente necessários e procedimento para pedidos de menores ou relatos de risco. Não sugerir que o formulário seja canal de emergência; encaminhamentos locais confiáveis precisam ser definidos e revisados antes de qualquer instrução desse tipo. Até haver operação real, a página não deve prometer resposta pastoral ou ajuda prática.

O botão **“Abrir a Bíblia online”** é um próximo passo distinto e pode ser opcional. Definir se abre `/leitura` neste app ou uma fonte externa; confirmar antes a tradução e os direitos de exibição, além de informar claramente o destino. O estado atual dos direitos da cópia ACF no app continua pendente conforme `docs/LICENCA-TEXTO-ACF.md`.

## 16. Pesquisa comparativa de iniciativas evangelísticas

**Objetivo da comparação:** identificar padrões reais de distribuição impressa, narrativa de curiosidade, explicação do evangelho, continuidade digital e acompanhamento. Os números abaixo vêm das próprias organizações, salvo quando indicado; são métricas de alcance, participação, mensagens ou respostas auto-relatadas e não avaliações independentes de conversão ou discipulado duradouro.

### Casos pesquisados

| Iniciativa e responsável | Modelo observado e dado publicado | O que pode informar este projeto | Limite da comparação |
|---|---|---|---|
| **“Já Encontrei” — Cru Brasil / Bill Bright** | A história institucional da Cru Brasil descreve campanha brasileira dos anos 1980 que usou o slogan “Já Encontrei” para despertar curiosidade e revelou depois: “Já encontrei uma nova vida em Jesus Cristo”. A mesma página afirma que, atualmente, mais de 1 milhão de folhetos das 4 Leis são utilizados por ano em parceria com igrejas e organizações brasileiras. [História da Cru Brasil](https://www.cru.org/br/pt/about/vision.html) | É o paralelo mais próximo à ideia de começar com uma frase intrigante e revelar Jesus posteriormente. A campanha sustenta que esse recurso já foi usado no contexto brasileiro; sugere que a revelação deve cumprir claramente a promessa da frase. | A página institucional não apresenta metodologia de avaliação, amostra de público ou comparação que demonstre que o suspense foi mais eficaz. A campanha era multicanal e de outra época, não uma landing isolada. Os números de folhetos indicam distribuição/alcance, não leitura ou resposta. |
| **Quatro Leis Espirituais / GodTools — Cru e Bill Bright** | A sequência apresenta: Deus ama; o pecado separa; Jesus é a provisão de Deus; cada pessoa responde recebendo Cristo. A Cru registra que o livreto foi traduzido para mais de 200 idiomas e que mais de 2,5 bilhões de cópias foram distribuídas globalmente; também adaptou o material para formatos digitais como GodTools e The FOUR. [História do livreto](https://www.cru.org/us/en/about/history/innovation-stories/four-spiritual-laws-booklet.html) · [história institucional da Cru](https://www.cru.org/us/en/about/history.html) | Oferece uma espinha dorsal editorial clara para o verso do panfleto e para a parte final da página: amor, problema, ação de Jesus e resposta. O princípio mais forte para este caso é o papel complementar: impresso compreensível por si só e versão digital que amplia a conversa. | Distribuição acumulada é uma métrica de produção/disseminação, não de compreensão, decisão ou permanência na fé. A fórmula pode soar mecânica se for copiada literalmente; algumas expressões do livreto (por exemplo, “plano maravilhoso para sua vida”) podem gerar expectativa de prosperidade e precisam ser contextualizadas segundo o brief do usuário. |
| **Impacto Esperança — Igreja Adventista do Sétimo Dia (América do Sul)** | Campanha denominacional de entrega de livros impressos em vários países e disponibilização digital. Em 2026, a organização afirma que, desde 2007, distribuiu quase 400 milhões de exemplares; o material e a página apresentam o impresso como algo que abre conversas e continua em versão digital. [Impacto Esperança 2026](https://noticias.adventistas.org/pt/impacto-esperanca-2026-une-literatura-e-a-missao-de-apresentar-jesus/) | É um modelo local/regional forte para levar um conteúdo substancial no papel, sem tornar o QR obrigatório, e oferecer uma continuação digital. Reforça a recomendação de entregar um livreto ou verso de panfleto que conserve a mensagem essencial offline. | A organização divulga total de exemplares e intenção de missão, não uma avaliação causal de quantos leitores entenderam, visitaram o site ou adotaram a fé. É uma tradição protestante específica; doutrina e identidade do projeto devem passar por revisão compatível com a tradição que o usuário escolher. |
| **Peace With God / Search for Jesus — Billy Graham Evangelistic Association (BGEA)** | A página Peace With God organiza a explicação em etapas (propósito, problema, cruz e resposta), oferece perguntas adicionais e opção de conversar. O braço Search for Jesus combina websites, mensagens e voluntários treinados. No relatório anual de 2025, a BGEA relata 6,8 milhões de visitantes, mais de 131 mil pessoas que forneceram contato após indicação de decisão/rededicação, outras 501 mil indicações sem contato, e 1.907 voluntários que responderam 401.905 consultas, gerando 90.947 conversas sobre o evangelho. [Peace With God](https://peacewithgod.net/steps/) · [relatório anual BGEA 2025](https://static.billygraham.org/cms-uploads/2026/4/24744_2025_AR_Low_Res_DIGITAL_2386cb6dca.pdf) | Demonstra uma boa distinção entre leitura autônoma, perguntas e acompanhamento por pessoas. Mostra a dimensão operacional que existe por trás de um formulário ou chat: equipe internacional treinada, volume de mensagens e material de discipulado. A arquitetura de etapas pode orientar a explicação da landing. | A BGEA tem escala, infraestrutura e voluntários em dezenas de países; não é razoável supor que uma iniciativa local de uma pessoa consiga oferecer esse serviço. “Visitante”, “indicação” e “decisão” são categorias definidas pela organização, não medidas independentes de conversão ou maturidade cristã. A taxa de contato voluntário e qualidade do seguimento não deve ser comparada diretamente sem os denominadores completos. |
| **Alpha — rede de igrejas e facilitadores; iniciado em Holy Trinity Brompton e reposicionado por Nicky Gumbel para não frequentadores** | Curso em encontros, baseado em hospitalidade, conversa e perguntas abertas, com continuidade depois do curso. A organização reporta para 2025 2,8 milhões de participantes, 105 mil cursos em 158 países; dados de opinião apresentados são de 2.000 respostas via Alpha App, onde 55% dos que não haviam feito compromisso pessoal com Jesus disseram ter feito um após o curso. [História do Alpha em Portugal](https://portugal.alpha.org/about/) · [Impacto Alpha](https://impact.alpha.org/) · [continuidade após Alpha](https://alpha.org/catholic-context/after-alpha) | Não é um modelo para copiar como landing curta, mas mostra o que pode acontecer depois de uma primeira exposição: perguntas são acolhidas, pessoas conversam em grupo e há próximos passos relacionais. Recomenda que o site não trate um clique, oração ou formulário como conclusão do caminho; a pessoa precisa poder continuar aprendendo sem pressão. | Os números e respostas são publicados pela própria organização, e a amostra de 2.000 respostas não equivale a avaliação controlada. Alpha é usado em tradições diferentes, inclusive católicas; materiais e ênfases variam e exigem análise doutrinária própria. |
| **Ray Comfort / Living Waters** | O Million Dollar Bill transforma uma peça impressa em gancho visual e apresenta pecado, morte de Jesus, ressurreição, arrependimento e fé, encaminhando a leitura da Bíblia e participação numa igreja. Living Waters afirma que quase 50 milhões de unidades dessa família de folhetos foram distribuídas e, para uma ação de Copa, que 2 milhões foram distribuídos. [Folheto e texto](https://livingwaters.com/store/gospel-tracts/million-dollar-bill/) · [campanha](https://livingwaters.com/worldcup/) | É referência para um artefato que chama atenção, explica a mensagem no próprio papel e inclui um caminho de continuidade. | O enquadramento centrado em morte, juízo e confronto é diferente do tom acolhedor e sem pressão pedido aqui. Não recomendo importar a abordagem de conversação ou a retórica de temor; os dados de tiragem não demonstram eficácia. Os depoimentos do site são testemunhos selecionados, não pesquisa representativa. |
| **John Piper / Desiring God (evangelismo pessoal)** | Em entrevista, Piper descreve conversas curtas na rua: apresenta-se, oferece oração, pede permissão para compartilhar a “boa notícia” e resume o evangelho; diz não haver fórmula fixa entre conversa imediata e relação mais longa. [Entrevista](https://www.desiringgod.org/interviews/make-your-life-count-q-and-a-with-john-piper) | Apoia uma postura interpessoal respeitosa: não presumir que a pessoa quer uma conversa longa, perguntar antes de aprofundar e deixar o visitante escolher seu próximo passo. | Trata-se de conselho e experiência pessoal, não de estudo comparativo. O tom teológico particular de Piper não deve substituir a revisão da tradição protestante que o projeto decidir representar. |

### O que é evidência — e o que não é

- **Existência e escala:** há evidência publicada de campanhas nacionais/internacionais, milhões de impressos, visitas e conversas; isso confirma que os formatos são praticados e podem ser operados em escala.
- **Compreensão:** os materiais mostram estruturas e linguagem usadas. Números de distribuição ou cliques não mostram que o destinatário entendeu o conteúdo.
- **Mudança religiosa duradoura:** as métricas de “decisões” e compromissos vêm majoritariamente de autodeclaração e relatórios institucionais. Não usar esses totais como previsão de resultados para este projeto.
- **Relação entre contato digital e discipulado:** uma análise jornalística da *Christianity Today* sobre dados BGEA de 2014 registrou a preocupação de especialistas com a diferença entre clicar numa oração e ser acompanhado por uma comunidade, e informou que apenas uma fração dos indicados entrava em atividades de discipulado. É uma análise antiga, baseada em dados de outra época, mas serve como alerta conceitual: uma conversão declarada no formulário não é medida de formação ou vínculo. [Christianity Today — Do Digital Decisions Disciple?](https://www.christianitytoday.com/2015/02/do-digital-decisions-disciple/).
- **Suspense evangelístico:** Cru Brasil documenta o uso histórico de uma campanha de curiosidade seguida de revelação, mas as fontes encontradas não comparam suspense contra uma apresentação direta nem mostram que a primeira abordagem seja superior. Usar o suspense como escolha narrativa do autor, não como técnica comprovada de conversão.

### Recomendações para este projeto, com base nos casos

1. **Panfleto em duas camadas:** manter a frente minimalista — “Tem alguém que te ama.” — e usar o verso para uma explicação curta, autossuficiente e explícita sobre o amor de Deus em Jesus, com referências e endereço legível. A frase chama atenção; o verso não exige celular. O QR conduz à história completa, não ao único acesso à mensagem.
2. **Landing em narrativa breve, sem isca enganosa:** fazer duas ou três seções de abertura sobre ser amado, visto e acolhido sem afirmar conhecer a vida da pessoa; então dizer que a resposta cristã está em Deus e revelar Jesus. Depois, explicar sua vida/acolhimento, morte e ressurreição, pecado e graça/fé. Seguindo a preferência mais recente, a hipótese agora é revelar Jesus depois de dedicar mais tempo ao amor e ao acolhimento, por volta de 55–60% da sequência; testar com leitores para garantir que não pareça uma isca. Não há dado comparativo que determine o ponto ideal; validar com leitores.
3. **Promessa precisa:** ao falar do amor de Jesus, não insinuar romance humano, uma pessoa invisível observando o visitante, ausência de sofrimento ou solução imediata. Dizer que a mensagem é uma afirmação cristã baseada na Bíblia e explicar termos como pecado, graça e salvação.
4. **Próximo passo simples no lançamento inicial:** “Ler a Bíblia” para referências aprovadas, com destino identificado. Antes de apontar para `/leitura`, definir a tradução e confirmar os direitos da cópia do app. Se ainda não houver texto autorizado, mostrar as referências e um link para uma fonte licenciada/gerida pelo titular, após confirmar o destino.
5. **Formulário de oração/relato previsto, envio condicionado à operação:** definir quem recebe, prazo e cobertura; coletar só o necessário; informar finalidade e retenção; restringir acesso e não prometer retorno até haver operação real. A LGPD classifica convicção religiosa, saúde e vida sexual como dados sensíveis. Validar base legal e aviso antes da coleta. Para crianças e adolescentes, avaliar o melhor interesse e o fluxo aplicável. [LGPD, arts. 5º e 11](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) · [ANPD sobre crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).
6. **Sucesso mensurável sem contar “conversões”:** no piloto, contar exemplares distribuídos, verificar QR/endereço, testar leitura em aparelhos e perguntar a leitores voluntários o que entenderam. Tratar compreensão como feedback qualitativo. Não registrar religião, decisão ou problema pessoal para medir campanha. Métricas de acesso agregadas só devem ser adotadas se tiverem finalidade definida e privacidade revisada.
7. **Não copiar o formato inteiro de uma organização:** aproveitar do Cru a estrutura e a curiosidade; do Impacto Esperança a autonomia do impresso; da BGEA a separação entre conteúdo, perguntas e acompanhamento; do Alpha a continuidade relacional. Manter a voz e o conteúdo sob revisão de uma liderança protestante escolhida pelo responsável.

### Decisões que a pesquisa pode informar, mas não fechar

- **Caminho recomendado para o papel:** frente de suspense + verso com mensagem explícita completa em versão curta. Confirmar se o usuário aceita impressão frente e verso e que Jesus seja nomeado no verso.
- **Caminho recomendado para a landing:** dedicar cinco quadros ao amor antes de revelar Deus em Jesus no sexto; continuar contando a história de Jesus em quatro quadros e só então oferecer escolha de tema. Validar com leitores que não frequentam igreja.
- **Formulário:** o fluxo geral está definido; o envio permanece condicionado a pessoa/equipe responsável, prazo e protocolo de resposta, política de dados e revisão de privacidade.
- **Leitor bíblico:** intenção recomendada é abrir `/leitura`, mas tradução, direitos e seleção inicial ainda dependem de decisão e validação local.
- **Responsabilidade, nome e revisão:** pesquisa de outros projetos não determina quem será o dono do domínio, a organização apresentada, a igreja que revisa ou a tradição doutrinária específica. São decisões do proprietário do projeto.
- **Tamanho final do texto:** nenhuma fonte pesquisada comprova a extensão ideal para uma leitura de celular e um panfleto de rua nessa cidade. Definir um rascunho e testar em voz alta e com leitores reais.

## 17. Roteiro recomendado para o primeiro teste de conteúdo

Esta é uma arquitetura editorial para produzir um rascunho, não uma redação aprovada. Ela respeita o desejo de dedicar mais tempo a falar de amor e de aspectos bons da mensagem antes de revelar Jesus, e de continuar contando sobre ele depois da revelação. A revelação um pouco depois da metade é uma hipótese de equilíbrio: constrói expectativa sem prolongar o suspense até esconder o assunto da página.

### Landing: sequência de mensagens

| Parte | Função narrativa | Conteúdo a escrever | Transição/critério |
|---|---|---|---|
| 1. Chegada | Repetir a mesma abertura do impresso e acolher a curiosidade. | Começar literalmente com a afirmação “Tem alguém que te ama.”, com ponto final. Depois, um convite simples para continuar a conversa. Não presumir solidão, trauma, abandono ou busca religiosa. | Em poucos segundos, fica claro que a página vai desenvolver a afirmação; sem “clique para revelar” ou espera obrigatória. |
| 2. Um amor que acolhe | Falar de coisas boas sem reduzir amor a elogio genérico. | Mostrar, sem ainda dar o nome de Jesus, que o amor apresentado acolhe, se aproxima, serve e não exige que a pessoa esconda suas falhas. | Tom de convite e esperança; não afirmar que a página conhece a história pessoal de quem lê. |
| 3. Valor e esperança | Apresentar dignidade, pertencimento e esperança como temas da mensagem cristã. | Frases curtas sobre valor que não depende de desempenho, cuidado em momentos difíceis e esperança que pode coexistir com sofrimento. | Evitar tom de romance, admirador secreto, promessa de cura, sucesso ou solução imediata. |
| 4. Transição | Preparar a identificação da fonte e tornar transparente que a narrativa tem base cristã. | Dizer que a resposta vem da fé cristã e da Bíblia; preparar a revelação com linguagem natural, sem suspense enganoso. | O visitante pode parar ou avançar sem interação obrigatória. |
| 5. Revelação | Nomear a origem do amor de forma direta. | Dizer que a resposta apresentada pela fé cristã é Deus, e que a Bíblia apresenta esse amor em Jesus Cristo. | Hipótese para o teste: revelar um pouco depois da metade (cerca de 55–60% do fluxo), mantendo o conjunto curto. Validar com leitores. |
| 6. Quem é Jesus | Continuar a história agora que a identidade foi revelada. | Mostrar ações e palavras de Jesus: ele acolheu pessoas, ensinou, serviu e se aproximou de quem era desprezado. Depois explicar a cruz e a ressurreição. | Usar referências bíblicas no contexto e indicar quando a página resume a narrativa bíblica. |
| 7. O que essa história significa | Explicar o evangelho de modo breve, sem abandonar o tom de frases curtas. | Apresentar pecado como ruptura com Deus e mal que praticamos; dizer que Jesus morreu pelos pecadores e ressuscitou. Explicar graça como presente que não se compra e fé como confiança/resposta, não mérito. | Revisão pastoral confirma a formulação protestante. Não prometer prosperidade, cura ou que dificuldades desaparecem. |
| 8. Aprofundar | Depois da narrativa, convidar a conhecer mais sobre esse amor. | Chamada “Quer conhecer mais sobre esse amor?” para `/conhecer`, com acesso direto alternativo a `/leitura`. | O aprofundamento é opcional; a narrativa principal continua curta. |
| 9. Escolher um assunto | No hub `/conhecer`, oferecer a seleção interativa dos temas que a pessoa quer explorar. | Perguntar “Tem algum assunto que você gostaria de explorar?” e oferecer rótulos neutros. Ao escolher, abrir a página do tema com opção de formulário e saída clara para a leitura relacionada. | A seleção não diagnostica nem obriga a compartilhar dados; formulário e leitura são escolhas distintas. |
| 10. Formulário opcional | Permitir compartilhar um relato ou pedido de oração e, se desejar, receber contato. | Na página do tema, abrir formulário voluntário e mostrar “Prefiro ler sem preencher”, que leva ao estudo relacionado. | Só ativar envio quando responsável, prazo de resposta, privacidade, segurança e protocolo estiverem definidos; não apresentar como emergência ou terapia. |

**Extensão experimental:** a implementação inicial tem dez quadros, uma ideia por quadro e cinco quadros de acolhimento antes de revelar Deus em Jesus no sexto; quatro quadros continuam a narrativa. A chamada para `/conhecer` e o acesso a `/leitura` vêm após essa sequência; o seletor de temas fica dentro do hub, fora da narrativa animada. É um rascunho editorial, não um limite validado. Medir tempo e compreensão com leitores e cortar redundâncias sem remover o núcleo do evangelho. O visitante controla a rolagem; não há avanço automático nem scroll-jacking.

### Continuação: leituras longas e estudos introdutórios

Depois da história curta, a chamada **“Quer conhecer mais sobre esse amor?”** abre `/conhecer`, um hub simples com caminhos opcionais. O hub oferece as leituras introdutórias abaixo e, em uma seção separada, a seleção interativa de temas. Ao escolher um tema, a pessoa chega à página dele, onde pode preencher o formulário voluntário ou seguir diretamente para a leitura temática:

1. **Conheça Jesus:** uma leitura mais extensa sobre quem ele é, como acolheu e ensinou, e por que sua morte e ressurreição são centrais.
2. **O que é a Bíblia?:** explicação para quem nunca leu, sobre o que ela reúne, como encontrar livros e capítulos e como ler um trecho em contexto.
3. **A história da salvação:** narrativa bíblica em criação, ruptura pelo pecado, promessa, Jesus, cruz e ressurreição, e esperança de restauração; revisar a formulação com a tradição protestante escolhida.
4. **Estudos simples para começar:** sequência curta, por exemplo quatro leituras guiadas: quem é Jesus; por que morreu e ressuscitou; o que significam graça e fé; como começar a ler a Bíblia.
5. **Leituras por assunto:** os doze temas listados na seção 18, com escolha opcional que abre o estudo correspondente. A lista não faz parte da sequência principal e a pessoa pode ignorá-la.

Cada estudo pode ter uma passagem principal, explicação curta e perguntas de reflexão, sem cadastro. Estes materiais ainda precisam ser redigidos e revisados; não substituem a Bíblia nem devem reproduzir uma tradução sem autorização. O catálogo de doze temas é planejado, mas cada link só aparece quando o respectivo estudo estiver pronto. Para o primeiro lançamento, decidir se todos os estudos por assunto estarão completos ou se o hub começa com os temas revisados até então, sem mostrar opções inativas.

### Comportamento da transição animada

- A frase ou pequeno conjunto de frases fica centralizado num quadro de leitura; ao rolar, o texto atual pode desaparecer com um fade/deslocamento discreto e o próximo entrar de forma equivalente.
- Evitar uma troca brusca por tela inteira em que a rolagem pareça travada. A página deve responder ao ritmo da pessoa, inclusive se ela rolar rápido ou voltar para reler.
- Manter todas as frases presentes na ordem lógica do documento. A animação só muda a apresentação visual; não deve esconder ou remover conteúdo para leitores de tela, busca, copiar/colar ou navegação por teclado.
- Respeitar a preferência de movimento reduzido do aparelho: nesse caso, remover fade e deslocamentos e mostrar uma sequência clara de frases com a mesma ordem e conteúdo.
- O efeito deve ser leve, curto, sem loop, parallax intenso, som, espera obrigatória ou dependência de interação por toque. Se a animação falhar, o texto continua legível.
- O primeiro quadro começa com a frase exata “Tem alguém que te ama.”; o tema escuro pode ser padrão, mas a alternância para fundo claro permanece disponível e acessível.

### Panfleto: frente e verso

- **Frente:** papel claro e impressão preta; abrir com a frase exata “Tem alguém que te ama.”, centralizada, seguida de QR code e endereço escrito. A landing repete a mesma frase no início.
- **Verso:** mensagem curta que se sustenta sem internet: nomeia Jesus, resume sua morte e ressurreição e oferece referências bíblicas. O QR e o endereço convidam a conhecer a história completa. O impresso pode revelar Jesus antes do site, desde que essa diferença esteja clara no planejamento e não pareça um erro ou contradição.
- **Sem presumir tamanho ou custo:** preparar a primeira arte em uma folha A6 ou A5 frente e verso e comparar legibilidade e preço local de impressão antes da tiragem. O QR não deve reduzir o corpo do texto nem substituir o endereço legível.
- **Direitos:** usar referências sem transcrição longa enquanto tradução e autorização não forem confirmadas. A revisão final precisa checar as referências e a consistência entre o papel e a página.

### Piloto de compreensão antes de implementar

1. Fazer duas versões textuais do verso: uma que nomeia Jesus logo no resumo e outra que guarda a revelação para a página, mantendo em ambas a mensagem essencial. Comparar clareza e expectativa — não alegar que isso mede conversão.
2. Ler a landing para 5–8 pessoas voluntárias com níveis diferentes de familiaridade com Bíblia; incluir alguém que não costuma usar QR. Amostra pequena serve para encontrar confusões, não para representar a população de Caçapava ou São José dos Campos.
3. Depois da leitura, perguntar sem induzir resposta: “Quem a página diz que ama?”, “O que aconteceu com Jesus?”, “O que significa receber esse amor segundo a página?” e “O que você esperava encontrar depois de ler ‘Tem alguém que te ama.’?”. Registrar pontos de confusão sem coletar religião, telefone ou história pessoal.
4. O revisor pastoral confirma conteúdo e referências; o autor decide o ponto final da revelação; a pessoa responsável pelo impresso confirma legibilidade em papel e destino do QR.

**Critério de saída para CP1:** em até 8–10 quadros curtos, leitores conseguem identificar que a mensagem é cristã, dizer que se refere a Deus em Jesus, resumir morte e ressurreição e explicar o próximo passo opcional com suas próprias palavras. A seleção de tema deve ser entendida como convite a leitura, nunca como diagnóstico, pedido de ajuda ou registro privado. Se confundirem com promessa romântica, mensagem dirigida por uma pessoa específica, prosperidade ou garantia de solução imediata, revisar antes de avançar.

### Decisões a registrar ao encerrar CP0

1. Aprovar ou alterar a recomendação de frente minimalista e verso com evangelho resumido, nomeando Jesus.
2. Escolher qual pessoa ou organização assume autoria pública, domínio e manutenção.
3. Escolher quem fará a revisão bíblica/pastoral e qual ênfase protestante essa revisão representa.
4. Aprovar o hub `/conhecer` com leituras sobre Jesus, a Bíblia e a história da salvação; decidir se os estudos introdutórios também entram no primeiro lançamento. Manter `/leitura` como acesso direto à Bíblia e condicionar o formulário de ajuda a uma equipe real.
5. Selecionar uma tradução para as referências e decidir se `/leitura` ou uma fonte externa licenciada será o destino.

As respostas podem ser registradas como **aprovado**, **alterar** ou **ainda sem decisão**. Apenas os itens que definem escopo e responsabilidade precisam bloquear o início da redação; o domínio ainda bloqueia a impressão definitiva.

## 18. Etapa de escolha de temas e pesquisa sobre o 30 Semanas

### O que foi possível verificar

- A Igreja da Cidade apresenta o 30 Semanas como um programa próprio de 30 semanas, com conteúdo/ministrações por tema, grupos de apoio, escrita de memórias e reconhecimento/reparação de erros. A página institucional descreve grupos de apoio separados por gênero e com até 15 participantes; essa descrição pertence ao formato do programa, não deve ser copiada como desenho da landing. [Página oficial do 30 Semanas da Igreja da Cidade](https://igrejadacidade.net/30semanas/?amp=1)
- A programação pública da Igreja da Cidade consultada em 20/10/2026 lista o 30 Semanas online às quintas às 20h e um ciclo presencial a partir de 10/04/2026; como datas de ciclos e horários mudam, confirmar diretamente com a igreja antes de qualquer encaminhamento público. [Programação da Igreja da Cidade](https://igrejadacidade.org.br/)
- A página oficial do programa informa que ele chegou à Igreja da Cidade em 2005, inicialmente como Celebrando a Recuperação, e descreve oito decisões pessoais e quatro pilares de funcionamento. [30 Semanas — sobre e funcionamento](https://igrejadacidade.net/30semanas/?amp=1)
- Um material público do próprio ministério enumera áreas de recuperação como compulsão, sexualidade, codependência, ira, baixa autoestima, dependência química, procrastinação, ansiedade, rejeição, religiosidade, luto/perdas e pânico/medo/depressão. Isso documenta a pauta pública do programa, não a prevalência desses temas no município nem eficácia clínica. [Material público do 30 Semanas](https://igrejadacidade.net/wp-content/uploads/2024/08/LAB-30-SEMANAS.pdf)
- A página institucional afirma que o programa se inspira no Celebrate Recovery e descreve seu foco em vícios, traumas, maus hábitos e restauração de relacionamentos. Tratar essa descrição como apresentação da própria organização. [30 Semanas — Igreja da Cidade](https://igrejadacidade.net/30semanas/?amp=1) · [Conferência 30 Semanas](https://igrejadacidade.net/conferencia-30-semanas/)

### Como aproveitar a pesquisa sem copiar o programa

O exemplo local confirma que uma jornada cristã de apoio pode organizar assuntos e próximos passos em torno de relações, sofrimento e hábitos. Para esta landing, o escopo é muito menor: a pessoa lê uma narrativa evangelística curta, escolhe voluntariamente um assunto e recebe uma leitura introdutória. Não reproduzir as 30 semanas, os grupos, os exercícios de memória, a linguagem de cura/libertação ou as categorias proprietárias como se fossem conteúdo do projeto. Não apresentar o site como parceiro, extensão ou encaminhamento oficial da Igreja da Cidade sem autorização explícita.

“Paternidade” pede uma decisão editorial específica. O programa local usa a ideia de paternidade de Deus e também menciona orfandade/abandono; na landing, a expressão pode ser confundida com ser pai ou com relação com o pai biológico. Recomenda-se separar, se houver conteúdo para cada um: **relação com meu pai/minha família**, **ser pai ou mãe**, e **o que a Bíblia quer dizer ao chamar Deus de Pai**. Nenhum botão deve presumir que a experiência familiar da pessoa é negativa.

### Catálogo temático adotado como base

O usuário aprovou aproveitar a lista de assuntos apresentada publicamente pelo 30 Semanas como ponto de partida editorial. Vamos preservar os doze campos temáticos da lista consultada e adaptar seus rótulos para linguagem simples e não estigmatizante. Isso não significa copiar o programa, seus materiais, exercícios ou interpretações; cada estudo deste projeto será redigido e revisado de forma independente.

| Campo temático citado pelo 30 Semanas | Rótulo provisório para o visitante | Cuidado editorial |
|---|---|---|
| Compulsão | Hábitos e impulsos difíceis de controlar | Não diagnosticar nem declarar que todo hábito é vício. |
| Sexualidade | Sexualidade e vida afetiva | Não usar “distorcida” como rótulo de pessoas; explicar a perspectiva bíblica com respeito e revisão pastoral. |
| Codependência | Relacionamentos e limites | Evitar autodiagnóstico e explicações simplistas de dinâmicas relacionais. |
| Ira | Raiva e conflitos | Não normalizar violência nem recomendar confronto inseguro. |
| Baixa autoestima | Valor pessoal e autoimagem | Não sugerir que versículos substituem cuidado psicológico. |
| Dependência química | Uso de álcool e outras drogas | Não chamar dependência de falha moral; incluir orientação para buscar apoio qualificado quando necessário. |
| Procrastinação | Adiamento e dificuldade de começar | Evitar presumir preguiça ou causa única. |
| Ansiedade | Ansiedade e preocupação | Distinguir reflexão bíblica de diagnóstico ou tratamento. |
| Rejeição | Rejeição e pertencimento | Não pressupor que toda pessoa vive abandono. |
| Religiosidade | Fé, dúvidas e experiências religiosas | Não ridicularizar tradições nem pressupor que a pessoa tenha fé cristã. |
| Luto/perdas | Luto e perdas | Evitar frases feitas, pressa para “superar” ou promessas de fim da dor. |
| Pânico/medo/depressão | Medo, pânico e sofrimento emocional | São experiências distintas; escrever com cuidado e orientar a procurar ajuda adequada sem oferecer diagnóstico. |

Os doze campos ficam aprovados como **catálogo de conteúdo a planejar**, não como doze etapas extras da narrativa. A etapa interativa pode apresentar os doze rótulos como links simples após a história; cada link só fica ativo/publicado quando houver uma página temática revisada. “Relação com meu pai”, “ser pai/mãe” e “o que a Bíblia quer dizer ao chamar Deus de Pai” são ideias adicionais do projeto, não itens dessa lista. Devem ser avaliadas separadamente e não presumir uma experiência familiar negativa.

Preferir a pergunta **“Tem algum assunto que você gostaria de explorar?”** a “Com qual problema você se identifica?”. Os rótulos são caminhos para leituras bíblicas, não diagnósticos nem afirmações sobre quais problemas são mais frequentes entre moradores locais. “Prefiro continuar sem escolher” continua disponível.

### Comportamento recomendado

- Colocar a escolha no hub `/conhecer`, depois da narrativa e da chamada “Quer conhecer mais sobre esse amor?”. Assim, a página principal não usa dores pessoais para criar suspense nem sugere que a escolha é necessária para receber o amor apresentado.
- Usar links textuais simples com os doze rótulos, sem imagens, pontuação, resultados ou hierarquia de gravidade; cada link abre a página do tema, onde há o formulário opcional e a saída para ler. A pessoa pode voltar ao catálogo. A seleção não é um questionário nem exige marcar várias respostas.
- Cada escolha abre `/conhecer/temas/:tema`, com o formulário opcional no topo e o botão “Prefiro ler sobre este tema” levando a `/conhecer/temas/:tema/leitura`; permitir voltar e trocar de assunto; incluir navegação por teclado e leitor de tela.
- A escolha do tema conduz à página correspondente; não criar perfil nem evento analítico. Se o formulário for enviado, o tema escolhido acompanha o pedido e isso deve estar explicado no aviso de privacidade. Revisar também os logs técnicos do site e do provedor; não prometer ausência total de registros.
- Cada página temática pode trazer uma nota acolhedora sem presumir que o leitor vive aquela situação, reflexão bíblica com referências, explicação honesta do que o texto diz e do que não promete e próximo passo opcional.
- Para luto, medo, abuso, dependência ou depressão, evitar frases que minimizem a dor, culpem a pessoa ou afirmem que oração substitui cuidado profissional. Não usar a interface para diagnóstico ou aconselhamento clínico.
- O formulário deve explicar quem recebe e lê as mensagens, a finalidade, o prazo esperado de resposta, por quanto tempo os dados serão guardados, como pedir acesso/exclusão e como falar com o responsável. Pedidos de oração podem revelar convicção religiosa; relatos podem revelar dados de saúde e vida sexual, categorias sensíveis na LGPD. Definir base legal, aviso de privacidade e segurança antes de coletar. [LGPD, arts. 5º e 11](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- Se o projeto quiser indicar apoio pastoral, psicológico ou comunitário, verificar disponibilidade, público atendido, segurança e consentimento com a organização responsável. Pesquisa pública não estabelece parceria com a Igreja da Cidade nem confirma que o ciclo atual aceita encaminhamentos externos.

### Decisões novas para CP0/CP1

1. Confirmar que a revelação de Jesus virá por volta de 55–60% da sequência principal, após mais frases sobre acolhimento, valor, cuidado e esperança.
2. Escolher a apresentação visual do catálogo de doze temas no hub `/conhecer`; manter a lista fora da sequência animada e oferecer “Prefiro continuar sem escolher”.
3. Determinar se relação com o pai, ser pai/mãe e o que a Bíblia quer dizer ao chamar Deus de Pai serão leituras distintas ou se algum deles fica para uma etapa futura.
4. Aprovar conteúdo e referências de cada leitura temática; não chamar a etapa de teste, triagem, diagnóstico ou aconselhamento.
5. Definir o formulário após escolha do tema: quais campos são opcionais, o alcance do contato padrão, quem recebe, prazo, retenção, exclusão, base legal e aviso de privacidade. O envio só pode ser ativado após revisão e responsável definido.
6. Planejar páginas para os doze campos temáticos aprovados. Decidir quais estarão prontas no primeiro lançamento; não exibir links sem destino ou sem conteúdo revisado.
7. Qualquer menção à Igreja da Cidade ou ao 30 Semanas como opção local requer conferência atualizada e acordo de encaminhamento; a pesquisa pública não estabelece parceria.

## 19. Fluxo opcional de relato e pedido de oração

### Fluxo aprovado em princípio

1. No hub `/conhecer`, a pessoa escolhe um dos temas.
2. A página `/conhecer/temas/:tema` abre com um convite opcional para compartilhar uma situação ou pedir oração. O tema escolhido aparece como contexto, mas não é tratado como diagnóstico.
3. A pessoa pode preencher e enviar o formulário. Um botão/link visível — **“Prefiro não preencher. Quero ler sobre este tema”** — leva diretamente a `/conhecer/temas/:tema/leitura`.
4. Se enviar, a confirmação explica o que acontece depois, quem poderá responder e o prazo esperado. A leitura temática continua disponível após o envio.

A leitura não deve depender do envio do formulário. O visitante não precisa fornecer contato para ler. Se enviar um pedido sem contato ou marcar “NÃO desejo receber contato”, a equipe não deve tentar identificá-lo nem iniciar retorno; o pedido segue apenas para a finalidade de oração, se essa operação for aprovada. O usuário definiu o propósito geral do formulário; os campos, responsáveis e protocolo abaixo ainda precisam de aprovação antes de qualquer coleta real.

### Rascunho de campos mínimos

- **Tema escolhido:** preenchido pelo fluxo e mostrado à pessoa; avisar que acompanha o envio.
- **Relato ou pedido de oração:** campo de texto. Ao lado, explicar que a pessoa pode compartilhar só o que desejar e evitar incluir dados pessoais de terceiros.
- **Contato como padrão desejado:** se a pessoa enviar o formulário e fornecer contato, a equipe poderá responder sobre aquele pedido. Mostrar a caixa desmarcada “NÃO desejo receber contato”; se marcar, não contatar e tornar os dados de contato dispensáveis. Informar esse padrão antes do envio.
- **Como podemos chamar você?** Opcional, salvo se a equipe demonstrar uma necessidade operacional específica.
- **Contato para resposta:** e-mail ou WhatsApp. Pedir um canal; permitir marcar “NÃO desejo receber contato” e, nesse caso, não exigir contato nem retornar. O padrão de contato precisa aparecer explicado junto ao formulário.
- **Aviso de privacidade e base legal:** informação clara antes do envio. A base legal precisa de revisão; se consentimento for a escolhida para dados sensíveis, apresentar consentimento específico, destacado e ligado a finalidades específicas, sem confundi-lo com uma aceitação genérica dos termos.
- **Ação de saída:** “Prefiro ler sem preencher”, sempre disponível e sem mensagem culpabilizadora.

Não incluir inscrição em newsletter, marketing, criação de conta ou autorização para publicar testemunho. Qualquer uso futuro do relato como testemunho exigiria decisão e autorização separadas; a recomendação é não reutilizar relatos de oração para divulgação.

### Operação antes de ativar o botão de envio

Antes de abrir coleta, nomear a pessoa/organização controladora e a equipe que recebe os pedidos; definir quem pode ler, como proteger o acesso, canal e prazo de resposta, cobertura para ausências, retenção e exclusão, canal para exercer direitos, provedor do formulário, compartilhamentos e procedimento para incidentes. O aviso precisa dizer a finalidade, a forma e duração do uso, quem controla, como contatar essa pessoa e quais direitos o titular pode exercer. Como o padrão de produto prevê retorno, informar isso antes do envio; a caixa de recusa deve ser clara e funcionar sem penalizar o pedido de oração. Não usar caixa de e-mail pessoal ou planilha de acesso amplo sem uma avaliação de segurança e acesso.

O formulário não é atendimento clínico, serviço pastoral profissional nem canal de emergência. Não prometer sigilo absoluto se o fluxo não puder garanti-lo, cura ou resposta imediata. Definir previamente como a equipe lidará com relatos de violência, abuso, risco imediato, dependência ou sofrimento intenso; confirmar se menores podem enviar relatos e, se puderem, criar fluxo específico de proteção. Se o projeto não tiver equipe e protocolo para isso, manter o envio desativado e oferecer somente leitura até estar preparado.

### Privacidade e proteção de dados

A LGPD inclui convicção religiosa, dados de saúde e vida sexual na definição de dados pessoais sensíveis; o conteúdo de uma oração ou relato pode revelar esses dados junto de nome, telefone ou e-mail. A lei prevê hipóteses específicas para tratamento de dados sensíveis, incluindo consentimento específico e destacado para finalidades determinadas; a base aplicável ao projeto deve ser validada antes de implementar. As informações de tratamento devem estar claras e acessíveis ao titular. [LGPD, arts. 5º, 9º, 11 e 18](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

A caixa **“NÃO desejo receber contato”** é uma preferência de comunicação, não substitui a base legal para processar o relato/pedido. A ANPD descreve consentimento como manifestação livre, informada e inequívoca; para dados sensíveis, a LGPD acrescenta que deve ser específico, destacado e voltado a finalidades específicas. A preferência de produto registrada é contato como padrão, com opção clara de recusa. Antes da publicação, revisar se esse padrão é compatível com a base legal escolhida; se a base aplicável for consentimento, uma recusa desmarcada não equivale a consentimento afirmativo, e será preciso ajustar o fluxo para obter manifestação válida. [ANPD — consentimento e LGPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/nt-6_2025-fis_cgf_anpd_nota_tecnica__pub__6.pdf) · [LGPD, art. 11](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

Se o serviço aceitar crianças ou adolescentes, avaliar o melhor interesse e as salvaguardas apropriadas ao caso. A ANPD afirma que o tratamento de dados desse público pode usar as bases legais previstas nos arts. 7º e 11, desde que prevaleça o melhor interesse; por isso, não presumir que um formulário pensado para adultos atende automaticamente a menores. [Enunciado da ANPD sobre crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes)

A seleção do tema e o acesso ao estudo podem gerar registros técnicos do servidor mesmo sem formulário; revisar logs, analytics, e-mail e o provedor antes de afirmar que nada é registrado. Não usar o tema para perfil, segmentação, remarketing ou medição de “conversão”. A Resolução da ANPD para agentes de pequeno porte mantém os deveres da LGPD e prevê medidas administrativas e técnicas essenciais de segurança; simplicidade ou baixo volume não substituem controle de acesso, proteção e procedimento de exclusão. [Resolução CD/ANPD nº 2/2022, arts. 6º e 12](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022)

### Decisões restantes antes de implementar

1. Qual pessoa ou organização será responsável por receber e proteger os relatos?
2. **Decidido:** marcar “NÃO desejo receber contato” impede qualquer resposta individual; o pedido pode seguir apenas para oração se a pessoa ainda optar por enviá-lo. A revisão de privacidade deve confirmar como apresentar a preferência padrão de contato e a base legal antes da coleta.
3. Qual prazo real a equipe pode prometer e quem cobre ausências?
4. O formulário aceitará menores? Qual é o fluxo de segurança para relatos de violência ou risco imediato?
5. Qual provedor será usado, quem terá acesso e por quanto tempo os envios serão mantidos?
6. Qual base legal e texto de privacidade serão aprovados para o conteúdo sensível?
7. Qual será o texto da confirmação e quais recursos validados serão exibidos para urgências, sem posicionar o formulário como canal de emergência?

**Gate de lançamento:** o botão de envio só fica ativo quando essas decisões tiverem responsáveis e respostas aprovadas. Até lá, a página do tema leva diretamente ao estudo, sem exibir um formulário que não possa receber resposta.

## 20. Arquitetura técnica proposta (referência: outubro de 2026)

Esta seção é uma recomendação para orientar decisões, não autorização para implementar. A proposta parte do estado encontrado no repositório em 20/10/2026: Expo SDK 57, React Native 0.86, React 19, Expo Router 57, TypeScript 6, NativeWind 4 com Tailwind 3, Reanimated 4, exportação web estática e publicação na Vercel. Antes de código, conferir a documentação exata exigida no `AGENTS.md` e validar as versões estáveis disponíveis naquele momento. Não atualizar Expo, NativeWind ou Tailwind apenas para iniciar a landing.

### Recomendação resumida

| Camada | Recomendação inicial | Motivo/limite |
|---|---|---|
| Aplicação | Manter Expo SDK 57 + Expo Router + React Native Web + TypeScript, usando as dependências já instaladas | Evita criar um segundo frontend e preserva a experiência nativa atual. A rota web e a rota nativa da raiz podem ter apresentações diferentes com extensões de plataforma, após mapear as rotas existentes. |
| Estilo | Manter NativeWind 4/Tailwind 3 nas áreas existentes; para a landing, usar estilos locais e CSS web quando isso melhorar semântica, tipografia ou movimento | O README registra incompatibilidade de migração para Tailwind 4 no arranjo atual. Não misturar outra biblioteca de componentes ou design system antes de haver necessidade. |
| Animação | Para a narrativa exclusivamente web, preferir CSS curto + `IntersectionObserver`, sem biblioteca nova; manter a rolagem nativa do navegador | O efeito é simples e não precisa de física, timeline complexa ou scroll controlado. Reanimated 4 já está instalado e fica como opção caso um comportamento multiplataforma seja necessário. |
| Conteúdo e rotas | Gerar landing e estudos como páginas estáticas no Expo Router | O texto é editorial e muda pouco; prerender melhora o conteúdo inicial, compartilhamento e indexação sem consultar banco durante a visita. |
| Endpoint do formulário | Uma função Node.js da Vercel em `/api`, na mesma origem, com validação no servidor | O deploy atual é estático e tem uma pasta pública de saída. A documentação da Vercel permite funções no diretório `api`; confirmar a configuração combinada com `outputDirectory: dist` num Preview antes de produção. |
| Banco | Neon Postgres, acessado só pela função, usando `@neondatabase/serverless` com Drizzle ORM e driver HTTP para envios simples | O driver HTTP é adequado a consultas curtas/independentes; Drizzle oferece schema e migrações tipadas. Não conectar o navegador nem o app nativo diretamente ao banco. |
| Deploy e dados | Vercel para arquivos estáticos e função; Neon para persistência; ambientes de desenvolvimento, preview e produção isolados | Mantém a distribuição atual. Rota da função, região, conexão, plano/custos, retenção e recuperação devem ser medidos e aprovados antes do piloto. |

O Expo Router documenta que o export estático gera HTML por rota e pode servir páginas indexáveis; também alerta que a exportação estática não cria por si só um servidor/API. A documentação atual indica integração de API routes ao export estático a partir do SDK 58, então esta proposta para SDK 57 usa a função Node.js da Vercel como fronteira de servidor, em vez de assumir esse recurso no Router. A Vercel documenta funções no diretório raiz `api/`; a combinação precisa ser validada com o build e o `vercel.json` deste projeto. [Expo — static rendering e limites de API no SDK 57](https://docs.expo.dev/router/web/static-rendering/) · [Expo — API routes](https://docs.expo.dev/router/web/api-routes/) · [Vercel — configuração de Functions](https://vercel.com/docs/project-configuration/vercel-json)

Não recomendo introduzir Next.js ou Astro apenas para esta primeira página: a aplicação já é Expo multiplataforma e o conteúdo é estático. Se no futuro a iniciativa se tornar um site editorial independente, com publicação frequente e exigências próprias de SEO, comparar Astro e Expo em um checkpoint de arquitetura, considerando o custo de manter dois frontends e duas estruturas de rota.

### Frontend e animação da narrativa

- Definir a landing como uma experiência web editorial, com HTML semântico e conteúdo já presente no HTML exportado; o JS aprimora o movimento, mas não contém a única cópia da mensagem. A raiz web pode apresentar a landing, enquanto a entrada nativa conduz ao app em `/biblia`; confirmar tecnicamente os arquivos de rota e o comportamento de deep links antes de mover as rotas atuais.
- Usar frases e quadros como conteúdo em ordem natural no documento. Uma observação de interseção pode marcar o quadro atual e aplicar transições breves de opacidade/deslocamento. O visitante continua rolando no ritmo próprio; não prender o scroll, bloquear avanço, remover texto da árvore de acessibilidade nem depender de toque.
- Preferir CSS para a animação no navegador: reduz dependências e permite fallback direto. Usar Reanimated, já existente, apenas se o mesmo componente animado também precisar funcionar em Android/iOS ou se o protótipo provar uma necessidade real.
- Respeitar `prefers-reduced-motion`: com a preferência ligada, retirar transições e deslocamentos e mostrar os mesmos quadros sem efeito. Oferecer controle de movimento se o comportamento final acrescentar animações além do essencial. A W3C alerta que movimento adicional disparado por rolagem pode causar distração, tontura ou náusea; o movimento essencial de rolar deve continuar sob controle do visitante. [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Não usar scroll-jacking, parallax, contagem de progresso que pareça cobrança, texto piscando, transição longa, autoavanço ou conteúdo que dependa de JavaScript para existir. Não esconder a narrativa dos leitores de tela; evitar `aria-live` anunciando cada frase a cada movimento da página.
- Manter alternância claro/escuro com rótulo acessível, contraste verificado, foco visível, zoom funcional, links com destinos compreensíveis e corpo de texto confortável em tela estreita. No primeiro acesso, tema escuro pode ser padrão da identidade, mas a opção clara permanece fácil de encontrar.
- Otimizar para o caso real do QR: celular de entrada, conexão móvel variável e carregamento inicial rápido. Sem fontes remotas bloqueantes, vídeo, imagem ou animação pesada; usar fontes de sistema inicialmente e testar em conexão limitada.

### Neon e desenho do endpoint

O Neon é tecnicamente compatível com o fluxo proposto e oferece Postgres gerenciado, driver serverless por HTTP/WebSockets, connection pooling e branches. Para uma requisição de formulário curta, começar avaliando o driver HTTP com Drizzle; escolher WebSockets ou outro driver só se transações interativas ou compatibilidade específica forem necessárias. Fazer medição no ambiente real em vez de assumir latência ou disponibilidade. [Neon — serverless driver](https://neon.com/docs/serverless/serverless-driver) · [Drizzle — Neon Postgres](https://orm.drizzle.team/docs/connect-neon) · [Neon — connection pooling](https://neon.com/docs/connect/connection-pooling) · [Neon — branches](https://neon.com/docs/get-started-with-neon/workflow-primer)

**Fluxo proposto:** navegador envia o formulário por HTTPS para um único endpoint same-origin; o endpoint valida e limita os campos, grava o mínimo necessário no Neon e devolve uma confirmação neutra. Só uma interface administrativa privada recebe acesso humano ao relato; ela não faz parte do app público. Ainda não está decidido se essa interface será uma caixa de e-mail organizacional, ferramenta restrita ou painel próprio. Não mandar relato completo por e-mail ou notificação sem avaliar esse canal.

**Modelo de dados mínimo para avaliação, sem congelar schema:** identificador aleatório; tema escolhido; texto voluntário; canal de contato e respectivo valor somente se informado e permitido; preferência de não contato; estados operacionais estritamente necessários; datas de recebimento e expurgo; versão do aviso e registro da manifestação requerida pela base legal validada. Separar dados de contato do conteúdo quando isso for praticável. Não guardar localização, perfil de navegação, campanha individual, diagnóstico, dados de terceiros, conteúdo de IP ou user-agent como campos da solicitação. Logs técnicos devem excluir corpo do relato e valores de contato.

Antes de criar o banco de produção, decidir se é realmente necessário persistir texto livre. Para o MVP, reduzir superfície: formulário sem login, tamanho máximo de relato, contato de um canal, sem anexos, sem analytics comportamental, sem painel público e sem reaproveitamento do texto. Definir prazo curto e executável para apagar relatos resolvidos e também cópias/exports; configurar a política e testar que a exclusão funciona. Se a organização não puder revisar e proteger relatos, retirar o envio e manter as leituras.

### Segurança e privacidade por padrão

1. **Segredo só no servidor:** variável da conexão Neon exclusivamente no ambiente server-side da função. Nunca usar prefixo público, incluir em bundle Expo, mobile, HTML, repositório, captura de tela, prompt de IA ou logs. Usar usuário/role de banco com privilégios mínimos para a função; credencial de migração separada da credencial de execução, quando suportado operacionalmente. Rotacionar credenciais e não reutilizar a role owner em produção. [Neon — roles](https://neon.com/docs/manage/roles) · [Vercel — runtime e variáveis de ambiente](https://vercel.com/docs/functions/runtimes)
2. **Validação no servidor:** aceitar somente métodos e tipos previstos; limite de bytes e de caracteres; campos permitidos por lista; normalização sem destruir o relato; queries parametrizadas; saída escapada na tela interna; erros sem stack trace nem dados do pedido. A validação do browser é conveniência, nunca controle de segurança.
3. **Abuso e spam:** rate limit no servidor com método que não persista identificadores por mais tempo que o indispensável; honeypot discreto e limites para submissões duplicadas. CAPTCHA só se o abuso real justificar a barreira de acessibilidade. Não tratar tema escolhido como perfil ou evento de marketing.
4. **CSRF/origem:** como não há conta pública e o endpoint é same-origin, definir verificação de origem/Fetch Metadata e política CORS restritiva, além de proteção CSRF adequada ao método de sessão adotado. Não habilitar CORS amplo. Não colocar tokens permanentes no cliente.
5. **Acesso humano:** lista curta de pessoas autorizadas, contas individuais com MFA no provedor, sem senha compartilhada, treinamento de confidencialidade e registro mínimo de acesso. Definir responsável titular e substituto; remover acesso quando a função mudar.
6. **Proteção da base:** TLS até o banco; ambiente e credenciais separados; branches de preview sem dados pessoais reais; cópias de produção proibidas em testes de desenvolvimento. Decidir backup/restore e expiração, verificando se cópias e logs seguem a exclusão planejada. Criptografia em repouso oferecida pelo provedor não elimina a necessidade de limitar acessos; avaliar criptografia de campo para relato/contato se a operação e a recuperação de chave puderem sustentá-la.
7. **Privacidade no fluxo:** aviso em linguagem clara antes do envio, finalidade específica, responsável, prazo, canal para direitos, retenção, destinatários/provedores, resposta esperada e limites do atendimento. A caixa “NÃO desejo receber contato” bloqueia retorno; a base legal para processar pedido e relato sensível continua sendo uma decisão separada. Não ativar coleta até a revisão de privacidade e operação descrita na seção 19.
8. **Casos de risco:** decidir explicitamente o público etário, como lidar com menor, abuso, violência e risco imediato, e qual orientação pública validada será mostrada. O formulário não é serviço de emergência, diagnóstico ou cuidado clínico. Não usar IA para classificar risco, diagnosticar, resumir ou recomendar respostas a relatos no primeiro lançamento.
9. **Resposta a incidentes:** designar quem recebe alertas, como bloquear acesso/endpoint, revogar credenciais, preservar evidência necessária, avaliar impacto e cumprir obrigações de comunicação. Documentar uma simulação antes de ativar o formulário. LGPD/ANPD já estão citadas na seção 19; esta arquitetura depende dessa revisão, não a substitui.

### Desenvolvimento assistido por IA

- Tratar IA como ferramenta de implementação e revisão, não autoridade doutrinária, jurídica ou de segurança. O conteúdo teológico segue a revisão pastoral humana; privacidade segue revisão da pessoa responsável; código sensível recebe revisão humana antes do merge.
- Alimentar o agente com a tarefa delimitada, arquitetura aprovada, caminhos do projeto, regras do `AGENTS.md` e fontes oficiais pertinentes. Para qualquer edição Expo, ler primeiro a documentação exata do SDK configurado (atualmente v57) e verificar se a recomendação consultada se aplica a essa versão; não copiar exemplos de SDK 58+ sem decidir a migração.
- Trabalhar por entregas pequenas e revisáveis: texto/rotas; apresentação acessível; formulário sem persistência; endpoint; banco e migração; operação/admin; lançamento. Fazer branch de feature, conferir diff, lockfile, dependências, URLs e logs a cada etapa. IA pode propor migrações, mas uma pessoa revisa schema, privilégios, SQL e plano de rollback.
- Usar somente dados artificiais para desenvolvimento, testes, demonstração e screenshots. Nunca colocar histórias reais, pedidos de oração, contatos, variáveis `.env`, logs de produção ou export do banco em prompts, ferramentas, issues ou ambientes de IA. Se uma ferramenta de IA receber acesso ao workspace, manter secrets fora do contexto e autorizar apenas tarefas necessárias.
- Não usar modelo de IA dentro do produto na primeira versão. Não mandar mensagens por IA nem gerar oração personalizada a partir de relato. Se alguma integração futura for proposta, realizar nova avaliação de finalidade, consentimento/base legal, fornecedor, retenção, transferência, segurança, supervisão e risco pastoral antes de alimentar conteúdo de pessoas.
- Para texto visível, gerar estrutura e alternativas em separado; conferir cada referência bíblica diretamente na tradução aprovada, verificar direitos, editar para voz humana simples e registrar decisão do revisor. Uma citação inventada ou referência errada é bloqueio de publicação.
- No ciclo profissional de entrega: especificação aprovada → implementação delimitada → revisão de conteúdo/código/privacidade → verificações automatizadas já existentes no repositório → prévia Vercel com dados sintéticos → aprovação pastoral/operacional → deploy e observação. Verificações planejadas não foram executadas nesta etapa de planejamento.

## 21. Roadmap técnico e checkpoints

| Checkpoint | Trabalho e saída revisável | Gate para avançar |
|---|---|---|
| **CP0 — decisões e responsáveis** | Aprovar identidade pública, conteúdo e rotas; nomear organização/responsável pastoral, responsável pelos relatos e pessoa que responde. Confirmar que o formulário fica desativado até a operação estar pronta. | Não há lançamento com organização ou responsável indefinido. |
| **CP1 — conteúdo e protótipo textual** | Finalizar as frases da narrativa, ponto de revelação, chamada `/conhecer`, lista de temas, estudos iniciais, referências e texto do panfleto; protótipo leve de telas com o efeito proposto. | Leitoras/es de compreensão e revisor pastoral conseguem explicar a mensagem sem entender o suspense como pegadinha ou promessa de solução. |
| **CP2 — mapa de rotas e arquitetura** | Inventariar rotas, links, SEO, QR, idioma, `/`, `/biblia`, `/leitura`, `/conhecer`, domínio e comportamento web/nativo; decidir preservação/redirecionamentos; registrar os limites da exportação Expo 57/Vercel. | Cada rota publicada tem destino e política de compatibilidade; não há colisão entre app nativo e homepage web. |
| **CP3 — landing sem coleta** | Construir página estática acessível, narrativa com movimento opcional, temas claro/escuro, páginas de aprofundamento aprovadas e caminhos para leitura bíblica. Formulário ainda não envia dados. | Revisão em aparelhos reais, leitor de tela, teclado, movimento reduzido, carregamento móvel limitado e preview; texto funciona sem animação e sem JavaScript funcional. |
| **CP4 — plano operacional e privacidade** | Definir finalidade e base legal, aviso, política de contato, público etário, urgências, equipe, MFA/acesso, prazo de resposta, retenção/exclusão, backup, provedor e resposta a incidente. | Aprovação explícita de responsáveis; caso algum requisito não seja atendido, manter leitura e remover envio. |
| **CP5 — Neon de desenvolvimento e endpoint** | Criar projeto/branch Neon de desenvolvimento com dados artificiais; migração versionada; endpoint Vercel Node.js; validação, rate limit, logs redigidos e acesso restrito. Documento de operação e exclusão. | Testes de segurança e fluxo aprovados sem usar qualquer dado real; credenciais de produção ausentes dos previews. |
| **CP6 — piloto controlado** | Ativar em ambiente limitado com pequeno grupo autorizado e protocolos prontos; testar envio, recusa de contato, pedido sem contato, leitura alternativa, resposta, expurgo, abuso e restauração. | Confirmar em campo que nenhuma solicitação fica sem responsável e que a opção de leitura continua disponível. |
| **CP7 — publicação e manutenção** | Validar domínio no Registro.br, QR final, acessibilidade e rotas; aprovação pastoral e operacional; publicar; definir monitoração mínima, revisão periódica, responsável por atualizações e rollback. | Só imprimir em tiragem e direcionar público depois do domínio, conteúdo, formulário (se ativo) e destino terem sido verificados em produção. |

**Ordem recomendada:** não colocar Neon no caminho crítico da primeira entrega. Primeiro validar narrativa e site sem coleta. Neon entra no CP5, depois de haver finalidade, responsável e política de retenção para dados; se essas condições não estiverem prontas, o site pode ser publicado sem formulário e manter a opção de leitura temática.

### Lacunas técnicas que ainda exigem decisão

1. A home em `/` será apenas landing na web enquanto no app nativo abre `/biblia`? A equipe aceita manter rotas plataforma-específicas e preservar os links atuais?
2. O site permanece no mesmo projeto Vercel e domínio do app, ou terá domínio próprio apontando para o mesmo deploy? Confirmar comportamento de `api/` e regras de rota/redirecionamento com Preview.
3. Confirmar se Neon será aprovado, o responsável da conta, região/branch, plano, orçamento, limites, backup, restore e região de execução da função.
4. Será aceitável que pedidos de oração fiquem em Postgres? Quem terá acesso e qual prazo máximo de exclusão, incluindo logs e backups?
5. Qual sistema privado a equipe usará para ler e responder? Sem esse destino operacional, não criar interface administrativa nem enviar os relatos para uma caixa informal.
6. A caixa negativa de contato continua a intenção de UX, sujeita à revisão do fundamento legal; definir se haverá consentimento específico afirmativo separado caso seja necessário.
7. O visitante poderá ter menos de 18 anos? Isso afeta a redação, o formulário, as salvaguardas e o procedimento de resposta.
8. Aprovar como métrica de desempenho: carregamento inicial medido em aparelho de entrada/rede móvel, sem depender de bibliotecas externas; definir alvo numérico no CP2 após baseline.
9. Decidir se haverá qualquer analytics. Recomendação inicial: não registrar tema, pedido, identidade, campanha individual ou trajetória; medir apenas disponibilidade/performance agregada se necessário e aprovado.

## 22. Pacote de início de desenvolvimento

> **Atualização de execução (2026-10-20):** o primeiro incremento foi iniciado no repositório. A tabela de rotas abaixo registra a proposta original e não descreve por si só o estado atual; consulte “Estado da implementação” ao final deste documento para o que já foi alterado e o que segue pendente.

### Escopo recomendado para o primeiro incremento

O primeiro incremento deve provar a jornada principal e a compatibilidade com o app, sem coletar dados pessoais:

1. Web `/`: landing de frases curtas, com abertura exata “Tem alguém que te ama.”, sequência narrativa, revelação de Jesus, continuação do evangelho e chamadas para aprofundar ou abrir a Bíblia.
2. Web `/conhecer`: porta de entrada simples para leitura ampliada, com pelo menos o estudo introdutório sobre Jesus e caminhos para Bíblia/história da salvação. Só mostrar temas com destino editorial pronto.
3. Web `/leitura`: abrir a escolha de livro. Depois, capítulos em `/leitura/:livro/:capitulo` e demais passos do seletor preservam a função existente.
4. App nativo: continuar abrindo na experiência do app em `/biblia`, sem apresentar a landing web nem perder o onboarding nativo.
5. Temas claro/escuro, transições discretas e alternativa de movimento reduzido.
6. Formulário, endpoint, Neon, painel e analytics ficam fora deste incremento. Os estudos temáticos podem ser preparados como conteúdo estático depois que cada um estiver revisado.

Esse corte entrega a promessa central do panfleto e um próximo passo útil sem lançar um canal de relato ainda sem equipe e protocolo. O Neon permanece planejado como fase posterior, não como requisito para o site ser útil.

### Mapa de rotas: situação atual e proposta

| Origem atual observada no app/export | Destino proposto | Trabalho/dependência |
|---|---|---|
| `/` (`app/(tabs)/index.tsx`) | Landing na web; início do app em `/biblia` no nativo | Separar comportamento por plataforma; evitar colisão entre a rota de grupo `(tabs)` e uma landing raiz explícita. |
| `/biblia` (`app/(tabs)/biblia/index.tsx`) | `/leitura` | Passa a ser a entrada do leitor e abre a escolha de livro. |
| `/biblia/escolher` | `/leitura` | Destino natural da seleção; decidir e manter a rota secundária que escolhe capítulo/versículo. |
| `/biblia/escolher/:livro/:capitulo` | rota equivalente sob `/leitura` | Atualizar seletores, deep links e parâmetros de versículo. |
| `/biblia/:livro/:capitulo` | `/leitura/:livro/:capitulo` | Atualizar links internos de busca, resumo do dia, atividade, salvos e navegação; preservar links antigos. |
| `/pesquisa`, `/voce` | `/biblia/pesquisa`, `/biblia/voce` | Atualizar as abas e todos os links internos. |
| `/planos`, `/resumos`, `/salvo`, `/medalhas`, `/estatisticas`, `/configuracoes`, `/ajuda`, `/privacidade`, `/sobre` | páginas equivalentes sob `/biblia/...` | Confirmar qual namespace o usuário quer para cada área e atualizar links; rotas nativas podem continuar sem o mesmo prefixo se a experiência pedir, mas a web precisa de mapa estável. |
| `/onboarding` | fluxo interno do app em `/biblia/onboarding` ou rota controlada pelo shell | Preservar acesso de configurações e primeiro uso; garantir que nunca apareça como interceptação da landing web. |
| `dist/biblia/:slug/:capitulo.html` (gerador estático atual) | export equivalente em `/leitura/:slug/:capitulo` | Atualizar `scripts/gerar-rotas-leitura.js`, verificação de export estático, metadados e navegação anterior/próximo. |
| Novas páginas `/conhecer/...` | permanecem fora do namespace do app | Conteúdo estático revisado, com links claros para `/leitura` e `/biblia`. |

**Risco de compatibilidade confirmado no código:** os caminhos de capítulo são usados em várias partes da interface e em funções auxiliares. Não basta mover arquivos de rota: revisar chamadas `Link`, `router.push/replace`, helpers, referências de retorno, testes existentes e HTML estático gerado. Implementar aliases/redirecionamentos permanentes para URLs antigas e verificar também os arquivos `.html` já usados por buscadores. Não redirecionar `/biblia` antigo para o leitor; esse caminho passa a ser a home do app.

### Comportamentos globais a separar

- O layout raiz atual verifica se está em `/` e redireciona ao onboarding quando a apresentação inicial não foi concluída. Sem uma exceção, esse efeito pode sequestrar a landing pública em um navegador novo. Alterar a regra para não aplicar onboarding à raiz web e preservar a entrada nativa.
- O layout raiz atual define título e descrição globais da Bíblia Plataforma. A página pública precisa de metadados próprios e corretos sobre a mensagem, sem título genérico do leitor.
- O layout raiz também restaura tema, registra service worker e instala transições de navegação. Confirmar se o service worker/cache e a animação global devem incluir a landing; não cachear resposta sensível do futuro endpoint nem adicionar efeitos duplicados.
- A migração de rotas pode mudar a shell de abas. Preservar links externos e estado local do leitor; antes de refatorar, estabelecer uma tabela de equivalência e listar todos os caminhos públicos.
- Build de produção hoje chama gerador de conteúdo, `expo export` e gerador próprio de rotas de capítulo. A mudança exige atualizar conjuntamente export, metadados, gerador, checker de HTML e regras do Vercel; verificar URLs antigas e novas em Preview.

### Backlog ordenado para o primeiro ciclo

| Ordem | Entrega | Dependência | Aceite para fechar |
|---|---|---|---|
| **D0 — congelar escopo** | Registrar corte MVP acima e as premissas já decididas pelo usuário; separar o que está aprovado, recomendado e pendente | Nenhuma | Documento não deixa o formulário ou banco parecerem necessários para o MVP. |
| **D1 — inventário de rota/link** | Lista completa de rotas, links internos, referências a URLs, páginas geradas e metadados; mapa de equivalência antiga/nova | D0 | Cada caminho tem novo destino, alias ou justificativa para remoção. |
| **D2 — narrativa aprovada para protótipo** | Sequência em quadros curtos com contagem, referências e rótulos de trechos que aguardam revisão pastoral | D0 | Cada quadro é curto, ordem/revelação coerentes e nenhuma referência sem verificação. Pode permanecer “rascunho” até revisão final. |
| **D3 — arquitetura de raiz e shells** | Definir solução concreta de rotas web/nativas, onboarding, title/meta, serviço worker e navegação de tabs | D1 | Landing abre sem onboarding; app nativo continua abrindo corretamente; não há ambiguidade de rotas para Expo Router. |
| **D4 — sistema visual mínimo** | Tipografia, escala, largura máxima, espaçamento, cores claro/escuro, foco, estados sem animação e forma dos quadros | D2 | Protótipo compreensível no celular sem imagem; mudança de tema e movimento reduzido são utilizáveis. |
| **D5 — experiência estática** | Landing e `/conhecer` com conteúdos iniciais revisados; entrada e capítulos em `/leitura` | D3 e D4 | Conteúdo está no HTML exportado; links de navegação funcionam; nenhum formulário envia dados. |
| **D6 — compatibilidade e verificação** | Geradores/checkers, redirects, SEO, QR em preview, leitura por teclado/leitor de tela e aparelhos móveis | D5 | Rotas novas e antigas cobertas; resultado estático e navegação nativa não quebram. |
| **D7 — revisão de lançamento** | Revisão pastoral, direitos de tradução, organização/titular, domínio, aviso institucional e operação | D2 e D5 | Autorização editorial e identidade pública definidas antes de imprimir ou publicar para público. |

**Ciclo posterior, separado:** D8 — definir equipe, fluxo de resposta e privacidade; D9 — avaliar e provisionar Neon de desenvolvimento, schema e migrações; D10 — API `/api` na Vercel, limitação de abuso e logs redigidos; D11 — acesso privado, expurgo, restauração e resposta a incidente; D12 — piloto com dados sintéticos e pequena equipe; D13 — aprovação explícita e ativação gradual. O código do endpoint só começa depois de D8; dados reais jamais entram nos branches de preview.

### Decisões que bloqueiam conteúdo público, não o protótipo

| Decisão em aberto | Pode começar sem resposta? | Como trabalhar até decidir |
|---|---|---|
| Organização/titular e autoria pública | Sim, para protótipo local | Não publicar nome, afiliação, contato ou política institucional inventados. |
| Revisor pastoral e tradição/ênfase | Sim, para wireframe | Texto permanece marcado como rascunho; não publicar afirmações doutrinárias até revisão. |
| Tradução e direitos | Sim, com referências | Não inserir citações longas; registrar referências para conferência. |
| Domínio | Sim, com URL local/preview | Não imprimir QR nem distribuir panfletos finais até conferir domínio e HTTPS. |
| Formulário, operação e base legal | Sim, sem coleta | Mostrar somente caminho de leitura; nenhum dado vai a logs, e-mail, analytics ou banco. |
| Quais temas estarão prontos | Sim, com catálogo interno | Publicar apenas links cujas leituras foram redigidas e revisadas. |
| Namespace de `/biblia/...` | Pode preparar inventário; deve decidir antes de migrar rotas | Usar o mapa proposto como rascunho; não alterar rotas antes da decisão. |

### Condição para declarar “pronto para começar a codar”

Este gate foi superado para o **protótipo local**: o usuário definiu `/` como landing web, `/biblia` como início do app e `/leitura` como leitor, e autorizou iniciar o desenvolvimento. Isso não aprova o conteúdo para publicação nem decide o prefixo futuro das demais áreas do app. Organização, domínio, revisão pastoral, operação do formulário e Neon continuam sendo decisões de etapas posteriores.

## 23. Estado da implementação

**Atualizado em 2026-10-20.** O primeiro incremento estático está implementado na branch de prévia. O escopo técnico D0–D6 está substancialmente entregue; D7 permanece como aprovação de lançamento.

### Entregas no incremento estático

- Na web, `/` abre a narrativa e, no aplicativo nativo, a entrada continua direcionando para `/biblia`.
- `/biblia` contém a entrada do app; `/leitura` abre o seletor e os capítulos são exportados em `/leitura/:livro/:capitulo`.
- Redirecionamentos preservam os caminhos antigos de capítulos e seletores sob `/biblia/...`.
- `/conhecer` reúne três leituras introdutórias e um catálogo opcional de doze assuntos adaptados em linguagem simples. Cada assunto abre sua própria leitura estática, com referências que levam ao leitor.
- A landing mantém dez quadros de rascunho, abre com “Tem alguém que te ama.”, revela Jesus no sexto quadro, explica a mensagem cristã e oferece caminhos opcionais. Usa degradê de cinza, tema claro/escuro persistido no dispositivo, fontes de sistema sem requisição externa na raiz, dissolução textual progressiva e respeito a `prefers-reduced-motion`.
- As leituras e os doze temas são rascunhos editoriais. Não há coleta de relatos ou pedidos de oração, endpoint, analytics ou conexão Neon nesta versão.
- A página explica que os temas são caminhos de leitura, não diagnósticos, e informa com clareza que o site ainda não recebe relatos nem pedidos de oração.

### Verificações realizadas

- `npm run export:web`: concluído com Expo SDK 57. Foram exportadas as páginas da aplicação, os doze caminhos temáticos e 1.189 capítulos bíblicos.
- `npm run check:static`: concluído. O verificador cobre a landing, o hub, os três estudos introdutórios, as doze leituras temáticas, metadados e as 1.189 páginas de capítulos; encontrou 1.312 arquivos HTML.
- Preview local: `/`, `/conhecer` e `/conhecer/temas/ansiedade-e-preocupacao` foram abertos. A árvore acessível expõe títulos, ordem das seções, textos e links bíblicos.
- `npm run typecheck`: ainda retorna três erros em arquivos modificados anteriormente no workspace, fora deste incremento: um tipo de resumo em `app/(tabs)/biblia.tsx` e duas chamadas sem argumento em `app/(tabs)/leitura/[livro]/[capitulo].tsx`. Nenhum erro foi apontado nos arquivos deste incremento.
- `npm run check:a11y`: o verificador para ao tentar abrir `app/(tabs)/index.tsx`, que não existe neste checkout. A rota e o checker fazem parte de alterações locais preexistentes e não foram modificados nesta etapa.
- O incremento estático com o catálogo temático foi publicado em prévia protegida da Vercel. O domínio pretendido e a rota final do QR ainda não foram confirmados.

### Portão D7 — revisão de lançamento

O código está em condição de revisão, mas a publicação pública e a impressão do panfleto não estão aprovadas. Em consulta feita em 2026-10-20, o Registro.br informou que `temalguemquemeama.com.br` estava disponível para registro. A consulta não registra nem reserva o domínio. Ainda é necessário decidir quem será o titular da conta e do domínio, nomear a organização responsável e o revisor pastoral, conferir referências e conteúdo, aprovar a tradução e seus direitos e testar acessibilidade, rolagem e carregamento em aparelho real e rede móvel. O endereço e o QR só devem ser finalizados depois dessas verificações. [Consulta oficial do Registro.br](https://registro.br/busca-dominio/?fqdn=temalguemquemeama.com.br).

O formulário e Neon permanecem no ciclo posterior D8–D13. Antes de coletar pedidos de oração ou relatos, definir quem recebe e responde, finalidade, base legal, aviso de privacidade, acesso, retenção e exclusão. Relatos podem conter informações de saúde, vida sexual ou convicção religiosa, que a LGPD trata como dados pessoais sensíveis; não ativar a coleta antes dessa definição. [Lei nº 13.709/2018, arts. 5º e 11](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).


## 24. Refinamento visual da experiência pública

Atualizado em 2026-10-20, após revisão das telas enviadas pelo usuário.

A direção visual é editorial e tipográfica, com referências nas seleções oficiais [Minimal](https://www.awwwards.com/websites/minimal/) e [Typography](https://www.awwwards.com/websites/typography/) do Awwwards. As referências orientam composição, espaços e hierarquia; o projeto não reproduz um layout específico nem declara premiação.

- Paleta: cinza escuro em degradê, texto marfim, acento areia e um cartão claro para destacar o primeiro caminho de leitura. A landing usa fontes do sistema nesta revisão para não bloquear o primeiro conteúdo à espera de fonte externa; reavaliar a direção tipográfica após conferir o fallback em aparelhos.
- O hub passa a ter navegação horizontal, abertura editorial, cartões com categorias e setas alinhadas, lista temática com divisórias e uma chamada da Bíblia com botão em linha única.
- A landing usa um palco fixo durante a rolagem. O texto se dissolve em partículas amostradas de suas palavras. O avanço depende da rolagem, inclusive ao voltar. O canvas processa até 1.600 partículas por quadro, com cache limitado, sem bibliotecas adicionais.
- Hover: luz suave seguindo o ponteiro, deslocamento discreto dos cartões, giro das setas e contraste nos botões. Controles continuam com foco de teclado visível e área de toque adequada.
- As leituras e os temas entram ao alcançar a tela. As animações usam transformações e opacidade, com limpeza dos observadores ao navegar.
- O carregamento aparece apenas enquanto as fontes estão pendentes, com limite de 2,2 segundos, saída suave e opção de continuar imediatamente. Não há porcentagem simulada ou espera mínima artificial.
- A opção “Ler sem animações” disponibiliza a narrativa completa em leitura contínua. A preferência de movimento reduzido do sistema também desativa o palco fixo, a poeira e os efeitos de entrada.
- O HTML estático permanece legível se JavaScript, canvas ou observadores não estiverem disponíveis.

Verificação local: exportação concluída, 23 rotas críticas e 1.312 arquivos HTML conferidos. Navegação, tema claro/escuro, avanço da narrativa e leitura contínua revisados no navegador. Layouts conferidos em 390, 960 e 1.280 pixels, sem extravasamento horizontal nos elementos principais. Nenhum erro de console observado nas páginas revisadas. O typecheck continua apontando somente os três erros preexistentes descritos na seção 23. Ainda é necessária a revisão em aparelhos reais antes do lançamento.

## 25. Revisão UX/UI da landing e plano de resolução

**Atualizado em 2026-10-21.** Esta revisão e a implementação estão na branch `codex/landing-evangelismo-mvp`; não alteram `master` nem publicam o domínio. Foram feitas três auditorias independentes (mobile, acessibilidade e jornada) sobre a implementação da branch. Os pontos abaixo separam problemas corrigidos no protótipo, riscos que ainda precisam de validação e decisões editoriais que não devem ser resolvidas por código.

### Achados e decisão

| Prioridade | Problema observado | Resolução aplicada nesta branch | Evidência ou pendência |
|---|---|---|---|
| P1 | A chamada principal só aparecia depois dos dez quadros — cerca de dez telas de rolagem no modo animado. | Atalho “Ir direto às opções” no primeiro quadro, com destino nomeado no final. A narrativa completa continua disponível para quem prefere seguir a sequência. Quadros inativos também deixam de interceptar ponteiro/toque. | Confirmar no CP5 em 320–390 px que cabe no primeiro viewport e funciona por toque/clique com animação ligada, teclado e leitor de tela. O número de quadros permanece rascunho editorial, não aprovado para impressão. |
| P1 | O destino “Abrir a Bíblia online” chega à rota `/leitura`, mas a aba Bíblia permanece em “Abrindo sua última leitura” sem avançar. | **Corrigido nesta branch:** fallback usa a rota canônica `/leitura/escolher` quando não há última leitura ou há erro ao recuperá-la. | Reproduzido antes do ajuste; no reteste do Expo Web, `/leitura` encaminhou para `/leitura/escolher` e renderizou a lista de livros. Typecheck, contratos de jornada e exportação já haviam passado. O seletor foi confirmado visualmente/na árvore acessível no browser. |
| P1 | `visibility: hidden` removia os quadros não ativos da árvore acessível e da busca do navegador. | A transição altera opacidade visual, sem retirar os outros quadros do documento acessível. Removidos rótulos de região redundantes por quadro; a sequência usa títulos h1/h2. | CP5 precisa conferir a ordem e leitura única dos dez quadros com VoiceOver e NVDA, busca do navegador e movimento reduzido. |
| P1 | O scrollport era difícil de alcançar por teclado porque não tinha `tabIndex`. | A área principal recebe foco de teclado e contorno visível. O progresso agora expõe `progressbar` com mínimo, máximo, valor e texto por quadro. | CP5: verificar Page Down, Espaço e setas nos navegadores suportados; verificar que o progressbar não gera anúncios repetitivos. |
| P2 | Havia unidades de viewport diferentes entre quadros, palco, raiz e modo de movimento reduzido; safe areas não estavam consideradas nos controles fixos. | A altura do quadro foi alinhada a `100dvh`, e cabeçalho/progresso usam insetos seguros do aparelho. | É risco de compatibilidade, não defeito reproduzido: verificar barras dinâmicas em Safari iOS e webview do leitor de QR. |
| P2 | A página requisitava Montserrat e Caveat de um domínio externo na primeira visita. | A landing raiz usa fontes de sistema como fallback e remove os links de Google Fonts. A rota `/conhecer` ainda tem chamadas de fonte próprias; permanecem no escopo do CP5, sem alegar que toda a jornada está livre de terceiros. | Com cache limpo e bloqueio de terceiros, medir carregamento/legibilidade e decidir se hospedar fontes licenciadas localmente vale o custo de bytes. |
| P2 | O tema escolhido se perdia ao sair e voltar. | A escolha claro/escuro é gravada em `localStorage`, com fallback quando armazenamento está indisponível. | CP5: reabrir, alternar tema, testar bloqueio de armazenamento e contraste em telas reais. |
| P2 | Os links finais não explicavam o que a pessoa encontraria no hub. | A descrição agora informa que há leituras sobre Jesus, Bíblia e salvação; os dois destinos têm rótulos mais específicos. | Confirmar que a descrição corresponde ao conteúdo publicado depois de CP2. |
| P2 | As referências no fim eram texto sem navegação. | **Adiado.** Os destinos dependem de revisar a mensagem, aprovar o comportamento de `/leitura` e resolver direitos/identidade do texto ACF descritos nos CP0/CP2/CP3. | Decidir em CP2/CP3 antes de transformar as referências em links; não criar uma promessa de leitura bíblica que os direitos ainda não sustentam. |
| P3 | Metadados pequenos e pouco contrastados competiam com a leitura no celular. | Aumentado o tamanho do progresso, convite, controle de leitura e área de ação do atalho. | Medir contraste e legibilidade com zoom/tamanho de texto ampliado em CP5. |

### Roadmap de resolução e checkpoints de execução

1. **CP4a — acesso à ação (feito no código, precisa de QA):** adicionar atalho sem remover a narrativa; destino do link com título associado; conferir nomes e foco. No modo animado, somente o quadro atual recebe eventos de ponteiro, evitando camadas transparentes sobre o atalho. Saída: primeira tela tem caminho visível e tocável para ambas as opções finais.
2. **CP4b — semântica e teclado (feito no código, precisa de QA):** manter todos os quadros na árvore acessível durante efeitos de opacidade; permitir foco/rolagem no conteúdo principal; expor o progresso apenas por etapa. Saída: nenhum conteúdo depende da animação para ser lido.
3. **CP4c — mobile e continuidade (parcial):** alinhar unidades do palco, considerar safe areas e persistir tema; usar fonte local do sistema na rota de entrada. Saída: implementação pronta para exportar, sem afirmar compatibilidade até a prova em dispositivos.
4. **CP5a — regressão visual e funcional (parcial):** o encaminhamento `/leitura` → `/leitura/escolher` foi confirmado em preview do Expo Web e a lista de livros renderiza. Medidos nove viewports: 320×640, 360×800, 375×812, 390×844, 414×896, 768×1024, 1024×768, 1280×800 e 1440×900. Em todos, a chamada do primeiro quadro ficou dentro do viewport, os elementos da seção final ficaram dentro da largura disponível e não houve overflow horizontal. Em 320×640, o atalho chegou à seção final, focou o título e o CTA bíblico abriu o seletor; Voltar retornou à seção final. Em 390×844, o foco visível e o destino do atalho também foram confirmados. Este navegador está com `prefers-reduced-motion` ativo, então a sequência aparece em leitura contínua e o controle manual fica oculto; falta testar animação ligada e alternância manual com preferência normal. Ainda faltam toque real, Safari iOS, Chrome Android, navegador embutido de QR, safe areas físicas e repetição em aparelhos reais.
5. **CP5b — acessibilidade (pendente):** navegar apenas por teclado; testar VoiceOver (Safari/iOS) e NVDA (Firefox ou Chrome); conferir ordem de headings, semântica/valores do progressbar, foco após âncora, busca de frase e `prefers-reduced-motion` ligado/desligado.
6. **CP5c — aparelho e rede (pendente):** testar Safari iOS, Chrome Android e ao menos um navegador embutido de QR; repetir com barras do navegador abertas/fechadas, safe areas, rede lenta e fontes externas bloqueadas. Salvar capturas e resultados do painel de rede.
7. **Gate CP5 — aceitar ou corrigir:** só marcar QA concluído quando não houver bloqueador de conteúdo oculto, CTA inacessível, corte/overflow, navegação travada, erro de rota ou pedido externo não planejado. Registrar falhas e repetir apenas os casos afetados depois do ajuste.
8. **CP6/CP7 continuam bloqueados pelos gates existentes:** revisão editorial/pastoral, responsável, direitos, domínio, privacidade e operação do impresso não são inferidos por esta implementação. Nada desta branch autoriza produção, DNS, divulgação do QR ou impressão.

### Critérios de aceite para esta revisão

- Um visitante pode abrir a continuação a partir do primeiro quadro em um gesto, sem ser obrigado a percorrer dez telas.
- Com animação ligada, todas as frases permanecem acessíveis e na ordem; teclado consegue mover o scrollport e o foco é visível.
- No modo animado, quadros transparentes inativos não interceptam o atalho ou os controles visíveis; confirmar acionamento por toque/clique em CP5.
- O indicador anuncia uma posição por quadro, tem nome e valores acessíveis, sem `aria-live` a cada atualização de rolagem.
- As dimensões são legíveis em largura de 320 px e com zoom; nenhum elemento fixo encobre o foco ou a chamada.
- A preferência do tema sobrevive a uma nova visita no mesmo navegador e a página segue utilizável se armazenamento falhar.
- `/conhecer` abriu e apresentou as três leituras introdutórias e doze temas no Expo Web. O defeito de `/leitura` foi corrigido e retestado: após o fallback para a rota canônica, a URL chegou a `/leitura/escolher` e a lista de livros apareceu. O CP5 continua incompleto até os testes de viewport/touch e a revisão em aparelhos e leitores de tela.
- Landing raiz não precisa de Google Fonts para exibir o conteúdo; nos nove viewports listados, a chamada inicial ficou visível e não houve overflow horizontal; o atalho e o CTA bíblico funcionaram nas larguras 320 e 390 px testadas. O preview usou movimento reduzido. Compatibilidade em aparelhos, toque com animação ligada, modo contínuo acionado manualmente e leitores de tela ainda precisam de evidência no CP5.
- Conteúdo da narrativa continua explicitamente como rascunho até aprovação pastoral; referências não ganham links para ACF sem resolver direitos e destino.
