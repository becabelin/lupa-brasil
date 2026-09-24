/**
 * Pautas contemporâneas usadas como LENTE de leitura dos planos oficiais.
 * Não são endosso: servem para verificar o que cada documento diz (ou não diz)
 * sobre debates públicos relevantes em 2026.
 *
 * `featured: true` → aparece em “Pautas em destaque” na ficha do candidato.
 * Todas entram no Comparar (com busca).
 */
export const HOT_AGENDAS = [
  {
    id: "selic-inflacao",
    group: "Economia e orçamento",
    label: "Selic, juros e inflação",
    description:
      "Custo de vida, política monetária, juros e controle da inflação.",
    lookFor:
      "taxa Selic, juros, inflação, custo de vida, Banco Central, poder de compra, créditos caros",
    featured: true,
  },
  {
    id: "contas-publicas",
    group: "Economia e orçamento",
    label: "Contas públicas e responsabilidade fiscal",
    description:
      "Equilíbrio fiscal, gastos, arcabouço e pressão sobre as contas em ano eleitoral.",
    lookFor:
      "arcabouço fiscal, déficit, dívida pública, gasto público, responsabilidade fiscal, orçamento, teto de gastos",
    featured: true,
  },
  {
    id: "isencao-ir",
    group: "Economia e orçamento",
    label: "Isenção do Imposto de Renda",
    description:
      "Faixa de isenção do IR (incluindo propostas em torno de R$ 5 mil) e tributação da renda.",
    lookFor:
      "Imposto de Renda, isenção do IR, faixa de isenção, R$ 5 mil, tabela do IR, tributação da renda",
    featured: true,
  },
  {
    id: "reforma-tributaria",
    group: "Economia e orçamento",
    label: "Reforma tributária",
    description:
      "IVA, CBS/IBS, simplificação de impostos e o que muda para família e empresa.",
    lookFor:
      "reforma tributária, IVA, CBS, IBS, simplificação tributária, imposto sobre consumo, carga tributária",
  },
  {
    id: "bets-jogos",
    group: "Economia e orçamento",
    label: "Bets e jogos de azar",
    description:
      "Regulação de apostas online, publicidade, proteção a viciados e arrecadação.",
    lookFor:
      "bets, apostas, jogos de azar, casas de apostas, regulação de bets, ludopatia, publicidade de apostas",
  },
  {
    id: "precatorios",
    group: "Economia e orçamento",
    label: "Precatórios",
    description:
      "Pagamento de precatórios, fila de credores e impacto no Orçamento.",
    lookFor:
      "precatórios, precatorio, dívida judicial, ordem cronológica, Emenda dos precatórios",
  },
  {
    id: "escala-6x1",
    group: "Trabalho e renda",
    label: "Jornada de trabalho e escala 6x1",
    description:
      "Redução de jornada, fim da escala 6x1 e organização do tempo de trabalho.",
    lookFor:
      "escala 6x1, jornada de trabalho, redução de jornada, 4 dias, CLT, semana de trabalho",
    featured: true,
  },
  {
    id: "salario-minimo",
    group: "Trabalho e renda",
    label: "Salário mínimo e valorização do trabalho",
    description:
      "Política de salário mínimo, piso e poder de compra do trabalhador.",
    lookFor:
      "salário mínimo, piso salarial, valorização do salário, reajuste do mínimo, renda do trabalho",
  },
  {
    id: "previdencia",
    group: "Trabalho e renda",
    label: "Previdência e aposentadoria",
    description:
      "Regras de aposentadoria, idade mínima, contribuição e sustentabilidade do sistema.",
    lookFor:
      "previdência, aposentadoria, INSS, idade mínima, reforma da previdência, contribuição previdenciária",
  },
  {
    id: "renda-transferencia",
    group: "Trabalho e renda",
    label: "Renda e transferência social",
    description:
      "Bolsa Família e outros programas de renda, pobreza e proteção social.",
    lookFor:
      "Bolsa Família, transferência de renda, renda básica, CadÚnico, pobreza, auxílio",
  },
  {
    id: "big-techs-ia",
    group: "Tecnologia e plataformas",
    label: "Regulação de big techs e IA",
    description:
      "Regulação de plataformas digitais, redes sociais e inteligência artificial.",
    lookFor:
      "big tech, plataformas digitais, redes sociais, inteligência artificial, IA, regulação digital, fake news",
    featured: true,
  },
  {
    id: "crime-organizado",
    group: "Segurança pública",
    label: "Crime organizado e segurança",
    description:
      "Combate ao crime organizado, facções, fronteiras e diretrizes de segurança pública.",
    lookFor:
      "crime organizado, facções, milícias, tráfico, fronteiras, inteligência policial, segurança pública",
    featured: true,
  },
  {
    id: "violencia-mulher",
    group: "Segurança pública",
    label: "Violência contra a mulher e misoginia",
    description:
      "Proteção de mulheres, combate à violência de gênero e criminalização da misoginia.",
    lookFor:
      "violência contra a mulher, feminicídio, misoginia, Lei Maria da Penha, proteção a mulheres, violência de gênero",
    featured: true,
  },
  {
    id: "maioridade-penal",
    group: "Segurança pública",
    label: "Maioridade penal",
    description:
      "Propostas de redução da maioridade penal e tratamento de adolescentes infratores.",
    lookFor:
      "maioridade penal, redução da maioridade, 16 anos, ECA, adolescente infrator, ato infracional",
  },
  {
    id: "armas",
    group: "Segurança pública",
    label: "Armas e desarmamento",
    description:
      "Porte, posse, caça, colecionadores e política de controle de armas.",
    lookFor:
      "armas, porte de arma, posse de arma, desarmamento, CAC, Estatuto do Desarmamento, arma de fogo",
  },
  {
    id: "drogas",
    group: "Segurança pública",
    label: "Drogas e política criminal",
    description:
      "Descriminalização, legalização, tratamento e repressão ao tráfico.",
    lookFor:
      "drogas, maconha, descriminalização, legalização, tráfico de drogas, redução de danos, usuário de drogas",
  },
  {
    id: "modelo-el-salvador",
    group: "Segurança pública",
    label: "Modelo El Salvador / prisões",
    description:
      "Estado de exceção, encarceramento em massa e propostas inspiradas em El Salvador.",
    lookFor:
      "El Salvador, Bukele, CECOT, estado de exceção, superpresídio, encarceramento em massa, mão dura",
  },
  {
    id: "amazonia-clima",
    group: "Meio ambiente e energia",
    label: "Amazônia e clima",
    description:
      "Desmatamento, fiscalização, COP e compromissos climáticos.",
    lookFor:
      "Amazônia, desmatamento, clima, COP, Ibama, fiscalização ambiental, carbono, transição climática",
  },
  {
    id: "energia-transicao",
    group: "Meio ambiente e energia",
    label: "Energia e transição energética",
    description:
      "Petróleo, renováveis, combustíveis e matriz energética.",
    lookFor:
      "energia, transição energética, petróleo, pré-sal, eólica, solar, etanol, combustível, Petrobras",
  },
  {
    id: "sus-filas",
    group: "Saúde e educação",
    label: "SUS, filas e medicamentos",
    description:
      "Acesso ao SUS, tempo de espera, Farmácia Popular e atenção especializada.",
    lookFor:
      "SUS, fila do SUS, medicamentos, Farmácia Popular, UPA, atenção básica, cirurgias eletivas",
  },
  {
    id: "educacao-basica",
    group: "Saúde e educação",
    label: "Educação básica e alfabetização",
    description:
      "Escola pública, alfabetização, ENEM, piso do magistério e tempo integral.",
    lookFor:
      "educação básica, alfabetização, ENEM, piso salarial do magistério, escola em tempo integral, Fundeb",
  },
  {
    id: "moradia",
    group: "Cidades e infraestrutura",
    label: "Moradia e Minha Casa Minha Vida",
    description:
      "Habitação popular, déficit habitacional e crédito imobiliário.",
    lookFor:
      "moradia, Minha Casa Minha Vida, habitação, déficit habitacional, aluguel social, casa própria",
  },
  {
    id: "indigenas-demarcacao",
    group: "Direitos e instituições",
    label: "Povos indígenas e demarcação",
    description:
      "Demarcação de terras, Funai, marco temporal e direitos indígenas.",
    lookFor:
      "indígenas, demarcação, terra indígena, Funai, marco temporal, povos originários, quilombolas",
  },
  {
    id: "aborto",
    group: "Direitos e instituições",
    label: "Aborto e direitos reprodutivos",
    description:
      "O que o plano diz sobre aborto legal, criminalização ou direitos reprodutivos.",
    lookFor:
      "aborto, interrupção da gravidez, direitos reprodutivos, estatuto do nascituro, criminalização do aborto",
  },
  {
    id: "stf-poderes",
    group: "Direitos e instituições",
    label: "STF, Congresso e poderes",
    description:
      "Relação entre Executivo, Congresso e Judiciário; críticas ou defesa de instituições.",
    lookFor:
      "STF, Supremo, Congresso, separação de poderes, ativismo judicial, CPI do STF, equilíbrio entre poderes",
  },
] as const;

export type AgendaId = (typeof HOT_AGENDAS)[number]["id"];
export type AgendaDef = (typeof HOT_AGENDAS)[number];

export function getAgenda(id: string) {
  return HOT_AGENDAS.find((a) => a.id === id);
}

/** Pautas da vitrine na ficha do candidato. */
export function featuredAgendas() {
  return HOT_AGENDAS.filter((a) => "featured" in a && a.featured);
}

export function agendasByGroup() {
  const map = new Map<string, AgendaDef[]>();
  for (const a of HOT_AGENDAS) {
    const list = map.get(a.group) || [];
    list.push(a);
    map.set(a.group, list);
  }
  return [...map.entries()];
}
