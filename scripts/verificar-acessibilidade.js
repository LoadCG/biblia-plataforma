const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const contratos = [
  ["app/onboarding.tsx", 'accessibilityRole="progressbar"'],
  ["app/onboarding.tsx", "accessibilityValue={{ min: 1"],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Buscar na Bíblia e nos resumos"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityState={{ checked: favoritada, disabled: salvandoFavorita || !ownerId, busy: salvandoFavorita }}'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel={salvandoFavorita ? "Salvando busca favorita" : favoritada ? "Remover busca dos favoritos" : "Favoritar esta busca"}'],
  ["app/(tabs)/pesquisa.tsx", 'rotulo="Carregando buscas favoritas"'],
  ["app/(tabs)/pesquisa.tsx", 'titulo="Não foi possível carregar suas buscas favoritas"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityHint={atalho.destino === "salvos" ? "Abre seus versículos salvos" : "Abre as orientações de uso"}'],
  ["app/(tabs)/leitura/escolher/index.tsx", 'accessibilityLabel="Buscar livro da Bíblia"'],
  ["app/(tabs)/leitura/escolher/index.tsx", 'accessibilityLabel={modoIntervalo ? "Cancelar seleção por intervalo" : "Selecionar intervalo de capítulos"}'],
  ["app/(tabs)/leitura/escolher/index.tsx", 'accessibilityLiveRegion="polite"'],
  ["components/GradeCapitulos.tsx", "Toque no primeiro e no último capítulo para selecionar o intervalo."],
  ["app/ajuda.tsx", 'accessibilityRole="header"'],
  ["app/ajuda.tsx", 'accessibilityRole="link"'],
  ["app/privacidade.tsx", 'accessibilityRole="header"'],
  ["app/privacidade.tsx", 'accessibilityHint="Abre as opções de exportação e exclusão dos seus dados"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Limpar busca"'],
  ["components/EstadoCarregando.tsx", 'accessibilityLabel={rotulo}'],
  ["components/SemanaSequencia.tsx", 'accessibilityRole="text"'],
  ["components/SemanaSequencia.tsx", "sem leitura marcada"],
  ["components/DicaContextual.tsx", 'accessibilityState={{ disabled: salvando, busy: salvando }}'],
  ["components/DicaContextual.tsx", "min-h-11 min-w-11 justify-center"],
  ["components/DicaContextual.tsx", 'accessibilityLabel="Tentar carregar a dica novamente"'],
  ["app/(tabs)/pesquisa.tsx", 'rotulo="Buscando resultados"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLiveRegion="polite"'],
  ["app/salvo.tsx", 'accessibilityLabel="Buscar nos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar busca dos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar filtros"'],
  ["app/salvo.tsx", 'accessibilityLabel="Voltar para seu perfil"'],
  ["app/resumos/index.tsx", 'accessibilityLabel="Voltar para início"'],
  ["app/resumos/[livro].tsx", 'accessibilityLabel="Voltar para todos os resumos"'],
  ["app/resumos/[livro].tsx", 'accessibilityRole="checkbox"'],
  ["app/resumos/[livro].tsx", 'accessibilityLabel={lido ? "Desmarcar livro como lido" : "Marcar livro como lido"}'],
  ["app/resumos/[livro].tsx", 'rotulo="Carregando seu progresso neste livro"'],
  ["app/resumos/[livro].tsx", 'titulo="Não foi possível carregar seu progresso neste livro"'],
  ["app/configuracoes.tsx", 'accessibilityLabel="Voltar para seu perfil"'],
  ["app/estatisticas.tsx", 'accessibilityLabel="Voltar para início"'],
  ["app/sobre.tsx", 'accessibilityLabel="Voltar para seu perfil"'],
  ["app/(tabs)/biblia.tsx", 'accessibilityLabel="Ver todas as estatísticas"'],
  ["app/(tabs)/voce.tsx", 'accessibilityLabel="Saiba mais sobre privacidade"'],
  ["app/(tabs)/voce.tsx", 'accessibilityLabel="Ver toda a atividade salva"'],
  ["components/CardStreak.tsx", 'accessibilityLabel={acao.nomeAcessivel}'],
  ["app/medalhas.tsx", 'accessibilityLabel={`Abrir resumo de ${livro.nome}`}'],
  ["app/salvo.tsx", 'accessibilityLabel="Nome da nova coleção"'],
  ["app/planos/index.tsx", 'accessibilityRole="progressbar"'],
  ["app/planos/index.tsx", 'accessibilityHint="Abre o plano de leitura guiado"'],
  ["app/planos/[id].tsx", 'rotulo="Carregando progresso do plano"'],
  ["app/planos/[id].tsx", 'titulo="Não foi possível carregar seu progresso"'],
  ["app/medalhas.tsx", 'rotulo="Carregando seu progresso de leitura"'],
  ["app/medalhas.tsx", 'titulo="Não foi possível carregar seu progresso"'],
  ["app/medalhas.tsx", 'accessibilityRole="progressbar"'],
  ["app/medalhas.tsx", "accessibilityValue={{ min: 0, max: conquistaAtiva.progressoTotal"],
  ["app/medalhas.tsx", 'accessibilityHint="Abre os detalhes deste marco de leitura"'],
  ["app/medalhas.tsx", "obterDestinoVoltaMedalhas(origem, detalheSelecionado)"],
  ["app/medalhas.tsx", 'accessibilityLabel={detalheSelecionado'],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", 'accessibilityLabel="Copiar versículos selecionados"'],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", 'accessibilityLabel="Compartilhar versículos selecionados"'],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", "accessibilityHint={selecionado ? \"Ative para remover este versículo da seleção.\""],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", "formatarFaixasVersiculos(numerosSelecionados)"],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", 'accessibilityLabel="Ver mais ações"'],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", 'accessibilityLabel="Ver ações anteriores"'],
  ["app/(tabs)/leitura/[livro]/[capitulo].tsx", 'accessibilityLabel="Carregando capítulo"'],
  ["app/(tabs)/leitura/escolher/[livro]/[capitulo].tsx", 'rotulo="Carregando versículos"'],
  ["app/(tabs)/leitura/escolher/[livro]/[capitulo].tsx", 'rotuloEstado="grifado"'],
  ["app/estatisticas.tsx", 'rotulo="Carregando estatísticas"'],
  ["app/estatisticas.tsx", 'accessibilityRole="summary"'],
  ["components/PopoverVersiculo.tsx", 'rotulo="Carregando referência bíblica"'],
  ["components/CardVersiculoTema.tsx", 'rotulo="Carregando versículo"'],
  ["components/CardVersiculoTema.tsx", 'accessibilityHint={`Abre ${dados.referencia} na Bíblia`}'],
  ["components/CardVersiculoTema.tsx", "focus-visible:ring-2"],
  ["components/CardVersiculoDia.tsx", 'rotulo="Carregando versículo do dia"'],
  ["components/BotaoMais.tsx", 'accessibilityState={{ disabled: desabilitado, expanded: aberto }}'],
  ["components/BotaoMais.tsx", 'accessibilityHint={dica}'],
  ["components/CardVersiculoDia.tsx", 'testID="botao-mais-versiculo-dia"'],
  ["components/EstadoErro.tsx", 'accessibilityRole="alert"'],
  ["components/EstadoErro.tsx", "min-h-11 justify-center rounded-full"],
  ["app/planos/index.tsx", "Progresso indisponível"],
  ["app/planos/index.tsx", "progresso !== null && diasConcluidos !== null"],
  ["app/planos/[id].tsx", 'className="min-h-11 justify-center pr-3 active:opacity-70"'],
  ["app/planos/[id].tsx", "min-h-11 flex-row items-center justify-center gap-1.5"],
  ["app/planos/[id].tsx", 'className="min-h-11 justify-center active:opacity-70"'],
  ["app/planos/[id].tsx", "mt-3 min-h-11 justify-center rounded-full"],
  ["app/planos/[id].tsx", 'accessibilityRole="progressbar"'],
  ["app/planos/[id].tsx", 'accessibilityLabel={`Progresso de ${plano.titulo}`}'],
  ["app/planos/[id].tsx", "now: Math.min(diasConcluidos.size, plano.duracaoDias)"],
  ["app/(tabs)/pesquisa.tsx", 'className="self-start min-h-11 justify-center mb-3 pr-3 active:opacity-60"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel={`Começar leitura em ${temaSelecionado.referencias[0]}`}'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityHint={`Abre as leituras sobre ${relacionado.titulo}`}'],
  ["app/(tabs)/pesquisa.tsx", "Leituras para explorar"],
  ["app/(tabs)/pesquisa.tsx", "Continue explorando"],
  ["app/resumos/index.tsx", 'accessibilityLabel="Buscar nos resumos"'],
  ["app/resumos/index.tsx", 'accessibilityLabel="Limpar busca dos resumos"'],
  ["app/configuracoes.tsx", 'accessibilityRole="header"'],
  ["app/resumos/index.tsx", 'accessibilityRole="header"'],
  ["components/EstadoVazio.tsx", 'accessibilityRole="summary"'],
  ["components/EstadoVazio.tsx", 'accessibilityLiveRegion="polite"'],
  ["components/Toast.tsx", 'accessibilityRole="alert"'],
  ["components/Toast.tsx", 'accessibilityHint="Ativa a ação antes que o aviso desapareça"'],
  ["components/Toast.tsx", "min-h-11 min-w-11 justify-center"],
  ["app/(tabs)/_layout.tsx", 'min-h-[44px]'],
];

for (const [arquivo, trecho] of contratos) {
  const conteudo = fs.readFileSync(path.join(raiz, arquivo), "utf8");
  if (!conteudo.includes(trecho)) throw new Error(`Contrato de acessibilidade ausente em ${arquivo}: ${trecho}`);
}

const landingPath = path.join(raiz, "components/LandingEvangelismo.web.tsx");
const landing = fs.readFileSync(landingPath, "utf8");
const contratosLanding = [
  ["a área principal pode receber foco de teclado", /<main\b(?=[^>]*\btabIndex=\{0\})[^>]*>/s],
  ["a narrativa completa tem região própria para tecnologia assistiva", /<section\b(?=[^>]*className="landing-transcricao")(?=[^>]*aria-label=)[^>]*>/s],
  ["a narrativa mantém uma hierarquia de título principal e subseções", /const Tag = indice === 0 \? "h1" : "h2"/],
  ["a apresentação animada fica fora da árvore acessível", /<section\b(?=[^>]*className="landing-sequencia")(?=[^>]*aria-hidden="true")[^>]*>/s],
  ["o estado atual é anunciado sem interromper a leitura", /role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/s],
  ["o progresso declara papel e limites acessíveis", /role="progressbar"[^>]*aria-label=[^>]*aria-valuemin=\{1\}[^>]*aria-valuemax=\{QUADROS\.length\}[^>]*aria-valuenow=\{quadroAtual \+ 1\}/s],
  ["o controle de tema expõe o nome da ação", /className="landing-botao-tema"[\s\S]{0,180}aria-label=\{temaClaro \?/],
  ["o controle alternativo de leitura reflete seu estado", /className="landing-botao-leitura"[\s\S]{0,260}aria-pressed=\{leituraContinua\}/],
  ["a preferência de movimento reduzido é consultada", /const reducaoDeMovimento = useReducedMotion\(\)/],
  ["a preferência reduzida desativa a sequência guiada", /const animacaoAtiva = !leituraContinua && reducaoDeMovimento !== true/],
];

for (const [descricao, padrao] of contratosLanding) {
  if (!padrao.test(landing)) throw new Error(`Contrato de acessibilidade ausente na landing: ${descricao}`);
}

const estilosLanding = fs.readFileSync(path.join(raiz, "global.css"), "utf8");
if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]{0,180}\.landing-evangelismo, \.landing-evangelismo \*/.test(estilosLanding)) {
  throw new Error("Contrato de acessibilidade ausente na landing: CSS respeita a preferência por movimento reduzido");
}

console.log(`Acessibilidade: ${contratos.length + contratosLanding.length + 1} contratos críticos verificados.`);
