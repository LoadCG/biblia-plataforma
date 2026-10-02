const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const contratos = [
  ["app/onboarding.tsx", 'accessibilityRole="progressbar"'],
  ["app/onboarding.tsx", "accessibilityValue={{ min: 1"],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Buscar na Bíblia e nos resumos"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Limpar busca"'],
  ["components/EstadoCarregando.tsx", 'accessibilityLabel={rotulo}'],
  ["app/(tabs)/pesquisa.tsx", 'rotulo="Buscando resultados"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLiveRegion="polite"'],
  ["app/salvo.tsx", 'accessibilityLabel="Buscar nos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar busca dos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar filtros e seleção"'],
  ["app/salvo.tsx", 'accessibilityLabel="Nome da nova coleção"'],
  ["app/planos/index.tsx", 'accessibilityRole="progressbar"'],
  ["app/planos/index.tsx", 'accessibilityHint="Abre o plano de leitura guiado"'],
  ["app/planos/[id].tsx", 'rotulo="Carregando progresso do plano"'],
  ["app/planos/[id].tsx", 'titulo="Não foi possível carregar seu progresso"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Copiar versículos selecionados"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Compartilhar versículos selecionados"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Carregando capítulo"'],
  ["app/(tabs)/biblia/escolher/[livro]/[capitulo].tsx", 'rotulo="Carregando versículos"'],
  ["app/estatisticas.tsx", 'rotulo="Carregando estatísticas"'],
  ["app/estatisticas.tsx", 'accessibilityRole="summary"'],
  ["components/PopoverVersiculo.tsx", 'rotulo="Carregando referência bíblica"'],
  ["components/CardVersiculoTema.tsx", 'rotulo="Carregando versículo"'],
  ["components/CardVersiculoDia.tsx", 'rotulo="Carregando versículo do dia"'],
  ["components/EstadoErro.tsx", 'accessibilityRole="alert"'],
  ["components/EstadoErro.tsx", "min-h-11 justify-center rounded-full"],
  ["app/planos/index.tsx", "Progresso indisponível"],
  ["app/planos/index.tsx", "progresso !== null && diasConcluidos !== null"],
  ["app/resumos/index.tsx", 'accessibilityLabel="Buscar nos resumos"'],
  ["app/resumos/index.tsx", 'accessibilityLabel="Limpar busca dos resumos"'],
  ["app/configuracoes.tsx", 'accessibilityRole="header"'],
  ["app/resumos/index.tsx", 'accessibilityRole="header"'],
  ["components/EstadoVazio.tsx", 'accessibilityRole="summary"'],
  ["components/EstadoVazio.tsx", 'accessibilityLiveRegion="polite"'],
  ["components/Toast.tsx", 'accessibilityRole="alert"'],
  ["components/Toast.tsx", 'accessibilityHint="Ativa a ação antes que o aviso desapareça"'],
  ["app/(tabs)/_layout.tsx", 'min-h-[44px]'],
];

for (const [arquivo, trecho] of contratos) {
  const conteudo = fs.readFileSync(path.join(raiz, arquivo), "utf8");
  if (!conteudo.includes(trecho)) throw new Error(`Contrato de acessibilidade ausente em ${arquivo}: ${trecho}`);
}

console.log(`Acessibilidade: ${contratos.length} contratos críticos verificados.`);
