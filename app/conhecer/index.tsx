import Head from "expo-router/head";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const ESTUDOS = [
  { href: "/conhecer/jesus", titulo: "Quem é Jesus?", descricao: "Conheça sua vida, seus ensinamentos e o que a Bíblia diz sobre sua morte e ressurreição." },
  { href: "/conhecer/biblia", titulo: "O que é a Bíblia?", descricao: "Uma introdução simples aos livros e à história que atravessa a Bíblia." },
  { href: "/conhecer/salvacao", titulo: "A história da salvação", descricao: "Da criação à esperança cristã: entenda o que a Bíblia chama de salvação." },
];

export default function Conhecer() {
  return (
    <>
      <Head>
        <title>Conhecer mais sobre esse amor</title>
        <meta name="description" content="Leituras introdutórias sobre Jesus, a Bíblia e a história da salvação." />
      </Head>
      <ScrollView className="flex-1 bg-black" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full max-w-3xl self-center px-6 pb-16 pt-8 md:px-10 md:pt-14">
          <Link href="/" asChild>
            <Pressable accessibilityRole="link" className="min-h-11 self-start justify-center pr-4">
              <Text className="text-sm text-white/70">← Voltar à mensagem</Text>
            </Pressable>
          </Link>
          <Text accessibilityRole="header" className="mt-8 text-4xl font-semibold leading-tight text-white md:text-5xl">
            Conhecer mais sobre esse amor
          </Text>
          <Text className="mt-5 text-lg leading-8 text-white/80">
            Você pode explorar estas leituras no seu ritmo. Não é preciso criar uma conta nem assumir um compromisso.
          </Text>

          <View className="mt-9 gap-3">
            {ESTUDOS.map((estudo) => (
              <Link key={estudo.href} href={estudo.href as never} asChild>
                <Pressable className="min-h-28 justify-center rounded-2xl border border-white/20 px-5 py-5 active:bg-white/10">
                  <Text className="text-xl font-semibold text-white">{estudo.titulo}</Text>
                  <Text className="mt-2 text-sm leading-6 text-white/70">{estudo.descricao}</Text>
                </Pressable>
              </Link>
            ))}
          </View>

          <View className="mt-10 border-t border-white/15 pt-8">
            <Text className="text-base leading-7 text-white/80">
              Se preferir, você pode abrir a Bíblia e ler diretamente os textos citados.
            </Text>
            <Link href="/leitura" asChild>
              <Pressable className="mt-5 min-h-12 items-center justify-center rounded-full bg-white px-6">
                <Text className="font-semibold text-black">Abrir a Bíblia online</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
