import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts";
import { getCandidateById } from "@/data/candidates";
import { getExplainer, explainerPath } from "@/data/explainers";
import { PageHero } from "@/components/brand-ui";
import { ArrowRightIcon } from "@/components/icons";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function NewsPost({ post }: { post: Post }) {
  const relatedCandidates = (post.relatedCandidateIds ?? [])
    .map((id) => getCandidateById(id))
    .filter(Boolean);
  const relatedExplainers = (post.relatedExplainerSlugs ?? [])
    .map((s) => getExplainer(s))
    .filter(Boolean);

  return (
    <article>
      <PageHero
        eyebrow="Notícia"
        title={<>{post.title}</>}
        lede={post.lede}
        meta={[
          { k: String(post.sources.length), v: post.sources.length === 1 ? "Fonte" : "Fontes" },
          { k: post.tags[0] ?? "política", v: "Tema" },
        ]}
      />

      <div className="border-b-2 border-black">
        <div className="relative mx-auto aspect-[21/9] max-w-7xl overflow-hidden bg-[#ddd]">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            className="object-cover"
            style={{
              objectPosition: post.cover.objectPosition ?? "center center",
            }}
            sizes="100vw"
            priority
          />
        </div>
        <p className="mx-auto max-w-7xl px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#555] sm:px-6">
          Foto: {post.cover.credit}
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
          {formatDate(post.publishedAt)}
          {post.updatedAt && post.updatedAt !== post.publishedAt
            ? ` · atualizada ${formatDate(post.updatedAt)}`
            : ""}
        </p>

        <div className="lupa-prose mt-8 space-y-5">
          {post.body.map((p) => (
            <p key={p.slice(0, 48)} className="text-base font-medium leading-relaxed text-[#1a1a1a] sm:text-lg">
              {p}
            </p>
          ))}
        </div>

        {relatedCandidates.length > 0 || relatedExplainers.length > 0 ? (
          <section className="mt-10 border-t-2 border-black pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
              Relacionado
            </p>
            <ul className="mt-4 space-y-2">
              {relatedCandidates.map((c) =>
                c ? (
                  <li key={c.id}>
                    <Link
                      href={`/candidatos/${c.slug}`}
                      className="lupa-text-link text-sm font-bold"
                    >
                      Ficha · {c.name} ({c.party})
                    </Link>
                  </li>
                ) : null,
              )}
              {relatedExplainers.map((e) =>
                e ? (
                  <li key={e.slug}>
                    <Link
                      href={explainerPath(e)}
                      className="lupa-text-link text-sm font-bold"
                    >
                      {e.title}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ) : null}

        <section className="mt-10 border-t-2 border-black pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
            Fontes desta notícia
          </p>
          <ul className="mt-4 space-y-3">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lupa-text-link text-sm font-medium leading-snug"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-medium text-[#555]">
            Lista completa de origens do site em{" "}
            <Link href="/fontes" className="lupa-text-link">
              Fontes
            </Link>
            . Sem veredicto.
          </p>
        </section>

        <p className="mt-10">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2"
          >
            ← Notícias
            <ArrowRightIcon size={12} className="rotate-180" />
          </Link>
        </p>
      </div>
    </article>
  );
}
