import {
  matchOutlet,
  PRESS_NOISE_TERMS,
  PRESS_OUTLETS,
  PRESS_SALIENT_TERMS,
  PRESS_WATCH_TERMS,
  type PressOutletId,
} from "@/data/press-outlets";

export type PressItem = {
  id: string;
  candidateId: string;
  title: string;
  url: string;
  outletId: PressOutletId;
  outletLabel: string;
  publishedAt: string | null;
  snippet: string;
  /**
   * Resumo curto do que a manchete diz, atribuído ao veículo.
   * Não é veredicto.
   */
  lede?: string;
  /** Heurística por palavras no título; não é veredicto. */
  watchlist: boolean;
  fetchedAt: string;
};

export type PressStore = {
  updatedAt: string;
  items: PressItem[];
};

function stripHtml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSnippet(description: string, title: string) {
  const text = stripHtml(description);
  if (!text) return "";
  if (/^https?:\/\//i.test(text) || /news\.google\.com/i.test(text)) return "";
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  if (
    norm(text) === norm(title) ||
    norm(text).startsWith(norm(title).slice(0, 40))
  ) {
    return "";
  }
  return text.slice(0, 220);
}

function tagText(block: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function sourceAttrs(block: string) {
  const m = block.match(
    /<source[^>]*url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/source>/i,
  );
  if (!m) {
    const nameOnly = tagText(block, "source");
    return { url: "", name: nameOnly };
  }
  return { url: m[1], name: stripHtml(m[2]) };
}

function parseRssItems(xml: string) {
  const chunks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  return chunks.map((c) => {
    const block = c[1];
    const source = sourceAttrs(block);
    return {
      title: tagText(block, "title"),
      link:
        tagText(block, "link") ||
        block.match(/<link>([^<]+)<\/link>/i)?.[1]?.trim() ||
        "",
      pubDate: tagText(block, "pubDate"),
      description: tagText(block, "description"),
      sourceUrl: source.url,
      sourceName: source.name,
    };
  });
}

function foldHay(title: string, snippet: string) {
  return `${title} ${snippet}`
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function isWatchlist(title: string, snippet: string) {
  const hay = foldHay(title, snippet);
  return PRESS_WATCH_TERMS.some((t) => hay.includes(t.toLowerCase()));
}

function isNoise(title: string, snippet: string) {
  const hay = foldHay(title, snippet);
  return PRESS_NOISE_TERMS.some((t) => hay.includes(t.toLowerCase()));
}

/**
 * Quanto a manchete parece importar para o eleitor.
 * Pesquisa, polêmica, investigação e ato com repercussão sobem.
 */
export function pressSalience(title: string, snippet = ""): number {
  const hay = foldHay(title, snippet);
  let score = 0;

  if (isWatchlist(title, snippet)) score += 12;
  for (const t of PRESS_SALIENT_TERMS) {
    if (hay.includes(t.toLowerCase())) score += 3;
  }
  if (/\d{1,2}\s*%/.test(hay) || /\d{1,2}\s*pontos/.test(hay)) score += 8;
  if (/\b(datafolha|ipec|quaest|atlas|xp)\b/.test(hay)) score += 6;
  if (isNoise(title, snippet) && score < 10) score -= 10;

  return score;
}

function siteFilter() {
  return PRESS_OUTLETS.map((o) => o.siteQuery).join(" OR ");
}

function buildQueries(candidateName: string) {
  const name = `"${candidateName}"`;
  const sites = `(${siteFilter()})`;
  return [
    `${name} (pesquisa OR "intenção de voto" OR "segundo turno" OR Datafolha OR Ipec OR Quaest OR Atlas) ${sites}`,
    `${name} (investigação OR investigado OR corrupção OR denúncia OR polêmica OR escândalo OR STF OR TSE OR PF OR Coaf) ${sites}`,
    `${name} (debate OR proposta OR anuncia OR registro OR inelegível) ${sites}`,
  ];
}

async function fetchRss(query: string): Promise<string> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "LupaDoBrasil/1.0 (educational; press aggregation; +https://localhost)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) {
    throw new Error(`RSS ${res.status} para query: ${query.slice(0, 80)}`);
  }
  return res.text();
}

function nameTokens(candidateName: string) {
  const stop = new Set([
    "da",
    "de",
    "do",
    "das",
    "dos",
    "e",
    "luiz",
    "inacio",
    "jose",
    "maria",
  ]);
  const weak = new Set([
    "silva",
    "santos",
    "costa",
    "souza",
    "sousa",
    "oliveira",
    "ferreira",
    "almeida",
    "pereira",
    "rodrigues",
    "alves",
    "ribeiro",
    "carvalho",
    "gomes",
    "martins",
    "araujo",
    "melo",
    "barbosa",
    "dias",
  ]);
  const all = candidateName
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stop.has(t));
  const strong = all.filter((t) => !weak.has(t));
  return strong.length > 0 ? strong : all;
}

function titleMentionsCandidate(title: string, candidateName: string) {
  const hay = title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  const tokens = nameTokens(candidateName);
  return tokens.some((t) => hay.includes(t));
}

/** Só o que pesa na urna: pesquisa, polêmica, investigação, ato com repercussão. */
export function selectPressForDisplay(
  items: PressItem[],
  limit = 8,
): PressItem[] {
  const scored = items
    .map((item) => ({
      item,
      score: pressSalience(item.title, item.snippet || item.lede || ""),
    }))
    .filter(({ item, score }) => score >= 8 || item.watchlist)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const da = a.item.publishedAt ? Date.parse(a.item.publishedAt) : 0;
      const db = b.item.publishedAt ? Date.parse(b.item.publishedAt) : 0;
      return db - da;
    });

  return scored.slice(0, limit).map((s) => s.item);
}

export async function fetchPressForCandidate(params: {
  candidateId: string;
  candidateName: string;
  limit?: number;
}): Promise<PressItem[]> {
  const limit = params.limit ?? 10;
  const fetchedAt = new Date().toISOString();
  const byUrl = new Map<string, PressItem>();

  for (const query of buildQueries(params.candidateName)) {
    let xml = "";
    try {
      xml = await fetchRss(query);
    } catch (err) {
      console.warn("Falha RSS:", err instanceof Error ? err.message : err);
      continue;
    }
    for (const raw of parseRssItems(xml)) {
      if (!raw.title || !raw.link) continue;
      const outlet = matchOutlet(raw.sourceName, raw.sourceUrl || raw.link);
      if (!outlet) continue;

      const title =
        raw.title.replace(/\s[-–—]\s*[^-–—]+$/, "").trim() || raw.title;
      if (!titleMentionsCandidate(title, params.candidateName)) continue;

      const snippet = cleanSnippet(raw.description, title);
      if (isNoise(title, snippet) && pressSalience(title, snippet) < 8) {
        continue;
      }

      let publishedAt: string | null = null;
      if (raw.pubDate) {
        const d = new Date(raw.pubDate);
        if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
      }

      const item: PressItem = {
        id: `${params.candidateId}-${Buffer.from(raw.link)
          .toString("base64url")
          .slice(0, 24)}`,
        candidateId: params.candidateId,
        title,
        url: raw.link,
        outletId: outlet.id,
        outletLabel: outlet.label,
        publishedAt,
        snippet,
        lede: fallbackPressLede(outlet.label, title),
        watchlist: isWatchlist(title, snippet),
        fetchedAt,
      };
      const prev = byUrl.get(raw.link);
      const nextScore = pressSalience(item.title, item.snippet);
      const prevScore = prev ? pressSalience(prev.title, prev.snippet) : -1;
      if (
        !prev ||
        nextScore > prevScore ||
        (item.watchlist && !prev.watchlist)
      ) {
        byUrl.set(raw.link, item);
      }
    }
  }

  const ranked = [...byUrl.values()].sort((a, b) => {
    const sa = pressSalience(a.title, a.snippet);
    const sb = pressSalience(b.title, b.snippet);
    if (sb !== sa) return sb - sa;
    const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return db - da;
  });

  const items = selectPressForDisplay(ranked, limit);
  return enrichPressLedes(items, params.candidateName);
}

/** Lede mínimo quando a IA não está disponível. */
export function fallbackPressLede(outletLabel: string, title: string) {
  const t = title.trim().replace(/\.$/, "");
  return `Segundo ${outletLabel}, ${t.charAt(0).toLowerCase()}${t.slice(1)}.`;
}

/**
 * Resumo curto a partir da manchete. Sem inventar o corpo da matéria.
 */
export async function enrichPressLedes(
  items: PressItem[],
  candidateName: string,
): Promise<PressItem[]> {
  if (items.length === 0) return items;
  if (!process.env.OPENAI_API_KEY) {
    return items.map((item) => ({
      ...item,
      lede: item.lede?.trim() || fallbackPressLede(item.outletLabel, item.title),
    }));
  }

  const { generateObject } = await import("ai");
  const { openai } = await import("@ai-sdk/openai");
  const { z } = await import("zod");

  const model = openai(process.env.AI_MODEL || "gpt-4o-mini");

  const catalog = items
    .map(
      (it, i) =>
        `${i + 1}. veículo=${it.outletLabel}\n   manchete=${it.title}${
          it.snippet ? `\n   nota_rss=${it.snippet.slice(0, 160)}` : ""
        }`,
    )
    .join("\n\n");

  try {
    const { object } = await generateObject({
      model,
      schema: z.object({
        ledes: z
          .array(z.string())
          .describe(
            `Exatamente ${items.length} textos, na mesma ordem dos itens numerados.`,
          ),
      }),
      temperature: 0,
      system: `Você resume manchetes para o Lupa do Brasil.

PAPEL
- Para cada manchete, 1 ou 2 frases concretas (número, fato, quem falou).
- Atribua ao veículo ("Segundo o g1…", "A Folha informa que…").
- Priorize o que pesa no voto: pesquisa com %, denúncia, polêmica, decisão judicial, proposta de impacto.
- NÃO diga se a denúncia é verdadeira. NÃO opine. NÃO endosse.
- NÃO invente além da manchete (e nota_rss, se houver).
- Sem travessão (—). Português brasileiro.
- Candidato: ${candidateName}.
- Mesmo tamanho e ordem da lista de entrada.`,
      prompt: `Escreva ${items.length} resumos, um por item, na ordem:

${catalog}`,
    });

    const ledes = object.ledes;
    return items.map((item, i) => {
      const lede = (ledes[i] || "").trim();
      return {
        ...item,
        lede:
          lede.length > 12
            ? lede
            : fallbackPressLede(item.outletLabel, item.title),
      };
    });
  } catch (err) {
    console.warn(
      "Falha ao gerar ledes de imprensa:",
      err instanceof Error ? err.message : err,
    );
    return items.map((item) => ({
      ...item,
      lede: item.lede?.trim() || fallbackPressLede(item.outletLabel, item.title),
    }));
  }
}
