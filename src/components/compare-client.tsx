"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Candidate } from "@/data/candidates";
import { HOT_AGENDAS, agendasByGroup, type AgendaId } from "@/data/agendas";
import type { TopicId } from "@/data/topics";
import type { AgendaAnalysis, PlanAnalysis, TopicAnalysis } from "@/lib/types";
import { FilterSelect } from "@/components/ui/fields";
import { PlanQuoteLine } from "@/components/plan-quotes";
import { PLAN_DEPTH_LABEL, PLAN_DEPTH_LEGEND } from "@/lib/plan-depth";

type Props = {
  candidates: Candidate[];
  topics: { id: TopicId; label: string; description: string }[];
  analyses: PlanAnalysis[];
};

type Lens =
  | { kind: "topic"; id: TopicId }
  | { kind: "agenda"; id: AgendaId };

function parseLens(value: string): Lens {
  if (value.startsWith("agenda:")) {
    return { kind: "agenda", id: value.slice(7) as AgendaId };
  }
  return { kind: "topic", id: value.replace(/^topic:/, "") as TopicId };
}

function lensValue(lens: Lens) {
  return lens.kind === "agenda" ? `agenda:${lens.id}` : `topic:${lens.id}`;
}

export function CompareClient({ candidates, topics, analyses }: Props) {
  const withAnalysis = useMemo(
    () => candidates.filter((c) => analyses.some((a) => a.candidateId === c.id)),
    [candidates, analyses],
  );

  const [leftId, setLeftId] = useState(withAnalysis[0]?.id || candidates[0]?.id || "");
  const [rightId, setRightId] = useState(
    withAnalysis[1]?.id || withAnalysis[0]?.id || candidates[1]?.id || "",
  );
  const [lens, setLens] = useState<Lens>({
    kind: "agenda",
    id: HOT_AGENDAS[0]?.id || "selic-inflacao",
  });

  const left = analyses.find((a) => a.candidateId === leftId);
  const right = analyses.find((a) => a.candidateId === rightId);
  const leftCand = candidates.find((c) => c.id === leftId);
  const rightCand = candidates.find((c) => c.id === rightId);

  const leftSlice = getSlice(left, lens);
  const rightSlice = getSlice(right, lens);

  const agendaGroups = useMemo(() => {
    const featured = HOT_AGENDAS.filter(
      (a) => "featured" in a && a.featured,
    ).map((a) => ({
      value: `agenda:${a.id}`,
      label: a.label,
    }));
    const featuredIds = new Set(
      HOT_AGENDAS.filter((a) => "featured" in a && a.featured).map((a) => a.id),
    );
    const rest = agendasByGroup()
      .map(([group, list]) => ({
        label: group,
        options: list
          .filter((a) => !featuredIds.has(a.id))
          .map((a) => ({
            value: `agenda:${a.id}`,
            label: a.label,
          })),
      }))
      .filter((g) => g.options.length > 0);
    return [
      { label: "Em destaque", options: featured },
      ...rest,
    ];
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 border-2 border-black bg-[#f5f5f5] p-4 md:grid-cols-3">
        <FilterSelect
          label="Candidato A"
          value={leftId}
          onChange={(e) => setLeftId(e.target.value)}
          searchable
          searchPlaceholder="Buscar candidato…"
          options={candidates.map((c) => ({
            value: c.id,
            label: `${c.name} (${c.party})`,
          }))}
        />
        <FilterSelect
          label="Candidato B"
          value={rightId}
          onChange={(e) => setRightId(e.target.value)}
          searchable
          searchPlaceholder="Buscar candidato…"
          options={candidates.map((c) => ({
            value: c.id,
            label: `${c.name} (${c.party})`,
          }))}
        />
        <FilterSelect
          label="Comparar por"
          value={lensValue(lens)}
          onChange={(e) => setLens(parseLens(e.target.value))}
          searchable
          searchPlaceholder="Buscar pauta ou área…"
          groups={[
            ...agendaGroups,
            {
              label: "Áreas do plano",
              options: topics.map((t) => ({
                value: `topic:${t.id}`,
                label: t.label,
              })),
            },
          ]}
        />
      </div>

      <p className="text-sm font-medium text-[#555]">
        {lens.kind === "agenda"
          ? "Pauta do debate: o que cada plano diz (ou não diz)."
          : "Área temática extraída do plano oficial."}{" "}
        {PLAN_DEPTH_LEGEND} Novas pautas só aparecem com análise atualizada do
        PDF.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <CompareColumn
          candidate={leftCand}
          slice={leftSlice}
          hasAnalysis={Boolean(left)}
        />
        <CompareColumn
          candidate={rightCand}
          slice={rightSlice}
          hasAnalysis={Boolean(right)}
        />
      </div>
    </div>
  );
}

function getSlice(analysis: PlanAnalysis | undefined, lens: Lens) {
  if (!analysis) return null;
  if (lens.kind === "agenda") {
    return analysis.agendas?.find((a) => a.agendaId === lens.id) ?? null;
  }
  return analysis.topics.find((t) => t.topicId === lens.id) ?? null;
}

function CompareColumn({
  candidate,
  slice,
  hasAnalysis,
}: {
  candidate?: Candidate;
  slice?: TopicAnalysis | AgendaAnalysis | null;
  hasAnalysis: boolean;
}) {
  if (!candidate) return null;
  return (
    <article className="border-2 border-black p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
        {candidate.party}
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
        {candidate.name}
      </h3>
      {!hasAnalysis || !slice ? (
        <p className="mt-4 text-sm font-medium text-[#555]">
          {hasAnalysis
            ? "Sem extrato para esta pauta (reanalise o plano no admin se necessário)."
            : "Sem análise disponível."}{" "}
          <Link href={`/candidatos/${candidate.slug}`} className="underline">
            Ver perfil
          </Link>
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]"
            title={PLAN_DEPTH_LEGEND}
          >
            {PLAN_DEPTH_LABEL[slice.depth]}
          </p>
          <p className="text-sm leading-relaxed">{slice.summary}</p>
          {slice.quotes.length > 0 ? (
            <div className="space-y-3">
              {slice.quotes.slice(0, 2).map((q) => (
                <PlanQuoteLine key={q} quote={q} />
              ))}
            </div>
          ) : null}
          {slice.proposals.length > 0 ? (
            <ul className="space-y-2">
              {slice.proposals.map((p) => (
                <li key={p} className="text-sm font-medium">
                  • {p}
                </li>
              ))}
            </ul>
          ) : slice.depth === "ausente" ? (
            <p className="text-sm font-medium text-[#666]">
              Sem trecho literal nesta pauta nesta análise. Sem citação, o Lupa
              trata como fora do plano.
            </p>
          ) : slice.quotes.length > 0 ? (
            <p className="text-sm font-medium text-[#666]">
              Sem proposta concreta listada. Veja os trechos acima.
            </p>
          ) : (
            <p className="text-sm font-medium text-[#666]">
              Sem trecho literal que fundamente o resumo. Sem citação, não dá
              para afirmar presença no plano.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
