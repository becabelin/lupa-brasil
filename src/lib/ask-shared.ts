export type AskCitation = {
  id: string;
  title: string;
  href: string;
  note: string;
};

export type AskResult = {
  answer: string;
  grounded: boolean;
  citations: AskCitation[];
  contextCount: number;
};

/** Exemplos públicos (ordem fixa, sem favoritos). */
export const ASK_EXAMPLES = [
  "O plano do Lula fala de big techs ou IA?",
  "O que é o FGC?",
  "Quem aparece no caso Vorcaro?",
  "O que o plano do Romeu Zema diz sobre segurança?",
] as const;
