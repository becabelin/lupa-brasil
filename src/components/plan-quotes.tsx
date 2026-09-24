import { unwrapQuotes } from "@/lib/text";

/** Trecho literal do plano: tipografia editorial, sem caixa. */
export function PlanQuotes({
  quotes,
  title = "Trechos do plano",
}: {
  quotes: string[];
  title?: string;
}) {
  if (quotes.length === 0) return null;

  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">
        {title}
      </h4>
      <ul className="mt-5 space-y-6">
        {quotes.map((q) => (
          <li key={q}>
            <blockquote className="relative pl-1">
              <span
                aria-hidden
                className="pointer-events-none select-none font-[family-name:var(--font-display)] text-[3.25rem] leading-none text-black/20"
              >
                “
              </span>
              <p className="-mt-5 text-[15px] font-medium leading-[1.45] text-[#222] sm:text-[16px]">
                {unwrapQuotes(q)}
              </p>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Uma citação compacta (cards / comparar). */
export function PlanQuoteLine({ quote }: { quote: string }) {
  return (
    <blockquote className="border-l-2 border-black pl-3">
      <p className="text-sm font-medium leading-snug text-[#333]">
        <span className="font-[family-name:var(--font-display)] text-lg leading-none text-black/40">
          “
        </span>{" "}
        {unwrapQuotes(quote)}
      </p>
    </blockquote>
  );
}
