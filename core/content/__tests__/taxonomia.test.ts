import { metadadosLegadosDoLivro, publicosEditoriais, statusEditorial, temasEditoriais } from "../taxonomia";

describe("taxonomia editorial", () => {
  it("expõe vocabulário controlado estável", () => {
    expect(statusEditorial).toContain("publicado");
    expect(publicosEditoriais).toContain("iniciante");
    expect(temasEditoriais).toContain("esperança");
  });

  it("gera metadados estáveis para conteúdo legado", () => {
    const metadata = metadadosLegadosDoLivro({ slug: "01-genesis", genero: "Lei", testamento: "Antigo Testamento" } as never);
    expect(metadata).toEqual({
      id: "resumo:01-genesis",
      versao: 1,
      status: "publicado",
      tags: ["lei", "antigo-testamento"],
      publico: "contexto",
    });
  });
});
