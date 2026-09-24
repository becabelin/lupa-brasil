"use client";

import { Fragment, useMemo } from "react";
import {
  explainerAliasIndex,
  type ExplainerHoverCard,
} from "@/data/explainers";
import { TermHover } from "@/components/term-hover";

type Props = {
  text: string;
  className?: string;
};

type Segment =
  | { type: "text"; value: string }
  | { type: "term"; value: string; explainer: ExplainerHoverCard };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function segmentText(text: string): Segment[] {
  const index = explainerAliasIndex();
  if (index.length === 0 || !text) return [{ type: "text", value: text }];

  const pattern = index.map((r) => escapeRegExp(r.alias)).join("|");
  if (!pattern) return [{ type: "text", value: text }];

  const re = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(re);
  const aliasMap = new Map(
    index.map((r) => [r.alias.toLowerCase(), r.explainer]),
  );

  const out: Segment[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    if (!part) continue;
    const explainer = aliasMap.get(part.toLowerCase());
    if (explainer) {
      // Um link por termo por bloco de texto (evita poluir a frase).
      const key = explainer.slug;
      if (seen.has(key)) {
        out.push({ type: "text", value: part });
      } else {
        seen.add(key);
        out.push({ type: "term", value: part, explainer });
      }
    } else {
      out.push({ type: "text", value: part });
    }
  }
  return out;
}

/** Destaca termos do glossário/casos com hover + link canônico. */
export function LinkedText({ text, className }: Props) {
  const segments = useMemo(() => segmentText(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === "term" ? (
          <TermHover key={`${seg.explainer.slug}-${i}`} explainer={seg.explainer}>
            {seg.value}
          </TermHover>
        ) : (
          <Fragment key={i}>{seg.value}</Fragment>
        ),
      )}
    </span>
  );
}
