import Link from "next/link";
import { MarqueeBar } from "@/components/marquee-bar";

export { MarqueeBar };

/** Eyebrow editorial (tracking largo). */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.32em] ${className}`}
    >
      {children}
    </p>
  );
}

/** Título display no tom do hero. */
export function DisplayTitle({
  children,
  as: Tag = "h1",
  size = "page",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "page" | "section";
  className?: string;
}) {
  const sizes = {
    hero: "text-[clamp(4.25rem,16vw,11.5rem)] leading-[0.82]",
    page: "text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.88]",
    section: "text-[clamp(2rem,6vw,3.5rem)] leading-[0.92]",
  } as const;
  return (
    <Tag
      className={`font-[family-name:var(--font-display)] uppercase tracking-tight ${sizes[size]} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Botão/CTA no padrão do hero. */
export function BrandButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "lupa-soft inline-block border-2 border-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:bg-white hover:text-black"
      : "bg-white text-black hover:bg-black hover:text-white";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

type MetaItem = { k: string; v: string; href?: string };

/** Grade de meta (números + rótulos), como no hero. */
export function MetaStrip({ items }: { items: MetaItem[] }) {
  return (
    <div className="lupa-meta-strip grid grid-cols-2 border-b-2 border-black sm:grid-cols-4">
      {items.map((item, i) => {
        const isLastCol = (i + 1) % 4 === 0;
        const isLastMobile = (i + 1) % 2 === 0;
        const inner = (
          <>
            <p className="lupa-meta-k font-[family-name:var(--font-display)] text-3xl uppercase leading-none sm:text-4xl">
              {item.k}
            </p>
            <p className="lupa-meta-v mt-2 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-white">
              {item.v}
            </p>
          </>
        );
        const className = `group block border-black bg-white px-4 py-5 sm:px-6 transition hover:bg-black hover:text-white border-r-2 ${
          isLastMobile ? "max-sm:border-r-0" : ""
        } ${isLastCol ? "sm:border-r-0" : ""}`;
        return item.href ? (
          <Link key={item.v} href={item.href} className={className}>
            {inner}
          </Link>
        ) : (
          <div
            key={item.v}
            className={className
              .replace("group ", "")
              .replace("hover:bg-black hover:text-white ", "")}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Cabeçalho de página interna no tom do hero. */
export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  marquee,
  meta,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  marquee?: string[];
  meta?: MetaItem[];
}) {
  return (
    <header className="border-b-2 border-black">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <DisplayTitle className={eyebrow ? "mt-4" : ""}>{title}</DisplayTitle>
        {lede ? (
          <p className="mt-6 max-w-xl text-lg font-medium leading-snug text-[#222] sm:text-xl">
            {lede}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {marquee && marquee.length > 0 ? <MarqueeBar items={marquee} /> : null}
      {meta && meta.length > 0 ? (
        <div className="mx-auto max-w-7xl">
          <MetaStrip items={meta} />
        </div>
      ) : null}
    </header>
  );
}

/** Título de seção (home e listagens). */
export function SectionHead({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <Eyebrow className="text-[#666]">{eyebrow}</Eyebrow> : null}
        <DisplayTitle as="h2" size="section" className={eyebrow ? "mt-2" : ""}>
          {title}
        </DisplayTitle>
      </div>
      {aside}
    </div>
  );
}
