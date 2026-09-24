import { candidatesAlphabetical } from "@/data/candidates";
import { TOPICS } from "@/data/topics";
import { HOT_AGENDAS } from "@/data/agendas";
import { CompareClient } from "@/components/compare-client";
import { getAllAnalyses } from "@/lib/store";
import { BrandButton, PageHero } from "@/components/brand-ui";
import { EleicoesSubnav } from "@/components/eleicoes-subnav";
import { VOICE } from "@/data/voice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Comparar planos de governo 2026",
  description:
    "Compare candidatos à Presidência lado a lado: o que cada plano oficial do TSE diz (ou não diz) sobre juros, segurança, clima e outras pautas.",
  alternates: { canonical: "/comparar" },
  openGraph: {
    title: "Comparar planos de governo 2026 · Lupa do Brasil",
    description:
      "Duas chapas, uma pauta. Extrato dos planos oficiais do TSE, sem ranking e sem partido.",
  },
};

export default async function ComparePage() {
  const analyses = await getAllAnalyses();
  const candidates = candidatesAlphabetical();

  return (
    <div>
      <PageHero
        eyebrow={VOICE.comparar.eyebrow}
        title={
          <>
            Comparar
            <br />
            planos
          </>
        }
        lede={VOICE.comparar.lede}
        actions={
          <>
            <BrandButton href="/buscar" variant="outline">
              Ver por área
            </BrandButton>
            <BrandButton href="/eleicoes" variant="outline">
              Ver candidatos
            </BrandButton>
          </>
        }
        marquee={[
          "Dois a dois",
          "O que está no PDF",
          "Fonte TSE",
          "Mesma pergunta pra todo mundo",
        ]}
        meta={[
          { k: String(candidates.length), v: "Chapas", href: "/eleicoes" },
          { k: String(TOPICS.length), v: "Áreas", href: "/buscar" },
          { k: String(HOT_AGENDAS.length), v: "Pautas", href: "/buscar" },
          { k: String(analyses.length), v: "Planos lidos" },
        ]}
      />
      <EleicoesSubnav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CompareClient
          candidates={candidates}
          topics={[...TOPICS]}
          analyses={analyses}
        />
      </div>
    </div>
  );
}
