"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  SEARCH_KIND_LABEL,
  searchHits,
  type SearchHit,
} from "@/lib/search";

type Props = {
  /** Faixa sob o nav: campo largo. */
  wide?: boolean;
  className?: string;
  placeholder?: string;
};

function IconClear({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function IconSearchArrow({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** Busca global → resultados ao vivo + /pesquisa?q= */
export function HeaderSearch({
  wide = false,
  className = "",
  placeholder = "Buscar candidato, caso, conceito…",
}: Props) {
  const router = useRouter();
  const id = useId();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchHit[] | null>(null);
  const hasText = q.length > 0;

  const ensureIndex = () => {
    if (index) return;
    void import("@/lib/search").then((m) => {
      setIndex(m.buildSearchIndexLite());
    });
  };

  const hits = useMemo(
    () =>
      index && q.trim().length >= 2
        ? searchHits(index, q).slice(0, 8)
        : [],
    [index, q],
  );
  const showPanel = open && q.trim().length >= 2;

  useEffect(() => {
    if (!showPanel) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [showPanel]);

  function goSearch(term: string) {
    const t = term.trim();
    setOpen(false);
    router.push(t ? `/pesquisa?q=${encodeURIComponent(t)}` : "/pesquisa");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    goSearch(q);
  }

  return (
    <form
      ref={rootRef}
      onSubmit={onSubmit}
      role="search"
      className={`relative min-w-0 ${wide ? "w-full" : ""} ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        Buscar no Lupa
      </label>
      <input
        id={id}
        type="search"
        name="q"
        role="combobox"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          ensureIndex();
        }}
        onFocus={() => {
          setOpen(true);
          ensureIndex();
        }}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-expanded={showPanel}
        className={`lupa-search-input w-full border-2 border-black bg-white text-black outline-none transition placeholder:font-normal placeholder:text-[#888] focus:bg-black focus:text-white focus:placeholder:text-white/50 ${
          wide
            ? `py-3 pl-4 text-base font-semibold ${hasText ? "pr-24" : "pr-14"}`
            : `py-1.5 pl-2.5 text-sm font-semibold ${hasText ? "pr-16" : "pr-9"}`
        }`}
      />
      <div className="absolute right-0 top-0 flex h-full items-stretch">
        {hasText ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className={`flex items-center justify-center text-current transition hover:bg-black hover:text-white ${
              wide ? "w-10" : "w-8"
            }`}
            aria-label="Limpar busca"
          >
            <IconClear size={wide ? 14 : 12} />
          </button>
        ) : null}
        <button
          type="submit"
          className={`flex items-center justify-center font-bold uppercase tracking-wider transition hover:bg-black hover:text-white ${
            wide ? "w-14" : "w-9"
          }`}
          aria-label="Buscar"
        >
          <IconSearchArrow size={wide ? 16 : 14} />
        </button>
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Resultados da busca"
          className="lupa-soft absolute left-0 right-0 top-[calc(100%+2px)] z-50 max-h-[min(70vh,28rem)] overflow-y-auto border-2 border-black bg-white text-black shadow-[var(--shadow-lift)]"
        >
          {hits.length > 0 ? (
            <ul>
              {hits.map((hit) => (
                <li key={hit.id} role="option">
                  <Link
                    href={hit.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-black/15 px-4 py-3 transition last:border-b-0 hover:bg-black hover:text-white"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] opacity-55">
                      {SEARCH_KIND_LABEL[hit.kind]}
                    </span>
                    <span className="mt-1 block font-[family-name:var(--font-display)] text-lg uppercase leading-none tracking-tight sm:text-xl">
                      {hit.title}
                    </span>
                    <span className="mt-1.5 block line-clamp-2 text-xs font-medium leading-snug opacity-70">
                      {hit.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm font-medium text-[#555]">
              Nada com “{q.trim()}” no índice. Enter abre a busca completa.
            </p>
          )}
          <button
            type="button"
            onClick={() => goSearch(q)}
            className="flex w-full items-center justify-between border-t-2 border-black bg-[#f5f5f5] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
          >
            <span>Ver todos em Buscar</span>
            <span aria-hidden className="inline-flex">
              <IconSearchArrow size={wide ? 18 : 16} />
            </span>
          </button>
        </div>
      ) : null}
    </form>
  );
}
