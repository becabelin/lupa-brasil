import type { AskResult } from "@/lib/ask-shared";

/**
 * Cache curto de respostas idênticas (mesmo texto normalizado).
 * Evita gastar token de novo com a mesma pergunta em sequência.
 */

type Entry = {
  result: AskResult;
  expiresAt: number;
};

const cache = new Map<string, Entry>();
const DEFAULT_TTL_MS = 15 * 60_000;
const MAX_ENTRIES = 200;

function foldKey(question: string) {
  return question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

function ttlMs() {
  const raw = process.env.ASK_CACHE_TTL_MIN;
  if (!raw) return DEFAULT_TTL_MS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_TTL_MS;
  return n * 60_000;
}

function prune(now: number) {
  for (const [k, v] of cache) {
    if (v.expiresAt <= now) cache.delete(k);
  }
  if (cache.size <= MAX_ENTRIES) return;
  const overflow = cache.size - MAX_ENTRIES;
  const keys = cache.keys();
  for (let i = 0; i < overflow; i += 1) {
    const next = keys.next();
    if (next.done) break;
    cache.delete(next.value);
  }
}

export function getAskCache(question: string): AskResult | null {
  const key = foldKey(question);
  if (!key) return null;
  const now = Date.now();
  prune(now);
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= now) {
    cache.delete(key);
    return null;
  }
  return hit.result;
}

export function setAskCache(question: string, result: AskResult) {
  const key = foldKey(question);
  if (!key) return;
  const now = Date.now();
  prune(now);
  cache.set(key, { result, expiresAt: now + ttlMs() });
}
