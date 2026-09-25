"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
/** Duração do fade de saída (espelha o CSS). */
const EXIT_MS = 700;

function bootWantsSplash() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.introSplash === "open";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Entrada: splash (1× por sessão) → gate (se ainda não escolheu) → home.
 * Saída com fade; o que vem depois (gate ou home) já está por baixo.
 */
export function SiteIntroSplash() {
  const { readingChosen, prefsReady } = useAccessibility();
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<number | null>(null);
  const exitingRef = useRef(false);
  const readingChosenRef = useRef(readingChosen);
  readingChosenRef.current = readingChosen;

  useLayoutEffect(() => {
    if (bootWantsSplash()) setShow(true);
  }, []);

  useEffect(() => {
    return () => {
      if (exitTimer.current != null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  function finishExit() {
    exitingRef.current = false;
    setShow(false);
    setExiting(false);
    closeIntroSplash();
  }

  function beginExit() {
    if (exitingRef.current) return;
    exitingRef.current = true;

    markSessionIntroDone();
    const chosen = readingChosenRef.current;

    if (!chosen) {
      allowGate();
      openReadingGateAttr();
      lockShell();
      closeIntroSplash();
    } else {
      unlockShell();
      closeIntroSplash();
    }

    if (prefersReducedMotion()) {
      finishExit();
      return;
    }

    setExiting(true);
    exitTimer.current = window.setTimeout(finishExit, EXIT_MS);
  }

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
      setExiting(false);
      return;
    }

    openIntroSplash();
    setShow(true);
    setExiting(false);
    exitingRef.current = false;

    const ms = prefersReducedMotion() ? INTRO_MS_REDUCED : INTRO_MS;

    const t = window.setTimeout(() => {
      beginExit();
    }, ms);

    return () => {
      window.clearTimeout(t);
    };
    // Saída usa ref de readingChosen; o timer só arma uma vez por sessão.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsReady]);

  if (!show) return null;

  return (
    <div
      className={`lupa-intro-splash fixed inset-0 z-[95] bg-black ${
        exiting ? "is-out" : "is-in"
      }`}
      role="status"
      aria-live="polite"
      aria-label={VOICE.tagline}
      aria-hidden={exiting}
    >
      <div className="lupa-intro-splash-inner h-full w-full">
        <BrasilLoading
          label={VOICE.tagline}
          className="h-full"
          pixelSize={48}
        />
      </div>
    </div>
  );
}
