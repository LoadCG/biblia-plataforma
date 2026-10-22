export type DiaSequencia = {
  data: Date;
  etiqueta: string;
  ativo: boolean;
  hoje: boolean;
};

export type ResumoSequencia = {
  atual: number;
  recorde: number;
  leuHoje: boolean;
  diasAtivosSemana: number;
  semana: DiaSequencia[];
};

const FORMATAR_DIA_CURTO = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

function inicioDoDia(data: Date): Date {
  const dia = new Date(data);
  dia.setHours(0, 0, 0, 0);
  return dia;
}

function proximoDia(diaTimestamp: number): number {
  const dia = new Date(diaTimestamp);
  dia.setDate(dia.getDate() + 1);
  return dia.getTime();
}

function interpretarDataLeitura(dataISO: string): Date {
  const dataCalendario = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataISO);
  if (dataCalendario) {
    const [, anoTexto, mesTexto, diaTexto] = dataCalendario;
    const ano = Number(anoTexto);
    const mes = Number(mesTexto);
    const dia = Number(diaTexto);
    const dataLocal = new Date(0);
    dataLocal.setFullYear(ano, mes - 1, dia);
    dataLocal.setHours(0, 0, 0, 0);

    // Um valor sem horário representa uma data do calendário, não meia-noite UTC.
    // Conferir os campos também impede que datas inválidas sejam normalizadas pelo Date.
    if (dataLocal.getFullYear() !== ano || dataLocal.getMonth() !== mes - 1 || dataLocal.getDate() !== dia) {
      return new Date(Number.NaN);
    }
    return dataLocal;
  }

  return new Date(dataISO);
}

/** Calcula sequência atual, recorde e atividade da semana no calendário local. */
export function resumirSequencia(datasISO: readonly string[], agora = new Date()): ResumoSequencia {
  const hoje = inicioDoDia(agora);
  const hojeTimestamp = hoje.getTime();
  const diasLidos = new Set<number>();
  for (const dataISO of datasISO) {
    const instante = interpretarDataLeitura(dataISO);
    if (Number.isNaN(instante.getTime())) continue;
    const dia = inicioDoDia(instante).getTime();
    if (dia <= hojeTimestamp) diasLidos.add(dia);
  }

  const leuHoje = diasLidos.has(hojeTimestamp);

  let cursorAtual = new Date(hoje);
  if (!leuHoje) cursorAtual.setDate(cursorAtual.getDate() - 1);
  let atual = 0;
  while (diasLidos.has(cursorAtual.getTime())) {
    atual++;
    cursorAtual.setDate(cursorAtual.getDate() - 1);
  }

  const diasOrdenados = Array.from(diasLidos).sort((a, b) => a - b);
  let recorde = 0;
  let sequenciaHistorica = 0;
  let diaAnterior: number | null = null;
  for (const dia of diasOrdenados) {
    sequenciaHistorica = diaAnterior !== null && proximoDia(diaAnterior) === dia
      ? sequenciaHistorica + 1
      : 1;
    recorde = Math.max(recorde, sequenciaHistorica);
    diaAnterior = dia;
  }

  const semana: DiaSequencia[] = [];
  for (let deslocamento = -6; deslocamento <= 0; deslocamento++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + deslocamento);
    semana.push({
      data,
      etiqueta: FORMATAR_DIA_CURTO.format(data),
      ativo: diasLidos.has(data.getTime()),
      hoje: deslocamento === 0,
    });
  }

  return {
    atual,
    recorde,
    leuHoje,
    diasAtivosSemana: semana.filter((dia) => dia.ativo).length,
    semana,
  };
}

// Mantém a API usada pelos consumidores que só precisam do número atual.
export function calcularSequenciaAtual(datasISO: string[], agora = new Date()): number {
  return resumirSequencia(datasISO, agora).atual;
}
