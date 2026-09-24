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
 * Primeira visita: tela preta + modal. Só depois abre o site.
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
      className="lupa-reading-gate fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        ref={panelRef}
        className="lupa-reading-gate-panel max-h-[min(92vh,44rem)] w-full max-w-lg overflow-y-auto border-2 p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leitura-titulo"
      >
        <p className="lupa-reading-gate-muted text-[10px] font-bold uppercase tracking-[0.22em]">
          {V.eyebrow}
        </p>
        <h2
          id="leitura-titulo"
          className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.92] tracking-tight sm:text-4xl"
        >
          {V.title}
        </h2>
        <p className="lupa-reading-gate-body mt-3 text-sm font-medium leading-relaxed">
          {V.lede}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
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

        <div className="lupa-reading-gate-rule mt-8 border-t-2 pt-6">
          <p className="lupa-reading-gate-muted text-[10px] font-bold uppercase tracking-[0.2em]">
            {V.a11yTitle}
          </p>
          <p className="lupa-reading-gate-muted mt-1 text-[11px] font-medium leading-snug">
            {V.a11yLede}
          </p>
          <div className="mt-4">
            <AccessibilityControls showReading={false} compactFont />
          </div>
        </div>

        <button
          ref={primaryCtaRef}
          type="button"
          onClick={() => enter(active)}
          className="lupa-reading-gate-cta mt-6 w-full border-2 px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] transition"
        >
          {V.cta}
        </button>
        <p className="lupa-reading-gate-muted mt-3 text-[11px] font-medium">
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
      className={`lupa-reading-gate-tone group border-2 px-4 py-4 text-left transition ${
        pressed ? "is-on" : ""
      }`}
    >
      <span className="lupa-reading-gate-tone-tag block text-[10px] font-bold uppercase tracking-[0.18em]">
        {tag}
      </span>
      <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl uppercase leading-none">
        {title}
      </span>
      <span className="lupa-reading-gate-tone-blurb mt-2 block text-xs font-medium leading-snug">
        {blurb}
      </span>
    </button>
  );
}
