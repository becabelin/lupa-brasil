"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { BrasilLoading } from "@/components/brasil-loading";
import { useAccessibility } from "@/components/accessibility";
import {
  allowGate,
  closeIntroSplash,
  lockShell,
  markSessionIntroDone,
  openIntroSplash,
  openReadingGateAttr,
  sessionIntroDone,
  unlockShell,
} from "@/lib/entry-flow";
import { VOICE } from "@/data/voice";

const INTRO_MS = 2200;
const INTRO_MS_REDUCED = 350;

function bootWantsSplash() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.introSplash === "open";
}

/**
 * Entrada: splash (1× por sessão) → gate (se ainda não escolheu) → home.
 * O shell fica travado o tempo todo; a home não pisca.
 */
export function SiteIntroSplash() {
  const { readingChosen, prefsReady } = useAccessibility();
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (bootWantsSplash()) setShow(true);
  }, []);

  useEffect(() => {
    if (!prefsReady) return;

    if (sessionIntroDone()) {
      closeIntroSplash();
      if (!readingChosen) {
        allowGate();
        openReadingGateAttr();
        lockShell();
      } else {
        unlockShell();
      }
      setShow(false);
      return;
    }

    openIntroSplash();
    setShow(true);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? INTRO_MS_REDUCED : INTRO_MS;

    const t = window.setTimeout(() => {
      markSessionIntroDone();
      closeIntroSplash();
      setShow(false);
      if (!readingChosen) {
        allowGate();
        openReadingGateAttr();
        lockShell();
      } else {
        unlockShell();
      }
    }, ms);

    return () => {
      window.clearTimeout(t);
    };
  }, [prefsReady, readingChosen]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[95] bg-black"
      role="status"
      aria-live="polite"
      aria-label={VOICE.tagline}
    >
      <BrasilLoading label={VOICE.tagline} className="h-full" pixelSize={48} />
    </div>
  );
}
