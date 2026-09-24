import Image from "next/image";
import Link from "next/link";
import { candidatesAlphabetical } from "@/data/candidates";
import { MetaStrip } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

type MetaItem = {
  k: string;
  v: string;
  href?: string;
};

type Props = {
  meta: MetaItem[];
};

export function HomeHero({ meta }: Props) {
  const strip = candidatesAlphabetical();
  const film = [...strip, ...strip];

  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-white">
      <div className="relative mx-auto max-w-7xl px-4 pb-0 pt-10 sm:px-6 sm:pt-14 lg:pt-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%] opacity-[0.06]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, #000 0 1px, transparent 1px 14px)",
          }}
        />

        <div className="hero-rise relative flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em]">
            {VOICE.home.eyebrow}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#666]">
            {VOICE.home.spotlight}
          </p>
        </div>

        <h1 className="hero-rise relative mt-6 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(4.25rem,16vw,11.5rem)] uppercase leading-[0.82] tracking-tight [animation-delay:60ms]">
          Lupa do
          <br />
          Brasil
        </h1>

        <div className="hero-rise relative mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end [animation-delay:120ms]">
          <p className="max-w-md text-lg font-medium leading-snug text-[#222] sm:text-xl">
            {VOICE.home.lede}
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/eleicoes"
              className="lupa-soft border-2 border-black bg-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
            >
              {VOICE.home.ctaEleicoes}
            </Link>
            <Link
              href="/noticias"
              className="lupa-soft border-2 border-black bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              {VOICE.home.ctaNoticias}
            </Link>
            <Link
              href="/comparar"
              className="lupa-soft border-2 border-black bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              {VOICE.home.ctaComparar}
            </Link>
          </div>
        </div>

        <div className="hero-rise relative z-[1] mt-12 -mx-4 border-y-2 border-black sm:-mx-6 [animation-delay:180ms]">
          <div className="overflow-hidden bg-black">
            <div className="hero-film flex w-max">
              {film.map((c, i) => (
                <Link
                  key={`strip-${c.id}-${i}`}
                  href={`/candidatos/${c.slug}`}
                  className="group relative aspect-[3/4] w-[32vw] min-w-[8.5rem] max-w-[13rem] shrink-0 overflow-hidden border-r-2 border-white/30 sm:w-[15vw] sm:max-w-[14rem]"
                  tabIndex={i >= strip.length ? -1 : undefined}
                  aria-hidden={i >= strip.length ? true : undefined}
                >
                  {c.photo ? (
                    <Image
                      src={c.photo}
                      alt={i < strip.length ? c.name : ""}
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 32vw, 220px"
                      priority={i < 1}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center bg-[#222] font-[family-name:var(--font-display)] text-3xl text-white">
                      {c.party}
                    </span>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full bg-gradient-to-t from-black from-40% via-black/75 to-transparent px-2.5 pb-2.5 pt-12 opacity-0 transition group-hover:opacity-100">
                    <p className="w-full truncate text-[10px] font-bold uppercase tracking-wider text-white">
                      {c.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[1]">
        <div className="mx-auto max-w-7xl">
          <MetaStrip items={meta} />
        </div>
      </div>
    </section>
  );
}


