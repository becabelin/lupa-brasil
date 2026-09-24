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
  /** Path under /public, e.g. /candidatos/lula.png */
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
    photo: "/candidatos/lula.png",
    bio: "Metalúrgico de origem, sindicalista e político. Foi presidente da República (2003-2010), eleito de novo em 2022 e disputa a reeleição em 2026. A chapa com Geraldo Alckmin (PSB) repete a eleita em 2022.",
    education: "Formação no movimento sindical metalúrgico do ABC paulista.",
    career: [
      { when: "Déc. 1970-80", text: "Liderança sindical no ABC; papel central nas greves metalúrgicas." },
      { when: "1980", text: "Entre os fundadores do Partido dos Trabalhadores." },
      { when: "1986-1994", text: "Deputado federal constituinte e mandato seguinte." },
      { when: "2003-2010", text: "Presidente da República por dois mandatos." },
      { when: "2022", text: "Eleito presidente; toma posse em 2023 com Alckmin na vice." },
      { when: "2026", text: "Chapa deferida no TSE para a Presidência (PT e aliados)." },
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
    photo: "/candidatos/flavio-bolsonaro.png",
    bio: "Senador pelo Rio de Janeiro e ex-deputado estadual. Filho do ex-presidente Jair Bolsonaro. Disputa a Presidência pelo PL com o deputado federal Alfredo Gaspar na vice.",
    education: "Formação em Direito.",
    career: [
      { when: "2011-2018", text: "Deputado estadual pelo Rio de Janeiro." },
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
    photo: "/candidatos/ronaldo-caiado.png",
    bio: "Médico e político goiano. Foi senador e governador de Goiás. Já concorreu à Presidência em 1989. Em 2026, disputa a chapa com Gilberto Kassab (PSD), ex-prefeito de São Paulo.",
    education: "Médico.",
    career: [
      { when: "1989", text: "Candidato à Presidência da República." },
      { when: "Senado", text: "Ex-senador da República." },
      { when: "2019-2026", text: "Governador de Goiás (dois mandatos)." },
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
    photo: "/candidatos/rui-costa-pimenta.png",
    bio: "Jornalista e dirigente do Partido da Causa Operária. Candidato recorrente da legenda à Presidência. Em 2026, forma chapa com Antônio Carlos (PCO).",
    education: "Jornalista.",
    career: [
      { when: "PCO", text: "Dirigente nacional do Partido da Causa Operária." },
      { when: "Eleições", text: "Candidato do PCO à Presidência em ciclos anteriores." },
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
    photo: "/candidatos/samara-martins-2.png",
    bio: "Dentista e militante da Unidade Popular. Em 2022 foi candidata a vice na chapa de Léo Péricles. Em 2026 disputa a Presidência em chapa 100% feminina, com Raquel Brício na vice.",
    education: "Dentista.",
    career: [
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
    photo: "/candidatos/romeu-zema.png",
    bio: "Empresário e político. Governou Minas Gerais por dois mandatos. Em 2026 disputa a Presidência pelo Novo com o senador Eduardo Girão na vice.",
    education: "Formação empresarial; trajetória no varejo antes da política.",
    career: [
      { when: "2019-2026", text: "Governador de Minas Gerais (dois mandatos)." },
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
    bio: "Professor da rede pública no Maranhão, rapper e ativista do movimento negro. Candidato do PSTU à Presidência, com Vanessa Portugal (também professora e militante) na vice.",
    education: "Professor da rede pública.",
    career: [
      { when: "Militância", text: "Atuação no movimento negro e na cultura (rap)." },
      { when: "2026", text: "Candidato a presidente pelo PSTU; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
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
    photo: "/candidatos/edmilson-costa.png",
    bio: "Professor e doutor em economia. Secretário-geral do Partido Comunista Brasileiro. Disputa a Presidência pelo PCB com Cleusa Santos na vice.",
    education: "Doutor em economia; professor.",
    career: [
      { when: "PCB", text: "Secretário-geral do Partido Comunista Brasileiro." },
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
    career: [
      { when: "2014-", text: "Atuação pública ligada ao Movimento Brasil Livre." },
      { when: "2026", text: "Candidato a presidente pelo Missão; chapa deferida no TSE." },
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
    photo: "/candidatos/wilson-grassi.png",
    bio: "Veterinário. É o primeiro candidato à Presidência do Democrata (partido criado em 2008, antes como Partido da Mulher Brasileira). A vice é Suêd Haidar, da mesma legenda.",
    education: "Veterinário.",
    career: [
      { when: "2026", text: "Candidato a presidente pelo Democrata; chapa deferida no TSE." },
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
    photo: "/candidatos/clariana-barao.png",
    bio: "Advogada. Disputa a Presidência pela Democracia Cristã com Fabiana Torquato na vice. É a primeira vez, desde a criação do partido em 1995, que a DC não lança José Maria Eymael à Presidência.",
    education: "Advogada.",
    career: [
      { when: "2026", text: "Candidata a presidente pela DC; chapa deferida no TSE." },
    ],
    bioSources: [G1_QUEM_SAO, TSE_CHAPAS],
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
    photo: "/candidatos/augusto-cury.png",
    bio: "Psiquiatra e escritor, conhecido por livros de autoajuda e temas de saúde mental. Disputa a Presidência pelo Avante com o ex-deputado federal Júlio Delgado na vice.",
    education: "Psiquiatra.",
    career: [
      { when: "Carreira", text: "Atuação como psiquiatra e autor de livros de grande circulação." },
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
