import { Platform } from "react-native";

// Registra o service worker (public/sw.js) só na versão web — dá
// offline de verdade pro app já visitado (ver 7.3 do
// FUNCIONALIDADES.md). Silenciosamente ignorado se o navegador não
// suportar ou se falhar (ex. HTTP sem TLS em dev local) — offline é
// um extra, nunca pode travar o carregamento do app.
//
// **Nunca registra em desenvolvimento (`__DEV__`).** Causa raiz real,
// achada investigando por que sessões de teste ao vivo nesta sessão
// ficavam presas num loop infinito de reload (2026-08-20): o SW faz
// cache-first pras requisições de bundle JS (`sw.js`, estratégia
// deliberada pra assets com hash de conteúdo). Só que em dev o Metro
// serve os bundles em URLs SEM hash de conteúdo
// (`entry.bundle?platform=web&dev=true&hot=false&...`, sempre a mesma
// URL não importa quantas vezes o código mude) — uma vez cacheado, o
// SW passa a servir aquele bundle congelado pra sempre, ignorando
// qualquer edição de código seguinte. Quando o bundle cacheado fica
// desatualizado o bastante (ex. referenciando algo que já foi
// removido do código-fonte), o app quebra ao montar, o cliente de dev
// do Metro recarrega a página pra tentar de novo, o SW serve o MESMO
// bundle quebrado de novo — loop infinito, sem nenhum erro claro no
// console (a Service Worker roda fora da aba, os logs dela não
// aparecem no console da página). Resolvido não registrando o SW
// nunca em dev — `__DEV__` é `false` só em builds de produção de
// verdade (`expo export`/Vercel), nunca no `expo start` usado pra
// testar ao vivo.
export function registrarServiceWorker(): void {
  if (Platform.OS !== "web" || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  if (__DEV__) {
    // Limpeza defensiva: remove qualquer SW/cache que tenha sobrado
    // registrado de uma sessão de teste anterior a esta correção —
    // sem isso, o loop acima continuaria acontecendo pra quem já tinha
    // um SW velho instalado no navegador de dev.
    navigator.serviceWorker.getRegistrations().then((registros) => {
      registros.forEach((registro) => registro.unregister());
    });
    if (typeof caches !== "undefined") {
      caches.keys().then((chaves) => chaves.forEach((chave) => caches.delete(chave)));
    }
    return;
  }
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
