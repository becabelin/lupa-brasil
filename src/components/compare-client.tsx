"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

type Slice = TopicAnalysis | AgendaAnalysis;

function parseLens(value: string): Lens {
  if (value.startsWith("agenda:")) {
    return { kind: "agenda", id: value.slice(7) as AgendaId };
  }
  return { kind: "topic", id: value.replace(/^topic:/, "") as TopicId };
}

function lensValue(lens: Lens) {
  return lens.kind === "agenda" ? `agenda:${lens.id}` : `topic:${lens.id}`;
}

function getSlice(analysis: PlanAnalysis | undefined, lens: Lens) {
  if (!analysis) return null;
  if (lens.kind === "agenda") {
    return analysis.agendas?.find((a) => a.agendaId === lens.id) ?? null;
  }
  return analysis.topics.find((t) => t.topicId === lens.id) ?? null;
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

  const lensMeta = useMemo(() => {
    if (lens.kind === "agenda") {
      const agenda = HOT_AGENDAS.find((a) => a.id === lens.id);
      return {
        label: agenda?.label ?? lens.id,
        description: agenda?.description ?? "",
        kindLabel: "Pauta",
      };
    }
    const topic = topics.find((t) => t.id === lens.id);
    return {
      label: topic?.label ?? lens.id,
      description: topic?.description ?? "",
      kindLabel: "Área",
    };
  }, [lens, topics]);

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

  const panelCandidates = useMemo(
    () =>
      [...candidates].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
      ),
    [candidates],
  );

  /** Click sets A; if that card is already A, sets B. */
  function handlePanelSelect(id: string) {
    if (id === leftId) {
      setRightId(id);
      return;
    }
    setLeftId(id);
  }

  return (
    <div className="space-y-8">
      <div className="lupa-soft grid gap-3 border-2 border-black bg-[#f5f5f5] p-4 md:grid-cols-3">
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

      <header className="lupa-soft border-2 border-black bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
          {lensMeta.kindLabel}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
          {lensMeta.label}
        </h2>
        {lensMeta.description ? (
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#2a2a2a]">
            {lensMeta.description}
          </p>
        ) : null}
        <p className="mt-3 text-xs font-medium text-[#555]">
          {lens.kind === "agenda"
            ? "Pauta do debate: o que cada plano diz (ou não diz)."
            : "Área temática extraída do plano oficial."}{" "}
          {PLAN_DEPTH_LEGEND} Novas pautas só aparecem com análise atualizada do
          PDF.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <CompareColumn
          side="A"
          candidate={leftCand}
          slice={leftSlice}
          hasAnalysis={Boolean(left)}
        />
        <CompareColumn
          side="B"
          candidate={rightCand}
          slice={rightSlice}
          hasAnalysis={Boolean(right)}
        />
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
            Todas as chapas
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
            {lensMeta.label}
          </h3>
          <p className="mt-2 text-sm font-medium text-[#2a2a2a]">
            Clique para colocar no lado A; se a chapa já estiver no A, o clique
            vai para o B.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {panelCandidates.map((candidate) => {
            const analysis = analyses.find((a) => a.candidateId === candidate.id);
            const slice = getSlice(analysis, lens);
            const selected =
              candidate.id === leftId
                ? "A"
                : candidate.id === rightId
                  ? "B"
                  : null;
            const oneLine =
              !slice || slice.depth === "ausente"
                ? "Fora do plano"
                : slice.summary || "Fora do plano";

            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => handlePanelSelect(candidate.id)}
                className={`group lupa-soft flex items-start gap-3 border-2 border-black bg-white p-3 text-left transition hover:bg-black hover:text-white ${
                  selected ? "ring-2 ring-black ring-offset-2" : ""
                }`}
              >
                <span className="relative h-14 w-11 shrink-0 overflow-hidden border border-black bg-[#ddd]">
                  {candidate.photo ? (
                    <Image
                      src={candidate.photo}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="44px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center bg-black text-[10px] font-bold text-white">
                      {candidate.party.slice(0, 3)}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666] group-hover:text-white/60">
                      {candidate.party}
                    </span>
                    {selected ? (
                      <span className="border border-current px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {selected}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block font-[family-name:var(--font-display)] text-lg uppercase leading-tight tracking-tight">
                    {candidate.name}
                  </span>
                  <span
                    className="mt-1 inline-block border border-current px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    title={PLAN_DEPTH_LEGEND}
                  >
                    {slice
                      ? PLAN_DEPTH_LABEL[slice.depth]
                      : PLAN_DEPTH_LABEL.ausente}
                  </span>
                  <span className="mt-1.5 block line-clamp-1 text-xs font-medium text-[#2a2a2a] group-hover:text-white/80">
                    {oneLine}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CompareColumn({
  side,
  candidate,
  slice,
  hasAnalysis,
}: {
  side: "A" | "B";
  candidate?: Candidate;
  slice?: Slice | null;
  hasAnalysis: boolean;
}) {
  if (!candidate) {
    return (
      <article className="lupa-soft border-2 border-black bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
          Candidato {side}
        </p>
        <p className="mt-4 text-sm font-medium text-[#555]">
          Selecione um candidato acima.
        </p>
      </article>
    );
  }

  const emptyMessage = !hasAnalysis
    ? "Sem análise disponível."
    : !slice
      ? "Sem extrato para esta pauta (reanalise o plano no admin se necessário)."
      : null;

  return (
    <article className="lupa-soft flex flex-col overflow-hidden border-2 border-black bg-white">
      <div className="relative aspect-[4/5] w-full border-b-2 border-black bg-[#ddd]">
        {candidate.photo ? (
          <Image
            src={candidate.photo}
            alt={candidate.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={side === "A"}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-black font-[family-name:var(--font-display)] text-5xl text-white">
            {candidate.party.slice(0, 3)}
          </div>
        )}
        <span className="absolute left-3 top-3 border-2 border-black bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
          {side}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
            {candidate.party}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase leading-[1.02] tracking-tight sm:text-3xl">
            {candidate.name}
          </h3>
        </div>

        {emptyMessage ? (
          <p className="text-sm font-medium text-[#555]">
            {emptyMessage}{" "}
            <Link
              href={`/candidatos/${candidate.slug}`}
              className="lupa-text-link"
            >
              Ver perfil
            </Link>
          </p>
        ) : slice ? (
          <>
            <p
              className="w-fit border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2a2a2a]"
              title={PLAN_DEPTH_LEGEND}
            >
              {PLAN_DEPTH_LABEL[slice.depth]}
            </p>

            <p className="text-sm font-medium leading-relaxed text-[#2a2a2a]">
              {slice.summary || "Sem resumo para esta pauta."}
            </p>

            {slice.proposals.length > 0 ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2a2a2a]">
                  Propostas
                </p>
                <ul className="mt-2 space-y-2">
                  {slice.proposals.map((p) => (
                    <li
                      key={p}
                      className="text-sm font-medium leading-snug text-[#2a2a2a]"
                    >
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
            ) : slice.depth === "ausente" ? (
              <p className="text-sm font-medium text-[#555]">
                Sem trecho literal nesta pauta nesta análise. Sem citação, o Lupa
                trata como fora do plano.
              </p>
            ) : (
              <p className="text-sm font-medium text-[#555]">
                Sem proposta concreta listada.
              </p>
            )}

            {slice.quotes.length > 0 ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2a2a2a]">
                  Trechos do plano
                </p>
                <div className="mt-2 space-y-3">
                  {slice.quotes.slice(0, 3).map((q) => (
                    <PlanQuoteLine key={q} quote={q} />
                  ))}
                </div>
              </div>
            ) : slice.depth !== "ausente" ? (
              <p className="text-sm font-medium text-[#555]">
                Sem trecho literal que fundamente o resumo. Sem citação, não dá
                para afirmar presença no plano.
              </p>
            ) : null}

            <Link
              href={`/candidatos/${candidate.slug}`}
              className="mt-auto pt-2 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2"
            >
              Ver ficha →
            </Link>
          </>
        ) : null}
      </div>
    </article>
  );
}
