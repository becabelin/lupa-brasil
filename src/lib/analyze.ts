import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { HOT_AGENDAS, type AgendaId } from "@/data/agendas";
import { TOPICS, type TopicId } from "@/data/topics";
import type { PlanAnalysis } from "./types";
import { unwrapQuoteList } from "./text";
import { normalizeCoverage } from "./plan-depth";

const topicIds = TOPICS.map((t) => t.id) as [TopicId, ...TopicId[]];
const agendaIds = HOT_AGENDAS.map((a) => a.id) as [AgendaId, ...AgendaId[]];

const depthEnum = z
  .enum(["alto", "medio", "baixo", "ausente"])
  .describe(
    "alto=medidas detalhadas; medio=alguma medida; baixo=menção genérica; ausente=não aborda.",
  );

/**
 * Esquema descritivo, sem juízo de valor.
 * strengths = cobertura mais detalhada no documento (não “mérito”).
 * gaps = temas pouco ou nada tratados no documento (não “falha moral”).
 */
const analysisSchema = z.object({
  overview: z
    .string()
    .describe(
      "Resumo factual do que o documento apresenta (4 a 7 frases). Estruture o que o plano cobre e como organiza as propostas. Só o que está no texto. Sem adjetivos valorativos.",
    ),
  priorities: z
    .array(z.string())
    .max(8)
    .describe(
      "Eixos ou propostas que o próprio plano destaca com mais espaço/ênfase. Frases concretas e rastreáveis no texto.",
    ),
  strengths: z
    .array(z.string())
    .max(6)
    .describe(
      "Áreas em que o documento traz mais detalhe ou medidas concretas. Descreva a cobertura, não elogie o candidato.",
    ),
  gaps: z
    .array(z.string())
    .max(6)
    .describe(
      "Áreas temáticas ausentes ou só genéricas no documento. Liste a ausência, não critique a pessoa ou o partido.",
    ),
  topics: z.array(
    z.object({
      topicId: z.enum(topicIds),
      summary: z
        .string()
        .describe(
          "Parágrafo factual (3 a 6 frases) sobre o que o plano diz nesta área. Se ausente, diga isso de forma neutra.",
        ),
      proposals: z
        .array(z.string())
        .max(12)
        .describe(
          "Medidas CONCRETAS do texto. Prefira 5 a 12 se depth alto/médio. Cada item = uma ação específica, não slogan.",
        ),
      quotes: z
        .array(z.string())
        .max(6)
        .describe(
          "Trechos literais do documento (até ~40 palavras). Obrigatório ≥1 se depth baixo/medio/alto. Sem citação fiel → depth ausente.",
        ),
      depth: depthEnum,
    }),
  ),
  agendas: z.array(
    z.object({
      agendaId: z.enum(agendaIds),
      summary: z
        .string()
        .describe(
          "O que o plano diz sobre esta pauta contemporânea (2 a 5 frases). Se não aborda, declare ausência de forma neutra.",
        ),
      proposals: z
        .array(z.string())
        .max(8)
        .describe(
          "Medidas concretas do texto ligadas a esta pauta. Vazio se ausente. Não invente.",
        ),
      quotes: z
        .array(z.string())
        .max(4)
        .describe(
          "Trechos literais curtos. Obrigatório ≥1 se depth baixo/medio/alto. Sem citação fiel → depth ausente.",
        ),
      depth: depthEnum,
    }),
  ),
});

function getModel() {
  return openai(process.env.AI_MODEL || "gpt-4o-mini");
}

const SYSTEM_PROMPT = `Você extrai e organiza o conteúdo de planos de governo oficiais para um site informativo imparcial (Lupa do Brasil).

PAPEL
- Você NÃO é comentarista, crítico, assessor nem militante.
- Você NÃO defende, elogia, critica, ironiza ou relativiza o candidato, o partido ou a ideologia.
- Você NÃO compara com outros candidatos, governos ou “o que seria melhor”.
- Você NÃO usa conhecimento externo sobre a pessoa, o partido, pesquisas ou notícias.
- Sua única fonte é o texto do documento fornecido.

ANTI-ALUCINAÇÃO (obrigatório)
- Só afirme o que está escrito no plano. Se não estiver no texto, não diga.
- Não invente números, datas, programas, leis, orçamentos, nomes de políticas ou trechos.
- Não complete lacunas com “provavelmente”, “implicitamente” ou o que “o partido costuma defender”.
- Citações (quotes) devem ser literais e curtas, SEM aspas envolventes no valor do campo; se não puder citar fielmente, deixe a lista vazia.
- Se depth for "baixo", "medio" ou "alto": inclua AO MENOS 1 quote literal que fundamente o summary (de onde veio a afirmação). Sem trecho fiel → depth "ausente" e summary só declara ausência.
- Em dúvida, prefira depth "ausente" ou "baixo" e proposals/quotes vazios a inventar.
- Quando o tema EXISTE no texto: seja específico (o quê, para quem, com qual mecanismo, se o texto disser).
- Formato BOM de proposal: "Criar programa X para Y com medida Z citada no texto".
- Formato RUIM (proibido): "Investir em educação" / "Melhorar a saúde" (slogan, não extrato).
- Se o PDF só tiver slogans genéricos, use depth "baixo", poucas proposals e quotes literais desses slogans; não invente detalhe.

PAUTAS CONTEMPORÂNEAS (agendas)
- São lentes de leitura, não pedidos de opinião.
- Para cada pauta, diga APENAS o que o documento afirma (ou declare ausência).
- Não diga o que o candidato “deveria” propor; não use o debate público para preencher lacunas.

TOM
- Linguagem neutra, descritiva, informativa.
- Evite adjetivos valorativos.
- Não use travessão (—); prefira vírgula, dois-pontos ou ponto.
- Prefira densidade factual a generalidades.`;

export async function analyzeGovernmentPlan(params: {
  candidateId: string;
  candidateName: string;
  party: string;
  sourceFileName: string;
  documentText: string;
}): Promise<PlanAnalysis> {
  const topicList = TOPICS.map((t) => `- ${t.id}: ${t.label} (${t.description})`).join(
    "\n",
  );
  const agendaList = HOT_AGENDAS.map(
    (a) =>
      `- ${a.id}: ${a.label}, ${a.description} (buscar no texto: ${a.lookFor})`,
  ).join("\n");

  const text = params.documentText.slice(0, 120_000);

  const { object } = await generateObject({
    model: getModel(),
    schema: analysisSchema,
    temperature: 0,
    system: SYSTEM_PROMPT,
    prompt: `Extraia do plano oficial abaixo uma síntese puramente factual e imparcial.

Identificação (só para contexto do extrato; não use biografia externa):
- Candidato: ${params.candidateName} (${params.party})
- Arquivo: ${params.sourceFileName}
- Fonte do documento: Dados Abertos TSE

Campos:
- overview: 4 a 7 frases factuais sobre o que o documento apresenta e como se organiza.
- priorities / strengths / gaps: cobertura documental (não elogio nem ataque).
- topics: um item para CADA área abaixo (mesmo se ausente).
  - summary: 3 a 6 frases; proposals concretas; quotes literais obrigatórios se depth ≠ ausente.
- agendas: um item para CADA pauta contemporânea abaixo (mesmo se ausente).
  - Use as palavras-chave só como guia de busca no texto; não invente menções.
  - Se o plano não fala da pauta, depth "ausente".
  - Se depth ≠ ausente, quotes com trecho literal que mostre de onde veio a afirmação.

Áreas temáticas:
${topicList}

Pautas contemporâneas (lentes de leitura):
${agendaList}

Texto do plano (única fonte permitida):
"""
${text}
"""`,
  });

  const byTopic = new Map(object.topics.map((t) => [t.topicId, t]));
  const topics = TOPICS.map((t) => {
    const existing = byTopic.get(t.id);
    if (existing) {
      return normalizeCoverage({
        ...existing,
        quotes: unwrapQuoteList(existing.quotes),
      });
    }
    return {
      topicId: t.id,
      summary: "Tema não identificado no documento analisado.",
      proposals: [] as string[],
      quotes: [] as string[],
      depth: "ausente" as const,
    };
  });

  const byAgenda = new Map(object.agendas.map((a) => [a.agendaId, a]));
  const agendas = HOT_AGENDAS.map((a) => {
    const existing = byAgenda.get(a.id);
    if (existing) {
      return normalizeCoverage({
        ...existing,
        quotes: unwrapQuoteList(existing.quotes),
      });
    }
    return {
      agendaId: a.id,
      summary: "Pauta não identificada no documento analisado.",
      proposals: [] as string[],
      quotes: [] as string[],
      depth: "ausente" as const,
    };
  });

  return {
    candidateId: params.candidateId,
    overview: object.overview,
    priorities: object.priorities,
    strengths: object.strengths,
    gaps: object.gaps,
    topics,
    agendas,
    analyzedAt: new Date().toISOString(),
    sourceFileName: params.sourceFileName,
  };
}
