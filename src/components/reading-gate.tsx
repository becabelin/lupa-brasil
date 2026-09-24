"use client";

import { useEffect, useRef, useState } from "react";
import {
  useAccessibility,
  type ReadingLevel,
} from "@/components/accessibility";
import { AccessibilityControls } from "@/components/accessibility-controls";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { VOICE } from "@/data/voice";

/**
 * Primeira visita: leitura + tema, texto e contraste.
 * Depois, dá pra mudar no rodapé (Aa).
 */
export function ReadingGate() {
  const { setReadingLevel, readingChosen, readingLevel } = useAccessibility();
  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState<ReadingLevel | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const open = mounted && !readingChosen;

  useFocusTrap(open, panelRef, {
    restoreFocus: false,
    initialFocusRef: primaryCtaRef,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open) return null;

  const active = picked ?? readingLevel;
  const V = VOICE.leitura;

  const enter = (level: ReadingLevel) => {
    setReadingLevel(level);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
    >
      <div
        ref={panelRef}
        className="max-h-[min(92vh,44rem)] w-full max-w-lg overflow-y-auto border-2 border-black bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leitura-titulo"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
          {V.eyebrow}
        </p>
        <h2
          id="leitura-titulo"
          className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.92] tracking-tight sm:text-4xl"
        >
          {V.title}
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#333]">
          {V.lede}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPicked("simples")}
            aria-pressed={active === "simples"}
            className={`group border-2 border-black px-4 py-4 text-left transition ${
              active === "simples"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-[0.18em] ${
                active === "simples"
                  ? "text-white/70"
                  : "text-[#666] group-hover:text-white/70"
              }`}
            >
              {V.simplesTag}
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl uppercase leading-none">
              {V.simplesTitle}
            </span>
            <span
              className={`mt-2 block text-xs font-medium leading-snug ${
                active === "simples"
                  ? "text-white/90"
                  : "text-[#333] group-hover:text-white/90"
              }`}
            >
              {V.simplesBlurb}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPicked("completo")}
            aria-pressed={active === "completo"}
            className={`group border-2 border-black px-4 py-4 text-left transition ${
              active === "completo"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-[0.18em] ${
                active === "completo"
                  ? "text-white/70"
                  : "text-[#666] group-hover:text-white/70"
              }`}
            >
              {V.completoTag}
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl uppercase leading-none">
              {V.completoTitle}
            </span>
            <span
              className={`mt-2 block text-xs font-medium leading-snug ${
                active === "completo"
                  ? "text-white/90"
                  : "text-[#333] group-hover:text-white/90"
              }`}
            >
              {V.completoBlurb}
            </span>
          </button>
        </div>

        <div className="mt-8 border-t-2 border-black pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
            {V.a11yTitle}
          </p>
          <p className="mt-1 text-[11px] font-medium leading-snug text-[#666]">
            {V.a11yLede}
          </p>
          <div className="mt-4">
            <AccessibilityControls showReading={false} />
          </div>
        </div>

        <button
          ref={primaryCtaRef}
          type="button"
          onClick={() => enter(active)}
          className="mt-6 w-full border-2 border-black bg-black px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
        >
          {V.cta}
        </button>
        <p className="mt-3 text-[11px] font-medium text-[#666]">{V.footnote}</p>
      </div>
    </div>
  );
}
