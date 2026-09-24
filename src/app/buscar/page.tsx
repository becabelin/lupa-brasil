import { candidatesAlphabetical } from "@/data/candidates";
import { TOPICS } from "@/data/topics";
import { HOT_AGENDAS } from "@/data/agendas";
import { SearchClient } from "@/components/search-client";
import { getAllAnalyses } from "@/lib/store";
import { BrandButton, PageHero } from "@/components/brand-ui";
import { EleicoesSubnav } from "@/components/eleicoes-subnav";
import { VOICE } from "@/data/voice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Planos de governo por área · Eleições 2026",
  description:
    "Veja o que cada candidato à Presidência colocou no plano oficial do TSE sobre economia, saúde, educação, segurança e clima.",
  alternates: { canonical: "/buscar" },
  openGraph: {
    title: "Planos de governo por área · Lupa do Brasil",
    description: VOICE.buscar.lede,
  },
};

export default async function SearchPage() {
  const analyses = await getAllAnalyses();
  const candidates = candidatesAlphabetical();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.buscar.eyebrow}
        title={
          <>
            Áreas e
            <br />
            pautas
          </>
        }
        lede={VOICE.buscar.lede}
        actions={
          <>
            <BrandButton href="/comparar" variant="solid">
              Comparar planos
            </BrandButton>
            <BrandButton href="/noticias" variant="outline">
              Casos
            </BrandButton>
          </>
        }
        marquee={[
          "Economia",
          "Saúde",
          "Educação",
          "Segurança",
          "Clima",
          "O que está no plano",
        ]}
        meta={[
          { k: String(TOPICS.length), v: "Áreas" },
          { k: String(HOT_AGENDAS.length), v: "Pautas quentes" },
          { k: String(candidates.length), v: "Chapas", href: "/eleicoes" },
          { k: "TSE", v: "Fonte do plano" },
        ]}
      />
      <EleicoesSubnav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SearchClient
          candidates={candidates}
          topics={[...TOPICS]}
          analyses={analyses}
        />
      </div>
    </div>
  );
}
