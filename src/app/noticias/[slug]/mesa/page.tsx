import { notFound } from "next/navigation";
import { CaseInvestigationBoardLazy } from "@/components/case-investigation-board-lazy";
import {
  getInvestigation,
  investigationSlugs,
} from "@/data/case-investigations";
import { getExplainer, isCaseKind } from "@/data/explainers";
import { VOICE } from "@/data/voice";
import { parseFocus, parseTab } from "@/lib/mesa-url";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aba?: string; foco?: string }>;
};

export function generateStaticParams() {
  return investigationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = getExplainer(slug);
  const inv = getInvestigation(slug);
  if (!e || !inv || !isCaseKind(e.kind)) {
    return { title: "Mesa · Lupa do Brasil" };
  }
  return {
    title: `Mesa · ${inv.title} · Lupa do Brasil`,
    description: inv.disclaimer,
    robots: { index: false },
  };
}

export default async function CasoMesaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const e = getExplainer(slug);
  const inv = getInvestigation(slug);
  if (!e || !inv || !isCaseKind(e.kind)) notFound();

  return (
    <CaseInvestigationBoardLazy
      slug={slug}
      caseTitle={e.title}
      data={inv}
      initialTab={parseTab(sp.aba)}
      initialFocus={parseFocus(sp.foco)}
      openHub={!sp.aba && !sp.foco}
      dossierHref={`/noticias/${slug}`}
      ctaBack={VOICE.mesa.ctaBack}
      disclaimer={VOICE.mesa.disclaimer}
    />
  );
}
