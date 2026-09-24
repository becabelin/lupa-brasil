import { promises as fs } from "fs";
import path from "path";
import type { PressItem, PressStore } from "./press";

const DATA_DIR = path.join(process.cwd(), "data");
const PRESS_PATH = path.join(DATA_DIR, "press.json");

const empty: PressStore = { updatedAt: "", items: [] };

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readPressStore(): Promise<PressStore> {
  await ensureDir();
  try {
    const raw = await fs.readFile(PRESS_PATH, "utf8");
    return JSON.parse(raw) as PressStore;
  } catch {
    return structuredClone(empty);
  }
}

export async function writePressStore(store: PressStore) {
  await ensureDir();
  await fs.writeFile(PRESS_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getPressForCandidate(candidateId: string) {
  const store = await readPressStore();
  return store.items.filter((i) => i.candidateId === candidateId);
}

export async function savePressForCandidate(
  candidateId: string,
  items: PressItem[],
) {
  const store = await readPressStore();
  store.items = [
    ...store.items.filter((i) => i.candidateId !== candidateId),
    ...items,
  ];
  store.updatedAt = new Date().toISOString();
  await writePressStore(store);
}

export { PRESS_PATH };
