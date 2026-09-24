"use client";

import { useLayoutEffect, useMemo, useRef } from "react";

/**
 * Faixa preta com texto em marquee contínuo.
 * Repete o conteúdo até cobrir a viewport e ajusta a duração
 * pela largura, pra não aparecer um buraco no loop.
 */
export function MarqueeBar({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const list = items.length > 0 ? items : ["Lupa do Brasil"];
  const tapeKey = list.join("\0");

  const tape = useMemo(() => {
    // Listas curtas (ex.: 4 frases) cabem numa tela larga: o -50%
    // deixa um vão vazio. Repete até ter material de sobra.
    const reps = Math.max(4, Math.ceil(16 / list.length));
    return Array.from({ length: reps }, () => list).flat();
    // list content is captured via tapeKey
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tapeKey is the content fingerprint
  }, [tapeKey]);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const sync = () => {
      const half = el.scrollWidth / 2;
      if (half <= 0) return;
      // ~60px/s: ritmo próximo ao antigo (36s em faixas curtas)
      const seconds = Math.max(20, half / 60);
      el.style.animationDuration = `${seconds}s`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    const parent = el.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [tapeKey]);

  const renderTape = (prefix: string) => (
    <span className="inline-flex shrink-0">
      {tape.map((label, i) => (
        <span
          key={`${prefix}-${i}`}
          className="mx-6 inline-flex items-center gap-6"
        >
          <span>{label}</span>
          <span className="text-white/40" aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`lupa-marquee border-y-2 border-black bg-black text-white ${className}`}
    >
      <p className="sr-only">{list.join(" · ")}</p>
      <div className="overflow-hidden py-3" aria-hidden>
        <div
          ref={trackRef}
          className="hero-marquee flex w-max whitespace-nowrap text-xs font-bold uppercase tracking-[0.35em] text-white"
        >
          {renderTape("a")}
          {renderTape("b")}
        </div>
      </div>
    </div>
  );
}
