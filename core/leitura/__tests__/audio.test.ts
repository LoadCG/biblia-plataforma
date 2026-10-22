jest.mock("react-native", () => ({ Platform: { OS: "ios" } }));
jest.mock("expo-speech", () => ({
  speak: jest.fn((_texto: string, opcoes?: { onStart?: () => void }) => opcoes?.onStart?.()),
  stop: jest.fn(() => Promise.resolve()),
  pause: jest.fn(() => Promise.resolve()),
  resume: jest.fn(() => Promise.resolve()),
}));
jest.mock("../preferenciaAudio", () => ({
  resolverPreferenciaAudio: jest.fn(() => Promise.resolve({ vozId: null, velocidade: 1 })),
}));

import * as Speech from "expo-speech";
import { iniciarAudio, pausarAudio, pararAudio, continuarAudio, type ObservadorAudio } from "../audio";

const observador: ObservadorAudio = {
  aoMudarEstado: jest.fn(),
  aoIniciarVersiculo: jest.fn(),
  aoErro: jest.fn(),
};

async function aguardarOperacoesAudio() {
  await new Promise<void>((resolver) => setTimeout(resolver, 0));
}

describe("comandos de áudio vinculados à origem", () => {
  afterEach(async () => {
    pararAudio();
    await aguardarOperacoesAudio();
    jest.clearAllMocks();
  });

  it("ignora pausa e retomada solicitadas por outra tela", async () => {
    const origemAtiva = {};
    const origemAntiga = {};
    iniciarAudio([{ numero: 1, texto: "Texto de exemplo." }], observador, 0, origemAtiva);
    await aguardarOperacoesAudio();

    expect(Speech.speak).toHaveBeenCalledTimes(1);

    pausarAudio(origemAntiga);
    await aguardarOperacoesAudio();
    expect(Speech.pause).not.toHaveBeenCalled();

    pausarAudio(origemAtiva);
    await aguardarOperacoesAudio();
    expect(Speech.pause).toHaveBeenCalledTimes(1);

    continuarAudio(origemAntiga);
    await aguardarOperacoesAudio();
    expect(Speech.resume).not.toHaveBeenCalled();

    continuarAudio(origemAtiva);
    await aguardarOperacoesAudio();
    expect(Speech.resume).toHaveBeenCalledTimes(1);
  });
});
