import type { CaseInvestigation } from "./types";
import { VORCARO_INVESTIGATION } from "./vorcaro";

export type {
  CaseInvestigation,
  InvestigationChat,
  InvestigationEvidence,
  InvestigationEvent,
  InvestigationGalleryPhoto,
  InvestigationPerson,
  InvestigationPlace,
} from "./types";

const BY_SLUG: Record<string, CaseInvestigation> = {
  "caso-vorcaro-master-turma-kn": VORCARO_INVESTIGATION,
};

export function getInvestigation(
  slug: string,
): CaseInvestigation | undefined {
  return BY_SLUG[slug];
}

export function hasInvestigation(slug: string): boolean {
  return slug in BY_SLUG;
}

export function investigationSlugs(): string[] {
  return Object.keys(BY_SLUG);
}
