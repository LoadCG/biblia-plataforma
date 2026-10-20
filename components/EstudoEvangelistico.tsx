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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <ScrollView className="conhecer-page flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="estudo-shell">
          <Link href="/conhecer" asChild>
            <Pressable accessibilityRole="link" className="conhecer-voltar">
              <Text className="conhecer-voltar-seta" aria-hidden={true}>←</Text>
              <Text className="conhecer-voltar-texto">Todas as leituras</Text>
            </Pressable>
          </Link>

          <View className="estudo-abertura">
            <Text className="conhecer-sobretitulo">LEITURA INTRODUTÓRIA</Text>
            <Text accessibilityRole="header" className="estudo-titulo">{titulo}</Text>
            <Text className="estudo-descricao">{descricao}</Text>
            <View className="estudo-nota">
              <Text className="estudo-nota-marca" aria-hidden={true}>i</Text>
              <Text className="estudo-nota-texto">Leia com calma. As referências levam aos trechos da Bíblia para você conferir o contexto.</Text>
            </View>
          </View>

          <View className="estudo-secoes">
            {secoes.map((secao, indice) => (
              <View key={secao.titulo} className="estudo-secao">
                <View className="estudo-secao-indice">
                  <Text className="estudo-secao-numero">{String(indice + 1).padStart(2, "0")}</Text>
                  <View className="estudo-secao-linha" />
                </View>
                <View className="estudo-secao-conteudo">
                  <Text accessibilityRole="header" className="estudo-secao-titulo">{secao.titulo}</Text>
                  <Text className="estudo-secao-texto">{secao.texto}</Text>
                  {secao.referencias?.length ? (
                    <View className="estudo-referencias">
                      <Text className="estudo-referencias-legenda">LEIA NA BÍBLIA</Text>
                      <View className="estudo-referencias-lista">
                        {secao.referencias.map((referencia) => (
                          <Link key={referencia.rotulo} href={referencia.href as never} asChild>
                            <Pressable accessibilityRole="link" className="estudo-referencia">
                              <Text className="estudo-referencia-texto">{referencia.rotulo}</Text>
                              <Text className="estudo-referencia-seta" aria-hidden={true}>↗</Text>
                            </Pressable>
                          </Link>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View className="estudo-final">
            <Text className="estudo-final-sobretitulo">CONTINUE NO SEU RITMO</Text>
            <Text className="estudo-final-titulo">A próxima página pode ser <Text className="conhecer-destaque">a Bíblia.</Text></Text>
            <Text className="estudo-final-descricao">
              Estas explicações são um começo. Leia os textos bíblicos, faça perguntas e tire suas próprias conclusões.
            </Text>
            <Link href="/leitura" asChild>
              <Pressable accessibilityRole="link" className="conhecer-biblia-botao estudo-final-botao">
                <Text className="conhecer-biblia-botao-texto">Abrir a Bíblia online</Text>
                <Text className="conhecer-biblia-botao-seta" aria-hidden={true}>↗</Text>
              </Pressable>
            </Link>
            <Link href="/conhecer" asChild>
              <Pressable accessibilityRole="link" className="estudo-outra-leitura">
                <Text className="estudo-outra-leitura-texto">Explorar outras leituras</Text>
                <Text className="estudo-outra-leitura-seta" aria-hidden={true}>→</Text>
              </Pressable>
            </Link>
          </View>

          <Text className="conhecer-rodape">Uma leitura cristã baseada na Bíblia.</Text>
        </View>
      </ScrollView>
    </>
  );
}
