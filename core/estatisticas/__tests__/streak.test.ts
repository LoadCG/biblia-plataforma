import { calcularSequenciaAtual, resumirSequencia } from "../streak";

function dataLocal(dia: number, hora = 12) {
  return new Date(2026, 9, dia, hora).toISOString();
}

describe("sequência de leitura", () => {
  it("deduplica capítulos lidos no mesmo dia e reconhece a leitura de hoje", () => {
    const agora = new Date(2026, 9, 15, 20);
    const resumo = resumirSequencia([dataLocal(14), dataLocal(15, 8), dataLocal(15, 19)], agora);

    expect(resumo.atual).toBe(2);
    expect(resumo.recorde).toBe(2);
    expect(resumo.leuHoje).toBe(true);
    expect(resumo.diasAtivosSemana).toBe(2);
  });

  it("mantém a sequência de ontem até o fim de hoje", () => {
    const resumo = resumirSequencia([dataLocal(14)], new Date(2026, 9, 15, 23, 59));

    expect(resumo.atual).toBe(1);
    expect(resumo.leuHoje).toBe(false);
    expect(resumo.semana.at(-1)).toMatchObject({ ativo: false, hoje: true });
  });

  it("encerra o ritmo atual após um dia inteiro sem leitura e preserva o recorde", () => {
    const datas = [dataLocal(1), dataLocal(2), dataLocal(3), dataLocal(12), dataLocal(14)];
    const resumo = resumirSequencia(datas, new Date(2026, 9, 16, 10));

    expect(resumo.atual).toBe(0);
    expect(resumo.recorde).toBe(3);
    expect(calcularSequenciaAtual(datas, new Date(2026, 9, 16, 10))).toBe(0);
  });

  it("ignora datas inválidas e retorna semana vazia sem atividade", () => {
    const resumo = resumirSequencia(["data inválida", ""], new Date(2026, 9, 15));

    expect(resumo.atual).toBe(0);
    expect(resumo.recorde).toBe(0);
    expect(resumo.diasAtivosSemana).toBe(0);
    expect(resumo.semana).toHaveLength(7);
    expect(resumo.semana.filter((dia) => dia.hoje)).toHaveLength(1);
  });

  it("não conta leituras com data futura", () => {
    const resumo = resumirSequencia([dataLocal(16)], new Date(2026, 9, 15, 10));

    expect(resumo.atual).toBe(0);
    expect(resumo.recorde).toBe(0);
    expect(resumo.diasAtivosSemana).toBe(0);
  });

  it("interpreta datas ISO sem horário como dias do calendário local", () => {
    const hoje = new Date(2026, 9, 15, 10);
    const resumo = resumirSequencia(["2026-10-15"], hoje);

    expect(resumo.atual).toBe(1);
    expect(resumo.leuHoje).toBe(true);
    expect(resumo.semana.at(-1)).toMatchObject({ ativo: true, hoje: true });
  });

  it("ignora uma data ISO sem horário que não existe no calendário", () => {
    const resumo = resumirSequencia(["2026-02-30"], new Date(2026, 1, 28, 10));

    expect(resumo.atual).toBe(0);
    expect(resumo.recorde).toBe(0);
  });

  it("mantém a sequência ao atravessar a virada de mês", () => {
    const datas = [new Date(2026, 9, 31, 12).toISOString(), new Date(2026, 10, 1, 12).toISOString()];
    const resumo = resumirSequencia(datas, new Date(2026, 10, 1, 20));

    expect(resumo.atual).toBe(2);
  });

  it("mantém dias consecutivos na mudança de horário de verão", () => {
    const datas = [
      new Date(2026, 2, 7, 12).toISOString(),
      new Date(2026, 2, 8, 12).toISOString(),
      new Date(2026, 2, 9, 12).toISOString(),
    ];
    const resumo = resumirSequencia(datas, new Date(2026, 2, 9, 20));

    expect(resumo.atual).toBe(3);
    expect(resumo.recorde).toBe(3);
  });
});
