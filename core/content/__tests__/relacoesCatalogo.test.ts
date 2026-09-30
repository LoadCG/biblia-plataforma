import { errosRelacoesCatalogo, relacoesCatalogo } from "../relacoesCatalogo";

describe("relações do catálogo", () => {
  it("mantém relações rastreáveis para os planos existentes", () => {
    expect(relacoesCatalogo.length).toBeGreaterThan(0);
    expect(errosRelacoesCatalogo).toEqual([]);
  });
});
