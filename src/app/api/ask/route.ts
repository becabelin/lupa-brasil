import { NextResponse } from "next/server";
import { askLupa } from "@/lib/ask";
import { getAskCache, setAskCache } from "@/lib/ask-cache";
import {
  checkAskRateLimit,
  clientIp,
  recordAskSuccess,
} from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_QUESTION_CHARS = 500;

export async function POST(request: Request) {
  let question = "";
  try {
    const body = (await request.json()) as { question?: string };
    question = typeof body.question === "string" ? body.question : "";
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const trimmed = question.trim();
  if (trimmed.length < 3) {
    return NextResponse.json(
      { error: "Escreva uma pergunta com pelo menos algumas palavras." },
      { status: 400 },
    );
  }
  if (trimmed.length > MAX_QUESTION_CHARS) {
    return NextResponse.json(
      {
        error: `Pergunta longa demais. Cabe em até ${MAX_QUESTION_CHARS} caracteres.`,
      },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Perguntas por IA estão desligadas no momento." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const limit = checkAskRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: limit.message, retryAfterSec: limit.retryAfterSec },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const cached = getAskCache(trimmed);
  if (cached) {
    return NextResponse.json(
      { ...cached, cached: true },
      {
        headers: {
          "X-Ask-Cache": "HIT",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const result = await askLupa(trimmed);
    setAskCache(trimmed, result);
    recordAskSuccess(ip);
    return NextResponse.json(result, {
      headers: {
        "X-Ask-Cache": "MISS",
        "X-Ask-Remaining-Day": String(limit.remaining.day),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/ask]", err);
    return NextResponse.json(
      {
        error:
          "Não deu pra montar a resposta agora. Tente de novo em instantes.",
      },
      { status: 500 },
    );
  }
}
