"use client";

import dynamic from "next/dynamic";
import type { CaseInvestigation } from "@/data/case-investigations";
import type { MesaFocus, MesaTab } from "@/lib/mesa-url";
import { BrasilLoading } from "@/components/brasil-loading";

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

export function CaseInvestigationBoardLazy(props: Props) {
  return <CaseInvestigationBoard {...props} />;
}
