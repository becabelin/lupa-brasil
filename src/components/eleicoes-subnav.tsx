"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ELEICOES_LINKS } from "@/data/nav";

/** Subnav da seção Eleições 2026 (candidatos, comparar, áreas). */
export function EleicoesSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Eleições 2026"
      className="border-b-2 border-black bg-[var(--wash)]"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 sm:px-6">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
          Presidência
        </span>
        {ELEICOES_LINKS.map((l) => {
          const active =
            l.href === "/eleicoes"
              ? pathname === "/eleicoes" || pathname.startsWith("/candidatos")
              : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : undefined}
              className="lupa-nav-link lupa-nav-link-sm"
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
