import { EstudoEvangelistico } from "../../components/EstudoEvangelistico";

export default function HistoriaDaSalvacao() {
  return (
    <EstudoEvangelistico
      titulo="A história da salvação"
      descricao="Na Bíblia, salvação é a ação de Deus para resgatar e reconciliar pessoas consigo. Esta é uma visão breve da história que a fé cristã encontra nas Escrituras."
      secoes={[
        {
          titulo: "Criados para a vida com Deus",
          texto: "A Bíblia começa apresentando Deus como criador e a vida humana como algo que recebe valor dele. O propósito não é dizer que a vida será livre de sofrimento, mas que ela não é um acidente sem significado diante de Deus.",
          referencias: [{ rotulo: "Gênesis 1:26–31", href: "/leitura/01-genesis/1?versiculo=26" }, { rotulo: "Salmo 8", href: "/leitura/19-salmos/8" }],
        },
        {
          titulo: "O que a Bíblia chama de pecado",
          texto: "Pecado é a ruptura com Deus que também aparece em escolhas que ferem o próximo e a nós mesmos. A Bíblia não trata o mal como algo que só os outros fazem: todos precisamos de perdão e de uma vida restaurada.",
          referencias: [{ rotulo: "Romanos 3:23", href: "/leitura/45-romanos/3?versiculo=23" }, { rotulo: "Romanos 6:23", href: "/leitura/45-romanos/6?versiculo=23" }],
        },
        {
          titulo: "Jesus e a graça",
          texto: "Segundo o Novo Testamento, Jesus morreu e ressuscitou para reconciliar pessoas com Deus. Graça significa favor que não se compra nem se conquista como salário. A salvação é recebida pela fé — confiança em Jesus — e conduz a uma vida de amor e boas obras, não à ideia de que alguém nunca mais terá dificuldades.",
          referencias: [{ rotulo: "Efésios 2:1–10", href: "/leitura/49-efesios/2" }, { rotulo: "1 Coríntios 15:3–4", href: "/leitura/46-1-corintios/15?versiculo=3" }],
        },
        {
          titulo: "Uma esperança para o futuro",
          texto: "A esperança cristã inclui perdão e uma nova relação com Deus no presente, e aguarda a restauração final de todas as coisas. Essa esperança não apaga o luto nem substitui ajuda prática; ela convida a caminhar com Deus e a buscar o bem do próximo.",
          referencias: [{ rotulo: "Apocalipse 21:1–5", href: "/leitura/66-apocalipse/21?versiculo=1" }, { rotulo: "Romanos 8:18–25", href: "/leitura/45-romanos/8?versiculo=18" }],
        },
      ]}
    />
  );
}
