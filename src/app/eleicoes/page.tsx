import { CANDIDATES } from "@/data/candidates";
import { TOPICS } from "@/data/topics";
import { HOT_AGENDAS } from "@/data/agendas";
import { CandidatesGrid } from "@/components/candidates-grid";
import { EleicoesSubnav } from "@/components/eleicoes-subnav";
import { BrandButton, PageHero } from "@/components/brand-ui";
import { getAllAnalyses } from "@/lib/store";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Eleições 2026 · Candidatos à Presidência",
  description:
    "Doze chapas deferidas pelo TSE. Planos de governo oficiais. Compare propostas e leia as fichas.",
  alternates: { canonical: "/eleicoes" },
  openGraph: {
    title: "Eleições 2026 · Candidatos à Presidência · Lupa do Brasil",
    description: VOICE.eleicoes.lede,
  },
};

export const dynamic = "force-dynamic";

export default async function EleicoesPage() {
  const analyses = await getAllAnalyses();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.eleicoes.eyebrow}
        title={
          <>
            Eleições
            <br />
            2026
          </>
        }
        lede={VOICE.eleicoes.lede}
        actions={
          <>
            <BrandButton href="/comparar" variant="solid">
              Comparar planos
            </BrandButton>
            <BrandButton href="/buscar" variant="outline">
              Ver por área
            </BrandButton>
          </>
        }
        marquee={[
          `${CANDIDATES.length} chapas deferidas`,
          ...VOICE.eleicoes.marquee.slice(1),
        ]}
        meta={[
          { k: String(CANDIDATES.length), v: "Chapas" },
          { k: String(TOPICS.length), v: "Áreas", href: "/buscar" },
          { k: String(HOT_AGENDAS.length), v: "Pautas", href: "/buscar" },
          { k: String(analyses.length), v: "Planos lidos" },
        ]}
      />
      <EleicoesSubnav />
      <section
        id="candidatos"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[#666]">
          Candidatos · {CANDIDATES.length} chapas
        </p>
        <CandidatesGrid candidates={CANDIDATES} />
      </section>
    </div>
  );
}
