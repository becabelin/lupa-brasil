"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";
export type FontScale = "sm" | "md" | "lg" | "xl";
export type Contrast = "normal" | "high";
/** Como o site explica: mais direto ou com mais detalhe. */
export type ReadingLevel = "simples" | "completo";

type Prefs = {
  theme: Theme;
  fontScale: FontScale;
  contrast: Contrast;
  readingLevel: ReadingLevel;
  /** Já escolheu o nível (primeira visita). */
  readingChosen: boolean;
};

type Ctx = Prefs & {
  setTheme: (t: Theme) => void;
  setFontScale: (s: FontScale) => void;
  setContrast: (c: Contrast) => void;
  setReadingLevel: (level: ReadingLevel) => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
  bumpFont: (dir: -1 | 1) => void;
};

const STORAGE_KEY = "lupa-a11y";
const FONT_STEPS: FontScale[] = ["sm", "md", "lg", "xl"];

const AccCtx = createContext<Ctx | null>(null);

function readStored(): Prefs {
  const fallback: Prefs = {
    theme: "light",
    fontScale: "md",
    contrast: "normal",
    readingLevel: "simples",
    readingChosen: false,
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return { ...fallback, theme: prefersDark ? "dark" : "light" };
    }
    const parsed = JSON.parse(raw) as Partial<Prefs> & {
      readingLevel?: string;
      readingChosen?: boolean;
    };
    const level: ReadingLevel =
      parsed.readingLevel === "completo" ? "completo" : "simples";
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      fontScale: FONT_STEPS.includes(parsed.fontScale as FontScale)
        ? (parsed.fontScale as FontScale)
        : "md",
      contrast: parsed.contrast === "high" ? "high" : "normal",
      readingLevel: level,
      readingChosen: Boolean(parsed.readingChosen),
    };
  } catch {
    return fallback;
  }
}

function applyDom(prefs: Prefs) {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.font = prefs.fontScale;
  root.dataset.contrast = prefs.contrast;
  root.dataset.leitura = prefs.readingLevel;
  root.style.colorScheme = prefs.theme;
}

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<Prefs>({
    theme: "light",
    fontScale: "md",
    contrast: "normal",
    readingLevel: "simples",
    readingChosen: false,
  });

  useEffect(() => {
    const initial = readStored();
    setPrefs(initial);
    applyDom(initial);
  }, []);

  const commit = useCallback((next: Prefs) => {
    setPrefs(next);
    applyDom(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...prefs,
      setTheme: (theme) => commit({ ...prefs, theme }),
      setFontScale: (fontScale) => commit({ ...prefs, fontScale }),
      setContrast: (contrast) => commit({ ...prefs, contrast }),
      setReadingLevel: (readingLevel) =>
        commit({ ...prefs, readingLevel, readingChosen: true }),
      toggleTheme: () =>
        commit({
          ...prefs,
          theme: prefs.theme === "light" ? "dark" : "light",
        }),
      toggleContrast: () =>
        commit({
          ...prefs,
          contrast: prefs.contrast === "normal" ? "high" : "normal",
        }),
      bumpFont: (dir) => {
        const i = FONT_STEPS.indexOf(prefs.fontScale);
        const next =
          FONT_STEPS[
            Math.min(FONT_STEPS.length - 1, Math.max(0, i + dir))
          ];
        commit({ ...prefs, fontScale: next });
      },
    }),
    [prefs, commit],
  );

  return <AccCtx.Provider value={value}>{children}</AccCtx.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccCtx);
  if (!ctx) {
    throw new Error("useAccessibility fora do AccessibilityProvider");
  }
  return ctx;
}
