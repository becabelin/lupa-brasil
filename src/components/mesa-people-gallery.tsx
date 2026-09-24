"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  WebGLSurface,
  useEffectReducedMotion,
} from "@/lib/effects/webgl-surface";
import { cn } from "@/lib/utils";
import { BrasilLoading } from "@/components/brasil-loading";
import type { InvestigationPerson } from "@/data/case-investigations";

const CONFIG = {
  cellSize: 0.85,
  zoomLevel: 1.2,
  lerpFactor: 0.075,
  borderColor: "rgba(255, 255, 255, 0.2)",
  backgroundColor: "rgba(0, 0, 0, 1)",
  textColor: "rgba(230, 230, 230, 1)",
  hoverColor: "rgba(255, 255, 255, 0.12)",
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uOffset;
  uniform vec2 uResolution;
  uniform vec4 uBorderColor;
  uniform vec4 uHoverColor;
  uniform vec4 uBackgroundColor;
  uniform vec2 uMousePos;
  uniform float uZoom;
  uniform float uCellSize;
  uniform float uTextureCount;
  uniform sampler2D uImageAtlas;
  uniform sampler2D uTextAtlas;
  varying vec2 vUv;

  void main() {
    vec2 screenUV = (vUv - 0.5) * 2.0;
    float radius = length(screenUV);
    float distortion = 1.0 - 0.08 * radius * radius;
    vec2 distortedUV = screenUV * distortion;
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 worldCoord = distortedUV * aspectRatio;
    worldCoord *= uZoom;
    worldCoord += uOffset;
    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);
    vec2 cellUV = fract(cellPos);
    vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
    mouseScreenUV.y = -mouseScreenUV.y;
    float mouseRadius = length(mouseScreenUV);
    float mouseDistortion = 1.0 - 0.08 * mouseRadius * mouseRadius;
    vec2 mouseDistortedUV = mouseScreenUV * mouseDistortion;
    vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio;
    mouseWorldCoord *= uZoom;
    mouseWorldCoord += uOffset;
    vec2 mouseCellPos = mouseWorldCoord / uCellSize;
    vec2 mouseCellId = floor(mouseCellPos);
    vec2 cellCenter = cellId + 0.5;
    vec2 mouseCellCenter = mouseCellId + 0.5;
    float cellDistance = length(cellCenter - mouseCellCenter);
    float hoverIntensity = 1.0 - smoothstep(0.4, 0.7, cellDistance);
    bool isHovered = hoverIntensity > 0.0 && uMousePos.x >= 0.0;
    vec3 backgroundColor = uBackgroundColor.rgb;
    if (isHovered) {
      backgroundColor = mix(uBackgroundColor.rgb, uHoverColor.rgb, hoverIntensity * uHoverColor.a);
    }
    float lineWidth = 0.005;
    float gridX = smoothstep(0.0, lineWidth, cellUV.x) * smoothstep(0.0, lineWidth, 1.0 - cellUV.x);
    float gridY = smoothstep(0.0, lineWidth, cellUV.y) * smoothstep(0.0, lineWidth, 1.0 - cellUV.y);
    float gridMask = gridX * gridY;
    float imageSize = 0.62;
    float imageBorder = (1.0 - imageSize) * 0.5;
    vec2 imageUV = (cellUV - imageBorder) / imageSize;
    float edgeSmooth = 0.01;
    vec2 imageMask = smoothstep(-edgeSmooth, edgeSmooth, imageUV) *
                    smoothstep(-edgeSmooth, edgeSmooth, 1.0 - imageUV);
    float imageAlpha = imageMask.x * imageMask.y;
    bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0;
    float textHeight = 0.14;
    float textY = 0.84;
    bool inTextArea = cellUV.x >= 0.05 && cellUV.x <= 0.95 && cellUV.y >= textY && cellUV.y <= (textY + textHeight);
    float texIndex = mod(cellId.x + cellId.y * 3.0, uTextureCount);
    vec3 color = backgroundColor;
    if (inImageArea && imageAlpha > 0.0) {
      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      // Mesma convenção do texto: inverte só dentro da célula, não o atlas inteiro
      // (senão foto e nome apontam pra pessoas diferentes).
      vec2 localUV = vec2(imageUV.x, 1.0 - imageUV.y);
      vec2 atlasUV = (atlasPos + localUV) / atlasSize;
      vec3 imageColor = texture2D(uImageAtlas, atlasUV).rgb;
      float gray = dot(imageColor, vec3(0.299, 0.587, 0.114));
      color = mix(color, vec3(gray), imageAlpha);
    }
    if (inTextArea) {
      vec2 textCoord = vec2((cellUV.x - 0.05) / 0.9, (cellUV.y - textY) / textHeight);
      textCoord.y = 1.0 - textCoord.y;
      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      vec2 atlasUV = (atlasPos + textCoord) / atlasSize;
      vec4 textColor = texture2D(uTextAtlas, atlasUV);
      color = mix(backgroundColor, textColor.rgb, textColor.a);
    }
    vec3 borderRGB = uBorderColor.rgb;
    float borderAlpha = uBorderColor.a;
    color = mix(color, borderRGB, (1.0 - gridMask) * borderAlpha);
    float fade = 1.0 - smoothstep(1.2, 1.8, radius);
    gl_FragColor = vec4(color * fade, 1.0);
  }
`;

function rgbaToArray(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\(([^)]+)\)/);
  if (!match) return [1, 1, 1, 1];
  const parts = match[1].split(",");
  return [
    parseFloat(parts[0]) / 255,
    parseFloat(parts[1]) / 255,
    parseFloat(parts[2]) / 255,
    parseFloat(parts[3] ?? "1"),
  ];
}

function skipWords(name: string) {
  const skip = new Set(["de", "da", "do", "das", "dos", "e"]);
  return name.split(/\s+/).filter((w) => w && !skip.has(w.toLowerCase()));
}

function initials(name: string) {
  const parts = skipWords(name);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function createTextTexture(title: string, subtitle: string, textColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 2048, 320);
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = false;
    ctx.font = "bold 72px sans-serif";
    ctx.textAlign = "left";
    const label = String(title).toUpperCase().slice(0, 28);
    ctx.fillText(label, 30, 90);
    ctx.font = "bold 64px sans-serif";
    ctx.fillStyle = "rgba(210,210,210,1)";
    ctx.fillText(String(subtitle).toUpperCase().slice(0, 36), 30, 210);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.flipY = false;
  texture.generateMipmaps = false;
  return texture;
}

function blankTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 512, 512);
    // Silhueta genérica (sem face inventada)
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(256, 190, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(110, 460);
    ctx.quadraticCurveTo(110, 320, 256, 320);
    ctx.quadraticCurveTo(402, 320, 402, 460);
    ctx.closePath();
    ctx.fill();
    // Iniciais por cima
    ctx.fillStyle = "#fff";
    ctx.font = "bold 120px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials(label), 256, 400);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.flipY = false;
  return texture;
}

function loadImageTexture(src: string, fallbackLabel: string) {
  return new Promise<THREE.Texture>((resolve) => {
    const image = new Image();
    if (/^https?:\/\//.test(src)) image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        /* ignore */
      }
      const texture = new THREE.Texture(image);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = false;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => resolve(blankTexture(fallbackLabel));
    image.src = src;
  });
}

function createTextureAtlas(textures: THREE.Texture[], isText = false) {
  const atlasSize = Math.ceil(Math.sqrt(textures.length));
  const textureSize = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = atlasSize * textureSize;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    if (isText) ctx.clearRect(0, 0, canvas.width, canvas.height);
    else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    textures.forEach((texture, index) => {
      const x = (index % atlasSize) * textureSize;
      const y = Math.floor(index / atlasSize) * textureSize;
      const src =
        (texture as THREE.Texture & { source?: { data?: CanvasImageSource } })
          .source?.data ?? texture.image;
      if (!src) return;
      try {
        ctx.drawImage(src as CanvasImageSource, x, y, textureSize, textureSize);
      } catch {
        /* ignore */
      }
    });
  }
  const atlasTexture = new THREE.CanvasTexture(canvas);
  atlasTexture.wrapS = THREE.ClampToEdgeWrapping;
  atlasTexture.wrapT = THREE.ClampToEdgeWrapping;
  atlasTexture.minFilter = THREE.LinearFilter;
  atlasTexture.magFilter = THREE.LinearFilter;
  atlasTexture.flipY = false;
  return atlasTexture;
}

function cellIndex(cellX: number, cellY: number, count: number) {
  let idx = (cellX + cellY * 3) % count;
  if (idx < 0) idx += count;
  return idx;
}

function pointerToCell(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  offset: { x: number; y: number },
  zoom: number,
  cellSize: number,
) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  let screenUVX = (x / rect.width) * 2 - 1;
  let screenUVY = -((y / rect.height) * 2 - 1);
  const radius = Math.hypot(screenUVX, screenUVY);
  const distortion = 1 - 0.08 * radius * radius;
  screenUVX *= distortion;
  screenUVY *= distortion;
  const aspect = rect.width / rect.height;
  let worldX = screenUVX * aspect * zoom + offset.x;
  let worldY = screenUVY * zoom + offset.y;
  return {
    cellX: Math.floor(worldX / cellSize),
    cellY: Math.floor(worldY / cellSize),
  };
}

type SceneProps = {
  /** Assinatura estável (ids + fotos). Evita remount sem mudança real. */
  signature: string;
  images: string[];
  labels: { title: string; subtitle: string; id: string }[];
  cellSize: number;
  zoomLevel: number;
  showHint: boolean;
  reducedMotion: boolean;
  onSelect?: (id: string) => void;
};

function PeopleGalleryScene({
  signature,
  images,
  labels,
  cellSize,
  zoomLevel,
  showHint,
  reducedMotion,
  onSelect,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [playReveal, setPlayReveal] = useState(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  /** Já revelou nesta montagem: troca de aba não refaz o loading longo. */
  const revealedOnceRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0) return;

    const firstLoad = !revealedOnceRef.current;
    setReady(false);
    setPlayReveal(false);

    let cancelled = false;
    let animFrameId = 0;
    let revealTimer = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let plane: THREE.Mesh | undefined;
    let geometry: THREE.PlaneGeometry | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let imageAtlas: THREE.CanvasTexture | undefined;
    let textAtlas: THREE.CanvasTexture | undefined;
    const loadedTextures: THREE.Texture[] = [];

    const state = {
      isDragging: false,
      didDrag: false,
      previousPointer: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      targetOffset: { x: 0, y: 0 },
      mousePosition: { x: -1, y: -1 },
      zoom: reducedMotion || !firstLoad ? 1 : 1.28,
      targetZoom: 1,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const bgColor = rgbaToArray(CONFIG.backgroundColor);
    renderer.setClearColor(
      new THREE.Color(bgColor[0], bgColor[1], bgColor[2]),
      bgColor[3],
    );
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    container.appendChild(renderer.domElement);

    const lerpFactor = reducedMotion ? 1 : CONFIG.lerpFactor;
    const dragZoom = reducedMotion ? 1 : zoomLevel;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      state.offset.x += (state.targetOffset.x - state.offset.x) * lerpFactor;
      state.offset.y += (state.targetOffset.y - state.offset.y) * lerpFactor;
      state.zoom += (state.targetZoom - state.zoom) * lerpFactor;
      const mat = plane?.material as THREE.ShaderMaterial | undefined;
      if (mat?.uniforms) {
        mat.uniforms.uOffset.value.set(state.offset.x, state.offset.y);
        mat.uniforms.uZoom.value = state.zoom;
      }
      renderer!.render(scene, camera);
    };

    const updateMousePosition = (event: PointerEvent) => {
      const rect = renderer!.domElement.getBoundingClientRect();
      state.mousePosition.x = event.clientX - rect.left;
      state.mousePosition.y = event.clientY - rect.top;
      const mat = plane?.material as THREE.ShaderMaterial | undefined;
      mat?.uniforms.uMousePos.value.set(
        state.mousePosition.x,
        state.mousePosition.y,
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      container.setPointerCapture?.(event.pointerId);
      state.isDragging = true;
      state.didDrag = false;
      state.previousPointer.x = event.clientX;
      state.previousPointer.y = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      updateMousePosition(event);
      if (!state.isDragging) return;
      const deltaX = event.clientX - state.previousPointer.x;
      const deltaY = event.clientY - state.previousPointer.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        state.didDrag = true;
        if (state.targetZoom === 1) state.targetZoom = dragZoom;
      }
      state.targetOffset.x -= deltaX * 0.003;
      state.targetOffset.y += deltaY * 0.003;
      state.previousPointer.x = event.clientX;
      state.previousPointer.y = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (container.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
      if (!state.didDrag && onSelectRef.current) {
        const rect = renderer!.domElement.getBoundingClientRect();
        const { cellX, cellY } = pointerToCell(
          event.clientX,
          event.clientY,
          rect,
          state.offset,
          state.zoom,
          cellSize,
        );
        const idx = cellIndex(cellX, cellY, labels.length);
        const person = labels[idx];
        if (person) onSelectRef.current(person.id);
      }
      state.isDragging = false;
      state.targetZoom = 1;
    };

    const onPointerLeave = () => {
      state.mousePosition.x = state.mousePosition.y = -1;
      const mat = plane?.material as THREE.ShaderMaterial | undefined;
      mat?.uniforms.uMousePos.value.set(-1, -1);
      state.isDragging = false;
      state.targetZoom = 1;
    };

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height || !renderer) return;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const mat = plane?.material as THREE.ShaderMaterial | undefined;
      mat?.uniforms.uResolution.value.set(width, height);
    };

    const init = async () => {
      const imageTiles = await Promise.all(
        images.map((src, i) =>
          src
            ? loadImageTexture(src, labels[i]?.title ?? "?")
            : Promise.resolve(blankTexture(labels[i]?.title ?? "?")),
        ),
      );
      if (cancelled) {
        imageTiles.forEach((texture) => texture.dispose());
        return;
      }
      loadedTextures.push(...imageTiles);
      const textTextures = labels.map((item) =>
        createTextTexture(item.title, item.subtitle, CONFIG.textColor),
      );
      loadedTextures.push(...textTextures);
      imageAtlas = createTextureAtlas(imageTiles, false);
      textAtlas = createTextureAtlas(textTextures, true);
      if (cancelled) return;

      const uniforms = {
        uOffset: { value: new THREE.Vector2(0, 0) },
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight,
          ),
        },
        uBorderColor: {
          value: new THREE.Vector4(...rgbaToArray(CONFIG.borderColor)),
        },
        uHoverColor: {
          value: new THREE.Vector4(...rgbaToArray(CONFIG.hoverColor)),
        },
        uBackgroundColor: {
          value: new THREE.Vector4(...rgbaToArray(CONFIG.backgroundColor)),
        },
        uMousePos: { value: new THREE.Vector2(-1, -1) },
        uZoom: { value: state.zoom },
        uCellSize: { value: cellSize },
        uTextureCount: { value: images.length },
        uImageAtlas: { value: imageAtlas },
        uTextAtlas: { value: textAtlas },
      };

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
      });
      plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("resize", onResize);
      animate();

      const reveal = () => {
        if (cancelled) return;
        revealedOnceRef.current = true;
        setReady(true);
        if (firstLoad && !reducedMotion) {
          setPlayReveal(true);
        }
      };
      // Só segura o loading na primeira vez; depois aparece na hora.
      const minHoldMs = reducedMotion || !firstLoad ? 0 : 1200;
      const shownAt = performance.now();
      const wait = minHoldMs - (performance.now() - shownAt);
      if (wait > 0) {
        revealTimer = window.setTimeout(reveal, wait);
      } else {
        reveal();
      }
    };

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameId);
      if (revealTimer) window.clearTimeout(revealTimer);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      loadedTextures.forEach((texture) => texture.dispose());
      imageAtlas?.dispose();
      textAtlas?.dispose();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // signature cobre images/labels; evita reload por referência nova do mesmo conteúdo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, cellSize, zoomLevel, reducedMotion]);

  return (
    <div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0",
          ready && playReveal && "lupa-quem-reveal",
        )}
        style={{ opacity: ready ? undefined : 0 }}
      />
      {!ready ? (
        <div className="absolute inset-0 z-20">
          <BrasilLoading
            label="Carregando quem aparece…"
            className="h-full min-h-0"
          />
        </div>
      ) : null}
      {ready && showHint ? (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          Arraste pra explorar · clique pra abrir
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  people: InvestigationPerson[];
  onSelect: (id: string) => void;
  className?: string;
};

/** Galeria arrastável de envolvidos (adaptada da Art Gallery / ObsidianUI). */
export function MesaPeopleGallery({ people, onSelect, className }: Props) {
  const reducedMotion = useEffectReducedMotion();
  const { images, labels, signature } = useMemo(() => {
    const list = people.length > 0 ? people : [];
    const labels = list.map((p) => ({
      id: p.id,
      title: p.name,
      subtitle: p.tags?.[0] ?? p.role.split(";")[0]?.slice(0, 40) ?? "",
    }));
    const images = list.map((p) => p.photo?.src ?? "");
    return {
      images,
      labels,
      signature: list.map((p) => `${p.id}:${p.photo?.src ?? ""}`).join("|"),
    };
  }, [people]);

  if (labels.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[240px] items-center justify-center border border-dashed border-white/20 text-sm text-white/45",
          className,
        )}
      >
        Nenhuma pessoa neste filtro.
      </div>
    );
  }

  return (
    <WebGLSurface
      className={cn("h-full min-h-0 w-full", className)}
      label="Galeria de envolvidos"
      fallback={
        <ul className="absolute inset-0 z-10 grid auto-rows-min gap-2 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className="lupa-soft flex w-full items-center gap-3 border border-white/30 bg-black px-3 py-3 text-left transition hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
              >
                <span className="block min-w-0">
                  <span className="block font-[family-name:var(--font-display)] text-xl uppercase leading-none">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-white/70 group-hover:text-black/70">
                    {p.role.split(";")[0]?.trim()}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
    >
      <PeopleGalleryScene
        signature={signature}
        images={images}
        labels={labels}
        cellSize={CONFIG.cellSize}
        zoomLevel={CONFIG.zoomLevel}
        showHint
        reducedMotion={reducedMotion}
        onSelect={onSelect}
      />
    </WebGLSurface>
  );
}
