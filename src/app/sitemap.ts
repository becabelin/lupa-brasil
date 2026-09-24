import type { MetadataRoute } from "next";
import { CANDIDATES } from "@/data/candidates";
import { EXPLAINERS, isCaseKind, isGlossaryKind } from "@/data/explainers";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/eleicoes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${base}/comparar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${base}/buscar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/noticias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/glossario`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/fontes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/pesquisa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const candidates: MetadataRoute.Sitemap = CANDIDATES.map((c) => ({
    url: `${base}/candidatos/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const cases: MetadataRoute.Sitemap = EXPLAINERS.filter((e) =>
    isCaseKind(e.kind),
  ).map((e) => ({
    url: `${base}/noticias/${e.slug}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: e.featured ? 0.95 : 0.8,
  }));

  const glossary: MetadataRoute.Sitemap = EXPLAINERS.filter((e) =>
    isGlossaryKind(e.kind),
  ).map((e) => ({
    url: `${base}/glossario/${e.slug}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...candidates, ...cases, ...glossary];
}
