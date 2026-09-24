import Image from "next/image";
import Link from "next/link";
import {
  EXPLAINER_KIND_LABEL,
  glossaryExplainers,
  type Explainer,
} from "@/data/explainers";
import { PageHero } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Glossário político",
  description:
    "Conceitos e planos que aparecem no debate e nos planos de governo 2026: maioridade penal, modelo El Salvador, precatórios e mais. Sem veredicto.",
  alternates: { canonical: "/glossario" },
  openGraph: {
    title: "Glossário político · Lupa do Brasil",
    description: VOICE.glossario.lede,
  },
};

export default function GlossarioIndexPage() {
  const items = glossaryExplainers();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.glossario.eyebrow}
        title={<>Glossário</>}
        lede={VOICE.glossario.lede}
        marquee={[...VOICE.glossario.marquee]}
        meta={[
          {
            k: String(items.filter((e) => e.kind === "conceito").length),
            v: "Conceitos",
          },
          {
            k: String(items.filter((e) => e.kind === "plano").length),
            v: "Planos / políticas",
          },
          {
            k: String(items.length),
            v: "Entradas",
          },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ul className="grid gap-0 sm:grid-cols-2">
          {items.map((e, i) => (
            <li
              key={e.slug}
              className={`border-2 border-black ${
                i > 0 ? "-mt-[2px] sm:mt-0" : ""
              } ${i % 2 === 1 ? "sm:-ml-[2px]" : ""}`}
            >
              <GlossaryCard explainer={e} />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs font-medium leading-relaxed text-[#666]">
          Ordem alfabética. Casos em aberto ficam em{" "}
          <Link
            href="/noticias"
            className="lupa-text-link"
          >
            Casos
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function GlossaryCard({ explainer: e }: { explainer: Explainer }) {
  return (
    <Link
      href={`/glossario/${e.slug}`}
      className="group flex h-full flex-col overflow-hidden bg-white transition hover:bg-black hover:text-white"
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
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666] group-hover:text-white/60">
          {EXPLAINER_KIND_LABEL[e.kind]}
        </span>
        <span className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight">
          {e.title}
        </span>
        <span className="mt-3 flex-1 text-sm font-medium leading-relaxed text-[#333] group-hover:text-white/85">
          {e.teaser}
        </span>
        <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
          Abrir →
        </span>
      </div>
    </Link>
  );
}
