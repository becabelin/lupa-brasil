/**
 * Mapeamento SQ_CANDIDATO (TSE) → candidato com registro deferido.
 * Planos: https://dadosabertos.tse.jus.br/dataset/candidatos-2026/resource/433ac1f4-07dc-44a2-bcbe-c87a2073721a
 * Chapas: notícia TSE 11/09/2026 (12 candidaturas).
 */
import { TSE_PLANS_URL } from "./sources";

export const TSE_SOURCE_URL = TSE_PLANS_URL;

export const TSE_PLAN_MAP: {
  candidateId: string;
  sqCandidato: string;
  fileName: string;
  identifiedAs: string;
}[] = [
  {
    candidateId: "lula",
    sqCandidato: "280002542548",
    fileName: "2026BR280002542548_01.pdf",
    identifiedAs: "Programa PT / Lula",
  },
  {
    candidateId: "flavio-bolsonaro",
    sqCandidato: "280002551544",
    fileName: "2026BR280002551544_01.pdf",
    identifiedAs: "Flávio Bolsonaro (PL)",
  },
  {
    candidateId: "ronaldo-caiado",
    sqCandidato: "280002551932",
    fileName: "2026BR280002551932_01.pdf",
    identifiedAs: "Ronaldo Caiado (PSD)",
  },
  {
    candidateId: "romeu-zema",
    sqCandidato: "280002539826",
    fileName: "2026BR280002539826_01.pdf",
    identifiedAs: "Romeu Zema (Novo)",
  },
  {
    candidateId: "renan-santos",
    sqCandidato: "280002540694",
    fileName: "2026BR280002540694_01.pdf",
    identifiedAs: "Livro Amarelo · Missão / Renan Santos",
  },
  {
    candidateId: "augusto-cury",
    sqCandidato: "280002551547",
    fileName: "2026BR280002551547_01.pdf",
    identifiedAs: "Augusto Cury (Avante)",
  },
  {
    candidateId: "rui-costa-pimenta",
    sqCandidato: "280002552487",
    fileName: "2026BR280002552487_01.pdf",
    identifiedAs: "PCO / Rui Costa Pimenta",
  },
  {
    candidateId: "samara-martins",
    sqCandidato: "280002538811",
    fileName: "2026BR280002538811_01.pdf",
    identifiedAs: "Unidade Popular / Samara Martins",
  },
  {
    candidateId: "hertz-dias",
    sqCandidato: "280002541457",
    fileName: "2026BR280002541457_01.pdf",
    identifiedAs: "PSTU / Hertz Dias",
  },
  {
    candidateId: "edmilson-costa",
    sqCandidato: "280002551975",
    fileName: "2026BR280002551975_01.pdf",
    identifiedAs: "PCB / Edmilson Costa",
  },
  {
    candidateId: "wilson-grassi",
    sqCandidato: "280002548139",
    fileName: "2026BR280002548139_01.pdf",
    identifiedAs: "Democrata / Wilson Grassi",
  },
  {
    candidateId: "clariana-barao",
    sqCandidato: "280002552484",
    fileName: "2026BR280002552484_01.pdf",
    identifiedAs:
      "Proteger Hoje, Transformar o Amanhã · Democracia Cristã / Clariana Barão",
  },
];

/** Planos no pacote TSE sem chapa deferida ou sem vínculo confirmado. */
export const TSE_UNMAPPED_PLANS = [
  {
    sqCandidato: "280002553884",
    fileName: "2026BR280002553884_01.pdf",
    note: "Plano de Pablo Marçal (PRTB). TSE indeferiu o registro da chapa Marçal / Avalanche (11/09/2026).",
  },
  {
    sqCandidato: "280002554479",
    fileName: "2026BR280002554479_01.pdf",
    note: "Plano vinculado a Leonardo Avalanche (PRTB). Chapa indeferida pelo TSE e não consta entre as 12 candidaturas deferidas.",
  },
] as const;
