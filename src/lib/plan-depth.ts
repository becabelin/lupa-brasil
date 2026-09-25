import type {
  AgendaAnalysis,
  PlanAnalysis,
  TopicAnalysis,
} from "@/lib/types";
import { unwrapQuoteList } from "@/lib/text";

export type PlanDepth = TopicAnalysis["depth"] | AgendaAnalysis["depth"];

/**
 * Quanto o plano oficial fala da pauta ou área.
 * Não é nota do candidato nem juízo de valor.
 */
export const PLAN_DEPTH_LABEL: Record<PlanDepth, string> = {
  alto: "Muito no plano",
  medio: "Médio no plano",
  baixo: "Pouco no plano",
  ausente: "Fora do plano",
};

/** Versão curta para chips apertados. */
export const PLAN_DEPTH_SHORT: Record<PlanDepth, string> = {
  alto: "Muito",
  medio: "Médio",
  baixo: "Pouco",
  ausente: "Fora",
};

export const PLAN_DEPTH_LEGEND =
  "Muito, médio, pouco ou fora: só diz o quanto o plano de governo fala da pauta. Não é nota da pessoa.";

/**
 * Quando a pauta não aparece no plano.
 * Tom direto do Lupa, com nome da chapa quando houver.
 */
export function absentPlanSummary(params: {
  candidateName?: string;
  topicLabel: string;
}): string {
  const label = params.topicLabel.trim().replace(/^./u, (c) => c.toLowerCase());
  const name = params.candidateName?.trim();
  if (name) {
    return `Na nossa análise do plano de governo de ${name}, não encontramos menções sobre ${label}.`;
  }
  return `Na nossa análise do plano de governo, não encontramos menções sobre ${label}.`;
}

type CoverageSlice = {
  summary: string;
  proposals: string[];
  quotes: string[];
  depth: PlanDepth;
};

/**
 * Sem trecho literal, o Lupa não afirma presença no plano.
 * Corrige análises antigas com depth médio/alto e quotes vazios.
 */
export function normalizeCoverage<T extends CoverageSlice>(slice: T): T {
  const quotes = unwrapQuoteList(slice.quotes ?? []).filter(Boolean);
  const proposals = (slice.proposals ?? [])
    .map((p) => p.trim())
    .filter(Boolean);

  if (quotes.length === 0) {
    return {
      ...slice,
      quotes: [],
      proposals: [],
      depth: "ausente",
      summary:
        slice.depth === "ausente" && slice.summary?.trim()
          ? slice.summary
          : "Na nossa análise do plano de governo, não encontramos menções concretas sobre esta pauta.",
    };
  }

  return { ...slice, quotes, proposals };
}

/** Aplica a regra em tópicos e pautas de uma análise completa. */
export function normalizePlanAnalysis(analysis: PlanAnalysis): PlanAnalysis {
  return {
    ...analysis,
    topics: (analysis.topics ?? []).map((t) => normalizeCoverage(t)),
    agendas: (analysis.agendas ?? []).map((a) => normalizeCoverage(a)),
  };
}