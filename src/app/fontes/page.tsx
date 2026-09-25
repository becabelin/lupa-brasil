import Link from "next/link";
import { CANDIDATES, candidatesAlphabetical, getCandidateById } from "@/data/candidates";
import {
  EDITORIAL_IMAGE_CREDITS,
  EDITORIAL_PRINCIPLES,
  IMAGE_SOURCE_BANKS,
  IMAGE_SOURCE_RULES,
  NEWS_PAGE_CRITERIA,
  NEWS_PAGE_DEPTH,
  NEWS_POST_SCOPE,
  PHOTO_CREDITS,
  TSE_CANDIDATURAS_TITLE,
  TSE_CANDIDATURAS_URL,
  TSE_PLANS_TITLE,
  TSE_PLANS_URL,
} from "@/data/sources";
import { HOT_AGENDAS } from "@/data/agendas";
import { PRESS_OUTLETS } from "@/data/press-outlets";
import { TSE_PLAN_MAP, TSE_UNMAPPED_PLANS } from "@/data/tse-plans";
import {
  EXPLAINERS,
  EXPLAINER_KIND_LABEL,
} from "@/data/explainers";
import { PageHero } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Fontes",
  description:
    "Todas as origens do Lupa do Brasil: TSE, planos de governo, imprensa, fotos e fichas. Links rastreáveis.",
  alternates: { canonical: "/fontes" },
};

export default function FontesPage() {
  return (
    <div>
      <PageHero
        eyebrow={VOICE.fontes.eyebrow}
        title="Fontes"
        lede={VOICE.fontes.lede}
        marquee={[
          "TSE primeiro",
          "Link na mão",
          "Nada inventado",
          "Você confere",
        ]}
        meta={[
          { k: String(CANDIDATES.length), v: "Chapas no site" },
          { k: String(TSE_PLAN_MAP.length), v: "Planos mapeados" },
          { k: String(PRESS_OUTLETS.length), v: "Veículos" },
          { k: String(IMAGE_SOURCE_BANKS.length), v: "Bancos de foto" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          Princípios
        </h2>
        <ul className="mt-4 space-y-2">
          {EDITORIAL_PRINCIPLES.map((p) => (
            <li key={p} className="text-sm font-medium leading-relaxed">
              • {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          Quando abrimos uma página
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Se o tema precisa de contexto, a gente cria a página. Notícia curta
          vai para o feed Agora. Caso grande (nível Vorcaro) vai para Casos.
          Conceito ou plano vai para o Glossário. O critério evita panfleto; a
          profundidade evita página rala.
        </p>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em]">
          Escopo das notícias curtas
        </p>
        <ul className="mt-2 space-y-2">
          {NEWS_POST_SCOPE.map((p) => (
            <li key={p} className="text-sm font-medium leading-relaxed">
              • {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          Entrada
        </p>
        <ul className="mt-2 space-y-2">
          {NEWS_PAGE_CRITERIA.map((p) => (
            <li key={p} className="text-sm font-medium leading-relaxed">
              • {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          O que a página precisa entregar
        </p>
        <ul className="mt-2 space-y-2">
          {NEWS_PAGE_DEPTH.map((p) => (
            <li key={p} className="text-sm font-medium leading-relaxed">
              • {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          1. Candidaturas deferidas (TSE)
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          {TSE_CANDIDATURAS_TITLE}. Lista das {CANDIDATES.length} chapas com
          registro aprovado (incluindo vices). A chapa Pablo Marçal / Leonardo
          Avalanche (PRTB) foi indeferida e não aparece no site como candidatura
          ativa.
        </p>
        <p className="mt-4">
          <a
            href={TSE_CANDIDATURAS_URL}
            target="_blank"
            rel="noreferrer"
            className="lupa-text-link break-all text-sm font-bold"
          >
            {TSE_CANDIDATURAS_URL}
          </a>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          Chapas no site
        </h2>
        <p className="mt-2 text-sm font-medium text-[#555]">
          As 12 chapas deferidas pelo TSE. A ordem da notícia oficial está na
          fonte acima.
        </p>
        <div className="mt-6 overflow-x-auto border-2 border-black">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b-2 border-black bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  Presidente
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  Partido
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  Vice
                </th>
              </tr>
            </thead>
            <tbody>
              {candidatesAlphabetical().map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-black last:border-b-0"
                >
                  <td className="px-4 py-3 font-semibold">
                    <Link
                      href={`/candidatos/${c.slug}`}
                      className="lupa-text-link"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{c.party}</td>
                  <td className="px-4 py-3">
                    {c.vice
                      ? `${c.vice}${c.viceParty ? ` (${c.viceParty})` : ""}`
                      : "n/d"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          2. Planos de governo (Dados Abertos TSE)
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          {TSE_PLANS_TITLE}.
        </p>
        <p className="mt-4">
          <a
            href={TSE_PLANS_URL}
            target="_blank"
            rel="noreferrer"
            className="lupa-text-link break-all text-sm font-bold"
          >
            {TSE_PLANS_URL}
          </a>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          Arquivos de plano mapeados
        </h2>
        <div className="mt-6 overflow-x-auto border-2 border-black">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b-2 border-black bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  Candidato
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  SQ TSE
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide">
                  Arquivo
                </th>
              </tr>
            </thead>
            <tbody>
              {TSE_PLAN_MAP.map((plan) => {
                const c = getCandidateById(plan.candidateId);
                return (
                  <tr
                    key={plan.sqCandidato}
                    className="border-b border-black last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold">
                      {c?.name ?? plan.identifiedAs}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {plan.sqCandidato}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {plan.fileName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          3. Arquivos do pacote não usados
        </h2>
        <ul className="mt-4 space-y-4">
          {TSE_UNMAPPED_PLANS.map((p) => (
            <li key={p.sqCandidato} className="text-sm">
              <p className="font-mono text-xs font-bold">{p.fileName}</p>
              <p className="mt-1 font-medium text-[#444]">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          4. Análises por IA
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Extratos factuais por área a partir do texto dos PDFs oficiais. A IA
          é instruída a não inventar propostas, não usar conhecimento externo e
          não criticar nem defender candidatos. Não substitui a leitura do
          plano. Não é opinião do Lupa do Brasil.
        </p>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          5. Pautas em destaque
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Debates públicos usados só como lente de leitura dos planos: verificamos
          o que cada documento diz (ou não diz). Não são critérios de endosso
          nem ranking.
        </p>
        <ul className="mt-4 space-y-3">
          {HOT_AGENDAS.map((a) => (
            <li key={a.id} className="text-sm">
              <p className="font-semibold">
                {a.label}{" "}
                <span className="font-medium text-[#666]">· {a.group}</span>
              </p>
              <p className="mt-0.5 font-medium text-[#444]">{a.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          6. Cobertura na imprensa
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Só entram manchetes que pesam no voto: pesquisa com número, polêmica,
          investigação e ato com repercussão. Rotina de agenda e fluff ficam de
          fora. A matéria original fica linkada em cada card.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRESS_OUTLETS.map((o) => (
            <li key={o.id} className="text-sm">
              <a
                href={o.homeUrl}
                target="_blank"
                rel="noreferrer"
                className="lupa-text-link"
              >
                {o.label}
              </a>{" "}
              <span className="font-medium text-[#666]">· {o.domain}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="fichas" className="mt-8 scroll-mt-28 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          7. Fichas dos candidatos
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Bio, formação e trajetória nas páginas de candidato usam as fontes
          abaixo. A ficha fica limpa; a lista completa mora aqui.
        </p>
        <ul className="mt-4 space-y-2">
          {Array.from(
            new Map(
              candidatesAlphabetical()
                .flatMap((c) => c.bioSources ?? [])
                .map((s) => [s.url, s] as const),
            ).values(),
          ).map((s) => (
            <li key={s.url} className="text-sm">
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="lupa-text-link break-all font-bold"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="noticias-glossario"
        className="mt-8 scroll-mt-28 border-2 border-black p-6 sm:p-8"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          8. Casos e Glossário
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          <Link
            href="/noticias"
            className="lupa-text-link font-bold"
          >
            /noticias
          </Link>{" "}
          (Casos) guarda dossiês grandes: frentes, linha do tempo, quem aparece.{" "}
          <Link
            href="/glossario"
            className="lupa-text-link font-bold"
          >
            /glossario
          </Link>{" "}
          guarda conceitos e planos/políticas para consulta. Não são
          investigação própria nem veredicto editorial. Termos nos planos
          viram link com preview no hover. Links originais, por página:
        </p>
        <ul className="mt-4 space-y-3">
          {[...EXPLAINERS]
            .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"))
            .map((e) => (
              <li key={e.slug} className="text-sm">
                <p className="font-semibold">
                  <Link
                    href={
                      e.kind === "caso"
                        ? `/noticias/${e.slug}`
                        : `/glossario/${e.slug}`
                    }
                    className="lupa-text-link"
                  >
                    {e.title}
                  </Link>{" "}
                  <span className="font-medium text-[#666]">
                    · {EXPLAINER_KIND_LABEL[e.kind]}
                  </span>
                </p>
                <ul className="mt-1 space-y-1">
                  {e.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="lupa-text-link break-all text-xs font-bold"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </section>

      <section id="fotos" className="mt-8 scroll-mt-28 border-2 border-black p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
          9. Fotos e bancos de imagem
        </h2>
        <p className="mt-4 text-sm font-medium leading-relaxed">
          Capas, retratos e ambientação vêm de bancos públicos com licença ou
          crédito claros. Tudo vira P&B no Lupa. A lista abaixo é o mapa de onde
          a gente puxa; os créditos específicos ficam em cada página e aqui.
        </p>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          Bancos que usamos
        </p>
        <ul className="mt-2 space-y-3">
          {IMAGE_SOURCE_BANKS.map((b) => (
            <li key={b.id} className="text-sm">
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="lupa-text-link font-semibold"
              >
                {b.label}
              </a>
              <p className="mt-0.5 font-medium text-[#444]">{b.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          Critério para aceitar uma foto
        </p>
        <ul className="mt-2 space-y-2">
          {IMAGE_SOURCE_RULES.map((r) => (
            <li key={r} className="text-sm font-medium leading-relaxed">
              • {r}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          Capas e ambientação
        </p>
        <ul className="mt-2 space-y-3">
          {EDITORIAL_IMAGE_CREDITS.map((p) => (
            <li key={p.id} className="text-sm">
              <p className="font-semibold">{p.path}</p>
              <p className="mt-0.5 font-medium text-[#444]">{p.credit}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="lupa-text-link mt-1 inline-block break-all text-xs font-bold"
              >
                {p.url}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]">
          Retratos de candidatos
        </p>
        <ul className="mt-2 space-y-3">
          {PHOTO_CREDITS.map((p) => {
            const c = getCandidateById(p.candidateId);
            return (
              <li key={p.candidateId} className="text-sm">
                <p className="font-semibold">{c?.name ?? p.candidateId}</p>
                <p className="mt-0.5 font-medium text-[#444]">{p.credit}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="lupa-text-link mt-1 inline-block break-all text-xs font-bold"
                >
                  {p.url}
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-10 text-xs font-bold uppercase tracking-widest text-[#666]">
        Conteúdo informativo · Não é propaganda eleitoral
      </p>
      </div>
    </div>
  );
}
