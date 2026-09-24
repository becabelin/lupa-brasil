import Image from "next/image";
import Link from "next/link";
import { candidatesAlphabetical } from "@/data/candidates";
import { featuredAgendas } from "@/data/agendas";
import { Eyebrow, DisplayTitle, MarqueeBar } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

/**
 * Bloco Eleições na home: ticker + três entradas densas.
 * Fotos em A→Z. Sem ranquear.
 */
export function HomeEleicoes({ candidateCount }: { candidateCount: number }) {
  const strip = candidatesAlphabetical().filter((c) => c.photo);
  const mosaic = strip.slice(0, 6);
  const pair = [strip[0], strip[1]].filter(Boolean);
  const areas = featuredAgendas().slice(0, 5);

  return (
    <section className="lupa-ink-block border-b-2 border-black bg-black text-white">
      <MarqueeBar
        items={[
          `${candidateCount} chapas na Presidência`,
          ...VOICE.eleicoes.marquee,
          ...VOICE.marquee,
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <Eyebrow className="text-white/80">
            {VOICE.homeSections.eleicoesEyebrow}
          </Eyebrow>
          <DisplayTitle as="h2" size="page" className="mt-3">
            Eleições 2026
          </DisplayTitle>
          <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/85 sm:text-lg">
            {VOICE.homeSections.eleicoesBlurb}
          </p>
        </div>

        <ul className="mt-10 grid gap-3 lg:grid-cols-3 lg:gap-4">
          <li>
            <PathCard
              href="/eleicoes"
              kicker={`${candidateCount} chapas`}
              title="Candidatos"
              blurb={VOICE.homeSections.eleicoesCandidatos}
            >
              <div className="grid grid-cols-3 gap-px bg-white/20">
                {mosaic.map((c) => (
                  <span
                    key={c.id}
                    className="relative aspect-[3/4] overflow-hidden bg-black"
                  >
                    <Image
                      src={c.photo!}
                      alt=""
                      fill
                      quality={88}
                      className="object-cover object-top"
                      sizes="120px"
                    />
                  </span>
                ))}
              </div>
            </PathCard>
          </li>

          <li>
            <PathCard
              href="/comparar"
              kicker="A × B"
              title="Comparar planos"
              blurb={VOICE.homeSections.eleicoesComparar}
            >
              <div className="relative grid aspect-[16/10] grid-cols-2 overflow-hidden bg-black">
                {pair.map((c) => (
                  <span
                    key={c.id}
                    className="relative min-h-0 overflow-hidden border-r border-white/25 last:border-r-0"
                  >
                    <Image
                      src={c.photo!}
                      alt=""
                      fill
                      quality={88}
                      className="object-cover object-top"
                      sizes="200px"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-2.5 pt-10">
                      <span className="block truncate text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {c.name.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </span>
                  </span>
                ))}
                <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 border-2 border-white bg-black px-3 py-1.5 font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight text-white">
                  ×
                </span>
              </div>
            </PathCard>
          </li>

          <li>
            <PathCard
              href="/buscar"
              kicker="Por pauta"
              title="Por área"
              blurb={VOICE.homeSections.eleicoesAreas}
            >
              <div className="flex aspect-[16/10] flex-col justify-end gap-2 bg-black p-4 sm:p-5">
                {areas.map((a) => (
                  <span
                    key={a.id}
                    className="block truncate border-b border-white/20 pb-1.5 font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight text-white/85 last:border-b-0 sm:text-2xl"
                  >
                    {a.label}
                  </span>
                ))}
              </div>
            </PathCard>
          </li>
        </ul>
      </div>
    </section>
  );
}

function PathCard({
  href,
  kicker,
  title,
  blurb,
  children,
}: {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="lupa-ink-card group lupa-soft flex h-full flex-col overflow-hidden border transition"
    >
      <div className="lupa-ink-card-media overflow-hidden border-b transition">
        {children}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="lupa-ink-card-muted text-[10px] font-bold uppercase tracking-[0.22em]">
          {kicker}
        </span>
        <span className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-none tracking-tight sm:text-4xl">
          {title}
        </span>
        <span className="lupa-ink-card-body mt-3 flex-1 text-sm font-medium leading-relaxed">
          {blurb}
        </span>
        <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-4">
          Entrar →
        </span>
      </div>
    </Link>
  );
}
