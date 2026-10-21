import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "expo-router";
import Head from "expo-router/head";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { EfeitosEditorial } from "./EfeitosEditorial";

const QUADROS = [
  { antes: "Tem alguém que ", destaque: "te ama." },
  { antes: "Seu valor não depende do que você consegue ", destaque: "fazer ou conquistar." },
  { antes: "A Bíblia fala de um amor que se aproxima, ", destaque: "escuta e acolhe." },
  { antes: "Esse amor não é distante. Ele se fez presente ", destaque: "na vida de pessoas reais." },
  { antes: "Ele ouviu, cuidou e ensinou ", destaque: "com compaixão." },
  { antes: "Esse alguém é Jesus Cristo. A Bíblia revela nele ", destaque: "o amor de Deus." },
  { antes: "Pecado é afastar-se de Deus e ", destaque: "praticar o mal." },
  { antes: "Jesus morreu na cruz por nossos pecados. A Bíblia anuncia ", destaque: "que Deus o ressuscitou." },
  { antes: "Deus oferece perdão e salvação por graça: como presente, não recompensa. ", destaque: "Fé é confiar em Jesus." },
  { antes: "Quer entender melhor essa história? Você pode ler mais, com calma, ", destaque: "ou abrir a Bíblia." },
];

const REFERENCIAS = [
  { rotulo: "João 3:16", href: "/leitura/43-joao/3?versiculo=16" },
  { rotulo: "Marcos 10:46–52", href: "/leitura/41-marcos/10?versiculo=46" },
  { rotulo: "João 4:7–26", href: "/leitura/43-joao/4?versiculo=7" },
  { rotulo: "Romanos 3:23", href: "/leitura/45-romanos/3?versiculo=23" },
  { rotulo: "Romanos 5:8", href: "/leitura/45-romanos/5?versiculo=8" },
  { rotulo: "Efésios 2:8–9", href: "/leitura/49-efesios/2?versiculo=8" },
  { rotulo: "1 Coríntios 15:3–4", href: "/leitura/46-1-corintios/15?versiculo=3" },
];


const limitar = (valor: number) => Math.min(1, Math.max(0, valor));

function Palavras({ texto, destaque = false }: { texto: string; destaque?: boolean }) {
  return <>{texto.trim().split(/\s+/).map((palavra, indice) => (
    <span key={`${indice}-${palavra}`} aria-hidden="true" className={`landing-palavra${destaque ? " landing-palavra-destaque" : ""}`}>{palavra}</span>
  ))}</>;
}

export default function LandingEvangelismo() {
  const raizRef = useRef<HTMLElement>(null);
  const sequenciaRef = useRef<HTMLElement>(null);
  const atualizarQuadrosRef = useRef<(progresso: number) => void>(() => undefined);
  const [temaClaro, setTemaClaro] = useState(false);
  const [preferenciaTemaCarregada, setPreferenciaTemaCarregada] = useState(false);
  const [leituraContinua, setLeituraContinua] = useState(false);
  const [quadroAtual, setQuadroAtual] = useState(0);
  const reducaoDeMovimento = useReducedMotion();
  const animacaoAtiva = !leituraContinua && reducaoDeMovimento !== true;
  const { scrollYProgress } = useScroll({
    container: raizRef,
    target: sequenciaRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progresso) => {
    if (!animacaoAtiva) return;
    atualizarQuadrosRef.current(progresso);
  });

  useEffect(() => {
    try {
      setTemaClaro(window.localStorage.getItem("landing-tema") === "claro");
    } catch {
      // A página continua funcional quando o navegador bloqueia armazenamento local.
    } finally {
      setPreferenciaTemaCarregada(true);
    }
  }, []);

  useEffect(() => {
    if (!preferenciaTemaCarregada) return;
    try {
      window.localStorage.setItem("landing-tema", temaClaro ? "claro" : "escuro");
    } catch {
      // A escolha continua valendo durante esta visita mesmo sem persistência.
    }
  }, [preferenciaTemaCarregada, temaClaro]);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const quadros = Array.from(raiz.querySelectorAll<HTMLElement>(".landing-quadro"));
    let ativo = true;

    const limparQuadros = () => {
      quadros.forEach((quadro) => {
        quadro.style.removeProperty("opacity");
        quadro.style.removeProperty("pointer-events");
        quadro.style.removeProperty("transform");
        quadro.style.removeProperty("filter");
        quadro.querySelector<HTMLElement>(".landing-frase")?.style.removeProperty("opacity");
        quadro.querySelector<HTMLElement>(".landing-numero")?.style.removeProperty("opacity");
      });
    };

    atualizarQuadrosRef.current = (valor) => {
      if (!ativo || leituraContinua || reducaoDeMovimento) return;
      const intervalos = Math.max(1, QUADROS.length - 1);
      const tempo = Math.max(0, Math.min(intervalos, valor * intervalos));
      const indice = Math.min(quadros.length - 1, Math.floor(tempo));
      quadros.forEach((quadro, i) => {
        const faseQuadro = tempo - i;
        const entradaQuadro = limitar((faseQuadro + .17) / .17);
        const ultimoQuadro = i === quadros.length - 1;
        const saidaQuadro = ultimoQuadro ? 0 : limitar((faseQuadro - .56) / .4);
        const visivel = faseQuadro >= -.17 && (ultimoQuadro || faseQuadro <= .96);
        quadro.style.opacity = String(entradaQuadro * (1 - saidaQuadro));
        quadro.style.pointerEvents = i === indice ? "auto" : "none";
        quadro.style.transform = visivel
          ? `translate3d(0, ${(1 - entradaQuadro) * 16 - saidaQuadro * 20}px, 0) scale(${1 - saidaQuadro * .025})`
          : "translate3d(0, 16px, 0)";
        const frase = quadro.querySelector<HTMLElement>(".landing-frase");
        if (frase) frase.style.opacity = String(entradaQuadro * (1 - saidaQuadro));
        const numero = quadro.querySelector<HTMLElement>(".landing-numero");
        if (numero) numero.style.opacity = String(entradaQuadro * (1 - saidaQuadro));
      });
      setQuadroAtual((atual) => atual === indice ? atual : indice);
    };
    if (!leituraContinua && !reducaoDeMovimento) {
      const progressoInicial = scrollYProgress.get();
      atualizarQuadrosRef.current(progressoInicial);
    } else {
      limparQuadros();
    }
    return () => {
      ativo = false;
      atualizarQuadrosRef.current = () => undefined;
      limparQuadros();
      raiz.classList.remove("landing-com-animacao");
    };
  }, [temaClaro, leituraContinua, reducaoDeMovimento, scrollYProgress]);

  useEffect(() => {
    raizRef.current?.classList.toggle("landing-com-animacao", animacaoAtiva);
  }, [animacaoAtiva]);

  return (
    <>
      <Head>
        <title>Tem alguém que te ama.</title>
        <meta name="description" content="Uma mensagem sobre o amor de Deus revelado em Jesus Cristo." />
        <meta name="theme-color" content={temaClaro ? "#e7e8eb" : "#202227"} />
      </Head>
      <main
        ref={raizRef}
        tabIndex={0}
        className={`landing-evangelismo ${temaClaro ? "landing-tema-claro" : "landing-tema-escuro"}${leituraContinua ? " landing-leitura-continua" : ""}`}
      >
        <EfeitosEditorial />
        <section className="landing-transcricao" aria-label="Narrativa completa">
          {QUADROS.map((quadro, indice) => {
            const Tag = indice === 0 ? "h1" : "h2";
            return <Tag key={quadro.antes}>{quadro.antes}{quadro.destaque}</Tag>;
          })}
        </section>
        <header className="landing-cabecalho">
          <div className="landing-controles">
          {reducaoDeMovimento !== true && <button type="button" className="landing-botao-leitura" onClick={() => {
            setLeituraContinua(!leituraContinua);
            raizRef.current?.scrollTo({ top: 0 });
          }} aria-pressed={leituraContinua}>{leituraContinua ? "Ver experiência" : "Ler sem animações"}</button>}
          <button type="button" className="landing-botao-tema" onClick={() => setTemaClaro(!temaClaro)} aria-label={temaClaro ? "Usar tema escuro" : "Usar tema claro"}>
            <span aria-hidden="true">{temaClaro ? "☾" : "◐"}</span>
          </button>
          </div>
        </header>
        {animacaoAtiva && quadroAtual < QUADROS.length - 1 && <div
          className="landing-progresso"
          role="progressbar"
          aria-label="Progresso da mensagem"
          aria-valuemin={1}
          aria-valuemax={QUADROS.length}
          aria-valuenow={quadroAtual + 1}
          aria-valuetext={`Mensagem ${quadroAtual + 1} de ${QUADROS.length}`}
        >
          <span className="landing-progresso-trilho"><span className="landing-progresso-preenchido" style={{ width: `${((quadroAtual + 1) / QUADROS.length) * 100}%` }} /></span>
          <span className="landing-progresso-texto">{String(quadroAtual + 1).padStart(2, "0")} / {String(QUADROS.length).padStart(2, "0")}</span>
        </div>}
        <span className="landing-anuncio-leitor" role="status" aria-live="polite" aria-atomic="true">
          {animacaoAtiva ? `Mensagem ${quadroAtual + 1} de ${QUADROS.length}.` : ""}
        </span>
        <section ref={sequenciaRef} className="landing-sequencia" style={{ "--quadros": QUADROS.length } as CSSProperties} aria-hidden="true">
          <div className="landing-palco">
            {QUADROS.map((quadro, indice) => (
              <div key={quadro.antes} className="landing-quadro">
                <span className="landing-numero">{String(indice + 1).padStart(2, "0")} <span aria-hidden="true">/</span> UMA MENSAGEM PARA VOCÊ</span>
                <div className="landing-frase" role="heading" aria-level={indice === 0 ? 1 : 2} aria-label={quadro.antes + quadro.destaque}>
                  <Palavras texto={quadro.antes} /><Palavras texto={quadro.destaque} destaque />
                </div>
                {indice === 0 && <span className="landing-convite-rolagem">Role para descobrir <span aria-hidden="true">↓</span></span>}
              </div>
            ))}
          </div>
        </section>
        {!leituraContinua && quadroAtual === 0 && (
          <a
            className="landing-pular"
            href="#continuacao"
            onClick={() => window.requestAnimationFrame(() => document.getElementById("landing-final-titulo")?.focus())}
          >
            Ir direto às opções
            <span aria-hidden="true">↓</span>
          </a>
        )}
        <section id="continuacao" className="landing-final" aria-labelledby="landing-final-titulo">
          <span className="landing-final-sobretitulo">A HISTÓRIA CONTINUA</span>
          <h2 id="landing-final-titulo" tabIndex={-1} className="landing-final-titulo">Quer conhecer mais sobre <span className="landing-destaque">esse amor?</span></h2>
          <p className="landing-final-descricao">Sem cadastro e no seu ritmo: escolha leituras curtas sobre Jesus, a Bíblia e a salvação, ou abra o leitor bíblico.</p>
          <Link href="/conhecer" className="landing-acao landing-acao-principal">Conhecer Jesus e a Bíblia <span aria-hidden="true">↗</span></Link>
          <Link href="/leitura" className="landing-acao landing-acao-secundaria">Abrir a Bíblia online <span aria-hidden="true">↗</span></Link>
          <div className="landing-referencias" aria-label="Referências bíblicas para conferir a mensagem">
            <span className="landing-referencias-titulo">PARA CONFERIR A MENSAGEM</span>
            <div className="landing-referencias-lista">
              {REFERENCIAS.map((referencia) => (
                <Link key={referencia.rotulo} href={referencia.href as never} className="landing-referencia">
                  {referencia.rotulo}<span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
          <p className="landing-assinatura-final">Uma leitura cristã baseada na Bíblia.</p>
        </section>
      </main>
    </>
  );
}
