"use client";

import { useEffect, useId, useState } from "react";
import { VOICE } from "@/data/voice";

const STORAGE_KEY = "lupa-mesa-tutorial-v1";

type Step = {
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    title: VOICE.mesa.tutWelcomeTitle,
    body: VOICE.mesa.tutWelcomeBody,
  },
  {
    title: VOICE.mesa.tutTabsTitle,
    body: VOICE.mesa.tutTabsBody,
  },
  {
    title: VOICE.mesa.tutListTitle,
    body: VOICE.mesa.tutListBody,
  },
  {
    title: VOICE.mesa.tutDetailTitle,
    body: VOICE.mesa.tutDetailBody,
  },
  {
    title: VOICE.mesa.tutLinksTitle,
    body: VOICE.mesa.tutLinksBody,
  },
];

export function wasMesaTutorialSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markMesaTutorialSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
};

/**
 * Tutorial da mesa: passos curtos na primeira visita (e de novo pelo botão ?).
 */
export function MesaTutorial({ open, onClose, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const titleId = useId();

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const last = step >= STEPS.length - 1;
  const current = STEPS[step] ?? STEPS[0];

  return (
    <div
      className="absolute inset-0 z-[110] flex items-end justify-center bg-black/80 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-md border-2 border-white bg-black p-5 shadow-[var(--shadow-lift)] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
          {VOICE.mesa.tutEyebrow} · {step + 1}/{STEPS.length}
        </p>
        <h2
          id={titleId}
          className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.92] tracking-tight sm:text-4xl"
        >
          {current.title}
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed text-white/75">
          {current.body}
        </p>

        <div className="mt-4 flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={STEPS[i].title}
              className={`h-1 flex-1 ${i <= step ? "bg-white" : "bg-white/20"}`}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="border border-white/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
            >
              {VOICE.mesa.tutBack}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="border border-white/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
            >
              {VOICE.mesa.tutSkip}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (last) {
                markMesaTutorialSeen();
                onFinish();
              } else {
                setStep((s) => s + 1);
              }
            }}
            className="ml-auto border-2 border-white bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white"
          >
            {last ? VOICE.mesa.tutDone : VOICE.mesa.tutNext}
          </button>
        </div>
      </div>
    </div>
  );
}
