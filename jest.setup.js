// Expo 57 instala `fetch` como getter lazy. Materializá-lo enquanto o
// ambiente Jest ainda está ativo evita que o teardown acione imports
// nativos depois de a suíte terminar.
void globalThis.fetch;
