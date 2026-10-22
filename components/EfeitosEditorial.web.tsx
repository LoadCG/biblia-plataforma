import { useEffect, useRef, useState } from "react";

/** Movimento progressivo: o HTML continua visível se qualquer recurso falhar. */
export function EfeitosEditorial() {
  const marcador = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"oculto" | "carregando" | "saindo">("oculto");

  useEffect(() => {
    if (estado !== "saindo") return;
    const saida = window.setTimeout(() => setEstado("oculto"), 420);
    return () => window.clearTimeout(saida);
  }, [estado]);

  useEffect(() => {
    const pagina = marcador.current?.closest<HTMLElement>(".conhecer-page, .landing-evangelismo");
    if (!pagina) return;
    const reducao = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animacoes = new Set<Animation>();
    let ativo = true;
    let quadro = 0;

    // O indicador acompanha recursos reais. Não há espera artificial na navegação.
    const finalizar = () => {
      if (ativo) setEstado((atual) => atual === "carregando" ? "saindo" : atual);
    };
    if (document.fonts?.status === "loading") {
      setEstado("carregando");
      document.fonts.ready.then(finalizar);
    }
    const limite = window.setTimeout(finalizar, 2200);

    const elementos = pagina.querySelectorAll<HTMLElement>(
      ".conhecer-abertura, .conhecer-card, .temas-abertura, .tema-card, .conhecer-biblia, .estudo-abertura, .estudo-secao, .estudo-final, .landing-final",
    );
    const observador = "IntersectionObserver" in window ? new IntersectionObserver((entradas) => {
      entradas.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observador?.unobserve(target);
        if (reducao.matches || typeof target.animate !== "function") return;
        const animacao = target.animate(
          [{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 850, easing: "cubic-bezier(.16,1,.3,1)" },
        );
        animacoes.add(animacao);
        animacao.onfinish = () => animacoes.delete(animacao);
      });
    }, { root: pagina, threshold: 0.08 }) : null;
    elementos.forEach((elemento) => observador?.observe(elemento));

    const atualizarProgresso = () => {
      if (quadro) return;
      quadro = window.requestAnimationFrame(() => {
        quadro = 0;
        const total = pagina.scrollHeight - pagina.clientHeight;
        pagina.style.setProperty("--progresso-leitura", String(total > 0 ? pagina.scrollTop / total : 0));
      });
    };
    const ponteiro = (evento: PointerEvent) => {
      if (reducao.matches || evento.pointerType !== "mouse") return;
      const alvo = (evento.target as HTMLElement).closest<HTMLElement>(".conhecer-card, .tema-card, .conhecer-biblia");
      if (!alvo) return;
      const rect = alvo.getBoundingClientRect();
      alvo.style.setProperty("--pointer-x", `${evento.clientX - rect.left}px`);
      alvo.style.setProperty("--pointer-y", `${evento.clientY - rect.top}px`);
    };
    const cancelarMovimento = () => {
      if (reducao.matches) animacoes.forEach((animacao) => animacao.cancel());
    };
    atualizarProgresso();
    pagina.addEventListener("scroll", atualizarProgresso, { passive: true });
    pagina.addEventListener("pointermove", ponteiro, { passive: true });
    window.addEventListener("resize", atualizarProgresso);
    reducao.addEventListener("change", cancelarMovimento);
    return () => {
      ativo = false;
      window.clearTimeout(limite);
      window.cancelAnimationFrame(quadro);
      observador?.disconnect();
      animacoes.forEach((animacao) => animacao.cancel());
      pagina.removeEventListener("scroll", atualizarProgresso);
      pagina.removeEventListener("pointermove", ponteiro);
      window.removeEventListener("resize", atualizarProgresso);
      reducao.removeEventListener("change", cancelarMovimento);
    };
  }, []);

  return (
    <div ref={marcador} className="editorial-efeitos">
      <div className="editorial-progresso" aria-hidden="true" />
      {estado !== "oculto" && (
        <div className={`editorial-carregamento${estado === "saindo" ? " editorial-carregamento-saindo" : ""}`} role="status" aria-live="polite">
          <span className="editorial-carregamento-marca" aria-hidden="true">um encontro.</span>
          <span className="editorial-carregamento-trilho" aria-hidden="true"><span /></span>
          <span className="editorial-carregamento-legenda">Preparando sua leitura</span>
          <button type="button" onClick={() => setEstado("saindo")}>Continuar agora ↗</button>
        </div>
      )}
    </div>
  );
}
