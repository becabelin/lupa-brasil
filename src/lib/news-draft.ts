/**
 * Rascunho de notícia Lupa a partir de URLs allowlist.
 * Não publica. Grava JSON em data/drafts/noticias/.
 */

import { matchOutlet, PRESS_NOISE_TERMS } from "@/data/press-outlets";

export type NewsDraft = {
  slug: string;
  title: string;
  lede: string;
  body: string[];
  sources: { label: string; url: string }[];
  tags: string[];
  topicOk: boolean;
  topicNote: string;
  createdAt: string;
  status: "draft";
  /**
   * Preencher na publicação (obrigatório em Post).
   * Banco oficial + crédito. Sem capa, não publica.
   */
  cover?: {
    src: string;
    alt: string;
    credit: string;
    objectPosition?: string;
  };
};

const OFFICIAL_HOSTS = [
  "tse.jus.br",
  "stf.jus.br",
  "gov.br",
  "planalto.gov.br",
  "agenciabrasil.ebc.com.br",
  "senado.leg.br",
  "camara.leg.br",
  "pf.gov.br",
  "coaf.gov.br",
];

const TOPIC_OK = [
  "politica",
  "política",
  "corrup",
  "eleic",
  "eleiç",
  "congresso",
  "senado",
  "camara",
  "câmara",
  "stf",
  "tse",
  "pf ",
  "policia federal",
  "polícia federal",
  "coaf",
  "ministro",
  "presidente",
  "candidato",
  "candidata",
  "chapa",
  "partido",
  "investig",
  "operacao",
  "operação",
  "lavagem",
  "propina",
  "impeachment",
  "pec ",
  "pl ",
  "mpf",
  "justica",
  "justiça",
  "tribunal",
  "urna",
  "deferid",
];

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function isAllowedNewsUrl(url: string): {
  ok: boolean;
  label: string;
  reason?: string;
} {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return { ok: false, label: "", reason: "URL inválida" };
  }

  const outlet = matchOutlet("", url);
  if (outlet) {
    return { ok: true, label: outlet.label };
  }

  if (OFFICIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return { ok: true, label: host };
  }

  return {
    ok: false,
    label: host,
    reason: "Domínio fora da allowlist (press-outlets + órgãos oficiais)",
  };
}

export function passesPoliticalTopic(text: string): {
  ok: boolean;
  note: string;
} {
  const hay = fold(text);
  if (PRESS_NOISE_TERMS.some((t) => hay.includes(fold(t)))) {
    return { ok: false, note: "Caiu no filtro de ruído (lifestyle/curiosidade)." };
  }
  if (
    /\b(pesquisa|intencao|inten[cç]ao de voto|datafolha|ipec|quaest)\b/.test(
      hay,
    ) &&
    !/\b(corrup|investig|stf|tse|pf)\b/.test(hay)
  ) {
    return {
      ok: false,
      note: "Pesquisa eleitoral sozinha não entra como notícia Lupa.",
    };
  }
  if (TOPIC_OK.some((t) => hay.includes(fold(t)))) {
    return { ok: true, note: "Tema político/institucional ok." };
  }
  return {
    ok: false,
    note: "Não identificou política, corrupção ou instituições no texto.",
  };
}

export function slugifyTitle(title: string) {
  return fold(title)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function fetchPageText(url: string): Promise<{
  title: string;
  text: string;
}> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LupaBrasil/1.0; +https://lupadobrasil.com.br)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} em ${url}`);
  }
  const html = await res.text();
  const title =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ||
    html.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim() ||
    "Sem título";
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
  return { title: title.replace(/\s+/g, " ").trim(), text: cleaned };
}

export async function generateNewsDraft(params: {
  urls: string[];
}): Promise<NewsDraft> {
  const sources: { label: string; url: string }[] = [];
  const chunks: { title: string; text: string; label: string; url: string }[] =
    [];

  for (const url of params.urls) {
    const allow = isAllowedNewsUrl(url);
    if (!allow.ok) {
      throw new Error(`${url}: ${allow.reason}`);
    }
    const page = await fetchPageText(url);
    sources.push({ label: `${allow.label} · ${page.title}`, url });
    chunks.push({ ...page, label: allow.label, url });
  }

  const combined = chunks
    .map((c) => `FONTE ${c.label}\nTÍTULO ${c.title}\nTEXTO ${c.text.slice(0, 2500)}`)
    .join("\n\n---\n\n");

  const topic = passesPoliticalTopic(
    chunks.map((c) => `${c.title} ${c.text}`).join(" "),
  );

  let title = chunks[0]?.title ?? "Rascunho";
  let lede = "";
  let body: string[] = [];

  if (process.env.OPENAI_API_KEY) {
    const { generateObject } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");
    const { z } = await import("zod");
    const model = openai(process.env.AI_MODEL || "gpt-4o-mini");

    const { object } = await generateObject({
      model,
      temperature: 0.2,
      schema: z.object({
        title: z.string(),
        lede: z.string(),
        body: z.array(z.string()).min(2).max(6),
        tags: z.array(z.string()).max(5),
      }),
      system: `Você escreve notícia curta para o Lupa do Brasil.

REGRAS
- Conte o fato. Não comece com "Segundo o portal X". Fontes ficam listadas à parte.
- Só use o que está no material. Não invente número, citação ou veredicto.
- Sem travessão (—). Português brasileiro. Frases curtas.
- Sem ranquear partido ou candidato. Sem opinar se a denúncia é verdadeira.
- Escopo: política, corrupção, instituições. Se o material for outro tema, diga no lede que não cabe.`,
      prompt: `Monte título, lede (1–2 frases) e 2–5 parágrafos a partir de:

${combined}`,
    });

    title = object.title.trim() || title;
    lede = object.lede.trim();
    body = object.body.map((p) => p.trim()).filter(Boolean);
  } else {
    lede = `Rascunho a partir de ${sources.length} fonte(s). Edite antes de publicar.`;
    body = chunks.map(
      (c) =>
        `${c.title}. Material bruto da fonte ${c.label}: ${c.text.slice(0, 400)}…`,
    );
  }

  const draft: NewsDraft = {
    slug: slugifyTitle(title) || `rascunho-${Date.now()}`,
    title,
    lede,
    body,
    sources,
    tags: topic.ok ? ["politica"] : [],
    topicOk: topic.ok,
    topicNote: topic.note,
    createdAt: new Date().toISOString(),
    status: "draft",
    cover: {
      src: "",
      alt: "",
      credit: "",
      objectPosition: "center center",
    },
  };

  return draft;
}

export async function listNewsDrafts(): Promise<
  Pick<
    NewsDraft,
    "slug" | "title" | "createdAt" | "topicOk" | "topicNote" | "sources"
  >[]
> {
  const { readdir, readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data", "drafts", "noticias");
  let files: string[] = [];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const out: Pick<
    NewsDraft,
    "slug" | "title" | "createdAt" | "topicOk" | "topicNote" | "sources"
  >[] = [];
  for (const file of files) {
    try {
      const raw = await readFile(path.join(dir, file), "utf8");
      const draft = JSON.parse(raw) as NewsDraft;
      out.push({
        slug: draft.slug,
        title: draft.title,
        createdAt: draft.createdAt,
        topicOk: draft.topicOk,
        topicNote: draft.topicNote,
        sources: draft.sources ?? [],
      });
    } catch {
      /* ignore broken */
    }
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
