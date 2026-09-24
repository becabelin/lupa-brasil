"use client";

import { useAccessibility, type FontScale } from "@/components/accessibility";

const FONT_LABEL: Record<FontScale, string> = {
  sm: "A−",
  md: "A",
  lg: "A+",
  xl: "A++",
};

type Props = {
  /** Mostra o bloco de leitura (simples / completo). */
  showReading?: boolean;
  /** Só a grade A− / A / A+ / A++ (sem botões +/- duplicados). */
  compactFont?: boolean;
  className?: string;
};

/**
 * Controles de acessibilidade (leitura, tema, texto, contraste).
 * Usado no gate da primeira visita e no menu do rodapé.
 */
export function AccessibilityControls({
  showReading = true,
  compactFont = false,
  className = "",
}: Props) {
  const {
    theme,
    fontScale,
    contrast,
    readingLevel,
    setTheme,
    toggleContrast,
    bumpFont,
    setFontScale,
    setReadingLevel,
  } = useAccessibility();

  return (
    <div className={`space-y-4 ${className}`}>
      {showReading ? (
        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-wider">
            Leitura
          </legend>
          <p className="mt-1 text-[11px] font-medium leading-snug text-[#666]">
            Quanto de detalhe e jargão nas explicações.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setReadingLevel("simples")}
              aria-pressed={readingLevel === "simples"}
              className={`border-2 border-black px-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
                readingLevel === "simples"
                  ? "bg-black text-white"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
            >
              Mais simples
            </button>
            <button
              type="button"
              onClick={() => setReadingLevel("completo")}
              aria-pressed={readingLevel === "completo"}
              className={`border-2 border-black px-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
                readingLevel === "completo"
                  ? "bg-black text-white"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
            >
              Mais completo
            </button>
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider">
          Tema
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
            className={`border-2 border-black px-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
              theme === "light"
                ? "bg-black text-white"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            Claro
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
            className={`border-2 border-black px-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
              theme === "dark"
                ? "bg-black text-white"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            Escuro
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider">
          Tamanho do texto
        </legend>
        {compactFont ? (
          <div className="mt-2 grid grid-cols-4 gap-1">
            {(["sm", "md", "lg", "xl"] as FontScale[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontScale(s)}
                aria-pressed={fontScale === s}
                className={`border-2 border-black py-2 text-xs font-bold uppercase tracking-wider ${
                  fontScale === s
                    ? "bg-black text-white"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
              >
                {FONT_LABEL[s]}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => bumpFont(-1)}
              disabled={fontScale === "sm"}
              className="border-2 border-black px-3 py-2 text-sm font-bold transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Diminuir texto"
            >
              A−
            </button>
            <p className="flex-1 text-center text-xs font-bold uppercase tracking-wider">
              {FONT_LABEL[fontScale]}
            </p>
            <button
              type="button"
              onClick={() => bumpFont(1)}
              disabled={fontScale === "xl"}
              className="border-2 border-black px-3 py-2 text-sm font-bold transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Aumentar texto"
            >
              A+
            </button>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider">
          Contraste
        </legend>
        <button
          type="button"
          onClick={toggleContrast}
          aria-pressed={contrast === "high"}
          className={`mt-2 w-full border-2 border-black px-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
            contrast === "high"
              ? "bg-black text-white"
              : "bg-white hover:bg-black hover:text-white"
          }`}
        >
          {contrast === "high" ? "Alto contraste · ligado" : "Alto contraste"}
        </button>
      </fieldset>
    </div>
  );
}
