import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, ScrollView, Text, View } from "react-native";

const QUADROS = [
  "Tem alguém que te ama.",
  "Mesmo que ninguém perceba, sua vida tem valor.",
  "Você não precisa ser perfeito para ser amado.",
  "Sua história não apaga seu valor. Sua dor não precisa ser escondida.",
  "O amor verdadeiro escuta, acolhe e permanece.",
  "A Bíblia conta de onde vem esse amor: Deus o revelou em Jesus Cristo.",
  "Jesus se aproximou de quem era deixado de lado. Ouviu, cuidou e ensinou com verdade.",
  "Todos nós nos afastamos de Deus. Jesus morreu na cruz por nós.",
  "A Bíblia anuncia que Deus o ressuscitou.",
  "Por graça — um presente, não uma recompensa — Deus oferece perdão e nova vida a quem confia em Jesus.",
];

export default function LandingEvangelismo() {
  const raizRef = useRef<ScrollView>(null);
  const [temaClaro, setTemaClaro] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raiz = raizRef.current as unknown as HTMLElement | null;
    if (!raiz || typeof IntersectionObserver === "undefined") return;
    const quadros = Array.from(raiz.querySelectorAll<HTMLElement>(".landing-quadro"));
    if (!quadros.length) return;

    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        entrada.target.classList.toggle("landing-quadro-ativo", entrada.isIntersecting);
      }
    }, { threshold: 0.55 });

    raiz.classList.add("landing-com-animacao");
    quadros.forEach((quadro) => observador.observe(quadro));
    return () => {
      observador.disconnect();
      raiz.classList.remove("landing-com-animacao");
    };
  }, []);

  const fundo = temaClaro ? "bg-white" : "bg-black";
  const texto = temaClaro ? "text-black" : "text-white";
  const linha = temaClaro ? "border-black/20" : "border-white/20";
  const botao = temaClaro ? "border-black/40 text-black" : "border-white/40 text-white";

  return (
    <>
      <Head>
        <title>Tem alguém que te ama.</title>
        <meta name="description" content="Uma mensagem sobre o amor de Deus revelado em Jesus Cristo." />
        <meta name="theme-color" content={temaClaro ? "#ffffff" : "#000000"} />
      </Head>
      <ScrollView
        ref={raizRef}
        className={`landing-evangelismo min-h-screen ${fundo} ${texto}`}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="landing-controle-tema sticky top-0 z-10 flex-row justify-end px-5 pt-5">
          <Pressable
            onPress={() => setTemaClaro((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={temaClaro ? "Usar tema escuro" : "Usar tema claro"}
            className={`min-h-11 rounded-full border px-4 justify-center ${botao}`}
          >
            <Text className={`text-xl leading-none ${texto}`} aria-hidden={true}>◐</Text>
          </Pressable>
        </View>

        <View className="w-full items-center">
          {QUADROS.map((frase, indice) => (
            <View key={frase} className={`landing-quadro min-h-[82svh] w-full items-center justify-center px-7 ${indice === 0 ? "pt-0" : ""}`}>
              <Text
                accessibilityRole="header"
                className={`landing-frase max-w-3xl text-center font-semibold leading-tight ${texto} ${indice === 0 ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"}`}
              >
                {frase}
              </Text>
            </View>
          ))}
        </View>

        <View className={`w-full items-center border-t ${linha} px-6 py-16`}>
          <View className="w-full max-w-xl items-center">
            <Text accessibilityRole="header" className={`text-center text-3xl font-semibold leading-tight ${texto}`}>
              Quer conhecer mais sobre esse amor?
            </Text>
            <Text className={`mt-4 text-center text-base leading-7 opacity-80 ${texto}`}>
              Leia sobre Jesus, a Bíblia e a esperança que a fé cristã apresenta. Sem cadastro e no seu ritmo.
            </Text>

            <Link href="/conhecer" asChild>
              <Pressable className={`mt-8 min-h-12 w-full items-center justify-center rounded-full border px-6 ${botao}`}>
                <Text className={`font-semibold ${texto}`}>Conhecer mais sobre esse amor</Text>
              </Pressable>
            </Link>
            <Link href="/leitura" asChild>
              <Pressable className={`mt-3 min-h-12 w-full items-center justify-center rounded-full px-6 ${temaClaro ? "bg-black" : "bg-white"}`}>
                <Text className={`font-semibold ${temaClaro ? "text-white" : "text-black"}`}>Abrir a Bíblia online</Text>
              </Pressable>
            </Link>

            <Text className={`mt-8 text-center text-sm leading-6 opacity-70 ${texto}`}>
              Para conferir a mensagem: João 3:16; Romanos 3:23 e 5:8; Efésios 2:8–9; 1 Coríntios 15:3–4.
            </Text>
            <Text className={`mt-12 text-center text-xs opacity-60 ${texto}`}>
              Uma leitura cristã baseada na Bíblia.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
