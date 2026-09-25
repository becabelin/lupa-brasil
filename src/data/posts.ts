/**
 * Notícias curtas do Lupa (blog).
 * Publicação humana. Texto na voz do site: fato direto, fontes no rodapé.
 * Caso imersivo continua em explainers (kind "caso"), só quando for dossiê grande.
 */

export type PostSource = {
  label: string;
  url: string;
};

export type PostCover = {
  src: string;
  alt: string;
  credit: string;
  objectPosition?: string;
};

export type PostTag =
  | "politica"
  | "corrupcao"
  | "eleicoes-2026"
  | "stf"
  | "tse"
  | "congresso"
  | "pf"
  | "coaf"
  | "justica"
  | "instituições";

export type Post = {
  slug: string;
  title: string;
  lede: string;
  /** Parágrafos do corpo (já na voz Lupa). */
  body: string[];
  publishedAt: string;
  updatedAt?: string;
  sources: PostSource[];
  tags: PostTag[];
  /** Capa P&B obrigatória (banco oficial + crédito). */
  cover: PostCover;
  relatedCandidateIds?: string[];
  relatedExplainerSlugs?: string[];
};

export const POSTS: Post[] = [
  {
    slug: "tse-12-candidaturas-presidencia-2026",
    title: "TSE confirma 12 chapas na disputa pela Presidência",
    lede: "Em setembro de 2026, o Tribunal Superior Eleitoral registrava doze candidaturas deferidas ao Planalto. A lista oficial é a base do que o Lupa cobre na urna.",
    body: [
      "O Tribunal Superior Eleitoral informou, em setembro de 2026, que as Eleições daquele ciclo tinham 12 candidaturas deferidas à Presidência da República.",
      "Cada chapa reúne titular e vice, com partido ou coligação registrados na Justiça Eleitoral. O deferimento significa que a documentação exigida foi aceita e a chapa pode aparecer na urna.",
      "No Lupa, a lista de chapas, vices e status de registro segue o TSE. Os planos de governo vêm dos Dados Abertos do mesmo tribunal. Quando a Corte atualiza a lista, o site atualiza junto.",
    ],
    publishedAt: "2026-09-11",
    sources: [
      {
        label:
          "TSE · Eleições 2026 têm 12 candidaturas na disputa pela Presidência (11/09/2026)",
        url: "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica",
      },
    ],
    tags: ["politica", "eleicoes-2026", "tse"],
    cover: {
      src: "/noticias/congresso.jpg",
      alt: "Fachada do Congresso Nacional",
      credit:
        "Mario Roberto Duran Ortiz / Wikimedia Commons (CC BY-SA 4.0) · P&B no Lupa",
      objectPosition: "center center",
    },
  },
  {
    slug: "pstu-lanca-hertz-dias-presidencia-2026",
    title: "PSTU confirma Hertz Dias à Presidência e Vanessa Portugal na vice",
    lede: "O partido oficializou a chapa em convenção. Hertz Dias é professor de história no Maranhão; Vanessa Portugal, também professora, completa a dobra.",
    body: [
      "O Partido Socialista dos Trabalhadores Unificado confirmou Hertz Dias como candidato à Presidência e Vanessa Portugal como vice.",
      "Hertz da Conceição Dias é professor de história da rede pública no Maranhão, natural de São José de Ribamar. Já foi vice na chapa do PSTU em 2018, concorreu a prefeito de São Luís em 2020 e ao governo do Maranhão em 2022.",
      "A chapa consta entre as candidaturas deferidas pelo TSE em 2026. O plano oficial do partido está nos Dados Abertos do tribunal e entra na comparação do Lupa como as demais chapas.",
    ],
    publishedAt: "2026-08-17",
    sources: [
      {
        label: "Agência Brasil · PSTU tem o professor de história Hertz Dias como presidenciável",
        url: "https://agenciabrasil.ebc.com.br/politica/noticia/2026-08/pstu-tem-o-professor-de-historia-hertz-dias-como-presidenciavel",
      },
      {
        label:
          "TSE · 12 candidaturas deferidas à Presidência (11/09/2026)",
        url: "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica",
      },
    ],
    tags: ["politica", "eleicoes-2026"],
    relatedCandidateIds: ["hertz-dias"],
    cover: {
      src: "/candidatos/hertz-dias.jpg",
      alt: "Hertz Dias, candidato à Presidência pelo PSTU",
      credit: "Matheus Soares / PSTU · Divulgação (via Agência Brasil)",
      objectPosition: "center top",
    },
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Recência: updatedAt se existir, senão publishedAt. */
function postRecency(p: Post) {
  return p.updatedAt ?? p.publishedAt;
}

/** Sempre mais recente → mais antiga. */
export function postsNewestFirst(): Post[] {
  return [...POSTS].sort((a, b) => {
    const byDate = postRecency(b).localeCompare(postRecency(a));
    if (byDate !== 0) return byDate;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

export function recentPosts(limit = 6): Post[] {
  return postsNewestFirst().slice(0, limit);
}
