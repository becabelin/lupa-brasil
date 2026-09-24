import Link from "next/link";
import { MarqueeBar } from "@/components/brand-ui";
import { AccessibilityMenu } from "@/components/accessibility-menu";
import { HeaderSearch } from "@/components/header-search";
import { MainNav } from "@/components/main-nav";
import { FOOTER_LINKS } from "@/data/nav";
import { VOICE } from "@/data/voice";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-6">
        <Link href="/" className="group min-w-0 shrink leading-none">
          <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-[#666] transition group-hover:text-black">
            {VOICE.tagline}
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
            Lupa do Brasil
          </span>
        </Link>
        <MainNav />
      </div>
      <div className="border-t-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
          <HeaderSearch wide />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-black bg-black text-white">
      <MarqueeBar
        className="border-x-0 border-t-0 border-b border-white/20"
        items={[...VOICE.marquee]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <Link
            href="/"
            className="block min-w-0 font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,8rem)] uppercase leading-[0.85] tracking-tight text-white transition hover:text-white/70"
          >
            Lupa do
            <br />
            Brasil
          </Link>

          <div className="flex shrink-0 flex-col gap-5 sm:items-end sm:pt-2">
            <nav
              aria-label="Rodapé"
              className="flex flex-col gap-2 sm:items-end"
            >
              {FOOTER_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="lupa-nav-link lupa-nav-link-sm text-white/80 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <AccessibilityMenu placement="footer" />
          </div>
        </div>

        <div className="mt-10 space-y-3 border-t border-white/25 pt-8 text-sm font-medium leading-relaxed text-white/80">
          <p>{VOICE.footer.blurb}</p>
          <p>
            {VOICE.footer.sources}{" "}
            <Link
              href="/fontes"
              className="lupa-text-link text-white"
            >
              Ver Fontes
            </Link>
            .
          </p>
        </div>

        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.28em] text-white/80">
          {VOICE.disclaimer}
        </p>
      </div>
    </footer>
  );
}
