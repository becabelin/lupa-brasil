/**
 * Busca cobertura recente e escreve extratos factuais do Lupa (lede),
 * citando os veículos de press-outlets.ts (lista ampla). Não inventa o corpo da matéria.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/fetch-press.ts
 *   npx tsx --env-file=.env.local scripts/fetch-press.ts lula flavio-bolsonaro
 */
import { CANDIDATES } from "../src/data/candidates";
import { fetchPressForCandidate } from "../src/lib/press";
import { savePressForCandidate, readPressStore } from "../src/lib/press-store";

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const list =
    only.length > 0
      ? CANDIDATES.filter((c) => only.includes(c.id) || only.includes(c.slug))
      : CANDIDATES;

  console.log(
    `Buscando e interpretando imprensa · ${list.length} candidato(s)…\n`,
  );

  for (const c of list) {
    process.stdout.write(`→ ${c.name}… `);
    try {
      const items = await fetchPressForCandidate({
        candidateId: c.id,
        candidateName: c.name,
        limit: 10,
      });
      await savePressForCandidate(c.id, items);
      const watch = items.filter((i) => i.watchlist).length;
      console.log(`${items.length} itens (${watch} investigação) · ledes ok`);
    } catch (err) {
      console.log("erro:", err instanceof Error ? err.message : err);
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  const store = await readPressStore();
  console.log(
    `\nTotal no press.json: ${store.items.length} · updatedAt ${store.updatedAt}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
