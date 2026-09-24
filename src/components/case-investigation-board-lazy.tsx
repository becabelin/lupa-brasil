"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { CaseInvestigation } from "@/data/case-investigations";
import type { MesaFocus, MesaTab } from "@/lib/mesa-url";
import { BrasilLoading } from "@/components/brasil-loading";

const MESA_SPLASH_MS = 1800;
const MESA_SPLASH_MS_REDUCED = 300;

const CaseInvestigationBoard = dynamic(
  () =>
    import("@/components/case-investigation-board").then(
      (m) => m.CaseInvestigationBoard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[100] bg-black text-white">
        <BrasilLoading label="Abrindo a mesa…" className="h-full" />
      </div>
    ),
  },
);

type Props = {
  slug: string;
  caseTitle: string;
  data: CaseInvestigation;
  initialTab: MesaTab;
  initialFocus: MesaFocus | null;
  openHub?: boolean;
  dossierHref: string;
  ctaBack: string;
  disclaimer: string;
};

/**
 * Code-split da mesa + splash mínimo com o grid do Brasil
 * (mesmo se o chunk já estiver em cache).
 */
export function CaseInvestigationBoardLazy(props: Props) {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? MESA_SPLASH_MS_REDUCED : MESA_SPLASH_MS;
    const t = window.setTimeout(() => setSplash(false), ms);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <CaseInvestigationBoard {...props} />
      {splash ? (
        <div
          className="fixed inset-0 z-[110] bg-black"
          role="status"
          aria-live="polite"
          aria-label="Abrindo a mesa"
        >
          <BrasilLoading label="Abrindo a mesa…" className="h-full" />
        </div>
      ) : null}
    </>
  );
}
