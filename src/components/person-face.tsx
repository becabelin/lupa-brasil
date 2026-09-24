"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Iniciais sem preposições (de/da/do). */
export function personInitials(name: string): string {
  const skip = new Set(["de", "da", "do", "das", "dos", "e"]);
  const parts = name.split(/\s+/).filter((w) => w && !skip.has(w.toLowerCase()));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Silhueta genérica de usuário (sem face inventada). */
export function UserSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <circle cx="32" cy="22" r="12" fill="currentColor" />
      <path
        d="M8 58c2-14 12-22 24-22s22 8 24 22"
        fill="currentColor"
      />
    </svg>
  );
}

type Photo = {
  src: string;
  alt: string;
};

type Props = {
  name: string;
  photo?: Photo | null;
  className?: string;
  /** Classes do bloco de fallback (iniciais + silhueta). */
  fallbackClassName?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
};

/**
 * Retrato com fallback: foto, ou silhueta + iniciais.
 * Nunca inventa face; sem licença / sem arquivo → sigla.
 */
export function PersonFace({
  name,
  photo,
  className,
  fallbackClassName,
  sizes = "160px",
  priority,
  objectPosition = "center top",
}: Props) {
  if (photo?.src) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          src={photo.src}
          alt={photo.alt || name}
          fill
          priority={priority}
          className="object-cover"
          style={{ objectPosition }}
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-black text-white",
        fallbackClassName,
        className,
      )}
      aria-label={`${name} · sem retrato público`}
    >
      <UserSilhouette className="absolute inset-[18%] text-white/20" />
      <span className="relative z-[1] font-[family-name:var(--font-display)] text-[clamp(1.5rem,8vw,2.75rem)] uppercase leading-none tracking-tight">
        {personInitials(name)}
      </span>
    </div>
  );
}
