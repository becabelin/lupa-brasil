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
    <section className="relative border-b-2 border-black bg-white">
      {/* Textura full-bleed: sem corte vertical nas laterais da coluna */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 text-black opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, currentColor 0 1px, transparent 1px 14px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 90%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pb-8 sm:pt-14 lg:pt-16">
          <div className="hero-rise relative flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.32em]">
              {VOICE.home.eyebrow}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#666] sm:text-[11px] sm:tracking-[0.28em]">
              {VOICE.home.spotlight}
            </p>
          </div>

          <h1 className="hero-rise relative mt-5 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(3.25rem,18vw,11.5rem)] uppercase leading-[0.82] tracking-tight sm:mt-6 sm:text-[clamp(4.25rem,16vw,11.5rem)] [animation-delay:60ms]">
            Lupa do
            <br />
            Brasil
          </h1>

          <div className="hero-rise relative mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end [animation-delay:120ms]">
            <p className="max-w-md text-base font-medium leading-snug text-[#222] sm:text-xl">
              {VOICE.home.lede}
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap lg:justify-end">
              <Link
                href="/eleicoes"
                className="lupa-soft border-2 border-black bg-black px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black sm:px-6"
              >
                {VOICE.home.ctaEleicoes}
              </Link>
              <Link
                href="/noticias"
                className="lupa-soft border-2 border-black bg-white px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white sm:px-6"
              >
                {VOICE.home.ctaNoticias}
              </Link>
              <Link
                href="/comparar"
                className="lupa-soft border-2 border-black bg-white px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white sm:px-6"
              >
                {VOICE.home.ctaComparar}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filme full-bleed: borda no próprio trilho preto (sem costura branca) */}
      <div className="hero-rise relative z-[1] [animation-delay:180ms]">
        <div className="overflow-hidden border-t-2 border-black bg-black">
          <div className="hero-film flex w-max">
            {film.map((c, i) => (
              <Link
                key={`strip-${c.id}-${i}`}
                href={`/candidatos/${c.slug}`}
                className="group relative block aspect-[3/4] h-[min(44vw,17.5rem)] w-auto shrink-0 overflow-hidden border-r-2 border-white/30 sm:h-[min(24vw,18rem)]"
                tabIndex={i >= strip.length ? -1 : undefined}
                aria-hidden={i >= strip.length ? true : undefined}
              >
                {c.photo ? (
                  <Image
                    src={c.photo}
                    alt={i < strip.length ? c.name : ""}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 40vw, 240px"
                    priority={i < 1}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center bg-[#222] font-[family-name:var(--font-display)] text-3xl text-white">
                    {c.party}
                  </span>
                )}
                <div className="lupa-photo-caption pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full px-2.5 pb-2.5 pt-16">
                  <p className="w-full truncate text-[10px] font-bold uppercase tracking-wider text-white">
                    {c.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-[1] border-t-2 border-black">
        <MetaStrip items={meta} />
      </div>
    </section>
  );
}
