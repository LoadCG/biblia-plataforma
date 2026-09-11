const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const contratos = [
  ["app/onboarding.tsx", 'accessibilityRole="progressbar"'],
  ["app/onboarding.tsx", "accessibilityValue={{ min: 1"],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Buscar na Bíblia e nos resumos"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Limpar busca"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLabel="Buscando resultados"'],
  ["app/(tabs)/pesquisa.tsx", 'accessibilityLiveRegion="polite"'],
  ["app/salvo.tsx", 'accessibilityLabel="Buscar nos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar busca dos itens salvos"'],
  ["app/salvo.tsx", 'accessibilityLabel="Limpar filtros e seleção"'],
  ["app/salvo.tsx", 'accessibilityLabel="Nome da nova coleção"'],
  ["app/planos/index.tsx", 'accessibilityRole="progressbar"'],
  ["app/planos/index.tsx", 'accessibilityHint="Abre o plano de leitura guiado"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Copiar versículos selecionados"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Compartilhar versículos selecionados"'],
  ["app/(tabs)/biblia/[livro]/[capitulo].tsx", 'accessibilityLabel="Carregando capítulo"'],
  ["app/(tabs)/biblia/escolher/[livro]/[capitulo].tsx", 'accessibilityLabel="Carregando versículos"'],
  ["app/estatisticas.tsx", 'accessibilityLabel="Carregando estatísticas"'],
  ["components/PopoverVersiculo.tsx", 'accessibilityLabel="Carregando referência bíblica"'],
  ["components/CardVersiculoTema.tsx", 'accessibilityLabel="Carregando versículo"'],
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
