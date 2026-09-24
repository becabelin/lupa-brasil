/**
 * Rate limit em memória para /api/ask.
 * Em serverless (Vercel) o contador é por instância, mas ainda corta abuso
 * e picos. Ajuste via env: ASK_LIMIT_PER_MIN, ASK_LIMIT_PER_HOUR,
 * ASK_LIMIT_PER_DAY, ASK_GLOBAL_DAY.
 */

export type RateLimitResult =
  | { ok: true; remaining: { minute: number; hour: number; day: number } }
  | {
      ok: false;
      retryAfterSec: number;
      message: string;
      scope: "minute" | "hour" | "day" | "global";
    };

type Bucket = {
  /** timestamps (ms) das requisições recentes */
  hits: number[];
};

const byIp = new Map<string, Bucket>();
const globalHits: number[] = [];

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function envInt(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function askLimits() {
  return {
    perMinute: envInt("ASK_LIMIT_PER_MIN", 3),
    perHour: envInt("ASK_LIMIT_PER_HOUR", 12),
    perDay: envInt("ASK_LIMIT_PER_DAY", 30),
    globalDay: envInt("ASK_GLOBAL_DAY", 400),
  };
}

function prune(hits: number[], windowMs: number, now: number) {
  const cutoff = now - windowMs;
  let i = 0;
  while (i < hits.length && hits[i]! < cutoff) i += 1;
  if (i > 0) hits.splice(0, i);
}

function nextRetrySec(hits: number[], windowMs: number, limit: number, now: number) {
  if (hits.length < limit) return 1;
  const oldestInWindow = hits[hits.length - limit]!;
  return Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
}

/** Limpa mapas de vez em quando pra não crescer sem fim. */
function maybeGc(now: number) {
  if (byIp.size < 800) return;
  for (const [ip, bucket] of byIp) {
    prune(bucket.hits, DAY, now);
    if (bucket.hits.length === 0) byIp.delete(ip);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 80);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 80);
  // Vercel
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel.slice(0, 80);
  return "unknown";
}

export function checkAskRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const limits = askLimits();
  maybeGc(now);

  prune(globalHits, DAY, now);
  if (globalHits.length >= limits.globalDay) {
    return {
      ok: false,
      scope: "global",
      retryAfterSec: nextRetrySec(globalHits, DAY, limits.globalDay, now),
      message:
        "A fila de perguntas do dia encheu. Volte amanhã. A busca por páginas do site continua liberada.",
    };
  }

  let bucket = byIp.get(ip);
  if (!bucket) {
    bucket = { hits: [] };
    byIp.set(ip, bucket);
  }
  prune(bucket.hits, DAY, now);

  const inMinute = bucket.hits.filter((t) => t > now - MIN).length;
  if (inMinute >= limits.perMinute) {
    return {
      ok: false,
      scope: "minute",
      retryAfterSec: nextRetrySec(bucket.hits, MIN, limits.perMinute, now),
      message:
        "Muitas perguntas seguidas. Espere um minuto e tente de novo.",
    };
  }

  const inHour = bucket.hits.filter((t) => t > now - HOUR).length;
  if (inHour >= limits.perHour) {
    return {
      ok: false,
      scope: "hour",
      retryAfterSec: nextRetrySec(bucket.hits, HOUR, limits.perHour, now),
      message:
        "Limite por hora atingido. A busca por páginas do site continua liberada.",
    };
  }

  if (bucket.hits.length >= limits.perDay) {
    return {
      ok: false,
      scope: "day",
      retryAfterSec: nextRetrySec(bucket.hits, DAY, limits.perDay, now),
      message:
        "Limite diário de perguntas por IA atingido. Volte amanhã. A busca por páginas do site continua liberada.",
    };
  }

  return {
    ok: true,
    remaining: {
      minute: Math.max(0, limits.perMinute - inMinute - 1),
      hour: Math.max(0, limits.perHour - inHour - 1),
      day: Math.max(0, limits.perDay - bucket.hits.length - 1),
    },
  };
}

/** Só chamar depois de uma resposta bem-sucedida (não conta cache hit). */
export function recordAskSuccess(ip: string) {
  const now = Date.now();
  let bucket = byIp.get(ip);
  if (!bucket) {
    bucket = { hits: [] };
    byIp.set(ip, bucket);
  }
  bucket.hits.push(now);
  globalHits.push(now);
}
