import { useLocalSearchParams } from "expo-router";
import { EstudoEvangelistico } from "../../../components/EstudoEvangelistico";
import { encontrarTemaEvangelistico, TEMAS_EVANGELISTICOS } from "../../../core/content/temasEvangelisticos";

export function generateStaticParams(): { tema: string }[] {
  return TEMAS_EVANGELISTICOS.map(({ slug }) => ({ tema: slug }));
}

export default function LeituraTematica() {
  const { tema: slug } = useLocalSearchParams<{ tema: string }>();
  const tema = encontrarTemaEvangelistico(slug);

  if (!tema) {
    return (
      <EstudoEvangelistico
        titulo="Leitura não encontrada"
        descricao="Este assunto ainda não tem uma leitura disponível. Você pode escolher outro tema ou seguir direto para a Bíblia."
        secoes={[]}
        rotuloAbertura="CAMINHO NÃO ENCONTRADO"
      />
    );
  }

  return (
    <EstudoEvangelistico
      titulo={tema.chamada}
      descricao={tema.descricao}
      secoes={tema.secoes}
      rotuloAbertura="LEITURA POR ASSUNTO"
      notaAbertura="Esta leitura não é um diagnóstico nem substitui cuidado profissional. Nesta versão, o site não recebe relatos nem pedidos de oração."
    />
  );
}
