const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const contratos = [
  ["app/(tabs)/_layout.tsx", ["min-h-[44px]", "accessibilityRole=\"tab\""]],
  ["app/(tabs)/pesquisa.tsx", ["testID=\"busca-descubra\"", "testID=\"limpar-busca-descubra\"", "pr-12"]],
  ["app/salvo.tsx", ["testID=\"busca-salvo\"", "testID=\"limpar-busca-salvo\"", "testID=\"limpar-filtros-salvo\""]],
  ["app/resumos/index.tsx", ["testID=\"busca-resumos\"", "testID=\"limpar-busca-resumos\""]],
  ["app/estatisticas.tsx", ["testID=\"estatisticas-grade\"", "min-w-0", "flex-row flex-wrap"]],
  ["app/planos/index.tsx", ["accessibilityRole=\"progressbar\"", "accessibilityValue"]],
  ["app/planos/[id].tsx", ["Carregando progresso do plano", "Não foi possível carregar seu progresso", "disabled={acaoEmAndamento !== null}"]],
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

console.log(`UI responsiva: ${contratos.length} superfícies e contratos estruturais verificados.`);
