const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const contratos = [
  ["global.css", ["@media (hover: hover) and (pointer: fine)", "@media (prefers-reduced-motion: reduce)", "transition: opacity 150ms ease-out", "opacity: 0.92", "[data-selecao-arrasto=\"true\"] [data-capitulo]", "cursor: grab", "cursor: grabbing", "-webkit-user-select: none"]],
  ["app/(tabs)/pesquisa.tsx", ["useArrastarParaRolar", "ref={conectarFiltroLivro}", "refScrollFiltroLivro.current?.scrollTo({ x: 0, animated: true })"]],
  ["app/(tabs)/_layout.tsx", ["min-h-[44px]", "accessibilityRole=\"tab\""]],
  ["app/(tabs)/pesquisa.tsx", ["testID=\"busca-descubra\"", "testID=\"limpar-busca-descubra\"", "pr-12", "desktop ? \"flex-row items-center p-7\" : \"p-5\"", "desktop ? \"flex-row items-start gap-8\" : undefined", "mb-3 w-full flex-row items-center gap-3"]],
  ["app/(tabs)/pesquisa.tsx", ["min-h-11 justify-center px-3 rounded-full", "min-h-11 rounded-full border border-cor-borda dark:border-cor-borda-dark px-4 items-center justify-center"]],
  ["app/salvo.tsx", ["min-h-11 flex-row items-center gap-1.5 mb-4 rounded-full"]],
  ["components/CardVersiculoDia.tsx", ['accessibilityLabel="Tentar novamente" className="min-h-11 justify-center'] ],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", ["min-h-11 flex-row gap-1 bg-cor-borda dark:bg-cor-borda-dark px-4 rounded-lg"]],
  ["app/salvo.tsx", ["accessibilityLabel=\"Limpar filtros\"", "accessibilityLabel=\"Voltar para seu perfil\"", "const possuiFiltrosAtivos = Boolean(termo.trim() || filtro !== \"todos\" || ordem !== \"recentes\" || colecaoFiltro)", "min-h-11"]],
  ["app/(tabs)/index.tsx", ["lg:flex-row lg:items-start lg:gap-6", "lg:flex-[1.2] lg:min-w-0", "lg:flex-[0.85] lg:min-w-0 lg:pt-1", "lg:w-16 lg:h-14 lg:ml-1 xl:w-28 xl:h-20 xl:ml-2"]],
  ["app/(tabs)/index.tsx", ['accessibilityLabel="Ver todas as estatísticas"', "min-h-11 self-center justify-center"]],
  ["app/(tabs)/voce.tsx", ['accessibilityLabel="Saiba mais sobre privacidade"', "min-h-11 flex-row items-center", 'accessibilityLabel="Ver toda a atividade salva"', 'accessibilityLabel="Começar leitura bíblica"']],
  ["app/medalhas.tsx", ["min-h-11 justify-center active:opacity-70", "accessibilityLabel={`Abrir resumo de ${livro.nome}`}" ]],
  ["app/salvo.tsx", ["testID=\"busca-salvo\"", "testID=\"limpar-busca-salvo\"", "testID=\"limpar-filtros-salvo\""]],
  ["app/resumos/index.tsx", ["testID=\"busca-resumos\"", "testID=\"limpar-busca-resumos\""]],
  ["app/resumos/index.tsx", ["useFocusEffect", "Carregando seu progresso de leitura…", "Progresso indisponível", "placeholder=\"Buscar livro ou palavra\"", "accessibilityLabel=\"Voltar para início\"", "min-h-11 justify-center self-start"]],
  ["app/resumos/[livro].tsx", ["accessibilityLabel=\"Voltar para todos os resumos\"", "min-h-11 justify-center pr-3"]],
  ["app/configuracoes.tsx", ["accessibilityLabel=\"Voltar para seu perfil\"", "min-h-11 justify-center pr-3"]],
  ["app/estatisticas.tsx", ["accessibilityLabel=\"Voltar para início\"", "min-h-11 justify-center pr-3"]],
  ["app/sobre.tsx", ["accessibilityLabel=\"Voltar para seu perfil\"", "min-h-11 justify-center pr-3"]],
  ["app/estatisticas.tsx", ["testID=\"estatisticas-grade\"", "min-w-0", "flex-row flex-wrap"]],
  ["app/planos/index.tsx", ["accessibilityRole=\"progressbar\"", "accessibilityValue"]],
  ["app/planos/[id].tsx", ["Carregando progresso do plano", "Não foi possível carregar seu progresso", "disabled={acaoEmAndamento !== null}"]],
  ["components/CardVersiculoTema.tsx", ["border-cor-borda dark:border-cor-borda-dark", "hrefReferenciaBiblica(referencia)", "open-book"]],
  ["components/BotaoMais.tsx", ["min-w-11 min-h-11", "web:hover:bg-cor-borda/60", "focus-visible:ring-2"]],
  ["app/planos/index.tsx", ["accessibilityLabel={`${plano.duracaoDias} dias, público ${plano.editorial?.publico ?? \"geral\"}`}"]],
];

for (const [arquivo, trechos] of contratos) {
  const conteudo = fs.readFileSync(path.join(raiz, arquivo), "utf8");
  for (const trecho of trechos) {
    if (!conteudo.includes(trecho)) {
      throw new Error(`Contrato de UI ausente em ${arquivo}: ${trecho}`);
    }
  }
}

const estatisticas = fs.readFileSync(path.join(raiz, "app/estatisticas.tsx"), "utf8");
if (estatisticas.includes("min-w-[140px]")) {
  throw new Error("Estatísticas voltou a impor largura mínima rígida.");
}

const biblioteca = fs.readFileSync(path.join(raiz, "app/salvo.tsx"), "utf8");
const acaoLimparFiltros = biblioteca.match(/function limparFiltros\(\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";
if (!acaoLimparFiltros || acaoLimparFiltros.includes("setSelecionados") || acaoLimparFiltros.includes("setModoSelecao")) {
  throw new Error("Limpar filtros não deve cancelar a seleção de itens da biblioteca.");
}

console.log(`UI responsiva: ${contratos.length} superfícies e contratos estruturais verificados.`);
