"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { HEADER_LINKS } from "@/data/nav";
import { useFocusTrap } from "@/lib/use-focus-trap";

function linkActive(pathname: string, href: string) {
  if (href === "/eleicoes") {
    return (
      pathname === "/eleicoes" ||
      pathname.startsWith("/candidatos") ||
      pathname.startsWith("/comparar") ||
      pathname.startsWith("/buscar")
    );
  }
  if (href === "/noticias") {
    return pathname === "/noticias" || pathname.startsWith("/noticias/");
  }
  if (href === "/glossario") {
    return pathname === "/glossario" || pathname.startsWith("/glossario/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`lupa-nav-link ${className}`}
    >
      {label}
    </Link>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(open, panelRef, {
    restoreFocus: true,
    lockScroll: true,
    onEscape: () => setOpen(false),
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className="flex items-center gap-1">
      <nav
        aria-label="Principal"
        className="hidden items-center gap-3 lg:flex"
      >
        {HEADER_LINKS.map((l) => (
          <NavLink
            key={l.href}
            href={l.href}
            label={l.label}
            active={linkActive(pathname, l.href)}
          />
        ))}
      </nav>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="border-2 border-black bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition hover:bg-black hover:text-white sm:text-xs lg:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? "Fechar" : "Menu"}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          tabIndex={-1}
          className="fixed inset-x-0 top-[6.75rem] z-50 max-h-[min(70vh,calc(100dvh-7rem))] overflow-y-auto border-b-2 border-black bg-white outline-none sm:top-[7.5rem] lg:hidden"
        >
          <nav
            aria-label="Principal"
            className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4"
          >
            <ul className="flex flex-col">
              {HEADER_LINKS.map((l) => (
                <li key={l.href} className="border-b border-black/10 last:border-b-0">
                  <NavLink
                    href={l.href}
                    label={l.label}
                    active={linkActive(pathname, l.href)}
                    onNavigate={() => setOpen(false)}
                    className="block w-full py-3.5 text-base tracking-[0.14em]"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
