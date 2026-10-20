type ReferenciaTema = { rotulo: string; href: string };
type SecaoTema = { titulo: string; texto: string; referencias?: ReferenciaTema[] };

export type TemaEvangelistico = {
  slug: string;
  rotulo: string;
  chamada: string;
  descricao: string;
  secoes: SecaoTema[];
};

/** Rascunhos editoriais para a primeira leitura temática. Revisar pastoralmente antes de divulgação pública. */
export const TEMAS_EVANGELISTICOS: TemaEvangelistico[] = [
  {
    slug: "habitos-e-impulsos",
    rotulo: "Hábitos e impulsos difíceis de controlar",
    chamada: "Hábitos e impulsos",
    descricao: "Uma reflexão bíblica sobre liberdade, escolhas e a importância de não caminhar sozinho.",
    secoes: [
      {
        titulo: "Sua história não cabe em um rótulo",
        texto: "Um comportamento que parece difícil de interromper pode ter causas e consequências diferentes para cada pessoa. Esta leitura não é um diagnóstico nem substitui ajuda especializada. A Bíblia fala sobre liberdade e sobre a necessidade de cuidado mútuo.",
        referencias: [{ rotulo: "Gálatas 5:1", href: "/leitura/48-galatas/5?versiculo=1" }, { rotulo: "Gálatas 6:1–2", href: "/leitura/48-galatas/6?versiculo=1" }],
      },
      {
        titulo: "Pedir ajuda também pode fazer parte do caminho",
        texto: "A fé cristã não ensina que alguém precise enfrentar toda dificuldade em segredo. A comunidade cristã é chamada a levar as cargas uns dos outros. Quando o hábito coloca você ou outra pessoa em risco, procure também apoio profissional e seguro.",
        referencias: [{ rotulo: "Eclesiastes 4:9–10", href: "/leitura/21-eclesiastes/4?versiculo=9" }, { rotulo: "Romanos 12:15", href: "/leitura/45-romanos/12?versiculo=15" }],
      },
    ],
  },
  {
    slug: "sexualidade-e-afetos",
    rotulo: "Sexualidade e vida afetiva",
    chamada: "Sexualidade e afetos",
    descricao: "Uma leitura introdutória sobre dignidade, relacionamentos e responsabilidade diante de Deus e do próximo.",
    secoes: [
      {
        titulo: "Pessoas têm dignidade",
        texto: "A Bíblia apresenta cada pessoa como criada à imagem de Deus. Conversas sobre corpo, sexualidade e afetos pedem respeito, honestidade e cuidado. Esta página não resume todas as questões nem pretende julgar a história de quem lê.",
        referencias: [{ rotulo: "Gênesis 1:26–27", href: "/leitura/01-genesis/1?versiculo=26" }, { rotulo: "Marcos 12:28–31", href: "/leitura/41-marcos/12?versiculo=28" }],
      },
      {
        titulo: "Amor também envolve responsabilidade",
        texto: "Os ensinamentos cristãos relacionam o amor ao cuidado com o outro, à verdade e à responsabilidade. Ao estudar textos sobre sexualidade, vale observar seu contexto e buscar uma conversa pastoral respeitosa, sem humilhação ou coerção.",
        referencias: [{ rotulo: "1 Coríntios 13:4–7", href: "/leitura/46-1-corintios/13?versiculo=4" }, { rotulo: "Efésios 4:15", href: "/leitura/49-efesios/4?versiculo=15" }],
      },
    ],
  },
  {
    slug: "relacionamentos-e-limites",
    rotulo: "Relacionamentos e limites",
    chamada: "Relacionamentos e limites",
    descricao: "Uma reflexão sobre amor ao próximo, honestidade e cuidado nas relações.",
    secoes: [
      {
        titulo: "O amor busca o bem do outro",
        texto: "Jesus ensinou seus seguidores a tratar o próximo com o cuidado que também desejam receber. Isso não torna todo relacionamento simples, nem exige que alguém permaneça em uma situação perigosa.",
        referencias: [{ rotulo: "Mateus 7:12", href: "/leitura/40-mateus/7?versiculo=12" }, { rotulo: "Romanos 12:9–18", href: "/leitura/45-romanos/12?versiculo=9" }],
      },
      {
        titulo: "Verdade e paz caminham com segurança",
        texto: "A Bíblia valoriza a verdade, o perdão e a busca da paz. Perdoar não significa negar o dano, dispensar limites ou se expor novamente à violência. Se existe risco, procure uma pessoa de confiança e apoio especializado.",
        referencias: [{ rotulo: "Efésios 4:25–32", href: "/leitura/49-efesios/4?versiculo=25" }, { rotulo: "Romanos 12:18", href: "/leitura/45-romanos/12?versiculo=18" }],
      },
    ],
  },
  {
    slug: "raiva-e-conflitos",
    rotulo: "Raiva e conflitos",
    chamada: "Raiva e conflitos",
    descricao: "Textos sobre escuta, palavras e responsabilidade em momentos de conflito.",
    secoes: [
      {
        titulo: "Uma pausa pode abrir espaço para ouvir",
        texto: "Sentir raiva não torna alguém automaticamente violento, mas as escolhas feitas durante um conflito podem ferir. A carta de Tiago aconselha escutar com atenção e não agir de modo precipitado.",
        referencias: [{ rotulo: "Tiago 1:19–20", href: "/leitura/59-tiago/1?versiculo=19" }, { rotulo: "Provérbios 15:1", href: "/leitura/20-proverbios/15?versiculo=1" }],
      },
      {
        titulo: "Conflito não justifica violência",
        texto: "O chamado bíblico à reconciliação não autoriza agressão ou ameaça. Em situações de violência, a segurança vem primeiro. Procure ajuda confiável e serviços especializados em sua região.",
        referencias: [{ rotulo: "Efésios 4:26–32", href: "/leitura/49-efesios/4?versiculo=26" }, { rotulo: "Romanos 12:17–21", href: "/leitura/45-romanos/12?versiculo=17" }],
      },
    ],
  },
  {
    slug: "valor-e-autoimagem",
    rotulo: "Valor pessoal e autoimagem",
    chamada: "Valor e autoimagem",
    descricao: "Uma leitura sobre dignidade humana e o valor que a Bíblia relaciona ao cuidado de Deus.",
    secoes: [
      {
        titulo: "Seu valor não depende de desempenho",
        texto: "A Bíblia não mede o valor de uma pessoa por aparência, produtividade ou aprovação pública. Ela apresenta a vida humana como criação de Deus e fala de um amor que não é comprado por méritos.",
        referencias: [{ rotulo: "Gênesis 1:26–27", href: "/leitura/01-genesis/1?versiculo=26" }, { rotulo: "Salmo 139:13–18", href: "/leitura/19-salmos/139?versiculo=13" }],
      },
      {
        titulo: "Acolhimento não elimina toda dificuldade",
        texto: "A esperança cristã pode oferecer companhia e sentido, mas não substitui cuidado psicológico ou médico quando ele é necessário. Você pode buscar ajuda e, ao mesmo tempo, explorar o que a Bíblia ensina sobre dignidade e amor.",
        referencias: [{ rotulo: "Romanos 8:38–39", href: "/leitura/45-romanos/8?versiculo=38" }, { rotulo: "Marcos 12:28–31", href: "/leitura/41-marcos/12?versiculo=28" }],
      },
    ],
  },
  {
    slug: "alcool-e-outras-drogas",
    rotulo: "Uso de álcool e outras drogas",
    chamada: "Álcool e outras drogas",
    descricao: "Uma reflexão cristã que trata a dependência com dignidade e reconhece a importância de apoio qualificado.",
    secoes: [
      {
        titulo: "A dependência não é motivo para humilhar",
        texto: "O uso de substâncias pode envolver fatores de saúde, história de vida e contexto social. Esta página não diagnostica nem promete uma solução rápida. A Bíblia chama a comunidade a tratar as pessoas com compaixão e a carregar fardos em conjunto.",
        referencias: [{ rotulo: "Gálatas 6:1–2", href: "/leitura/48-galatas/6?versiculo=1" }, { rotulo: "Romanos 12:15", href: "/leitura/45-romanos/12?versiculo=15" }],
      },
      {
        titulo: "Buscar cuidado é um passo válido",
        texto: "Se o uso está prejudicando sua saúde ou a vida de alguém próximo, procure uma unidade de saúde ou serviço especializado. A leitura bíblica pode acompanhar essa busca, sem substituí-la.",
        referencias: [{ rotulo: "Marcos 2:15–17", href: "/leitura/41-marcos/2?versiculo=15" }, { rotulo: "1 Coríntios 12:24–26", href: "/leitura/46-1-corintios/12?versiculo=24" }],
      },
    ],
  },
  {
    slug: "adiamento-e-recomeco",
    rotulo: "Adiamento e dificuldade de começar",
    chamada: "Adiamento e recomeço",
    descricao: "Uma leitura sem culpa sobre tempo, pequenos passos e perseverança.",
    secoes: [
      {
        titulo: "Nem todo adiamento tem a mesma causa",
        texto: "Cansaço, sobrecarga, medo ou outras dificuldades podem tornar o começo mais pesado. A Bíblia convida à sabedoria no uso do tempo, sem autorizar que a gente reduza a história de alguém a preguiça.",
        referencias: [{ rotulo: "Eclesiastes 3:1–8", href: "/leitura/21-eclesiastes/3?versiculo=1" }, { rotulo: "Salmo 90:12", href: "/leitura/19-salmos/90?versiculo=12" }],
      },
      {
        titulo: "Um passo possível também é um começo",
        texto: "A fé cristã fala de perseverança e de cuidado mútuo. Se essa dificuldade afeta a rotina ou está ligada a sofrimento persistente, conversar com alguém de confiança ou buscar orientação profissional pode ajudar a compreender o que está acontecendo.",
        referencias: [{ rotulo: "Gálatas 6:9–10", href: "/leitura/48-galatas/6?versiculo=9" }, { rotulo: "Filipenses 2:12–13", href: "/leitura/50-filipenses/2?versiculo=12" }],
      },
    ],
  },
  {
    slug: "ansiedade-e-preocupacao",
    rotulo: "Ansiedade e preocupação",
    chamada: "Ansiedade e preocupação",
    descricao: "Textos bíblicos sobre preocupação, oração e cuidado, sem tratar fé como substituto de tratamento.",
    secoes: [
      {
        titulo: "A Bíblia não manda esconder o que pesa",
        texto: "Os Salmos mostram pessoas levando medo e preocupação a Deus com palavras honestas. Jesus também falou sobre as preocupações da vida cotidiana. Esses textos não prometem que toda ansiedade desaparecerá ao ler ou orar.",
        referencias: [{ rotulo: "Salmo 94:17–19", href: "/leitura/19-salmos/94?versiculo=17" }, { rotulo: "Mateus 6:25–34", href: "/leitura/40-mateus/6?versiculo=25" }],
      },
      {
        titulo: "Fé e cuidado podem caminhar juntos",
        texto: "Se a ansiedade é intensa ou interfere na sua vida, procurar um profissional de saúde é compatível com buscar apoio espiritual. A Bíblia oferece palavras para reflexão e oração, não um diagnóstico nem uma prescrição clínica.",
        referencias: [{ rotulo: "Filipenses 4:4–9", href: "/leitura/50-filipenses/4?versiculo=4" }, { rotulo: "1 Pedro 5:6–7", href: "/leitura/60-1-pedro/5?versiculo=6" }],
      },
    ],
  },
  {
    slug: "rejeicao-e-pertencimento",
    rotulo: "Rejeição e pertencimento",
    chamada: "Rejeição e pertencimento",
    descricao: "Uma reflexão sobre acolhimento, dignidade e comunidade na mensagem bíblica.",
    secoes: [
      {
        titulo: "Ser recebido importa",
        texto: "A Bíblia apresenta histórias de pessoas que foram vistas e acolhidas por Jesus. Isso não apaga experiências de rejeição nem obriga alguém a permanecer em relações que fazem mal.",
        referencias: [{ rotulo: "Marcos 10:13–16", href: "/leitura/41-marcos/10?versiculo=13" }, { rotulo: "Romanos 15:5–7", href: "/leitura/45-romanos/15?versiculo=5" }],
      },
      {
        titulo: "A comunidade é chamada a acolher",
        texto: "No Novo Testamento, a comunidade cristã é chamada a acolher pessoas e a cuidar umas das outras. Você pode conhecer essa mensagem sem precisar afirmar que já pertence a uma igreja.",
        referencias: [{ rotulo: "Tiago 2:1–5", href: "/leitura/59-tiago/2?versiculo=1" }, { rotulo: "1 João 4:9–12", href: "/leitura/62-1-joao/4?versiculo=9" }],
      },
    ],
  },
  {
    slug: "fe-duvidas-e-experiencias",
    rotulo: "Fé, dúvidas e experiências religiosas",
    chamada: "Fé e dúvidas",
    descricao: "Textos bíblicos para quem está começando, fazendo perguntas ou revendo experiências religiosas.",
    secoes: [
      {
        titulo: "Perguntas fazem parte de muitas histórias de fé",
        texto: "A Bíblia registra pessoas que lamentam, perguntam e pedem ajuda. Ter dúvidas não precisa ser escondido nesta leitura. Você pode observar os textos com calma e decidir o que pensa sobre eles.",
        referencias: [{ rotulo: "Salmo 13", href: "/leitura/19-salmos/13" }, { rotulo: "Marcos 9:14–24", href: "/leitura/41-marcos/9?versiculo=14" }],
      },
      {
        titulo: "Conheça Jesus pelos relatos dos Evangelhos",
        texto: "Se quiser começar pela história de Jesus, leia um dos Evangelhos. O Evangelho de Marcos apresenta suas ações e ensinamentos; o de João explica a intenção de seu relato sobre Jesus.",
        referencias: [{ rotulo: "Marcos 1", href: "/leitura/41-marcos/1" }, { rotulo: "João 20:30–31", href: "/leitura/43-joao/20?versiculo=30" }],
      },
    ],
  },
  {
    slug: "luto-e-perdas",
    rotulo: "Luto e perdas",
    chamada: "Luto e perdas",
    descricao: "Uma leitura sobre a presença de Deus diante da dor, sem pressa para superar o luto.",
    secoes: [
      {
        titulo: "A dor pode ser nomeada",
        texto: "A Bíblia não trata o luto como algo que precisa ser escondido. Nos relatos sobre a morte de Lázaro, Jesus encontra pessoas em pranto e também chora. Não há uma frase que apague uma perda.",
        referencias: [{ rotulo: "Salmo 34:17–18", href: "/leitura/19-salmos/34?versiculo=17" }, { rotulo: "João 11:28–36", href: "/leitura/43-joao/11?versiculo=28" }],
      },
      {
        titulo: "Esperança não exige pressa",
        texto: "A esperança cristã olha para a promessa de que a morte e o sofrimento não terão a palavra final. Isso não determina o ritmo de quem sofre. Conversar com pessoas de confiança e buscar cuidado podem fazer parte do caminho.",
        referencias: [{ rotulo: "Romanos 8:18–25", href: "/leitura/45-romanos/8?versiculo=18" }, { rotulo: "Apocalipse 21:1–5", href: "/leitura/66-apocalipse/21?versiculo=1" }],
      },
    ],
  },
  {
    slug: "medo-panico-e-sofrimento",
    rotulo: "Medo, pânico e sofrimento emocional",
    chamada: "Medo e sofrimento emocional",
    descricao: "Uma leitura que reconhece diferentes experiências de sofrimento e não substitui cuidado profissional.",
    secoes: [
      {
        titulo: "O sofrimento merece ser levado a sério",
        texto: "Medo, pânico e depressão não são a mesma experiência, e esta página não pode avaliar o que você está vivendo. Os Salmos mostram que pessoas de fé também expressaram angústia e buscaram palavras para atravessá-la.",
        referencias: [{ rotulo: "Salmo 42", href: "/leitura/19-salmos/42" }, { rotulo: "Salmo 56:1–4", href: "/leitura/19-salmos/56?versiculo=1" }],
      },
      {
        titulo: "Procure apoio adequado para sua situação",
        texto: "Se o sofrimento está forte, persistente ou colocando você em risco, procure um serviço de saúde ou uma pessoa de confiança. A leitura bíblica pode oferecer reflexão espiritual, mas não substitui atendimento profissional.",
        referencias: [{ rotulo: "2 Coríntios 1:3–4", href: "/leitura/47-2-corintios/1?versiculo=3" }, { rotulo: "Marcos 14:32–36", href: "/leitura/41-marcos/14?versiculo=32" }],
      },
    ],
  },
];

export function encontrarTemaEvangelistico(slug: string | string[] | undefined) {
  const valor = Array.isArray(slug) ? slug[0] : slug;
  return TEMAS_EVANGELISTICOS.find((tema) => tema.slug === valor);
}
