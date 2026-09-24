"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccessibility } from "@/components/accessibility";
import {
  acceptCookieConsent,
  hasCookieConsent,
} from "@/lib/client-prefs";
import { VOICE } from "@/data/voice";

/**
 * Faixa compacta de cookies. Só na 1ª visita, depois do gate.
 * Depois: Privacidade no rodapé.
 */
export function CookieConsent() {
  const { readingChosen } = useAccessibility();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!hasCookieConsent());
    setReady(true);
  }, []);

  if (!ready || !readingChosen || !open) return null;

  const V = VOICE.cookies;

  return (
    <div
      role="region"
      aria-label={V.eyebrow}
      className="lupa-cookie-banner pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center p-3 sm:justify-end sm:p-4"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-end gap-3 border-2 border-white bg-black p-3 text-white shadow-[var(--shadow-lift)] sm:max-w-sm sm:p-3.5">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
            {V.eyebrow}
          </p>
          <p className="mt-1 text-xs font-medium leading-snug text-white/90">
            {V.body}{" "}
            <Link href="/privacidade" className="lupa-text-link text-white">
              {V.link}
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            acceptCookieConsent();
            setOpen(false);
          }}
          className="shrink-0 border-2 border-white bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-black hover:text-white"
        >
          {V.cta}
        </button>
      </div>
    </div>
  );
}
