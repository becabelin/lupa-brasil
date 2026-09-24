import Link from "next/link";
import Image from "next/image";
import { CANDIDATES } from "@/data/candidates";
import {
  EXPLAINER_KIND_LABEL,
  featuredCases,
  glossaryExplainers,
  explainerPath,
  type Explainer,
} from "@/data/explainers";
import { HomeHero } from "@/components/home-hero";
import { HomeEleicoes } from "@/components/home-eleicoes";
import { BrandButton, SectionHead } from "@/components/brand-ui";
import { ArrowRightIcon } from "@/components/icons";
import { VOICE } from "@/data/voice";

export default async function HomePage() {
  const cases = featuredCases();
  const glossaryFeatured = glossaryExplainers()
    .filter((e) => e.featured)
    .slice(0, 4);

  return (
    <div>
      <HomeHero
        meta={[
          {
            k: String(CANDIDATES.length),
            v: "Chapas na urna",
            href: "/eleicoes",
          },
          {
            k: "2026",
            v: "Presidência agora",
            href: "/eleicoes",
          },
          {
            k: String(cases.length),
            v: "Casos em alta",
            href: "/noticias",
          },
          {
            k: "TSE",
            v: "De onde veio",
            href: "/fontes",
          },
        ]}
      />

      <HomeEleicoes candidateCount={CANDIDATES.length} />

      {cases.length > 0 ? (
        <section className="border-b-2 border-black bg-[#f0f0f0]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <SectionHead
              eyebrow={VOICE.homeSections.noticiasEyebrow}
              title={VOICE.homeSections.noticiasTitle}
              aside={
                <BrandButton
                  href="/noticias"
                  variant="outline"
                  className="!py-2.5 !px-4 text-xs"
                >
                  Ver tudo
                </BrandButton>
              }
            />
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {cases.map((e) => (
                <li key={e.slug}>
                  <HomeCard explainer={e} cta="Entrar no caso" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {glossaryFeatured.length > 0 ? (
        <section className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <SectionHead
              eyebrow="Consulta rápida"
              title="Glossário"
              aside={
                <BrandButton
                  href="/glossario"
                  variant="outline"
                  className="!py-2.5 !px-4 text-xs"
                >
                  Ver tudo
                </BrandButton>
              }
            />
            <p className="mb-6 max-w-xl text-sm font-medium leading-relaxed text-[#444]">
              Conceitos e planos públicos para ler o debate sem ficar no escuro.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              {glossaryFeatured.map((e) => (
                <li key={e.slug}>
                  <HomeCard explainer={e} cta="Abrir" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function HomeCard({
  explainer: e,
  cta,
}: {
  explainer: Explainer;
  cta: string;
}) {
  return (
    <Link
      href={explainerPath(e)}
      className="group lupa-soft flex h-full flex-col overflow-hidden border-2 border-black bg-white transition hover:bg-black hover:text-white"
    >
      {e.cover ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-black bg-[#ddd]">
          <Image
            src={e.cover.src}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: e.cover.objectPosition ?? "center top" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#333] group-hover:text-white/80">
          {EXPLAINER_KIND_LABEL[e.kind]}
          {e.angles && e.angles.length > 0
            ? ` · ${e.angles.length} frentes`
            : ""}
        </span>
        <span className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight sm:text-3xl">
          {e.title}
        </span>
        <span className="mt-3 flex-1 text-sm font-medium leading-relaxed text-[#222] group-hover:text-white/90">
          {e.teaser}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
          {cta}
          <ArrowRightIcon size={12} />
        </span>
      </div>
    </Link>
  );
}
