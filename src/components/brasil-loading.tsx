"use client";

import { PixelatedCarousel } from "@/components/pixelated-carousel";
import { cn } from "@/lib/utils";

/** Fotos P&B do Brasil para a tela de carregamento (domínio público / acervo do site). */
export const BRASIL_LOADING_IMAGES = [
  "/brasil/cristo.jpg",
  "/brasil/congresso-wmc.jpg",
  "/brasil/amazonia-conselho.jpg",
  "/brasil/iguacu.jpg",
  "/brasil/esplanada.jpg",
  "/brasil/amazonia.jpg",
] as const;

type Props = {
  label?: string;
  className?: string;
  pixelSize?: number;
};

/** Loading com Pixelated Carousel e paisagens do Brasil em P&B. */
export function BrasilLoading({
  label = "Carregando…",
  className,
  pixelSize = 56,
}: Props) {
  return (
    <div
      className={cn(
        "relative min-h-[240px] flex-1 overflow-hidden bg-black",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <PixelatedCarousel
        images={[...BRASIL_LOADING_IMAGES]}
        pixelSize={pixelSize}
        alt="Brasil em preto e branco"
        className="absolute inset-0"
      />
      <div className="lupa-photo-caption pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-14">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
          {label}
        </p>
      </div>
    </div>
  );
}
