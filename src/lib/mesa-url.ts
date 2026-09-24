export type MesaTab =
  | "tempo"
  | "pessoas"
  | "lugares"
  | "chats"
  | "provas"
  | "cruzar";

export type MesaFocusKind =
  | "pessoa"
  | "lugar"
  | "evento"
  | "chat"
  | "prova";

export type MesaFocus = { kind: MesaFocusKind; id: string };

export function parseFocus(raw: string | null | undefined): MesaFocus | null {
  if (!raw) return null;
  const [kind, ...rest] = raw.split(":");
  const id = rest.join(":");
  if (!id) return null;
  if (
    kind === "pessoa" ||
    kind === "lugar" ||
    kind === "evento" ||
    kind === "chat" ||
    kind === "prova"
  ) {
    return { kind, id };
  }
  return null;
}

export function serializeFocus(f: MesaFocus | null): string | null {
  return f ? `${f.kind}:${f.id}` : null;
}

export function parseTab(raw: string | null | undefined): MesaTab {
  if (
    raw === "tempo" ||
    raw === "pessoas" ||
    raw === "lugares" ||
    raw === "chats" ||
    raw === "provas" ||
    raw === "cruzar"
  ) {
    return raw;
  }
  return "pessoas";
}
