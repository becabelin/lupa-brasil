import { promises as fs } from "fs";
import path from "path";
import type { PlanAnalysis, StoreData, UploadedDocument } from "./types";
import { normalizePlanAnalysis } from "./plan-depth";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const emptyStore: StoreData = { documents: [], analyses: [] };

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function readStore(): Promise<StoreData> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return structuredClone(emptyStore);
  }
}

async function writeStore(store: StoreData) {
  await ensureDirs();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getAnalysis(candidateId: string) {
  const store = await readStore();
  const analysis =
    store.analyses.find((a) => a.candidateId === candidateId) ?? null;
  return analysis ? normalizePlanAnalysis(analysis) : null;
}

export async function getAllAnalyses() {
  const store = await readStore();
  return store.analyses.map(normalizePlanAnalysis);
}

export async function getDocument(candidateId: string) {
  const store = await readStore();
  return store.documents.find((d) => d.candidateId === candidateId) ?? null;
}

export async function saveDocument(
  doc: UploadedDocument,
  fileBuffer: Buffer,
): Promise<void> {
  await ensureDirs();
  const filePath = path.join(UPLOADS_DIR, doc.storedName);
  await fs.writeFile(filePath, fileBuffer);

  const store = await readStore();
  store.documents = store.documents.filter((d) => d.candidateId !== doc.candidateId);
  store.documents.push(doc);
  await writeStore(store);
}

export async function saveAnalysis(analysis: PlanAnalysis) {
  const store = await readStore();
  const normalized = normalizePlanAnalysis(analysis);
  store.analyses = store.analyses.filter(
    (a) => a.candidateId !== normalized.candidateId,
  );
  store.analyses.push(normalized);
  await writeStore(store);
}

export function getUploadPath(storedName: string) {
  return path.join(UPLOADS_DIR, storedName);
}

export { UPLOADS_DIR };
