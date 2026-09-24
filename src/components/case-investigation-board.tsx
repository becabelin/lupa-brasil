"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFocusTrap } from "@/lib/use-focus-trap";

import type {
  CaseInvestigation,
  InvestigationChat,
  InvestigationEvidence,
  InvestigationEvent,
  InvestigationGalleryPhoto,
  InvestigationPerson,
  InvestigationPlace,
} from "@/data/case-investigations";
import {
  parseFocus,
  parseTab,
  serializeFocus,
  type MesaFocus,
  type MesaTab,
} from "@/lib/mesa-url";
import { VOICE } from "@/data/voice";
import dynamic from "next/dynamic";
import {
  MesaTutorial,
  markMesaTutorialSeen,
  wasMesaTutorialSeen,
} from "@/components/mesa-tutorial";
import { BrasilLoading } from "@/components/brasil-loading";
import { LinkedText } from "@/components/linked-text";
import { PersonFace } from "@/components/person-face";
import { ArrowRightIcon } from "@/components/icons";

const MesaPeopleGallery = dynamic(
  () =>
    import("@/components/mesa-people-gallery").then((m) => m.MesaPeopleGallery),
  {
    ssr: false,
    loading: () => (
      <BrasilLoading
        label="Carregando quem aparece…"
        className="h-full min-h-0"
      />
    ),
  },
);

export type { MesaFocus, MesaTab } from "@/lib/mesa-url";
export { parseFocus, parseTab, serializeFocus } from "@/lib/mesa-url";

const V = VOICE.mesa;

const TABS: { id: MesaTab; label: string; hint: string }[] = [
  { id: "tempo", label: V.tabTempo, hint: "O que aconteceu, em ordem" },
  { id: "pessoas", label: V.tabPessoas, hint: "Quem entra no relato" },
  { id: "lugares", label: V.tabLugares, hint: "Hotéis, tribunais, empresas" },
  { id: "chats", label: V.tabChats, hint: "Trechos de WhatsApp publicados" },
  { id: "provas", label: V.tabProvas, hint: "Contrato, Coaf, HD…" },
  { id: "cruzar", label: V.tabCruzar, hint: "O que duas peças têm em comum" },
];


const PLACE_KIND: Record<InvestigationPlace["kind"], string> = {
  tribunal: "Tribunal",
  hotel: "Hotel",
  cidade: "Cidade",
  empresa: "Empresa",
  fundo: "Fundo",
  outro: "Lugar",
};

const EVIDENCE_KIND: Record<InvestigationEvidence["kind"], string> = {
  contrato: "Contrato",
  mensagem: "Mensagem",
  relatorio: "Relatório",
  nota: "Nota",
  outro: "Prova",
};

function personName(
  data: CaseInvestigation,
  id: string,
): string {
  return data.people.find((p) => p.id === id)?.name ?? id;
}

type Links = {
  people: InvestigationPerson[];
  places: InvestigationPlace[];
  events: InvestigationEvent[];
  chats: InvestigationChat[];
  evidence: InvestigationEvidence[];
};

function emptyLinks(): Links {
  return { people: [], places: [], events: [], chats: [], evidence: [] };
}

function uniqueById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

/** Pessoas que coaparecem em eventos, chats, lugares ou provas. */
function peopleFromCooccurrence(
  data: CaseInvestigation,
  excludeId: string | null,
  events: InvestigationEvent[],
  chats: InvestigationChat[],
  places: InvestigationPlace[],
  evidence: InvestigationEvidence[],
): InvestigationPerson[] {
  const ids = new Set<string>();
  for (const e of events) {
    for (const id of e.personIds ?? []) {
      if (id !== excludeId) ids.add(id);
    }
  }
  for (const c of chats) {
    for (const id of c.participantIds ?? []) {
      if (id !== excludeId) ids.add(id);
    }
  }
  for (const p of places) {
    for (const id of p.personIds ?? []) {
      if (id !== excludeId) ids.add(id);
    }
  }
  for (const v of evidence) {
    for (const id of v.personIds ?? []) {
      if (id !== excludeId) ids.add(id);
    }
  }
  return data.people.filter((p) => ids.has(p.id));
}

function placesFromEvents(
  data: CaseInvestigation,
  events: InvestigationEvent[],
): InvestigationPlace[] {
  const ids = new Set<string>();
  for (const e of events) {
    for (const id of e.placeIds ?? []) ids.add(id);
  }
  return data.places.filter((p) => ids.has(p.id));
}

function linksForFocus(
  data: CaseInvestigation,
  focus: MesaFocus | null,
): Links {
  if (!focus) return emptyLinks();
  const byP = new Map(data.people.map((p) => [p.id, p]));
  const byL = new Map(data.places.map((p) => [p.id, p]));
  const byE = new Map(data.events.map((e) => [e.id, e]));
  const byC = new Map(data.chats.map((c) => [c.id, c]));
  const byV = new Map(data.evidence.map((v) => [v.id, v]));

  const pick = <T,>(ids: string[] | undefined, map: Map<string, T>) =>
    (ids ?? []).map((id) => map.get(id)).filter((x): x is T => Boolean(x));

  if (focus.kind === "pessoa") {
    const p = byP.get(focus.id);
    if (!p) return emptyLinks();
    // Fonte da verdade: a pessoa precisa estar em event.personIds.
    // eventIds na ficha só ordena; não inventa ligação.
    const linked = data.events.filter((e) => e.personIds?.includes(focus.id));
    const order = new Map((p.eventIds ?? []).map((id, i) => [id, i]));
    const events = [...linked].sort((a, b) => {
      const ai = order.has(a.id) ? order.get(a.id)! : 9999;
      const bi = order.has(b.id) ? order.get(b.id)! : 9999;
      if (ai !== bi) return ai - bi;
      return 0;
    });
    const chats = pick(p.chatIds, byC);
    const evidence = pick(p.evidenceIds, byV);
    const places = uniqueById([
      ...pick(p.placeIds, byL),
      ...placesFromEvents(data, events),
    ]);
    return {
      people: peopleFromCooccurrence(
        data,
        focus.id,
        events,
        chats,
        places,
        evidence,
      ),
      places,
      events,
      chats,
      evidence,
    };
  }
  if (focus.kind === "lugar") {
    const p = byL.get(focus.id);
    if (!p) return emptyLinks();
    const events = pick(p.eventIds, byE);
    const people = pick(p.personIds, byP);
    const chats = data.chats.filter((c) => c.placeIds?.includes(focus.id));
    const evidence = data.evidence.filter((v) =>
      v.personIds?.some((id) => p.personIds?.includes(id)),
    );
    return {
      people: uniqueById([
        ...people,
        ...peopleFromCooccurrence(data, null, events, chats, [p], evidence),
      ]),
      places: [],
      events,
      chats,
      evidence,
    };
  }
  if (focus.kind === "evento") {
    const e = byE.get(focus.id);
    if (!e) return emptyLinks();
    const people = pick(e.personIds, byP);
    const places = pick(e.placeIds, byL);
    const chats = pick(e.chatIds, byC);
    const evidence = pick(e.evidenceIds, byV);
    return {
      people,
      places,
      events: [],
      chats,
      evidence,
    };
  }
  if (focus.kind === "chat") {
    const c = byC.get(focus.id);
    if (!c) return emptyLinks();
    return {
      people: pick(c.participantIds, byP),
      places: pick(c.placeIds, byL),
      events: pick(c.eventIds, byE),
      chats: [],
      evidence: [],
    };
  }
  const v = byV.get(focus.id);
  if (!v) return emptyLinks();
  const events = pick(v.eventIds, byE);
  const people = pick(v.personIds, byP);
  return {
    people: uniqueById([
      ...people,
      ...peopleFromCooccurrence(data, null, events, [], [], [v]),
    ]),
    places: placesFromEvents(data, events),
    events,
    chats: [],
    evidence: [],
  };
}

function entityIdsForFocus(
  data: CaseInvestigation,
  focus: MesaFocus | null,
): {
  personIds: Set<string>;
  placeIds: Set<string>;
  eventIds: Set<string>;
  chatIds: Set<string>;
  evidenceIds: Set<string>;
} {
  const links = linksForFocus(data, focus);
  const personIds = new Set(links.people.map((p) => p.id));
  const placeIds = new Set(links.places.map((p) => p.id));
  const eventIds = new Set(links.events.map((e) => e.id));
  const chatIds = new Set(links.chats.map((c) => c.id));
  const evidenceIds = new Set(links.evidence.map((v) => v.id));
  if (focus?.kind === "pessoa") personIds.add(focus.id);
  if (focus?.kind === "lugar") placeIds.add(focus.id);
  if (focus?.kind === "evento") eventIds.add(focus.id);
  if (focus?.kind === "chat") chatIds.add(focus.id);
  if (focus?.kind === "prova") evidenceIds.add(focus.id);
  return { personIds, placeIds, eventIds, chatIds, evidenceIds };
}

/** O que A e B têm em comum (vizinhança expandida). */
function intersectionLabels(
  data: CaseInvestigation,
  a: MesaFocus | null,
  b: MesaFocus | null,
): { label: string; focus: MesaFocus }[] {
  if (!a || !b) return [];
  if (a.kind === b.kind && a.id === b.id) return [];

  const la = linksForFocus(data, a);
  const lb = linksForFocus(data, b);
  const out: { label: string; focus: MesaFocus }[] = [];
  const seen = new Set<string>();

  const push = (label: string, focus: MesaFocus) => {
    const key = `${focus.kind}:${focus.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label, focus });
  };

  const skipPerson = new Set<string>();
  if (a.kind === "pessoa") skipPerson.add(a.id);
  if (b.kind === "pessoa") skipPerson.add(b.id);

  const peopleA = new Set(la.people.map((p) => p.id));
  const peopleB = new Set(lb.people.map((p) => p.id));
  for (const id of peopleA) {
    if (!peopleB.has(id) || skipPerson.has(id)) continue;
    push(`Pessoa · ${personName(data, id)}`, { kind: "pessoa", id });
  }

  const eventsA = new Set([
    ...(a.kind === "evento" ? [a.id] : []),
    ...la.events.map((e) => e.id),
  ]);
  const eventsB = new Set([
    ...(b.kind === "evento" ? [b.id] : []),
    ...lb.events.map((e) => e.id),
  ]);
  for (const id of eventsA) {
    if (!eventsB.has(id)) continue;
    if (a.kind === "evento" && a.id === id) continue;
    if (b.kind === "evento" && b.id === id) continue;
    const ev = data.events.find((e) => e.id === id);
    if (ev) push(`Tempo · ${ev.when} · ${ev.title}`, { kind: "evento", id });
  }

  const placesA = new Set([
    ...(a.kind === "lugar" ? [a.id] : []),
    ...la.places.map((p) => p.id),
  ]);
  const placesB = new Set([
    ...(b.kind === "lugar" ? [b.id] : []),
    ...lb.places.map((p) => p.id),
  ]);
  for (const id of placesA) {
    if (!placesB.has(id)) continue;
    if (a.kind === "lugar" && a.id === id) continue;
    if (b.kind === "lugar" && b.id === id) continue;
    const pl = data.places.find((p) => p.id === id);
    if (pl) push(`Lugar · ${pl.name}`, { kind: "lugar", id });
  }

  const chatsA = new Set([
    ...(a.kind === "chat" ? [a.id] : []),
    ...la.chats.map((c) => c.id),
  ]);
  const chatsB = new Set([
    ...(b.kind === "chat" ? [b.id] : []),
    ...lb.chats.map((c) => c.id),
  ]);
  for (const id of chatsA) {
    if (!chatsB.has(id)) continue;
    if (a.kind === "chat" && a.id === id) continue;
    if (b.kind === "chat" && b.id === id) continue;
    const ch = data.chats.find((c) => c.id === id);
    if (ch) push(`Chat · ${ch.title}`, { kind: "chat", id });
  }

  const evidA = new Set([
    ...(a.kind === "prova" ? [a.id] : []),
    ...la.evidence.map((v) => v.id),
  ]);
  const evidB = new Set([
    ...(b.kind === "prova" ? [b.id] : []),
    ...lb.evidence.map((v) => v.id),
  ]);
  for (const id of evidA) {
    if (!evidB.has(id)) continue;
    if (a.kind === "prova" && a.id === id) continue;
    if (b.kind === "prova" && b.id === id) continue;
    const ev = data.evidence.find((v) => v.id === id);
    if (ev) push(`Prova · ${ev.title}`, { kind: "prova", id });
  }

  return out;
}

type Props = {
  slug: string;
  caseTitle: string;
  data: CaseInvestigation;
  initialTab: MesaTab;
  initialFocus: MesaFocus | null;
  /** Sem aba/foco na URL: abre o menu de portas primeiro. */
  openHub?: boolean;
  dossierHref: string;
  ctaBack: string;
  disclaimer: string;
};

export function CaseInvestigationBoard({
  slug,
  caseTitle,
  data,
  initialTab,
  initialFocus,
  openHub: initialHub = false,
  dossierHref,
  ctaBack,
  disclaimer,
}: Props) {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<MesaTab>(initialTab);
  const [focus, setFocus] = useState<MesaFocus | null>(initialFocus);
  const [hubOpen, setHubOpen] = useState(initialHub && !initialFocus);
  const [crossA, setCrossA] = useState<string>("");
  const [crossB, setCrossB] = useState<string>("");
  const [chatReveal, setChatReveal] = useState(0);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  /** Monta a galeria Quem na 1ª visita e mantém viva (sem reload ao mudar de aba). */
  const [peopleMounted, setPeopleMounted] = useState(
    !initialHub && initialTab === "pessoas",
  );

  useEffect(() => {
    if (!wasMesaTutorialSeen()) setTutorialOpen(true);
  }, []);

  useEffect(() => {
    if (tab === "pessoas") setPeopleMounted(true);
  }, [tab]);

  const syncUrl = useCallback(
    (nextTab: MesaTab, nextFocus: MesaFocus | null) => {
      const params = new URLSearchParams();
      if (nextTab !== "pessoas") params.set("aba", nextTab);
      const f = serializeFocus(nextFocus);
      if (f) params.set("foco", f);
      const q = params.toString();
      router.replace(
        `/noticias/${slug}/mesa${q ? `?${q}` : ""}`,
        { scroll: false },
      );
    },
    [router, slug],
  );

  const selectFocus = useCallback(
    (next: MesaFocus | null, nextTab?: MesaTab) => {
      const t = nextTab ?? tab;
      setFocus(next);
      setHubOpen(false);
      if (nextTab) setTab(nextTab);
      if (nextTab === "pessoas" || (!nextTab && t === "pessoas")) {
        setPeopleMounted(true);
      }
      syncUrl(t, next);
    },
    [syncUrl, tab],
  );

  const changeTab = useCallback(
    (next: MesaTab) => {
      setTab(next);
      setHubOpen(false);
      if (next === "pessoas") setPeopleMounted(true);
      syncUrl(next, focus);
    },
    [focus, syncUrl],
  );

  const enterFromHub = useCallback(
    (next: MesaTab) => {
      setFocus(null);
      setTab(next);
      setHubOpen(false);
      if (next === "pessoas") setPeopleMounted(true);
      syncUrl(next, null);
    },
    [syncUrl],
  );

  const openHubMenu = useCallback(() => {
    setFocus(null);
    setHubOpen(true);
    syncUrl(tab, null);
  }, [syncUrl, tab]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (tutorialOpen) return;
      if (focus) {
        e.preventDefault();
        if (focus.kind === "pessoa") selectFocus(null, "pessoas");
        else selectFocus(null);
        return;
      }
      if (hubOpen) {
        e.preventDefault();
        router.push(dossierHref);
        return;
      }
      e.preventDefault();
      openHubMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    dossierHref,
    focus,
    hubOpen,
    openHubMenu,
    router,
    selectFocus,
    tutorialOpen,
  ]);

  useFocusTrap(!tutorialOpen, shellRef, {
    restoreFocus: false,
    lockScroll: false,
  });

  useEffect(() => {
    if (tab !== "chats" && focus?.kind !== "chat") {
      setChatReveal(0);
      return;
    }
    const chat =
      focus?.kind === "chat"
        ? data.chats.find((c) => c.id === focus.id)
        : data.chats[0];
    if (!chat) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setChatReveal(chat.messages.length);
      return;
    }
    setChatReveal(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setChatReveal(i);
      if (i >= chat.messages.length) window.clearInterval(id);
    }, 180);
    return () => window.clearInterval(id);
  }, [tab, focus, data.chats]);

  const related = useMemo(() => linksForFocus(data, focus), [data, focus]);
  const filters = useMemo(
    () => entityIdsForFocus(data, focus),
    [data, focus],
  );

  const focusLabel = useMemo(() => {
    if (!focus) return null;
    if (focus.kind === "pessoa")
      return data.people.find((p) => p.id === focus.id)?.name;
    if (focus.kind === "lugar")
      return data.places.find((p) => p.id === focus.id)?.name;
    if (focus.kind === "evento") {
      const e = data.events.find((x) => x.id === focus.id);
      return e ? `${e.when} · ${e.title}` : null;
    }
    if (focus.kind === "chat")
      return data.chats.find((c) => c.id === focus.id)?.title;
    return data.evidence.find((v) => v.id === focus.id)?.title;
  }, [data, focus]);

  const crossOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (const p of data.people) {
      opts.push({ value: `pessoa:${p.id}`, label: `Pessoa · ${p.name}` });
    }
    for (const p of data.places) {
      opts.push({ value: `lugar:${p.id}`, label: `Lugar · ${p.name}` });
    }
    for (const e of data.events) {
      opts.push({
        value: `evento:${e.id}`,
        label: `Tempo · ${e.when} · ${e.title}`,
      });
    }
    return opts;
  }, [data]);

  const crossHits = useMemo(() => {
    const a = parseFocus(crossA || null);
    const b = parseFocus(crossB || null);
    return intersectionLabels(data, a, b);
  }, [crossA, crossB, data]);

  const filteredEvents =
    focus && tab !== "tempo"
      ? data.events.filter((e) => filters.eventIds.has(e.id))
      : data.events;
  const filteredPlaces =
    focus && tab !== "lugares"
      ? data.places.filter((p) => filters.placeIds.has(p.id))
      : data.places;
  const filteredChats =
    focus && tab !== "chats"
      ? data.chats.filter((c) => filters.chatIds.has(c.id))
      : data.chats;
  const filteredEvidence =
    focus && tab !== "provas"
      ? data.evidence.filter((v) => filters.evidenceIds.has(v.id))
      : data.evidence;

  const selectedChat =
    focus?.kind === "chat"
      ? data.chats.find((c) => c.id === focus.id)
      : undefined;

  const showListRail = !hubOpen && focus?.kind !== "pessoa" && tab !== "pessoas";
  /** No celular: lista some quando há item aberto (o detalhe é a tela). */
  const listRailMobileHidden = Boolean(focus) || tab === "tempo";
  const personFocus =
    !hubOpen && focus?.kind === "pessoa"
      ? data.people.find((p) => p.id === focus.id) ?? null
      : null;
  /** Pessoa e chat abrem em tela cheia; o resto usa painel à direita. */
  const sideDrawerOpen = Boolean(
    !hubOpen && focus && focus.kind !== "pessoa" && focus.kind !== "chat",
  );
  const activeChat =
    focus?.kind === "chat"
      ? selectedChat
      : filteredChats[0] ?? data.chats[0];

  const tabCounts = useMemo(
    () =>
      ({
        tempo: data.events.length,
        pessoas: data.people.length,
        lugares: data.places.length,
        chats: data.chats.length,
        provas: data.evidence.length,
        cruzar: 0,
      }) as Record<MesaTab, number>,
    [data],
  );

  return (
    <div
      ref={shellRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Mesa de investigação · ${data.title}`}
      className="lupa-on-dark fixed inset-0 z-[100] bg-black text-white outline-none"
    >
      <MesaTutorial
        open={tutorialOpen}
        onClose={() => {
          markMesaTutorialSeen();
          setTutorialOpen(false);
        }}
        onFinish={() => {
          markMesaTutorialSeen();
          setTutorialOpen(false);
          if (!initialFocus) setHubOpen(true);
        }}
      />

      {/* Menu de abas · primeira tela (e quando pede Menu) */}
      {hubOpen ? (
        <MesaHub
          title={data.title}
          caseTitle={caseTitle}
          counts={tabCounts}
          onPick={enterFromHub}
          onTutorial={() => setTutorialOpen(true)}
        />
      ) : null}

      {/* Stage em tela cheia */}
      <div
        className={`absolute inset-0 ${hubOpen ? "invisible pointer-events-none" : ""}`}
        aria-hidden={hubOpen}
      >
        {/* Quem: monta na 1ª visita e mantém viva (sem reload a cada troca de aba) */}
        {peopleMounted ? (
          <div
            className={`absolute inset-0 ${
              tab === "pessoas"
                ? personFocus
                  ? "pointer-events-none z-0 opacity-100"
                  : "z-0 opacity-100"
                : "pointer-events-none invisible z-0 opacity-0"
            }`}
            aria-hidden={tab !== "pessoas" || Boolean(personFocus)}
          >
            <MesaPeopleGallery
              people={data.people}
              onSelect={(id) => selectFocus({ kind: "pessoa", id }, "pessoas")}
              className="h-full w-full"
            />
          </div>
        ) : null}
        {tab === "pessoas" ? null : tab === "tempo" ? (
          <div className="relative z-[1] h-full overflow-y-auto px-3 pb-32 pt-24 sm:px-8 sm:pb-36 sm:pt-28 lg:pl-[280px] lg:pr-8">
            <TimelinePane
              events={filteredEvents}
              focusId={focus?.kind === "evento" ? focus.id : null}
              onSelect={(id) => selectFocus({ kind: "evento", id }, "tempo")}
            />
          </div>
        ) : tab === "chats" ? (
          <div
            className={`relative z-[1] h-full min-h-0 overflow-y-auto overscroll-contain px-3 pb-32 pt-24 sm:px-8 sm:pb-36 sm:pt-28 lg:pl-[280px] lg:pr-8 ${
              focus?.kind !== "chat" ? "max-lg:hidden" : ""
            }`}
          >
            <div className="mx-auto w-full max-w-lg">
              {focus?.kind === "chat" ? (
                <div className="mb-4 flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-xs">
                    <span className="font-bold uppercase tracking-wider text-white/45">
                      {V.lookingAt}:
                    </span>{" "}
                    <span className="font-bold">{focusLabel}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => selectFocus(null)}
                    className="lupa-soft inline-flex h-9 shrink-0 items-center justify-center border border-white bg-black px-3 text-[9px] font-bold uppercase leading-none tracking-[0.16em] transition hover:bg-white hover:text-black"
                  >
                    {V.clearFocus}
                  </button>
                </div>
              ) : null}
              <ChatPane
                data={data}
                chat={activeChat}
                reveal={chatReveal}
                showGuide={focus?.kind !== "chat"}
                onPickFirst={() => {
                  const first = filteredChats[0] ?? data.chats[0];
                  if (first)
                    selectFocus({ kind: "chat", id: first.id }, "chats");
                }}
              />
              {focus?.kind === "chat" ? (
                <div className="mt-8 border-t border-white/15 pt-5 pb-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                    {V.linksTitle}
                  </p>
                  <div className="space-y-4">
                    <LinkGroup
                      label="Pessoas"
                      items={related.people.map((p) => ({
                        id: p.id,
                        title: p.name,
                        onClick: () =>
                          selectFocus({ kind: "pessoa", id: p.id }, "pessoas"),
                      }))}
                    />
                    <LinkGroup
                      label="Datas"
                      items={related.events.map((e) => ({
                        id: e.id,
                        title: `${e.when} · ${e.title}`,
                        onClick: () =>
                          selectFocus({ kind: "evento", id: e.id }, "tempo"),
                      }))}
                    />
                    <LinkGroup
                      label="Lugares"
                      items={related.places.map((p) => ({
                        id: p.id,
                        title: p.name,
                        onClick: () =>
                          selectFocus({ kind: "lugar", id: p.id }, "lugares"),
                      }))}
                    />
                    <LinkGroup
                      label="Mensagens"
                      items={related.chats.map((c) => ({
                        id: c.id,
                        title: c.title,
                        onClick: () =>
                          selectFocus({ kind: "chat", id: c.id }, "chats"),
                      }))}
                    />
                    <LinkGroup
                      label="Provas"
                      items={related.evidence.map((v) => ({
                        id: v.id,
                        title: v.title,
                        onClick: () =>
                          selectFocus({ kind: "prova", id: v.id }, "provas"),
                      }))}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : tab === "cruzar" ? (
          <div className="relative z-[1] hidden h-full overflow-y-auto px-3 pb-32 pt-24 sm:px-8 sm:pb-36 sm:pt-28 lg:block lg:pl-[280px] lg:pr-8">
            <CrossPane
              hits={crossHits}
              onSelect={(f) => {
                const nextTab =
                  f.kind === "pessoa"
                    ? "pessoas"
                    : f.kind === "evento"
                      ? "tempo"
                      : f.kind === "chat"
                        ? "chats"
                        : f.kind === "lugar"
                          ? "lugares"
                          : "provas";
                selectFocus(f, nextTab);
              }}
            />
          </div>
        ) : tab === "lugares" || tab === "provas" ? (
          <div
            className={`relative z-[1] flex h-full items-center justify-center px-4 pb-32 pt-24 sm:px-6 sm:pb-36 sm:pt-28 lg:pl-[280px] ${
              !focus ? "max-lg:hidden" : ""
            }`}
          >
            <p className="max-w-sm text-center text-sm leading-relaxed text-white/45">
              Escolha um item na lista
              <span className="hidden lg:inline"> à esquerda</span>. O detalhe e
              as ligações abrem no painel.
            </p>
          </div>
        ) : (
          <div className="relative z-[1] h-full overflow-y-auto px-4 pb-36 pt-28 sm:px-8 sm:pt-28">
            <StartGuide
              onPeople={() => changeTab("pessoas")}
              onChat={() => {
                const first = data.chats[0];
                if (first) selectFocus({ kind: "chat", id: first.id }, "chats");
                else changeTab("chats");
              }}
              onTime={() => changeTab("tempo")}
              starterPerson={data.people.find((p) => p.id === "vorcaro")}
              onStarterPerson={() =>
                selectFocus({ kind: "pessoa", id: "vorcaro" }, "pessoas")
              }
              onOpenTutorial={() => setTutorialOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Chrome · barra única no topo (não flutua em cima da lista) */}
      {!hubOpen ? (
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 border-b border-white/20 bg-black px-3 py-2.5 sm:px-4">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/50">
              Lupa · Mesa
            </p>
            <h1 className="truncate font-[family-name:var(--font-display)] text-lg uppercase leading-none tracking-tight sm:text-xl">
              {data.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              className="lupa-soft inline-flex h-9 items-center justify-center border border-white bg-black px-2.5 text-[9px] font-bold uppercase leading-none tracking-[0.14em] transition hover:bg-white hover:text-black sm:px-3 sm:tracking-[0.16em]"
              aria-label={V.tutHelp}
            >
              <span className="sm:hidden">?</span>
              <span className="hidden sm:inline">{V.tutHelp}</span>
            </button>
            <Link
              href={dossierHref}
              aria-label={ctaBack}
              className="lupa-soft inline-flex h-9 items-center justify-center border border-white bg-black px-2.5 text-[9px] font-bold uppercase leading-none tracking-[0.14em] transition hover:bg-white hover:text-black sm:px-3 sm:tracking-[0.16em]"
            >
              <span className="sm:hidden">Sair</span>
              <span className="hidden sm:inline">{ctaBack}</span>
            </Link>
          </div>
        </header>
      ) : (
        <header className="absolute inset-x-0 top-0 z-[45] flex items-center justify-end gap-3 px-3 py-2.5 sm:px-4">
          <Link
            href={dossierHref}
            aria-label={ctaBack}
            className="lupa-soft inline-flex h-9 items-center justify-center border border-white bg-black px-3 text-[9px] font-bold uppercase leading-none tracking-[0.16em] transition hover:bg-white hover:text-black"
          >
            {ctaBack}
          </Link>
        </header>
      )}

      {/* Lista: no desktop flutua à esquerda; no celular ocupa a tela até abrir um item */}
      {showListRail ? (
        <aside
          className={`absolute z-20 overflow-hidden border border-white/20 bg-black backdrop-blur-md max-lg:inset-x-0 max-lg:bottom-[4.75rem] max-lg:top-14 max-lg:w-full max-lg:rounded-none max-lg:border-x-0 lg:bottom-28 lg:left-4 lg:top-14 lg:w-60 ${
            listRailMobileHidden ? "max-lg:hidden" : ""
          }`}
        >
          <div className="h-full overflow-y-auto overscroll-contain">
            <p className="border-b border-white/10 px-3 py-1.5 text-[10px] text-white/35">
              {V.listHint}
            </p>
            {tab === "tempo" ? (
              <ListPane title={`Datas · ${filteredEvents.length}`}>
                {filteredEvents.map((e) => (
                  <ListButton
                    key={e.id}
                    active={focus?.kind === "evento" && focus.id === e.id}
                    onClick={() =>
                      selectFocus({ kind: "evento", id: e.id }, "tempo")
                    }
                    eyebrow={e.when}
                    title={e.title}
                    keyMark={e.key}
                  />
                ))}
              </ListPane>
            ) : null}
            {tab === "pessoas" ? (
              <ListPane title={`Quem · ${data.people.length}`}>
                {data.people.map((p) => (
                  <ListButton
                    key={p.id}
                    active={false}
                    onClick={() =>
                      selectFocus({ kind: "pessoa", id: p.id }, "pessoas")
                    }
                    eyebrow={p.role.split(";")[0]?.trim()}
                    title={p.name}
                    avatar={
                      p.photo
                        ? { src: p.photo.src, alt: p.photo.alt }
                        : undefined
                    }
                    initials={p.name.slice(0, 2).toUpperCase()}
                  />
                ))}
              </ListPane>
            ) : null}
            {tab === "lugares" ? (
              <ListPane title={`Onde · ${filteredPlaces.length}`}>
                {filteredPlaces.map((p) => (
                  <ListButton
                    key={p.id}
                    active={focus?.kind === "lugar" && focus.id === p.id}
                    onClick={() =>
                      selectFocus({ kind: "lugar", id: p.id }, "lugares")
                    }
                    eyebrow={PLACE_KIND[p.kind]}
                    title={p.name}
                  />
                ))}
              </ListPane>
            ) : null}
            {tab === "chats" ? (
              <ListPane title={`Msgs · ${filteredChats.length}`}>
                {filteredChats.map((c) => (
                  <ListButton
                    key={c.id}
                    active={focus?.kind === "chat" && focus.id === c.id}
                    onClick={() =>
                      selectFocus({ kind: "chat", id: c.id }, "chats")
                    }
                    eyebrow={c.subtitle}
                    title={c.title}
                  />
                ))}
              </ListPane>
            ) : null}
            {tab === "provas" ? (
              <ListPane title={`Provas · ${filteredEvidence.length}`}>
                {filteredEvidence.map((v) => (
                  <ListButton
                    key={v.id}
                    active={focus?.kind === "prova" && focus.id === v.id}
                    onClick={() =>
                      selectFocus({ kind: "prova", id: v.id }, "provas")
                    }
                    eyebrow={EVIDENCE_KIND[v.kind]}
                    title={v.title}
                    meta={v.value}
                  />
                ))}
              </ListPane>
            ) : null}
            {tab === "cruzar" ? (
              <ListPane title="Dois pontos">
                <div className="space-y-3 p-3">
                  <p className="text-[11px] leading-snug text-white/50">
                    {V.crossHow}
                  </p>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Primeiro
                    <span className="relative mt-1 block">
                      <select
                        value={crossA}
                        onChange={(e) => setCrossA(e.target.value)}
                        className="w-full appearance-none border border-white/30 bg-black py-2.5 pl-3 pr-12 text-sm text-white"
                      >
                        <option value="">Escolher…</option>
                        {crossOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-white/60"
                      >
                        ▾
                      </span>
                    </span>
                  </label>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Segundo
                    <span className="relative mt-1 block">
                      <select
                        value={crossB}
                        onChange={(e) => setCrossB(e.target.value)}
                        className="w-full appearance-none border border-white/30 bg-black py-2.5 pl-3 pr-12 text-sm text-white"
                      >
                        <option value="">Escolher…</option>
                        {crossOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-white/60"
                      >
                        ▾
                      </span>
                    </span>
                  </label>
                </div>
                <div className="border-t border-white/15 p-3 lg:hidden">
                  <CrossPane
                    hits={crossHits}
                    onSelect={(f) => {
                      const nextTab =
                        f.kind === "pessoa"
                          ? "pessoas"
                          : f.kind === "evento"
                            ? "tempo"
                            : f.kind === "chat"
                              ? "chats"
                              : f.kind === "lugar"
                                ? "lugares"
                                : "provas";
                      selectFocus(f, nextTab);
                    }}
                  />
                </div>
              </ListPane>
            ) : null}
          </div>
        </aside>
      ) : null}

      {/* Barra de abas · embaixo (some no perfil e no menu) */}
      {!personFocus && !hubOpen ? (
        <nav
          aria-label={V.hubSwitch}
          className="lupa-mesa-dock absolute inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex items-stretch gap-1.5 px-2 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
            <button
              type="button"
              onClick={openHubMenu}
              className="lupa-soft flex w-12 shrink-0 items-center justify-center border border-white/50 text-[9px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black sm:w-[4.25rem] sm:text-[10px] sm:tracking-[0.16em]"
            >
              {V.hubOpen}
            </button>
            <div
              role="tablist"
              aria-label={V.hubSwitch}
              className="flex min-w-0 flex-1 gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-6 sm:overflow-visible [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((t) => {
                const on = tab === t.id;
                const n = tabCounts[t.id];
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => changeTab(t.id)}
                    title={t.hint}
                    className={`lupa-soft flex min-h-11 min-w-[3.35rem] flex-col items-center justify-center gap-1 px-2 py-1.5 transition sm:min-w-0 sm:flex-1 sm:px-0.5 ${
                      on
                        ? "bg-white text-black"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="max-w-full truncate text-[9px] font-bold uppercase leading-none tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]">
                      {t.label}
                    </span>
                    <span
                      className={`text-[9px] leading-none tabular-nums ${
                        on ? "text-[#666]" : "text-white/40"
                      }`}
                    >
                      {n > 0 ? n : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      ) : null}

      {/* Perfil da pessoa · tela cheia (galeria fica montada atrás) */}
      {personFocus && focus?.kind === "pessoa" ? (
        <PersonFullscreen
          person={personFocus}
          people={data.people}
          related={related}
          onClose={() => selectFocus(null, "pessoas")}
          onPerson={(id) => selectFocus({ kind: "pessoa", id }, "pessoas")}
          onEvent={(id) => selectFocus({ kind: "evento", id }, "tempo")}
          onPlace={(id) => selectFocus({ kind: "lugar", id }, "lugares")}
          onChat={(id) => selectFocus({ kind: "chat", id }, "chats")}
          onEvidence={(id) => selectFocus({ kind: "prova", id }, "provas")}
        />
      ) : null}

      {/* Painel lateral · datas, lugares, provas (pessoa e chat: tela cheia) */}
      {sideDrawerOpen && focus ? (
        <>
          <button
            type="button"
            aria-label="Fechar painel"
            className="absolute inset-0 z-40 bg-black/50"
            onClick={() => selectFocus(null)}
          />
          <aside
            className="lupa-on-dark absolute inset-y-0 right-0 z-50 flex w-full max-w-none flex-col border-l border-white/25 bg-black shadow-[-16px_0_40px_rgba(0,0,0,0.5)] sm:max-w-lg"
            aria-label={`${V.lookingAt}: ${focusLabel ?? ""}`}
          >
            <div className="flex shrink-0 items-center gap-2 border-b border-white/20 px-4 py-3">
              <p className="min-w-0 flex-1 truncate text-xs">
                <span className="font-bold uppercase tracking-wider text-white/45">
                  {V.lookingAt}:
                </span>{" "}
                <span className="font-bold">{focusLabel}</span>
              </p>
              <button
                type="button"
                onClick={() => selectFocus(null)}
                className="lupa-soft inline-flex h-9 shrink-0 items-center justify-center border border-white bg-black px-3 text-[9px] font-bold uppercase leading-none tracking-[0.16em] transition hover:bg-white hover:text-black"
              >
                {V.clearFocus}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <DetailPane data={data} focus={focus} fallbackTab={tab} />
              <div className="mt-8 border-t border-white/15 pt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {V.linksTitle}
                </p>
                <div className="space-y-4">
                  <LinkGroup
                    label="Pessoas"
                    items={related.people.map((p) => ({
                      id: p.id,
                      title: p.name,
                      onClick: () =>
                        selectFocus({ kind: "pessoa", id: p.id }, "pessoas"),
                    }))}
                  />
                  <LinkGroup
                    label="Datas"
                    items={related.events.map((e) => ({
                      id: e.id,
                      title: `${e.when} · ${e.title}`,
                      onClick: () =>
                        selectFocus({ kind: "evento", id: e.id }, "tempo"),
                    }))}
                  />
                  <LinkGroup
                    label="Lugares"
                    items={related.places.map((p) => ({
                      id: p.id,
                      title: p.name,
                      onClick: () =>
                        selectFocus({ kind: "lugar", id: p.id }, "lugares"),
                    }))}
                  />
                  <LinkGroup
                    label="Mensagens"
                    items={related.chats.map((c) => ({
                      id: c.id,
                      title: c.title,
                      onClick: () =>
                        selectFocus({ kind: "chat", id: c.id }, "chats"),
                    }))}
                  />
                  <LinkGroup
                    label="Provas"
                    items={related.evidence.map((v) => ({
                      id: v.id,
                      title: v.title,
                      onClick: () =>
                        selectFocus({ kind: "prova", id: v.id }, "provas"),
                    }))}
                  />
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : null}

      {/* Hint discreto quando galeria sem foco */}
      {tab === "pessoas" && !focus && !hubOpen ? (
        <p className="pointer-events-none absolute bottom-28 left-4 z-20 max-w-[14rem] text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 sm:left-[calc(240px+2rem)]">
          Lista à esquerda · arraste ou clique na galeria
        </p>
      ) : null}

      <p className="sr-only">{disclaimer}</p>
    </div>
  );
}

function ListPane({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="sticky top-0 z-10 border-b border-white/15 bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

function ListButton({
  active,
  onClick,
  eyebrow,
  title,
  meta,
  keyMark,
  avatar,
  initials: ini,
}: {
  active: boolean;
  onClick: () => void;
  eyebrow?: string;
  title: string;
  meta?: string;
  keyMark?: boolean;
  avatar?: { src: string; alt: string };
  initials?: string;
}) {
  const showFace = Boolean(avatar || ini);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b border-white/15 bg-transparent px-3 py-3 text-left text-white transition ${
        active ? "bg-white text-black" : "hover:bg-white/10"
      }`}
    >
      {showFace ? (
        <span
          className={`relative h-10 w-10 shrink-0 overflow-hidden border ${
            active ? "border-black" : "border-white/30"
          }`}
        >
          <PersonFace
            name={title}
            photo={avatar}
            sizes="40px"
            fallbackClassName={
              active ? "bg-black text-white" : "bg-white/10 text-white"
            }
          />
        </span>
      ) : keyMark ? (
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
            active ? "bg-black" : "bg-white"
          }`}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0 flex-1">
        {eyebrow ? (
          <span
            className={`block text-[10px] font-bold uppercase tracking-wider ${
              active ? "text-black/50" : "text-white/40"
            }`}
          >
            {eyebrow}
          </span>
        ) : null}
        <span className="block text-sm font-semibold leading-snug">{title}</span>
        {meta ? (
          <span
            className={`mt-0.5 block font-[family-name:var(--font-display)] text-lg uppercase leading-none ${
              active ? "text-black" : "text-white"
            }`}
          >
            {meta}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function LinkGroup({
  label,
  items,
}: {
  label: string;
  items: { id: string; title: string; onClick: () => void }[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.onClick}
              className="w-full border border-white/20 px-2 py-1.5 text-left text-xs font-medium transition hover:bg-white hover:text-black"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelinePane({
  events,
  focusId,
  onSelect,
}: {
  events: InvestigationEvent[];
  focusId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
        O fio
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight sm:text-5xl">
        Linha do tempo
      </h2>
      <ol className="relative mt-8 space-y-0 border-l border-white/30 pl-6">
        {events.map((e) => {
          const on = focusId === e.id;
          return (
            <li key={e.id} className="relative pb-8 last:pb-0">
              <button
                type="button"
                onClick={() => onSelect(e.id)}
                className="group w-full text-left"
              >
                <span
                  className={`absolute -left-[1.55rem] top-1 block rounded-full border-2 border-black ${
                    e.key ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                  } ${on ? "bg-white" : "bg-white/40 group-hover:bg-white"}`}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {e.when}
                  {e.key ? " · chave" : ""}
                </span>
                <span
                  className={`mt-1 block font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight ${
                    on ? "underline underline-offset-4" : ""
                  }`}
                >
                  {e.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/70">
                  <LinkedText text={e.text} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PersonFullscreen({
  person,
  people,
  related,
  onClose,
  onPerson,
  onEvent,
  onPlace,
  onChat,
  onEvidence,
}: {
  person: InvestigationPerson;
  people: InvestigationPerson[];
  related: Links;
  onClose: () => void;
  onPerson: (id: string) => void;
  onEvent: (id: string) => void;
  onPlace: (id: string) => void;
  onChat: (id: string) => void;
  onEvidence: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const peopleById = useMemo(
    () => new Map(people.map((p) => [p.id, p])),
    [people],
  );

  useEffect(() => {
    panelRef.current?.focus();
  }, [person.id]);

  const counts = [
    { k: String(related.people.length), v: "Pessoas", n: related.people.length },
    { k: String(related.events.length), v: "Datas", n: related.events.length },
    { k: String(related.places.length), v: "Lugares", n: related.places.length },
    { k: String(related.chats.length), v: "Msgs", n: related.chats.length },
    {
      k: String(related.evidence.length),
      v: "Provas",
      n: related.evidence.length,
    },
  ].filter((c) => c.n > 0);

  /** Só fotos em que ESTA pessoa aparece. Sem fallback de rostos de terceiros. */
  const gallery: InvestigationGalleryPhoto[] = person.gallery ?? [];

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${person.name} · perfil`}
      className="lupa-quem-reveal lupa-on-dark absolute inset-0 z-[60] flex flex-col bg-black outline-none"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/20 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/45">
            Quem · dossiê
          </p>
          <p className="truncate font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight sm:text-2xl">
            {person.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 shrink-0 items-center justify-center border border-white bg-black px-3 text-[9px] font-bold uppercase leading-none tracking-[0.16em] transition hover:bg-white hover:text-black"
        >
          {V.closePerson}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-[minmax(240px,0.4fr)_minmax(0,1fr)]">
          <div className="border-b border-white/20 lg:sticky lg:top-0 lg:self-start lg:border-b-0 lg:border-r">
            <div className="relative aspect-[4/5] w-full bg-white/5 sm:aspect-[3/4] lg:aspect-auto lg:min-h-[min(72vh,640px)]">
              <PersonFace
                name={person.name}
                photo={person.photo}
                sizes="(max-width: 1024px) 70vw, 420px"
                className="absolute inset-0"
              />
            </div>
            {person.photo?.credit ? (
              <p className="px-4 py-2 text-[10px] text-white/35 sm:px-5">
                Foto: {person.photo.credit}
              </p>
            ) : (
              <p className="px-4 py-2 text-[10px] text-white/35 sm:px-5">
                Sem retrato público licenciado · iniciais
              </p>
            )}
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-8">
            {person.tags?.length ? (
              <p className="flex flex-wrap gap-1.5">
                {person.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </p>
            ) : null}
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,4.5rem)] uppercase leading-[0.88] tracking-tight">
              {person.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/80 sm:text-base">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                {V.personWho ?? "Quem é"}
              </span>
              <LinkedText text={person.role} />
            </p>

            {person.keyFacts && person.keyFacts.length > 0 ? (
              <section className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {V.personFacts}
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-px overflow-hidden border border-white/25 bg-white/25 sm:grid-cols-4">
                  {person.keyFacts.map((f) => (
                    <li
                      key={f.label}
                      className="bg-black px-3 py-3 sm:px-4 sm:py-4"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                        {f.label}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight sm:text-2xl">
                        {f.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {person.whyHere && person.whyHere.length > 0 ? (
              <section className="mt-6 border border-white/25 p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {V.personWhy}
                </p>
                <ul className="mt-3 space-y-3">
                  {person.whyHere.map((line) => (
                    <li
                      key={line.slice(0, 48)}
                      className="text-sm leading-relaxed text-white/80"
                    >
                      <LinkedText text={line} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {person.response ? (
              <div className="mt-5 border border-white/25 p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {V.personVersion ?? "Versão"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  <LinkedText text={person.response} />
                </p>
              </div>
            ) : null}

            {gallery.length > 0 ? (
              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  {V.personGallery}
                </p>
                {V.personGalleryHint ? (
                  <p className="mt-1 max-w-md text-[11px] leading-snug text-white/40">
                    {V.personGalleryHint}
                  </p>
                ) : null}
                <ul className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gallery.map((g) => {
                    const withPeople = (g.withPersonIds ?? [])
                      .map((id) => peopleById.get(id))
                      .filter(Boolean) as InvestigationPerson[];
                    return (
                      <li
                        key={`${g.src}-${g.caption ?? g.alt}`}
                        className="w-[9.5rem] shrink-0 sm:w-40"
                      >
                        <div className="w-full">
                          <span className="relative block aspect-[4/5] w-full overflow-hidden bg-white/5">
                            <Image
                              src={g.src}
                              alt={g.alt}
                              fill
                              sizes="320px"
                              className="object-cover object-top"
                            />
                          </span>
                          {g.caption ? (
                            <span className="mt-2 block text-[11px] font-bold leading-snug">
                              {g.caption}
                            </span>
                          ) : null}
                          {withPeople.length > 0 ? (
                            <span className="mt-1 block text-[10px] leading-snug text-white/55">
                              com{" "}
                              {withPeople.map((p, i) => (
                                <span key={p.id}>
                                  {i > 0 ? ", " : null}
                                  <button
                                    type="button"
                                    onClick={() => onPerson(p.id)}
                                    className="underline underline-offset-2 hover:text-white"
                                  >
                                    {p.name}
                                  </button>
                                </span>
                              ))}
                            </span>
                          ) : null}
                          {g.placeId ? (
                            <button
                              type="button"
                              onClick={() => onPlace(g.placeId!)}
                              className="mt-1 block text-[10px] text-white/45 underline underline-offset-2 hover:text-white"
                            >
                              Ver lugar
                            </button>
                          ) : null}
                          {g.credit ? (
                            <span className="mt-0.5 block text-[9px] text-white/35">
                              {g.credit}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {counts.length > 0 ? (
              <div
                className="mt-8 grid gap-2 border-y border-white/20 py-4"
                style={{
                  gridTemplateColumns: `repeat(${counts.length}, minmax(0, 1fr))`,
                }}
              >
                {counts.map((c) => (
                  <div key={c.v} className="text-center">
                    <p className="font-[family-name:var(--font-display)] text-2xl uppercase leading-none sm:text-3xl">
                      {c.k}
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
                      {c.v}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {related.events.length > 0 ? (
              <section className="mt-8">
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                  {V.personThread}
                </h3>
                {V.personThreadHint ? (
                  <p className="mt-1 max-w-lg text-[11px] leading-snug text-white/40">
                    {V.personThreadHint}
                  </p>
                ) : null}
                <ul className="mt-3 space-y-2">
                  {related.events.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => onEvent(e.id)}
                        className="w-full border border-white/20 px-3 py-3 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">
                          {e.when}
                          {e.key ? " · chave" : ""}
                        </span>
                        <span className="mt-1 block font-[family-name:var(--font-display)] text-xl uppercase leading-none tracking-tight">
                          {e.title}
                        </span>
                        <span className="mt-2 block text-xs leading-relaxed opacity-75">
                          <LinkedText text={e.text} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              {V.personLinks}
            </p>

            {related.people.length > 0 ? (
              <section className="mt-5">
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                  Pessoas
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {related.people.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onPerson(p.id)}
                        className="flex w-full items-center gap-3 border border-white/20 p-2 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden border border-white/25">
                          <PersonFace
                            name={p.name}
                            photo={p.photo}
                            sizes="48px"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] uppercase tracking-wider opacity-60">
                            {p.tags?.[0] ?? p.role.split(";")[0]?.slice(0, 36)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {related.places.length > 0 ? (
              <section className="mt-8">
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                  Lugares
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {related.places.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onPlace(p.id)}
                        className="w-full border border-white/20 px-3 py-3 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">
                          {PLACE_KIND[p.kind]}
                        </span>
                        <span className="mt-1 block text-sm font-bold">
                          {p.name}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed opacity-70">
                          {p.blurb}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {related.chats.length > 0 ? (
              <section className="mt-8">
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                  Mensagens
                </h3>
                <ul className="mt-3 space-y-2">
                  {related.chats.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onChat(c.id)}
                        className="w-full border border-white/20 px-3 py-3 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="block text-sm font-bold">{c.title}</span>
                        {c.subtitle ? (
                          <span className="mt-1 block text-[10px] uppercase tracking-wider opacity-55">
                            {c.subtitle}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {related.evidence.length > 0 ? (
              <section className="mt-8 pb-10">
                <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight">
                  Provas
                </h3>
                <ul className="mt-3 space-y-2">
                  {related.evidence.map((v) => (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => onEvidence(v.id)}
                        className="w-full border border-white/20 px-3 py-3 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">
                          {EVIDENCE_KIND[v.kind]}
                          {v.sourceLabel ? ` · ${v.sourceLabel}` : ""}
                        </span>
                        <span className="mt-1 block text-sm font-bold">
                          {v.title}
                        </span>
                        {v.value ? (
                          <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl uppercase leading-none">
                            {v.value}
                          </span>
                        ) : null}
                        <span className="mt-2 block text-xs leading-relaxed opacity-75">
                          {v.blurb}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {related.people.length === 0 &&
            related.events.length === 0 &&
            related.places.length === 0 &&
            related.chats.length === 0 &&
            related.evidence.length === 0 ? (
              <p className="mt-6 text-sm text-white/50">{V.linksEmpty}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPane({
  data,
  focus,
  fallbackTab,
}: {
  data: CaseInvestigation;
  focus: MesaFocus | null;
  fallbackTab: MesaTab;
}) {
  if (!focus) {
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
          Mesa
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          {fallbackTab === "pessoas"
            ? "Quem aparece"
            : fallbackTab === "lugares"
              ? "Onde"
              : fallbackTab === "provas"
                ? "Provas"
                : "Explore"}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
          Clique à esquerda para abrir a ficha. À direita, o que se liga.
        </p>
      </div>
    );
  }

  if (focus.kind === "pessoa") {
    const p = data.people.find((x) => x.id === focus.id);
    if (!p) return null;
    return (
      <article>
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-white/30 bg-white/5">
            <PersonFace name={p.name} photo={p.photo} sizes="112px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
              Pessoa
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight">
              {p.name}
            </h2>
            {p.tags?.length ? (
              <p className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-white/80">
          <LinkedText text={p.role} />
        </p>
        {p.response ? (
          <div className="mt-6 border border-white/25 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              O que diz
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              <LinkedText text={p.response} />
            </p>
          </div>
        ) : null}
        {p.photo?.credit ? (
          <p className="mt-4 text-[10px] text-white/35">Foto: {p.photo.credit}</p>
        ) : null}
      </article>
    );
  }

  if (focus.kind === "lugar") {
    const p = data.places.find((x) => x.id === focus.id);
    if (!p) return null;
    return (
      <article>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
          {PLACE_KIND[p.kind]}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight">
          {p.name}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          <LinkedText text={p.blurb} />
        </p>
      </article>
    );
  }

  if (focus.kind === "evento") {
    const e = data.events.find((x) => x.id === focus.id);
    if (!e) return null;
    return (
      <article>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
          {e.when}
          {e.key ? " · ponto chave" : ""}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight">
          {e.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          <LinkedText text={e.text} />
        </p>
      </article>
    );
  }

  if (focus.kind === "prova") {
    const v = data.evidence.find((x) => x.id === focus.id);
    if (!v) return null;
    return (
      <article>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
          {EVIDENCE_KIND[v.kind]}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight">
          {v.title}
        </h2>
        {v.value ? (
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase leading-none">
            {v.value}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          <LinkedText text={v.blurb} />
        </p>
        {v.sourceLabel ? (
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Fonte · {v.sourceLabel}
          </p>
        ) : null}
      </article>
    );
  }

  return null;
}

function MesaHub({
  title,
  caseTitle,
  counts,
  onPick,
  onTutorial,
}: {
  title: string;
  caseTitle: string;
  counts: Record<MesaTab, number>;
  onPick: (tab: MesaTab) => void;
  onTutorial: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col overflow-y-auto bg-black px-4 pb-10 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
          {V.hubEyebrow}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.75rem,10vw,5rem)] uppercase leading-[0.88] tracking-tight">
          {V.hubTitle}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight text-white/55 sm:text-3xl">
          {title}
        </p>
        <p className="mt-1 text-xs text-white/35">{caseTitle}</p>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
          {V.hubBody}
        </p>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {TABS.map((t) => {
            const n = counts[t.id];
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onPick(t.id)}
                  className="lupa-soft group flex w-full items-start justify-between gap-3 border-2 border-white/30 bg-black px-4 py-4 text-left transition hover:border-white hover:bg-white hover:text-black"
                >
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-display)] text-3xl uppercase leading-none tracking-tight sm:text-4xl">
                      {t.label}
                    </span>
                    <span className="mt-2 block text-xs leading-snug text-white/50 group-hover:text-black/55">
                      {t.hint}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    {n > 0 ? (
                      <span className="block font-[family-name:var(--font-display)] text-2xl uppercase leading-none tabular-nums">
                        {n}
                      </span>
                    ) : (
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-40">
                        cruzar
                      </span>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] opacity-40 group-hover:opacity-70">
                      Abrir
                      <ArrowRightIcon size={10} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onTutorial}
          className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 underline underline-offset-4 transition hover:text-white"
        >
          {V.tutHelp} de novo
        </button>
      </div>
    </div>
  );
}

function StartGuide({
  onPeople,
  onChat,
  onTime,
  starterPerson,
  onStarterPerson,
  onOpenTutorial,
}: {
  onPeople: () => void;
  onChat: () => void;
  onTime: () => void;
  starterPerson?: InvestigationPerson;
  onStarterPerson: () => void;
  onOpenTutorial: () => void;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
        {V.startTitle}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight sm:text-5xl">
        Escolha um ponto
      </h2>
      <p className="mt-5 text-sm leading-relaxed text-white/55">{V.startBody}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {starterPerson ? (
          <button
            type="button"
            onClick={onStarterPerson}
            className="border-2 border-white bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white"
          >
            Abrir {starterPerson.name.split(" ")[0]}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onPeople}
          className="border border-white/40 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
        >
          {V.startPeople}
        </button>
        <button
          type="button"
          onClick={onChat}
          className="border border-white/40 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
        >
          {V.startChat}
        </button>
        <button
          type="button"
          onClick={onTime}
          className="border border-white/40 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
        >
          {V.startTime}
        </button>
        <button
          type="button"
          onClick={onOpenTutorial}
          className="border border-white/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 transition hover:border-white hover:text-white"
        >
          {V.tutHelp} de novo
        </button>
      </div>
    </div>
  );
}

function ChatPane({
  data,
  chat,
  reveal,
  showGuide,
  onPickFirst,
}: {
  data: CaseInvestigation;
  chat: InvestigationChat | undefined;
  reveal: number;
  showGuide?: boolean;
  onPickFirst?: () => void;
}) {
  if (!chat) {
    return (
      <p className="text-sm text-white/50">Nenhuma mensagem neste recorte.</p>
    );
  }
  const visible = chat.messages.slice(0, Math.max(1, reveal));

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      {showGuide ? (
        <p className="mb-3 border border-dashed border-white/25 px-3 py-2 text-[11px] leading-snug text-white/50">
          Escolha um fio na lista à esquerda.{" "}
          {onPickFirst ? (
            <button
              type="button"
              onClick={onPickFirst}
              className="font-bold text-white underline underline-offset-2"
            >
              Abrir o primeiro
            </button>
          ) : null}
        </p>
      ) : null}
      <div className="border border-white/25 bg-white/[0.03] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
          Mensagem · como saiu na imprensa
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase leading-none tracking-tight">
          {chat.title}
        </h2>
        {chat.subtitle ? (
          <p className="mt-1 text-xs text-white/50">{chat.subtitle}</p>
        ) : null}
        <p className="mt-3 text-[11px] leading-snug text-white/45">
          {chat.sourceNote}
          {chat.sourceUrl ? (
            <>
              {" "}
              <a
                href={chat.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-white"
              >
                Abrir fonte
              </a>
            </>
          ) : null}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 rounded-sm border border-white/15 bg-black p-3 sm:p-4">
        {visible.map((m, i) => {
          const out = m.side === "out";
          const name = personName(data, m.from);
          return (
            <div
              key={`${chat.id}-${i}`}
              className={`flex inv-chat-in ${out ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
            >
              <div
                className={`max-w-[85%] px-3 py-2 ${
                  out
                    ? "border border-white bg-white text-black"
                    : "border border-white/30 bg-white/10 text-white"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    out ? "text-black/50" : "text-white/45"
                  }`}
                >
                  {name}
                  {m.when ? ` · ${m.when}` : ""}
                </p>
                <p className="mt-0.5 text-sm leading-snug">
                  <LinkedText text={m.text} />
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CrossPane({
  hits,
  onSelect,
}: {
  hits: { label: string; focus: MesaFocus }[];
  onSelect: (f: MesaFocus) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
        A × B
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight sm:text-5xl">
        O que os dois têm em comum
      </h2>
      <p className="mt-3 max-w-lg text-sm text-white/55">{V.crossHow}</p>
      {hits.length === 0 ? (
        <p className="mt-8 border border-dashed border-white/25 px-4 py-6 text-sm text-white/45">
          Ainda sem resultado. Escolha o primeiro e o segundo à esquerda (ex.:
          Vorcaro e Kassio).
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            {hits.length} em comum · clique para abrir
          </p>
          {hits.map((h) => (
            <li key={`${h.focus.kind}:${h.focus.id}:${h.label}`}>
              <button
                type="button"
                onClick={() => onSelect(h.focus)}
                className="w-full border border-white/30 px-4 py-3 text-left text-sm font-semibold transition hover:bg-white hover:text-black"
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
