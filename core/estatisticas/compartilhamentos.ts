// Contador simples de "vezes que a pessoa compartilhou algo do app" —
// conta tanto compartilhar de verdade quanto copiar (o usuário definiu
// copiar como uma forma de compartilhamento). Não precisa de um
// repositório completo, é só um inteiro persistido.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "compartilhamentos";

export async function carregarCompartilhamentos(): Promise<number> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  const numero = bruto ? parseInt(bruto, 10) : 0;
  return Number.isFinite(numero) ? numero : 0;
}

export async function registrarCompartilhamento(): Promise<void> {
  const atual = await carregarCompartilhamentos();
  await AsyncStorage.setItem(CHAVE, String(atual + 1));
}
