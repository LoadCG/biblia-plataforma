import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, ScrollView, Text, View } from "react-native";

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

function PalavrasAnimadas({ texto, destaque = false }: { texto: string; destaque?: boolean }) {
  return (
    <>
      {texto.trim().split(/\s+/).map((palavra, indicePalavra) => (
        <Text
          key={`${indicePalavra}-${palavra}`}
          aria-hidden={true}
          className={`landing-palavra${destaque ? " landing-palavra-destaque" : ""}`}
        >
          {Array.from(palavra).map((letra, indiceLetra) => (
            <Text key={`${indiceLetra}-${letra}`} className={`landing-glifo landing-glifo-${(indicePalavra + indiceLetra) % 7}`}>
              {letra}
            </Text>
          ))}
        </Text>
      ))}
    </>
  );
}

export default function LandingEvangelismo() {
  const raizRef = useRef<ScrollView>(null);
  const [temaClaro, setTemaClaro] = useState(false);
  const [quadroAtual, setQuadroAtual] = useState(0);

  useEffect(() => {
    const raiz = raizRef.current as unknown as HTMLElement | null;
    if (!raiz) return;
    const quadros = Array.from(raiz.querySelectorAll<HTMLElement>(".landing-quadro"));
    if (!quadros.length) return;

    let quadroAnimacao = 0;
    const atualizarQuadros = () => {
      if (quadroAnimacao) return;
      quadroAnimacao = window.requestAnimationFrame(() => {
        quadroAnimacao = 0;
        const area = raiz.getBoundingClientRect();
        const centro = area.top + raiz.clientHeight * 0.5;
        let indiceAtual = 0;
        let menorDistancia = Number.POSITIVE_INFINITY;

        quadros.forEach((quadro, indice) => {
          const limites = quadro.getBoundingClientRect();
          const centroQuadro = limites.top + limites.height * 0.5;
          const distancia = Math.abs(centroQuadro - centro);
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            indiceAtual = indice;
          }
          quadro.classList.toggle("landing-quadro-passado", limites.bottom < centro);
        });

        quadros.forEach((quadro, indice) => {
          quadro.classList.toggle("landing-quadro-ativo", indice === indiceAtual);
          quadro.classList.toggle("landing-quadro-futuro", indice > indiceAtual);
        });
        setQuadroAtual((atual) => atual === indiceAtual ? atual : indiceAtual);
      });
    };

    raiz.classList.add("landing-com-animacao");
    atualizarQuadros();
    raiz.addEventListener("scroll", atualizarQuadros, { passive: true });
    window.addEventListener("scroll", atualizarQuadros, { passive: true });
    window.addEventListener("resize", atualizarQuadros);
    return () => {
      raiz.removeEventListener("scroll", atualizarQuadros);
      window.removeEventListener("scroll", atualizarQuadros);
      window.removeEventListener("resize", atualizarQuadros);
      if (quadroAnimacao) window.cancelAnimationFrame(quadroAnimacao);
      raiz.classList.remove("landing-com-animacao");
    };
  }, []);

  const tema = temaClaro ? "landing-tema-claro" : "landing-tema-escuro";
  const totalQuadros = QUADROS.length;

  return (
    <>
      <Head>
        <title>Tem alguém que te ama.</title>
        <meta name="description" content="Uma mensagem sobre o amor de Deus revelado em Jesus Cristo." />
        <meta name="theme-color" content={temaClaro ? "#e7e8eb" : "#17191e"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:wght@800;900&display=swap" rel="stylesheet" />
      </Head>

      <ScrollView
        ref={raizRef}
        dataSet={{ tema: temaClaro ? "claro" : "escuro" }}
        className={`landing-evangelismo ${tema}`}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="landing-cabecalho w-full flex-row items-center justify-between">
          <Text className="landing-assinatura">UMA MENSAGEM PARA VOCÊ</Text>
          <Pressable
            onPress={() => setTemaClaro((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={temaClaro ? "Usar tema escuro" : "Usar tema claro"}
            accessibilityState={{ selected: temaClaro }}
            className="landing-botao-tema w-12 h-12 items-center justify-center rounded-full border"
          >
            <Text aria-hidden={true} className="landing-icone-tema">{temaClaro ? "☾" : "◐"}</Text>
          </Pressable>
        </View>

        <View className="landing-progresso w-full flex-row items-center gap-3" accessibilityLabel={`Mensagem ${quadroAtual + 1} de ${totalQuadros}`}>
          <View className="landing-progresso-trilho flex-1">
            <View className="landing-progresso-preenchido" style={{ width: `${((quadroAtual + 1) / totalQuadros) * 100}%` }} />
          </View>
          <Text className="landing-progresso-texto">{String(quadroAtual + 1).padStart(2, "0")} / {String(totalQuadros).padStart(2, "0")}</Text>
        </View>

        <View className="landing-sequencia">
          {QUADROS.map((quadro, indice) => {
            const textoCompleto = quadro.antes + quadro.destaque;
            return (
              <View
                key={textoCompleto}
                dataSet={{ indice: String(indice) }}
                className={`landing-quadro flex-col items-center justify-center ${indice === 0 ? "landing-quadro-ativo" : "landing-quadro-futuro"}`}
              >
                <Text className="landing-numero">MENSAGEM {String(indice + 1).padStart(2, "0")}</Text>
                <View accessibilityRole="header" accessibilityLabel={textoCompleto} className="landing-frase w-full flex-row flex-wrap items-center justify-center">
                  <PalavrasAnimadas texto={quadro.antes} />
                  <PalavrasAnimadas texto={quadro.destaque} destaque />
                </View>
                {indice === 0 ? <Text className="landing-convite-rolagem">Continue no seu ritmo <Text aria-hidden={true}>↓</Text></Text> : null}
              </View>
            );
          })}
        </View>

        <View className="landing-final flex-col items-center justify-center">
          <Text className="landing-final-sobretitulo">A HISTÓRIA CONTINUA</Text>
          <Text accessibilityRole="header" className="landing-final-titulo">
            Quer conhecer mais sobre <Text className="landing-destaque landing-destaque-final">esse amor?</Text>
          </Text>
          <Text className="landing-final-descricao">
            Leia sobre Jesus, a Bíblia e a esperança que a fé cristã apresenta. Sem cadastro e no seu ritmo.
          </Text>

          <Link href="/conhecer" asChild>
            <Pressable className="landing-acao landing-acao-principal flex-row items-center justify-center">
              <Text className="landing-acao-principal-texto">Conhecer mais sobre esse amor</Text>
              <Text aria-hidden={true} className="landing-seta">↗</Text>
            </Pressable>
          </Link>
          <Link href="/leitura" asChild>
            <Pressable className="landing-acao landing-acao-secundaria flex-row items-center justify-center">
              <Text className="landing-acao-secundaria-texto">Abrir a Bíblia online</Text>
            </Pressable>
          </Link>

          <Text className="landing-referencias">
            Para conferir a mensagem: João 3:16, Romanos 3:23 e 5:8, Efésios 2:8–9, 1 Coríntios 15:3–4.
          </Text>
          <Text className="landing-assinatura-final">Uma leitura cristã baseada na Bíblia.</Text>
        </View>
      </ScrollView>
    </>
  );
}
