import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCandidateById } from "@/data/candidates";
import { extractPdfText } from "@/lib/pdf";
import { saveDocument } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const form = await request.formData();
  const candidateId = String(form.get("candidateId") || "");
  const file = form.get("file");

  const candidate = getCandidateById(candidateId);
  if (!candidate) {
    return NextResponse.json({ error: "Candidato inválido." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 400 });
  }

  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".pdf") && !lower.endsWith(".txt")) {
    return NextResponse.json(
      { error: "Envie PDF ou TXT por enquanto." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";
  if (lower.endsWith(".pdf")) {
    text = await extractPdfText(buffer);
  } else {
    text = buffer.toString("utf8");
  }

  if (text.length < 200) {
    return NextResponse.json(
      {
        error:
          "Não foi possível extrair texto suficiente do arquivo. Verifique se o PDF não é só imagem escaneada.",
      },
      { status: 400 },
    );
  }

  const storedName = `${candidateId}-${Date.now()}${lower.endsWith(".pdf") ? ".pdf" : ".txt"}`;
  await saveDocument(
    {
      candidateId,
      fileName: file.name,
      storedName,
      uploadedAt: new Date().toISOString(),
      textLength: text.length,
    },
    buffer,
  );

  // Persist extracted text alongside for analysis
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const { UPLOADS_DIR } = await import("@/lib/store");
  await fs.writeFile(
    path.join(UPLOADS_DIR, `${candidateId}.txt`),
    text,
    "utf8",
  );

  return NextResponse.json({
    ok: true,
    fileName: file.name,
    textLength: text.length,
  });
}
