import type { TopicAnalysis } from "@/lib/types";
import { getTopic } from "@/data/topics";
import { LinkedText } from "@/components/linked-text";
import { PlanQuoteLine, PlanQuotes } from "@/components/plan-quotes";
import { PLAN_DEPTH_LABEL } from "@/lib/plan-depth";

type Props = {
  topic: TopicAnalysis;
  onOpen?: () => void;
  /** Compact card (lista) vs conteúdo completo (modal). */
  variant?: "card" | "full";
};

export function TopicBlock({ topic, onOpen, variant = "card" }: Props) {
  const meta = getTopic(topic.topicId);
  const previewProposals = topic.proposals.slice(0, 3);
  const previewQuote = topic.quotes[0];
  const hasMore =
    topic.proposals.length > 3 ||
    topic.quotes.length > 0 ||
    topic.summary.length > 180;
  const claimsCoverage = topic.depth !== "ausente";

  if (variant === "full") {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight sm:text-3xl">
            {meta?.label ?? topic.topicId}
          </h3>
          <span className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
            {PLAN_DEPTH_LABEL[topic.depth]}
          </span>
        </div>
        {meta?.description ? (
          <p className="text-xs font-medium uppercase tracking-wider text-[#666]">
            {meta.description}
          </p>
        ) : null}
        <p className="text-base font-medium leading-relaxed text-[#222]">
          <LinkedText text={topic.summary} />
        </p>

        {topic.quotes.length > 0 ? (
          <PlanQuotes quotes={topic.quotes} />
        ) : claimsCoverage ? (
          <p className="text-sm font-medium leading-relaxed text-[#666]">
            Esta análise ainda não trouxe o trecho literal do PDF que fundamenta
            o resumo. Sem citação, o Lupa não aponta a página.
          </p>
        ) : null}

        {topic.proposals.length > 0 ? (
          <div className={topic.quotes.length > 0 ? "border-t-2 border-black pt-4" : undefined}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Propostas no plano
            </h4>
            <ul className="mt-3 space-y-3">
              {topic.proposals.map((p) => (
                <li
                  key={p}
                  className="flex gap-3 text-sm font-medium leading-relaxed before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:bg-black before:content-['']"
                >
                  <LinkedText text={p} />
                </li>
              ))}
            </ul>
          </div>
        ) : claimsCoverage ? (
          <p className="text-sm font-medium text-[#666]">
            Nenhuma proposta concreta listada nesta área. O que há no documento
            está nos trechos acima, quando disponíveis.
          </p>
        ) : (
          <p className="text-sm font-medium text-[#666]">
            Área sem menção identificada no documento analisado.
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full border-2 border-black bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight sm:text-2xl">
          {meta?.label ?? topic.topicId}
        </h3>
        <span className="border border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
          {PLAN_DEPTH_LABEL[topic.depth]}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#333]">
        {topic.summary}
      </p>
      {previewProposals.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {previewProposals.map((p) => (
            <li
              key={p}
              className="flex gap-2 text-sm font-medium text-[#222] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:bg-black before:content-['']"
            >
              <span className="line-clamp-1">{p}</span>
            </li>
          ))}
        </ul>
      ) : previewQuote ? (
        <div className="mt-4">
          <PlanQuoteLine quote={previewQuote} />
        </div>
      ) : null}
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2 group-hover:bg-black group-hover:text-white group-hover:no-underline">
        {hasMore || topic.proposals.length > 0 || topic.quotes.length > 0
          ? "Ver detalhes →"
          : "Abrir área →"}
      </p>
    </button>
  );
}
