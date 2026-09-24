import {
  candidatesAlphabetical,
  type Candidate,
} from "@/data/candidates";
import {
  EXPLAINERS,
  EXPLAINER_KIND_LABEL,
  explainerParagraphs,
  explainerPath,
  type Explainer,
} from "@/data/explainers";

export type SearchHitKind = "candidato" | "caso" | "conceito" | "plano";

export type SearchHit = {
  id: string;
  kind: SearchHitKind;
  title: string;
  blurb: string;
  href: string;
  meta: string;
  /** Texto normalizado para match. */
  haystack: string;
};

/** Palavras que não ajudam no match (perguntas em português). */
const STOP = new Set([
  "a",
  "as",
  "ao",
  "aos",
  "o",
  "os",
  "e",
  "ou",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "em",
  "na",
  "no",
  "nas",
  "nos",
  "um",
  "uma",
  "uns",
  "umas",
  "que",
  "qual",
  "quais",
  "como",
  "para",
  "pra",
  "por",
  "com",
  "sem",
  "sobre",
  "entre",
  "seu",
  "sua",
  "seus",
  "suas",
  "ele",
  "ela",
  "eles",
  "elas",
  "me",
  "te",
  "se",
  "lhe",
  "vos",
  "eh",
  "é",
  "ser",
  "sao",
  "são",
  "esta",
  "está",
  "tem",
  "há",
  "ha",
  "foi",
  "vai",
  "ter",
  "faz",
  "fale",
  "fala",
  "diga",
  "diz",
  "quero",
  "saber",
  "entenda",
  "entender",
  "explique",
  "explica",
]);

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function joinHay(...parts: (string | undefined | null)[]) {
  return fold(parts.filter(Boolean).join(" · "));
}

function queryTerms(query: string): string[] {
  const raw = fold(query.trim())
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const meaningful = raw.filter((t) => t.length >= 2 && !STOP.has(t));
  return meaningful.length > 0 ? meaningful : raw.filter((t) => t.length >= 2);
}

function candidateHit(c: Candidate): SearchHit {
  return {
    id: `cand-${c.id}`,
    kind: "candidato",
    title: c.name,
    blurb: c.bio ?? `${c.party}${c.partyFull ? ` · ${c.partyFull}` : ""}`,
    href: `/candidatos/${c.slug}`,
    meta: `${c.party} · Candidato`,
    haystack: joinHay(
      c.name,
      c.slug,
      c.party,
      c.partyFull,
      c.vice,
      c.bio,
      c.education,
      ...(c.career?.map((b) => `${b.when} ${b.text}`) ?? []),
      ...(c.relatedCaseSlugs ?? []),
    ),
  };
}

function explainerHit(e: Explainer): SearchHit {
  const kind: SearchHitKind =
    e.kind === "caso" ? "caso" : e.kind === "plano" ? "plano" : "conceito";

  const sectionText = e.sections.flatMap((s) => [
    s.heading,
    ...s.paragraphs,
    ...(s.bullets ?? []),
  ]);
  const angleText =
    e.angles?.flatMap((a) => [
      a.title,
      ...explainerParagraphs(a.summary),
      ...(a.bullets ?? []),
    ]) ?? [];
  const peopleText = e.people?.flatMap((p) => [p.name, p.role]) ?? [];
  const factText = e.keyFacts?.flatMap((f) => [f.label, f.value]) ?? [];
  const timelineText = e.timeline?.flatMap((t) => [t.when, t.text]) ?? [];

  return {
    id: `exp-${e.slug}`,
    kind,
    title: e.title,
    blurb: e.teaser,
    href: explainerPath(e),
    meta: EXPLAINER_KIND_LABEL[e.kind],
    haystack: joinHay(
      e.title,
      e.slug,
      e.teaser,
      e.teaserSimple,
      e.hoverBlurb,
      e.hoverBlurbSimple,
      ...e.aliases,
      ...sectionText,
      ...angleText,
      ...peopleText,
      ...factText,
      ...timelineText,
    ),
  };
}

/** Índice estático para a busca do site. */
export function buildSearchIndex(): SearchHit[] {
  const candidates = candidatesAlphabetical().map(candidateHit);
  const pages = EXPLAINERS.map(explainerHit).sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
  return [...candidates, ...pages];
}

/**
 * Busca ranqueada: basta um termo relevante bater.
 * Título pesa mais. Stop-words de pergunta são ignoradas.
 */
export function searchHits(index: SearchHit[], query: string): SearchHit[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];

  const scored: { hit: SearchHit; score: number }[] = [];

  for (const hit of index) {
    const title = fold(hit.title);
    let score = 0;
    let matched = 0;

    for (const t of terms) {
      if (title === t || title.startsWith(`${t} `) || title.includes(` ${t}`)) {
        score += 40;
        matched += 1;
      } else if (title.includes(t)) {
        score += 24;
        matched += 1;
      } else if (hit.haystack.includes(t)) {
        score += 8;
        matched += 1;
      }
    }

    if (matched === 0) continue;
    if (matched === terms.length) score += 30;
    else score += matched * 4;

    scored.push({ hit, score });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || a.hit.title.localeCompare(b.hit.title, "pt-BR"),
    )
    .map((s) => s.hit);
}

export const SEARCH_KIND_LABEL: Record<SearchHitKind, string> = {
  candidato: "Candidato",
  caso: "Caso",
  conceito: "Conceito",
  plano: "Plano / política",
};
