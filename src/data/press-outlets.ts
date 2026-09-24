/**
 * Veículos permitidos para cobertura de imprensa no Lupa do Brasil.
 * Só links rastreáveis dessas fontes, sem inventar fatos.
 * Lista ampla de propósito: cruzar versões, não privilegiar um campo.
 */
export const PRESS_OUTLETS = [
  {
    id: "g1",
    label: "G1",
    domain: "g1.globo.com",
    siteQuery: "site:g1.globo.com",
    homeUrl: "https://g1.globo.com",
  },
  {
    id: "folha",
    label: "Folha de S.Paulo",
    domain: "folha.uol.com.br",
    siteQuery: "site:folha.uol.com.br",
    homeUrl: "https://www.folha.uol.com.br",
  },
  {
    id: "estadao",
    label: "Estadão",
    domain: "estadao.com.br",
    siteQuery: "site:estadao.com.br",
    homeUrl: "https://www.estadao.com.br",
  },
  {
    id: "oglobo",
    label: "O Globo",
    domain: "oglobo.globo.com",
    siteQuery: "site:oglobo.globo.com",
    homeUrl: "https://oglobo.globo.com",
  },
  {
    id: "uol",
    label: "UOL",
    domain: "uol.com.br",
    siteQuery: "site:uol.com.br",
    homeUrl: "https://www.uol.com.br",
  },
  {
    id: "metropoles",
    label: "Metrópoles",
    domain: "metropoles.com",
    siteQuery: "site:metropoles.com",
    homeUrl: "https://www.metropoles.com",
  },
  {
    id: "piaui",
    label: "revista piauí",
    domain: "piaui.uol.com.br",
    siteQuery: "site:piaui.uol.com.br",
    homeUrl: "https://piaui.uol.com.br",
  },
  {
    id: "valor",
    label: "Valor Econômico",
    domain: "valor.globo.com",
    siteQuery: "site:valor.globo.com",
    homeUrl: "https://valor.globo.com",
  },
  {
    id: "infomoney",
    label: "InfoMoney",
    domain: "infomoney.com.br",
    siteQuery: "site:infomoney.com.br",
    homeUrl: "https://www.infomoney.com.br",
  },
  {
    id: "cnn-brasil",
    label: "CNN Brasil",
    domain: "cnnbrasil.com.br",
    siteQuery: "site:cnnbrasil.com.br",
    homeUrl: "https://www.cnnbrasil.com.br",
  },
  {
    id: "poder360",
    label: "Poder360",
    domain: "poder360.com.br",
    siteQuery: "site:poder360.com.br",
    homeUrl: "https://www.poder360.com.br",
  },
  {
    id: "bbc-brasil",
    label: "BBC News Brasil",
    domain: "bbc.com",
    siteQuery: "site:bbc.com/portuguese",
    homeUrl: "https://www.bbc.com/portuguese",
  },
  {
    id: "agencia-publica",
    label: "Agência Pública",
    domain: "apublica.org",
    siteQuery: "site:apublica.org",
    homeUrl: "https://apublica.org",
  },
  {
    id: "nexo",
    label: "Nexo Jornal",
    domain: "nexojornal.com.br",
    siteQuery: "site:nexojornal.com.br",
    homeUrl: "https://www.nexojornal.com.br",
  },
  {
    id: "brasil-de-fato",
    label: "Brasil de Fato",
    domain: "brasildefato.com.br",
    siteQuery: "site:brasildefato.com.br",
    homeUrl: "https://www.brasildefato.com.br",
  },
  {
    id: "revista-forum",
    label: "Revista Fórum",
    domain: "revistaforum.com.br",
    siteQuery: "site:revistaforum.com.br",
    homeUrl: "https://revistaforum.com.br",
  },
  {
    id: "brasil-247",
    label: "Brasil 247",
    domain: "brasil247.com",
    siteQuery: "site:brasil247.com",
    homeUrl: "https://www.brasil247.com",
  },
  {
    id: "agencia-brasil",
    label: "Agência Brasil",
    domain: "agenciabrasil.ebc.com.br",
    siteQuery: "site:agenciabrasil.ebc.com.br",
    homeUrl: "https://agenciabrasil.ebc.com.br",
  },
  {
    id: "agencia-senado",
    label: "Agência Senado",
    domain: "senado.leg.br",
    siteQuery: "site:senado.leg.br",
    homeUrl: "https://www12.senado.leg.br/noticias",
  },
  {
    id: "camara-noticias",
    label: "Agência Câmara",
    domain: "camara.leg.br",
    siteQuery: "site:camara.leg.br",
    homeUrl: "https://www.camara.leg.br/noticias",
  },
] as const;

export type PressOutletId = (typeof PRESS_OUTLETS)[number]["id"];

export function matchOutlet(
  sourceName: string,
  link: string,
): (typeof PRESS_OUTLETS)[number] | null {
  const hay = `${sourceName} ${link}`.toLowerCase();
  for (const o of PRESS_OUTLETS) {
    const domainBare = o.domain.replace(/^www\./, "");
    if (hay.includes(domainBare)) return o;
    if (hay.includes(o.label.toLowerCase())) return o;
  }
  // Apelidos comuns no RSS do Google News
  if (hay.includes("folha")) return PRESS_OUTLETS.find((o) => o.id === "folha")!;
  if (/\bg1\b/.test(hay)) return PRESS_OUTLETS.find((o) => o.id === "g1")!;
  if (hay.includes("brasil de fato"))
    return PRESS_OUTLETS.find((o) => o.id === "brasil-de-fato")!;
  if (hay.includes("estadão") || hay.includes("estadao") || hay.includes("o estado de s"))
    return PRESS_OUTLETS.find((o) => o.id === "estadao")!;
  if (hay.includes("o globo")) return PRESS_OUTLETS.find((o) => o.id === "oglobo")!;
  if (hay.includes("metrópole") || hay.includes("metropole"))
    return PRESS_OUTLETS.find((o) => o.id === "metropoles")!;
  if (hay.includes("piauí") || hay.includes("piaui"))
    return PRESS_OUTLETS.find((o) => o.id === "piaui")!;
  if (hay.includes("valor")) return PRESS_OUTLETS.find((o) => o.id === "valor")!;
  if (hay.includes("infomoney") || hay.includes("info money"))
    return PRESS_OUTLETS.find((o) => o.id === "infomoney")!;
  if (hay.includes("cnn")) return PRESS_OUTLETS.find((o) => o.id === "cnn-brasil")!;
  if (hay.includes("poder360") || hay.includes("poder 360"))
    return PRESS_OUTLETS.find((o) => o.id === "poder360")!;
  if (hay.includes("bbc")) return PRESS_OUTLETS.find((o) => o.id === "bbc-brasil")!;
  if (hay.includes("pública") || hay.includes("publica") || hay.includes("apublica"))
    return PRESS_OUTLETS.find((o) => o.id === "agencia-publica")!;
  if (hay.includes("nexo")) return PRESS_OUTLETS.find((o) => o.id === "nexo")!;
  if (hay.includes("fórum") || hay.includes("forum"))
    return PRESS_OUTLETS.find((o) => o.id === "revista-forum")!;
  if (hay.includes("brasil 247") || hay.includes("brasil247"))
    return PRESS_OUTLETS.find((o) => o.id === "brasil-247")!;
  if (hay.includes("agência brasil") || hay.includes("agencia brasil") || hay.includes("ebc"))
    return PRESS_OUTLETS.find((o) => o.id === "agencia-brasil")!;
  if (hay.includes("senado"))
    return PRESS_OUTLETS.find((o) => o.id === "agencia-senado")!;
  if (hay.includes("câmara") || hay.includes("camara"))
    return PRESS_OUTLETS.find((o) => o.id === "camara-noticias")!;
  if (hay.includes("uol")) return PRESS_OUTLETS.find((o) => o.id === "uol")!;
  return null;
}

/** Termos de investigação / justiça (selo “Investigação”). */
export const PRESS_WATCH_TERMS = [
  "investiga",
  "investigado",
  "investigação",
  "investigacao",
  "corrupção",
  "corrupcao",
  "denúncia",
  "denuncia",
  "indiciado",
  "indiciamento",
  "lavagem de dinheiro",
  "propina",
  "peculato",
  "improbidade",
  "inelegível",
  "inelegibilidade",
  "prisão",
  "preso",
  "mandado de busca",
  "coaf",
  "precatório",
  "precatorio",
  "operação",
  "delação",
  "cpi",
] as const;

/**
 * Sinais de notícia que pesam no voto: pesquisa, polêmica, ato com repercussão.
 * Usado para ranquear e filtrar o que entra na ficha.
 */
export const PRESS_SALIENT_TERMS = [
  // pesquisas / corrida
  "pesquisa",
  "intenção de voto",
  "intenções de voto",
  "segundo turno",
  "2º turno",
  "2o turno",
  "primeiro turno",
  "1º turno",
  "1o turno",
  "lidera",
  "líder",
  "disputa",
  "datafolha",
  "ipec",
  "quaest",
  "atlas",
  "xp/",
  "pontos percentuais",
  "%",
  // polêmica / repercussão
  "polêmica",
  "polemica",
  "escândalo",
  "escandalo",
  "acusado",
  "acusação",
  "acusacao",
  "repercute",
  "repercussão",
  "repercussao",
  "controvérsia",
  "controversia",
  "crise",
  "vazamento",
  "áudio",
  "audio",
  "vídeo",
  "video",
  "fake news",
  "desinformação",
  "desinformacao",
  // ato político de peso
  "debate",
  "proposta",
  "promete",
  "anuncia",
  "rompe",
  "aliança",
  "alianca",
  "vice",
  "registro",
  "tse",
  "stf",
  "pf ",
  "polícia federal",
  "policia federal",
  "impeachment",
  "cassação",
  "cassacao",
  "suspenso",
  "multa",
  "condenado",
  "absolvido",
] as const;

/** Rotina / fluff que não entra na ficha (se não tiver sinal forte). */
export const PRESS_NOISE_TERMS = [
  "veja fotos",
  "bastidores",
  "ao vivo",
  "assista",
  "lança livro",
  "lançamento de livro",
  "sessão de autógrafos",
  "sessao de autografos",
  "posando",
  "look ",
  "instagram",
  "tiktok",
  "stories",
  "agenda desta",
  "horóscopo",
  "horoscopo",
  "curiosidade",
  "relembre",
  "memes",
  "artistas",
  "celebridades",
  "apoiadores famosos",
  "reto final do 1",
] as const;
