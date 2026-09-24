/**
 * Analisa com IA os planos já importados (data/uploads/*.txt).
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/analyze-existing.ts
 *   npx tsx --env-file=.env.local scripts/analyze-existing.ts lula romeu-zema
 */
import { promises as fs } from "fs";
import path from "path";
import { CANDIDATES } from "../src/data/candidates";
import { analyzeGovernmentPlan } from "../src/lib/analyze";
import { readStore, saveAnalysis, UPLOADS_DIR } from "../src/lib/store";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Defina OPENAI_API_KEY no .env.local.");
    process.exit(1);
  }

  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const store = await readStore();
  const docs =
    only.length > 0
      ? store.documents.filter((d) => only.includes(d.candidateId))
      : store.documents;

  if (docs.length === 0) {
    console.error("Nenhum documento para analisar.");
    process.exit(1);
  }

  console.log(`Modelo: ${process.env.AI_MODEL || "gpt-4o-mini"}`);
  console.log(`Candidatos: ${docs.length}\n`);

  let ok = 0;
  let fail = 0;

  for (const doc of docs) {
    const candidate = CANDIDATES.find((c) => c.id === doc.candidateId);
    if (!candidate) {
      console.warn(`Candidato ausente: ${doc.candidateId}`);
      fail++;
      continue;
    }

    const textPath = path.join(UPLOADS_DIR, `${doc.candidateId}.txt`);
    let documentText = "";
    try {
      documentText = await fs.readFile(textPath, "utf8");
    } catch {
      console.error(`Texto ausente: ${textPath}`);
      fail++;
      continue;
    }

    console.log(`→ ${candidate.name} (${documentText.length} chars)…`);
    const started = Date.now();
    try {
      const analysis = await analyzeGovernmentPlan({
        candidateId: candidate.id,
        candidateName: candidate.name,
        party: candidate.party,
        sourceFileName: `${doc.fileName} (TSE)`,
        documentText,
      });
      await saveAnalysis(analysis);
      const secs = ((Date.now() - started) / 1000).toFixed(1);
      console.log(
        `  ok — ${analysis.topics.length} temas, ${analysis.priorities.length} prioridades (${secs}s)`,
      );
      ok++;
    } catch (err) {
      console.error(`  erro:`, err instanceof Error ? err.message : err);
      fail++;
    }
  }

  const final = await readStore();
  console.log(
    `\nConcluído. Análises no store: ${final.analyses.length} (ok=${ok}, falhas=${fail})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
