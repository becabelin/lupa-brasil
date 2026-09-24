/**
 * Gera extratos (ledes) do Lupa para itens já salvos em data/press.json.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/enrich-press-ledes.ts
 *   npx tsx --env-file=.env.local scripts/enrich-press-ledes.ts flavio-bolsonaro
 */
import { CANDIDATES } from "../src/data/candidates";
import { enrichPressLedes } from "../src/lib/press";
import {
  getPressForCandidate,
  savePressForCandidate,
  readPressStore,
} from "../src/lib/press-store";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Defina OPENAI_API_KEY no .env.local.");
    process.exit(1);
  }

  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const list =
    only.length > 0
      ? CANDIDATES.filter((c) => only.includes(c.id) || only.includes(c.slug))
      : CANDIDATES;

  console.log(`Gerando extratos de imprensa · ${list.length} candidato(s)\n`);

  for (const c of list) {
    const items = await getPressForCandidate(c.id);
    if (items.length === 0) {
      console.log(`→ ${c.name}: sem itens`);
      continue;
    }
    process.stdout.write(`→ ${c.name} (${items.length})… `);
    const enriched = await enrichPressLedes(items, c.name);
    await savePressForCandidate(c.id, enriched);
    console.log("ok");
    await new Promise((r) => setTimeout(r, 400));
  }

  const store = await readPressStore();
  const withLede = store.items.filter((i) => i.lede?.trim()).length;
  console.log(`\n${withLede}/${store.items.length} itens com lede.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
