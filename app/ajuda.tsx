import { Link, router } from "expo-router";
import Head from "expo-router/head";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { IconeUI } from "../components/icone/IconeUI";

const DUVIDAS = [
  {
    pergunta: "Bíblia e resumos contam o mesmo progresso?",
    resposta: "Não. Na Bíblia, você marca capítulos lidos. Em Resumos, marca cada livro depois de estudar seu resumo. Os dois avanços são independentes.",
  },
  {
    pergunta: "Como funciona a sequência diária?",
    resposta: "Ela considera os dias em que você marcou ao menos um capítulo bíblico como lido. Ler um resumo ou abrir um capítulo, sem marcá-lo, não altera essa sequência.",
  },
  {
    pergunta: "Como acompanho um plano?",
    resposta: "Abra Planos, escolha uma trilha e comece um dia. Ao avançar pelas leituras do dia, o plano registra a sessão; também é possível marcar ou desmarcar um dia diretamente no plano. O progresso do plano é próprio.",
  },
  {
    pergunta: "O que posso fazer com um versículo?",
    resposta: "Na leitura, selecione um versículo para abrir as ações disponíveis: salvar, grifar, anotar ou compartilhar. Também é possível selecionar mais de um versículo para algumas ações.",
  },
  {
    pergunta: "Preciso criar uma conta? Onde ficam meus dados?",
    resposta: "Não há conta. Perfil, notas, marcações, progresso e planos ficam neste dispositivo, sem sincronização entre aparelhos. Em Configurações, você pode exportar ou apagar seus dados.",
  },
  {
    pergunta: "Qual tradução bíblica está disponível?",
    resposta: "O texto bíblico disponível é a Almeida Corrigida Fiel (ACF). Em Sobre o projeto, você encontra informações sobre a tradução, os resumos editoriais e os limites do conteúdo.",
  },
];

const DESTINOS = [
  { href: "/biblia/escolher", rotulo: "Escolher um livro da Bíblia" },
  { href: "/resumos", rotulo: "Explorar os resumos dos livros" },
  { href: "/planos", rotulo: "Ver planos de leitura" },
  { href: "/privacidade", rotulo: "Entender meus dados e privacidade" },
  { href: "/configuracoes", rotulo: "Exportar ou apagar meus dados" },
  { href: "/sobre", rotulo: "Conhecer o projeto e a metodologia" },
] as const;

export default function Ajuda() {
  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Head>
        <title>Ajuda e como usar — Bíblia Plataforma</title>
        <meta name="description" content="Entenda como funcionam a leitura bíblica, os resumos, os planos e o progresso local." />
      </Head>
      <View className="px-5 pt-6 lg:pt-10 pb-12 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/configuracoes"))}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="min-h-11 flex-row items-center gap-1 pr-3 active:opacity-70"
          >
            <IconeUI name="back" size={18} className="text-cor-destaque dark:text-cor-destaque-dark" />
            <Text className="text-sm text-cor-destaque dark:text-cor-destaque-dark">Voltar</Text>
          </Pressable>
          <BotaoTema />
        </View>

        <Text accessibilityRole="header" className="text-3xl font-bold text-cor-texto dark:text-cor-texto-dark mb-2">Ajuda e como usar</Text>
        <Text className="text-base leading-6 text-cor-texto-suave dark:text-cor-texto-suave-dark mb-7">
          Um guia rápido para entender seu progresso e encontrar os recursos principais.
        </Text>

        {DUVIDAS.map((item) => (
          <View key={item.pergunta} className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 mb-3">
            <Text accessibilityRole="header" className="text-base font-bold text-cor-texto dark:text-cor-texto-dark mb-1.5">{item.pergunta}</Text>
            <Text className="text-sm leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark">{item.resposta}</Text>
          </View>
        ))}

        <Text accessibilityRole="header" className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mt-6 mb-3">Ir direto para</Text>
        <View className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4">
          {DESTINOS.map((destino, indice) => (
            <Link key={destino.href} href={destino.href} asChild>
              <Pressable
                accessibilityRole="link"
                className={`min-h-12 flex-row items-center justify-between active:opacity-70 ${indice < DESTINOS.length - 1 ? "border-b border-cor-borda dark:border-cor-borda-dark" : ""}`}
              >
                <Text className="text-sm font-semibold text-cor-texto dark:text-cor-texto-dark">{destino.rotulo}</Text>
                <IconeUI name="next-chevron" size={18} className="text-cor-texto-suave dark:text-cor-texto-suave-dark" />
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
