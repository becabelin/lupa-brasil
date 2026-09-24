import type { TopicId } from "@/data/topics";
import type { AgendaId } from "@/data/agendas";

export type TopicAnalysis = {
  topicId: TopicId;
  summary: string;
  proposals: string[];
  quotes: string[];
  depth: "alto" | "medio" | "baixo" | "ausente";
};

export type AgendaAnalysis = {
  agendaId: AgendaId;
  summary: string;
  proposals: string[];
  quotes: string[];
  depth: "alto" | "medio" | "baixo" | "ausente";
};

export type PlanAnalysis = {
  candidateId: string;
  overview: string;
  priorities: string[];
  strengths: string[];
  gaps: string[];
  topics: TopicAnalysis[];
  /** Pautas contemporâneas: o que o plano diz (ou não) sobre debates públicos. */
  agendas?: AgendaAnalysis[];
  analyzedAt: string;
  sourceFileName: string;
};

export type UploadedDocument = {
  candidateId: string;
  fileName: string;
  storedName: string;
  uploadedAt: string;
  textLength: number;
};

export type StoreData = {
  documents: UploadedDocument[];
  analyses: PlanAnalysis[];
};
