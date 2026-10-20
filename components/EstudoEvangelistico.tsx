import Head from "expo-router/head";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export type SecaoEstudo = {
  titulo: string;
  texto: string;
  referencias?: { rotulo: string; href: string }[];
};

export function EstudoEvangelistico({
  titulo,
  descricao,
  secoes,
}: {
  titulo: string;
  descricao: string;
  secoes: SecaoEstudo[];
}) {
  return (
    <>
      <Head>
        <title>{titulo} — Tem alguém que te ama</title>
        <meta name="description" content={descricao} />
      </Head>
      <ScrollView className="flex-1 bg-black" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full max-w-3xl self-center px-6 pb-16 pt-8 md:px-10 md:pt-14">
          <Link href="/conhecer" asChild>
            <Pressable accessibilityRole="link" className="min-h-11 self-start justify-center pr-4">
              <Text className="text-sm text-white/70">← Conhecer mais</Text>
            </Pressable>
          </Link>
          <Text accessibilityRole="header" className="mt-8 text-4xl font-semibold leading-tight text-white md:text-5xl">
            {titulo}
          </Text>
          <Text className="mt-5 text-lg leading-8 text-white/80">{descricao}</Text>

          {secoes.map((secao) => (
            <View key={secao.titulo} className="mt-10 border-t border-white/15 pt-7">
              <Text accessibilityRole="header" className="text-2xl font-semibold leading-snug text-white">
                {secao.titulo}
              </Text>
              <Text className="mt-3 text-base leading-7 text-white/80">{secao.texto}</Text>
              {secao.referencias?.length ? (
                <View className="mt-4 flex-row flex-wrap gap-x-4 gap-y-2">
                  {secao.referencias.map((referencia) => (
                    <Link key={referencia.rotulo} href={referencia.href as never} asChild>
                      <Pressable accessibilityRole="link" className="min-h-11 justify-center">
                        <Text className="text-sm font-semibold text-white underline">{referencia.rotulo}</Text>
                      </Pressable>
                    </Link>
                  ))}
                </View>
              ) : null}
            </View>
          ))}

          <View className="mt-12 border-t border-white/15 pt-8">
            <Text className="text-base leading-7 text-white/75">
              Estas páginas são um começo para leitura e reflexão. Elas não substituem o texto bíblico nem cuidado profissional quando necessário.
            </Text>
            <Link href="/leitura" asChild>
              <Pressable className="mt-6 min-h-12 items-center justify-center rounded-full bg-white px-6">
                <Text className="font-semibold text-black">Abrir a Bíblia online</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
