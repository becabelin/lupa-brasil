/**
 * Importa planos de governo do pacote TSE (pasta BR) para o store local.
 *
 * Uso:
 *   npx tsx scripts/import-tse-plans.ts [pasta]
 *   npx tsx scripts/import-tse-plans.ts ~/Downloads/BR --analyze
 */
import { promises as fs } from "fs";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";
import { CANDIDATES } from "../src/data/candidates";
import { TSE_PLAN_MAP, TSE_SOURCE_URL, TSE_UNMAPPED_PLANS } from "../src/data/tse-plans";
import { analyzeGovernmentPlan } from "../src/lib/analyze";
import { saveAnalysis, saveDocument, UPLOADS_DIR } from "../src/lib/store";

async function extractPdf(buffer: Buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return (text || "").replace(/\s+/g, " ").trim();
}

async function main() {
  const args = process.argv.slice(2);
  const doAnalyze = args.includes("--analyze");
  const dirArg = args.find((a) => !a.startsWith("--"));
  const sourceDir =
    dirArg ||
    path.join(process.env.HOME || "", "Downloads", "BR");

  console.log("Fonte TSE:", TSE_SOURCE_URL);
  console.log("Pasta:", sourceDir);
  console.log("Analisar com IA:", doAnalyze ? "sim" : "não");

  if (doAnalyze && !process.env.OPENAI_API_KEY) {
    console.error("Defina OPENAI_API_KEY no ambiente (ou .env.local) para --analyze.");
    process.exit(1);
  }

  for (const entry of TSE_UNMAPPED_PLANS) {
    console.log(`(ignorado) ${entry.fileName}: ${entry.note}`);
  }

  for (const plan of TSE_PLAN_MAP) {
    const candidate = CANDIDATES.find((c) => c.id === plan.candidateId);
    if (!candidate) {
      console.warn("Candidato não encontrado:", plan.candidateId);
      continue;
    }

    const src = path.join(sourceDir, plan.fileName);
    let buffer: Buffer;
    try {
      buffer = await fs.readFile(src);
    } catch {
      console.error("Arquivo ausente:", src);
      continue;
    }

    console.log(`\n→ ${candidate.name}: ${plan.fileName}`);
    const text = await extractPdf(buffer);
    console.log(`  texto: ${text.length} caracteres (${plan.identifiedAs})`);

    if (text.length < 200) {
      console.warn("  texto insuficiente — pulando");
      continue;
    }

    const storedName = `${plan.candidateId}-tse-${plan.sqCandidato}.pdf`;
    await saveDocument(
      {
        candidateId: plan.candidateId,
        fileName: plan.fileName,
        storedName,
        uploadedAt: new Date().toISOString(),
        textLength: text.length,
      },
      buffer,
    );
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, `${plan.candidateId}.txt`), text, "utf8");

    if (doAnalyze) {
      console.log("  analisando com IA…");
      const analysis = await analyzeGovernmentPlan({
        candidateId: plan.candidateId,
        candidateName: candidate.name,
        party: candidate.party,
        sourceFileName: `${plan.fileName} (TSE)`,
        documentText: text,
      });
      await saveAnalysis(analysis);
      console.log("  análise salva");
    }
  }

  console.log("\nConcluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
