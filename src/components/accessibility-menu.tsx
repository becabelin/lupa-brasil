"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AccessibilityControls } from "@/components/accessibility-controls";
import { useFocusTrap } from "@/lib/use-focus-trap";

type Props = {
  /** No rodapé escuro: botão invertido. */
  placement?: "footer" | "inline";
};

const PANEL_W = 288;
const GAP = 8;
const MARGIN = 12;

type Pos = { top: number; left: number; maxHeight: number };

/**
 * Menu Aa. Painel em portal + posição/altura calculadas pra caber na tela.
 */
export function AccessibilityMenu({ placement = "footer" }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const onFooter = placement === "footer";

  useFocusTrap(open, panelRef, {
    restoreFocus: true,
    lockScroll: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    const place = () => {
      const btn = btnRef.current;
      if (!btn) return;

      const r = btn.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const pw = Math.min(PANEL_W, vw - MARGIN * 2);

      const spaceAbove = r.top - MARGIN - GAP;
      const spaceBelow = vh - r.bottom - MARGIN - GAP;
      const openUp = spaceAbove >= 220 || spaceAbove >= spaceBelow;
      const maxHeight = Math.max(180, openUp ? spaceAbove : spaceBelow);

      const ph = Math.min(
        panelRef.current?.offsetHeight || maxHeight,
        maxHeight,
      );

      let top = openUp ? r.top - ph - GAP : r.bottom + GAP;
      if (top < MARGIN) top = MARGIN;
      if (top + ph > vh - MARGIN) top = Math.max(MARGIN, vh - ph - MARGIN);

      let left = r.right - pw;
      left = Math.min(left, vw - pw - MARGIN);
      left = Math.max(MARGIN, left);

      setPos({ top, left, maxHeight });
    };

    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
  }, [open, pos]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={
          onFooter
            ? "border border-white/40 bg-transparent px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 transition hover:bg-white hover:text-black sm:text-xs"
            : "border-2 border-black bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition hover:bg-black hover:text-white sm:text-xs"
        }
        title="Acessibilidade"
        aria-label="Acessibilidade"
      >
        Aa
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Preferências de acessibilidade"
              tabIndex={-1}
              style={
                pos
                  ? {
                      top: pos.top,
                      left: pos.left,
                      maxHeight: pos.maxHeight,
                    }
                  : { top: -9999, left: -9999 }
              }
              className="fixed z-[80] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto border-2 border-black bg-white p-4 text-black shadow-[var(--shadow-lift)] outline-none"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                Acessibilidade
              </p>
              <div className="mt-4">
                <AccessibilityControls />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
