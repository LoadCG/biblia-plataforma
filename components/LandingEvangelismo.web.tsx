import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "expo-router";
import Head from "expo-router/head";
import { EfeitosEditorial } from "./EfeitosEditorial";

const QUADROS = [
  { antes: "Tem alguém que ", destaque: "te ama." },
  { antes: "Mesmo que ninguém perceba, ", destaque: "sua vida tem valor." },
  { antes: "Você não precisa ser perfeito para ", destaque: "ser amado." },
  { antes: "Sua história não apaga seu valor. ", destaque: "Sua dor não precisa ser escondida." },
  { antes: "O amor verdadeiro escuta, acolhe e ", destaque: "permanece." },
  { antes: "A Bíblia conta de onde vem esse amor: ", destaque: "Deus o revelou em Jesus Cristo." },
  { antes: "Jesus se aproximou de quem era deixado de lado. ", destaque: "Ele ouviu, cuidou e ensinou com verdade." },
  { antes: "Todos nós nos afastamos de Deus. ", destaque: "Jesus morreu na cruz por nós." },
  { antes: "A Bíblia anuncia: ", destaque: "Deus o ressuscitou." },
  { antes: "Por graça, como presente e não recompensa, ", destaque: "Deus oferece perdão e nova vida a quem confia em Jesus." },
];


type Particula = { x: number; y: number; r: number; g: number; b: number; semente: number };
const limitar = (valor: number) => Math.min(1, Math.max(0, valor));

function Palavras({ texto, destaque = false }: { texto: string; destaque?: boolean }) {
  return <>{texto.trim().split(/\s+/).map((palavra, indice) => (
    <span key={`${indice}-${palavra}`} aria-hidden="true" className={`landing-palavra${destaque ? " landing-palavra-destaque" : ""}`}>{palavra}</span>
  ))}</>;
}

export default function LandingEvangelismo() {
  const raizRef = useRef<HTMLElement>(null);
  const [temaClaro, setTemaClaro] = useState(false);
  const [leituraContinua, setLeituraContinua] = useState(false);
  const [quadroAtual, setQuadroAtual] = useState(0);

  useEffect(() => {
    const raiz = raizRef.current;
    const sequencia = raiz?.querySelector<HTMLElement>(".landing-sequencia");
    const palco = raiz?.querySelector<HTMLElement>(".landing-palco");
    const canvas = raiz?.querySelector<HTMLCanvasElement>(".landing-poeira");
    const contexto = canvas?.getContext("2d");
    if (!raiz || !sequencia || !palco || !canvas) return;
    const quadros = Array.from(raiz.querySelectorAll<HTMLElement>(".landing-quadro"));
    const reducao = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cache = new Map<number, Particula[]>();
    let raf = 0;
    let ativo = true;
    let ultimoIndice = -1;
    let poeiraDesabilitada = false;

    const limparQuadros = () => {
      quadros.forEach((quadro) => {
        quadro.style.removeProperty("opacity");
        quadro.style.removeProperty("visibility");
        quadro.querySelector<HTMLElement>(".landing-frase")?.style.removeProperty("opacity");
        quadro.querySelector<HTMLElement>(".landing-numero")?.style.removeProperty("opacity");
      });
    };

    const amostrar = (indice: number): Particula[] => {
      if (!contexto || poeiraDesabilitada) return [];
      if (cache.has(indice)) return cache.get(indice)!;
      const rectPalco = palco.getBoundingClientRect();
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      quadros[indice].querySelectorAll<HTMLElement>(".landing-palavra").forEach((palavra) => {
        const rect = palavra.getBoundingClientRect();
        const estilo = window.getComputedStyle(palavra);
        contexto.font = `${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
        contexto.fillStyle = estilo.color;
        contexto.textBaseline = "middle";
        contexto.fillText(palavra.textContent || "", rect.left - rectPalco.left, rect.top - rectPalco.top + rect.height * .5);
      });
      const resultado: Particula[] = [];
      try {
        const pixels = contexto.getImageData(0, 0, canvas.width, canvas.height).data;
        const passo = raiz.clientWidth < 600 ? 5 : 6;
        for (let y = 0; y < canvas.height; y += passo) {
          for (let x = 0; x < canvas.width; x += passo) {
            const offset = (y * canvas.width + x) * 4;
            if (pixels[offset + 3] < 90) continue;
            resultado.push({ x, y, r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2], semente: ((x * 73 + y * 37) % 997) / 997 });
          }
        }
      } catch {
        // A transição por opacidade continua disponível se o canvas não puder ser lido.
        poeiraDesabilitada = true;
      }
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      const amostra = resultado.filter((_, i) => i % Math.max(1, Math.ceil(resultado.length / 1600)) === 0);
      if (cache.size > 2) cache.clear();
      cache.set(indice, amostra);
      return amostra;
    };

    const desenhar = (indice: number, progresso: number) => {
      if (!contexto) return;
      const particulas = progresso > 0 && progresso < 1 ? amostrar(indice) : [];
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particulas) {
        const deslocamento = Math.pow(progresso, 1.25);
        const x = p.x + (p.semente - .38) * 340 * deslocamento;
        const y = p.y - (45 + p.semente * 180) * deslocamento;
        const opacidade = Math.min(1, progresso * 7) * Math.pow(1 - progresso, 1.5);
        contexto.fillStyle = `rgba(${p.r},${p.g},${p.b},${opacidade})`;
        contexto.fillRect(x, y, 1 + p.semente * 1.4, 1 + p.semente * 1.4);
      }
    };

    const atualizar = () => {
      raf = 0;
      if (!ativo) return;
      if (reducao.matches || leituraContinua) {
        raiz.classList.remove("landing-com-animacao");
        limparQuadros();
        contexto?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      raiz.classList.add("landing-com-animacao");
      const bounds = raiz.getBoundingClientRect();
      const distancia = bounds.top - sequencia.getBoundingClientRect().top;
      const tempo = Math.max(0, distancia / Math.max(1, raiz.clientHeight));
      const indice = Math.min(quadros.length - 1, Math.floor(tempo));
      const fase = Math.min(1, tempo - indice);
      const entrada = indice === 0 ? 1 : limitar(fase / .17);
      const saida = limitar((fase - .56) / .4);
      quadros.forEach((quadro, i) => {
        quadro.style.opacity = i === indice ? "1" : "0";
        quadro.style.visibility = i === indice ? "visible" : "hidden";
        const frase = quadro.querySelector<HTMLElement>(".landing-frase");
        if (frase) frase.style.opacity = i === indice ? String(entrada * (1 - saida)) : "0";
        const numero = quadro.querySelector<HTMLElement>(".landing-numero");
        if (numero) numero.style.opacity = String(entrada * (1 - saida));
      });
      desenhar(indice, saida);
      if (indice !== ultimoIndice) {
        ultimoIndice = indice;
        setQuadroAtual(indice);
      }
    };
    const agendar = () => { if (!raf) raf = window.requestAnimationFrame(atualizar); };
    const redimensionar = () => {
      cache.clear();
      canvas.width = raiz.clientWidth;
      canvas.height = raiz.clientHeight;
      agendar();
    };
    const mudarPreferencia = () => {
      limparQuadros();
      redimensionar();
    };
    redimensionar();
    document.fonts?.ready.then(() => { if (ativo) redimensionar(); });
    raiz.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", redimensionar);
    reducao.addEventListener("change", mudarPreferencia);
    return () => {
      ativo = false;
      window.cancelAnimationFrame(raf);
      raiz.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", redimensionar);
      reducao.removeEventListener("change", mudarPreferencia);
      limparQuadros();
      raiz.classList.remove("landing-com-animacao");
    };
  }, [temaClaro, leituraContinua]);

  return (
    <>
      <Head>
        <title>Tem alguém que te ama.</title>
        <meta name="description" content="Uma mensagem sobre o amor de Deus revelado em Jesus Cristo." />
        <meta name="theme-color" content={temaClaro ? "#e7e8eb" : "#202227"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:wght@400;500;600;800;900&display=swap" rel="stylesheet" />
      </Head>
      <main ref={raizRef} className={`landing-evangelismo ${temaClaro ? "landing-tema-claro" : "landing-tema-escuro"}${leituraContinua ? " landing-leitura-continua" : ""}`}>
        <EfeitosEditorial />
        <header className="landing-cabecalho">
          <span className="landing-assinatura">UMA MENSAGEM PARA VOCÊ</span>
          <div className="landing-controles">
          <button type="button" className="landing-botao-leitura" onClick={() => {
            setLeituraContinua(!leituraContinua);
            raizRef.current?.scrollTo({ top: 0 });
          }} aria-pressed={leituraContinua}>{leituraContinua ? "Ver experiência" : "Ler sem animações"}</button>
          <button type="button" className="landing-botao-tema" onClick={() => setTemaClaro(!temaClaro)} aria-label={temaClaro ? "Usar tema escuro" : "Usar tema claro"} aria-pressed={temaClaro}>
            <span aria-hidden="true">{temaClaro ? "☾" : "◐"}</span>
          </button>
          </div>
        </header>
        <div className="landing-progresso" aria-label={`Mensagem ${quadroAtual + 1} de ${QUADROS.length}`}>
          <span className="landing-progresso-trilho"><span className="landing-progresso-preenchido" style={{ width: `${((quadroAtual + 1) / QUADROS.length) * 100}%` }} /></span>
          <span className="landing-progresso-texto">{String(quadroAtual + 1).padStart(2, "0")} / {String(QUADROS.length).padStart(2, "0")}</span>
        </div>
        <section className="landing-sequencia" style={{ "--quadros": QUADROS.length } as CSSProperties} aria-label="Uma mensagem sobre o amor">
          <div className="landing-palco">
            {QUADROS.map((quadro, indice) => (
              <section key={quadro.antes} className="landing-quadro" aria-label={`Mensagem ${indice + 1}`}>
                <span className="landing-numero">{String(indice + 1).padStart(2, "0")} <span aria-hidden="true">/</span> UMA MENSAGEM PARA VOCÊ</span>
                <div className="landing-frase" role="heading" aria-level={indice === 0 ? 1 : 2} aria-label={quadro.antes + quadro.destaque}>
                  <Palavras texto={quadro.antes} /><Palavras texto={quadro.destaque} destaque />
                </div>
                {indice === 0 && <span className="landing-convite-rolagem">Role para descobrir <span aria-hidden="true">↓</span></span>}
              </section>
            ))}
            <canvas className="landing-poeira" aria-hidden="true" />
          </div>
        </section>
        <section className="landing-final">
          <span className="landing-final-sobretitulo">A HISTÓRIA CONTINUA</span>
          <h2 className="landing-final-titulo">Quer conhecer mais sobre <span className="landing-destaque">esse amor?</span></h2>
          <p className="landing-final-descricao">Leia sobre Jesus, a Bíblia e a esperança que a fé cristã apresenta. Sem cadastro e no seu ritmo.</p>
          <Link href="/conhecer" className="landing-acao landing-acao-principal">Conhecer mais sobre esse amor <span aria-hidden="true">↗</span></Link>
          <Link href="/leitura" className="landing-acao landing-acao-secundaria">Abrir a Bíblia online <span aria-hidden="true">↗</span></Link>
          <p className="landing-referencias">Para conferir a mensagem: João 3:16, Romanos 3:23 e 5:8, Efésios 2:8-9, 1 Coríntios 15:3-4.</p>
          <p className="landing-assinatura-final">Uma leitura cristã baseada na Bíblia.</p>
        </section>
      </main>
    </>
  );
}
