const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const planos = JSON.parse(fs.readFileSync(path.join(raiz, "core", "content", "dados", "planos.json"), "utf8"));
const livros = JSON.parse(fs.readFileSync(path.join(raiz, "core", "content", "dados", "livros.json"), "utf8"));
const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const capitulos = new Map(livros.map((livro) => [normalizar(livro.nome), livro.capitulos]));

for (const plano of planos) {
  if (!Number.isInteger(plano.duracaoDias) || plano.dias.length !== plano.duracaoDias) throw new Error(`${plano.id}: duração inconsistente.`);
  const dias = new Set(plano.dias.map((dia) => dia.dia));
  for (let dia = 1; dia <= plano.duracaoDias; dia++) if (!dias.has(dia)) throw new Error(`${plano.id}: falta o dia ${dia}.`);
  for (const dia of plano.dias) {
    for (const referencia of dia.referencias) {
      const match = referencia.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
      if (!match) throw new Error(`${plano.id}, dia ${dia.dia}: referência inválida (${referencia}).`);
      const maximo = capitulos.get(normalizar(match[1]));
      if (!maximo || Number(match[2]) > maximo || Number(match[3] || 1) < 1) throw new Error(`${plano.id}, dia ${dia.dia}: capítulo fora do cânon (${referencia}).`);
    }
  }
}
console.log(`Planos editoriais verificados: ${planos.length} planos e referências dentro dos capítulos existentes.`);
