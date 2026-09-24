"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EXPLAINER_KIND_LABEL,
  explainerParagraphs,
  explainerPath,
  explainerTeaser,
  type Explainer,
} from "@/data/explainers";
import { hasInvestigation } from "@/data/case-investigations";
import { VOICE } from "@/data/voice";
import { LinkedText } from "@/components/linked-text";
import { PersonFace } from "@/components/person-face";
import { ArrowRightIcon } from "@/components/icons";
import { useAccessibility } from "@/components/accessibility";

type Props = {
  explainer: Explainer;
  related: Explainer[];
};

type TocItem = { id: string; label: string; kind: "section" | "chapter" | "meta" };

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sectionId(heading: string) {
  return `sec-${heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

/** Dossiê imersivo de caso: capa, progresso, capítulos e linha do tempo. */
export function NewsArticle({ explainer: e, related }: Props) {
  const { readingLevel } = useAccessibility();
  const teaser = explainerTeaser(e, readingLevel);
  const toc = useMemo(() => {
    const items: TocItem[] = [];
    for (const s of e.sections) {
      items.push({
        id: sectionId(s.heading),
        label: s.heading,
        kind: "section",
      });
    }
    if (e.timeline?.length) {
      items.push({
        id: "linha-do-tempo",
        label: "Linha do tempo",
        kind: "meta",
      });
    }
    for (const a of e.angles ?? []) {
      items.push({ id: a.id, label: a.title, kind: "chapter" });
    }
    if (e.people?.length) {
      items.push({
        id: "quem-aparece",
        label: "Quem aparece",
        kind: "meta",
      });
    }
    if (e.sources.length) {
      items.push({ id: "fontes", label: "Fontes", kind: "meta" });
    }
    if (related.length) {
      items.push({
        id: "relacionados",
        label: "Relacionados",
        kind: "meta",
      });
    }
    return items;
  }, [e, related.length]);

  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (toc.length === 0) return;
    const nodes = toc
      .map((t) => document.getElementById(t.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    for (const n of nodes) observer.observe(n);
    return () => observer.disconnect();
  }, [toc]);

  const angles = e.angles ?? [];
  const chapterIds = angles.map((a) => a.id);
  const mesaHref = hasInvestigation(e.slug)
    ? `/noticias/${e.slug}/mesa`
    : null;

  return (
    <article>
      {/* Barra de progresso de leitura (abaixo do header sticky) */}
      <div
        className="pointer-events-none fixed inset-x-0 top-[4.25rem] z-30 h-1 bg-black/10 sm:top-[4.5rem]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Progresso de leitura"
      >
        <div
          className="h-full bg-black transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Capa: foto à esquerda, hero à direita */}
      {e.cover ? (
        <div className="border-b border-black">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(280px,42%)_minmax(0,1fr)]">
            <div className="flex flex-col lg:border-r border-black">
              <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-[#111] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={e.cover.src}
                  alt={e.cover.alt}
                  fill
                  priority
                  className="object-cover"
                  style={{
                    objectPosition: e.cover.objectPosition ?? "center top",
                  }}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
              <p className="shrink-0 border-t border-black/25 px-4 py-2 text-[10px] font-medium text-[#666] sm:px-5">
                Foto:{" "}
                {e.cover.creditUrl ? (
                  <a
                    href={e.cover.creditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="lupa-text-link"
                  >
                    {e.cover.credit}
                  </a>
                ) : (
                  e.cover.credit
                )}
              </p>
            </div>
            <div className="flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#666]">
                Caso · Entre no relato
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                {e.title}
              </h1>
              <p className="lupa-prose-wide mt-5 max-w-xl text-base text-[#222] sm:text-lg">
                {teaser}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {mesaHref ? (
                  <Link
                    href={mesaHref}
                    className="lupa-soft inline-flex items-center gap-2 border-2 border-black bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                  >
                    {VOICE.mesa.cta}
                    <ArrowRightIcon />
                  </Link>
                ) : null}
                {toc.length > 0 ? (
                  <a
                    href={`#${toc[0].id}`}
                    className={`lupa-soft inline-flex items-center border-2 border-black px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white ${
                      mesaHref
                        ? "bg-white text-black"
                        : "bg-black text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    Seguir a linha
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {(angles.length > 0 || mesaHref) ? (
        <div className="border-b-2 border-black bg-[#f5f5f5]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2a2a2a]">
                Como investigar este caso
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[#222]">
                {angles.length > 0
                  ? `${angles.length} frentes no texto. Linha do tempo, quem aparece e o que cada lado diz. A mesa abre o mapa completo.`
                  : "Abra a mesa para cruzar pessoas, datas, lugares e provas."}{" "}
                Sem veredicto nosso. Fontes no fim e em /fontes.
              </p>
            </div>
            {mesaHref ? (
              <Link
                href={mesaHref}
                className="lupa-soft inline-flex shrink-0 items-center justify-center gap-2 border-2 border-black bg-black px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
              >
                Abrir mesa
                <ArrowRightIcon size={12} />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Link
          href="/noticias"
          className="inline-block text-sm font-bold uppercase tracking-widest transition hover:bg-black hover:text-white"
        >
          ← Casos
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
            <div className="border-2 border-black bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
                {EXPLAINER_KIND_LABEL[e.kind]}
              </p>
              {!e.cover ? (
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.95] tracking-tight">
                  {e.title}
                </h1>
              ) : (
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-[0.95] tracking-tight">
                  {e.title}
                </p>
              )}
              <p className="mt-3 text-sm font-medium leading-snug text-[#333]">
                {teaser}
              </p>
              {mesaHref ? (
                <Link
                  href={mesaHref}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
                >
                  {VOICE.mesa.cta}
                  <ArrowRightIcon size={12} />
                </Link>
              ) : null}
              <p className="mt-4 border-t border-black/20 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                Publicado {formatDate(e.publishedAt)}
                {e.updatedAt
                  ? ` · Atualizado ${formatDate(e.updatedAt)}`
                  : ""}
              </p>
            </div>

            {e.keyFacts && e.keyFacts.length > 0 ? (
              <div className="border-2 border-black">
                {e.keyFacts.map((f) => (
                  <div
                    key={f.label}
                    className="border-b border-black px-4 py-3 last:border-b-0"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                      {f.label}
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl uppercase leading-none">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {toc.length > 0 ? (
              <nav
                aria-label="Seguir a linha deste caso"
                className="border-2 border-black bg-[#f0f0f0] p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Seguir a linha · {toc.length}
                </p>
                <ol className="mt-3 space-y-1.5">
                  {toc.map((item, i) => {
                    const active = item.id === activeId;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`group flex gap-2 text-left text-sm font-semibold leading-snug transition ${
                            active
                              ? "bg-black px-1.5 py-0.5 text-white no-underline"
                              : "lupa-text-link"
                          }`}
                        >
                          <span
                            className={`shrink-0 ${
                              active
                                ? "text-white/60"
                                : "text-[#666] group-hover:text-white/60"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="line-clamp-2">{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : null}

            <ShareBox title={e.title} />
          </aside>

          <div className="min-w-0">
            {!e.cover ? (
              <p className="lupa-prose-wide text-xl leading-snug text-[#222] sm:text-2xl">
                {teaser}
              </p>
            ) : null}

            <div className={`${e.cover ? "" : "mt-10 "}space-y-12`}>
              {e.sections.map((section) => (
                <section
                  key={section.heading}
                  id={sectionId(section.heading)}
                  className="scroll-mt-28"
                >
                  <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                    {section.heading}
                  </h2>
                  <ProseBlock
                    paragraphs={section.paragraphs}
                    bullets={section.bullets}
                  />
                </section>
              ))}
            </div>

            {/* Linha do tempo antes das frentes: o fio do caso */}
            {e.timeline && e.timeline.length > 0 ? (
              <section id="linha-do-tempo" className="mt-12 scroll-mt-28">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
                  O fio
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                  Linha do tempo
                </h2>
                <ol className="mt-8 border-l-2 border-black">
                  {e.timeline.map((t, i) => (
                    <li
                      key={`${t.when}-${t.text.slice(0, 24)}`}
                      className="relative pb-8 pl-8 last:pb-0"
                    >
                      <span className="absolute -left-[7px] top-1.5 h-3 w-3 border-2 border-black bg-white" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {String(i + 1).padStart(2, "0")} · {t.when}
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-[#222] sm:text-[1.05rem]">
                        <LinkedText text={t.text} />
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {angles.length > 0 ? (
              <div className="mt-12 space-y-0 border-t-2 border-black">
                <div className="border-b-2 border-black py-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
                    {angles.length} frentes
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                    O essencial, frente a frente
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[#444]">
                    Cada bloco é uma frente do mesmo caso. Leia na ordem ou
                    pule pelo índice.
                  </p>
                </div>
                {angles.map((a, i) => {
                  const nextId = chapterIds[i + 1];
                  return (
                    <section
                      key={a.id}
                      id={a.id}
                      className="scroll-mt-28 border-b-2 border-black py-10"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666]">
                        Frente {String(i + 1).padStart(2, "0")} de{" "}
                        {String(angles.length).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                        {a.title}
                      </h2>
                      <ProseBlock
                        paragraphs={explainerParagraphs(a.summary)}
                        bullets={a.bullets}
                      />
                      {nextId ? (
                        <a
                          href={`#${nextId}`}
                          className="mt-8 inline-flex items-center gap-2 border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                        >
                          Próxima frente
                          <ArrowRightIcon size={12} />
                        </a>
                      ) : e.people?.length ? (
                        <a
                          href="#quem-aparece"
                          className="mt-8 inline-flex items-center border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                        >
                          Quem aparece
                        </a>
                      ) : (
                        <a
                          href="#fontes"
                          className="mt-8 inline-flex items-center border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                        >
                          Ver fontes
                        </a>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : null}

            {e.people && e.people.length > 0 ? (
              <section id="quem-aparece" className="mt-12 scroll-mt-28">
                <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                  Quem aparece no relato
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {e.people.map((p, i) => (
                    <li
                      key={p.name}
                      className="lupa-quem-card lupa-soft group flex flex-col overflow-hidden border-2 border-black bg-white transition duration-200 hover:bg-black hover:text-white"
                      style={{ animationDelay: `${Math.min(i, 12) * 55}ms` }}
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-black bg-[#ddd]">
                        <PersonFace
                          name={p.name}
                          photo={p.photo}
                          sizes="(max-width: 640px) 50vw, 280px"
                          className="transition duration-500 group-hover:scale-[1.03]"
                          fallbackClassName="group-hover:bg-white group-hover:text-black"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        <p className="font-[family-name:var(--font-display)] text-xl uppercase leading-[1.02] tracking-tight lg:text-[1.35rem]">
                          {p.name}
                        </p>
                        <p className="mt-2 line-clamp-4 text-xs font-medium leading-relaxed text-[#444] group-hover:text-white/75 sm:text-sm">
                          {p.role}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {e.people.some((p) => p.photo?.credit) ? (
                  <p className="mt-3 text-[10px] font-medium leading-relaxed text-[#666]">
                    Fotos:{" "}
                    {e.people
                      .filter((p) => p.photo?.credit)
                      .map((p) => `${p.name}: ${p.photo!.credit}`)
                      .join(" · ")}
                    . Sem retrato público com licença livre: iniciais e silhueta.
                  </p>
                ) : null}
              </section>
            ) : null}

            <section
              id="fontes"
              className="mt-12 scroll-mt-28 border-2 border-black p-5 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                Fontes
              </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed">
            Reportagens e documentos usados neste caso. Lista completa também em{" "}
            <Link
              href="/fontes#noticias-glossario"
              className="lupa-text-link"
            >
              Fontes
            </Link>
            . Resumo para facilitar a leitura. Não substitui o original. Não é
            veredicto do Lupa do Brasil.
          </p>
          {e.sources.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {e.sources.map((s) => (
                <li key={s.url} className="text-sm font-medium leading-snug">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lupa-text-link break-words"
                  >
                    {s.outlet ? `${s.outlet} · ${s.label}` : s.label}
                  </a>
                  {s.publishedAt ? (
                    <span className="mt-0.5 block text-[11px] font-medium text-[#666]">
                      {s.publishedAt}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
            </section>

            {related.length > 0 ? (
              <section id="relacionados" className="mt-12 scroll-mt-28">
                <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight sm:text-4xl">
                  Relacionados
                </h2>
                <ul className="mt-4 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={explainerPath(r)}
                        className="lupa-text-link"
                      >
                        {r.title}
                      </Link>
                      <span className="text-sm text-[#666]"> · {r.teaser}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-12 flex flex-wrap gap-3 border-t-2 border-black pt-8">
              <Link
                href="/noticias"
                className="border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
              >
                ← Todos os casos
              </Link>
              <ShareInline title={e.title} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function usePageUrl() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  return url;
}

function ShareBox({ title }: { title: string }) {
  const url = usePageUrl();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const link = url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const shareNative = useCallback(async () => {
    const link = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: link, text: title });
        return;
      } catch {
        /* cancelado */
      }
    }
    await copy();
  }, [copy, title, url]);

  const encoded = encodeURIComponent(url || "");
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="border-2 border-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
        Compartilhar
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={copy}
          className="border-2 border-black bg-white px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
        >
          {copied ? "Link copiado" : "Copiar link"}
        </button>
        <button
          type="button"
          onClick={shareNative}
          className="border-2 border-black bg-white px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
        >
          Compartilhar
        </button>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
          target="_blank"
          rel="noreferrer"
          className="border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
          target="_blank"
          rel="noreferrer"
          className="border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
        >
          X / Twitter
        </a>
      </div>
    </div>
  );
}

function ShareInline({ title }: { title: string }) {
  const url = usePageUrl();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const link = url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [url]);

  return (
    <button
      type="button"
      onClick={copy}
      className="border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
      aria-label={`Copiar link de ${title}`}
    >
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}

/** Lead + parágrafos curtos + tópicos. Hierarquia de leitura do Lupa. */
function ProseBlock({
  paragraphs,
  bullets,
}: {
  paragraphs: string[];
  bullets?: string[];
}) {
  const [lead, ...rest] = paragraphs;
  return (
    <div className="mt-4">
      {lead ? (
        <p className="lupa-prose-lead">
          <LinkedText text={lead} />
        </p>
      ) : null}
      {rest.length > 0 ? (
        <div className="lupa-prose mt-4">
          {rest.map((p) => (
            <p key={p.slice(0, 48)}>
              <LinkedText text={p} />
            </p>
          ))}
        </div>
      ) : null}
      {bullets && bullets.length > 0 ? (
        <div className="mt-6 border-t border-black/15 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
            Em tópicos
          </p>
          <ul className="lupa-bullets mt-3">
            {bullets.map((b) => (
              <li key={b.slice(0, 40)}>
                <span className="min-w-0">
                  <LinkedText text={b} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
