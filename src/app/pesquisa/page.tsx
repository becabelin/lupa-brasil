import { PageHero } from "@/components/brand-ui";
import { SiteSearch } from "@/components/site-search";
import { buildSearchIndex } from "@/lib/search";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Pesquisar no site",
  description: VOICE.pesquisa.lede,
  alternates: { canonical: "/pesquisa" },
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PesquisaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const index = buildSearchIndex();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.pesquisa.eyebrow}
        title={<>Buscar</>}
        lede={VOICE.pesquisa.lede}
        marquee={[...VOICE.pesquisa.marquee]}
        meta={[
          { k: String(index.filter((h) => h.kind === "candidato").length), v: "Candidatos" },
          { k: String(index.filter((h) => h.kind === "caso").length), v: "Casos" },
          {
            k: String(
              index.filter((h) => h.kind === "conceito" || h.kind === "plano")
                .length,
            ),
            v: "Glossário",
          },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <SiteSearch index={index} initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
