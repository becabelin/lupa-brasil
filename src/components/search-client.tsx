"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Candidate } from "@/data/candidates";
import type { TopicId } from "@/data/topics";
import type { PlanAnalysis } from "@/lib/types";
import { FilterInput, FilterSelect } from "@/components/ui/fields";
import { PLAN_DEPTH_LABEL, absentPlanSummary } from "@/lib/plan-depth";

type Props = {
  candidates: Candidate[];
  topics: { id: TopicId; label: string; description: string }[];
  analyses: PlanAnalysis[];
};

export function SearchClient({ candidates, topics, analyses }: Props) {
  const [topicId, setTopicId] = useState<TopicId>(topics[0]?.id || "economia");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const topicMeta = topics.find((t) => t.id === topicId);
    return analyses
      .map((a) => {
        const topic = a.topics.find((t) => t.topicId === topicId);
        const candidate = candidates.find((c) => c.id === a.candidateId);
        if (!topic || !candidate) return null;
        const summary =
          topic.depth === "ausente"
            ? absentPlanSummary({
                candidateName: candidate.name,
                topicLabel: topicMeta?.label ?? topicId,
              })
            : topic.summary;
        const hay = [summary, ...topic.proposals, ...topic.quotes]
          .join(" ")
          .toLowerCase();
        if (q && !hay.includes(q)) return null;
        return { candidate, topic, summary };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const order = { alto: 0, medio: 1, baixo: 2, ausente: 3 };
        return order[a!.topic.depth] - order[b!.topic.depth];
      }) as {
      candidate: Candidate;
      topic: PlanAnalysis["topics"][number];
      summary: string;
    }[];
  }, [analyses, candidates, topicId, query, topics]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 border-2 border-black bg-[#f5f5f5] p-4 md:grid-cols-[1fr_1.2fr]">
        <FilterSelect
          label="Área"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value as TopicId)}
          options={topics.map((t) => ({ value: t.id, label: t.label }))}
        />
        <FilterInput
          label="Palavra-chave"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SUS, desmatamento, imposto…"
        />
      </div>

      {results.length === 0 ? (
        <p className="border-2 border-dashed border-black p-10 text-center text-sm font-bold uppercase">
          Nenhum resultado. Analise os planos no admin para popular esta busca.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map(({ candidate, topic, summary }) => (
            <Link
              key={candidate.id}
              href={`/candidatos/${candidate.slug}`}
              className="block border-2 border-black p-5 transition hover:bg-black hover:text-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight">
                    {candidate.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                    {candidate.party}
                  </span>
                </div>
                <span className="border border-current px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {PLAN_DEPTH_LABEL[topic.depth]}
                </span>
              </div>
              <p className="mt-3 text-sm opacity-80">{summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
