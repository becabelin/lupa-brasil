"use client";

import { Component, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

export function useEffectReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

let webglAvailable: boolean | undefined;
function supportsWebGL() {
  if (webglAvailable !== undefined) return webglAvailable;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webglAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglAvailable = false;
  }
  return webglAvailable;
}
const subscribeAvailability = () => () => {};

class SurfaceBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  label?: string;
  /** Conteúdo quando WebGL falha (lista acessível etc.). */
  fallback?: ReactNode;
};

export function WebGLSurface({
  children,
  className,
  style,
  label = "Galeria",
  fallback: fallbackContent,
}: Props) {
  const supported = useSyncExternalStore(
    subscribeAvailability,
    supportsWebGL,
    () => false,
  );
  const fallback = fallbackContent ?? (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 bg-black"
    />
  );
  return (
    <div
      className={cn(
        "relative isolate h-full min-h-[16rem] w-full overflow-hidden bg-black",
        className,
      )}
      style={{ containerType: "size", ...style }}
    >
      {!supported ? fallback : null}
      {supported ? (
        <SurfaceBoundary fallback={fallback}>{children}</SurfaceBoundary>
      ) : null}
    </div>
  );
}
