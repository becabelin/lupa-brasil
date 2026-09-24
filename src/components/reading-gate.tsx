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
 * Primeira visita: tela preta + modal compacto (sem scroll).
 * Tema/texto/contraste escolhidos aqui valem no rodapé (Aa).
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
    lockScroll: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.readingGate = "open";
    return () => {
      delete document.documentElement.dataset.readingGate;
    };
  }, [open]);

  if (!open) return null;

  const active = picked ?? readingLevel;
  const V = VOICE.leitura;

  const enter = (level: ReadingLevel) => {
    setReadingLevel(level);
  };

  return (
    <div
      className="lupa-reading-gate fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4"
      role="presentation"
    >
      <div
        ref={panelRef}
        className="lupa-reading-gate-panel flex max-h-[min(100dvh-1.5rem,36rem)] w-full max-w-lg flex-col overflow-y-auto border-2 p-4 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leitura-titulo"
      >
        <p className="lupa-reading-gate-muted text-[9px] font-bold uppercase tracking-[0.22em]">
          {V.eyebrow}
        </p>
        <h2
          id="leitura-titulo"
          className="mt-1 font-[family-name:var(--font-display)] text-[1.75rem] uppercase leading-[0.9] tracking-tight sm:text-3xl"
        >
          {V.title}
        </h2>
        <p className="lupa-reading-gate-body mt-1.5 text-xs font-medium leading-snug sm:text-[13px]">
          {V.lede}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <ToneCard
            pressed={active === "simples"}
            onClick={() => setPicked("simples")}
            tag={V.simplesTag}
            title={V.simplesTitle}
            blurb={V.simplesBlurb}
          />
          <ToneCard
            pressed={active === "completo"}
            onClick={() => setPicked("completo")}
            tag={V.completoTag}
            title={V.completoTitle}
            blurb={V.completoBlurb}
          />
        </div>

        <div className="lupa-reading-gate-rule mt-4 border-t pt-3">
          <p className="lupa-reading-gate-muted text-[9px] font-bold uppercase tracking-[0.2em]">
            {V.a11yTitle}
          </p>
          <div className="mt-2">
            <AccessibilityControls
              showReading={false}
              compactFont
              dense
            />
          </div>
        </div>

        <button
          ref={primaryCtaRef}
          type="button"
          onClick={() => enter(active)}
          className="lupa-reading-gate-cta mt-4 w-full border-2 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition sm:text-sm"
        >
          {V.cta}
        </button>
        <p className="lupa-reading-gate-muted mt-2 text-center text-[10px] font-medium leading-snug">
          {V.footnote}
        </p>
      </div>
    </div>
  );
}

function ToneCard({
  pressed,
  onClick,
  tag,
  title,
  blurb,
}: {
  pressed: boolean;
  onClick: () => void;
  tag: string;
  title: string;
  blurb: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`lupa-reading-gate-tone group border-2 px-2.5 py-2.5 text-left transition sm:px-3 sm:py-3 ${
        pressed ? "is-on" : ""
      }`}
    >
      <span className="lupa-reading-gate-tone-tag block text-[8px] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[9px]">
        {tag}
      </span>
      <span className="mt-1 block font-[family-name:var(--font-display)] text-xl uppercase leading-none sm:text-2xl">
        {title}
      </span>
      <span className="lupa-reading-gate-tone-blurb mt-1.5 block text-[10px] font-medium leading-snug sm:text-[11px]">
        {blurb}
      </span>
    </button>
  );
}
