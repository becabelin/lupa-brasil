import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCandidateBySlug, CANDIDATES } from "@/data/candidates";
import { CandidateDetail } from "@/components/candidate-detail";
import { EleicoesSubnav } from "@/components/eleicoes-subnav";
import { JsonLdScript, personJsonLd } from "@/components/json-ld";
import { getAnalysis, getDocument } from "@/lib/store";
import { getPressForCandidate, readPressStore } from "@/lib/press-store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CANDIDATES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  if (!candidate) {
    return { title: "Candidato não encontrado" };
  }
  const title = `${candidate.name} (${candidate.party}) · Plano e ficha`;
  const description =
    candidate.bio?.slice(0, 160) ||
    `Ficha e plano de governo oficial de ${candidate.name} (${candidate.party}) nas Eleições 2026. Fonte TSE.`;
  return {
    title,
    description,
    alternates: { canonical: `/candidatos/${candidate.slug}` },
    openGraph: {
      title: `${candidate.name} · Lupa do Brasil`,
      description,
      type: "profile",
      images: candidate.photo
        ? [{ url: candidate.photo, alt: candidate.name }]
        : undefined,
    },
  };
}

export default async function CandidatePage({ params }: Props) {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  if (!candidate) notFound();

  const [analysis, document, pressItems, pressStore] = await Promise.all([
    getAnalysis(candidate.id),
    getDocument(candidate.id),
    getPressForCandidate(candidate.id),
    readPressStore(),
  ]);

  return (
    <div>
      <JsonLdScript data={personJsonLd(candidate)} />
      <EleicoesSubnav />
      <CandidateDetail
        candidate={candidate}
        analysis={analysis}
        document={document}
        pressItems={pressItems}
        pressUpdatedAt={pressStore.updatedAt || undefined}
      />
    </div>
  );
}
