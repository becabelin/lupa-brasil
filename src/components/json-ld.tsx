import { absoluteUrl, getSiteUrl } from "@/lib/site";
import type { Candidate } from "@/data/candidates";
import type { Explainer } from "@/data/explainers";

type JsonLd = Record<string, unknown>;

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lupa do Brasil",
    alternateName: "Lupa",
    url,
    description:
      "O Brasil de perto. Casos, planos de governo TSE 2026 e glossário, com fontes rastreáveis. Sem partido.",
    sameAs: [],
  };
}

export function websiteJsonLd(): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lupa do Brasil",
    url,
    description:
      "Comparar planos de governo 2026, fichas de candidatos, casos e glossário político com fonte.",
    inLanguage: "pt-BR",
    publisher: { "@type": "Organization", name: "Lupa do Brasil", url },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/pesquisa?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd(candidate: Candidate): JsonLd {
  const url = absoluteUrl(`/candidatos/${candidate.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.name,
    url,
    affiliation: candidate.partyFull
      ? { "@type": "Organization", name: candidate.partyFull }
      : candidate.party,
    jobTitle: "Candidato(a) à Presidência da República · Eleições 2026",
    description: candidate.bio,
    image: candidate.photo ? absoluteUrl(candidate.photo) : undefined,
    sameAs: (candidate.socials ?? []).map((s) => s.href),
  };
}

export function articleJsonLd(
  e: Explainer,
  path: string,
): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": e.kind === "caso" ? "NewsArticle" : "Article",
    headline: e.title,
    description: e.teaser,
    datePublished: e.publishedAt,
    dateModified: e.updatedAt ?? e.publishedAt,
    inLanguage: "pt-BR",
    mainEntityOfPage: url,
    url,
    image: e.cover ? [absoluteUrl(e.cover.src)] : undefined,
    author: {
      "@type": "Organization",
      name: "Lupa do Brasil",
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: "Lupa do Brasil",
      url: getSiteUrl(),
    },
    citation: e.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.label,
      url: s.url,
    })),
  };
}
