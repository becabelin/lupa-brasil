import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import {
  EXPLAINERS,
  getExplainer,
  isCaseKind,
  isGlossaryKind,
} from "@/data/explainers";
import { NewsArticle } from "@/components/news-article";
import { JsonLdScript, articleJsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return EXPLAINERS.filter((e) => isCaseKind(e.kind)).map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = getExplainer(slug);
  if (!e || !isCaseKind(e.kind)) {
    return { title: "Não encontrado" };
  }
  const description = e.teaserSimple || e.teaser;
  return {
    title: e.title,
    description,
    keywords: [e.title, ...(e.aliases ?? []).slice(0, 8)],
    alternates: { canonical: `/noticias/${e.slug}` },
    openGraph: {
      title: e.title,
      description,
      type: "article",
      publishedTime: e.publishedAt,
      modifiedTime: e.updatedAt ?? e.publishedAt,
      images: e.cover ? [{ url: e.cover.src, alt: e.cover.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: e.title,
      description,
    },
  };
}

export default async function NoticiaSlugPage({ params }: Props) {
  const { slug } = await params;
  const e = getExplainer(slug);
  if (!e) notFound();
  if (isGlossaryKind(e.kind)) {
    permanentRedirect(`/glossario/${e.slug}`);
  }
  if (!isCaseKind(e.kind)) notFound();

  const related = (e.relatedSlugs ?? [])
    .map((s) => getExplainer(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLdScript data={articleJsonLd(e, `/noticias/${e.slug}`)} />
      <NewsArticle explainer={e} related={related} />
    </>
  );
}
