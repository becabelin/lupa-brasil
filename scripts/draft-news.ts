/**
 * Gera rascunho de notícia Lupa a partir de URLs allowlist.
 * Não publica. Salva em data/drafts/noticias/{slug}.json
 *
 * Uso:
 *   npm run news:draft -- --url=https://...
 *   npm run news:draft -- --url=https://a --url=https://b
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateNewsDraft } from "../src/lib/news-draft";

function parseUrls(argv: string[]) {
  const urls: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url" && argv[i + 1]) {
      urls.push(argv[++i]);
    } else if (a.startsWith("--url=")) {
      urls.push(a.slice("--url=".length));
    } else if (/^https?:\/\//i.test(a)) {
      urls.push(a);
    }
  }
  return urls;
}

async function main() {
  const urls = parseUrls(process.argv.slice(2));
  if (urls.length === 0) {
    console.error(
      "Uso: npm run news:draft -- --url=https://agencia... [--url=https://...]",
    );
    process.exit(1);
  }

  console.log(`Rascunhando ${urls.length} URL(s)…`);
  const draft = await generateNewsDraft({ urls });

  const dir = path.join(process.cwd(), "data", "drafts", "noticias");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${draft.slug}.json`);
  await writeFile(file, `${JSON.stringify(draft, null, 2)}\n`, "utf8");

  console.log(`\nSalvo: ${file}`);
  console.log(`slug: ${draft.slug}`);
  console.log(`tema ok: ${draft.topicOk} · ${draft.topicNote}`);
  console.log(`título: ${draft.title}`);
  console.log(
    "\nPróximo passo: preencher cover (src, alt, credit) no JSON e copiar para src/data/posts.ts. Sem foto, não publica.",
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
