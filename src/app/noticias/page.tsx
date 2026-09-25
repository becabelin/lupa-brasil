import Image from "next/image";
import Link from "next/link";
import {
  casesNewestFirst,
  type Explainer,
} from "@/data/explainers";
import { postsNewestFirst, type Post } from "@/data/posts";
import { MarqueeBar, PageHero } from "@/components/brand-ui";
import { ArrowRightIcon } from "@/components/icons";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Notícias e casos políticos",
  description:
    "Notícias curtas na voz do Lupa e dossiês de casos públicos. Política, corrupção e instituições. Fontes na mão. Sem veredicto.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Notícias e casos · Lupa do Brasil",
    description: VOICE.noticias.lede,
  },
};

const TAG_LABEL: Record<string, string> = {
  politica: "Política",
  corrupcao: "Corrupção",
  "eleicoes-2026": "Eleições 2026",
  stf: "STF",
  tse: "TSE",
  congresso: "Congresso",
  pf: "PF",
  coaf: "Coaf",
  justica: "Justiça",
  instituições: "Instituições",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function tagLabel(tag?: string) {
  if (!tag) return "Política";
  return TAG_LABEL[tag] ?? tag;
}

export default function NoticiasIndexPage() {
  const posts = postsNewestFirst();
  const cases = casesNewestFirst();
  const lead = posts[0] ?? null;
  const sidePosts = posts.slice(1, 4);
  const morePosts = posts.slice(4);
  const leadCase = cases[0] ?? null;
  const moreCases = cases.slice(1);

  return (
    <div>
      <PageHero
        eyebrow={VOICE.noticias.eyebrow}
        title={<>Notícias</>}
        lede={VOICE.noticias.lede}
        marquee={[...VOICE.noticias.marquee]}
        meta={[
          { k: String(posts.length), v: "Agora" },
          { k: String(cases.length), v: cases.length === 1 ? "Caso" : "Casos" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {posts.length === 0 && cases.length === 0 ? (
          <p className="text-sm font-medium text-[#444]">
            Nenhuma notícia publicada ainda.
          </p>
        ) : null}

        {/* Hero editorial: capa grande + coluna de laterais */}
        {lead ? (
          <section className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <article className="lg:col-span-8">
              <Link
                href={`/noticias/${lead.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-2 border-black bg-[#ddd] lupa-soft sm:aspect-[2/1]">
                  <Image
                    src={lead.cover.src}
                    alt={lead.cover.alt}
                    fill
                    priority
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    style={{
                      objectPosition:
                        lead.cover.objectPosition ?? "center center",
                    }}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <span className="absolute left-3 top-3 border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                    Em destaque
                  </span>
                </div>
                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">
                    {tagLabel(lead.tags[0])} · {formatDate(lead.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.25rem)] uppercase leading-[0.92] tracking-tight transition group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    {lead.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-[#222] sm:text-lg">
                    {lead.lede}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
                    Ler
                    <ArrowRightIcon size={12} />
                  </span>
                </div>
              </Link>
            </article>

            <aside className="flex flex-col gap-0 border-t-2 border-black lg:col-span-4 lg:border-l-2 lg:border-t-0 lg:pl-8">
              <p className="pt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#666] lg:pt-0">
                Agora
              </p>
              {sidePosts.length > 0 ? (
                <ul className="mt-4 flex flex-1 flex-col">
                  {sidePosts.map((p, i) => (
                    <li
                      key={p.slug}
                      className={
                        i > 0 ? "border-t-2 border-black pt-5 mt-5" : ""
                      }
                    >
                      <SidePost post={p} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm font-medium text-[#555]">
                  A próxima notícia entra aqui, do mais novo pro mais antigo.
                </p>
              )}

              {leadCase ? (
                <div className="mt-auto border-t-2 border-black pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
                    Caso em aberto
                  </p>
                  <Link
                    href={`/noticias/${leadCase.slug}`}
                    className="group mt-3 block"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight transition group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2 sm:text-2xl">
                      {leadCase.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-[#333]">
                      {leadCase.teaser}
                    </p>
                  </Link>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}

        {/* Grade de notícias restantes */}
        {morePosts.length > 0 ? (
          <section className="mt-14 border-t-2 border-black pt-10">
            <SectionHead title="Mais recentes" />
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((p) => (
                <li key={p.slug}>
                  <GridPost post={p} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Casos: capa larga + lista */}
        {leadCase ? (
          <section className="mt-16 border-t-2 border-black pt-12">
            <SectionHead
              title="Casos"
              aside="Dossiês com frentes, linha do tempo e quem aparece."
            />

            <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
              <Link
                href={`/noticias/${leadCase.slug}`}
                className="group lg:col-span-7"
              >
                {leadCase.cover ? (
                  <div className="relative aspect-[16/10] overflow-hidden border-2 border-black bg-[#111] lupa-soft">
                    <Image
                      src={leadCase.cover.src}
                      alt={leadCase.cover.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      style={{
                        objectPosition:
                          leadCase.cover.objectPosition ?? "center top",
                      }}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                    <div className="lupa-photo-caption pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-20">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
                        Caso em aberto
                        {leadCase.angles && leadCase.angles.length > 0
                          ? ` · ${leadCase.angles.length} frentes`
                          : ""}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight text-white sm:text-3xl">
                        {leadCase.title}
                      </p>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight">
                    {leadCase.title}
                  </h3>
                )}
                <p className="mt-4 text-base font-medium leading-relaxed text-[#222]">
                  {leadCase.teaser}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
                  Entrar no caso
                  <ArrowRightIcon size={12} />
                </span>
              </Link>

              <div className="flex flex-col lg:col-span-5">
                {moreCases.length > 0 ? (
                  <ul className="flex flex-col divide-y-2 divide-black border-t-2 border-black lg:border-t-0">
                    {moreCases.map((e) => (
                      <li key={e.slug} className="py-5 first:pt-0">
                        <CaseRow explainer={e} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-full flex-col justify-between border-2 border-black bg-[#f5f5f5] p-6 lupa-soft lg:min-h-[280px]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                        Como lemos um caso
                      </p>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-[#222]">
                        Só abrimos dossiê quando o tema exige várias frentes
                        documentadas. Sem veredicto. Fonte na mão.
                      </p>
                    </div>
                    <Link
                      href="/fontes"
                      className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2"
                    >
                      Critério em Fontes
                      <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        <div className="mt-14 border-t-2 border-black pt-8">
          <MarqueeBar
            className="border-x-0"
            items={[
              "Fato direto",
              "Fonte na mão",
              "Caso só se for grande",
              "Sem veredicto nosso",
            ]}
          />
          <p className="mt-8 text-xs font-medium leading-relaxed text-[#666]">
            Conceitos e planos públicos ficam no{" "}
            <Link href="/glossario" className="lupa-text-link">
              Glossário
            </Link>
            . Origem completa em{" "}
            <Link href="/fontes" className="lupa-text-link">
              Fontes
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHead({
  title,
  aside,
}: {
  title: string;
  aside?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
        {title}
      </h2>
      {aside ? (
        <p className="max-w-md text-sm font-medium text-[#444] sm:text-right">
          {aside}
        </p>
      ) : null}
    </div>
  );
}

function SidePost({ post }: { post: Post }) {
  return (
    <Link href={`/noticias/${post.slug}`} className="group flex gap-4">
      <div className="relative aspect-[4/3] w-[7.5rem] shrink-0 overflow-hidden border-2 border-black bg-[#ddd] lupa-soft sm:w-28">
        <Image
          src={post.cover.src}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          style={{
            objectPosition: post.cover.objectPosition ?? "center center",
          }}
          sizes="112px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
          {tagLabel(post.tags[0])} · {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl uppercase leading-[0.95] tracking-tight transition group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2 sm:text-2xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-[#333]">
          {post.lede}
        </p>
      </div>
    </Link>
  );
}

function GridPost({ post }: { post: Post }) {
  return (
    <Link href={`/noticias/${post.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden border-2 border-black bg-[#ddd] lupa-soft">
        <Image
          src={post.cover.src}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          style={{
            objectPosition: post.cover.objectPosition ?? "center center",
          }}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
        {tagLabel(post.tags[0])} · {formatDate(post.publishedAt)}
      </p>
      <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-2xl uppercase leading-[0.95] tracking-tight transition group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm font-medium leading-relaxed text-[#333]">
        {post.lede}
      </p>
    </Link>
  );
}

function CaseRow({ explainer: e }: { explainer: Explainer }) {
  return (
    <Link href={`/noticias/${e.slug}`} className="group flex gap-4">
      {e.cover ? (
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden border-2 border-black bg-[#ddd] lupa-soft sm:w-24">
          <Image
            src={e.cover.src}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            style={{
              objectPosition: e.cover.objectPosition ?? "center top",
            }}
            sizes="96px"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
          Caso
          {e.angles && e.angles.length > 0
            ? ` · ${e.angles.length} frentes`
            : ""}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight transition group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2">
          {e.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-[#333]">
          {e.teaser}
        </p>
      </div>
    </Link>
  );
}
