import Head from "expo-router/head";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TEMAS_EVANGELISTICOS } from "../../core/content/temasEvangelisticos";

const ESTUDOS = [
  {
    href: "/conhecer/jesus",
    numero: "01",
    tema: "JESUS",
    titulo: "Quem é Jesus?",
    descricao: "Conheça a vida de Jesus, seu cuidado pelas pessoas e por que sua morte e ressurreição são centrais para a fé cristã.",
  },
  {
    href: "/conhecer/biblia",
    numero: "02",
    tema: "ESCRITURAS",
    titulo: "O que é a Bíblia?",
    descricao: "Uma introdução aos livros da Bíblia e à história que atravessa suas páginas.",
  },
  {
    href: "/conhecer/salvacao",
    numero: "03",
    tema: "ESPERANÇA",
    titulo: "A história da salvação",
    descricao: "Entenda o que a Bíblia chama de salvação, da criação à esperança cristã.",
  },
];

export default function Conhecer() {
  return (
    <>
      <Head>
        <title>Conhecer mais sobre esse amor</title>
        <meta name="description" content="Leituras introdutórias sobre Jesus, a Bíblia e a história da salvação." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <ScrollView className="conhecer-page flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="conhecer-shell">
          <Link href="/" asChild>
            <Pressable accessibilityRole="link" className="conhecer-voltar">
              <Text className="conhecer-voltar-seta" aria-hidden={true}>←</Text>
              <Text className="conhecer-voltar-texto">Voltar à mensagem</Text>
            </Pressable>
          </Link>

          <View className="conhecer-abertura">
            <Text className="conhecer-sobretitulo">UM PRIMEIRO PASSO</Text>
            <Text accessibilityRole="header" className="conhecer-titulo">
              Conhecer mais sobre <Text className="conhecer-destaque">esse amor.</Text>
            </Text>
            <Text className="conhecer-introducao">
              A história que você acabou de conhecer continua. Explore estas leituras no seu ritmo, sem cadastro e sem compromisso.
            </Text>
          </View>

          <View className="conhecer-lista">
            {ESTUDOS.map((estudo) => (
              <Link key={estudo.href} href={estudo.href as never} asChild>
                <Pressable accessibilityRole="link" className="conhecer-card">
                  <View className="conhecer-card-topo">
                    <Text className="conhecer-card-numero">{estudo.numero}</Text>
                    <Text className="conhecer-card-tema">{estudo.tema}</Text>
                    <Text className="conhecer-card-seta" aria-hidden={true}>↗</Text>
                  </View>
                  <Text className="conhecer-card-titulo">{estudo.titulo}</Text>
                  <Text className="conhecer-card-descricao">{estudo.descricao}</Text>
                  <Text className="conhecer-card-link">COMEÇAR A LEITURA <Text aria-hidden={true}>→</Text></Text>
                </Pressable>
              </Link>
            ))}
          </View>

          <View className="temas-abertura">
            <Text className="conhecer-sobretitulo">LEITURAS POR ASSUNTO</Text>
            <Text accessibilityRole="header" className="temas-titulo">Tem algum assunto que gostaria de explorar?</Text>
            <Text className="temas-descricao">
              Escolha apenas se fizer sentido para você. Estes caminhos não são diagnósticos nem substituem cuidado profissional.
            </Text>
          </View>

          <View className="temas-lista">
            {TEMAS_EVANGELISTICOS.map((tema, indice) => (
              <Link key={tema.slug} href={`/conhecer/temas/${tema.slug}` as never} asChild>
                <Pressable accessibilityRole="link" className="tema-card">
                  <Text className="tema-card-numero">{String(indice + 1).padStart(2, "0")}</Text>
                  <Text className="tema-card-rotulo">{tema.rotulo}</Text>
                  <Text className="tema-card-seta" aria-hidden={true}>↗</Text>
                </Pressable>
              </Link>
            ))}
          </View>
          <Text className="temas-aviso">Nesta versão, cada assunto abre uma leitura. O site ainda não recebe relatos nem pedidos de oração.</Text>

          <View className="conhecer-biblia">
            <View className="conhecer-biblia-textos">
              <Text className="conhecer-biblia-sobretitulo">PREFERE IR DIRETO À FONTE?</Text>
              <Text className="conhecer-biblia-titulo">Leia a Bíblia por conta própria.</Text>
              <Text className="conhecer-biblia-descricao">Abra os textos citados e confira a mensagem nas próprias Escrituras.</Text>
            </View>
            <Link href="/leitura" asChild>
              <Pressable accessibilityRole="link" className="conhecer-biblia-botao">
                <Text className="conhecer-biblia-botao-texto">Abrir a Bíblia online</Text>
                <Text className="conhecer-biblia-botao-seta" aria-hidden={true}>↗</Text>
              </Pressable>
            </Link>
          </View>

          <Text className="conhecer-rodape">Uma leitura cristã baseada na Bíblia.</Text>
        </View>
      </ScrollView>
    </>
  );
}
