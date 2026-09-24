"use client";

import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { FilterInput } from "@/components/ui/fields";
import { ASK_EXAMPLES, type AskCitation, type AskResult } from "@/lib/ask-shared";
import {
  SEARCH_KIND_LABEL,
  searchHits,
  type SearchHit,
  type SearchHitKind,
} from "@/lib/search";
import { VOICE } from "@/data/voice";

const KIND_ORDER: SearchHitKind[] = [
  "candidato",
  "caso",
  "conceito",
  "plano",
];

type Props = {
  index: SearchHit[];
  initialQuery?: string;
};

export function SiteSearch({ index, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const deferred = useDeferredValue(query);
  const hits = useMemo(
    () => searchHits(index, deferred),
    [index, deferred],
  );

  const [askResult, setAskResult] = useState<AskResult | null>(null);
  const [askError, setAskError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    setAskError(null);
  }, [initialQuery]);

  const grouped = useMemo(() => {
    const map = new Map<SearchHitKind, SearchHit[]>();
    for (const kind of KIND_ORDER) map.set(kind, []);
    for (const hit of hits) {
      map.get(hit.kind)?.push(hit);
    }
    return KIND_ORDER.map((kind) => ({
      kind,
      items: map.get(kind) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [hits]);

  const trimmed = deferred.trim();

  async function runAsk(raw: string) {
    const question = raw.trim();
    if (question.length < 3 || pending) return;
    setAskError(null);
    setAskResult(null);
    setPending(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as AskResult & {
        error?: string;
        retryAfterSec?: number;
      };
      if (!res.ok) {
        const wait =
          res.status === 429 && data.retryAfterSec
            ? ` (cerca de ${Math.ceil(data.retryAfterSec / 60)} min)`
            : "";
        setAskError(
          (data.error || "Não deu pra responder agora.") +
            (res.status === 429 ? wait : ""),
        );
        return;
      }
      setAskResult(data);
    } catch {
      setAskError("Falha de rede. Tente de novo.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void runAsk(query);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        <FilterInput
          label="Buscar ou perguntar"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAskError(null);
            setAskResult(null);
          }}
          placeholder="Ex.: Lula · Vorcaro · o que é FGC"
          autoComplete="off"
          autoFocus
          enterKeyHint="search"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending || query.trim().length < 3}
            className="border-2 border-black bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? VOICE.pesquisa.askLoading : VOICE.pesquisa.askCta}
          </button>
          <p className="max-w-md text-xs font-medium leading-snug text-[#666]">
            {VOICE.pesquisa.askHint}
          </p>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {ASK_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={pending}
            onClick={() => {
              setQuery(ex);
              void runAsk(ex);
            }}
            className="border-2 border-black bg-white px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide transition hover:bg-black hover:text-white disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>

      {askError ? (
        <p
          className="mt-6 border-2 border-black bg-black px-4 py-3 text-sm font-semibold text-white"
          role="alert"
        >
          {askError}
        </p>
      ) : null}

      {askResult ? <AskAnswerCard result={askResult} /> : null}

      <p className="mt-6 text-xs font-medium text-[#666]" aria-live="polite">
        {!trimmed
          ? `${index.length} páginas indexadas · candidatos, casos e glossário`
          : hits.length === 0
            ? `Nenhuma página para “${trimmed}” · tente Perguntar acima`
            : `${hits.length} página${hits.length === 1 ? "" : "s"} na lista`}
      </p>

      {trimmed && hits.length === 0 && !askResult ? (
        <div className="mt-8 border-2 border-dashed border-black p-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
            Sem páginas na lista
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[#555]">
            Use o botão Perguntar acima, ou vá por{" "}
            <Link
              href="/eleicoes"
              className="lupa-text-link font-bold"
            >
              Eleições
            </Link>
            ,{" "}
            <Link
              href="/noticias"
              className="lupa-text-link font-bold"
            >
              Casos
            </Link>{" "}
            ou{" "}
            <Link
              href="/glossario"
              className="lupa-text-link font-bold"
            >
              Glossário
            </Link>
            .
          </p>
        </div>
      ) : null}

      <div className="mt-10 space-y-10">
        {grouped.map((g) => (
          <section key={g.kind} aria-labelledby={`search-${g.kind}`}>
            <h2
              id={`search-${g.kind}`}
              className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl"
            >
              {SEARCH_KIND_LABEL[g.kind]}
              <span className="ml-2 text-lg text-[#666]">
                {g.items.length}
              </span>
            </h2>
            <ul className="mt-4 divide-y-2 divide-black border-2 border-black">
              {g.items.map((hit) => (
                <li key={hit.id}>
                  <Link
                    href={hit.href}
                    className="group block bg-white p-4 transition hover:bg-black hover:text-white sm:p-5"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666] group-hover:text-white/80">
                      {hit.meta}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight sm:text-2xl">
                      {hit.title}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-[#333] group-hover:text-white/85">
                      {hit.blurb}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function AskAnswerCard({ result }: { result: AskResult }) {
  return (
    <section
      className="lupa-soft mt-8 overflow-hidden border-2 border-black bg-white"
      aria-live="polite"
      aria-label="Resposta"
    >
      <div className="bg-black px-4 py-3 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
          Resposta · com base no Lupa
        </p>
      </div>
      <div className="px-4 py-5 sm:px-5 sm:py-6">
        <p className="text-base font-semibold leading-relaxed text-black sm:text-lg">
          {result.answer}
        </p>

        {result.citations.length > 0 ? (
          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
              {VOICE.pesquisa.askSources}
            </p>
            <ul className="lupa-soft mt-3 divide-y-2 divide-black overflow-hidden border-2 border-black">
              {result.citations.map((c: AskCitation) => (
                <li key={c.id}>
                  <Link
                    href={c.href}
                    className="group flex flex-col gap-0.5 bg-white px-3 py-3 transition hover:bg-black hover:text-white sm:px-4"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666] group-hover:text-white/80">
                      {c.note}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight sm:text-xl">
                      {c.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
