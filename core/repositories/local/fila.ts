// Serializa leitura+escrita por chave do AsyncStorage. Sem isso, duas
// chamadas concorrentes a alternar()/salvar() (ex.: o usuário tocando em
// dois versículos rapidamente) podem ler o mesmo estado antes de
// qualquer uma escrever, e a segunda escrita sobrescreve a primeira.
const filasPorChave = new Map<string, Promise<unknown>>();

export function comFila<T>(chave: string, tarefa: () => Promise<T>): Promise<T> {
  const anterior = filasPorChave.get(chave) ?? Promise.resolve();
  const atual = anterior.then(tarefa, tarefa);
  filasPorChave.set(
    chave,
    atual.catch(() => undefined)
  );
  return atual;
}
