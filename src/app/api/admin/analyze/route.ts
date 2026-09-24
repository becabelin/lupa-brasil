import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCandidateById } from "@/data/candidates";
import { analyzeGovernmentPlan } from "@/lib/analyze";
import { getDocument, saveAnalysis, UPLOADS_DIR } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Configure OPENAI_API_KEY no .env.local para rodar a análise por IA.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { candidateId?: string };
  const candidateId = body.candidateId || "";
  const candidate = getCandidateById(candidateId);
  if (!candidate) {
    return NextResponse.json({ error: "Candidato inválido." }, { status: 400 });
  }

  const doc = await getDocument(candidateId);
  if (!doc) {
    return NextResponse.json(
      { error: "Envie o plano de governo antes de analisar." },
      { status: 400 },
    );
  }

  const textPath = path.join(UPLOADS_DIR, `${candidateId}.txt`);
  let documentText = "";
  try {
    documentText = await fs.readFile(textPath, "utf8");
  } catch {
    return NextResponse.json(
      { error: "Texto extraído não encontrado. Faça o upload novamente." },
      { status: 400 },
    );
  }

  const analysis = await analyzeGovernmentPlan({
    candidateId,
    candidateName: candidate.name,
    party: candidate.party,
    sourceFileName: doc.fileName,
    documentText,
  });

  await saveAnalysis(analysis);
  return NextResponse.json({ ok: true, analysis });
}
