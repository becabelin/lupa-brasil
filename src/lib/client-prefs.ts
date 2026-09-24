/** Preferências e consentimento no aparelho (cookie + localStorage). Sem IP. */

export const A11Y_STORAGE_KEY = "lupa-a11y";
export const CONSENT_STORAGE_KEY = "lupa-consent";

/** Chrome limita cookies a ~400 dias. */
export const PREFS_MAX_AGE_SEC = 60 * 60 * 24 * 400;

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i) === name) {
      return decodeURIComponent(part.slice(i + 1));
    }
  }
  return null;
}

export function writeCookie(name: string, value: string, maxAge = PREFS_MAX_AGE_SEC) {
  if (typeof document === "undefined") return;
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function readLocal(name: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}

export function writeLocal(name: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(name, value);
  } catch {
    /* ignore */
  }
}

/** Lê cookie primeiro, depois localStorage (preferência dura mais no cookie). */
export function readPersisted(name: string): string | null {
  return readCookie(name) ?? readLocal(name);
}

export function writePersisted(name: string, value: string) {
  writeCookie(name, value);
  writeLocal(name, value);
}

export function hasCookieConsent(): boolean {
  const v = readPersisted(CONSENT_STORAGE_KEY);
  return v === "1" || v === "accepted";
}

export function acceptCookieConsent() {
  writePersisted(CONSENT_STORAGE_KEY, "1");
}
