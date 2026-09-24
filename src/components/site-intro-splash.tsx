"use client";

import { useEffect, useState } from "react";
import { BrasilLoading } from "@/components/brasil-loading";
import { useAccessibility } from "@/components/accessibility";
import { VOICE } from "@/data/voice";

const SESSION_KEY = "lupa-intro";
const INTRO_MS = 2200;
const INTRO_MS_REDUCED = 350;

/**
 * Splash com grid pixelado ao entrar no site (1× por sessão),
 * depois do gate de leitura.
 */
export function SiteIntroSplash() {
  const { readingChosen } = useAccessibility();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!readingChosen) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setShow(true);
  }, [readingChosen]);

  useEffect(() => {
    if (!show) return;
    document.documentElement.dataset.introSplash = "open";
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? INTRO_MS_REDUCED : INTRO_MS;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setShow(false);
    }, ms);
    return () => {
      window.clearTimeout(t);
      delete document.documentElement.dataset.introSplash;
    };
  }, [show]);

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
