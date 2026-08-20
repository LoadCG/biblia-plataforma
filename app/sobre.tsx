import { Link } from "expo-router";
import { Linking, ScrollView, Text, View } from "react-native";
import { BotaoTema } from "../components/BotaoTema";

const URL_REPOSITORIO = "https://github.com/LoadCG/biblia-plataforma";

function Secao({ titulo, children }: { titulo: string; children: string }) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-2">{titulo}</Text>
      <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark leading-6">{children}</Text>
    </View>
  );
}

export default function Sobre() {
  return (
    <ScrollView className="flex-1 bg-cor-fundo dark:bg-cor-fundo-dark">
      <View className="px-5 pt-6 pb-10 max-w-2xl w-full mx-auto">
        <View className="flex-row items-center justify-between mb-2">
          <Link href="/voce" className="text-cor-destaque dark:text-cor-destaque-dark text-sm">
            ← Você
          </Link>
          <BotaoTema />
        </View>
        <Text className="text-2xl font-bold text-cor-texto dark:text-cor-texto-dark mb-1">Sobre o projeto</Text>
        <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-6">
          Metodologia, fontes e limitações — de forma transparente.
        </Text>

        <Secao titulo="O que é">
          Uma plataforma de leitura bíblica independente: texto completo da
          Bíblia, resumos históricos por livro, acompanhamento de progresso
          de leitura e um sistema simples de marcos (medalhas) — sem
          pontuação, ranking ou qualquer forma de competição entre usuários.
          Não é vinculada a nenhuma igreja, editora ou instituição.
        </Secao>

        <Secao titulo="Texto bíblico">
          O texto integral usado no app é a Almeida Corrigida Fiel (ACF),
          uma tradução em domínio público. Por ser de domínio público, o
          texto inteiro (cerca de 31 mil versículos) está embutido no
          próprio aplicativo — a leitura funciona offline, sem depender de
          uma API externa a cada capítulo aberto.
        </Secao>

        <Secao titulo="Resumos por livro">
          Os resumos históricos e teológicos de cada um dos 66 livros
          (autoria, data provável de escrita, contexto histórico, estrutura
          e temas principais) são conteúdo autoral, escrito especificamente
          para este projeto. Nas questões em que existe debate acadêmico
          real (datação, autoria de determinados livros, por exemplo), o
          texto segue a posição tradicional/conservadora como referência
          principal, citando explicitamente quando existe uma visão
          acadêmica alternativa relevante — a intenção é ser transparente
          sobre o debate, não apresentar uma única posição como consenso
          incontestável.
        </Secao>

        <Secao titulo="Limitações">
          Este não é um projeto de crítica textual nem uma edição
          acadêmica/científica da Bíblia. Os resumos são um ponto de
          partida para estudo, não substituem comentários bíblicos
          especializados, cursos de teologia ou o aconselhamento de um
          pastor/liderança da sua igreja. Eventuais imprecisões nos resumos
          podem ser reportadas abrindo uma issue no repositório (veja
          abaixo).
        </Secao>

        <Secao titulo="Privacidade">
          O app não exige criar conta para usar nenhuma funcionalidade.
          Grifos, notas, versículos salvos e progresso de leitura ficam
          associados a um identificador anônimo gerado no seu próprio
          dispositivo — nenhum desses dados é enviado a um servidor. Veja
          "Meus dados" em Configurações para exportar ou apagar tudo a
          qualquer momento.
        </Secao>

        <Secao titulo="Código aberto">
          O código-fonte completo deste app é público. Contribuições,
          correções e relatos de bugs são bem-vindos.
        </Secao>
        <Text
          onPress={() => Linking.openURL(URL_REPOSITORIO)}
          accessibilityRole="link"
          className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark -mt-4 mb-2"
        >
          {URL_REPOSITORIO}
        </Text>
      </View>
    </ScrollView>
  );
}
