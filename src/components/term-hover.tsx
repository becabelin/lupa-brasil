"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useAccessibility } from "@/components/accessibility";
import {
  explainerHoverBlurb,
  explainerPath,
  type ExplainerHoverCard,
} from "@/data/explainers";

type Props = {
  explainer: ExplainerHoverCard;
  children: string;
};

type Pos = { top: number; left: number; width: number };

/**
 * Termo sublinhado com mini card no hover/focus.
 * Posição fixed, colada à viewport (não sai da tela).
 */
export function TermHover({ explainer, children }: Props) {
  const { readingLevel } = useAccessibility();
  const blurb = explainerHoverBlurb(explainer, readingLevel);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const tipId = useId();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    const place = () => {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      if (!trigger || !tip) return;

      const pad = 12;
      const gap = 8;
      const rect = trigger.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(tipRect.width || 288, vw - pad * 2);
      const tipH = tipRect.height || 120;

      let left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(pad, Math.min(left, vw - width - pad));

      const spaceAbove = rect.top - pad;
      const spaceBelow = vh - rect.bottom - pad;
      const need = tipH + gap;

      // Preferir abaixo quando em cima cobriria o título / topo da tela
      // (clamp em pad deixava o card por cima do nome da pessoa).
      let top: number;
      const fitsAbove = spaceAbove >= need;
      const fitsBelow = spaceBelow >= need;

      if (fitsBelow && (!fitsAbove || spaceBelow >= spaceAbove)) {
        top = rect.bottom + gap;
      } else if (fitsAbove) {
        top = rect.top - tipH - gap;
      } else if (spaceBelow >= spaceAbove) {
        top = Math.min(rect.bottom + gap, vh - tipH - pad);
        top = Math.max(pad, top);
      } else {
        top = Math.max(pad, rect.top - tipH - gap);
      }

      setPos({
        top,
        left,
        width,
      });
    };

    place();
    const id = requestAnimationFrame(place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, explainer.slug, blurb]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <Link
        ref={triggerRef}
        href={explainerPath(explainer)}
        className="underline decoration-2 underline-offset-2 decoration-current/40 transition hover:decoration-current [.lupa-on-dark_&]:decoration-white/40 [.lupa-on-dark_&]:hover:decoration-white"
        aria-describedby={open ? tipId : undefined}
      >
        {children}
      </Link>
      {open ? (
        <span
          ref={tipRef}
          id={tipId}
          role="tooltip"
          style={
            pos
              ? {
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  zIndex: 80,
                }
              : {
                  position: "fixed",
                  top: -9999,
                  left: -9999,
                  width: "min(18rem, calc(100vw - 1.5rem))",
                  zIndex: 80,
                  visibility: "hidden",
                }
          }
          className="border-2 border-black bg-white p-3 text-left shadow-[var(--shadow-lift)]"
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
            {explainer.kind === "caso" ? "Caso" : "Glossário"}
          </span>
          <span className="mt-1 block break-words font-[family-name:var(--font-display)] text-lg uppercase leading-none tracking-tight">
            {explainer.title}
          </span>
          <span className="mt-2 block break-words text-xs font-medium leading-snug text-[#333]">
            {blurb}
          </span>
          <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider">
            Abrir página →
          </span>
        </span>
      ) : null}
    </span>
  );
}
