import { EstudoEvangelistico } from "../../components/EstudoEvangelistico";

export default function ConhecerBiblia() {
  return (
    <EstudoEvangelistico
      titulo="O que é a Bíblia?"
      descricao="A Bíblia é uma coleção de livros escritos em diferentes épocas e gêneros. Para a tradição protestante, ela é a referência central para conhecer a mensagem cristã e avaliar o ensino da igreja."
      secoes={[
        {
          titulo: "Uma biblioteca de livros",
          texto: "A Bíblia reúne narrativas, poesias, leis, profecias, cartas e outros escritos. Os cristãos costumam organizá-la em duas grandes partes: Antigo Testamento e Novo Testamento. O Novo Testamento apresenta a vida de Jesus, o início da igreja e cartas dirigidas às primeiras comunidades cristãs.",
          referencias: [{ rotulo: "Lucas 1:1–4", href: "/leitura/42-lucas/1?versiculo=1" }, { rotulo: "2 Timóteo 3:14–17", href: "/leitura/55-2-timoteo/3?versiculo=14" }],
        },
        {
          titulo: "Uma história que aponta para Jesus",
          texto: "Os livros bíblicos têm contextos e estilos diferentes, mas a fé cristã lê a Bíblia como uma história que começa com a criação, apresenta a relação de Deus com seu povo e chega à vida, morte e ressurreição de Jesus.",
          referencias: [{ rotulo: "Gênesis 1", href: "/leitura/01-genesis/1" }, { rotulo: "Lucas 24:25–27", href: "/leitura/42-lucas/24?versiculo=25" }],
        },
        {
          titulo: "Como começar",
          texto: "Você não precisa conhecer todos os livros para começar. Leia um trecho curto, observe quem está falando, para quem e o que acontece. Marcos oferece um relato direto sobre Jesus; João explica por que seu autor escreveu esse Evangelho.",
          referencias: [{ rotulo: "Marcos 1", href: "/leitura/41-marcos/1" }, { rotulo: "João 20:30–31", href: "/leitura/43-joao/20?versiculo=30" }],
        },
      ]}
    />
  );
}
