import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { type PreferenciaAudio, resolverPreferenciaAudio } from "./preferenciaAudio";

export type VersiculoParaFala = { numero: number; texto: string };
export type EstadoAudio = "ocioso" | "iniciando" | "reproduzindo" | "pausando" | "pausado" | "interrompendo" | "interrompido" | "erro";

export type ObservadorAudio = {
  aoMudarEstado: (estado: EstadoAudio) => void;
  aoIniciarVersiculo: (numero: number | null) => void;
  aoErro: (mensagem: string) => void;
};

type SessaoAudio = {
  id: number;
  versiculos: VersiculoParaFala[];
  indiceAtual: number;
  observador: ObservadorAudio;
  estado: EstadoAudio;
  comandoPendente: boolean;
  geracaoFala: number;
  origem?: object;
  preferencia: PreferenciaAudio;
  tentouFallbackVoz: boolean;
};

let sessaoAtiva: SessaoAudio | null = null;
let proximoId = 0;
let filaNativa: Promise<void> = Promise.resolve();
let paradaNativaNecessaria = false;
let paradaNativaPendente: Promise<void> | null = null;
let geracaoParadaNativa = 0;

function marcarParadaNativaNecessaria() {
  geracaoParadaNativa += 1;
  paradaNativaNecessaria = true;
}

function serializarOperacaoNativa(operacao: () => void | Promise<void>): Promise<void> {
  const proxima = filaNativa.then(operacao);
  filaNativa = proxima.catch(() => {});
  return proxima;
}

export function suportaAudio(): boolean {
  if (Platform.OS === "web") return typeof window !== "undefined" && !!window.speechSynthesis && typeof SpeechSynthesisUtterance !== "undefined";
  return true;
}

export function suportaPausaAudio(): boolean {
  return Platform.OS !== "android";
}

function atualizarEstado(sessao: SessaoAudio, estado: EstadoAudio) {
  if (sessaoAtiva?.id !== sessao.id) return;
  sessao.estado = estado;
  sessao.observador.aoMudarEstado(estado);
}

function cancelarSintese(): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    return Promise.resolve();
  }
  return Speech.stop();
}

function solicitarParadaNativa(): Promise<void> {
  marcarParadaNativaNecessaria();
  const geracao = geracaoParadaNativa;
  const parada = serializarOperacaoNativa(cancelarSintese).then(() => {
    if (geracaoParadaNativa === geracao) paradaNativaNecessaria = false;
  });
  paradaNativaPendente = parada;
  void parada.then(
    () => { if (paradaNativaPendente === parada) paradaNativaPendente = null; },
    () => { if (paradaNativaPendente === parada) paradaNativaPendente = null; }
  );
  return parada;
}

async function garantirParadaNativa(): Promise<void> {
  if (paradaNativaPendente) await paradaNativaPendente;
  if (paradaNativaNecessaria) await solicitarParadaNativa();
}

function falarVersiculoAtual(sessao: SessaoAudio) {
  if (sessaoAtiva?.id !== sessao.id) return;
  const versiculo = sessao.versiculos[sessao.indiceAtual];
  if (!versiculo) {
    sessaoAtiva = null;
    sessao.observador.aoIniciarVersiculo(null);
    sessao.observador.aoMudarEstado("ocioso");
    return;
  }

  atualizarEstado(sessao, "iniciando");
  sessao.observador.aoIniciarVersiculo(versiculo.numero);
  const geracao = ++sessao.geracaoFala;

  const falaAtual = () => sessaoAtiva?.id === sessao.id && sessao.geracaoFala === geracao;
  const aoIniciarFala = () => {
    if (falaAtual()) atualizarEstado(sessao, "reproduzindo");
  };

  const aoConcluirVersiculo = () => {
    if (!falaAtual() || sessao.estado === "erro") return;
    sessao.indiceAtual += 1;
    falarVersiculoAtual(sessao);
  };

  const aoFalhar = () => {
    if (!falaAtual()) return;
    sessao.geracaoFala += 1;
    if (sessao.preferencia.vozId && !sessao.tentouFallbackVoz) {
      sessao.tentouFallbackVoz = true;
      sessao.preferencia = { ...sessao.preferencia, vozId: null };
      if (Platform.OS !== "web") marcarParadaNativaNecessaria();
      falarVersiculoAtual(sessao);
      return;
    }
    if (Platform.OS !== "web") marcarParadaNativaNecessaria();
    atualizarEstado(sessao, "erro");
    sessao.observador.aoErro("A leitura em voz alta foi interrompida. Tente novamente.");
  };

  const iniciar = () => {
    if (sessaoAtiva?.id !== sessao.id) return;
    try {
      if (Platform.OS === "web") {
        const utterance = new SpeechSynthesisUtterance(versiculo.texto);
        utterance.lang = "pt-BR";
        utterance.rate = sessao.preferencia.velocidade;
        if (sessao.preferencia.vozId) {
          const voz = window.speechSynthesis.getVoices().find((item) => item.voiceURI === sessao.preferencia.vozId);
          if (voz) utterance.voice = voz;
        }
        utterance.onstart = aoIniciarFala;
        utterance.onend = aoConcluirVersiculo;
        utterance.onerror = aoFalhar;
        window.speechSynthesis.speak(utterance);
      } else {
        Speech.speak(versiculo.texto, {
          language: "pt-BR",
          voice: sessao.preferencia.vozId ?? undefined,
          rate: sessao.preferencia.velocidade,
          onStart: aoIniciarFala,
          onDone: aoConcluirVersiculo,
          onStopped: () => {},
          onError: aoFalhar,
        });
      }
    } catch {
      aoFalhar();
    }
  };

  if (Platform.OS !== "web") {
    // No nativo, uma nova fala só entra na fila depois de qualquer stop
    // anterior concluir, evitando que o cancelamento apague a nova fala.
    void garantirParadaNativa().then(() => serializarOperacaoNativa(iniciar)).catch(aoFalhar);
  } else {
    iniciar();
  }
}

/** Inicia uma fala única ou uma sequência de versículos a partir do índice informado. */
export function iniciarAudio(
  versiculos: VersiculoParaFala[],
  observador: ObservadorAudio,
  indiceInicial = 0,
  origem?: object,
  sobrescrita?: Partial<PreferenciaAudio>
): void {
  if (!suportaAudio()) {
    observador.aoMudarEstado("erro");
    observador.aoErro("A leitura em voz alta não está disponível neste dispositivo.");
    return;
  }
  if (!Array.isArray(versiculos) || versiculos.length === 0 || versiculos.some((item) =>
    !item || !Number.isSafeInteger(item.numero) || item.numero < 1 || typeof item.texto !== "string" || !item.texto.trim()
  )) {
    observador.aoMudarEstado("erro");
    observador.aoErro("A leitura em voz alta não está disponível para este conteúdo.");
    return;
  }

  if (sessaoAtiva) {
    const anterior = sessaoAtiva;
    sessaoAtiva = null;
    // A sessão anterior foi substituída por outra origem; seus controles
    // devem voltar ao estado neutro, sem oferecer ações sobre a nova sessão.
    anterior.observador.aoIniciarVersiculo(null);
    anterior.observador.aoMudarEstado("ocioso");
    if (Platform.OS === "web") {
      try {
        void cancelarSintese();
      } catch {
        observador.aoMudarEstado("erro");
        observador.aoErro("Não foi possível iniciar uma nova leitura em voz alta.");
        return;
      }
    } else void solicitarParadaNativa().catch(() => {});
  }

  const indiceInteiro = Number.isFinite(indiceInicial) ? Math.trunc(indiceInicial) : 0;
  const indiceSeguro = Math.min(Math.max(0, indiceInteiro), versiculos.length - 1);
  const sessao: SessaoAudio = {
    id: ++proximoId,
    versiculos: versiculos.map(({ numero, texto }) => ({ numero, texto })),
    indiceAtual: indiceSeguro,
    observador,
    estado: "ocioso",
    comandoPendente: false,
    geracaoFala: 0,
    origem,
    preferencia: { vozId: null, velocidade: 1 },
    tentouFallbackVoz: false,
  };
  sessaoAtiva = sessao;
  atualizarEstado(sessao, "iniciando");
  void resolverPreferenciaAudio(sobrescrita).then((preferencia) => {
    if (sessaoAtiva?.id !== sessao.id) return;
    sessao.preferencia = preferencia;
    falarVersiculoAtual(sessao);
  }).catch(() => {
    if (sessaoAtiva?.id !== sessao.id) return;
    falarVersiculoAtual(sessao);
  });
}

/** iOS e web pausam na posição atual; Android interrompe e retoma do início do versículo atual. */
export function pausarAudio(): void {
  const sessao = sessaoAtiva;
  if (!sessao || sessao.estado !== "reproduzindo" || sessao.comandoPendente) return;

  if (!suportaPausaAudio()) {
    sessao.comandoPendente = true;
    sessao.geracaoFala += 1;
    atualizarEstado(sessao, "interrompendo");
    void solicitarParadaNativa().then(() => {
      if (sessaoAtiva?.id === sessao.id) atualizarEstado(sessao, "interrompido");
    }).catch(() => {
      if (sessaoAtiva?.id === sessao.id) {
        atualizarEstado(sessao, "erro");
        sessao.observador.aoErro("Não foi possível interromper a leitura em voz alta.");
      }
    }).finally(() => { sessao.comandoPendente = false; });
    return;
  }

  sessao.comandoPendente = true;
  const pausar = () => {
    if (Platform.OS === "web") window.speechSynthesis.pause();
    else return Speech.pause();
  };
  if (Platform.OS === "web") {
    try {
      pausar();
      atualizarEstado(sessao, "pausado");
    } catch {
      atualizarEstado(sessao, "erro");
      sessao.observador.aoErro("Não foi possível pausar a leitura em voz alta.");
    } finally {
      sessao.comandoPendente = false;
    }
  } else {
    atualizarEstado(sessao, "pausando");
    void serializarOperacaoNativa(pausar).then(() => atualizarEstado(sessao, "pausado")).catch(() => {
      if (sessaoAtiva?.id === sessao.id) {
        marcarParadaNativaNecessaria();
        atualizarEstado(sessao, "erro");
        sessao.observador.aoErro("Não foi possível pausar a leitura em voz alta.");
      }
    }).finally(() => { sessao.comandoPendente = false; });
  }
}

export function continuarAudio(): void {
  const sessao = sessaoAtiva;
  if (!sessao || sessao.comandoPendente || !["pausado", "interrompido", "erro"].includes(sessao.estado)) return;

  if (sessao.estado === "pausado" && suportaPausaAudio()) {
    if (Platform.OS === "web") {
      try {
        window.speechSynthesis.resume();
        atualizarEstado(sessao, "reproduzindo");
      } catch {
        atualizarEstado(sessao, "erro");
        sessao.observador.aoErro("Não foi possível retomar a leitura em voz alta.");
      }
    } else {
      sessao.comandoPendente = true;
      void serializarOperacaoNativa(() => Speech.resume()).then(() => atualizarEstado(sessao, "reproduzindo")).catch(() => {
        if (sessaoAtiva?.id === sessao.id) {
          marcarParadaNativaNecessaria();
          atualizarEstado(sessao, "erro");
          sessao.observador.aoErro("Não foi possível retomar a leitura em voz alta.");
        }
      }).finally(() => { sessao.comandoPendente = false; });
    }
    return;
  }

  falarVersiculoAtual(sessao);
}

/** Encerra a sessão ativa e limpa o estado para os controles voltarem ao início. */
export function pararAudio(reportarFalha = false, origem?: object): void {
  const sessao = sessaoAtiva;
  if (!sessao || (origem && sessao.origem !== origem)) return;
  sessaoAtiva = null;
  if (Platform.OS === "web") {
    try {
      void cancelarSintese();
    } catch {
      if (reportarFalha) {
        sessaoAtiva = sessao;
        atualizarEstado(sessao, "erro");
        sessao.observador.aoErro("Não foi possível encerrar a leitura em voz alta. Tente novamente.");
        return;
      }
    }
  }
  else void solicitarParadaNativa().catch(() => {
    if (reportarFalha && !sessaoAtiva) {
      sessaoAtiva = sessao;
      atualizarEstado(sessao, "erro");
      sessao.observador.aoErro("Não foi possível encerrar a leitura em voz alta. Tente novamente.");
    }
  });
  sessao.observador.aoIniciarVersiculo(null);
  sessao.observador.aoMudarEstado("ocioso");
}
