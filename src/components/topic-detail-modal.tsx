"use client";

import { useId, useRef } from "react";
import type { TopicAnalysis } from "@/lib/types";
import { TopicBlock } from "@/components/topic-block";
import { useFocusTrap } from "@/lib/use-focus-trap";

type Props = {
  topic: TopicAnalysis | null;
  sourceFileName?: string;
  onClose: () => void;
};

export function TopicDetailModal({ topic, sourceFileName, onClose }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(topic);

  useFocusTrap(open, panelRef, { initialFocusRef: closeRef, onEscape: onClose });

  if (!topic) return null;

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
            Detalhe da área
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
          <TopicBlock topic={topic} variant="full" />
          {sourceFileName ? (
            <p className="mt-8 text-[11px] font-medium leading-relaxed text-[#666]">
              Extrato factual do plano oficial ({sourceFileName}). Sem opinião
              editorial. Não substitui a leitura do documento.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
