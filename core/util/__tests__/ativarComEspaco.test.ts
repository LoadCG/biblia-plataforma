import { ativarComEspaco, navegarGrupoRadio } from "../ativarComEspaco";

describe("ativação de switches por teclado", () => {
  it.each([" ", "Spacebar"])("ativa com a tecla %s e impede a rolagem da página", (key) => {
    const acao = jest.fn();
    const preventDefault = jest.fn();

    ativarComEspaco({ key, preventDefault }, acao);

    expect(acao).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("aceita a forma nativeEvent usada por React Native", () => {
    const acao = jest.fn();
    ativarComEspaco({ nativeEvent: { key: " " } }, acao);
    expect(acao).toHaveBeenCalledTimes(1);
  });

  it("não duplica a ativação de Enter nem interfere em outras teclas", () => {
    const acao = jest.fn();
    const preventDefault = jest.fn();
    ativarComEspaco({ key: "Enter", preventDefault }, acao);
    ativarComEspaco({ key: "ArrowDown", preventDefault }, acao);
    expect(acao).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it.each([["ArrowRight", 1], ["ArrowDown", 1], ["ArrowLeft", 2], ["ArrowUp", 2]])(
    "move para a opção correta com %s e envolve o grupo",
    (key, esperado) => {
      const selecionar = jest.fn();
      const preventDefault = jest.fn();

      expect(navegarGrupoRadio({ key, preventDefault }, 0, 3, selecionar)).toBe(true);
      expect(selecionar).toHaveBeenCalledWith(esperado);
      expect(preventDefault).toHaveBeenCalledTimes(1);
    }
  );
});
