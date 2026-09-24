"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EXPLAINER_KIND_LABEL,
  explainerPath,
  explainerTeaser,
  type Explainer,
} from "@/data/explainers";
import { LinkedText } from "@/components/linked-text";
import { useAccessibility } from "@/components/accessibility";

type Props = {
  explainer: Explainer;
  related: Explainer[];
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sectionId(heading: string) {
  return `sec-${heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

function ProseBlock({
  paragraphs,
  bullets,
}: {
  paragraphs: string[];
  bullets?: string[];
}) {
  const [lead, ...rest] = paragraphs;
  return (
    <div className="mt-4">
      {lead ? (
        <p className="lupa-prose-lead">
          <LinkedText text={lead} />
        </p>
      ) : null}
      {rest.length > 0 ? (
        <div className="lupa-prose mt-4">
          {rest.map((p) => (
            <p key={p.slice(0, 48)}>
              <LinkedText text={p} />
            </p>
          ))}
        </div>
      ) : null}
      {bullets && bullets.length > 0 ? (
        <div className="mt-6 border-t border-black/15 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
            Em tópicos
          </p>
          <ul className="lupa-bullets mt-3">
            {bullets.map((b) => (
              <li key={b.slice(0, 40)}>
                <span className="min-w-0">
                  <LinkedText text={b} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Página de referência: conceito ou plano/política. */
export function GlossaryArticle({ explainer: e, related }: Props) {
  const { readingLevel } = useAccessibility();
  const teaser = explainerTeaser(e, readingLevel);
  return (
    <article>
      {e.cover ? (
        <div className="border-b-2 border-black">
          <div className="relative mx-auto aspect-[21/9] max-h-[320px] w-full max-w-7xl overflow-hidden bg-[#111] sm:aspect-[2.4/1]">
            <Image
              src={e.cover.src}
              alt={e.cover.alt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <p className="mx-auto max-w-7xl px-4 py-2 text-[10px] font-medium text-[#666] sm:px-6">
            Foto: {e.cover.credit}
          </p>
          <div className="mx-auto max-w-3xl border-t-2 border-black px-4 py-8 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#666]">
              Glossário · {EXPLAINER_KIND_LABEL[e.kind]}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-6xl">
              {e.title}
            </h1>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        <Link
          href="/glossario"
          className="lupa-nav-link text-sm tracking-widest"
        >
          ← Glossário
        </Link>

        {!e.cover ? (
          <header className="mt-6 border-2 border-black p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
              {EXPLAINER_KIND_LABEL[e.kind]}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.92] tracking-tight sm:text-5xl">
              {e.title}
            </h1>
          </header>
        ) : null}

        <p className="lupa-prose-wide mt-8 text-xl leading-snug text-[#222] sm:text-2xl">
          {teaser}
        </p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
          Publicado {formatDate(e.publishedAt)}
          {e.updatedAt ? ` · Atualizado ${formatDate(e.updatedAt)}` : ""}
        </p>

        {e.keyFacts && e.keyFacts.length > 0 ? (
          <dl className="mt-8 grid gap-0 border-2 border-black sm:grid-cols-2">
            {e.keyFacts.map((f) => (
              <div
                key={f.label}
                className="border-b border-black px-4 py-3 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                  {f.label}
                </dt>
                <dd className="mt-0.5 font-[family-name:var(--font-display)] text-xl uppercase leading-none">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-10 space-y-12">
          {e.sections.map((section) => (
            <section
              key={section.heading}
              id={sectionId(section.heading)}
              className="scroll-mt-28 border-t border-black/15 pt-8 first:border-t-0 first:pt-0"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight">
                {section.heading}
              </h2>
              <ProseBlock
                paragraphs={section.paragraphs}
                bullets={section.bullets}
              />
            </section>
          ))}
        </div>

        <section
          id="fontes"
          className="mt-12 border-2 border-black p-5 sm:p-6"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
            Fontes
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed">
            Links e documentos desta página. Lista completa também em{" "}
            <Link
              href="/fontes#noticias-glossario"
              className="lupa-text-link"
            >
              Fontes
            </Link>
            .
          </p>
          {e.sources.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {e.sources.map((s) => (
                <li key={s.url} className="text-sm font-medium leading-snug">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lupa-text-link break-words"
                  >
                    {s.outlet ? `${s.outlet} · ${s.label}` : s.label}
                  </a>
                  {s.publishedAt ? (
                    <span className="mt-0.5 block text-[11px] font-medium text-[#666]">
                      {s.publishedAt}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {related.length > 0 ? (
          <section id="relacionados" className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
              Relacionados
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={explainerPath(r)}
                    className="lupa-text-link"
                  >
                    {r.title}
                  </Link>
                  <span className="text-sm text-[#666]"> · {r.teaser}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 border-t-2 border-black pt-8">
          <Link
            href="/glossario"
            className="border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
          >
            ← Todo o glossário
          </Link>
        </div>
      </div>
    </article>
  );
}
