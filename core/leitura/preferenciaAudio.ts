import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { Platform } from "react-native";
import { VELOCIDADES_AUDIO } from "./constantesAudio";

const CHAVE_VOZ = "voz-leitura-dispositivo";
const CHAVE_VELOCIDADE = "velocidade-leitura-dispositivo";

export { VELOCIDADES_AUDIO } from "./constantesAudio";

export type PreferenciaAudio = { vozId: string | null; velocidade: number };
export type VozAudio = { id: string; nome: string; qualidade: "padrao" | "aprimorada"; local?: boolean };

function ehVozPtBr(idioma: string): boolean {
  const [idiomaBase, regiao] = idioma.replace(/_/g, "-").split("-");
  return idiomaBase?.toLowerCase() === "pt" && regiao?.toLowerCase() === "br";
}

function normalizarVozes(vozes: VozAudio[]): VozAudio[] {
  const unicas = new Map<string, VozAudio>();
  for (const voz of vozes) {
    const id = voz.id.trim();
    if (id && !unicas.has(id)) unicas.set(id, { ...voz, id });
  }
  return [...unicas.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR") || a.id.localeCompare(b.id));
}

export async function carregarPreferenciaAudio(): Promise<PreferenciaAudio> {
  const [[, vozSalva], [, velocidadeSalva]] = await AsyncStorage.multiGet([CHAVE_VOZ, CHAVE_VELOCIDADE]);
  const velocidade = Number(velocidadeSalva);
  return {
    vozId: vozSalva || null,
    velocidade: VELOCIDADES_AUDIO.some((valor) => valor === velocidade) ? velocidade : 1,
  };
}

export async function salvarVozAudio(id: string | null): Promise<void> {
  if (id) await AsyncStorage.setItem(CHAVE_VOZ, id);
  else await AsyncStorage.removeItem(CHAVE_VOZ);
}

export function salvarVelocidadeAudio(velocidade: number): Promise<void> {
  if (!VELOCIDADES_AUDIO.some((valor) => valor === velocidade)) throw new Error("Velocidade de áudio inválida");
  return AsyncStorage.setItem(CHAVE_VELOCIDADE, String(velocidade));
}

export async function listarVozesAudio(): Promise<VozAudio[]> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined" || !window.speechSynthesis) return [];
    return normalizarVozes(window.speechSynthesis.getVoices()
      .filter((voz) => ehVozPtBr(voz.lang))
      .map((voz) => ({ id: voz.voiceURI, nome: voz.name, qualidade: "padrao" as const, local: voz.localService })));
  }
  const vozes = await Speech.getAvailableVoicesAsync();
  return normalizarVozes(vozes
    .filter((voz) => ehVozPtBr(voz.language))
    .map((voz) => ({
      id: voz.identifier,
      nome: voz.name,
      qualidade: voz.quality === Speech.VoiceQuality.Enhanced ? "aprimorada" as const : "padrao" as const,
    })));
}

export async function resolverPreferenciaAudio(sobrescrita?: Partial<PreferenciaAudio>): Promise<PreferenciaAudio> {
  const preferencia = { ...await carregarPreferenciaAudio(), ...sobrescrita };
  if (!preferencia.vozId) return preferencia;
  try {
    const vozes = await listarVozesAudio();
    return { ...preferencia, vozId: vozes.some((voz) => voz.id === preferencia.vozId) ? preferencia.vozId : null };
  } catch {
    return { ...preferencia, vozId: null };
  }
}
