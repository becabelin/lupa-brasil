"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Candidate } from "@/data/candidates";
import { HOT_AGENDAS, featuredAgendas } from "@/data/agendas";
import { TOPICS, type TopicId } from "@/data/topics";
import {
  explainerPath,
  getExplainer,
} from "@/data/explainers";
import type {
  AgendaAnalysis,
  PlanAnalysis,
  TopicAnalysis,
  UploadedDocument,
} from "@/lib/types";
import { TopicBlock } from "@/components/topic-block";
import { TopicDetailModal } from "@/components/topic-detail-modal";
import { AgendaDetailModal } from "@/components/agenda-detail-modal";
import { PressCoverage } from "@/components/press-coverage";
import type { PressItem } from "@/lib/press";
import {
  PLAN_DEPTH_LABEL,
  PLAN_DEPTH_LEGEND,
  PLAN_DEPTH_SHORT,
} from "@/lib/plan-depth";

type FilterMode = "tudo" | TopicId;

type Props = {
  candidate: Candidate;
  analysis: PlanAnalysis | null;
  document: UploadedDocument | null;
  pressItems?: PressItem[];
  pressUpdatedAt?: string;
};

export function CandidateDetail({
  candidate,
  analysis,
  document,
  pressItems = [],
  pressUpdatedAt,
}: Props) {
  const [filter, setFilter] = useState<FilterMode>("tudo");
  const [hideAbsent, setHideAbsent] = useState(true);
  const [openTopic, setOpenTopic] = useState<TopicAnalysis | null>(null);
  const [openAgenda, setOpenAgenda] = useState<AgendaAnalysis | null>(null);

  const topicsSorted = useMemo(() => {
    if (!analysis) return [];
    const order = { alto: 0, medio: 1, baixo: 2, ausente: 3 };
    return [...analysis.topics].sort(
      (a, b) => order[a.depth] - order[b.depth],
    );
  }, [analysis]);

  const featuredIds = useMemo(
    () => new Set(featuredAgendas().map((a) => a.id)),
    [],
  );

  const agendasSorted = useMemo(() => {
    if (!analysis?.agendas?.length) return [];
    const order = { alto: 0, medio: 1, baixo: 2, ausente: 3 };
    return [...analysis.agendas]
      .filter((a) => featuredIds.has(a.agendaId))
      .sort((a, b) => order[a.depth] - order[b.depth]);
  }, [analysis, featuredIds]);

  const visibleTopics = useMemo(() => {
    let list = topicsSorted;
    if (hideAbsent) list = list.filter((t) => t.depth !== "ausente");
    if (filter !== "tudo") list = list.filter((t) => t.topicId === filter);
    return list;
  }, [topicsSorted, filter, hideAbsent]);

  const relatedCases = useMemo(() => {
    return (candidate.relatedCaseSlugs ?? [])
      .map((s) => getExplainer(s))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [candidate.relatedCaseSlugs]);

  const hasPersonFile =
    Boolean(candidate.bio) ||
    Boolean(candidate.education) ||
    Boolean(candidate.career?.length) ||
    relatedCases.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href="/eleicoes"
        className="lupa-nav-link text-sm tracking-widest"
      >
        ← Eleições 2026
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:items-start lg:gap-10">
        {/*  Esquerda: quem é a pessoa */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          <div className="overflow-hidden border-2 border-black bg-white">
            <div className="relative aspect-[4/5] w-full bg-[#ddd]">
              {candidate.photo ? (
                <Image
                  src={candidate.photo}
                  alt={candidate.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 340px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-black text-6xl font-bold text-white">
                  {candidate.party.slice(0, 3)}
                </div>
              )}
            </div>

            <div className="border-t-2 border-black p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em]">
                {candidate.party}
                {candidate.partyFull ? ` · ${candidate.partyFull}` : ""}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
                {candidate.name}
              </h1>

              {candidate.vice ? (
                <p className="mt-4 border-t border-black/20 pt-4 text-sm font-semibold leading-snug">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
                    Vice
                  </span>
                  {candidate.vice}
                  {candidate.viceParty ? ` (${candidate.viceParty})` : ""}
                </p>
              ) : null}

              {candidate.bio ? (
                <div className="mt-4 border-t border-black/20 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
                    Quem é
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#333]">
                    {candidate.bio}
                  </p>
                </div>
              ) : (
                <p className="mt-4 border-t border-black/20 pt-4 text-sm font-medium leading-relaxed text-[#666]">
                  Ficha da pessoa em elaboração. O plano, quando houver, fica à
                  direita.
                </p>
              )}

              {candidate.education ? (
                <p className="mt-3 text-sm font-medium leading-snug text-[#444]">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
                    Formação / ofício
                  </span>
                  {candidate.education}
                </p>
              ) : null}

              {candidate.socials && candidate.socials.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {candidate.socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/comparar"
              className="border-2 border-black px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
            >
              Comparar
            </Link>
            {document ? (
              <span className="border-2 border-dashed border-black px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#555]">
                Plano TSE
              </span>
            ) : null}
          </div>

          {candidate.bioSources && candidate.bioSources.length > 0 ? (
            <div className="space-y-2 text-[11px] font-medium leading-relaxed text-[#666]">
              <p>
                Origem da ficha (também em{" "}
                <Link
                  href="/fontes#fichas"
                  className="lupa-text-link text-[#333]"
                >
                  Fontes
                </Link>
                ):
              </p>
              <ul className="space-y-1.5">
                {candidate.bioSources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lupa-text-link break-words text-[#333]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {analysis ? (
            <p className="pb-2 text-[11px] font-medium leading-relaxed text-[#666]">
              Síntese do plano por IA a partir de{" "}
              <span className="font-semibold text-[#333]">
                {analysis.sourceFileName}
              </span>
              . Extrato do documento oficial, sem opinião editorial. Não
              substitui a leitura do plano.
            </p>
          ) : null}
        </aside>

        {/*  Direita: pessoa + plano */}
        <div className="min-w-0 space-y-8">
          {hasPersonFile ? (
            <section>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">
                A pessoa
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
                Trajetória
              </h2>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#444]">
                Cargos, ofícios e papéis públicos. Sem juízo sobre o plano.
                Confira as fontes ao lado.
              </p>

              {candidate.career && candidate.career.length > 0 ? (
                <ol className="mt-6 border-l-2 border-black">
                  {candidate.career.map((beat) => (
                    <li
                      key={`${beat.when}-${beat.text.slice(0, 24)}`}
                      className="relative pb-6 pl-6 last:pb-0"
                    >
                      <span className="absolute -left-[5px] top-1.5 h-2 w-2 bg-black" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {beat.when}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-[#222] sm:text-base">
                        {beat.text}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}

              {relatedCases.length > 0 ? (
                <div className="mt-8 border-2 border-black p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
                    Casos no Lupa
                  </p>
                  <ul className="mt-3 space-y-3">
                    {relatedCases.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={explainerPath(c)}
                          className="lupa-text-link"
                        >
                          {c.title}
                        </Link>
                        <p className="mt-1 text-sm font-medium text-[#555]">
                          {c.teaser}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {!analysis ? (
            <div className="border-2 border-dashed border-black p-10 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase">
                Análise ainda não disponível
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm font-medium text-[#555]">
                {document
                  ? "O documento já foi enviado. Aguardando processamento."
                  : "O plano de governo deste candidato ainda não foi enviado."}
              </p>
            </div>
          ) : (
            <>
              <section>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">
                  O plano
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
                  O que o plano prioriza
                </h2>
                <p className="lupa-prose-wide mt-4 text-base sm:text-lg">
                  {analysis.overview}
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-3">
                <HighlightList
                  title="Prioridades no texto"
                  items={analysis.priorities}
                  emphasize
                />
                <HighlightList
                  title="Mais detalhado no plano"
                  items={analysis.strengths}
                />
                <HighlightList
                  title="Pouco ou nada abordado"
                  items={analysis.gaps}
                />
              </section>

              {agendasSorted.length > 0 ? (
                <section>
                  <div className="mb-4">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
                      Pautas em destaque
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#555]">
                      Debates públicos atuais: o que este plano diz (ou não diz)
                      sobre cada um. Clique para abrir.
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#666]">
                      {PLAN_DEPTH_LEGEND}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {agendasSorted.map((a) => {
                      const meta = HOT_AGENDAS.find((x) => x.id === a.agendaId);
                      return (
                        <button
                          key={a.agendaId}
                          type="button"
                          onClick={() => setOpenAgenda(a)}
                          className="group flex h-full flex-col border-2 border-black bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                                {meta?.group}
                              </p>
                              <h4 className="mt-1 font-[family-name:var(--font-display)] text-xl uppercase tracking-tight">
                                {meta?.label ?? a.agendaId}
                              </h4>
                            </div>
                            <span
                              className="shrink-0 border border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                              title={PLAN_DEPTH_LEGEND}
                            >
                              {PLAN_DEPTH_LABEL[a.depth]}
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-[#333]">
                            {a.summary}
                          </p>
                          <p className="mt-auto pt-3 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2 group-hover:bg-black group-hover:text-white group-hover:no-underline">
                            Ver o que o plano diz →
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              <section className="border-2 border-black bg-[#f5f5f5] p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                      Por área
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#555]">
                      Clique numa área para ver propostas e trechos do plano.
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#666]">
                      {PLAN_DEPTH_LEGEND}
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={hideAbsent}
                      onChange={(e) => setHideAbsent(e.target.checked)}
                      className="h-4 w-4 accent-black"
                    />
                    Ocultar fora do plano
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <FilterChip
                    active={filter === "tudo"}
                    onClick={() => setFilter("tudo")}
                    label="Tudo"
                  />
                  {topicsSorted.map((t) => {
                    const meta = TOPICS.find((x) => x.id === t.topicId);
                    if (hideAbsent && t.depth === "ausente") return null;
                    return (
                      <FilterChip
                        key={t.topicId}
                        active={filter === t.topicId}
                        onClick={() => setFilter(t.topicId)}
                        label={meta?.label ?? t.topicId}
                        badge={PLAN_DEPTH_SHORT[t.depth]}
                      />
                    );
                  })}
                </div>
              </section>

              <section
                className={
                  visibleTopics.length === 0
                    ? undefined
                    : "columns-1 gap-4 sm:columns-2 [column-fill:_balance]"
                }
              >
                {visibleTopics.length === 0 ? (
                  <p className="border-2 border-dashed border-black p-8 text-center text-sm font-bold uppercase tracking-wider text-[#666]">
                    Nenhuma área neste filtro.
                  </p>
                ) : (
                  visibleTopics.map((t) => (
                    <div
                      key={t.topicId}
                      id={`area-${t.topicId}`}
                      className="mb-4 break-inside-avoid"
                    >
                      <TopicBlock
                        topic={t}
                        onOpen={() => setOpenTopic(t)}
                      />
                    </div>
                  ))
                )}
              </section>
            </>
          )}

          <PressCoverage items={pressItems} updatedAt={pressUpdatedAt} />
        </div>
      </div>

      <TopicDetailModal
        topic={openTopic}
        sourceFileName={analysis?.sourceFileName}
        onClose={() => setOpenTopic(null)}
      />
      <AgendaDetailModal
        agenda={openAgenda}
        sourceFileName={analysis?.sourceFileName}
        onClose={() => setOpenAgenda(null)}
      />
    </div>
  );
}


function FilterChip({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex cursor-pointer items-center gap-2 border-2 border-black px-3 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition ${
        active
          ? "bg-black text-white"
          : "bg-white hover:bg-black hover:text-white"
      }`}
    >
      {label}
      {badge ? (
        <span
          className={`border px-1.5 py-0.5 text-[9px] tracking-wide ${
            active
              ? "border-white/40"
              : "border-black/30 group-hover:border-white/40"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function HighlightList({
  title,
  items,
  emphasize,
}: {
  title: string;
  items: string[];
  emphasize?: boolean;
}) {
  return (
    <div
      className={`border-2 border-black p-4 sm:p-5 ${
        emphasize ? "bg-black text-white sm:col-span-1" : "bg-white"
      }`}
    >
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.length === 0 ? (
          <li className={`text-sm ${emphasize ? "text-white/60" : "text-[#666]"}`}>
            Sem itens
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item}
              className={`text-sm font-medium leading-snug ${
                emphasize ? "text-white/95" : ""
              }`}
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
