/** Coordenação splash → gate → home (sem flash do shell). */

type Listener = () => void;

let gateAllowed = false;
const listeners = new Set<Listener>();

export const INTRO_SESSION_KEY = "lupa-intro";

export function isGateAllowed() {
  return gateAllowed;
}

export function allowGate() {
  if (gateAllowed) return;
  gateAllowed = true;
  listeners.forEach((l) => l());
}

export function subscribeGateAllowed(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function lockShell() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.shellLock = "1";
}

export function unlockShell() {
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.shellLock;
  delete document.documentElement.dataset.introSplash;
  delete document.documentElement.dataset.readingGate;
}

export function openIntroSplash() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.introSplash = "open";
  document.documentElement.dataset.shellLock = "1";
}

export function closeIntroSplash() {
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.introSplash;
}

export function openReadingGateAttr() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.readingGate = "open";
  document.documentElement.dataset.shellLock = "1";
}

export function sessionIntroDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSessionIntroDone() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}
