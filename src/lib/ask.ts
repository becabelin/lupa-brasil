import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { HOT_AGENDAS, type AgendaId } from "@/data/agendas";
import {
  candidatesAlphabetical,
  type Candidate,
} from "@/data/candidates";
import {
  EXPLAINERS,
  explainerPath,
  type Explainer,
} from "@/data/explainers";
import { TOPICS, type TopicId } from "@/data/topics";
import { getAllAnalyses } from "@/lib/store";
import type { PlanAnalysis } from "@/lib/types";
import type { AskCitation, AskResult } from "@/lib/ask-shared";

export type { AskCitation, AskResult };
export { ASK_EXAMPLES } from "@/lib/ask-shared";

type CorpusChunk = {
  id: string;
  title: string;
  href: string;
  note: string;
  kind: "candidato" | "agenda" | "tema" | "caso" | "conceito" | "plano";
  text: string;
  haystack: string;
  weight: number;
};

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function joinHay(...parts: (string | undefined | null)[]) {
  return fold(parts.filter(Boolean).join(" "));
}

function getModel() {
  return openai(process.env.AI_MODEL || "gpt-4o-mini");
}

function trimText(s: string, max: number) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function scoreChunk(haystack: string, terms: string[]): number {
  if (terms.length === 0) return 0;
  let score = 0;
  for (const t of terms) {
    if (!t) continue;
    if (haystack.includes(t)) {
      score += t.length >= 5 ? 3 : 2;
      continue;
    }
    // partial: compound words
    if (t.length >= 4 && haystack.split(/\s+/).some((w) => w.includes(t) || t.includes(w))) {
      score += 1;
    }
  }
  return score;
}

function buildExplainerChunk(e: Explainer): CorpusChunk {
  const body = [
    e.teaser,
    e.hoverBlurb,
    ...(e.keyFacts?.map((f) => `${f.label}: ${f.value}`) ?? []),
    ...(e.timeline?.map((t) => `${t.when}: ${t.text}`) ?? []),
    ...(e.angles?.flatMap((a) => [
      a.title,
      Array.isArray(a.summary) ? a.summary.join(" ") : a.summary,
      ...(a.bullets ?? []),
    ]) ?? []),
    ...e.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.bullets ?? []),
    ]),
  ]
    .filter(Boolean)
    .join("\n");

  const kind =
    e.kind === "caso" ? "caso" : e.kind === "plano" ? "plano" : "conceito";

  return {
    id: `exp-${e.slug}`,
    title: e.title,
    href: explainerPath(e),
    note: kind === "caso" ? "Caso" : kind === "plano" ? "Plano / política" : "Glossário",
    kind,
    text: trimText(body, 2200),
    haystack: joinHay(
      e.title,
      e.teaser,
      e.hoverBlurb,
      ...e.aliases,
      body.slice(0, 800),
    ),
    weight: e.kind === "caso" ? 1.1 : 1,
  };
}

function buildCandidateBioChunk(c: Candidate): CorpusChunk {
  const text = [
    `${c.name} (${c.party}${c.partyFull ? ` · ${c.partyFull}` : ""})`,
    c.vice ? `Vice: ${c.vice}${c.viceParty ? ` (${c.viceParty})` : ""}` : "",
    c.bio,
    c.education,
    ...(c.career?.map((b) => `${b.when}: ${b.text}`) ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: `cand-${c.id}-bio`,
    title: c.name,
    href: `/candidatos/${c.slug}`,
    note: `${c.party} · Ficha`,
    kind: "candidato",
    text: trimText(text, 1200),
    haystack: joinHay(
      c.name,
      c.party,
      c.partyFull,
      c.vice,
      c.bio,
      c.education,
      ...(c.career?.map((b) => `${b.when} ${b.text}`) ?? []),
    ),
    weight: 1.2,
  };
}

function buildAnalysisChunks(
  analysis: PlanAnalysis,
  candidate: Candidate,
): CorpusChunk[] {
  const chunks: CorpusChunk[] = [];
  const baseHref = `/candidatos/${candidate.slug}`;

  chunks.push({
    id: `cand-${candidate.id}-overview`,
    title: `${candidate.name} · Visão geral do plano`,
    href: baseHref,
    note: `${candidate.party} · Análise do plano TSE`,
    kind: "candidato",
    text: trimText(
      [
        `Candidato: ${candidate.name} (${candidate.party})`,
        analysis.overview,
        analysis.priorities.length
          ? `Ênfases no documento: ${analysis.priorities.join("; ")}`
          : "",
        analysis.gaps.length
          ? `Temas pouco ou não tratados no documento: ${analysis.gaps.join("; ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      1600,
    ),
    haystack: joinHay(
      candidate.name,
      candidate.party,
      analysis.overview,
      ...analysis.priorities,
      ...analysis.gaps,
    ),
    weight: 1.15,
  });

  for (const topic of analysis.topics) {
    const meta = TOPICS.find((t) => t.id === topic.topicId);
    if (!meta) continue;
    chunks.push({
      id: `cand-${candidate.id}-topic-${topic.topicId}`,
      title: `${candidate.name} · ${meta.label}`,
      href: `${baseHref}#area-${topic.topicId}`,
      note: `Tema · profundidade ${topic.depth}`,
      kind: "tema",
      text: trimText(
        [
          `Candidato: ${candidate.name} (${candidate.party})`,
          `Tema: ${meta.label}`,
          `Profundidade no plano: ${topic.depth}`,
          topic.summary,
          topic.proposals.length
            ? `Propostas no texto: ${topic.proposals.join("; ")}`
            : "",
          topic.quotes.length
            ? `Trechos do plano: ${topic.quotes.map((q) => `"${q}"`).join(" · ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
        1400,
      ),
      haystack: joinHay(
        candidate.name,
        meta.label,
        meta.description,
        topic.summary,
        ...topic.proposals,
        ...topic.quotes,
      ),
      weight: topic.depth === "ausente" ? 0.9 : 1.2,
    });
  }

  for (const agenda of analysis.agendas ?? []) {
    const meta = HOT_AGENDAS.find((a) => a.id === agenda.agendaId);
    if (!meta) continue;
    chunks.push({
      id: `cand-${candidate.id}-agenda-${agenda.agendaId}`,
      title: `${candidate.name} · ${meta.label}`,
      href: baseHref,
      note: `Pauta · profundidade ${agenda.depth}`,
      kind: "agenda",
      text: trimText(
        [
          `Candidato: ${candidate.name} (${candidate.party})`,
          `Pauta: ${meta.label}`,
          `Descrição da pauta: ${meta.description}`,
          `Profundidade no plano: ${agenda.depth}`,
          agenda.summary,
          agenda.proposals.length
            ? `Propostas no texto: ${agenda.proposals.join("; ")}`
            : "",
          agenda.quotes.length
            ? `Trechos do plano: ${agenda.quotes.map((q) => `"${q}"`).join(" · ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
        1400,
      ),
      haystack: joinHay(
        candidate.name,
        meta.label,
        meta.description,
        meta.lookFor,
        agenda.summary,
        ...agenda.proposals,
        ...agenda.quotes,
      ),
      weight: agenda.depth === "ausente" ? 1.05 : 1.35,
    });
  }

  return chunks;
}

async function buildCorpus(): Promise<CorpusChunk[]> {
  const analyses = await getAllAnalyses();
  const candidates = candidatesAlphabetical();
  const chunks: CorpusChunk[] = [];

  for (const c of candidates) {
    chunks.push(buildCandidateBioChunk(c));
    const analysis = analyses.find((a) => a.candidateId === c.id);
    if (analysis) {
      chunks.push(...buildAnalysisChunks(analysis, c));
    }
  }

  for (const e of EXPLAINERS) {
    chunks.push(buildExplainerChunk(e));
  }

  return chunks;
}

function detectMatchedCandidates(qFold: string): Candidate[] {
  return candidatesAlphabetical().filter((c) => {
    const names = [c.name, c.id, c.slug, ...c.name.split(/\s+/)].map(fold);
    return names.some((n) => n.length >= 3 && qFold.includes(n));
  });
}

function detectMatchedAgendas(qFold: string): AgendaId[] {
  const hits: AgendaId[] = [];
  for (const a of HOT_AGENDAS) {
    const keys = fold(`${a.label} ${a.description} ${a.lookFor} ${a.id}`).split(
      /[\s,;/]+/,
    );
    const labelFold = fold(a.label);
    if (qFold.includes(labelFold) || qFold.includes(fold(a.id))) {
      hits.push(a.id);
      continue;
    }
    const meaningful = keys.filter((k) => k.length >= 4);
    const matchCount = meaningful.filter((k) => qFold.includes(k)).length;
    if (matchCount >= 2 || (matchCount >= 1 && meaningful.some((k) => k.length >= 6 && qFold.includes(k)))) {
      hits.push(a.id);
    }
  }
  return hits;
}

function detectMatchedTopics(qFold: string): TopicId[] {
  const hits: TopicId[] = [];
  for (const t of TOPICS) {
    const hay = fold(`${t.label} ${t.description} ${t.id}`);
    if (
      qFold.includes(fold(t.label)) ||
      fold(t.label)
        .split(/\s+/)
        .filter((w) => w.length >= 5)
        .some((w) => qFold.includes(w))
    ) {
      hits.push(t.id);
      continue;
    }
    if (hay.split(/\s+/).filter((w) => w.length >= 5 && qFold.includes(w)).length >= 2) {
      hits.push(t.id);
    }
  }
  return hits;
}

function retrieveChunks(
  corpus: CorpusChunk[],
  question: string,
  limit = 18,
): CorpusChunk[] {
  const qFold = fold(question);
  const terms = qFold
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOP.has(t));

  const matchedCandidates = detectMatchedCandidates(qFold);
  const matchedAgendas = detectMatchedAgendas(qFold);
  const matchedTopics = detectMatchedTopics(qFold);
  const matchedCandIds = new Set(matchedCandidates.map((c) => c.id));

  const scored = corpus.map((chunk) => {
    let score = scoreChunk(chunk.haystack, terms) * chunk.weight;

    if (matchedCandIds.size > 0) {
      const forCand = [...matchedCandIds].some((id) =>
        chunk.id.includes(`cand-${id}`),
      );
      if (forCand) score += 8;
      else if (chunk.kind === "candidato" || chunk.kind === "agenda" || chunk.kind === "tema") {
        // keep other chapas only if comparing / no name
        score *= 0.35;
      }
    }

    for (const agendaId of matchedAgendas) {
      if (chunk.id.includes(`agenda-${agendaId}`)) score += 10;
      if (chunk.haystack.includes(fold(agendaId.replace(/-/g, " ")))) score += 2;
    }

    for (const topicId of matchedTopics) {
      if (chunk.id.includes(`topic-${topicId}`)) score += 8;
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.filter((s) => s.score > 0).slice(0, limit);

  // If a named candidate + agenda matched but no agenda chunk scored, force-include
  if (matchedCandidates.length && matchedAgendas.length) {
    for (const c of matchedCandidates) {
      for (const agendaId of matchedAgendas) {
        const id = `cand-${c.id}-agenda-${agendaId}`;
        if (!top.some((t) => t.chunk.id === id)) {
          const found = corpus.find((ch) => ch.id === id);
          if (found) top.unshift({ chunk: found, score: 99 });
        }
      }
    }
  }

  // Always include bio of named candidates
  for (const c of matchedCandidates) {
    const id = `cand-${c.id}-bio`;
    if (!top.some((t) => t.chunk.id === id)) {
      const found = corpus.find((ch) => ch.id === id);
      if (found) top.push({ chunk: found, score: 5 });
    }
  }

  return top
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.chunk);
}

const STOP = new Set([
  "a",
  "o",
  "os",
  "as",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "um",
  "uma",
  "uns",
  "umas",
  "que",
  "qual",
  "quais",
  "se",
  "tem",
  "teve",
  "ter",
  "sobre",
  "pra",
  "para",
  "com",
  "por",
  "pelo",
  "pela",
  "ele",
  "ela",
  "eles",
  "elas",
  "meu",
  "minha",
  "seu",
  "sua",
  "isso",
  "isto",
  "como",
  "onde",
  "quando",
  "porque",
  "porquê",
  "qual",
  "quais",
  "existe",
  "existe",
  "ha",
  "há",
  "alguma",
  "algum",
  "pauta",
  "proposta",
  "plano",
  "governo",
  "presidente",
  "candidato",
  "candidata",
]);

const answerSchema = z.object({
  grounded: z
    .boolean()
    .describe(
      "true se o CONTEXTO fornecido permite responder com base factual; false se não há base suficiente.",
    ),
  answer: z
    .string()
    .describe(
      "Resposta em português do Brasil, 2 a 6 frases curtas. Só o que está no contexto. Sem travessão (—). Sem ranquear chapas. Se o plano não aborda o tema, diga isso de forma neutra.",
    ),
  citationIds: z
    .array(z.string())
    .max(8)
    .describe("IDs dos trechos do contexto usados. Só IDs listados."),
});

const SYSTEM = `Você responde perguntas no Lupa do Brasil com base APENAS no CONTEXTO fornecido (análises de planos TSE, fichas e páginas do site).

REGRAS
- Fonte única: o bloco CONTEXTO. Sem conhecimento externo, pesquisas, redes ou "o que se sabe" fora dali.
- Imparcial: não elogia, não critica, não ranqueia chapas. Se citar mais de uma, trate com o mesmo peso e ordem alfabética quando listar.
- Ausência é dado: se o contexto diz que o plano NÃO menciona o tema, ou profundidade "ausente", diga claramente que o documento oficial não aborda isso. NÃO diga que "menciona mas sem propostas". Não use jargão interno ("profundidade ausente"); fale como leitor.
- Não invente números, trechos, leis ou atribuições.
- Sem travessão (—). Use vírgula, dois-pontos, ponto ou · .
- Tom direto, concreto, brasileiro. Sem jargão de produto.
- citationIds: só IDs que existem no contexto e que você de fato usou.
- grounded: true quando o contexto cobre a pergunta (inclusive para declarar ausência no plano).`;

export async function askLupa(question: string): Promise<AskResult> {
  const q = question.trim().slice(0, 400);
  if (q.length < 3) {
    return {
      answer: "Digite uma pergunta um pouco mais completa.",
      grounded: false,
      citations: [],
      contextCount: 0,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      answer:
        "A busca por pergunta ainda não está configurada neste ambiente (falta a chave da IA).",
      grounded: false,
      citations: [],
      contextCount: 0,
    };
  }

  const corpus = await buildCorpus();
  const selected = retrieveChunks(corpus, q);

  if (selected.length === 0) {
    return {
      answer:
        "Não achei base no Lupa para essa pergunta. Tente um nome de candidato, uma pauta (ex.: big techs) ou um caso do site.",
      grounded: false,
      citations: [],
      contextCount: 0,
    };
  }

  const contextBlock = selected
    .map(
      (c) =>
        `[id=${c.id}]\ntítulo: ${c.title}\nlink: ${c.href}\nnota: ${c.note}\n---\n${c.text}`,
    )
    .join("\n\n");

  const { object } = await generateObject({
    model: getModel(),
    schema: answerSchema,
    system: SYSTEM,
    prompt: `PERGUNTA DO LEITOR:\n${q}\n\nCONTEXTO (use só isto):\n${contextBlock}`,
    temperature: 0.2,
  });

  const byId = new Map(selected.map((c) => [c.id, c]));
  const citations: AskCitation[] = [];
  for (const id of object.citationIds) {
    const c = byId.get(id);
    if (!c) continue;
    if (citations.some((x) => x.id === c.id)) continue;
    citations.push({
      id: c.id,
      title: c.title,
      href: c.href,
      note: c.note,
    });
  }

  // If model forgot citations but answered from context, attach top relevant
  if (citations.length === 0 && object.grounded) {
    for (const c of selected.slice(0, 4)) {
      citations.push({
        id: c.id,
        title: c.title,
        href: c.href,
        note: c.note,
      });
    }
  }

  return {
    answer: object.answer.trim(),
    grounded: object.grounded,
    citations,
    contextCount: selected.length,
  };
}
