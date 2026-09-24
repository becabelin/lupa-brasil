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
 * Banner de cookies/privacidade. Só na primeira visita, depois do gate de leitura.
 * Depois: link Privacidade no rodapé.
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
      role="dialog"
      aria-labelledby="lupa-cookie-title"
      aria-describedby="lupa-cookie-body"
      className="fixed inset-x-0 bottom-0 z-[70] border-t-2 border-white bg-black text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <p
            id="lupa-cookie-title"
            className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80"
          >
            {V.eyebrow}
          </p>
          <p
            id="lupa-cookie-body"
            className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-white/90"
          >
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
          className="shrink-0 border-2 border-white bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white"
        >
          {V.cta}
        </button>
      </div>
    </div>
  );
}
