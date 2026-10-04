import { Link, router } from "expo-router";
import Head from "expo-router/head";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";
import { IconeUI } from "../components/icone/IconeUI";

const SECOES = [
  {
    titulo: "Sem conta e sem sincronização",
    texto: "Você não precisa criar uma conta. O perfil e os dados de leitura ficam associados a um identificador anônimo criado neste dispositivo; eles não são sincronizados entre aparelhos.",
  },
  {
    titulo: "O que fica salvo aqui",
    texto: "Suas anotações, grifos, versículos salvos e progresso de leitura são guardados localmente. O progresso dos planos também é mantido neste dispositivo para você retomar a leitura.",
  },
  {
    titulo: "Exportar ou apagar",
    texto: "Em Configurações, na seção Meus dados, você pode exportar seus dados pessoais ou apagar grifos, notas, itens salvos, progresso e planos deste dispositivo. Apagar é permanente e não pode ser desfeito.",
  },
];

export default function DadosEPrivacidade() {
  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <Head>
        <title>Dados e privacidade — Bíblia Plataforma</title>
        <meta name="description" content="Saiba quais dados ficam neste dispositivo e como exportar ou apagar suas informações de leitura." />
      </Head>
      <View className="px-5 pt-6 lg:pt-10 pb-12 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/ajuda"))}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="min-h-11 flex-row items-center gap-1 pr-3 active:opacity-70"
          >
            <IconeUI name="back" size={18} className="text-cor-destaque dark:text-cor-destaque-dark" />
            <Text className="text-sm text-cor-destaque dark:text-cor-destaque-dark">Voltar</Text>
          </Pressable>
          <BotaoTema />
        </View>

        <View className="flex-row items-center gap-3 mb-2">
          <View aria-hidden={true} className="h-11 w-11 items-center justify-center rounded-2xl bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark">
            <IconeUI name="info" size={22} className="text-cor-destaque dark:text-cor-destaque-dark" />
          </View>
          <Text accessibilityRole="header" className="flex-1 text-3xl font-bold text-cor-texto dark:text-cor-texto-dark">Dados e privacidade</Text>
        </View>
        <Text className="text-base leading-6 text-cor-texto-suave dark:text-cor-texto-suave-dark mb-7">
          Entenda como o aplicativo guarda suas informações e onde você pode gerenciá-las.
        </Text>

        {SECOES.map((secao) => (
          <View key={secao.titulo} className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-4 mb-3">
            <Text accessibilityRole="header" className="text-base font-bold text-cor-texto dark:text-cor-texto-dark mb-1.5">{secao.titulo}</Text>
            <Text className="text-sm leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark">{secao.texto}</Text>
          </View>
        ))}

        <Link href="/configuracoes" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityHint="Abre as opções de exportação e exclusão dos seus dados"
            className="min-h-12 flex-row items-center justify-center gap-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark px-5 py-3 mt-3 active:opacity-80"
          >
            <Text className="text-sm font-bold text-white dark:text-cor-texto">Gerenciar meus dados</Text>
            <IconeUI name="next" size={17} className="text-white dark:text-cor-texto" />
          </Pressable>
        </Link>

        <Link href="/sobre" asChild>
          <Pressable accessibilityRole="link" className="min-h-11 items-center justify-center mt-3 active:opacity-70">
            <Text className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark">Sobre o projeto e sua metodologia</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
