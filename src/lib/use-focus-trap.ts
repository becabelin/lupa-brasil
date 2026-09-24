"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trava o Tab dentro do container e foca o primeiro controle ao abrir.
 * `restoreFocus` devolve o foco ao elemento anterior ao fechar.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  options?: {
    restoreFocus?: boolean;
    lockScroll?: boolean;
    initialFocusRef?: RefObject<HTMLElement | null>;
    onEscape?: () => void;
  },
) {
  useEffect(() => {
    if (!active) return;

    const lockScroll = options?.lockScroll !== false;
    const prevOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusInitial = () => {
      const root = containerRef.current;
      if (!root) return;
      const preferred = options?.initialFocusRef?.current;
      if (preferred && root.contains(preferred)) {
        preferred.focus();
        return;
      }
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    };

    const raf = requestAnimationFrame(focusInitial);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && options?.onEscape) {
        e.preventDefault();
        options.onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const root = containerRef.current;
      if (!root) return;
      const nodes = [
        ...root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("aria-hidden") !== "true" &&
          el.offsetParent !== null,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey) {
        if (
          document.activeElement === first ||
          !root.contains(document.activeElement)
        ) {
          e.preventDefault();
          last.focus();
        }
      } else if (
        document.activeElement === last ||
        !root.contains(document.activeElement)
      ) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) document.body.style.overflow = prevOverflow;
      if (options?.restoreFocus !== false) {
        previouslyFocused?.focus?.();
      }
    };
  }, [
    active,
    containerRef,
    options?.restoreFocus,
    options?.lockScroll,
    options?.initialFocusRef,
    options?.onEscape,
  ]);
}
