import {
  selectPressForDisplay,
  fallbackPressLede,
  type PressItem,
} from "@/lib/press";

type Props = {
  items: PressItem[];
  updatedAt?: string;
  /** Na ficha do candidato: sem pesquisas eleitorais. */
  excludePolls?: boolean;
};

function pressBadge(item: PressItem): string | null {
  if (item.watchlist) return "Investigação";
  const hay = `${item.title} ${item.snippet} ${item.lede ?? ""}`.toLowerCase();
  if (
    /pesquisa|intenção|intenções|%|datafolha|ipec|quaest|atlas|segundo turno|1º turno|2º turno/.test(
      hay,
    )
  ) {
    return "Pesquisa";
  }
  return null;
}

export function PressCoverage({
  items,
  updatedAt,
  excludePolls = false,
}: Props) {
  const shown = selectPressForDisplay(items, 8, { excludePolls });

  return (
    <section>
      <div className="mb-6 border-b-2 border-black pb-4">
        <h3 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] uppercase leading-[0.9] tracking-tight">
          Na cobertura
        </h3>
        <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#2a2a2a]">
          {excludePolls
            ? "Fatos e investigações com repercussão ligados a esta chapa. Cada card leva à matéria original."
            : "Fatos e investigações com repercussão. Cada card leva à matéria original."}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="lupa-soft border-2 border-dashed border-black p-6 text-sm font-medium text-[#2a2a2a]">
          Ainda não há manchetes de peso listadas para esta chapa.
        </p>
      ) : (
        <ul className="columns-1 gap-4 sm:columns-2">
          {shown.map((item) => {
            const lede =
              item.lede?.trim() ||
              fallbackPressLede(item.outletLabel, item.title);
            const badge = excludePolls ? (item.watchlist ? "Investigação" : null) : pressBadge(item);
            return (
              <li key={item.id} className="mb-4 break-inside-avoid">
                <article className="lupa-soft flex h-full flex-col border-2 border-black bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2a2a2a]">
                      {badge ? (
                        <span className="mr-2 inline-block border border-black px-1.5 py-0.5 text-black">
                          {badge}
                        </span>
                      ) : null}
                      <span className="text-black">{item.outletLabel}</span>
                      {item.publishedAt ? (
                        <span>
                          {" "}
                          ·{" "}
                          {new Date(item.publishedAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-[#1a1a1a] sm:text-base">
                    {lede}
                  </p>

                  <div className="mt-4 border-t border-black/15 pt-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lupa-text-link text-sm font-bold leading-snug"
                    >
                      {item.title}
                    </a>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2a2a2a]">
                      Ler no {item.outletLabel} →
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {updatedAt ? (
        <p className="mt-4 text-[10px] font-medium text-[#2a2a2a]">
          Lista atualizada em{" "}
          {new Date(updatedAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          .
        </p>
      ) : null}
    </section>
  );
}
