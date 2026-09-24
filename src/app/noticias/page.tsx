import Image from "next/image";
import Link from "next/link";
import {
  caseExplainers,
  type Explainer,
} from "@/data/explainers";
import { PageHero } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Casos políticos com fontes",
  description:
    "Dossiês sobre casos públicos no Brasil: Vorcaro/Master, frentes, linha do tempo e quem aparece. Sem veredicto. Links originais em cada página e em Fontes.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Casos políticos com fontes · Lupa do Brasil",
    description: VOICE.noticias.lede,
  },
};

export default function NoticiasIndexPage() {
  const cases = caseExplainers();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.noticias.eyebrow}
        title={<>Casos</>}
        lede={VOICE.noticias.lede}
        marquee={[...VOICE.noticias.marquee]}
        meta={[
          {
            k: String(cases.length),
            v: "Casos",
          },
          {
            k: String(
              cases.reduce((n, e) => n + (e.angles?.length ?? 0), 0),
            ),
            v: "Frentes",
          },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {cases.length === 0 ? (
          <p className="text-sm font-medium text-[#444]">
            Nenhum caso publicado ainda.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {cases.map((e) => (
              <li key={e.slug}>
                <CaseCard explainer={e} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-xs font-medium leading-relaxed text-[#666]">
          Conceitos e planos públicos ficam no{" "}
          <Link
            href="/glossario"
            className="lupa-text-link"
          >
            Glossário
          </Link>
          . Critério de abertura em{" "}
          <Link
            href="/fontes"
            className="lupa-text-link"
          >
            Fontes
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function CaseCard({ explainer: e }: { explainer: Explainer }) {
  return (
    <Link
      href={`/noticias/${e.slug}`}
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
          Caso em aberto
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
        <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
          Entrar no caso →
        </span>
      </div>
    </Link>
  );
}
