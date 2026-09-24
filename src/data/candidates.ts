export type CandidateSource = {
  label: string;
  url: string;
};

export type CandidateCareerBeat = {
  when: string;
  text: string;
};

export type Candidate = {
  id: string;
  slug: string;
  name: string;
  party: string;
  partyFull?: string;
  vice?: string;
  viceParty?: string;
  note?: string;
  /**
   * Quem é a pessoa (não o plano).
   * Fatos públicos rastreáveis. Sem juízo de valor.
   */
  bio?: string;
  /** Formação / ofício declarado em fontes públicas. */
  education?: string;
  /** Linha do tempo da trajetória pública. */
  career?: CandidateCareerBeat[];
  /** Casos do Lupa ligados à pessoa (slugs em /noticias). */
  relatedCaseSlugs?: string[];
  /** De onde veio a ficha biográfica. */
  bioSources?: CandidateSource[];
  socials?: { label: string; href: string }[];
  color: string;
  /** Path under /public, e.g. /candidatos/lula.jpg */
  photo?: string;
};

/**
 * Chapas com registro deferido pelo TSE (11/09/2026).
 * Fonte: https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica
 * Ordem conforme a notícia oficial. Imparcial, sem ranqueamento.
 *
 * Bios e trajetória: síntese factual de cargos e papéis públicos.
 * Não é endorso. Ver bioSources em cada chapa.
 */
const G1_QUEM_SAO: CandidateSource = {
  label: "g1 · Quem são os candidatos a presidente registrados (17/08/2026)",
  url: "https://g1.globo.com/politica/eleicoes/2026/noticia/2026/08/17/quem-sao-candidatos-a-presidencia-registro-tse.ghtml",
};

const TSE_CHAPAS: CandidateSource = {
  label: "TSE · 12 candidaturas deferidas à Presidência (11/09/2026)",
  url: "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica",
};

const AGENCIA_BRASIL_CLARIANA: CandidateSource = {
  label: "Agência Brasil · perfil e propostas de Clariana Barão (DC)",
  url: "https://agenciabrasil.ebc.com.br/politica/noticia/2026-09/clariana-barao-prioriza-propostas-de-protecao-mulher-e-infancia",
};

const AGENCIA_BRASIL_HERTZ: CandidateSource = {
  label: "Agência Brasil · perfil de Hertz Dias (PSTU)",
  url: "https://agenciabrasil.ebc.com.br/politica/noticia/2026-08/pstu-tem-o-professor-de-historia-hertz-dias-como-presidenciavel",
};

export const CANDIDATES: Candidate[] = [
  {
    id: "lula",
    slug: "lula",
    name: "Luiz Inácio Lula da Silva",
    party: "PT",
    partyFull: "Partido dos Trabalhadores",
    vice: "Geraldo Alckmin",
    viceParty: "PSB",
    color: "#000000",
    photo: "/candidatos/lula.jpg",
    bio: "Metalúrgico de origem, sindicalista e político. Foi presidente da República (2003-2010), eleito de novo em 2022 e disputa a reeleição em 2026. A chapa com Geraldo Alckmin (PSB) repete a eleita em 2022.",
    education: "Formação no movimento sindical metalúrgico do ABC paulista.",
    career: [
      { when: "1969-1975", text: "Diretoria do Sindicato dos Metalúrgicos de São Bernardo e Diadema; presidente a partir de 1975." },
      { when: "Déc. 1970-80", text: "Liderança nas greves metalúrgicas do ABC." },
      { when: "1980", text: "Entre os fundadores do Partido dos Trabalhadores; presidente do partido nos primeiros anos." },
      { when: "1982", text: "Candidato a governador de São Paulo pelo PT." },
      { when: "1983", text: "Participa da fundação da Central Única dos Trabalhadores (CUT)." },
      { when: "1986-1991", text: "Deputado federal constituinte (mandato 1987-1991)." },
      { when: "1989, 1994, 1998", text: "Candidato à Presidência; não eleito nesses ciclos." },
      { when: "2003-2010", text: "Presidente da República por dois mandatos (vice José Alencar)." },
      { when: "2022", text: "Eleito presidente; toma posse em 2023 com Alckmin na vice." },
      { when: "2023-", text: "Em exercício na Presidência da República." },
      { when: "2026", text: "Chapa deferida no TSE para a Presidência (PT e aliados); disputa a reeleição." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "flavio-bolsonaro",
    slug: "flavio-bolsonaro",
    name: "Flávio Bolsonaro",
    party: "PL",
    partyFull: "Partido Liberal",
    vice: "Alfredo Gaspar",
    viceParty: "PL",
    color: "#000000",
    photo: "/candidatos/flavio-bolsonaro.jpg",
    bio: "Senador pelo Rio de Janeiro e ex-deputado estadual. Filho do ex-presidente Jair Bolsonaro. Disputa a Presidência pelo PL com o deputado federal Alfredo Gaspar na vice.",
    education: "Bacharel em Direito (Universidade Cândido Mendes); especializações em políticas públicas e empreendedorismo.",
    career: [
      { when: "Formação", text: "Direito pela Cândido Mendes; especializações em políticas públicas (Iuperj) e empreendedorismo (FGV)." },
      { when: "2002", text: "Eleito deputado estadual pelo Rio de Janeiro; toma posse em 2003." },
      { when: "2003-2007", text: "Primeiro mandato na Alerj; atua em comissões de segurança pública." },
      { when: "2007-2011", text: "Reeleito; segundo mandato de deputado estadual." },
      { when: "2011-2015", text: "Terceiro mandato na Alerj." },
      { when: "2015-2019", text: "Quarto mandato de deputado estadual pelo Rio." },
      { when: "2016", text: "Candidato a prefeito do Rio de Janeiro." },
      { when: "2018", text: "Eleito senador pelo Rio de Janeiro (mandato 2019-2027)." },
      { when: "2019-", text: "Senador da República pelo Rio de Janeiro." },
      { when: "2026", text: "Candidato a presidente pelo PL; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
    relatedCaseSlugs: ["caso-vorcaro-master-turma-kn"],
  },
  {
    id: "ronaldo-caiado",
    slug: "ronaldo-caiado",
    name: "Ronaldo Caiado",
    party: "PSD",
    partyFull: "Partido Social Democrático",
    vice: "Gilberto Kassab",
    viceParty: "PSD",
    color: "#000000",
    photo: "/candidatos/ronaldo-caiado.jpg",
    bio: "Médico e político goiano. Foi senador e governador de Goiás. Já concorreu à Presidência em 1989. Em 2026, disputa a chapa com Gilberto Kassab (PSD), ex-prefeito de São Paulo.",
    education: "Médico (UFRJ); especialização em cirurgia da coluna em Paris; produtor rural.",
    career: [
      { when: "Formação", text: "Medicina e mestrado na UFRJ; especialização em coluna em Paris." },
      { when: "1985", text: "Fundação e liderança da União Democrática Ruralista (UDR)." },
      { when: "1989", text: "Candidato à Presidência da República." },
      { when: "1991-1995", text: "Deputado federal por Goiás (primeiro mandato)." },
      { when: "1994", text: "Candidato a governador de Goiás." },
      { when: "1999-2015", text: "Deputado federal por quatro mandatos consecutivos (1999-2015)." },
      { when: "2015-2019", text: "Senador da República por Goiás; renuncia para assumir o governo estadual." },
      { when: "2019-2022", text: "Governador de Goiás (eleito em 2018 no 1º turno)." },
      { when: "2023-2026", text: "Reeleito governador em 2022; deixa o cargo em 2026 para disputar a Presidência." },
      { when: "2026", text: "Candidato a presidente pelo PSD; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "rui-costa-pimenta",
    slug: "rui-costa-pimenta",
    name: "Rui Costa Pimenta",
    party: "PCO",
    partyFull: "Partido da Causa Operária",
    vice: "Antônio Carlos",
    viceParty: "PCO",
    color: "#000000",
    photo: "/candidatos/rui-costa-pimenta.jpg",
    bio: "Jornalista e dirigente do Partido da Causa Operária. Candidato recorrente da legenda à Presidência. Em 2026, forma chapa com Antônio Carlos (PCO).",
    education: "Jornalista (Faculdade Cásper Líbero).",
    career: [
      { when: "Déc. 1970-80", text: "Militância estudantil e sindical; participa da fundação do PT (1980)." },
      { when: "1985", text: "Diretor da CUT na região da Grande São Paulo." },
      { when: "1992-1995", text: "Ruptura com o PT; organização do Partido da Causa Operária." },
      { when: "1995-", text: "Presidente nacional do PCO; edita o jornal Causa Operária." },
      { when: "2002-2014", text: "Candidato do PCO à Presidência em ciclos anteriores (2002, 2006, 2010, 2014)." },
      { when: "2026", text: "Candidato a presidente pelo PCO; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "samara-martins",
    slug: "samara-martins",
    name: "Samara Martins",
    party: "UP",
    partyFull: "Unidade Popular",
    vice: "Raquel Brício",
    viceParty: "UP",
    color: "#000000",
    photo: "/candidatos/samara-martins.jpg",
    bio: "Dentista e militante da Unidade Popular. Em 2022 foi candidata a vice na chapa de Léo Péricles. Em 2026 disputa a Presidência em chapa 100% feminina, com Raquel Brício na vice.",
    education: "Dentista (Odontologia); atuação citada na rede pública de saúde.",
    career: [
      { when: "Formação", text: "Graduada em Odontologia; militância na Unidade Popular." },
      { when: "UP", text: "Dirigência nacional da Unidade Popular." },
      { when: "2022", text: "Candidata a vice-presidente na chapa da UP com Léo Péricles." },
      { when: "2026", text: "Candidata a presidente pela UP; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "romeu-zema",
    slug: "romeu-zema",
    name: "Romeu Zema",
    party: "Novo",
    partyFull: "Partido Novo",
    vice: "Eduardo Girão",
    viceParty: "Novo",
    color: "#000000",
    photo: "/candidatos/romeu-zema.jpg",
    bio: "Empresário e político. Governou Minas Gerais por dois mandatos. Em 2026 disputa a Presidência pelo Novo com o senador Eduardo Girão na vice.",
    education: "Administração de Empresas (FGV-SP); trajetória no varejo antes da política.",
    career: [
      { when: "Formação", text: "Administração pela Fundação Getulio Vargas (São Paulo)." },
      { when: "1991-", text: "Atuação executiva no Grupo Zema (varejo e negócios da família)." },
      { when: "Até 2016", text: "CEO do Grupo Zema; deixa a função executiva antes da entrada na política." },
      { when: "2018", text: "Estreia eleitoral: candidato a governador de Minas Gerais pelo Novo." },
      { when: "2019-2022", text: "Governador de Minas Gerais (eleito no 2º turno em 2018)." },
      { when: "2022", text: "Reeleito governador de Minas no 1º turno." },
      { when: "2023-2026", text: "Segundo mandato no governo de Minas Gerais." },
      { when: "2026", text: "Candidato a presidente pelo Novo; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "hertz-dias",
    slug: "hertz-dias",
    name: "Hertz Dias",
    party: "PSTU",
    partyFull: "Partido Socialista dos Trabalhadores Unificado",
    vice: "Vanessa Portugal",
    viceParty: "PSTU",
    color: "#000000",
    photo: "/candidatos/hertz-dias.jpg",
    bio: "Professor de história da rede pública no Maranhão, rapper e pesquisador. Natural de São José de Ribamar (MA). Mestre em educação, com pesquisas sobre cultura, juventude, racismo e organização popular. Disputa a Presidência pelo PSTU com Vanessa Portugal na vice.",
    education: "Graduação em História; mestrado em Educação.",
    career: [
      { when: "Formação", text: "Professor de história da rede pública no Maranhão; mestrado em educação." },
      { when: "Militância", text: "Atuação no movimento negro, sindical e na cultura (rap)." },
      { when: "2018", text: "Candidato a vice-presidente na chapa de Vera Lúcia (PSTU)." },
      { when: "2020", text: "Candidato a prefeito de São Luís." },
      { when: "2022", text: "Candidato ao governo do Maranhão." },
      { when: "2026", text: "Candidato a presidente pelo PSTU; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS, AGENCIA_BRASIL_HERTZ],
  },
  {
    id: "edmilson-costa",
    slug: "edmilson-costa",
    name: "Edmilson Costa",
    party: "PCB",
    partyFull: "Partido Comunista Brasileiro",
    vice: "Cleusa Santos",
    viceParty: "PCB",
    color: "#000000",
    photo: "/candidatos/edmilson-costa.jpg",
    bio: "Professor e doutor em economia. Secretário-geral do Partido Comunista Brasileiro. Disputa a Presidência pelo PCB com Cleusa Santos na vice.",
    education: "Comunicação Social (UFMA); doutor em Economia (Unicamp); professor.",
    career: [
      { when: "Déc. 1970", text: "Militância no PCB; formação em Comunicação Social pela UFMA." },
      { when: "Academia", text: "Doutorado em Economia pela Unicamp; professor e pesquisador." },
      { when: "2010", text: "Candidato a vice-presidente na chapa de Ivan Pinheiro (PCB)." },
      { when: "2016-", text: "Secretário-geral do Partido Comunista Brasileiro." },
      { when: "2026", text: "Candidato a presidente pelo PCB; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "renan-santos",
    slug: "renan-santos",
    name: "Renan Santos",
    party: "Missão",
    partyFull: "Missão",
    vice: "Aroldo Medina",
    viceParty: "Missão",
    color: "#000000",
    photo: "/candidatos/renan-santos.jpg",
    bio: "Ativista político e um dos fundadores do Movimento Brasil Livre (MBL). Estreante em eleições majoritárias. Em 2026 disputa a Presidência pelo Missão com Aroldo Medina (militar da reserva) na vice.",
    education: "Cursou Direito na USP (Largo de São Francisco), sem concluir a graduação.",
    career: [
      { when: "Formação", text: "Ingressou em Direito na USP; não concluiu o curso." },
      { when: "2014-", text: "Um dos fundadores e lideranças públicas do Movimento Brasil Livre (MBL)." },
      { when: "2026", text: "Candidato a presidente pelo Missão; chapa deferida no TSE (estreia em majoritária)." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "wilson-grassi",
    slug: "wilson-grassi",
    name: "Wilson Grassi",
    party: "Democrata",
    partyFull: "Democrata",
    vice: "Suêd Haidar",
    viceParty: "Democrata",
    color: "#000000",
    photo: "/candidatos/wilson-grassi.jpg",
    bio: "Veterinário. É o primeiro candidato à Presidência do Democrata (partido criado em 2008, antes como Partido da Mulher Brasileira). A vice é Suêd Haidar, da mesma legenda.",
    education: "Médico veterinário.",
    career: [
      { when: "Formação", text: "Formado em Medicina Veterinária." },
      { when: "2026", text: "Candidato a presidente pelo Democrata; chapa deferida no TSE (estreia da legenda na Presidência)." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
  {
    id: "clariana-barao",
    slug: "clariana-barao",
    name: "Clariana Barão",
    party: "DC",
    partyFull: "Democracia Cristã",
    vice: "Fabiana Torquato",
    viceParty: "DC",
    color: "#000000",
    photo: "/candidatos/clariana-barao-v2.jpg",
    bio: "Advogada de Cuiabá (MT). Formada pelo Centro Universitário de Várzea Grande, com especialização em direito administrativo e gestão pública. Presidiu a Comissão de Solidariedade e Assistência Social da OAB em Várzea Grande e, em 2026, o diretório estadual do DC em Mato Grosso. Disputa a Presidência com Fabiana Torquato na vice. É a primeira vez, desde 1995, que a DC não lança José Maria Eymael à Presidência.",
    education: "Direito (Univag, Várzea Grande/MT); especialização em direito administrativo e gestão pública.",
    career: [
      { when: "Formação", text: "Graduada em Direito pelo Centro Universitário de Várzea Grande; especialização em direito administrativo e gestão pública." },
      { when: "OAB", text: "Presidente da Comissão de Solidariedade e Assistência Social da OAB em Várzea Grande." },
      { when: "2024", text: "Coordenou grupo de voluntários em auxílio às vítimas das enchentes no Rio Grande do Sul." },
      { when: "2026", text: "Presidente do diretório estadual do DC em Mato Grosso; candidata a presidente; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS, AGENCIA_BRASIL_CLARIANA],
  },
  {
    id: "augusto-cury",
    slug: "augusto-cury",
    name: "Augusto Cury",
    party: "Avante",
    partyFull: "Avante",
    vice: "Júlio Delgado",
    viceParty: "Avante",
    color: "#000000",
    photo: "/candidatos/augusto-cury.jpg",
    bio: "Psiquiatra e escritor, conhecido por livros de autoajuda e temas de saúde mental. Disputa a Presidência pelo Avante com o ex-deputado federal Júlio Delgado na vice.",
    education: "Médico psiquiatra.",
    career: [
      { when: "Formação", text: "Formação em Medicina; atuação como psiquiatra." },
      { when: "Carreira", text: "Autor de livros de grande circulação sobre saúde mental e comportamento." },
      { when: "Papel público", text: "Palestrante e figura pública ligada a temas de saúde mental." },
      { when: "2026", text: "Candidato a presidente pelo Avante; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
  },
];

export function getCandidateBySlug(slug: string) {
  return CANDIDATES.find((c) => c.slug === slug);
}

export function getCandidateById(id: string) {
  return CANDIDATES.find((c) => c.id === id);
}

/** Ordem alfabética (pt-BR): padrão imparcial nas listagens. */
export function candidatesAlphabetical(order: "az" | "za" = "az") {
  const list = [...CANDIDATES].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );
  if (order === "za") list.reverse();
  return list;
}
