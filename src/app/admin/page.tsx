import { CANDIDATES } from "@/data/candidates";
import { AdminPanel } from "@/components/admin-panel";
import { isAdminAuthenticated } from "@/lib/auth";
import { listNewsDrafts } from "@/lib/news-draft";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [store, authed, drafts] = await Promise.all([
    readStore(),
    isAdminAuthenticated(),
    listNewsDrafts(),
  ]);

  const rows = CANDIDATES.map((candidate) => {
    const doc = store.documents.find((d) => d.candidateId === candidate.id);
    const analysis = store.analyses.find((a) => a.candidateId === candidate.id);
    return {
      candidate,
      hasDocument: Boolean(doc),
      hasAnalysis: Boolean(analysis),
      fileName: doc?.fileName,
      analyzedAt: analysis?.analyzedAt,
    };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        Painel admin
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Planos TSE, análise por IA e rascunhos de notícia. Publicar notícia é
        ato humano em posts.ts.
      </p>
      <AdminPanel
        rows={rows}
        initiallyAuthed={authed}
        initialDrafts={drafts}
      />
    </div>
  );
}
