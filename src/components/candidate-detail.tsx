"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type Chapter = { id: string; label: string };

export function CandidateDetail({
  candidate,
  analysis,
  document: planDocument,
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

  const hasQuemE =
    Boolean(candidate.bio) || Boolean(candidate.education);
  const hasTrajetoria = Boolean(candidate.career?.length);
  const hasCasos =
    relatedCases.length > 0 || pressItems.length > 0;
  const hasFontes =
    Boolean(candidate.bioSources?.length) || Boolean(analysis);

  const chapters = useMemo(() => {
    const items: Chapter[] = [];
    if (hasQuemE) items.push({ id: "quem-e", label: "Quem é" });
    if (hasTrajetoria) {
      items.push({ id: "trajetoria", label: "Trajetória" });
    }
    items.push({ id: "plano", label: "Plano" });
    if (hasCasos) {
      items.push({ id: "casos", label: "Casos e coberturas" });
    }
    if (hasFontes) items.push({ id: "fontes", label: "Fontes" });
    return items;
  }, [hasQuemE, hasTrajetoria, hasCasos, hasFontes]);

  const [activeId, setActiveId] = useState<string>(
    chapters[0]?.id ?? "plano",
  );

  useEffect(() => {
    if (chapters.length === 0) return;
    const nodes = chapters
      .map((c) => globalThis.document.getElementById(c.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    for (const n of nodes) observer.observe(n);
    return () => observer.disconnect();
  }, [chapters]);

  function scrollToChapter(id: string) {
    const el = globalThis.document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href="/eleicoes"
        className="lupa-nav-link text-sm tracking-widest"
      >
        ← Eleições 2026
      </Link>

      {/* Hero */}
      <header className="lupa-soft mt-6 overflow-hidden border-2 border-black bg-white">
        <div className="grid lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)]">
          <div className="relative aspect-[4/5] w-full bg-[#ddd] lg:aspect-auto lg:min-h-[420px]">
            {candidate.photo ? (
              <Image
                src={candidate.photo}
                alt={candidate.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 420px"
                quality={90}
                priority
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center bg-black text-6xl font-bold text-white lg:min-h-[420px]">
                {candidate.party.slice(0, 3)}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center border-t-2 border-black p-6 sm:p-8 lg:border-t-0 lg:border-l-2 lg:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2a2a2a]">
              {candidate.party}
              {candidate.partyFull ? ` · ${candidate.partyFull}` : ""}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,5rem)] uppercase leading-[0.9] tracking-tight">
              {candidate.name}
            </h1>

            {candidate.vice ? (
              <p className="mt-5 text-sm font-semibold leading-snug sm:text-base">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a2a2a]">
                  Vice
                </span>
                {candidate.vice}
                {candidate.viceParty ? ` (${candidate.viceParty})` : ""}
              </p>
            ) : null}

            {candidate.bio ? (
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#222] sm:text-lg">
                {candidate.bio}
              </p>
            ) : (
              <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-[#2a2a2a]">
                Ficha da pessoa em elaboração. O plano, quando houver, fica
                nos capítulos abaixo.
              </p>
            )}

            {candidate.socials && candidate.socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {candidate.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lupa-soft inline-block border-2 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </header>

      {/* Índice horizontal sticky */}
      {chapters.length > 0 ? (
        <nav
          aria-label="Capítulos da ficha"
          className="sticky top-[6.75rem] z-30 -mx-4 mt-0 border-b-2 border-black bg-white/95 backdrop-blur-sm sm:top-[7.25rem] sm:-mx-6"
        >
          <div className="overflow-x-auto px-4 sm:px-6">
            <ul className="flex min-w-max gap-1 py-3">
              {chapters.map((ch) => {
                const active = ch.id === activeId;
                return (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => scrollToChapter(ch.id)}
                      className={`lupa-soft whitespace-nowrap border-2 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                        active
                          ? "bg-black text-white"
                          : "bg-white hover:bg-black hover:text-white"
                      }`}
                    >
                      {ch.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}

      <div className="mt-10 space-y-16 sm:space-y-20">
        {/* Quem é */}
        {hasQuemE ? (
          <section id="quem-e" className="scroll-mt-40">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
              Capítulo
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Quem é
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {candidate.bio ? (
                <div className="lupa-soft border-2 border-black bg-white p-5 sm:col-span-2 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a2a2a]">
                    Bio
                  </p>
                  <p className="mt-3 text-base font-medium leading-relaxed text-[#222] sm:text-lg">
                    {candidate.bio}
                  </p>
                </div>
              ) : null}

              {candidate.education ? (
                <div className="lupa-soft border-2 border-black bg-white p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a2a2a]">
                    Formação / ofício
                  </p>
                  <p className="mt-3 text-base font-medium leading-snug text-[#222]">
                    {candidate.education}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Trajetória */}
        {hasTrajetoria ? (
          <section id="trajetoria" className="scroll-mt-40">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
              Capítulo
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Trajetória
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#2a2a2a]">
              Cargos, ofícios e papéis públicos. Sem juízo sobre o plano.
            </p>

            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {candidate.career!.map((beat, i) => (
                <li
                  key={`${beat.when}-${beat.text.slice(0, 24)}`}
                  className="lupa-soft flex gap-4 border-2 border-black bg-white p-4 sm:p-5"
                >
                  <span className="shrink-0 font-[family-name:var(--font-display)] text-2xl uppercase leading-none text-black/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                      {beat.when}
                    </p>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#222] sm:text-base">
                      {beat.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Plano */}
        <section id="plano" className="scroll-mt-40">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
            Capítulo
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
            Plano
          </h2>

          {!analysis ? (
            <div className="lupa-soft mt-6 border-2 border-dashed border-black p-10 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase">
                Análise ainda não disponível
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm font-medium text-[#2a2a2a]">
                {planDocument
                  ? "O documento já foi enviado. Aguardando processamento."
                  : "O plano de governo deste candidato ainda não foi enviado."}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-10">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
                  O que o plano prioriza
                </h3>
                <p className="lupa-prose-wide mt-4 text-base sm:text-lg">
                  {analysis.overview}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
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
              </div>

              {agendasSorted.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
                      Pautas em destaque
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#2a2a2a]">
                      Debates públicos atuais: o que este plano diz (ou não
                      diz) sobre cada um. Clique para abrir.
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#2a2a2a]">
                      {PLAN_DEPTH_LEGEND}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {agendasSorted.map((a) => {
                      const meta = HOT_AGENDAS.find(
                        (x) => x.id === a.agendaId,
                      );
                      return (
                        <button
                          key={a.agendaId}
                          type="button"
                          onClick={() => setOpenAgenda(a)}
                          className="lupa-soft group flex h-full flex-col border-2 border-black bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2a2a2a]">
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
                </div>
              ) : null}

              <div className="lupa-soft border-2 border-black bg-[#f5f5f5] p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                      Por área
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#2a2a2a]">
                      Clique numa área para ver propostas e trechos do plano.
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#2a2a2a]">
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
              </div>

              <div
                className={
                  visibleTopics.length === 0
                    ? undefined
                    : "columns-1 gap-4 sm:columns-2 [column-fill:_balance]"
                }
              >
                {visibleTopics.length === 0 ? (
                  <p className="lupa-soft border-2 border-dashed border-black p-8 text-center text-sm font-bold uppercase tracking-wider text-[#2a2a2a]">
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
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/comparar"
              className="lupa-soft inline-block border-2 border-black bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
            >
              Comparar planos →
            </Link>
          </div>
        </section>

        {/* Casos e coberturas */}
        {hasCasos ? (
          <section id="casos" className="scroll-mt-40 space-y-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
                Capítulo
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
                Casos e coberturas
              </h2>
            </div>

            {relatedCases.length > 0 ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a2a2a]">
                  Casos no Lupa
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedCases.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={explainerPath(c)}
                        className="lupa-soft group flex h-full flex-col border-2 border-black bg-white p-5 transition hover:bg-black hover:text-white"
                      >
                        <h3 className="font-[family-name:var(--font-display)] text-xl uppercase leading-[0.95] tracking-tight">
                          {c.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-[#2a2a2a] group-hover:text-white/80">
                          {c.teaser}
                        </p>
                        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2 group-hover:no-underline">
                          Abrir caso →
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <PressCoverage
              items={pressItems}
              updatedAt={pressUpdatedAt}
              excludePolls={true}
            />
          </section>
        ) : null}

        {/* Fontes */}
        {hasFontes ? (
          <section id="fontes" className="scroll-mt-40">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
              Capítulo
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Fontes
            </h2>

            <div className="lupa-soft mt-6 space-y-5 border-2 border-black bg-white p-5 sm:p-6">
              {candidate.bioSources && candidate.bioSources.length > 0 ? (
                <div>
                  <p className="text-sm font-medium leading-relaxed text-[#2a2a2a]">
                    Origem da ficha (também em{" "}
                    <Link
                      href="/fontes#fichas"
                      className="lupa-text-link text-[#222]"
                    >
                      Fontes
                    </Link>
                    ):
                  </p>
                  <ul className="mt-3 space-y-2">
                    {candidate.bioSources.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lupa-text-link break-words text-sm font-medium text-[#222]"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed text-[#2a2a2a]">
                  Lista completa em{" "}
                  <Link
                    href="/fontes#fichas"
                    className="lupa-text-link text-[#222]"
                  >
                    Fontes
                  </Link>
                  .
                </p>
              )}

              {analysis ? (
                <p className="border-t border-black/20 pt-5 text-sm font-medium leading-relaxed text-[#2a2a2a]">
                  Síntese do plano por IA a partir de{" "}
                  <span className="font-semibold text-[#222]">
                    {analysis.sourceFileName}
                  </span>
                  . Extrato do documento oficial, sem opinião editorial. Não
                  substitui a leitura do plano.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}
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
      className={`lupa-soft group inline-flex cursor-pointer items-center gap-2 border-2 border-black px-3 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition ${
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
      className={`lupa-soft border-2 border-black p-4 sm:p-5 ${
        emphasize ? "bg-black text-white sm:col-span-1" : "bg-white"
      }`}
    >
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.length === 0 ? (
          <li
            className={`text-sm ${
              emphasize ? "text-white/60" : "text-[#2a2a2a]"
            }`}
          >
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
