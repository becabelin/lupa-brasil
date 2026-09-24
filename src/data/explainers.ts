/**
 * Páginas editoriais do Lupa.
 *
 * - kind "caso" → /noticias/[slug] (dossiê imersivo)
 * - kind "conceito" | "plano" → /glossario/[slug] (referência)
 *
 * Abrir página quando o tema precisar de contexto (ver NEWS_PAGE_CRITERIA).
 * Casos devem aguentar leitura completa (ver NEWS_PAGE_DEPTH).
 * Conceitos: o bastante para entender o termo sem sair perdido.
 */

export type ExplainerKind = "conceito" | "plano" | "caso";

export type ExplainerSource = {
  label: string;
  url: string;
  outlet?: string;
  publishedAt?: string;
};

export type ExplainerCover = {
  src: string;
  alt: string;
  credit: string;
  creditUrl?: string;
  /** CSS object-position, ex. "left center" ou "20% 30%". */
  objectPosition?: string;
};

export type ExplainerAngle = {
  id: string;
  title: string;
  /**
   * Resumo do ângulo em parágrafos curtos (array) ou um bloco
   * (string; quebras `\n\n` viram parágrafos).
   */
  summary: string | string[];
  /** Tópicos para leitura rápida. */
  bullets?: string[];
};

export type Explainer = {
  slug: string;
  kind: ExplainerKind;
  title: string;
  /** Uma linha curta para listas e cards. */
  teaser: string;
  /** Teaser em leitura simples (opcional). */
  teaserSimple?: string;
  /** Até ~2 linhas no hover (mini card). */
  hoverBlurb: string;
  /** Hover em leitura simples (opcional). */
  hoverBlurbSimple?: string;
  /** Aliases detectados no texto das propostas (case-insensitive). */
  aliases: string[];
  /** Destaque na home / index. */
  featured?: boolean;
  publishedAt: string;
  updatedAt?: string;
  cover?: ExplainerCover;
  /** Números e fatos-chave (barra superior). */
  keyFacts?: { label: string; value: string }[];
  /** Quem aparece no relato (papéis factuais). */
  people?: {
    name: string;
    role: string;
    /** Retrato P&B quando houver fonte licenciável. */
    photo?: {
      src: string;
      alt: string;
      credit?: string;
    };
  }[];
  /** Linha do tempo do caso / tema. */
  timeline?: { when: string; text: string }[];
  /**
   * Frentes do mesmo caso: várias informações sobre o mesmo tema,
   * cada uma com título próprio (contrato, mensagens, respostas etc.).
   */
  angles?: ExplainerAngle[];
  /** Corpo em seções curtas e claras (conceitos/planos ou fechamento do caso). */
  sections: {
    heading: string;
    paragraphs: string[];
    /** Tópicos opcionais sob o texto. */
    bullets?: string[];
  }[];
  /** Outros explainers ligados (slugs). */
  relatedSlugs?: string[];
  sources: ExplainerSource[];
};

export const EXPLAINERS: Explainer[] = [
  {
    slug: "plano-de-transformacao-ecologica",
    kind: "plano",
    title: "Plano de Transformação Ecológica",
    teaser:
      "Estratégia federal para integrar clima, indústria e uso da terra nas políticas públicas.",
    hoverBlurb:
      "Pacote de políticas do governo federal para reduzir emissões, recuperar florestas e alinhar a economia à transição climática.",
    aliases: [
      "Plano de Transformação Ecológica",
      "plano de transformação ecológica",
    ],
    featured: true,
    publishedAt: "2026-09-23",
    cover: {
      src: "/noticias/amazonia-conselho.jpg",
      alt: "Reunião do Conselho Nacional da Amazônia Legal",
      credit:
        "Wikimedia Commons · Conselho Nacional da Amazônia Legal, 30/08/2022 (CC BY 2.0)",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:30_08_2022_9%C2%AA_Reuni%C3%A3o_do_Conselho_Nacional_da_Amaz%C3%B4nia_Legal_(52473652877).jpg",
    },
    keyFacts: [
      { label: "Tipo", value: "Estratégia federal" },
      { label: "Eixos", value: "Clima · Indústria · Terra" },
      { label: "Onde aparece", value: "Planos de governo" },
    ],
    sections: [
      {
        heading: "O que é",
        paragraphs: [
          "O Plano de Transformação Ecológica é uma estratégia do governo federal brasileiro para articular políticas de clima, indústria, agricultura e finanças públicas em torno da redução de emissões e da preservação ambiental.",
          "Na prática, funciona como um guarda-chuva: reúne metas, programas e instrumentos (crédito, regulação, compras públicas) para orientar o Estado e o setor privado na transição ecológica.",
        ],
      },
      {
        heading: "Por que aparece nos planos de governo",
        paragraphs: [
          "Candidaturas e documentos oficiais citam o plano quando falam de Amazônia, desmatamento, transição energética ou integração da sustentabilidade às políticas públicas.",
          "No Lupa, quando o termo aparece no PDF do TSE, ele vira link para esta página, para você entender o conceito sem precisar sair da análise do candidato.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Citar o plano não significa, por si só, detalhar orçamento, prazos ou indicadores. Vale cruzar o trecho do documento oficial com o que está publicado pelo governo e pelas fontes listadas abaixo.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Ministério da Fazenda · Transformação Ecológica (portal oficial)",
        url: "https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/transformacao-ecologica",
        outlet: "gov.br",
      },
    ],
  },
  {
    slug: "maioridade-penal",
    kind: "conceito",
    title: "Maioridade penal",
    teaser:
      "No Brasil, menores de 18 anos são inimputáveis pela Constituição. Reduzir a idade exige emenda e está em debate no Congresso.",
    hoverBlurb:
      "Art. 228 da Constituição: menores de 18 anos respondem pela legislação especial (ECA), não pelo Código Penal. Planos que falam em 16 anos pedem mudança constitucional.",
    aliases: [
      "maioridade penal",
      "Maioridade penal",
      "redução da maioridade penal",
      "reduzir a maioridade penal",
      "Reduzir a maioridade penal",
    ],
    featured: true,
    publishedAt: "2026-09-23",
    cover: {
      src: "/noticias/congresso.jpg",
      alt: "Fachada do Congresso Nacional, em Brasília",
      credit:
        "Wikimedia Commons · Fachada do Congresso Nacional (CC BY 2.0)",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Fachada_do_Congresso_Nacional_(48079560916).jpg",
    },
    keyFacts: [
      { label: "Hoje", value: "18 anos (art. 228)" },
      { label: "Proposta recorrente", value: "16 anos" },
      { label: "Via", value: "PEC no Congresso" },
    ],
    relatedSlugs: ["modelo-el-salvador"],
    sections: [
      {
        heading: "O que é",
        paragraphs: [
          "Maioridade penal é a idade a partir da qual a pessoa pode ser processada e punida pelo Código Penal, como adulto. No Brasil, o art. 228 da Constituição Federal diz que menores de 18 anos são penalmente inimputáveis e ficam sujeitos à legislação especial.",
          "Essa legislação especial é, sobretudo, o Estatuto da Criança e do Adolescente (ECA): adolescentes entre 12 e 18 anos podem cumprir medidas socioeducativas, inclusive privação de liberdade em unidades específicas, com regras e prazos próprios.",
        ],
      },
      {
        heading: "O que significa “reduzir para 16”",
        paragraphs: [
          "Quando um plano de governo propõe reduzir a maioridade penal de 18 para 16 anos, está pedindo mudança na Constituição. Sem emenda aprovada, a regra dos 18 anos permanece.",
          "No Congresso, a discussão costuma andar por Propostas de Emenda à Constituição (PEC). Em 2026, a PEC 32/2015 e apensadas seguem o rito na Câmara: a CCJ aprovou a admissibilidade; uma comissão especial analisa o mérito. Para virar emenda, a matéria precisa de quórum qualificado em dois turnos na Câmara e no Senado.",
        ],
      },
      {
        heading: "Por que aparece nos planos de governo",
        paragraphs: [
          "Mais de uma chapa deferida no TSE cita a redução da maioridade penal na área de segurança pública. O Lupa liga o termo quando ele aparece no extrato do PDF oficial, para você ver o que a Constituição diz hoje e o que o Congresso está tramitando.",
          "Citar a redução no plano não aprova a PEC nem altera a lei. É uma proposta política que depende do Legislativo e, se aprovada, de regulamentação posterior.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Há argumentos favoráveis e contrários em circulação (efeito dissuasório, direitos de adolescentes, capacidade do sistema prisional, evidência sobre reincidência). O Lupa não escolhe lado: mostra o que está no texto constitucional, o que tramita e o que cada plano escreveu.",
          "Vale distinguir maioridade penal (imputabilidade no crime) de maioridade civil e de direito de voto. São regras diferentes, ainda que algumas PECs tratem de mais de um tema.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Constituição Federal · art. 228 (texto oficial no Planalto)",
        url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        outlet: "Planalto",
      },
      {
        label: "PEC 32/2015 · ficha de tramitação (Câmara dos Deputados)",
        url: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=1228863",
        outlet: "Câmara dos Deputados",
      },
      {
        label:
          "Redução da maioridade penal: os prós e contras da PEC 32/2015 (g1, 10/06/2026)",
        url: "https://g1.globo.com/politica/noticia/2026/06/10/argumentos-contrarios-e-favoraveis-reducao-da-maioridade-penal.ghtml",
        outlet: "g1",
        publishedAt: "2026-06-10",
      },
    ],
  },
  {
    slug: "modelo-el-salvador",
    kind: "conceito",
    title: "Modelo El Salvador",
    teaser:
      "Referência a prisões de segurança máxima e ao endurecimento das regras em El Salvador, citada em planos brasileiros de segurança.",
    hoverBlurb:
      "Desde 2022, El Salvador combina estado de exceção, prisões em massa e o megapresídio CECOT. Planos no Brasil citam o “modelo” como referência de rigor prisional.",
    aliases: [
      "El Salvador",
      "modelo adotado por El Salvador",
      "modelo de El Salvador",
      "modelo El Salvador",
      "CECOT",
      "Bukele",
    ],
    featured: true,
    publishedAt: "2026-09-23",
    cover: {
      src: "/noticias/el-salvador-cecot.jpg",
      alt: "Vista aérea do Centro de Confinamento do Terrorismo (CECOT), em Tecoluca, El Salvador",
      credit:
        "Wikimedia Commons · Casa Presidencial de El Salvador (CC0) · convertida para P&B no Lupa",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Aerial_view_of_CECOT_(2).jpg",
    },
    keyFacts: [
      { label: "Marco", value: "Estado de exceção (desde 2022)" },
      { label: "Símbolo", value: "CECOT (2023)" },
      { label: "No Brasil", value: "Citado em planos TSE" },
    ],
    relatedSlugs: ["maioridade-penal"],
    sections: [
      {
        heading: "O que as pessoas chamam de “modelo El Salvador”",
        paragraphs: [
          "Na política brasileira, “modelo El Salvador” costuma apontar para a política de segurança do governo de Nayib Bukele: endurecimento das regras, prisões em larga escala de suspeitos de ligação com gangues e o megapresídio de segurança máxima conhecido como CECOT (Centro de Confinamento do Terrorismo), inaugurado em 2023 em Tecoluca.",
          "Não é um manual único exportado por tratado. É um rótulo de campanha e de imprensa para um conjunto de medidas tomadas sob estado de exceção renovado desde março de 2022.",
        ],
      },
      {
        heading: "O que aconteceu em El Salvador (fatos públicos)",
        paragraphs: [
          "O Congresso salvadorenho aprovou um estado de exceção que suspende ou flexibiliza garantias como certas regras de processo e de associação. Forças de segurança passaram a prender dezenas de milhares de pessoas sob suspeita de vínculo com gangues. O governo aponta queda forte nos homicídios; organizações de direitos humanos e reportagens documentam detenções arbitrárias, restrições a visitas e mortes sob custódia.",
          "O CECOT é o prédio mais fotografado dessa política: capacidade anunciada na casa das dezenas de milhares, celas coletivas e rotina descrita por veículos que tiveram acesso guiado como extremamente restritiva. Parte dos detidos no país está em outras unidades, não só no CECOT.",
        ],
      },
      {
        heading: "Por que aparece nos planos de governo",
        paragraphs: [
          "Em planos registrados no TSE, a menção costuma ser direta: criar presídios de segurança máxima “no modelo adotado por El Salvador”. O texto do candidato, em geral, não detalha estado de exceção, números de prisões nem o desenho constitucional brasileiro.",
          "No Lupa, o link existe para você ler o que está sendo invocado além do nome do país: um pacote de prisão dura associado a resultados de criminalidade e a controvérsias de direitos humanos.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Copiar o nome do modelo não define orçamento, localização, capacidade, critérios de prisão preventiva nem mudanças na Constituição ou no Código de Processo Penal brasileiros. Vale perguntar o que, exatamente, o plano propõe no papel.",
          "O Lupa não diz se o modelo “funcionaria” no Brasil. Apresenta o que a referência pública descreve e deixa a comparação com o trecho do PDF e com as fontes abaixo.",
        ],
      },
    ],
    sources: [
      {
        label:
          "CRS · El Salvador: State of Exception and Security Policy (Congresso dos EUA)",
        url: "https://www.congress.gov/crs_external_products/IN/HTML/IN12510.web.html",
        outlet: "Congressional Research Service",
      },
      {
        label:
          "Inside El Salvador’s notorious CECOT mega-prison (CBS News)",
        url: "https://www.cbsnews.com/news/inside-el-salvador-notorious-cecot-prison/",
        outlet: "CBS News",
      },
      {
        label:
          "Human Rights Watch · declaração sobre condições prisionais em El Salvador (20/03/2025)",
        url: "https://www.hrw.org/news/2025/03/20/human-rights-watch-declaration-prison-conditions-el-salvador-jgg-v-trump-case",
        outlet: "Human Rights Watch",
        publishedAt: "2025-03-20",
      },
      {
        label:
          "Wikimedia Commons · Aerial view of CECOT (2).jpg (Casa Presidencial SV, CC0)",
        url: "https://commons.wikimedia.org/wiki/File:Aerial_view_of_CECOT_(2).jpg",
        outlet: "Wikimedia Commons",
      },
    ],
  },
  {
    slug: "precatorios",
    kind: "conceito",
    title: "Precatórios",
    teaser:
      "Dívidas do poder público reconhecidas pela Justiça e negociadas no mercado financeiro.",
    teaserSimple:
      "Quando o governo perde na Justiça e tem que pagar. Esse papel pode ser vendido com desconto.",
    hoverBlurb:
      "São dívidas da União, estados ou municípios após decisão judicial definitiva. Podem ser compradas com desconto por bancos e fundos.",
    hoverBlurbSimple:
      "É uma dívida do governo depois de perder um processo. Bancos às vezes compram com desconto e tentam receber o valor cheio depois.",
    aliases: ["precatórios", "Precatórios", "precatorio", "precatório"],
    publishedAt: "2026-09-23",
    cover: {
      src: "/noticias/congresso.jpg",
      alt: "Fachada do Congresso Nacional, em Brasília",
      credit:
        "Wikimedia Commons · Fachada do Congresso Nacional (CC BY 2.0)",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Fachada_do_Congresso_Nacional_(48079560916).jpg",
    },
    keyFacts: [
      { label: "O quê", value: "Dívida judicial" },
      { label: "Quem paga", value: "União · Estados · Municípios" },
      { label: "Mercado", value: "Compra com desconto" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "Precatório é a ordem de pagamento de uma dívida que a União, um estado ou um município tem de quitar depois de perder uma ação judicial de forma definitiva (quando não cabe mais recurso).",
        ],
      },
      {
        heading: "Por que demora e por que virou mercado",
        paragraphs: [
          "O pagamento segue ordem cronológica e depende de inclusão no Orçamento. Isso pode levar anos. Por isso, credores às vezes vendem o direito de receber o precatório com desconto a bancos e fundos, que apostam em lucrar quando o poder público pagar o valor integral.",
        ],
      },
      {
        heading: "Por que isso importa",
        paragraphs: [
          "Precatórios envolvem valores altos, regras orçamentárias e, em alguns casos, disputas sobre se o título foi emitido no momento certo. Reportagens e investigações sobre o tema costumam cruzar Judiciário, mercado financeiro e poder público.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Explicação de precatórios no contexto Master/Vorcaro (g1, 22/09/2026)",
        url: "https://g1.globo.com/politica/noticia/2026/09/22/contrato-de-vorcaro-previa-ate-r-427-milhoes-a-escritorio-de-esposa-de-desembargador-indentificado-como-da-turma-de-nunes-marques.ghtml",
        outlet: "g1",
        publishedAt: "2026-09-22",
      },
    ],
  },
  {
    slug: "caso-vorcaro-master-turma-kn",
    kind: "caso",
    title: "Caso Vorcaro: Master, Judiciário, Lagoinha e a rede em torno do banco",
    teaser:
      "Contrato de honorários, precatórios, “turma do KN”, Alcídia, Consult/Coaf, fundo Arleen, Lagoinha/Zettel, repasses a Dark Horse e o dinheiro de fundos públicos no Master.",
    teaserSimple:
      "O Banco Master, o banqueiro Daniel Vorcaro e tudo que a imprensa e o Coaf ligaram a ele: Judiciário, igreja, política e dinheiro público.",
    hoverBlurb:
      "Dossiê amplo do caso Master/Vorcaro: contrato, precatórios, mensagens, STF, Lagoinha, Flávio Bolsonaro e fundos de previdência.",
    hoverBlurbSimple:
      "Tudo que a imprensa e documentos públicos ligam ao Master e a Vorcaro. Várias frentes. Sem veredicto.",
    aliases: [
      "Daniel Vorcaro",
      "Banco Master",
      "Caso Master",
      "caso Vorcaro",
      "Queiroga Vieira Queiroz",
      "Fabiano Zettel",
      "Fabiano Zetel",
      "A Turma",
    ],
    featured: true,
    publishedAt: "2026-09-23",
    updatedAt: "2026-09-23",
    cover: {
      src: "/noticias/congresso-senado.jpg",
      alt: "Congresso Nacional visto da Esplanada, em Brasília",
      credit:
        "Pillar Pedreira / Agência Senado · Wikimedia Commons (CC BY 2.0) · P&B no Lupa",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Fotos_produzidas_pelo_Senado_(30554309793).jpg",
      objectPosition: "center 45%",
    },
    keyFacts: [
      { label: "Honorários previstos", value: "Até R$ 427 mi" },
      { label: "Ações no contrato", value: "R$ 8,5 bi · 12 processos" },
      { label: "Precatórios no Master", value: "Até R$ 16 bi (Estadão)" },
      { label: "Master → Consult (Coaf)", value: "R$ 6,6 mi" },
      { label: "Lagoinha Belvedere (Coaf)", value: "~R$ 57 mi movimentados" },
      { label: "Zettel → Lagoinha (Coaf)", value: "R$ 19,2 mi" },
      { label: "Dark Horse (Coaf/PGR)", value: "US$ 12,3 mi rastreados" },
      { label: "Acordo citado Dark Horse", value: "Até US$ 24 mi" },
    ],
    people: [
      {
        name: "Daniel Vorcaro",
        role: "Ex-banqueiro do Master; celular apreendido pela PF (nov/2025) concentrou minuta, mensagens e pedidos relatados",
        photo: {
          src: "/noticias/pessoas/daniel-vorcaro.jpg",
          alt: "Retrato de Daniel Vorcaro",
          credit:
            "Retrato em circulação pública (Commons CC0 contestado; veículos citam divulgação) · P&B no Lupa",
        },
      },
      {
        name: "Banco Master",
        role: "Instituição citada no contrato, na carteira de precatórios, nas transferências à Consult e na venda ao BRB",
      },
      {
        name: "Camilla Ramos",
        role: "Advogada; sócia do escritório Queiroga, Vieira, Queiroz & Ramos; esposa de Newton Ramos",
      },
      {
        name: "Newton Ramos",
        role: "Desembargador do TRF-1; aparece nas mensagens da “turma do KN/Newton”; emitiu nota",
        photo: {
          src: "/noticias/pessoas/newton-ramos.jpg",
          alt: "Retrato oficial de Newton Ramos, desembargador do TRF-1",
          credit: "TRF-1 · galeria institucional · P&B no Lupa",
        },
      },
      {
        name: "Gabriel Ramos",
        role: "Advogado; filho de Newton; contratado com Camilla, segundo o Estadão",
      },
      {
        name: "Kassio Nunes Marques",
        role: "Ministro do STF; iniciais “KN” nas mensagens, segundo a PF; emitiu notas e se declarou impedido no julgamento de Moraes",
        photo: {
          src: "/noticias/pessoas/kassio-nunes-marques.jpg",
          alt: "Retrato de Kassio Nunes Marques, ministro do STF",
          credit: "Marcos Corrêa / PR · Wikimedia Commons (CC BY 2.0) · P&B no Lupa",
        },
      },
      {
        name: "Kevin Marques",
        role: "Filho do ministro; citado em diálogos sobre “500 mil mês”; recebeu valores da Consult, segundo o Coaf; nega dinheiro do Master",
      },
      {
        name: "Luiz Rennó",
        role: "Ex-diretor jurídico do Master; mensagens sobre Alcídia, Kevin e a “Consult”",
      },
      {
        name: "André Kruschewsky",
        role: "Ex-diretor jurídico do Master; mensagens sobre Alcídia como “paradigma” e sobre “tirar de pauta”",
      },
      {
        name: "Dias Toffoli",
        role: "Ministro do STF; citado em relatório da PF sobre Alcídia e fundo Arleen; gabinete nega amizade, recursos no exterior e mudança de voto",
      },
      {
        name: "André Mendonça",
        role: "Ministro do STF; relator do Caso Master; recebeu HD da PF; confirmou encontro com Vorcaro sobre STP 976 (Tabu)",
      },
      {
        name: "Edson Fachin",
        role: "Ministro do STF; relator citado no placar Alcídia (3x2) favorável à usina",
      },
      {
        name: "Rodrigo Fux",
        role: "Advogado; filho do ministro Luiz Fux; Vorcaro enviou minuta “SLAT TABU”; escritório diz que não fechou contrato",
      },
      {
        name: "Fábio Faria",
        role: "Ex-ministro das Comunicações; aparece em mensagens como interlocutor de Vorcaro junto a Toffoli e à Prime You",
      },
      {
        name: "Leo Serrano Giunchetti",
        role: "Agente de viagens; intermediava pedidos de Fasano, camarote e roteiros atribuídos a “KN” / Newton",
      },
      {
        name: "Francisco Craveiro",
        role: "Contador; dono da Consult Inteligência Tributária; amigo de longa data de Nunes Marques, segundo a piauí",
      },
      {
        name: "Roberta Rangel",
        role: "Advogada; então esposa de Toffoli; PF e piauí relatam atuação para Vorcaro; Vorcaro a chamou de “minha advogada” em mensagem",
      },
      {
        name: "Cezinha de Madureira",
        role: "Deputado citado como intermediário do encontro Vorcaro–Mendonça sobre o caso Tabu",
      },
      {
        name: "Fabiano Campos Zettel",
        role: "Pastor e empresário; cunhado de Vorcaro (casado com Natália); citado pelo Coaf em repasses à Lagoinha Belvedere; preso no caso Master",
      },
      {
        name: "André Valadão",
        role: "Pastor da Lagoinha Global; celebrou o casamento Vorcaro–Zettel; cartão “Fé” (2019) e Clava Forte (2024); diz autonomia das unidades e afastamento do Belvedere",
      },
      {
        name: "Flávio Bolsonaro",
        role: "Senador e candidato a presidente (PL); investigado no STF sobre repasses Vorcaro → fundo do filme Dark Horse",
      },
      {
        name: "Nicolas Ferreira",
        role: "Deputado; citado em campanha 2022 com voos ligados ao Master e áudio a Vorcaro sobre ativo minerário; nega proximidade",
      },
    ],
    timeline: [
      {
        when: "Anos 90 · BH",
        text: "Família Vorcaro se aproxima da Lagoinha (Márcio Valadão). Imprensa e o episódio Revelando registram doações e apoio à Rede Super; Daniel Vorcaro chega a apresentar no canal ligado à igreja.",
      },
      {
        when: "2018",
        text: "André Valadão celebra o casamento de Natália Vorcaro com Fabiano Zettel. O Revelando trata a festa como marco da aliança Master–Lagoinha.",
      },
      {
        when: "Fev/2019",
        text: "No culto, Valadão apresenta o cartão consignado “Fé” (marca própria; Lagoinha publica nota se dissociando do produto).",
      },
      {
        when: "Out/2022",
        text: "2º turno: voos de campanha de Nicolas Ferreira em aeronave ligada ao Master (imprensa/mensagens). Nicolas nega proximidade. Zettel citado como grande doador PF de campanhas Bolsonaro e Tarcísio (Revelando / imprensa).",
      },
      {
        when: "2023",
        text: "Master adquire fatias de precatórios via fundos; g1 liga a cadeia à Operação Compliance Zero (Reag / Master).",
      },
      {
        when: "Fev–Mar/2024",
        text: "Sessão virtual da Alcídia: Nunes Marques consta como impedido. Em março, afasta o impedimento (“equívoco da assessoria”) e se declara apto a votar (piauí).",
      },
      {
        when: "Mar/2024",
        text: "Minuta Master × escritório de Camilla Ramos: 5% líquidos; até R$ 427 mi se houver êxito nas 12 ações de R$ 8,5 bi (IAA). No mesmo período, Valadão e Cassiane lançam a fintech Clava Forte Bank.",
      },
      {
        when: "Abr/2024",
        text: "Nicolas critica evento do Master em Londres; Vorcaro pede intermediação a Valadão; áudios e mensagens (ICL / imprensa).",
      },
      {
        when: "Jun/2024",
        text: "InfoMoney: votos de Newton Ramos na Usina Cansanção de Sinimbu; procurações de Camilla e Gabriel vêm em dez/2024. Ele diz que o julgamento foi em bloco e que o Master só ingressou depois.",
      },
      {
        when: "Ago/2024–Jul/2025",
        text: "Coaf: Master faz 14 transferências à Consult (R$ 6,632 mi). No mesmo período, Consult repassa R$ 282 mil a Kevin Marques (piauí / Estadão).",
      },
      {
        when: "Set/2024",
        text: "Nunes Marques pede vista na Alcídia após episódio em que o Master monitorava voto de Toffoli em caso semelhante (Raízen), segundo a PF/piauí.",
      },
      {
        when: "1º/Out/2024",
        text: "Alcídia: placar 3x2 (Fachin, Toffoli, Nunes Marques × Gilmar e Mendonça). Rennó: “Ganhamos alcidia” e, com o contato de Kevin, “Dominado aqui”.",
      },
      {
        when: "6/Nov/2024",
        text: "Vorcaro envia a Rodrigo Fux o arquivo “SLAT TABU”, dois dias antes do início do julgamento, segundo o Estadão.",
      },
      {
        when: "Dez/2024",
        text: "Estadão: Master contrata Camilla e Gabriel Ramos em meio a cerca de R$ 1,6 bi em precatórios da União travados no TRF-1. Mensagem atribuída a Nunes Marques pede cotação de viagem de 10 dias (ele diz que só cotou preços e não usou o serviço).",
      },
      {
        when: "Fev/2025",
        text: "Carnaval: seis nomes da “turma do KN/Newton” no camarote; estadias Fasano, Ilha e mansão no Joá (aluguel citado em R$ 1,45 mi/semana pelo Metrópoles).",
      },
      {
        when: "Mai/2025",
        text: "Pedido de tarifa promocional no Fasano para o ministro, via Newton; Vorcaro autoriza colocar na conta. Cade aprova venda do Master ao BRB (g1).",
      },
      {
        when: "Jun/2025",
        text: "Camilla celebra no chat placar 3x2 e voto de Nunes Marques (Tema 826). STF mantém por unanimidade suspensão do precatório Tabu (STP 976, mais de R$ 5 bi). Mendonça confirma ter recebido Vorcaro.",
      },
      {
        when: "4/Jul/2025",
        text: "Rennó, com o contato de Kevin: “Esse aqui – 500 mil mês – mantém?”. Vorcaro responde “Kkkk”.",
      },
      {
        when: "8/Ago/2025",
        text: "Rennó: “Dos pagamentos essenciais está faltando a consult”; marca o contato de Kevin (“Único ‘meu’ que faltou”); depois: “Foi pago”.",
      },
      {
        when: "14/Nov/2025",
        text: "Estadão/piauí: Nunes Marques e esposa voam em Legacy operado pela Prime Aviation para aniversário de Camilla em Maceió; gabinete diz que Camilla cuidou do voo.",
      },
      {
        when: "18/Nov/2025",
        text: "Primeira prisão de Vorcaro; PF apreende o celular. Zettel afastado na Lagoinha. Site/app da Clava Forte saem do ar na mesma semana (Agência Pública).",
      },
      {
        when: "2025",
        text: "Coaf: Lagoinha Belvedere (sob gestão de Zettel) movimenta cerca de R$ 57 mi; Zettel injeta R$ 19,2 mi; familiares de Vorcaro cerca de R$ 2 mi. Igreja alega recursos para obras; Lagoinha Global diz desconhecer a dimensão.",
      },
      {
        when: "2025",
        text: "Repasses ligados a Vorcaro para o fundo Havengate (filme Dark Horse). Coaf/PGR citam US$ 12,3 mi; acordo falado de até US$ 24 mi. Flávio Bolsonaro cobra parcelas em mensagens; depois diz que pagamentos teriam cessado em mai/2025. Coaf registra envio em set/2025.",
      },
      {
        when: "Mar/2026",
        text: "Unidade Lagoinha Belvedere encerra atividades após a prisão de Zettel (imprensa).",
      },
      {
        when: "15–23/Set/2026",
        text: "piauí, Metrópoles, g1, JN, Folha, Estadão e O Globo ampliam o enredo (contrato, Lagoinha, Dark Horse). STF autoriza inquérito sobre Flávio, Eduardo Bolsonaro e Mario Frias no fio do filme (relator Mendonça).",
      },
    ],
    angles: [
      {
        id: "antes-escandalo",
        title: "Antes do escândalo: a rede",
        summary: [
          "Antes da prisão de Vorcaro e Zettel (nov/2025), já existia uma rede de família, igreja, crédito e política. O episódio Revelando (Calma Urgente / Porchat) reconstrói esse fio a partir do casamento de 2018 e cruza com documentos e mensagens depois publicados pela imprensa.",
          "Anos 90, em Belo Horizonte: a família Vorcaro se aproxima da Lagoinha (então sob Márcio Valadão). Reportagens registram doações e apoio à Rede Super; Daniel Vorcaro chegou a apresentar no canal ligado à igreja.",
          "Em 2018, André Valadão celebra o casamento de Natália Vorcaro com Fabiano Zettel. O episódio trata a cerimônia como marco da aliança Master–Lagoinha que depois aparece nas mensagens e no Coaf.",
          "No culto, Valadão também apresentou produtos de crédito: em fev/2019 o cartão consignado “Fé” (marca própria; a Lagoinha dissociou-se); em 2024, com Cassiane Valadão, a fintech Clava Forte Bank (saiu do ar na semana da prisão de Vorcaro).",
        ],
        bullets: [
          "Cultos e séries tipo “Cria Riqueza” / área VIP: o episódio usa como contexto de teologia da prosperidade, não como prova do Master.",
          "2022: Zettel citado como grande doador PF das campanhas Bolsonaro e Tarcísio; Vorcaro ligado a voos de Nicolas Ferreira no 2º turno (Nicolas nega proximidade).",
          "Abr/2024: Nicolas critica evento do Master em Londres; Vorcaro pede intermediação a Valadão; áudios/mensagens (ICL / imprensa).",
          "Essa rede pessoal (pastor, cunhado, deputado, filme, crédito) é o mapa para ler as frentes posteriores: Belvedere/Coaf, Dark Horse, “A Turma”.",
        ],
      },
      {
        id: "contrato",
        title: "O contrato de até R$ 427 milhões",
        summary: [
          "A PF encontrou no celular de Vorcaro uma minuta (março/2024) entre o Banco Master e o escritório Queiroga, Vieira, Queiroz & Ramos, de Camilla Ramos.",
          "O alvo: 12 processos de precatórios da indústria sucroalcooleira, indenizações ligadas ao antigo Instituto do Açúcar e do Álcool (IAA). Honorários de 5% líquidos.",
          "Se todas as ações (R$ 8,5 bilhões) tivessem êxito, o teto chegaria a R$ 427 milhões. O Metrópoles publicou o documento; g1 e JN confirmaram.",
          "O contrato autorizava o escritório a receber honorários diretamente da União e a inscrever precatórios em nome próprio.",
          "Escritório e reportagens afirmam que nenhum pagamento de pró-labore ou êxito foi feito até a divulgação.",
        ],
        bullets: [
          "HD foi enviado pela PF ao gabinete de André Mendonça (jul/2026); Zanin, Dino e Gilmar pediram a íntegra (Metrópoles).",
          "Escritório: nenhum dos casos do Master em que atua tramita no STF; sem vínculo com ministros; objeto lícito e honorário de êxito.",
          "Camilla (Estadão): relação profissional formal com o Master; sem relação com Nunes Marques.",
          "Alguns meses após a minuta, Vorcaro lembra Newton de “julgamento dia 4”; resposta: “lembrei” / “tudo certo” (g1).",
        ],
      },
      {
        id: "engenharia-precatorios",
        title: "A engenharia dos precatórios (até R$ 16 bi)",
        summary: [
          "Segundo o Estadão, o Master tinha pelo menos R$ 16 bilhões em precatórios e pré-precatórios (balanço oficial + valores em fundos).",
          "Desses, cerca de R$ 10 bilhões eram do setor sucroalcooleiro, comprados com deságio citado entre 10% e 20% do valor de face.",
          "A manobra descrita: contabilizar pelo valor nominal, inflar patrimônio e captar no mercado enquanto se esperava decisões judiciais favoráveis.",
          "A compra em 2023 passou por fundos ligados, segundo o g1, à Operação Compliance Zero (Reag / Master).",
        ],
        bullets: [
          "Estadão: Master tentava liberar cerca de R$ 1,6 bilhão em precatórios da União travados no TRF-1.",
          "PF, conforme Estadão: aproximação a magistrados e escritórios; benefícios relatados (viagens, camarotes, jatos).",
          "Para o instrumento em si, veja a página Precatórios no Lupa.",
        ],
      },
      {
        id: "turma-kn",
        title: "O que é a “turma do KN”",
        summary: [
          "Nas mensagens, operadores e o círculo de Vorcaro usam “turma do KN” / “turma do KN/Newton” para o grupo ligado a Camilla e Newton Ramos.",
          "A PF e o Jornal Nacional tratam “KN” como referência a Kassio Nunes Marques.",
          "Ele nega ter autorizado alguém a falar em seu nome e nega pedidos a Vorcaro.",
          "O Metrópoles descreve pedidos de Fasano, Rosewood, Fórmula 1, camarote na Sapucaí, mansão no Joá no Carnaval (aluguel citado em R$ 1,45 milhão/semana) e jato para o aniversário de Camilla em Maceió.",
        ],
        bullets: [
          "20/fev/2025: “A turma do KN, Newton, me mandou seis nomes para colocar na lista do camarote” (JN / Metrópoles).",
          "Leo Serrano: “Fasano Itaim… para KN”; depois, mensagem atribuída a Newton: “Ministro Kassio me pediu… tarifa promocional”; Vorcaro: “Pode botar na minha conta”.",
          "Newton (nota): relação pessoal prévia; imóveis/transportes via Prime You seriam situação privada; nunca julgou causa em que o Master fosse parte formal.",
          "Dez/2024: mensagem em nome de “Ministro Kassio” pede cotação de viagem de 10 dias; Nunes Marques diz que só cotou preços e não usou o serviço; agente de viagens diz que a viagem não se concretizou (piauí).",
        ],
      },
      {
        id: "stf-alcidia",
        title: "STF, usinas e o caso Alcídia",
        summary: [
          "O julgamento da Destilaria Alcídia (grupo Atvos) na 2ª Turma do STF é o nó citado nas mensagens: indenização por prejuízos da política de preços do IAA nos anos 1980. Placar final 3x2 a favor da usina (Fachin, Toffoli, Nunes Marques × Gilmar Mendes e André Mendonça).",
          "A PF e a piauí ligam o resultado à carteira sucroalcooleira do Master (mais de R$ 10 bi).",
          "Em junho/2025, Camilla também celebra no chat um placar 3x2 e o voto de Nunes Marques sobre o Tema 826. A União estimava impacto potencial alto em teses semelhantes (PGU citada pelo Estadão em até R$ 145 bi no conjunto).",
        ],
        bullets: [
          "Fev/2024: Nunes Marques consta impedido (havia julgado o caso no TRF-1). Mar/2024: afasta o impedimento (“equívoco”) e se declara apto (piauí).",
          "Mensagens pré-julgamento (Kruschewsky / Vorcaro / Fábio Faria): “Serve de paradigma”; “Toffoli virou o voto”; “Tô tratando aqui”; oferta de “tirar de pauta”. Nunes Marques pediu vista; caso voltou em 1º/out/2024.",
          "1º/out/2024: Rennó lista o placar e envia o contato de Kevin (“Dominado aqui”).",
          "Nunes Marques: tese ampla, não era ação do Master; votou no mesmo sentido que no TRF-1; relacionar ao Master seria “ilação maldosa”.",
          "Gabinete de Toffoli: nega “alteração de voto”; diz que manteve coerência no caso Raízen. A PF pede aprofundamento e não conclui.",
        ],
      },
      {
        id: "outras-frentes-stf",
        title: "Outras frentes no STF: Tabu, Fux e Mendonça",
        summary: [
          "Além de Alcídia, o Estadão descreve outras aproximações.",
          "Na STP 976 (Agro Industrial Tabu, mais de R$ 5 bi), o plenário manteve por unanimidade a suspensão do precatório (jun/2025).",
          "André Mendonça confirmou ter recebido Vorcaro sobre o tema, encontro intermediado pelo deputado Cezinha de Madureira.",
          "Em nov/2024, Vorcaro enviou a Rodrigo Fux o arquivo “SLAT TABU”; escritório e ministro Luiz Fux dizem que não houve contrato e que o ministro votou contra os interesses do Master.",
        ],
        bullets: [
          "Cezinha de Madureira: intermediário citado; alvo da Operação Transparência, segundo o Estadão.",
          "Defesa de Rodrigo Fux e nota de Luiz Fux: aproximação existiu, sem contrato fechado.",
        ],
      },
      {
        id: "kevin-consult",
        title: "Kevin Marques, a Consult e o Coaf",
        summary: [
          "Relatório do Coaf (piauí / Estadão): entre ago/2024 e jul/2025, o Master fez 14 transferências à Consult Inteligência Tributária, somando R$ 6,632 milhões.",
          "No mesmo período, a Consult transferiu R$ 282 mil a Kevin Marques (onze operações).",
          "A piauí liga a empresa a Francisco Craveiro, amigo de Nunes Marques.",
          "Mensagens de Luiz Rennó associam o contato de Kevin ao “500 mil mês” (4/jul/2025) e à cobrança da “consult” (8/ago/2025: “Único ‘meu’ que faltou” / “Foi pago”).",
          "A média das parcelas Master→Consult (~R$ 474 mil) é próxima dos “500 mil” citados; a piauí alerta que não há prova de identidade entre os dois valores.",
        ],
        bullets: [
          "Kevin (nota): recebeu da Consult por “serviços jurídicos… tributária administrativa”; não prestou serviço ao Master nem recebeu dinheiro de Vorcaro; atuação sem relação com o STF.",
          "Nunes Marques: filho recebeu cerca de 10 parcelas de ~R$ 28 mil; serviço efetivo e declarado; “filho nunca recebeu dinheiro de Daniel Vorcaro”.",
          "Após o voto na Alcídia, Consult muda sede para Alphaville; no mesmo endereço surgem o IPGT (Kevin 70% / Gabriel Campelo 30%), segundo a piauí.",
          "g1 também cita lista em que Vorcaro prioriza “Consult? Guido e Lewandowski”.",
        ],
      },
      {
        id: "toffoli-arleen",
        title: "Toffoli, fundo Arleen e o Tayayá",
        summary: [
          "A piauí publicou (set/2026) trechos de relatório da PF sob a relatoria de André Mendonça: a corporação suspeita que Toffoli possa ser “beneficiário final” ou “proprietário de fato” do FIP Arleen, fundo que recebeu ao menos R$ 35 milhões de Vorcaro e era sócio do resort Tayayá (família Toffoli, Ribeirão Claro/PR).",
          "Em 2025, o fundo teria passado a Alberto Leite e, via holding Egide I, ativos teriam ido às Ilhas Virgens Britânicas. A PF pede aprofundamento e não fecha conclusão.",
          "O gabinete de Toffoli nega recursos no exterior, nega amizade íntima com Vorcaro e diz que relatório/arguição de suspeição foram tratados pelo STF sem suspeição.",
        ],
        bullets: [
          "Mensagens de ago/2024: Vorcaro cobra aporte “Tayayá” / “fundo dono do Tayayá” e escreve a Toffoli pedindo encontro no mesmo dia (piauí).",
          "PF: ao menos 12 registros de encontros/agendamentos; chamadas de voz no WhatsApp; helicóptero da Prime You para a “fazenda do Toffoli”.",
          "Roberta Rangel (então esposa): Vorcaro a chama de “minha advogada”; PF aponta vínculos profissionais até fev/2025; precatório de empresa em que ela atuou aparece na carteira do Master (piauí).",
          "Alberto Leite: diz à Folha que a compra do Arleen foi operação imobiliária regular; nega vínculo societário com Toffoli.",
        ],
      },
      {
        id: "trf1-newton",
        title: "TRF-1 e os votos de Newton Ramos",
        summary: [
          "O InfoMoney publicou que Newton Ramos proferiu ao menos dois votos favoráveis a interesses ligados ao Master no processo da Usina Cansanção de Sinimbu (Alagoas), cerca de seis meses antes das procurações de Camilla e Gabriel (dez/2024).",
          "O desembargador respondeu que o agravo foi julgado em bloco (centenas de processos), que à época não havia indicação de interesse do Master nos autos, e que o banco só ingressou depois, com impedimento anotado desde então.",
        ],
        bullets: [
          "Estadão: Newton se declara impedido nos processos dos familiares advogados.",
          "Presidência do TRF-1 rejeitou pedido para rever suspensão de pagamentos e seguir cálculos de liquidação, segundo o Estadão.",
          "Metrópoles: Newton usaria mensagem de visualização única ao tratar de precatórios com Vorcaro; favores ficavam em mensagens permanentes.",
        ],
      },
      {
        id: "lagoinha-zettel",
        title: "Lagoinha, Zettel e o Coaf",
        summary: [
          "A frente “Antes do escândalo” conta como a família Vorcaro e a Lagoinha se cruzam há décadas. Aqui entra o que o Coaf e a imprensa registram depois da prisão.",
          "Fabiano Campos Zettel, pastor e empresário casado com Natália Vorcaro, aparece como cunhado e operador citado em mensagens e no Coaf; passou a atuar na unidade Belvedere (BH).",
          "Relatório do Coaf: conta do Belvedere movimenta cerca de R$ 57 milhões em cerca de um ano; Zettel teria injetado R$ 19,2 milhões; familiares de Vorcaro cerca de R$ 2 milhões.",
          "O Globo descreve cobranças de Zettel a Vorcaro para obra do templo (“obra vai parar”). Lagoinha Global (Valadão): autonomia das unidades; dimensão só clara com as investigações.",
          "Zettel foi afastado das funções pastorais; o Belvedere encerrou atividades em março/2026.",
        ],
        bullets: [
          "Casamento 2018 (Valadão celebra): marco da aliança citada no Revelando e na imprensa.",
          "PF cita o grupo “A Turma” (distinto da “turma do KN”) para monitorar e pressionar adversários; Zettel aparece na coordenação (imprensa).",
          "Clava Forte Bank (Valadão/Cassiane, 2024): site/app saem do ar na semana da 1ª prisão de Vorcaro; CNPJ suspenso; empresa fala em reavaliação e cybersegurança (Agência Pública).",
          "Lagoinha: recursos do Belvedere apresentados como obras/reformas, não como dízimo da rede global.",
        ],
      },
      {
        id: "dark-horse-flavio",
        title: "Dark Horse e Flávio Bolsonaro",
        summary: [
          "Mensagens e o Coaf ligam Vorcaro a repasses para financiar a cinebiografia Dark Horse (Jair Bolsonaro). O acordo citado na imprensa fala em até US$ 24 milhões.",
          "A PGR, no parecer ao STF, aponta cerca de US$ 12,3 milhões da órbita de Vorcaro para o fundo Havengate.",
          "Flávio Bolsonaro aparece cobrando parcelas; depois afirmou que os pagamentos teriam cessado em maio/2025. O Coaf registra envio adicional em setembro/2025. Em set/2026, o ministro André Mendonça autoriza inquérito da PF sobre Flávio, Eduardo Bolsonaro e Mario Frias (lavagem, evasão de divisas e corrupção, segundo a piauí). Não há condenação neste dossiê.",
        ],
        bullets: [
          "Flávio: contato e patrocínio privado; diz não ter detalhe de todas as operações do fundo.",
          "Coaf e delação de operador financeiro são as bases das reportagens sobre as parcelas.",
          "Inquérito autorizado não é sentença.",
        ],
      },
      {
        id: "fgc-previdencia",
        title: "CDBs, FGC e fundos de previdência",
        summary: [
          "O Master cresceu captando com CDBs de rendimento alto.",
          "O FGC cobre até R$ 250 mil por CPF/CNPJ em produtos listados; fundos de previdência de estados e municípios em geral ficam de fora.",
          "Reportagens descrevem aplicações de fundos previdenciários (Rio, Amapá, Amazonas e municípios) em papéis do Master na casa de bilhões.",
          "Se esses recursos não tiverem a garantia do FGC, o risco recai no orçamento público.",
        ],
        bullets: [
          "Ver página FGC no glossário para o teto e o que costuma ficar de fora.",
          "Números exatos de cada fundo estadual devem ser lidos na reportagem citada em Fontes.",
        ],
      },
      {
        id: "nicolas-campanha",
        title: "Nicolas Ferreira e a campanha de 2022",
        summary: [
          "Imprensa e mensagens atribuídas a Vorcaro descrevem voos de campanha do deputado Nicolas Ferreira em aeronave ligada ao Master no segundo turno de 2022. Vorcaro teria escrito que bancou os voos.",
          "Nicolas disse não saber de quem era o avião e nega proximidade ou dinheiro.",
          "Um áudio seu a Vorcaro pede encaminhamento de contato sobre ativo minerário.",
          "André Valadão aparece como quem apresentou o contato “Dani” a Nicolas, segundo o próprio deputado.",
        ],
        bullets: [
          "Nicolas: áudio sem efeito prático; sem proximidade com Vorcaro.",
          "Valadão também é citado como interlocutor quando Nicolas criticou evento do Master em Londres (imprensa).",
        ],
      },
      {
        id: "respostas",
        title: "O que cada lado diz",
        summary: [
          "Há notas públicas do escritório, de Camilla, de Newton Ramos, de Nunes Marques, de Kevin, de Toffoli, de Fux, da Lagoinha, de Flávio Bolsonaro, de Nicolas Ferreira e de interlocutores citados.",
          "O Lupa coloca o essencial lado a lado com o que a imprensa, o Coaf e a PF apuraram.",
        ],
        bullets: [
          "Escritório Queiroga…: sem pagamento de pró-labore ou êxito; sem atuação no processo da 2ª Turma citado; sem vínculo com Nunes Marques.",
          "Camilla: contrato formal com o Master; sem relação com Nunes Marques.",
          "Newton: esposa em causas cíveis do Master fora do STF; relação pessoal prévia; Prime You seria privado; nunca julgou causa em que o Master fosse parte formal.",
          "Nunes Marques: nunca votou a favor de Vorcaro/Master; nunca trocou mensagens nem pediu nada a ele; nunca autorizou porta-vozes; filho não recebeu dinheiro de Vorcaro; serviço na Consult seria declarado.",
          "Kevin: serviços à Consult; sem Master/Vorcaro; sem relação com o STF.",
          "Toffoli: sem amizade íntima com Vorcaro; sem recursos no exterior; sem alteração de voto; relatório tratado no STF sem suspeição.",
          "Luiz Fux / Rodrigo Fux: aproximação existiu; sem contrato; ministro votou contra interesses do Master no Tabu.",
          "Lagoinha Global: autonomia das unidades; valores do Belvedere apresentados como obras; desconhecia a dimensão até as investigações.",
          "Flávio Bolsonaro: patrocínio privado ao filme; afirma fim dos pagamentos em mai/2025 (Coaf registra set/2025).",
          "Nicolas Ferreira: sem proximidade; sem dinheiro do Master.",
          "Defesa de Vorcaro / Zettel: sem comentário em várias das matérias citadas.",
        ],
      },
    ],
    sections: [
      {
        heading: "Como ler este dossiê",
        paragraphs: [
          "Comece pela frente “Antes do escândalo”: a rede (Lagoinha, casamento, crédito no culto, campanha) ajuda a ligar o que veio depois.",
          "Celular apreendido em novembro de 2025, Coaf, PF e reportagens alimentam o restante. Versões oficiais ficam em “O que cada lado diz”.",
        ],
        bullets: [
          "Antes do escândalo (rede Lagoinha / crédito / campanha)",
          "Contrato e precatórios",
          "“Turma do KN” e Alcídia",
          "Consult, Coaf e Kevin Marques",
          "Fundo Arleen e TRF-1",
          "Lagoinha / Zettel / Coaf",
          "Dark Horse / Flávio Bolsonaro",
          "Fundos de previdência e FGC",
          "Notas de cada lado",
        ],
      },
    ],
    relatedSlugs: [
      "turma-do-kn",
      "precatorios",
      "stf",
      "destilaria-alcidia",
      "nota-de-defesa",
      "fgc",
      "igreja-lagoinha",
      "dark-horse",
      "consult-inteligencia-tributaria",
      "camilla-ramos",
      "rodrigo-fux",
    ],
    sources: [
      {
        label:
          "R$ 427 milhões: o contrato da “Turma do KN” para destravar precatórios de Vorcaro. Andreza Matais",
        url: "https://www.metropoles.com/colunas/andreza-matais/r-427-milhoes-o-contrato-da-turma-do-kn-para-destravar-precatorios-de-vorcaro",
        outlet: "Metrópoles",
        publishedAt: "2026-09-21",
      },
      {
        label:
          "Contrato de Vorcaro previa até R$ 427 milhões a escritório de esposa de desembargador identificado como da ‘turma’ de Nunes Marques. Márcio Falcão e Vinícius Cassela",
        url: "https://g1.globo.com/politica/noticia/2026/09/22/contrato-de-vorcaro-previa-ate-r-427-milhoes-a-escritorio-de-esposa-de-desembargador-indentificado-como-da-turma-de-nunes-marques.ghtml",
        outlet: "g1 / TV Globo",
        publishedAt: "2026-09-22",
      },
      {
        label:
          "‘Turma do KN’: contrato em celular de Vorcaro indica pagamentos de até R$ 427 milhões a escritório da mulher de um desembargador",
        url: "https://g1.globo.com/jornal-nacional/noticia/2026/09/22/turma-do-kn-contrato-em-celular-de-vorcaro-indica-pagamentos-de-ate-r-437-milhoes-a-escritorio-da-mulher-de-um-desembargador.ghtml",
        outlet: "Jornal Nacional / g1",
        publishedAt: "2026-09-22",
      },
      {
        label:
          "Master contratou mulher e filho de desembargador para receber precatórios expedidos antes da hora",
        url: "https://www.estadao.com.br/economia/master-contratou-mulher-e-filho-de-desembargador-para-receber-precatorios-expedidos-antes-da-hora/",
        outlet: "Estadão",
      },
      {
        label:
          "Como o Master tentou usar a Justiça para fechar a engenharia financeira de R$ 16 bi em precatórios. Cristiane Barbieri e Alvaro Gribel",
        url: "https://www.estadao.com.br/economia/justica-supremo-pecas-chave-master-engenharia-financeira/",
        outlet: "Estadão",
        publishedAt: "2026-09-23",
      },
      {
        label:
          "Mensagens em celular de Vorcaro indicam pagamento de R$ 500 mil a filho de Nunes Marques",
        url: "https://www.estadao.com.br/politica/mensagens-em-celular-de-vorcaro-indicam-pagamento-de-r-500-mil-a-filho-de-nunes-marques/",
        outlet: "Estadão",
      },
      {
        label:
          "“Dominado aqui”: pagamentos a empresa ligada ao filho de Kassio Nunes Marques. Breno Pires",
        url: "https://piaui.uol.com.br/web/dominado-aqui-kassio-nunes-marques-master-stf/",
        outlet: "revista piauí",
        publishedAt: "2026-09-18",
      },
      {
        label:
          "O ministro, o banqueiro e o fundo: PF suspeita que Toffoli tenha dinheiro de Vorcaro em paraíso fiscal. Breno Pires",
        url: "https://piaui.uol.com.br/web/toffoli-relatorio-pf-vorcaro-paraiso-fiscal/",
        outlet: "revista piauí",
        publishedAt: "2026-09-10",
      },
      {
        label:
          "Desembargador beneficiou Master 6 meses antes de esposa fechar contrato com Vorcaro",
        url: "https://www.infomoney.com.br/politica/desembargador-beneficiou-master-6-meses-antes-de-esposa-fechar-contrato-com-vorcaro/",
        outlet: "InfoMoney",
      },
      {
        label:
          "Vorcaro tinha contrato de R$ 427 mi com ‘turma’ de Kassio e negociava favores, diz portal",
        url: "https://www1.folha.uol.com.br/poder/2026/09/vorcaro-tinha-contrato-de-r-427-mi-com-turma-de-kassio-e-negociava-favores-diz-portal.shtml",
        outlet: "Folha de S.Paulo",
        publishedAt: "2026-09-22",
      },
      {
        label:
          "Revelando: Grandes Igrejas, Master Negócios | Ep #2 (podcast Calma Urgente / Estúdio Fluxo)",
        url: "https://www.youtube.com/watch?v=Mj6Il4NWieA",
        outlet: "Calma Urgente · YouTube",
        publishedAt: "2026-09-21",
      },
      {
        label:
          "Fintech de André Valadão sai do ar e entra na mira da CPI do INSS",
        url: "https://apublica.org/2025/12/fintech-de-andre-valadao-sai-do-ar-e-entra-na-mira-da-cpi-do-inss/",
        outlet: "Agência Pública",
        publishedAt: "2025-12",
      },
      {
        label:
          "Da Lagoinha ao Master: as conexões entre Vorcaro, Valadão, Nikolas e Flávio Bolsonaro",
        url: "https://revistaforum.com.br/politica/lagoinha-master-vorcaro-valadao-nikolas-flavio/",
        outlet: "Revista Fórum",
        publishedAt: "2026-09-22",
      },
      {
        label:
          "Familiares de Vorcaro enviaram R$ 2 milhões para igreja da Lagoinha em meio a cobranças de pastor",
        url: "https://oglobo.globo.com/politica/noticia/2026/09/15/familiares-de-vorcaro-enviaram-r-2-milhoes-para-igreja-da-lagoinha-em-meio-a-cobrancas-de-pastor-obra-vai-parar.ghtml",
        outlet: "O Globo",
        publishedAt: "2026-09-15",
      },
      {
        label: "O Coaf no caminho de Dark Horse. Revista piauí",
        url: "https://piaui.uol.com.br/web/o-coaf-no-caminho-de-idark-horsei/",
        outlet: "revista piauí",
      },
    ],
  },
  {
    slug: "turma-do-kn",
    kind: "conceito",
    title: "Turma do KN",
    teaser:
      "Apelido que aparece nas mensagens do círculo de Vorcaro para o grupo ligado a Camilla e Newton Ramos. A imprensa e a PF tratam “KN” como referência a Kassio Nunes Marques.",
    teaserSimple:
      "Nome que sai nos chats do caso Master para um grupinho em volta de Camilla e Newton Ramos. A imprensa liga o “KN” ao ministro Kassio Nunes Marques.",
    hoverBlurb:
      "Nas mensagens do Master, é o apelido do grupo ligado a Camilla e Newton Ramos. “KN” é tratado pela PF e pelo JN como Kassio Nunes Marques, que nega ter autorizado alguém a falar em seu nome.",
    hoverBlurbSimple:
      "Apelido nos chats do caso Master para o grupo de Camilla e Newton Ramos. A imprensa e a PF ligam o “KN” ao ministro Kassio. Ele nega.",
    aliases: [
      "turma do KN/Newton",
      "Turma do KN/Newton",
      "turma do KN",
      "Turma do KN",
      "Turma KN",
      "turma KN",
    ],
    publishedAt: "2026-09-23",
    cover: {
      src: "/noticias/congresso-senado.jpg",
      alt: "Congresso Nacional visto da Esplanada, em Brasília",
      credit:
        "Pillar Pedreira / Agência Senado · Wikimedia Commons (CC BY 2.0) · P&B no Lupa",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Fotos_produzidas_pelo_Senado_(30554309793).jpg",
    },
    keyFacts: [
      { label: "O quê", value: "Apelido em mensagens" },
      { label: "Grupo citado", value: "Camilla · Newton Ramos" },
      { label: "“KN” (imprensa/PF)", value: "Kassio Nunes Marques" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn", "stf", "camilla-ramos"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "“Turma do KN” (ou “turma do KN/Newton”) é o apelido que operadores e o círculo de Vorcaro usam, nas mensagens apreendidas, para o grupo ligado à advogada Camilla Ramos e ao desembargador Newton Ramos.",
        ],
      },
      {
        heading: "O que a imprensa e a PF dizem sobre o “KN”",
        paragraphs: [
          "A Polícia Federal e o Jornal Nacional tratam as iniciais “KN” como referência ao ministro do STF Kassio Nunes Marques. O Metrópoles descreve pedidos atribuídos a esse círculo: hotéis, Fórmula 1, camarote na Sapucaí, mansão no Joá no Carnaval e jato para aniversário em Maceió.",
          "Em 20/fev/2025, uma mensagem citada pelo JN e pelo Metrópoles diz: “A turma do KN, Newton, me mandou seis nomes para colocar na lista do camarote”.",
        ],
      },
      {
        heading: "O que Nunes Marques e Newton dizem",
        paragraphs: [
          "Kassio Nunes Marques nega ter autorizado alguém a falar em seu nome e nega pedidos a Vorcaro. Newton Ramos, em nota, fala em relação pessoal prévia e diz que nunca julgou causa em que o Master fosse parte formal.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "O apelido aparece em chats e reportagens. Não é veredicto nem prova de que o ministro comandava o grupo. Para o fio completo (contrato, precatórios, Alcídia, Coaf), abra o caso Vorcaro.",
          "Não confundir com “A Turma”: a PF cita outro grupo, com esse nome, ligado a monitorar e pressionar adversários.",
        ],
      },
    ],
    sources: [
      {
        label:
          "R$ 427 milhões: o contrato da “Turma do KN” para destravar precatórios de Vorcaro. Andreza Matais · Metrópoles",
        url: "https://www.metropoles.com/colunas/andreza-matais/r-427-milhoes-o-contrato-da-turma-do-kn-para-destravar-precatorios-de-vorcaro",
        outlet: "Metrópoles",
        publishedAt: "2026-09-21",
      },
      {
        label:
          "‘Turma do KN’: contrato em celular de Vorcaro indica pagamentos de até R$ 427 milhões… · Jornal Nacional / g1",
        url: "https://g1.globo.com/jornal-nacional/noticia/2026/09/22/turma-do-kn-contrato-em-celular-de-vorcaro-indica-pagamentos-de-ate-r-437-milhoes-a-escritorio-da-mulher-de-um-desembargador.ghtml",
        outlet: "Jornal Nacional / g1",
        publishedAt: "2026-09-22",
      },
    ],
  },
  {
    slug: "stf",
    kind: "conceito",
    title: "STF",
    teaser:
      "Supremo Tribunal Federal: a corte que interpreta a Constituição e julga causas de alto impacto.",
    teaserSimple:
      "O tribunal mais alto do Brasil. Decide se leis e atos do governo batem com a Constituição.",
    hoverBlurb:
      "Órgão máximo do Judiciário. Guarda a Constituição, julga ações entre poderes e causas que afetam o país inteiro.",
    hoverBlurbSimple:
      "O “tribunal final” do Brasil. Quando um caso chega lá, a decisão costuma valer para todo o país.",
    aliases: [
      "STF",
      "Supremo",
      "Supremo Tribunal Federal",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "O quê", value: "Corte constitucional" },
      { label: "Onde", value: "Brasília" },
      { label: "Turmas", value: "1ª e 2ª" },
    ],
    relatedSlugs: ["destilaria-alcidia", "caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "O STF (Supremo Tribunal Federal) é o órgão máximo do Poder Judiciário no Brasil. Interpreta a Constituição e julga processos que envolvem a União, estados, autoridades e temas de grande impacto.",
        ],
      },
      {
        heading: "Por que aparece nos casos",
        paragraphs: [
          "Muitos processos de alto valor (precatórios, liminares, ações penais) passam pelo STF. A 2ª Turma é um colegiado interno: um grupo de ministros que julga certos recursos e habeas corpus, em vez do plenário completo.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Citar o STF ou um ministro não prova culpa nem inocência. O Lupa resume o que a imprensa e documentos públicos descrevem. A decisão judicial é o que vale no processo.",
        ],
      },
    ],
    sources: [
      {
        label: "Portal do STF · Institucional",
        url: "https://portal.stf.jus.br/",
        outlet: "STF",
      },
    ],
  },
  {
    slug: "destilaria-alcidia",
    kind: "conceito",
    title: "Julgamento da Alcídia",
    teaser:
      "Processo da Destilaria Alcídia (grupo Atvos) na 2ª Turma do STF, citado nas mensagens do caso Master.",
    teaserSimple:
      "Um julgamento no Supremo sobre indenização de uma usina. Aparece nas mensagens do caso Vorcaro.",
    hoverBlurb:
      "Ação na 2ª Turma do STF sobre indenização ligada à política de preços do IAA nos anos 1980. Placar 3x2 a favor da usina.",
    hoverBlurbSimple:
      "Um processo no Supremo sobre dinheiro que uma usina dizia ter a receber. O placar foi 3 a 2. Esse nome aparece nos chats do caso Master.",
    aliases: [
      "Alcídia",
      "Alcidia",
      "Destilaria Alcídia",
      "Destilaria Alcidia",
      "julgamento da Alcídia",
      "caso Alcídia",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Onde", value: "STF · 2ª Turma" },
      { label: "Placar citado", value: "3×2" },
      { label: "Grupo", value: "Atvos" },
    ],
    relatedSlugs: ["stf", "precatorios", "caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "A Destilaria Alcídia (grupo Atvos) discutia no STF uma indenização ligada a prejuízos da política de preços do Instituto do Açúcar e do Álcool (IAA) nos anos 1980.",
        ],
      },
      {
        heading: "O que a imprensa ligou ao Master",
        paragraphs: [
          "Reportagens descrevem placar 3 a 2 na 2ª Turma a favor da usina (ministros Fachin, Toffoli e Nunes Marques; votos contrários de Gilmar Mendes e André Mendonça). Mensagens atribuídas a executivos do Master celebram o resultado (“Ganhamos alcidia”).",
          "A PF e a revista piauí ligam o tema à carteira sucroalcooleira do Master. Isso é relato de investigação e imprensa, não sentença condenatória neste dossiê.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Um placar judicial e uma mensagem celebrando o resultado não bastam, sozinhos, para concluir crime. O Lupa coloca o fio e as versões públicas lado a lado.",
        ],
      },
    ],
    sources: [
      {
        label:
          "“Dominado aqui”: pagamentos a empresa ligada ao filho de Kassio Nunes Marques. Breno Pires",
        url: "https://piaui.uol.com.br/web/dominado-aqui-kassio-nunes-marques-master-stf/",
        outlet: "revista piauí",
        publishedAt: "2026-09-18",
      },
      {
        label:
          "Como o Master tentou usar a Justiça para fechar a engenharia financeira de R$ 16 bi em precatórios",
        url: "https://www.estadao.com.br/economia/justica-supremo-pecas-chave-master-engenharia-financeira/",
        outlet: "Estadão",
        publishedAt: "2026-09-23",
      },
    ],
  },
  {
    slug: "nota-de-defesa",
    kind: "conceito",
    title: "Nota de defesa",
    teaser:
      "Comunicado público de quem foi citado: a versão oficial da pessoa ou do escritório.",
    teaserSimple:
      "O texto que a pessoa (ou o advogado) manda para a imprensa dizendo a versão dela.",
    hoverBlurb:
      "Resposta pública a reportagem ou investigação. Não é sentença nem prova automática de inocência.",
    hoverBlurbSimple:
      "É o “lado da pessoa citada”. Ajuda a ler o caso com as duas versões. Não fecha o julgamento.",
    aliases: [
      "nota de defesa",
      "notas de defesa",
      "nota oficial",
      "nota à imprensa",
    ],
    publishedAt: "2026-09-23",
    relatedSlugs: ["caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "Nota de defesa é o comunicado em que a pessoa citada, o escritório ou o gabinete apresenta a versão oficial deles sobre o que a imprensa ou a Polícia Federal relatam.",
        ],
      },
      {
        heading: "Para que serve na leitura",
        paragraphs: [
          "No Lupa, notas entram na frente “O que cada lado diz”, ao lado do que reportagens e documentos descrevem. Assim dá para comparar sem misturar acusação com resposta.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Uma nota negando o fato não apaga o relato da outra fonte. Uma nota admitindo contato também não prova crime. São peças do mesmo dossiê.",
        ],
      },
    ],
    sources: [
      {
        label:
          "R$ 427 milhões: o contrato da “Turma do KN” para destravar precatórios de Vorcaro. Andreza Matais",
        url: "https://www.metropoles.com/colunas/andreza-matais/r-427-milhoes-o-contrato-da-turma-do-kn-para-destravar-precatorios-de-vorcaro",
        outlet: "Metrópoles",
        publishedAt: "2026-09-21",
      },
    ],
  },
  {
    slug: "fgc",
    kind: "conceito",
    title: "FGC",
    teaser:
      "Fundo Garantidor de Créditos: proteção limitada a depositantes se o banco quebrar.",
    teaserSimple:
      "Uma “vaquinha” dos bancos que devolve até um limite se a instituição falir. Não cobre tudo.",
    hoverBlurb:
      "Garante até R$ 250 mil por CPF/CNPJ e conglomerado em certos produtos (CDB, depósito). Fundos de previdência pública em geral ficam de fora.",
    hoverBlurbSimple:
      "Se o banco quebrar, o FGC pode devolver até R$ 250 mil por pessoa em alguns investimentos. Dinheiro de fundo de aposentadoria de estado costuma não entrar nisso.",
    aliases: [
      "FGC",
      "Fundo Garantidor",
      "Fundo Garantidor de Créditos",
      "fundo garantidor de crédito",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Teto usual", value: "R$ 250 mil" },
      { label: "Por", value: "CPF/CNPJ · conglomerado" },
      { label: "Exemplo coberto", value: "CDB (regras do FGC)" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "O FGC (Fundo Garantidor de Créditos) é uma entidade privada, mantida pelos bancos, que protege o investidor/depositante até um limite quando a instituição financeira quebra, em produtos listados nas regras do fundo.",
        ],
      },
      {
        heading: "O que costuma ficar de fora",
        paragraphs: [
          "Aplicações de fundos de previdência de estados e municípios em geral não têm a mesma cobertura do FGC. Se o banco falhar, o risco pode cair no orçamento público.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Ter cobertura do FGC não significa que o investimento era seguro ou adequado. Significa só que, dentro das regras, há um teto de proteção para aquele tipo de aplicação.",
        ],
      },
    ],
    sources: [
      {
        label: "FGC · O que é o Fundo Garantidor de Créditos",
        url: "https://www.fgc.org.br/",
        outlet: "FGC",
      },
    ],
  },
  {
    slug: "igreja-lagoinha",
    kind: "conceito",
    title: "Igreja Lagoinha",
    teaser:
      "Rede evangélica com sede histórica em Belo Horizonte. No caso Master, a unidade Belvedere e o pastor Fabiano Zettel entram pelo Coaf e pela imprensa.",
    teaserSimple:
      "Uma igreja grande, com várias unidades. No caso Master, aparece a unidade Belvedere (BH) e o pastor Fabiano Zettel.",
    hoverBlurb:
      "Rede evangélica (Lagoinha). A unidade Belvedere, ligada a Fabiano Zettel (cunhado de Vorcaro), movimentou cerca de R$ 57 mi no Coaf.",
    hoverBlurbSimple:
      "Igreja citada no caso Master. O Coaf olhou a conta da unidade Belvedere, em Belo Horizonte, sob gestão de Fabiano Zettel.",
    aliases: [
      "Lagoinha",
      "Igreja Lagoinha",
      "Lagoinha Belvedere",
      "Lagoinha Global",
      "igreja da Lagoinha",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Rede", value: "Lagoinha (várias unidades)" },
      { label: "Unidade no caso", value: "Belvedere · BH" },
      { label: "Coaf (cerca de)", value: "R$ 57 mi movimentados" },
      { label: "Zettel → Belvedere", value: "R$ 19,2 mi (Coaf)" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "A Igreja Batista da Lagoinha (hoje frequentemente chamada Lagoinha) é uma rede evangélica brasileira com várias unidades.",
          "A sede histórica fica em Belo Horizonte. Cada unidade pode ter gestão e contas próprias.",
        ],
      },
      {
        heading: "Por que aparece no caso Master",
        paragraphs: [
          "A ligação Vorcaro–Lagoinha vem de antes do escândalo: família em BH desde os anos 90, casamento de Natália Vorcaro com Fabiano Zettel celebrado por André Valadão (2018), produtos de crédito no culto (cartão “Fé”, 2019) e a fintech Clava Forte (2024).",
          "Zettel aparece nas reportagens como gestor da unidade Lagoinha Belvedere. O Coaf e a imprensa entram depois da prisão.",
        ],
        bullets: [
          "Coaf (imprensa): ~R$ 57 mi movimentados na conta do Belvedere em cerca de um ano.",
          "Zettel teria injetado R$ 19,2 mi; familiares de Vorcaro cerca de R$ 2 mi.",
          "O Globo: cobranças de Zettel a Vorcaro para obra do templo.",
          "Clava Forte: site/app saem do ar na semana da 1ª prisão de Vorcaro (Agência Pública).",
          "Lagoinha Global (Valadão): autonomia das unidades; valores só claros com as investigações.",
          "Zettel afastado das funções pastorais; Belvedere encerrou atividades em mar/2026.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Citar a Lagoinha ou uma unidade não significa que a rede inteira esteja sob investigação.",
          "O Lupa resume o que Coaf e reportagens descrevem sobre contas e pessoas nomeadas. Não é veredicto sobre a igreja nem sobre fé.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Familiares de Vorcaro enviaram R$ 2 milhões para igreja da Lagoinha em meio a cobranças de pastor",
        url: "https://oglobo.globo.com/politica/noticia/2026/09/15/familiares-de-vorcaro-enviaram-r-2-milhoes-para-igreja-da-lagoinha-em-meio-a-cobrancas-de-pastor-obra-vai-parar.ghtml",
        outlet: "O Globo",
        publishedAt: "2026-09-15",
      },
      {
        label:
          "Caso Vorcaro: Master, Judiciário, Lagoinha e a rede em torno do banco",
        url: "/noticias/caso-vorcaro-master-turma-kn",
        outlet: "Lupa · Casos",
      },
    ],
  },
  {
    slug: "dark-horse",
    kind: "conceito",
    title: "Dark Horse",
    teaser:
      "Cinebiografia de Jair Bolsonaro citada no Coaf e na PGR: repasses da órbita de Vorcaro e cobranças atribuídas a Flávio Bolsonaro.",
    teaserSimple:
      "Um filme sobre Jair Bolsonaro. No caso Master, o Coaf e a PGR falam de dinheiro da órbita de Vorcaro para financiar a produção.",
    hoverBlurb:
      "Filme/produção sobre Bolsonaro. Coaf e PGR citam até US$ 24 mi no acordo e cerca de US$ 12,3 mi rastreados via fundo Havengate.",
    hoverBlurbSimple:
      "Produção cinematográfica ligada a Bolsonaro. Aparece no caso Master por repasses e mensagens sobre parcelas.",
    aliases: [
      "Dark Horse",
      "iDark Horse",
      "Havengate",
      "fundo Havengate",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "O quê", value: "Cinebiografia · Jair Bolsonaro" },
      { label: "Acordo citado", value: "Até US$ 24 mi" },
      { label: "Rastreado (PGR)", value: "US$ 12,3 mi · Havengate" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "Dark Horse é o nome da cinebiografia de Jair Bolsonaro citada em reportagens e em documentos do Coaf e da PGR no entorno do caso Master.",
        ],
      },
      {
        heading: "O que a imprensa e o Coaf descrevem",
        paragraphs: [
          "Mensagens e o Coaf ligam Daniel Vorcaro a repasses para financiar a produção.",
        ],
        bullets: [
          "Acordo citado na imprensa: até US$ 24 milhões.",
          "PGR (parecer ao STF): cerca de US$ 12,3 mi da órbita de Vorcaro ao fundo Havengate.",
          "Flávio Bolsonaro aparece cobrando parcelas; diz que pagamentos cessaram em mai/2025.",
          "Coaf registra envio adicional em set/2025.",
          "Set/2026: Mendonça autoriza inquérito da PF sobre Flávio, Eduardo Bolsonaro e Mario Frias (piauí).",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Inquérito autorizado não é sentença.",
          "Patrocínio de filme e cobrança de parcela, sozinhos, não fecham o caso. O fio completo fica no dossiê Vorcaro.",
        ],
      },
    ],
    sources: [
      {
        label: "O Coaf no caminho de Dark Horse. Revista piauí",
        url: "https://piaui.uol.com.br/web/o-coaf-no-caminho-de-idark-horsei/",
        outlet: "revista piauí",
      },
      {
        label:
          "Caso Vorcaro: Master, Judiciário, Lagoinha e a rede em torno do banco",
        url: "/noticias/caso-vorcaro-master-turma-kn",
        outlet: "Lupa · Casos",
      },
    ],
  },
  {
    slug: "consult-inteligencia-tributaria",
    kind: "conceito",
    title: "Consult Inteligência Tributária",
    teaser:
      "Empresa de consultoria tributária (Teresina / Alphaville) que recebeu repasses do Master e da JBS e pagou o advogado Kevin Marques, segundo o Coaf.",
    teaserSimple:
      "Uma consultoria de impostos. No caso Master, o Coaf mostra dinheiro do banco e da JBS entrando, e pagamentos saindo para o filho do ministro Nunes Marques.",
    hoverBlurb:
      "Consultoria de Francisco Craveiro. Coaf: Master R$ 6,6 mi e JBS R$ 11,3 mi; Consult → Kevin Marques cerca de R$ 282 mil.",
    hoverBlurbSimple:
      "Empresa de consultoria tributária. Aparece no Coaf entre o Master, a JBS e pagamentos a Kevin Marques.",
    aliases: [
      "Consult",
      "Consult Inteligência",
      "Consult Inteligência Tributária",
      "Consult Inteligencia Tributaria",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Master → Consult", value: "R$ 6,6 mi (Coaf)" },
      { label: "JBS → Consult", value: "R$ 11,3 mi (imprensa)" },
      { label: "Consult → Kevin", value: "≈ R$ 282 mil" },
      { label: "Dono citado", value: "Francisco Craveiro" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn", "nota-de-defesa"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "A Consult Inteligência Tributária é uma empresa de auditoria e consultoria tributária aberta em 2022 por Francisco Craveiro de Carvalho Junior, com endereços citados em Teresina (PI), Barueri/Alphaville (SP) e Brasília.",
        ],
      },
      {
        heading: "Por que aparece no caso Master",
        paragraphs: [
          "Relatório do Coaf (Estadão / piauí) registra dinheiro entrando na Consult e saindo para Kevin Marques.",
        ],
        bullets: [
          "Master → Consult: cerca de R$ 6,6 mi (14 operações).",
          "JBS → Consult: cerca de R$ 11,3 mi.",
          "Consult → Kevin Marques: cerca de R$ 282 mil.",
          "piauí: ligação societária Consult ↔ IPGT (Kevin 70% / Gabriel Campelo 30%).",
          "Kevin: pagamento por assessoria jurídica tributária. Consult/Craveiro: serviços técnicos e reorganização societária formal.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Repasse via consultoria e nota de serviços não fecham, sozinhos, se houve irregularidade.",
          "O Lupa resume Coaf, reportagens e as versões públicas. Sem veredicto.",
        ],
      },
    ],
    sources: [
      {
        label:
          "“Dominado aqui”: pagamentos a empresa ligada ao filho de Kassio Nunes Marques. Breno Pires",
        url: "https://piaui.uol.com.br/web/dominado-aqui-kassio-nunes-marques-master-stf/",
        outlet: "revista piauí",
        publishedAt: "2026-09-18",
      },
      {
        label:
          "Em nome do Kassio, do filho, do amigo e do filho do amigo",
        url: "https://piaui.uol.com.br/web/em-nome-do-kassio-do-filho-do-amigo-e-do-filho-do-amigo/",
        outlet: "revista piauí",
        publishedAt: "2026-04-20",
      },
      {
        label:
          "Mensagens em celular de Vorcaro indicam pagamento de R$ 500 mil a filho de Nunes Marques",
        url: "https://www.estadao.com.br/politica/mensagens-em-celular-de-vorcaro-indicam-pagamento-de-r-500-mil-a-filho-de-nunes-marques/",
        outlet: "Estadão",
      },
    ],
  },
  {
    slug: "camilla-ramos",
    kind: "conceito",
    title: "Camilla Ramos",
    teaser:
      "Advogada sócia do QVQR; esposa do desembargador Newton Ramos; contratada pelo Master em precatórios (honorários de até R$ 427 mi no contrato citado).",
    teaserSimple:
      "Advogada do escritório QVQR. Casada com o desembargador Newton Ramos. O Master fechou contrato com o escritório dela sobre precatórios.",
    hoverBlurb:
      "Advogada; sócia do Queiroga, Vieira, Queiroz & Ramos; esposa de Newton Ramos. Contrato Master: até R$ 427 mi de honorários.",
    hoverBlurbSimple:
      "Advogada citada no contrato de honorários do Master. Esposa do desembargador Newton Ramos (TRF-1).",
    aliases: [
      "Camilla Ramos",
      "Camila Ramos",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Papel", value: "Advogada · QVQR" },
      { label: "Contrato citado", value: "Até R$ 427 mi" },
      { label: "Cônjuge", value: "Newton Ramos · TRF-1" },
    ],
    relatedSlugs: [
      "caso-vorcaro-master-turma-kn",
      "precatorios",
      "nota-de-defesa",
    ],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "Camilla Ramos é advogada, sócia do escritório Queiroga, Vieira, Queiroz & Ramos (QVQR), e esposa do desembargador Newton Ramos, do TRF-1.",
        ],
      },
      {
        heading: "O que a imprensa descreve",
        paragraphs: [
          "Celular de Vorcaro e reportagens (Metrópoles, g1, Estadão) descrevem o contrato de honorários com o escritório dela.",
        ],
        bullets: [
          "5% líquidos sobre 12 ações de precatórios (R$ 8,5 bi).",
          "Teto citado: até R$ 427 milhões.",
          "Gabriel Ramos (filho de Newton) também aparece contratado (Estadão).",
          "Mensagens atribuídas a Camilla celebram voto no STF.",
          "Nota dela: relação profissional formal com o Master; sem relação com Nunes Marques.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Contrato de honorários e parentesco com juiz não bastam, sozinhos, para concluir irregularidade.",
          "Newton Ramos se declarou impedido nos processos dos familiares, segundo o Estadão. Detalhe no dossiê Vorcaro.",
        ],
      },
    ],
    sources: [
      {
        label:
          "R$ 427 milhões: o contrato da “Turma do KN” para destravar precatórios de Vorcaro. Andreza Matais",
        url: "https://www.metropoles.com/colunas/andreza-matais/r-427-milhoes-o-contrato-da-turma-do-kn-para-destravar-precatorios-de-vorcaro",
        outlet: "Metrópoles",
        publishedAt: "2026-09-21",
      },
      {
        label:
          "Master contratou mulher e filho de desembargador para receber precatórios expedidos antes da hora",
        url: "https://www.estadao.com.br/economia/master-contratou-mulher-e-filho-de-desembargador-para-receber-precatorios-expedidos-antes-da-hora/",
        outlet: "Estadão",
      },
    ],
  },
  {
    slug: "rodrigo-fux",
    kind: "conceito",
    title: "Rodrigo Fux",
    teaser:
      "Advogado; filho do ministro Luiz Fux. Recebeu minuta de embargos do caso Tabu de Vorcaro; o escritório diz que não fechou contrato.",
    teaserSimple:
      "Advogado, filho do ministro Luiz Fux. Vorcaro mandou a ele uma minuta do caso Tabu. O escritório diz que não fechou contrato.",
    hoverBlurb:
      "Advogado; filho de Luiz Fux. Estadão: Vorcaro enviou minuta de embargos no caso Tabu dois dias antes do julgamento.",
    hoverBlurbSimple:
      "Filho do ministro Fux. Aparece no caso Master porque Vorcaro mandou minuta do processo Tabu para o escritório dele.",
    aliases: [
      "Rodrigo Fux",
      "Rodrigo Fuchs",
    ],
    publishedAt: "2026-09-23",
    keyFacts: [
      { label: "Papel", value: "Advogado" },
      { label: "Parentesco", value: "Filho de Luiz Fux · STF" },
      { label: "Frente citada", value: "Caso Tabu · minuta" },
    ],
    relatedSlugs: ["caso-vorcaro-master-turma-kn", "stf", "nota-de-defesa"],
    sections: [
      {
        heading: "Em uma frase",
        paragraphs: [
          "Rodrigo Fux é advogado e filho do ministro do STF Luiz Fux. No caso Master, a imprensa o cita na frente do processo Tabu (embargos).",
        ],
      },
      {
        heading: "O que a imprensa descreve",
        paragraphs: [
          "Segundo o Estadão, Vorcaro enviou a Rodrigo Fux uma minuta de embargos no caso Tabu dois dias antes do julgamento.",
        ],
        bullets: [
          "Escritório: aproximação existiu, mas não fechou contrato.",
          "Luiz Fux votou contra interesses do Master no Tabu, segundo a mesma frente de reportagens.",
        ],
      },
      {
        heading: "Como ler com cuidado",
        paragraphs: [
          "Receber minuta e ser filho de ministro não prova contrato ilícito nem influência no voto.",
          "O Lupa registra o relato e a nota do escritório. Sem veredicto.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Como o Master tentou usar a Justiça para fechar a engenharia financeira de R$ 16 bi em precatórios",
        url: "https://www.estadao.com.br/economia/justica-supremo-pecas-chave-master-engenharia-financeira/",
        outlet: "Estadão",
        publishedAt: "2026-09-23",
      },
      {
        label:
          "Caso Vorcaro: Master, Judiciário, Lagoinha e a rede em torno do banco",
        url: "/noticias/caso-vorcaro-master-turma-kn",
        outlet: "Lupa · Casos",
      },
    ],
  },
];

export function explainerParagraphs(
  summary: string | string[] | undefined,
): string[] {
  if (!summary) return [];
  if (Array.isArray(summary)) {
    return summary.map((p) => p.trim()).filter(Boolean);
  }
  return summary
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function explainerHoverBlurb(
  e: Pick<Explainer, "hoverBlurb" | "hoverBlurbSimple">,
  level: "simples" | "completo",
): string {
  if (level === "simples" && e.hoverBlurbSimple?.trim()) {
    return e.hoverBlurbSimple.trim();
  }
  return e.hoverBlurb;
}

export function explainerTeaser(
  e: Pick<Explainer, "teaser" | "teaserSimple">,
  level: "simples" | "completo",
): string {
  if (level === "simples" && e.teaserSimple?.trim()) {
    return e.teaserSimple.trim();
  }
  return e.teaser;
}

export function getExplainer(slug: string): Explainer | undefined {
  return EXPLAINERS.find((e) => e.slug === slug);
}

export function isCaseKind(kind: ExplainerKind): boolean {
  return kind === "caso";
}

export function isGlossaryKind(kind: ExplainerKind): boolean {
  return kind === "conceito" || kind === "plano";
}

/** Rota canônica do explainer (caso ≠ glossário). */
export function explainerPath(e: Pick<Explainer, "slug" | "kind">): string {
  return isCaseKind(e.kind) ? `/noticias/${e.slug}` : `/glossario/${e.slug}`;
}

export function caseExplainers(): Explainer[] {
  return explainersByKind("caso");
}

export function glossaryExplainers(): Explainer[] {
  return EXPLAINERS.filter((e) => isGlossaryKind(e.kind)).sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function explainersByKind(kind: ExplainerKind): Explainer[] {
  return EXPLAINERS.filter((e) => e.kind === kind).sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function featuredExplainers(): Explainer[] {
  return EXPLAINERS.filter((e) => e.featured).sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function featuredCases(): Explainer[] {
  return EXPLAINERS.filter((e) => e.featured && e.kind === "caso").sort(
    (a, b) => a.title.localeCompare(b.title, "pt-BR"),
  );
}

/** Aliases ordenados do mais longo ao mais curto (evita match parcial). */
export function explainerAliasIndex(): {
  alias: string;
  explainer: Explainer;
}[] {
  const rows: { alias: string; explainer: Explainer }[] = [];
  for (const e of EXPLAINERS) {
    for (const alias of e.aliases) {
      rows.push({ alias, explainer: e });
    }
  }
  return rows.sort((a, b) => b.alias.length - a.alias.length);
}

export const EXPLAINER_KIND_LABEL: Record<ExplainerKind, string> = {
  conceito: "Conceito",
  plano: "Plano / política",
  caso: "Caso em aberto",
};
