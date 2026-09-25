import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { listNewsDrafts } from "@/lib/news-draft";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const drafts = await listNewsDrafts();
  return NextResponse.json({ drafts });
}
