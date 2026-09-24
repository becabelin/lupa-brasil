"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em]"
    >
      {children}
    </label>
  );
}

const fieldClass =
  "lupa-soft w-full border-2 border-black bg-white px-3 py-3 text-base font-semibold text-black outline-none transition focus:bg-black focus:text-white";

export function FilterInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const isSearch = props.type === "search";
  const value = props.value;
  const hasText =
    isSearch && typeof value === "string" && value.length > 0;

  return (
    <div className="block">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <input
          id={id}
          {...props}
          className={`lupa-search-input ${fieldClass} placeholder:font-normal placeholder:text-[#666] focus:placeholder:text-white/70 ${
            isSearch ? (hasText ? "pr-11" : "") : ""
          } ${props.className ?? ""}`}
        />
        {hasText && props.onChange ? (
          <button
            type="button"
            onClick={() => {
              const target = { value: "" } as HTMLInputElement;
              props.onChange?.({
                target,
                currentTarget: target,
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-current transition hover:bg-black hover:text-white"
            aria-label="Limpar busca"
          >
            <svg
              width="14"
              height="14"
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
          </button>
        ) : null}
      </div>
    </div>
  );
}

type Option = { value: string; label: string };
type Group = { label: string; options: Option[] };

type FilterSelectProps = {
  label: string;
  value?: string;
  options?: Option[];
  groups?: Group[];
  disabled?: boolean;
  className?: string;
  /** Campo de busca dentro da lista (útil com muitas opções). */
  searchable?: boolean;
  searchPlaceholder?: string;
  onChange?: (e: { target: { value: string } }) => void;
};

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function FilterSelect({
  label,
  value = "",
  options,
  groups,
  disabled,
  className,
  searchable = false,
  searchPlaceholder = "Buscar…",
  onChange,
}: FilterSelectProps) {
  const id = useId();
  const listId = useId();
  const searchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");

  const flat = useMemo(() => {
    if (groups?.length) {
      return groups.flatMap((g) =>
        g.options.map((o) => ({ ...o, group: g.label })),
      );
    }
    return (options || []).map((o) => ({
      ...o,
      group: undefined as string | undefined,
    }));
  }, [groups, options]);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return flat;
    return flat.filter(
      (o) =>
        fold(o.label).includes(q) ||
        (o.group ? fold(o.group).includes(q) : false),
    );
  }, [flat, query]);

  const selected = flat.find((o) => o.value === value) ?? flat[0];
  const display = selected?.label ?? "Selecionar";

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const idx = Math.max(
      0,
      filtered.findIndex((o) => o.value === value),
    );
    setActiveIndex(idx);
    if (searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }

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
  }, [open, filtered, value, searchable]);

  function commit(next: string) {
    onChange?.({ target: { value: next } });
    setOpen(false);
    setQuery("");
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) commit(item.value);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
    }
  }

  return (
    <div className={`block ${className ?? ""}`} ref={rootRef}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={onTriggerKeyDown}
          className={`lupa-select-trigger ${fieldClass} flex cursor-pointer items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50 ${
            open ? "bg-black text-white" : ""
          }`}
        >
          <span className="min-w-0 truncate">{display}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path
              d="M2 4.5L7 9.5L12 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        {open ? (
          <div className="lupa-select-menu lupa-soft absolute left-0 right-0 top-full z-50 mt-[-2px] border-2 border-black bg-white shadow-[var(--shadow-lift)]">
            {searchable ? (
              <div className="border-b-2 border-black p-2">
                <label htmlFor={searchId} className="sr-only">
                  Buscar opção
                </label>
                <input
                  ref={searchRef}
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onListKeyDown}
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  className="lupa-search-input w-full border-2 border-black bg-white px-3 py-2 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-[#666] focus:bg-black focus:text-white focus:placeholder:text-white/70"
                />
              </div>
            ) : null}
            <ul
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={id}
              onKeyDown={onListKeyDown}
              className="max-h-72 overflow-y-auto focus:outline-none"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-sm font-medium text-[#666]">
                  Nada encontrado para “{query.trim()}”.
                </li>
              ) : (
                filtered.map((o, index) => {
                  const prevGroup =
                    index > 0 ? filtered[index - 1]?.group : undefined;
                  const showGroup = Boolean(o.group && o.group !== prevGroup);
                  const active = index === activeIndex;
                  const selectedOpt = o.value === value;
                  return (
                    <li
                      key={`${o.group ?? ""}-${o.value}`}
                      role="presentation"
                    >
                      {showGroup ? (
                        <div className="border-b border-black bg-[#f0f0f0] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                          {o.group}
                        </div>
                      ) : null}
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedOpt}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => commit(o.value)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold transition ${
                          active || selectedOpt
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <span className="min-w-0 flex-1 text-left">
                          {o.label}
                        </span>
                        {selectedOpt ? (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">
                            ✓
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
