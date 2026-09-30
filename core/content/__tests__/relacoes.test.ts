import { validarRelacoesEditorial, type RelacaoEditorial } from "../relacoes";

describe("relações editoriais", () => {
  const base: RelacaoEditorial = { origem: "resumo:01-genesis", destino: "resumo:02-exodo", tipo: "leia-tambem", motivo: "continuidade narrativa" };

  it("aceita relação rastreável entre IDs existentes", () => {
    expect(validarRelacoesEditorial([base], new Set(["resumo:01-genesis", "resumo:02-exodo"]))).toEqual([]);
  });

  it("detecta duplicidade, destino inválido e auto-relação", () => {
    const erros = validarRelacoesEditorial([
      base, base,
      { ...base, destino: "resumo:inexistente" },
      { ...base, destino: "resumo:01-genesis" },
    ], new Set(["resumo:01-genesis", "resumo:02-exodo"]));
    expect(erros).toEqual(expect.arrayContaining([
      "relação duplicada: resumo:01-genesis->resumo:02-exodo:leia-tambem",
      "destino inexistente: resumo:inexistente",
      "auto-relação inválida: resumo:01-genesis->resumo:01-genesis:leia-tambem",
    ]));
  });
});
