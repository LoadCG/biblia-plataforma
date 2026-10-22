import { EstudoEvangelistico } from "../../components/EstudoEvangelistico";

export default function ConhecerJesus() {
  return (
    <EstudoEvangelistico
      titulo="Quem é Jesus?"
      descricao="Para a fé cristã, Jesus não é apenas um mestre do passado. A Bíblia o apresenta como aquele por meio de quem Deus se aproxima de nós."
      secoes={[
        {
          titulo: "Uma vida que acolhe e ensina",
          texto: "Nos relatos dos Evangelhos, Jesus encontra pessoas de diferentes histórias. Ele ensina sobre amar a Deus e ao próximo, recebe quem era desprezado e chama seus seguidores a viver com misericórdia e verdade.",
          referencias: [{ rotulo: "Marcos 2", href: "/leitura/41-marcos/2" }, { rotulo: "Lucas 10", href: "/leitura/42-lucas/10" }],
        },
        {
          titulo: "A cruz",
          texto: "Os cristãos entendem a morte de Jesus na cruz como parte central da obra de Deus para lidar com o pecado e reconciliar pessoas consigo. A cruz não é apresentada como prova de que a dor humana seja pequena; ela mostra o custo e a profundidade do amor que a Bíblia anuncia.",
          referencias: [{ rotulo: "Romanos 5:6–8", href: "/leitura/45-romanos/5?versiculo=6" }, { rotulo: "1 Pedro 2:24", href: "/leitura/60-1-pedro/2?versiculo=24" }],
        },
        {
          titulo: "A ressurreição",
          texto: "A mensagem cristã não termina na morte. Os primeiros seguidores anunciaram que Jesus ressuscitou. Para eles, isso confirma a esperança de que o pecado e a morte não terão a palavra final.",
          referencias: [{ rotulo: "1 Coríntios 15:3–8", href: "/leitura/46-1-corintios/15?versiculo=3" }, { rotulo: "João 20", href: "/leitura/43-joao/20" }],
        },
        {
          titulo: "Um convite, sem pressão",
          texto: "A resposta cristã é conhecer Jesus, confiar nele e aprender seu caminho. Você pode começar lendo um dos Evangelhos, como Marcos ou João, e conferir por si mesmo o que os textos dizem.",
          referencias: [{ rotulo: "João 3:16–17", href: "/leitura/43-joao/3?versiculo=16" }, { rotulo: "Marcos 1", href: "/leitura/41-marcos/1" }],
        },
      ]}
    />
  );
}
