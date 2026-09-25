"use client";

import { useId, useRef } from "react";
import { getAgenda } from "@/data/agendas";
import type { AgendaAnalysis } from "@/lib/types";
import { LinkedText } from "@/components/linked-text";
import { PlanQuotes } from "@/components/plan-quotes";
import { PLAN_DEPTH_LABEL, PLAN_DEPTH_LEGEND, absentPlanSummary } from "@/lib/plan-depth";
import { useFocusTrap } from "@/lib/use-focus-trap";

type Props = {
  agenda: AgendaAnalysis | null;
  candidateName?: string;
  sourceFileName?: string;
  onClose: () => void;
};

export function AgendaDetailModal({
  agenda,
  candidateName,
  sourceFileName,
  onClose,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(agenda);

  useFocusTrap(open, panelRef, { initialFocusRef: closeRef, onEscape: onClose });

  if (!agenda) return null;
  const meta = getAgenda(agenda.agendaId);
  const topicLabel = meta?.label ?? agenda.agendaId;
  const summaryText =
    agenda.depth === "ausente"
      ? absentPlanSummary({ candidateName, topicLabel })
      : agenda.summary;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col border-2 border-black bg-white shadow-[var(--shadow-lift)] sm:max-h-[85vh]"
      >
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 sm:px-6">
          <p
            id={titleId}
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
          >
            Pauta em destaque
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border-2 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
          >
            Fechar
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
              {meta?.label ?? agenda.agendaId}
            </h3>
            <span className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
              {PLAN_DEPTH_LABEL[agenda.depth]}
            </span>
          </div>
          {meta ? (
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#666]">
              {meta.group} · {meta.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#666]">
            {PLAN_DEPTH_LEGEND}
          </p>
          <p className="mt-4 text-base font-medium leading-relaxed text-[#222]">
            <LinkedText text={summaryText} />
          </p>
          {agenda.quotes.length > 0 ? (
            <div className="mt-5">
              <PlanQuotes quotes={agenda.quotes} />
            </div>
          ) : agenda.depth !== "ausente" ? (
            <p className="mt-5 text-sm font-medium leading-relaxed text-[#666]">
              Esta análise ainda não trouxe o trecho literal do PDF que
              fundamenta o resumo. Sem citação, o Lupa não aponta a página.
            </p>
          ) : null}
          {agenda.proposals.length > 0 ? (
            <div
              className={`mt-5 ${agenda.quotes.length > 0 ? "border-t-2 border-black pt-4" : ""}`}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.16em]">
                O que o plano diz
              </h4>
              <ul className="mt-3 space-y-3">
                {agenda.proposals.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 text-sm font-medium leading-relaxed before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:bg-black before:content-['']"
                  >
                    <LinkedText text={p} />
                  </li>
                ))}
              </ul>
            </div>
          ) : agenda.depth !== "ausente" ? (
            <p className="mt-5 text-sm font-medium text-[#666]">
              Nenhuma medida concreta listada nesta pauta. O que há no documento
              está nos trechos acima, quando disponíveis.
            </p>
          ) : null}
          {sourceFileName ? (
            <p className="mt-8 text-[11px] font-medium leading-relaxed text-[#666]">
              Extrato factual do plano oficial ({sourceFileName}). A pauta é
              usada só como lente de leitura, sem opinião editorial.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
